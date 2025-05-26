// import { Schema } from "mongoose";










// export enum AlumniCategory {
//   CORPORATE = 'corporate',
//   RESEARCH = 'research',
//   ACADEMIA = 'academia',
//   ADMINISTRATION = 'administration',
//   BUSSINESS = 'business',
//   OTHER = 'other',
// }

// const AlumniLocationSchema = new Schema({
//   country: String,
//   city: String,
// }, { _id: false });

// const CorporateInfoSchema = new Schema({
//   company: String,
//   designation: String,
//   description: String,
//   startDate: Date,
//   endDate: Date,
//   currentlyWorking: Boolean,
// }, { _id: false });

// const ResearchInfoSchema = new Schema({
//   institution: String,
//   researchArea: String,
//   degree: { type: String, enum: ['MS', 'PhD'] },
//   supervisor: String,
//   startDate: Date,
//   endDate: Date,
//   currentlyWorking: Boolean,
//   description: String,
// }, { _id: false });

// const AcademiaInfoSchema = new Schema({
//   university: String,
//   title: String,
//   department: String,
//   startDate: Date,
//   endDate: Date,
//   currentlyWorking: Boolean,
//   description: String,
// }, { _id: false });

// const AdministrationInfoSchema = new Schema({
//   organization: String,
//   position: String,
//   startDate: Date,
//   endDate: Date,
//   currentlyWorking: Boolean,
//   description: String,
// }, { _id: false });

// const BusinessInfoSchema = new Schema({
//   businessName: String,
//   startDate: Date,
//   endDate: Date,
//   currentlyWorking: Boolean,
//   description: String,
//   location: String,
//   website: String,
// }, { _id: false });

// const OtherInfoSchema = new Schema({
//   title: String,
//   description: String,
//   startDate: Date,
//   endDate: Date,
//   currentlyWorking: Boolean,
//   location: String,
// }, { _id: false });

// const AlumniProfileSchema = new Schema({
//   alumniCategory: { type: String, enum: Object.values(AlumniCategory),  required: [true, 'alumniCategory is required'] },
//   corporateInfo: [CorporateInfoSchema],
//   researchInfo: [ResearchInfoSchema],
//   academiaInfo: [AcademiaInfoSchema],
//   administrationInfo: [AdministrationInfoSchema],
//   businessInfo: [BusinessInfoSchema],
//   otherInfo: [OtherInfoSchema],
//   currentlocation: AlumniLocationSchema,
//   willingToMentor: Boolean,
// }, { _id: false });


import mongoose, { Schema } from 'mongoose';

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
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean,
  },
  { _id: false }
);

const ResearchInfoSchema = new Schema(
  {
    institution: String,
    researchArea: [String],
    degree: { type: String, enum: ['MS', 'PhD'] },
    supervisor: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean,
    description: String,
  },
  { _id: false }
);

const AcademiaInfoSchema = new Schema(
  {
    university: String,
    position: String,
    department: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean,
    description: String,
  },
  { _id: false }
);

const AdministrationInfoSchema = new Schema(
  {
    organization: String,
    position: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean,
    description: String,
  },
  { _id: false }
);

const BusinessInfoSchema = new Schema(
  {
    businessName: String,
    startDate: Date,
    endDate: Date,
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
    description: String,
    startDate: Date,
    endDate: Date,
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
    currentlocation: LocationSchema,
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
    status: { type: String, enum: ['in-progress', 'blocked'], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Alumni', AlumniSchema);
