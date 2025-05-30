import { z } from 'zod';

const socialMediaSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  link: z.string().url('Invalid URL'),
});

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
});

const studyInfoSchema = z.object({
  CurrentProgram: z.enum(['Bachelor', 'Masters', 'PhD', 'Alumni']),
  year: z.number().min(1),
  semester: z.number().min(1).optional(),
});

const studentSchema = z.object({
  studentId: z
    .string()
    .regex(/^\d+$/, { message: 'Student ID must be numeric string only' }),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  socialMedia: z.array(socialMediaSchema).optional(),
  contactNumber: z.string().min(10, 'Contact number is required'),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  gender: z.enum(['male', 'female', 'other']),
  session: z.string().min(4),
  cvLink: z.string().url().optional(),
  portFolioLink: z.string().url().optional(),
  achievements: z.array(achievementSchema).optional(),
  studyInfo: studyInfoSchema,
  department: z.string(),
  faculty: z.string(),

});

export const studentSignupValidationSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    student: studentSchema,
  }),
});

export const studentalidations = {
  studentSignupValidationSchema,
};
