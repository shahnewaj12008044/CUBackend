import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { IJwtPayload, ILoginUser } from './auth.interface';
import HttpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { sendMail } from '../../utils/sendMail';
import otpHtml from '../../Templates/otp';

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

  const isPasswordMatched = await User.isPasswordMathedChecker(
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
    config.jwt_access_expires as jwt.SignOptions['expiresIn'],
  );

  //generating a refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires as jwt.SignOptions['expiresIn'],
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
  const { email, iat } = decoded as JwtPayload;
  // console.log(email, id, role, iat)

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
    (await User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    ))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
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
  const user = await User.findOne({ id: userData?.id })
    .select('+password')
    .lean();
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

  const isPasswordMatched = await User.isPasswordMathedChecker(
    payload.oldPassword,
    user?.password,
  );

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

const forgetPassword = async (email: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (await User.isUserExist(email)) as any;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }
  // Generate OTP (6-digit random number)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Optional: Store hashed OTP + expiry in DB
  user.resetPasswordOtp = await bcrypt.hash(otp, Number(config.bcrypt_salt_rounds));

  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  // console.log(user.resetPasswordOtp, user.resetPasswordExpire);
  await user.save();
 

  // Send OTP
  const text = `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`;
  const subject = 'Your Password Reset OTP';


  const emailHtml = otpHtml(otp)

  // const message = `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`;

  await sendMail(user.email, subject, text, emailHtml);

  return { message: 'OTP sent to your email.' };
};




export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  // Get user
  const user = await User.findOne({ email }).select('+resetPasswordOtp +resetPasswordExpire ');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // Check OTP & expiry
  const isOtpValid = await bcrypt.compare(otp, user.resetPasswordOtp || '');
  const isOtpExpired = !user.resetPasswordExpire || user.resetPasswordExpire < new Date();

  if (!isOtpValid || isOtpExpired) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP!');
  }

  // Update password
// user.password = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));


 user.password = newPassword;
 //^ bugStory: so in the first attempt i tried to hash the password during the save but i forgot i created a presave middleware that will hash the pass automatically so actually i was hashing twice a password and thats why the password was not matched in the sign in. so finally i stopped hashin in this service function and let the presave middleware handle it.


  

  // Clear OTP fields
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return { message: 'Password has been reset successfully.' };
};




export const AuthService = {
  loginUserIntoDB,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
