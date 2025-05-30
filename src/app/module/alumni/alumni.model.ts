

import mongoose, { Schema } from 'mongoose';
import { IAlumni } from './alumni.interface';

export enum AlumniCategory {
  CORPORATE = 'corporate',
  RESEARCH = 'research',
  ACADEMIA = 'academia',
  ADMINISTRATION = 'administration',
  BUSSINESS = 'business',
  OTHER = 'other',
}

// Sub-schemas with `_id: false`
const CorporateInfoSchema = new Schema(
  {
    company: String,
    designation: String,
    description: String,
    startDate: String,
    endDate: String,
    currentlyWorking: Boolean,
  },
  { _id: false }
);

const ResearchInfoSchema = new Schema(
  {
    institution: String,
    researchArea: [String],
    designation: { type: String, enum: ['MS', 'PhD', 'Postdoc', 'Research Associate', 'Other'] },
    supervisor: String,
    startDate: String,
    endDate: String,
    currentlyWorking: Boolean,
    description: String,
  },
  { _id: false }
);

const AcademiaInfoSchema = new Schema(
  {
    university: String,
    designation: String,
    department: String,
    startDate: String,
    endDate: String,
    currentlyWorking: Boolean,
    description: String,
  },
  { _id: false }
);

const AdministrationInfoSchema = new Schema(
  {
    organization: String,
    designation: String,
    startDate: String,
    endDate: String,
    currentlyWorking: Boolean,
    description: String,
  },
  { _id: false }
);

const BusinessInfoSchema = new Schema(
  {
    businessName: String,
    designation: String,
    startDate: String,
    endDate: String,
    currentlyWorking: Boolean,
    description: String,
    location: String,
    website: String,
  },
  { _id: false }
);

const OtherInfoSchema = new Schema(
  {
    title: String,
    designation: String,//^ position or degree also replaced with designation to manage frontend easily
    description: String,
    startDate: String,
    endDate: String,
    currentlyWorking: Boolean,
    location: String,
  },
  { _id: false }
);

const LocationSchema = new Schema(
  {
    country: String,
    city: String,
  },
  { _id: false }
);

const SocialMediaSchema = new Schema(
  {
    platform: String,
    link: String,
  },
  { _id: false }
);

const AlumniAchievementsSchema = new Schema(
  {
    title: String,
    description: String,
    year: Number,
  },
  { _id: false }
);

// AlumniProfile Schema
const AlumniProfileSchema = new Schema(
  {
    alumniCategory: {
      type: String,
      enum: Object.values(AlumniCategory),
      required: true,
    },
    corporateInfo: [CorporateInfoSchema],
    researchInfo: [ResearchInfoSchema],
    academiaInfo: [AcademiaInfoSchema],
    administrationInfo: [AdministrationInfoSchema],
    businessInfo: [BusinessInfoSchema],
    otherInfo: [OtherInfoSchema],

  },
  { _id: false }
);

// Main Alumni Schema
const AlumniSchema = new Schema(
  {
    studentId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    email: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    contactNumber: { type: String, required: true },
    socialMedia: [SocialMediaSchema],
    willingTomentor: { type: Boolean, required: true },
    location: { type: LocationSchema, required: true },
    session: { type: String, required: true },
    achievements: [AlumniAchievementsSchema],
    portfolioLink: { type: String },
    alumniProfile: { type: AlumniProfileSchema, required: true },
    department: { type: String, required: true },
    faculty: { type: String, required: true },
    status: { type: String, enum: ['in-progress', 'blocked'],default: 'in-progress', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Alumni = mongoose.model<IAlumni>('Alumni', AlumniSchema);
