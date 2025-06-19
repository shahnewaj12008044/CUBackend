/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';

import httpStatus from 'http-status-codes';
import Student from './student.model';
import { IStudent } from './student.interface';
import { User } from '../user/user.model';
import validatePayloadKeys from '../../utils/validatePayloadKeys';

const getAllStudentFromDB = async () => {
  const result = await Student.find({});
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // console.log('id', id);
  const result = await Student.findOne({ studentId: id });
  // console.log(result);
  return result;
};

const updateStudentFromDB = async (id: string, payload: Partial<IStudent>) => {
  //^ 🚫 Block forbidden field updates

  const forbiddenFields: string[] = ['status', 'role', 'email','isDeleted'];

  for (const field of forbiddenFields) {
    if (field in payload) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Updating ${field} is not allowed`,
      );
    }
  }

  const result = await Student.findOneAndUpdate({ studentId: id }, payload, {
    new: true,
    runValidators: true,
  }).exec();
  // console.log(result);
  //! here i didn't handled the non-primitive data types like array or array of objects my plan is to handle them form frontend although this is a bad practice but for now i will do it like this
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Student with id ${id} not found`,
    );
  }
  return result;

  //?====================================tried to use transaction and rollback and found a btter way to do it ===============================================
  //! so basicly i was trying to update the user and student data in one transactionbut i realised in doing so i have to write it more than one time ( student, alumni and so on ) so i will just write it once in user to update the role email status etc
  //^ SUMMARY: you can update anything but email, role, status and id. for updating that you have to go to user route and here you will find those options to update
  //* updating linked data with user from user route is not easy that i though moreover updating from here is more cleaner
  // const session = await mongoose.startSession();
  // try{
  //     session.startTransaction();
  //     const user = await User.findOneAndUpdate(
  //       { id },
  //       payload,
  //       { new: true, runValidators: true, session },
  //     );
  //     if (!user) {
  //       throw new AppError(
  //         httpStatus.BAD_REQUEST,
  //         `User with id ${id} not found`,
  //       );
  //     }
  //     const student = await Student.findOneAndUpdate(
  //       { studentId: id },
  //       payload,
  //       { new: true, runValidators: true, session },
  //     );
  //     if (!student) {
  //       throw new AppError(
  //         httpStatus.BAD_REQUEST,
  //         `Student with id ${id} not found`,
  //       );
  //     }
  //     await session.commitTransaction();
  //     session.endSession();
  //     return student;
  // }
  // catch(error: any){
  //     session.abortTransaction();
  //     session.endSession();
  //     throw new AppError(httpStatus.BAD_REQUEST,"Failed to update user",error)
  // }
};

//! this is for updatig email, isDeleted, status of user and student at the same time
const updateLinkedDataFromDB = async (
  id: string,
  payload: Partial<IStudent>,
  role:string
) => {
if (
  
  role === 'student' &&
  ['isDeleted', 'status'].some(field => field in payload) //^ blocking student from updating (but can update others in me role)
) {
  throw new AppError(
    httpStatus.FORBIDDEN,
    'You are not allowed to update isDeleted or status as a student.'
  );
}




  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //^ 🚫 Block forbidden field updates like role is not in the student model but if i put role it didnt give any error instead it modified the user so i added the validation where if the keys are not common in both model it will give error 
    //* nice validation works both for user and student model
    validatePayloadKeys(payload, User, 'User');
    validatePayloadKeys(payload, Student, 'Student');

    const user = await User.findOneAndUpdate({ id }, payload, {
      new: true,
      runValidators: true,
      session,
    });
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update user');
    }
    const student = await Student.findOneAndUpdate({ studentId: id }, payload, {
      new: true,
      strict: true, // This will ensure that only fields defined in the schema can be updated
      runValidators: true,
      session,
    });

    if (!student) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update student');
    }
    await session.commitTransaction();
    session.endSession();
    return student;
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to update user and student for ${error?.message}`,
      error,
    );
  }
};

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentFromDB,
  updateLinkedDataFromDB,
};
