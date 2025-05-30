/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { IAlumni } from './alumni.interface';
import { Alumni } from './alumni.model';
import httpStatus from 'http-status-codes';

const getAllAlumniFromDB = async () => {
  const result = await Alumni.find({});
  return result;
};

const getSingleAlumniFromDB = async (id: string) => {
  const result = await Alumni.findOne({ studentId: id });
  return result;
};

const updateAlumniFromDB = async (id: string, payload: Partial<IAlumni>) => {
  const result = await Alumni.findOneAndUpdate({ studentId: id }, payload, {
    new: true,
    runValidators: true,
  }).exec();
  //! here i didn't handled the non-primitive data types like array or array of objects my plan is to handle them form frontend although this is a bad practice but for now i will do it like this
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Alumni with id ${id} not found`,
    );
  }
  return result;
};


const deleteAlumniFromDB = async(id : string) =>{
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const user = await User.findOneAndUpdate({id}, {isDeleted : true}, {new : true,session});
        if(!user){
            throw new AppError(httpStatus.BAD_REQUEST,"Failed to delete user")
        }
        const alumni = await Alumni.findOneAndUpdate({studentId : id}, {isDeleted : true}, {new : true, session});
        if(!alumni){
            throw new AppError(httpStatus.BAD_REQUEST,"Failed to delete alumni")
        }
        await session.commitTransaction();
        session.endSession();
        return alumni;

    }
 catch(error: any){
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST,"Failed to delete user",error)
 }
}

export const AlumniServices = {
  getAllAlumniFromDB,
  getSingleAlumniFromDB,
  updateAlumniFromDB,
  deleteAlumniFromDB,
};
