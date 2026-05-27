
import { Schema, model } from 'mongoose';
import { IStudent } from './student.interface';

const socialMediaSchema = new Schema(
  {
    platform: {
      type: String,
      enum: ['facebook', 'linkedin', 'github', 'twitter', 'website'],
      required: [true, 'Social media platform is required'],
      trim: true,
    },
    link: {
      type: String,
      required: [true, 'Social media link is required'],
      trim: true,
    },
  },
  { _id: false },
);

const achievementSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    description: { type: String, trim: true },
    year: {
      type: Number,
      required: [true, 'Achievement year is required'],
    },
  },
  { _id: false },
);

const studyInfoSchema = new Schema(
  {
    currentProgram: {
      type: String,
      enum: ['Bachelor', 'Masters', 'PhD'],
      required: [true, 'Current program is required'],
    },
    currentYear: {
      type: Number,
      required: [true, 'Current year is required'],
      min: [1, 'Current year must be at least 1'],
    },
    semester: {
      type: Number,
      min: [1, 'Semester must be at least 1'],
    },
  },
  { _id: false },
);

const studentSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    session: {
      type: String,
      required: [true, 'Session is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    faculty: {
      type: String,
      required: [true, 'Faculty is required'],
      trim: true,
    },
    studyInfo: {
      type: studyInfoSchema,
      required: [true, 'Study info is required'],
    },
    contactNumber: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    socialMedia: [socialMediaSchema],
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    achievements: [achievementSchema],
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    profileImage: { type: String, trim: true },
    cvLink: { type: String, trim: true },
    portfolioLink: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

studentSchema.index({ department: 1 });
studentSchema.index({ faculty: 1 });
studentSchema.index({ session: 1 });

const Student = model<IStudent>('Student', studentSchema);
export default Student;