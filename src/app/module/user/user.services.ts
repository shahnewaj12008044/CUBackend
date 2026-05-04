import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from './user.model';
import {
  IAdminUpdateUser,
  IUpdateUserAccount,
} from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findOne({ id });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const getAllUsersFromDB = async () => {
  const users = await User.find({ isDeleted: false });

  return users;
};

const updateMyAccountInDB = async (
  id: string,
  payload: IUpdateUserAccount,
) => {
  const allowedFields = ['email'];

  const payloadKeys = Object.keys(payload);
  const isValid = payloadKeys.every((key) =>
    allowedFields.includes(key),
  );

  if (!isValid) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only email can be updated',
    );
  }

  const updatedUser = await User.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return updatedUser;
};

const adminUpdateUserInDB = async (
  id: string,
  payload: IAdminUpdateUser,
) => {
  const updatedUser = await User.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return updatedUser;
};

const softDeleteUserFromDB = async (id: string) => {
  const deletedUser = await User.findOneAndUpdate(
    { id },
    { isDeleted: true, status: 'blocked' },
    { new: true, runValidators: true },
  );

  if (!deletedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return deletedUser;
};

const changePasswordInDB = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findOne({ id: userId }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isMatch = await User.isPasswordMatched(
    oldPassword,
    user.password,
  );

  if (!isMatch) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Old password is incorrect',
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  user.password = hashedPassword;
  user.passwordChangedAt = new Date();

  await user.save();

  return null;
};

export const UserServices = {
  getSingleUserFromDB,
  getAllUsersFromDB,
  updateMyAccountInDB,
  adminUpdateUserInDB,
  softDeleteUserFromDB,
  changePasswordInDB,
};