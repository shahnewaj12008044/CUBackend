// ✅ Removed: updateLinkedDataValidationSchema — belongs in User module
// ✅ Removed: userId from createStudent body — set by service, never from client
// ✅ Split: update into profile (student) + academic (admin) schemas

import { z } from 'zod';

const socialMediaSchema = z.object({
  platform: z.enum(['facebook', 'linkedin', 'github', 'twitter', 'website']),
  link: z.string().url('Invalid social media link'),
});

const achievementSchema = z.object({
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string().optional(),
  year: z.number({ required_error: 'Achievement year is required' }),
});

const studyInfoSchema = z.object({
  currentProgram: z.enum(['Bachelor', 'Masters', 'PhD']),
  currentYear: z.number({ required_error: 'Current year is required' }),
  semester: z.number().optional(),
});

// ── Create ─────────────────────────────────────────────────────────────────────
const createStudentValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    student: z.object({
      studentId: z.string().min(1, 'Student ID is required'),
      // ✅ Removed userId — never comes from client, set by service after User.create()
      name: z.string().min(1, 'Student name is required'),
      session: z.string().min(1, 'Session is required'),
      department: z.string().min(1, 'Department is required'),
      faculty: z.string().min(1, 'Faculty is required'),
      studyInfo: studyInfoSchema,
      contactNumber: z.string().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      socialMedia: z.array(socialMediaSchema).optional(),
      skills: z.array(z.string()).optional(),
      interests: z.array(z.string()).optional(),
      achievements: z.array(achievementSchema).optional(),
      bio: z.string().max(500).optional(),
      profileImage: z.string().url().optional(),
      cvLink: z.string().url().optional(),
      portfolioLink: z.string().url().optional(),
    }),
  }),
});

// ── Student updates own profile ────────────────────────────────────────────────
const updateStudentProfileValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).optional(),
      contactNumber: z.string().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      socialMedia: z.array(socialMediaSchema).optional(),
      skills: z.array(z.string()).optional(),
      interests: z.array(z.string()).optional(),
      achievements: z.array(achievementSchema).optional(),
      bio: z.string().max(500).optional(),
      profileImage: z.string().url().optional(),
      cvLink: z.string().url().optional(),
      portfolioLink: z.string().url().optional(),
    })
    .refine((d) => Object.keys(d).length > 0, {
      message: 'At least one field must be provided',
    }),
});

// ── Admin updates academic fields ──────────────────────────────────────────────
const adminUpdateStudentValidationSchema = z.object({
  body: z
    .object({
      session: z.string().min(1).optional(),
      department: z.string().min(1).optional(),
      faculty: z.string().min(1).optional(),
      studyInfo: studyInfoSchema.partial().optional(),
    })
    .refine((d) => Object.keys(d).length > 0, {
      message: 'At least one field must be provided',
    }),
});



export const StudentValidations = {
  createStudentValidationSchema,
  updateStudentProfileValidationSchema,
  adminUpdateStudentValidationSchema,

};