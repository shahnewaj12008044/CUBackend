/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpstatus from 'http-status-codes';
import Student from '../student/student.model';
import { IAlumni } from '../alumni/alumni.interface';


import Alumni from '../alumni/alumni.model';

const signupStudentIntoDB = async (password: string, payload: IStudent) => {
  const user: Partial<IUser> = {};
  //   console.log('payload', payload);
  //^ ===================== creating user object=========================
  user.id = payload.studentId;
  user.email = payload.email;
  user.password = password;
  user.role = 'student';
  //   console.log('user', user);
  //!============= checking the validity of user=================================
  
  const isUserExist = await User.isUserExist(user.email);
  if (isUserExist) {
    throw new AppError(httpstatus.BAD_REQUEST, 'User already exist');
  }

  //^ ============= creating transection and rollback to signup for student and user=================
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newUser = await User.create([user], { session });
   // console.log(newUser)
    if (!newUser || newUser.length === 0) {
      throw new AppError(httpstatus.BAD_REQUEST, 'User creation failed');
    }
    // console.log('newUser', newUser);

    payload.userId = newUser[0]._id;
    // console.log('payload', payload.userId);
    const newStudent = await Student.create([payload], { session });
    // console.log('newStudent', newStudent);
    if (!newStudent || newStudent.length === 0) {
      throw new AppError(httpstatus.BAD_REQUEST, 'User creation failed');
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    // console.log(error)
    throw new AppError(
      httpstatus.INTERNAL_SERVER_ERROR,
      'An error occurred while signing up the student into the database',
      error,
    );
  }
};

const signupAlumniIntoDB = async (password: string, payload: IAlumni) => {
  const user: Partial<IUser> = {};
  //   console.log('payload', payload);
  //^ ===================== creating user object=========================
  user.id = payload.studentId;
  user.email = payload.email;
  user.password = password;
  user.role = 'alumni';
  //   console.log('user', user);
  //!============= checking the validity of user=================================
  
  const isUserExist = await User.isUserExist(user.email);
  if (isUserExist) {
    throw new AppError(httpstatus.BAD_REQUEST, 'User already exist');
  }

  const session = await mongoose.startSession();
  try{
    session.startTransaction();
    const newUser = await User.create([user], { session });
    if( !newUser || newUser.length === 0) {
      throw new AppError(httpstatus.BAD_REQUEST, 'User creation failed');
    }
    payload.userId = newUser[0]._id;
    const newAlumni = await Alumni.create([payload], { session });
    if( !newAlumni || newAlumni.length === 0) {
      throw new AppError(httpstatus.BAD_REQUEST, 'User creation failed');
    }
    await session.commitTransaction();
    await session.endSession();
    return newAlumni[0];
  }catch(error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpstatus.INTERNAL_SERVER_ERROR,
      'An error occurred while signing up the alumni into the database',
      error,
    );
  }
}


//^ this is actually for updating user data linked to another model like status, role and also isdeleted
const updateUserDataIntoDB = async (id:string, payload: Partial<IUser>) => {
  const forbiddenFields:string[] = ['id', 'password','role', 'passwordChangedAt', 'createdAt', 'updatedAt'];
  for (const field of forbiddenFields){
    if (field in payload){
      throw new AppError(httpstatus.BAD_REQUEST, `You cannot update ${field} field`);
    }
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatedUser = await User.findOneAndUpdate(
      {id},
      payload,
      { new: true, runValidators: true,session },
    )
    if (!updatedUser) {
      throw new AppError(httpstatus.BAD_REQUEST, 'User is failed to update');
    }
    //* updating linked model data based on role
    const role = updatedUser.role;
    if(role === 'student') {
      const updatedStudent = await Student.findOneAndUpdate(
        { studentId: id },
        payload,
        { new: true, runValidators: true, session },
      );
      if (!updatedStudent) {
        throw new AppError(httpstatus.BAD_REQUEST, 'Student is failed to update');
      }
    } else if (role === 'alumni') {
      const updatedAlumni = await Alumni.findOneAndUpdate(
        { studentId: id },
        payload,
        { new: true, runValidators: true, session },
      );
      if (!updatedAlumni) {
        throw new AppError(httpstatus.BAD_REQUEST, 'Alumni is failed to update');
      }
    }
   
  


    await session.commitTransaction();
    await session.endSession();
    return updatedUser;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpstatus.BAD_REQUEST, 'Failed to update user', error);
  }
};

export const userServices = {
  signupStudentIntoDB,
  signupAlumniIntoDB,
 updateUserDataIntoDB
};
