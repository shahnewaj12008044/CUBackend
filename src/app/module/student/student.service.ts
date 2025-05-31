/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';

import httpStatus from 'http-status-codes';
import Student from './student.model';
import { IStudent } from './student.interface';
import { User } from '../user/user.model';

const getAllStudentFromDB = async () => {
  const result = await Student.find({});
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ studentId: id });
  return result;
};

const updateStudentFromDB = async (id: string, payload: Partial<IStudent>) => {
     //^ 🚫 Block forbidden field updates
  
  const forbiddenFields: string[] = [
    'status',
    'role',
    'email',
  ];

  for( const field of forbiddenFields) {
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

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }
    const student = await Student.findOneAndUpdate(
      { studentId: id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!student) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
    await session.commitTransaction();
    session.endSession();
    return student;
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user', error);
  }
};

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentFromDB,
  deleteStudentFromDB,
};
