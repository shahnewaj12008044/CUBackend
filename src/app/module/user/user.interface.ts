import { Model } from 'mongoose';

export type TUserRole = 'student' | 'teacher' | 'alumni' | 'admin';
export type TUserStatus = 'active' | 'blocked' | 'pending';

export interface IUser {
  id: string; // custom user id (not Mongo _id)

  email: string;
  password: string;

  role: TUserRole; // system-level role
  status: TUserStatus;

  isDeleted: boolean;
  isVerified: boolean;

  passwordChangedAt?: Date;

  resetPasswordOtp?: string;
  resetPasswordExpire?: Date;
}

export interface IUpdateUserAccount {
  email?: string;
}

export interface IAdminUpdateUser {
  role?: TUserRole;
  status?: TUserStatus;
  isDeleted?: boolean;
  isVerified?: boolean;
}

export interface IUserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export const USER_ROLE = {
  student: 'student',
  teacher: 'teacher',
  alumni: 'alumni',
  admin: 'admin',
} as const;

export const USER_STATUS = {
  active: 'active',
  blocked: 'blocked',
  pending: 'pending',
} as const;