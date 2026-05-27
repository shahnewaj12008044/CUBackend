import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status-codes';

import AppError from '../../errors/AppError';
import config from '../../config';
import { User } from '../user/user.model';
import { IJwtPayload, ILoginUser, IRegisterStudent } from './auth.interface';
import { checkUserStatus, createToken, verifyToken } from './auth.utils';
import { sendMail } from '../../utils/sendMail';
import otpHtml from '../../Templates/otp';
import mongoose from 'mongoose';
import Student from '../student/student.model';
import Alumni from '../alumni/alumni.model';
import { IAlumni } from '../alumni/alumni.interface';
// import { Admin } from '../admin/admin.model';
// import { IAdmin } from '../admin/admin.interface';



const registerStudent = async (payload: IRegisterStudent) => {
  const { email, password, student } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new AppError(
        httpStatus.CONFLICT,
        'A user already exists with this email',
      );
    }

    const existingStudent = await Student.findOne({
      studentId: student.studentId,
    }).session(session);

    if (existingStudent) {
      throw new AppError(
        httpStatus.CONFLICT,
        'A student already exists with this student ID',
      );
    }

    const createdUsers = await User.create(
      [
        {
          id: student.studentId,
          email,
          password,
          role: 'student',
          status: 'active',
          isDeleted: false,
          isVerified: false,
        },
      ],
      { session },
    );

    const createdUser = createdUsers[0];

    const createdStudents = await Student.create(
      [
        {
          ...student,
          userId: createdUser._id,
        },
      ],
      { session },
    );

    const createdStudent = createdStudents[0];

    await session.commitTransaction();
    await session.endSession();

    return {
      user: createdUser,
      student: createdStudent,
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};



const registerAlumniIntoDB = async (payload: {email:string, password:string, alumni:IAlumni}) => {
  const { email, password, alumni } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1️⃣ Check existing user by email
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new AppError(
        httpStatus.CONFLICT,
        'A user already exists with this email',
      );
    }

    // 2️⃣ Check existing alumni by studentId / alumniId
    const existingAlumni = await Alumni.findOne({
      studentId: alumni.studentId,
    }).session(session);

    if (existingAlumni) {
      throw new AppError(
        httpStatus.CONFLICT,
        'An alumni already exists with this student ID',
      );
    }

    // 3️⃣ Create User
    const createdUsers = await User.create(
      [
        {
          id: alumni.studentId, // custom ID
          email,
          password,
          role: 'alumni',
          status: 'active',
          isDeleted: false,
          isVerified: false,
        },
      ],
      { session },
    );

    const createdUser = createdUsers[0];

    // 4️⃣ Create Alumni profile
    const createdAlumni = await Alumni.create(
      [
        {
          ...alumni,
          userId: createdUser._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return {
      user: createdUser,
      alumni: createdAlumni[0],
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// ─────────────────────────────────────────────
// CREATE ADMIN  (with transaction)
// ─────────────────────────────────────────────
// src/modules/admin/admin.service.ts

// const registerAdminIntoDB = async (payload: {
//   email: string;
//   password: string;
//   admin: IAdmin;
// }) => {
//   const { email, password, admin } = payload;

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     // 1. Duplicate checks
//     const existingUser = await User.findOne({ email }).session(session);
//     if (existingUser) {
//       throw new AppError(httpStatus.CONFLICT, 'A user already exists with this email');
//     }

//     const existingAdmin = await Admin.findOne({ adminId: admin.adminId }).session(session);
//     if (existingAdmin) {
//       throw new AppError(httpStatus.CONFLICT, 'An admin already exists with this admin ID');
//     }

//     // 2. Create auth User
//     const createdUsers = await User.create(
//       [
//         {
//           id: admin.adminId,
//           email,
//           password,
//           role: 'admin',
//           status: 'active',
//           isDeleted: false,
//           isVerified: false,
//         },
//       ],
//       { session },
//     );

//     const createdUser = createdUsers[0];

//     // 3. Create Admin profile
//     const createdAdmins = await Admin.create(
//       [
//         {
//           ...admin,
//           userId: createdUser._id,
//         },
//       ],
//       { session },
//     );

//     const createdAdmin = createdAdmins[0];

//     await session.commitTransaction();
//     await session.endSession();

//     return {
//       user: createdUser,
//       admin: createdAdmin,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw error;
//   }
// };

const loginUser = async (payload: ILoginUser) => {
  const identifier = payload.id || payload.email;

  if (!identifier || !payload.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Identifier and password are required',
    );
  }

  const user = await User.findOne({
    $or: [{ id: identifier }, { email: identifier }],
  }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  checkUserStatus(user);

  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const jwtPayload: IJwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires as jwt.SignOptions['expiresIn'],
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires as jwt.SignOptions['expiresIn'],
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Refresh token is required');
  }

  const decoded = verifyToken(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { id, iat } = decoded;

  const user = await User.findOne({ id });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  checkUserStatus(user);

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Password has been changed. Please log in again.',
    );
  }

  const jwtPayload: IJwtPayload = {
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

const forgotPassword = async (email: string) => {
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  checkUserStatus(user);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetPasswordOtp = await bcrypt.hash(
    otp,
    Number(config.bcrypt_salt_rounds),
  );
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  const subject = 'Your Password Reset OTP';
  const text = `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`;
  const emailHtml = otpHtml(otp);

  await sendMail(user.email, subject, text, emailHtml);

  return {
    message: 'OTP sent to your email successfully',
  };
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  if (!email || !otp || !newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Email, OTP, and new password are required',
    );
  }

  const user = await User.findOne({ email }).select(
    '+resetPasswordOtp +resetPasswordExpire',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  checkUserStatus(user);

  const isOtpValid = await bcrypt.compare(otp, user.resetPasswordOtp || '');
  const isOtpExpired =
    !user.resetPasswordExpire || user.resetPasswordExpire < new Date();

  if (!isOtpValid || isOtpExpired) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return {
    message: 'Password has been reset successfully',
  };
};

export const AuthService = {
  registerStudent,
  loginUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
    registerAlumniIntoDB
  // registerAdminIntoDB
};