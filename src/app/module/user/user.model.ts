import { model, Schema } from 'mongoose';
import { IUser, IUserModel } from './user.interface';
import config from '../../config';
import bcrypt from "bcrypt";

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
      select: false, //! Do not return password by default
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
        'alumni',
        'admin',
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

userSchema.pre("save", async function (next) {
  //hashing password and save into DB:
   //crurrent processed document
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});


//post save middleware/hooks:
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isUserExist = async function (email: string): Promise<IUser | null> {
  return await this.findOne({ email }).lean();
}
userSchema.statics.isJWTIssuedBeforePasswordChanged = async function(passwordChangedTimeStamp:Date, jwtIssuedAt:number){
  const passwordChangedTime = new Date(passwordChangedTimeStamp).getTime()/1000
  return passwordChangedTime > jwtIssuedAt
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

userSchema.statics.isPasswordMathedChecker = async function (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};


export const User = model<IUser , IUserModel>("User", userSchema)