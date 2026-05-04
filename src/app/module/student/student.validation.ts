import { z } from 'zod';

const socialMediaValidationSchema = z.object({
  platform: z.enum(['facebook', 'linkedin', 'github', 'twitter', 'website']),
  link: z.string().url('Invalid social media link'),
});

const achievementValidationSchema = z.object({
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string().optional(),
  year: z.number({
    required_error: 'Achievement year is required',
  }),
});

const studyInfoValidationSchema = z.object({
  currentProgram: z.enum(['Bachelor', 'Masters', 'PhD']),
  currentYear: z.number({
    required_error: 'Current year is required',
  }),
  semester: z.number().optional(),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    userId: z.string().min(1, 'User ID is required'),
    name: z.string().min(1, 'Student name is required'),
    session: z.string().min(1, 'Session is required'),
    department: z.string().min(1, 'Department is required'),
    faculty: z.string().min(1, 'Faculty is required'),
    studyInfo: studyInfoValidationSchema,

    contactNumber: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),

    socialMedia: z.array(socialMediaValidationSchema).optional(),
    skills: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    achievements: z.array(achievementValidationSchema).optional(),

    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    profileImage: z.string().url('Invalid profile image URL').optional(),
    cvLink: z.string().url('Invalid CV URL').optional(),
    portfolioLink: z.string().url('Invalid portfolio URL').optional(),
  }),
});

const updateStudentValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Student name cannot be empty').optional(),
      contactNumber: z.string().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),

      socialMedia: z.array(socialMediaValidationSchema).optional(),
      skills: z.array(z.string()).optional(),
      interests: z.array(z.string()).optional(),
      achievements: z.array(achievementValidationSchema).optional(),

      bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
      profileImage: z.string().url('Invalid profile image URL').optional(),
      cvLink: z.string().url('Invalid CV URL').optional(),
      portfolioLink: z.string().url('Invalid portfolio URL').optional(),

      session: z.string().min(1, 'Session cannot be empty').optional(),
      department: z.string().min(1, 'Department cannot be empty').optional(),
      faculty: z.string().min(1, 'Faculty cannot be empty').optional(),
      studyInfo: studyInfoValidationSchema.partial().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

const getSingleStudentValidationSchema = z.object({
  params: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
  }),
});

export const StudentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
  getSingleStudentValidationSchema,
};