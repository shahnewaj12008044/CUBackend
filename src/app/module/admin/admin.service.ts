// src/modules/admin/admin.service.ts

import mongoose from 'mongoose';
import { IAdmin } from './admin.interface';
import { Admin, AdminInvite } from './admin.model';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status-codes';
import { sendMail } from '../../utils/sendMail';
import QueryBuilder from '../../builder/QueryBuilder';
import crypto from 'crypto';
import inviteAdminHtml from '../../Templates/adminInvite';
import { flattenNestedObject } from './admin.utils';
import { Post } from '../posts/post.model';

// Fields that are allowed to be searched via text search
// ✅ Fix — define and pass searchable fields
const adminSearchableFields = ['name.firstName', 'name.lastName', 'contactNo', 'designation'];

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(
    Admin.find().populate('userId'),
    query
  )
    .search(adminSearchableFields)  // ✅ pass the array
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();

  return { meta, result };
};
// ─────────────────────────────────────────────
// GET SINGLE ADMIN BY ID
// ─────────────────────────────────────────────
const getAdminByIdFromDB = async (id: string) => {
  const admin = await Admin.findOne({ adminId: id}).populate('userId');

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  return admin;
};

// ─────────────────────────────────────────────
// UPDATE ADMIN  (partial update, nested name support)
// ─────────────────────────────────────────────
// const updateAdminInDB = async (id: string, payload: Partial<IAdmin>) => {
//   // Destructure nested objects that need dot-notation flattening
//   const { name, ...remainingAdminData } = payload;

//   const modifiedUpdateData: Record<string, unknown> = { ...remainingAdminData };

//   // Flatten nested `name` fields to avoid overwriting sibling fields
//   // e.g. { name: { firstName: 'John' } } → { 'name.firstName': 'John' }
//   if (name && Object.keys(name).length) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdateData[`name.${key}`] = value;
//     }
//   }

//   const updatedAdmin = await Admin.findOneAndUpdate(
//     { adminId: id },
//     { $set: modifiedUpdateData },
//     { new: true, runValidators: true },
//   );

//   if (!updatedAdmin) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
//   }

//   return updatedAdmin;
// };

const updateMeInDB = async (id: string, payload: Partial<IAdmin>) => {
  const { name, ...remainingData } = payload;

  const flattenedData = flattenNestedObject(
    'name',
    name as Record<string, unknown>,
    remainingData as Record<string, unknown>,
  );

  const updatedAdmin = await Admin.findOneAndUpdate(
    { adminId: id },
    { $set: flattenedData }, // ✅ always use $set for partial updates
    { new: true, runValidators: true },
  );

  if (!updatedAdmin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  return updatedAdmin;
};
// ─────────────────────────────────────────────
// DELETE ADMIN  (soft delete — cascades to User)
// ─────────────────────────────────────────────
const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Soft-delete the Admin profile
    const deletedAdmin = await Admin.findOneAndUpdate(
      {adminId:id},
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    // 2. Soft-delete the linked auth User as well
    const deletedUser = await User.findOneAndUpdate(
      deletedAdmin.userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete linked user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

 // your email utility

// ── INVITE ────────────────────────────────────────────────────────────────────
// inside admin.service.ts




const inviteAdminIntoDB = async (inviterCustomId: string, email: string) => {
  // Resolve real MongoDB _id from custom string id
  const inviter = await User.findOne({ id: inviterCustomId });
  if (!inviter) {
    throw new AppError(httpStatus.NOT_FOUND, 'Inviter not found');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'A user already exists with this email');
  }

  const existingInvite = await AdminInvite.findOne({ email, isUsed: false });
  if (existingInvite) {
    throw new AppError(httpStatus.CONFLICT, 'An active invite already exists for this email');
  }

  const token = crypto.randomBytes(32).toString('hex');

  await AdminInvite.create({
    email,
    token,
    invitedBy: inviter._id, // ✅ real ObjectId now
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const inviteLink = `${process.env.FRONTEND_URL}/admin/register?token=${token}`;

  await sendMail(
    email,
    'You are invited to join COBIANS as an Admin',
    `Complete your registration here: ${inviteLink} — expires in 24 hours.`,
    inviteAdminHtml(inviteLink),
  );

  return {
    message: `Invite sent to ${email}`,
    devToken: process.env.NODE_ENV === 'development' ? token : undefined,
  };
};


const registerAdminViaInviteIntoDB = async (payload: {
  token: string;
  password: string;
  admin: IAdmin;
}) => {
  const { token, password, admin } = payload;

  // 1. Validate the token
  const invite = await AdminInvite.findOne({ token, isUsed: false });

  if (!invite) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired invite link');
  }

  if (invite.expiresAt < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invite link has expired');
  }

  // 2. Ensure email matches (prevent token sharing)
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const createdUsers = await User.create(
      [
        {
          id: admin.adminId,
          email: invite.email, // always use email from the invite, not from body
          password,
          role: 'admin',
          status: 'active',
          isDeleted: false,
          isVerified: true, // auto-verified since they clicked the email link
        },
      ],
      { session },
    );

    const createdAdmins = await Admin.create(
      [
        {
          ...admin,
          userId: createdUsers[0]._id,
        },
      ],
      { session },
    );

    // 3. Mark invite as used
    await AdminInvite.findByIdAndUpdate(
      invite._id,
      { isUsed: true },
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return { user: createdUsers[0], admin: createdAdmins[0] };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};


//  ─── GET ALL POSTS (admin view — all statuses) ────────────────────────────────

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find().populate('author', 'email'),  // no status filter — admin sees all
    query,
  )
    .search(['title', 'description', 'tags', 'type'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();
  return { meta, result };
};

//! ─── GET PENDING POSTS ────────────────────────────────────────────────────────

const getPendingPostsFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find({ status: 'pending' }).populate('author', 'email'),
    query,
  )
    .sort()
    .paginate();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();
  return { meta, result };
};

//! ─── APPROVE POST ─────────────────────────────────────────────────────────────

const approvePostInDB = async (postId: string, customUserId: string) => {
  const admin = await User.findOne({ id: customUserId });
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.status !== 'pending') {
    throw new AppError(httpStatus.BAD_REQUEST, `Post is already ${post.status}`);
  }

  return await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        status: 'approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    },
    { new: true },
  );
};

//! ─── REJECT POST ──────────────────────────────────────────────────────────────

const rejectPostInDB = async (
  postId: string,
  customUserId: string,
  rejectionReason: string,
) => {
  const admin = await User.findOne({ id: customUserId });
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.status !== 'pending') {
    throw new AppError(httpStatus.BAD_REQUEST, `Post is already ${post.status}`);
  }

  return await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        status: 'rejected',
        rejectionReason,
        approvedBy: null,
        approvedAt: null,
      },
    },
    { new: true },
  );
};

// ─── ADMIN DELETE ANY POST ────────────────────────────────────────────────────

const adminDeletePostFromDB = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  await Post.findByIdAndUpdate(postId, { $set: { isDeleted: true } });
};



// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────
export const AdminServices = {

  getAllAdminsFromDB,
  getAdminByIdFromDB,
  // updateAdminInDB,
  deleteAdminFromDB,
  inviteAdminIntoDB,
  registerAdminViaInviteIntoDB,
  updateMeInDB,
  getAllPostsFromDB,
  getPendingPostsFromDB,
  approvePostInDB,
  rejectPostInDB,
  adminDeletePostFromDB,
};