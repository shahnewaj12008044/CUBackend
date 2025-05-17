import { Types } from 'mongoose';

interface IStudentSocialMedia {
  platform: string;
  link: string;
}
interface IStudentAchievements {
  title: string;
  description: string;
  year: number;
}

//!==================== Alumni data ============================
// Enums to define alumni category types
export enum AlumniCategory {
  CORPORATE = 'corporate',
  RESEARCH = 'research',
  ACADEMIA = 'academia',
  ADMINISTRATION = 'administration',
  BUSSINESS = 'business',
  OTHER = 'other',
}
//& ========== Alumni Sub-Profiles ==========

export interface ICorporateInfo {
  company: string;
  designation: string;
  description?: string;
  joiningDate: Date;
  leavingDate?: Date | 'currently working';
}

export interface IResearchInfo {
  institution: string;
  researchArea: string;
  degree: 'MS' | 'PhD';
  supervisor?: string;
  startDate: Date;
  endDate?: Date | 'currently working';
  description?: string;
}

export interface IAcademiaInfo {
  university: string;
  title: string; // e.g., Assistant Professor
  department: string;
  startDate: Date;
  endDate?: Date | 'currently working';
  description?: string;
}

export interface IAdministrationInfo {
  organization: string;
  position: string;
  startDate: Date;
  endDate?: Date | 'currently working';
  description?: string;
}

export interface IBusinessInfo {
  businessName: string;
  startDate: Date;
  endDate?: Date | 'currently working';
  description?: string;
  location?: string;
  website?: string;
}

export interface IOtherInfo {
  title: string;
    description: string;
    startDate: Date;
    endDate?: Date | 'currently working';
    location?: string;
}

interface IALumniLocation {
  country: string;
  city: string;
}

//* ========== Alumni Data Container ==========

export interface IAlumniProfile {
  alumniCategory: AlumniCategory;
  corporateInfo?: ICorporateInfo[];
  researchInfo?: IResearchInfo[];
  academiaInfo?: IAcademiaInfo[];
  administrationInfo?: IAdministrationInfo[];
  businessInfo?: IBusinessInfo[];
  otherInfo?: IOtherInfo[];
  currentlocation?: IALumniLocation;
  willingToMentor?: boolean;
}

export interface IStudent {
  studentId: string; //! this is student role number
  userId: Types.ObjectId;
  name: string;
  email: string;
  socialMedia: IStudentSocialMedia[];
  contactNumber: string;
  skills?: string[];
  interests?: string[];
  gender: 'male' | 'female' | 'other';
  session: string;
  cvLink?: string;
  portFolioLink?: string;
  achievements?: IStudentAchievements[];
  isAlumni: boolean;
  department: string; //! this will be a reference id of department later
  faculty: string; //! this will be a reference id of faculty later
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}
