import { Schema,Types } from 'mongoose';

export interface IAdmin {
  adminId: string; // custom unique id (like ADM-0001)
  userId: Types.ObjectId; // reference to User

  name: {
    firstName: string;
    lastName: string;
  };

  contactNo?: string;
  emergencyContactNo?: string;

  designation?: string; // future scalability (Super Admin, Moderator etc.)

  profileImg?: string;

  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}



export interface IAdminInvite {
  email: string;
  token: string;
  invitedBy: Schema.Types.ObjectId; // the system_admin who sent it
  expiresAt: Date;
  isUsed: boolean;
}