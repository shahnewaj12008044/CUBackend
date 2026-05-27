// ✅ Removed: isDeleted — lives in User model only, not Student's concern
// ✅ Removed: IUpdateStudentProfile / IAdminUpdateStudent merged approach
//    — kept separate and clean, studyInfo made Partial in admin type
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
  studentId: string;
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

// Student self-updates — personal/contact/portfolio fields only
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

// Admin updates — academic/structural fields only
export interface IAdminUpdateStudent {
  session?: string;
  department?: string;
  faculty?: string;
  studyInfo?: Partial<IStudentStudyInfo>; // ✅ Partial — admin shouldn't resend full object
}