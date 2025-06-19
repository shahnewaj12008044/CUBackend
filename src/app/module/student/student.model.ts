import { Schema, model} from 'mongoose';
import { IStudent } from './student.interface';
import { applySoftDeleteFilter } from '../../utils/applySoftDeleteFilter';

// Enums


// Sub-schemas

const SocialMediaSchema = new Schema({
  platform: { type: String, required: [true, 'Socialmedia Platform is required'] },
  link: { type: String, required: true },
}, { _id: false });

const AchievementSchema = new Schema({
  title: { type: String,  required: [true, 'achievement title is required'] },
  description: String,
  year: { type: Number,  required: [true, 'achievement year is required'] },
}, { _id: false });

const studentStudyInfoSchema = new Schema({
  CurrentProgram: { type: String, enum: ['Bachelor', 'Masters', 'PhD'], required: [true, 'Current Program is required'] },
  year: { type: Number, required: [true, 'year is required'] },
  semester: Number,
}, { _id: false }); 

// Main Student Schema

const StudentSchema = new Schema({
  studentId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required:[ true, 'name is required'] },
  email: { type: String, required: [true, 'email is required'] },
  socialMedia: [SocialMediaSchema],
  contactNumber: { type: String, required: [true, 'contact number is required'] },
  skills: [String],
  interests: [String],
  gender: { type: String, enum: ['male', 'female', 'other'], required: [true, 'gender is required'] },
  session: { type: String, required: [true, 'session is required'] },

  cvLink: String,
  portFolioLink: String,
  achievements: [AchievementSchema],
  studyInfo: studentStudyInfoSchema,
  // isAlumni: { type: Boolean, required: true },
  // alumniData: AlumniProfileSchema,
  department: { type: String, required: true },
  faculty: { type: String, required: true },
  status: { type: String, enum: ['in-progress', 'blocked'], default: 'in-progress' },
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: true,
});


const queryMiddleware = ['find', 'findOne', 'count', 'countDocuments'];
for (const method of queryMiddleware) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  StudentSchema.pre(method as any, applySoftDeleteFilter);
}


const Student = model<IStudent>( 'Student', StudentSchema);

export default Student;






//!example data 
/*
!I have separated student and alumni models because in the long run i want to create a separate club where alumni data will be crucial and it will be easier to manage alumni data separately.it will be faster to run queries and also it will be easier to manage alumni data separately.

 */