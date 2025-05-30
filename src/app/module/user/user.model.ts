import { model, Schema } from 'mongoose';
import { IUser, IUserModel } from './user.interface';

const userSchema = new Schema<IUser , IUserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: [
        'student',
        'teacher',
        'alumni'
      ],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.isUserExist = async function (email: string): Promise<IUser | null> {
  return await this.findOne({ email });
}

export const User = model<IUser , IUserModel>("User", userSchema)