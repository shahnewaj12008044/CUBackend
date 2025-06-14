import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { IJwtPayload, ILoginUser } from './auth.interface';
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';

const loginUserIntoDB = async (payload: ILoginUser) => {
  const identifier = payload?.id || payload?.email;
  const user = await User.findOne({
    $or: [{ id: identifier }, { email: identifier }],
  }).select('+password');
  // console.log(user)
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User is deleted');
  }

  const isBlocked = user?.status;
  if (isBlocked === 'blocked') {
    throw new AppError(HttpStatus.NOT_FOUND, 'User status is blocked');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password,
  );
  // console.log(isPasswordMatched)
  if (!isPasswordMatched) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'wrong password!!!');
  }


  const jwtPayload: IJwtPayload = {
    id: user?.id,
    email: user?.email,
    role: user?.role,
  };


  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires as jwt.SignOptions['expiresIn']
  );

  //generating a refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires as jwt.SignOptions['expiresIn']
  );

  // return { accessToken, refreshToken };

  return {
    accessToken,
    refreshToken,
  };






};

export const AuthService = {
  loginUserIntoDB,
};
