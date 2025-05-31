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

interface IStudentStudyInfo {
  CurrentProgram: "Bechelor" | "Masters" | "PhD" ;
  year: number;
  semester?: number;
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

  studyInfo: IStudentStudyInfo
  // isAlumni: boolean;
  // alumniData?: IAlumniProfile;
  department: string; //! this will be a reference id of department later
  faculty: string; //! this will be a reference id of faculty later
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}
