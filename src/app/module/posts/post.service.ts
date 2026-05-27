import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { Post } from './post.model';
import { IPost } from './post.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { postSearchableFields } from './post.constants';

import config from '../../config';
import { sendMail } from '../../utils/sendMail';

// ─── helpers ──────────────────────────────────────────────────────────────────

// notify all admins by email when a post needs approval
const notifyAdminsForApproval = async (
  postId: string,
  authorName: string,
  action: 'created' | 'edited',
) => {
  // get all admin emails
  const admins = await User.find({ role: 'admin' }).select('email');
  const adminEmails = admins.map((a) => a.email);

  if (!adminEmails.length) return;

  const subject = `Post ${action} — approval required`;
  const html = `
    <p>A post has been <strong>${action}</strong> by <strong>${authorName}</strong> and is waiting for your approval.</p>
    <p>Post ID: <strong>${postId}</strong></p>
    <p>
      <a href="${config.frontend_url}/admin/posts/pending" 
         style="padding:10px 20px;background:#4F46E5;color:#fff;border-radius:6px;text-decoration:none;">
        Review Post
      </a>
    </p>
    <p>This post will remain pending until approved or rejected.</p>
  `;

  // fire emails concurrently — don't block the response
  await Promise.allSettled(
    adminEmails.map((email) =>
      sendMail(email, subject, `Post ${action} by ${authorName} — approval needed`, html),
    ),
  );
};

// ─── CREATE POST ──────────────────────────────────────────────────────────────

const createPostIntoDB = async (
  customUserId: string,
  payload: Pick<IPost, 'type' | 'title' | 'description' | 'media' | 'tags'>,
) => {
  // resolve User ObjectId + name from custom id
  const user = await User.findOne({ id: customUserId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const post = await Post.create({
    ...payload,
    author: user._id,
    authorRole: user.role,   // ✅ derived from req.user, not client body
    status: 'pending',       // always starts pending
  });

  // notify admins async — don't await in the critical path
  notifyAdminsForApproval(
    post._id.toString(),
    user.email,
    'created',
  ).catch(() => {}); // silent fail — email shouldn't break post creation

  return post;
};

// ─── GET ALL POSTS ────────────────────────────────────────────────────────────

const getAllPostsFromDB = async (
  query: Record<string, unknown>,
  userRole: string,
) => {
  // admins see all statuses, others see only approved
  const baseFilter =
    userRole === 'admin' ? {} : { status: 'approved' };

  const postQuery = new QueryBuilder(
    Post.find(baseFilter).populate('author', 'email'),
    query,
  )
    .search(postSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();
  return { meta, result };
};

// ─── GET PENDING POSTS (admin only) ──────────────────────────────────────────

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

// ─── GET SINGLE POST ──────────────────────────────────────────────────────────

const getSinglePostFromDB = async (
  postId: string,
  userRole: string,
) => {
  const post = await Post.findById(postId).populate('author', 'email');

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // non-admins can only see approved posts
  if (userRole !== 'admin' && post.status !== 'approved') {
    throw new AppError(httpStatus.FORBIDDEN, 'This post is not available');
  }

  return post;
};

// ─── UPDATE POST ──────────────────────────────────────────────────────────────

const updatePostInDB = async (
  postId: string,
  customUserId: string,
  payload: Partial<Pick<IPost, 'type' | 'title' | 'description' | 'media' | 'tags'>>,
) => {
  const user = await User.findOne({ id: customUserId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // only the author can edit their own post
  if (post.author.toString() !== user._id.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'You can only edit your own posts');
  }

  const updated = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        ...payload,
        status: 'pending',    // ✅ goes back to pending on every edit
        approvedBy: null,
        approvedAt: null,
        rejectionReason: null,
      },
    },
    { new: true, runValidators: true },
  );

  // notify admins about the edit
  notifyAdminsForApproval(
    postId,
    user.email,
    'edited',
  ).catch(() => {});

  return updated;
};

// ─── DELETE POST ──────────────────────────────────────────────────────────────

const deletePostFromDB = async (
  postId: string,
  customUserId: string,
  userRole: string,
) => {
  const user = await User.findOne({ id: customUserId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // admin can delete any post, author can only delete their own
  const isAdmin = userRole === 'admin';
  const isAuthor = post.author.toString() === user._id.toString();

  if (!isAdmin && !isAuthor) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to delete this post');
  }

  // soft delete
  await Post.findByIdAndUpdate(postId, { $set: { isDeleted: true } });
};



export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPendingPostsFromDB,
  getSinglePostFromDB,
  updatePostInDB,
  deletePostFromDB,

};