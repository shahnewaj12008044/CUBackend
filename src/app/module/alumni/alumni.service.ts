/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { IAlumni } from './alumni.interface';
import Alumni from './alumni.model';
import httpStatus from 'http-status-codes';
import validatePayloadKeys from '../../utils/validatePayloadKeys';

const getAllAlumniFromDB = async () => {
  const result = await Alumni.find({});
  return result;
};

const getSingleAlumniFromDB = async (id: string) => {
  const result = await Alumni.findOne({ studentId: id });
  return result;
};

const updateAlumniFromDB = async (id: string, payload: Partial<IAlumni>) => {
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
     //! so basicly i was trying to update the user and student data in one transactionbut i realised in doing so i have to write it more than one time ( student, alumni and so on ) so i will just write it once in user to update the role email status etc
  //^ SUMMARY: you can update anything but email, role, status and id. for updating that you have to go to user route and here you will find those options to update

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


//^ shouldn't i do that also in user service. In this method  i have to write the same funcion in different models whereas in user service i can just do it by doing it once and then use it in all models.
//~ remarks on the above line: i tried it also but from user part its not that simple as expected cause here also every model like student, alumni rquires to update which makes the code little bit odd  although i did it using if else if statement.


//! update linked data like isDeleted, status, email etc.
const updateAlumniLinkedDataFromDB = async(id : string,payload: Partial<IAlumni>) =>{
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
         //^ 🚫 Block forbidden field updates like role is not in the student model but if i put role it didnt give any error instead it modified the user so i added the validation where if the keys are not common in both model it will give error 
    //* nice validation works both for user and student model
        validatePayloadKeys(payload, User, 'user');
        validatePayloadKeys(payload, Alumni, 'alumni');
        const user = await User.findOneAndUpdate({id}, payload, {new : true,session});
        if(!user){
            throw new AppError(httpStatus.BAD_REQUEST,"Failed to update  user")
        }
        const alumni = await Alumni.findOneAndUpdate({studentId : id}, payload, {new : true, session});
        if(!alumni){
            throw new AppError(httpStatus.BAD_REQUEST,"Failed to update alumni")
        }
        await session.commitTransaction();
        session.endSession();
        return alumni;

    }
 catch(error: any){
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST,`Failed to update alumni for ${error?.message} `,error)
 }
}

export const AlumniServices = {
  getAllAlumniFromDB,
  getSingleAlumniFromDB,
  updateAlumniFromDB,
  updateAlumniLinkedDataFromDB,
};
 