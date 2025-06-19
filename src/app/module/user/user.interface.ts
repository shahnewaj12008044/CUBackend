import { Model } from "mongoose";

export interface IUser {
    id: string;
    email: string;
    password: string; //!password has to be hashed
    passwordChangedAt: Date;
    role: "student" | "teacher" | "alumni" | "admin" ;
    status: "in-progress" | "blocked";
    isDeleted: boolean;
}
 export const USER_ROLE = {
    student:'student',
    teacher:'teacher',
    alumni:'alumni',
    admin:'admin',
    me:'me'
 } as const;

export type TUserRole = keyof typeof USER_ROLE;

//! role : "superadmin" | "departmentadmin" | "facultyadmin"; i would rather use them as post of the club 


export interface IUserModel extends Model<IUser>{
    isUserExist(email: string): Promise<IUser | null>;
    isJWTIssuedBeforePasswordChanged(passwordChangedTimeStamp:Date, jwtIssuedAt:number):Promise<boolean>
     isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
  isPasswordMathedChecker(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}