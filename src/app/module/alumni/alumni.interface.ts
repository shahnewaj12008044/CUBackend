//!==================== Alumni data ============================

import { Types } from "mongoose";

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
  startDate: string;
  endDate: string;
  currentlyWorking?: boolean;
}

export interface IResearchInfo {
  institution: string; //^ name of the lab or research institution
  researchArea: string[];
  designation: 'MS' | 'PhD' | 'Postdoc' | 'Research Associate' | 'Other';
  supervisor?: string;
  startDate: string;
  endDate: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface IAcademiaInfo {
  university: string;
  designation: string; // e.g., Assistant Professor
  department: string;
  startDate: string;
  endDate: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface IAdministrationInfo {
  organization: string;
  designation: string;
  startDate: string;
  endDate: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface IBusinessInfo {
  businessName: string;
  designation: string;
  startDate: string;
  endDate: string;
  currentlyWorking?: boolean;
  description?: string;
  location?: string;
  website?: string;
}

export interface IOtherInfo {
  title: string;
  designation?: string;
  description: string;
  startDate: string;
  endDate: string;
  currentlyWorking?: boolean;
  location?: string;
}

interface IALumniLocation {
  country: string;
  city: string;
}

interface IAlumniOnlinePresence {
  platform: string;
  link: string;
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

 
}

interface IAlunmiAchievements {
  title: string;
  description: string;
  year: number;
}


export interface IAlumni {
  studentId: string; // Reference to the student ID
  userId: Types.ObjectId; //& reference to the user ID
  name: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  graduationYear: number;
  contactNumber: string;
  onlinePresence?:IAlumniOnlinePresence[];
  willingTomentor: boolean;
  location:IALumniLocation;
  session: string;
  achievements?: IAlunmiAchievements[];
  portfolioLink?: string;
  alumniProfile: IAlumniProfile;
  department: string; //! this will be a reference id of department later
  faculty: string; //! this will be a reference id of faculty later
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

