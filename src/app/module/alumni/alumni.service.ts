import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import Alumni from './alumni.model';
import { IAlumni } from './alumni.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { alumniSearchableFields } from './alumni.constants';

// ── GET ALL — admin/alumni browsing ──
const getAllAlumniFromDB = async (query: Record<string, unknown>) => {
  const alumniQuery = new QueryBuilder(
    Alumni.find().populate('userId', 'email status'), 
    query,
  )
    .search(alumniSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await alumniQuery.modelQuery;
  const meta = await alumniQuery.countTotal(); // ✅ consistent with admin pattern
  return { meta, result };
};

// ── GET SINGLE — by studentId ──
const getSingleAlumniFromDB = async (studentId: string) => {
  const result = await Alumni.findOne({ studentId }).populate(
    'userId',
    'email status',
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Alumni not found');
  }
  return result;
};

// ── GET MY PROFILE — alumni reads own profile ──
const getMyProfileFromDB = async (studentId: string) => {
  const user = await User.findOne({ id: studentId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await Alumni.findOne({ userId: user._id }).populate(
    'userId',
    'email status',
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Alumni profile not found');
  }
  return result;
};

// ── UPDATE MY PROFILE — alumni updates own profile ──
const updateMyProfileInDB = async (
  studentId: string,
  payload: Partial<IAlumni>,
) => {
  // 🚫 block fields alumni should never self-update
  const forbiddenFields = ['studentId', 'userId', 'graduationYear', 'session', 'department', 'faculty'];
  for (const field of forbiddenFields) {
    if (field in payload) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Updating '${field}' is not allowed`,
      );
    }
  }

  const user = await User.findOne({ id: studentId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await Alumni.findOneAndUpdate(
    { userId: user._id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Alumni profile not found');
  }

  return result;
};

// ── UPDATE ANY ALUMNI — admin only ──
const updateAlumniFromDB = async (
  studentId: string,
  payload: Partial<IAlumni>,
) => {
  const forbiddenFields = ['studentId', 'userId'];
  for (const field of forbiddenFields) {
    if (field in payload) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Updating '${field}' is not allowed`,
      );
    }
  }

  const result = await Alumni.findOneAndUpdate(
    { studentId },
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `Alumni with id ${studentId} not found`);
  }

  return result;
};

// ── UPDATE LINKED DATA — email/status lives in User ──
const ALUMNI_ALLOWED_FIELDS = ['email'] as const;

const FORBIDDEN_FIELDS = [
  'status',
  'role',
  'isDeleted',
  'isVerified',
  'password',
  'passwordChangedAt',
  'id',
];

const updateAlumniLinkedDataFromDB = async (
  customUserId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
) => {
  // 🚫 Explicit forbidden-field check
  for (const field of FORBIDDEN_FIELDS) {
    if (field in payload) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `You are not allowed to update '${field}'`,
      );
    }
  }

  // ✅ Whitelist allowed fields
  const safePayload: Partial<{ email: string }> = {};

  for (const key of ALUMNI_ALLOWED_FIELDS) {
    if (payload[key] !== undefined) {
      safePayload[key] = payload[key];
    }
  }

  if (Object.keys(safePayload).length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No valid fields provided for update',
    );
  }

  const user = await User.findOneAndUpdate(
    { id: customUserId },
    { $set: safePayload },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};


// ── GET MENTORS — public mentor listing ──
const getMentorsFromDB = async (query: Record<string, unknown>) => {
  const mentorQuery = new QueryBuilder(
    Alumni.find({ willingToMentor: true }).populate('userId', 'email'),
    query,
  )
    .search(alumniSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await mentorQuery.modelQuery;
  const meta = await mentorQuery.countTotal();
  return { meta, result };
};

export const AlumniServices = {
  getAllAlumniFromDB,
  getSingleAlumniFromDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
  updateAlumniFromDB,
  updateAlumniLinkedDataFromDB,
  getMentorsFromDB,
};