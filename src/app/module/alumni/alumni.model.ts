/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from 'mongoose';
import { IAlumni, AlumniCategory } from './alumni.interface';
import { applySoftDeleteFilter } from '../../utils/applySoftDeleteFilter';

const CorporateInfoSchema = new Schema(
  {
    company: { type: String, required: true },
    designation: { type: String, required: true },
    description: String,
    startDate: { type: String, required: true },
    endDate: String,                // ✅ optional
    currentlyWorking: { type: Boolean, default: false },
  },
  { _id: false },
);

const ResearchInfoSchema = new Schema(
  {
    institution: { type: String, required: true },
    researchArea: [{ type: String }],
    designation: {
      type: String,
      enum: ['MS', 'PhD', 'Postdoc', 'Research Associate', 'Other'],
      required: true,
    },
    supervisor: String,
    startDate: { type: String, required: true },
    endDate: String,               
    currentlyWorking: { type: Boolean, default: false },
    description: String,
  },
  { _id: false },
);

const AcademiaInfoSchema = new Schema(
  {
    institution: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: String,              
    currentlyWorking: { type: Boolean, default: false },
    description: String,
  },
  { _id: false },
);

const AdministrationInfoSchema = new Schema(
  {
    organization: { type: String, required: true },
    designation: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: String,             
    currentlyWorking: { type: Boolean, default: false },
    description: String,
  },
  { _id: false },
);

const BusinessInfoSchema = new Schema(
  {
    businessName: { type: String, required: true },
    designation: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: String,                // ✅ optional
    currentlyWorking: { type: Boolean, default: false },
    description: String,
    location: String,
    website: String,
  },
  { _id: false },
);

const OtherInfoSchema = new Schema(
  {
    title: { type: String, required: true },
    designation: String,
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: String,                // ✅ optional
    currentlyWorking: { type: Boolean, default: false },
    location: String,
  },
  { _id: false },
);

const LocationSchema = new Schema(
  {
    country: { type: String, required: true },
    city: { type: String, required: true },
  },
  { _id: false },
);

const OnlinePresenceSchema = new Schema(
  {
    platform: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false },
);

const AlumniAchievementSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { _id: false },
);

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
  { _id: false },
);

const AlumniSchema = new Schema<IAlumni>(
  {
    studentId: { type: String, required: true, unique: true }, 
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
   
    name: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    graduationYear: { type: Number, required: true },
    contactNumber: { type: String, required: true },
    session: { type: String, required: true },
    department: { type: String, required: true },
    faculty: { type: String, required: true },

    willingToMentor: { type: Boolean, required: true },  
    location: { type: LocationSchema, required: true },
    onlinePresence: [OnlinePresenceSchema],
    achievements: [AlumniAchievementSchema],            
    portfolioLink: String,
    bio: String,                                       
    alumniProfile: { type: AlumniProfileSchema, required: true },
  },
  { timestamps: true },
);

const queryMiddleware = ['find', 'findOne', 'findOneAndUpdate', 'count', 'countDocuments'];
for (const method of queryMiddleware) {
  AlumniSchema.pre(method as any, applySoftDeleteFilter);
}

const Alumni = mongoose.model<IAlumni>('Alumni', AlumniSchema);
export default Alumni;