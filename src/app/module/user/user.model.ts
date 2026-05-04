import { HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { IUser, IUserModel } from './user.interface';

const userSchema = new Schema<IUser, IUserModel>(
  {
    id: {
      type: String,
      required: [true, 'User id is required'],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      select: 0, // do not return password by default
    },

    role: {
      type: String,
      enum: ['student', 'teacher', 'alumni', 'admin'],
      required: [true, 'Role is required'],
    },

    status: {
      type: String,
      enum: ['active', 'blocked', 'pending'],
      default: 'pending',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
    },

    resetPasswordOtp: {
      type: String,
      select: 0,
    },

    resetPasswordExpire: {
      type: Date,
      select: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);




userSchema.pre('save', async function (next) {
  const user = this as HydratedDocument<IUser>;

  if (!user.isModified('password')) return next();

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const changedTime = Math.floor(
    new Date(passwordChangedTimestamp).getTime() / 1000,
  );

  return changedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, IUserModel>('User', userSchema);