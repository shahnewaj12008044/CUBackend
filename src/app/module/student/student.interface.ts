import { Types } from 'mongoose';

export type TGender = 'male' | 'female' | 'other';
export type TProgram = 'Bachelor' | 'Masters' | 'PhD';
export type TSocialPlatform =
  | 'facebook'
  | 'linkedin'
  | 'github'
  | 'twitter'
  | 'website';

export interface IStudentSocialMedia {
  platform: TSocialPlatform;
  link: string;
}

export interface IStudentAchievement {
  title: string;
  description?: string;
  year: number;
}

export interface IStudentStudyInfo {
  currentProgram: TProgram;
  currentYear: number;
  semester?: number;
}

export interface IStudent {
  studentId: string; // university roll / student id
  userId: Types.ObjectId;

  name: string;
  session: string;
  department: string;
  faculty: string;

  studyInfo: IStudentStudyInfo;

  contactNumber?: string;
  gender?: TGender;

  socialMedia?: IStudentSocialMedia[];
  skills?: string[];
  interests?: string[];
  achievements?: IStudentAchievement[];

  bio?: string;
  profileImage?: string;
  cvLink?: string;
  portfolioLink?: string;
}


export interface IUpdateStudentProfile {
  name?: string;
  contactNumber?: string;
  gender?: TGender;
  socialMedia?: IStudentSocialMedia[];
  skills?: string[];
  interests?: string[];
  achievements?: IStudentAchievement[];
  bio?: string;
  profileImage?: string;
  cvLink?: string;
  portfolioLink?: string;
}


export interface IAdminUpdateStudent {
  session?: string;
  department?: string;
  faculty?: string;
  studyInfo?: IStudentStudyInfo;
}