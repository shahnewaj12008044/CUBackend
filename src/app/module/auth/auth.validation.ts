import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z
    .object({
      id: z.string().optional(),
      email: z.string().email('Invalid email format').optional(),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    })
    .refine((data) => data.id || data.email, {
      message: 'Either id or email is required',
    }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    otp: z.string().min(6, 'OTP must be at least 6 characters'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});



const studentSocialMediaValidationSchema = z.object({
  platform: z.enum(['facebook', 'linkedin', 'github', 'twitter', 'website']),
  link: z.string().url('Invalid social media link'),
});

const studentAchievementValidationSchema = z.object({
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string().optional(),
  year: z.number({
    required_error: 'Achievement year is required',
  }),
});

const studentStudyInfoValidationSchema = z.object({
  currentProgram: z.enum(['Bachelor', 'Masters', 'PhD']),
  currentYear: z.number({
    required_error: 'Current year is required',
  }),
  semester: z.number().optional(),
});

const registerStudentValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    student: z.object({
      studentId: z.string().min(1, 'Student ID is required'),
      name: z.string().min(1, 'Student name is required'),
      session: z.string().min(1, 'Session is required'),
      department: z.string().min(1, 'Department is required'),
      faculty: z.string().min(1, 'Faculty is required'),
      studyInfo: studentStudyInfoValidationSchema,

      contactNumber: z.string().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),

      socialMedia: z.array(studentSocialMediaValidationSchema).optional(),
      skills: z.array(z.string()).optional(),
      interests: z.array(z.string()).optional(),
      achievements: z.array(studentAchievementValidationSchema).optional(),

      bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
      profileImage: z.string().url('Invalid profile image URL').optional(),
      cvLink: z.string().url('Invalid CV URL').optional(),
      portfolioLink: z.string().url('Invalid portfolio URL').optional(),
    }),
  }),
});

  

export const AuthValidations = {
  loginValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
  registerStudentValidationSchema,

};