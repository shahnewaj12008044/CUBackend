
import httpStatus from 'http-status-codes';
import Student from './student.model';
import {
  IAdminUpdateStudent,
  IUpdateStudentProfile,
} from './student.interface';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { studentSearchableFields } from './student.constants';

// ─────────────────────────────────────────────
// GET ALL
// ─────────────────────────────────────────────
const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(Student.find().populate('userId'), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();

  return { meta, result };
};

// ─────────────────────────────────────────────
// GET SINGLE
// ─────────────────────────────────────────────
const getSingleStudentFromDB = async (studentId: string) => {
  const student = await Student.findOne({ studentId }).populate('userId');

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  return student;
};


// ─────────────────────────────────────────────
// STUDENT UPDATES OWN PROFILE
// Personal/contact/portfolio fields only
// ─────────────────────────────────────────────
const updateStudentProfileFromDB = async (
  studentId: string,
  payload: IUpdateStudentProfile,
) => {
  const result = await Student.findOneAndUpdate(
    { studentId },
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  return result;
};

// ─────────────────────────────────────────────
// ADMIN UPDATES STUDENT ACADEMIC DATA
// session, department, faculty, studyInfo only
// ─────────────────────────────────────────────
const adminUpdateStudentFromDB = async (
  studentId: string,
  payload: IAdminUpdateStudent,
) => {
  const { studyInfo, ...rest } = payload;

  const modifiedPayload: Record<string, unknown> = { ...rest };

  // Flatten nested studyInfo to dot-notation to avoid wiping sibling fields
  // e.g { studyInfo: { currentYear: 2 } } → { 'studyInfo.currentYear': 2 }
  if (studyInfo && Object.keys(studyInfo).length) {
    for (const [key, value] of Object.entries(studyInfo)) {
      modifiedPayload[`studyInfo.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate(
    { studentId },
    { $set: modifiedPayload },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  return result;
};

// ─────────────────────────────────────────────
// SOFT DELETE
// Only touches User — Student doc is kept as historical record
// ─────────────────────────────────────────────
const deleteStudentFromDB = async (studentId: string) => {
  const student = await Student.findOne({ studentId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const deletedUser = await User.findByIdAndUpdate(
    student.userId,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete linked user');
  }

  return { message: `Student ${studentId} has been deactivated` };
};

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentProfileFromDB,
  adminUpdateStudentFromDB,
  deleteStudentFromDB,
};