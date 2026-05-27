import { z } from 'zod';
import { AlumniCategory } from './alumni.interface';

const corporateInfoSchema = z.object({
  company: z.string().min(1),
  designation: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
});

const researchInfoSchema = z.object({
  institution: z.string().min(1),
  researchArea: z.array(z.string()).min(1),
  designation: z.enum(['MS', 'PhD', 'Postdoc', 'Research Associate', 'Other']),
  supervisor: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
});

const academiaInfoSchema = z.object({
  institution: z.string().min(1),
  designation: z.string().min(1),
  department: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
});

const administrationInfoSchema = z.object({
  organization: z.string().min(1),
  designation: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
});

const businessInfoSchema = z.object({
  businessName: z.string().min(1),
  designation: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
});

const otherInfoSchema = z.object({
  title: z.string().min(1),
  designation: z.string().optional(),
  description: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  location: z.string().optional(),
});

const locationSchema = z.object({
  country: z.string().min(1),
  city: z.string().min(1),
});

const onlinePresenceSchema = z.object({
  platform: z.string().min(1),
  link: z.string().url('Invalid URL'),
});

const achievementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
});

const alumniProfileSchema = z.object({
  alumniCategory: z.nativeEnum(AlumniCategory),
  corporateInfo: z.array(corporateInfoSchema).optional(),
  researchInfo: z.array(researchInfoSchema).optional(),
  academiaInfo: z.array(academiaInfoSchema).optional(),
  administrationInfo: z.array(administrationInfoSchema).optional(),
  businessInfo: z.array(businessInfoSchema).optional(),
  otherInfo: z.array(otherInfoSchema).optional(),
});

// ── For admin creating alumni manually ──

export const createAlumniSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),

    alumni: z.object({
      studentId: z.string().min(1),
      name: z.string().min(1),
      gender: z.enum(['male', 'female', 'other']),
      graduationYear: z.number().int().min(1900).max(new Date().getFullYear()),
      contactNumber: z.string().min(1),
      session: z.string().min(1),
      department: z.string().min(1),
      faculty: z.string().min(1),
      willingToMentor: z.boolean(),

      location: locationSchema,
      onlinePresence: z.array(onlinePresenceSchema).optional(),
      achievements: z.array(achievementSchema).optional(),
      portfolioLink: z.string().url().optional(),
      bio: z.string().optional(),

      alumniProfile: alumniProfileSchema,
    }),
  }),
});


// ── For alumni updating their own profile ──
const updateAlumniSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      graduationYear: z.number().int().optional(),
      contactNumber: z.string().min(1).optional(),
      session: z.string().optional(),
      department: z.string().optional(),
      faculty: z.string().optional(),
      willingToMentor: z.boolean().optional(),
      location: locationSchema.partial().optional(),
      onlinePresence: z.array(onlinePresenceSchema).optional(),
      achievements: z.array(achievementSchema).optional(),
      portfolioLink: z.string().url().optional(),
      bio: z.string().optional(),
      alumniProfile: alumniProfileSchema.partial().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

// ── For updating linked User fields ──
const updateAlumniLinkedSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      status: z.enum(['active', 'blocked', 'pending']).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const alumniValidation = {
  createAlumniSchema,
  updateAlumniSchema,
  updateAlumniLinkedSchema,
};