import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { IJwtPayload, ILoginUser } from './auth.interface';
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken,  verifyToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status-codes';

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

  const isPasswordMatched = await User.isPasswordMathedChecker(payload?.password, user?.password);
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

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  // console.log(decoded)
  const {email, id, role, iat } = decoded  as JwtPayload;
  console.log(email, id, role, iat)

  // checking if the user is exist
  const user = await User.isUserExist(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
  await User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
   id: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires as jwt.SignOptions['expiresIn'],
  );

  return {
    accessToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  
  // checking if the user is exist
  //! const user = await User.isUserExist(userData.email);
  //^ the bug story:: here i was checking the user pass with the old pass now isUserExist is without pass so the pass in user model is not coming that made the error in the pass checking
  const user = await User.findOne({id: userData?.id}).select("+password").lean()
  // console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  const isPasswordMatched = await User.isPasswordMathedChecker(payload.oldPassword, user?.password)

  if (!isPasswordMatched)
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  await User.findOneAndUpdate(
    {
      id: userData.id,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};


export const AuthService = {
  loginUserIntoDB,
  refreshToken,
  changePassword
};
