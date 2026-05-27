import { Types } from 'mongoose';

// ========== Enums ==========

export enum AlumniCategory {
  CORPORATE = 'corporate',
  RESEARCH = 'research',
  ACADEMIA = 'academia',
  ADMINISTRATION = 'administration',
  BUSINESS = 'business', // 
  OTHER = 'other',
}

// ========== Sub-Profiles ==========

export interface ICorporateInfo {
  company: string;
  designation: string;
  description?: string;
  startDate: string;
  endDate?: string;        
  currentlyWorking?: boolean;
}

export interface IResearchInfo {
  institution: string;
  researchArea: string[];
  designation: 'MS' | 'PhD' | 'Postdoc' | 'Research Associate' | 'Other';
  supervisor?: string;
  startDate: string;
  endDate?: string;        // ✅ optional
  currentlyWorking?: boolean;
  description?: string;
}

export interface IAcademiaInfo {
  institution: string;
  designation: string;
  department: string;
  startDate: string;
  endDate?: string;        // ✅ optional
  currentlyWorking?: boolean;
  description?: string;
}

export interface IAdministrationInfo {
  organization: string;
  designation: string;
  startDate: string;
  endDate?: string;        // ✅ optional
  currentlyWorking?: boolean;
  description?: string;
}

export interface IBusinessInfo {
  businessName: string;
  designation: string;
  startDate: string;
  endDate?: string;        // ✅ optional
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
  endDate?: string;        // ✅ optional
  currentlyWorking?: boolean;
  location?: string;
}

// ========== Supporting Interfaces ==========

export interface IAlumniLocation {  // ✅ fixed casing IALumniLocation → IAlumniLocation
  country: string;
  city: string;
}

export interface IAlumniOnlinePresence {
  platform: string;
  link: string;
}

export interface IAlumniAchievement {  // ✅ fixed typo IAlunmiAchievements → IAlumniAchievement
  title: string;
  description: string;
  year: number;
}

// ========== Alumni Profile Container ==========

export interface IAlumniProfile {
  alumniCategory: AlumniCategory;
  corporateInfo?: ICorporateInfo[];
  researchInfo?: IResearchInfo[];
  academiaInfo?: IAcademiaInfo[];
  administrationInfo?: IAdministrationInfo[];
  businessInfo?: IBusinessInfo[];
  otherInfo?: IOtherInfo[];
}

// ========== Main Alumni Interface ==========

export interface IAlumni {
  studentId: string;
  userId: Types.ObjectId;
  name: string;
  gender: 'male' | 'female' | 'other';
  graduationYear: number;
  contactNumber: string;
  session: string;
  department: string;
  faculty: string;

  willingToMentor: boolean;      
  location: IAlumniLocation;       
  onlinePresence?: IAlumniOnlinePresence[];
  achievements?: IAlumniAchievement[];  
  portfolioLink?: string;
  bio?: string;                  

  alumniProfile: IAlumniProfile;
}