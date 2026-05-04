// src/modules/admin/admin.validation.ts

import { z } from 'zod';

const nameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),
});

const createAdminValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password cannot exceed 64 characters'),

    admin: z.object({
      adminId: z.string().min(1, 'Admin ID is required'),
      name: nameValidationSchema,
      designation: z.string().min(1, 'Designation is required').optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      profileImg: z.string().url('Invalid profile image URL').optional(),
    }),
  }),
});
const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z
      .object({
        name: nameValidationSchema.partial().optional(),
        designation: z.string().min(1, 'Designation cannot be empty').optional(),
        contactNo: z.string().optional(),
        emergencyContactNo: z.string().optional(),
        profileImg: z.string().url('Invalid profile image URL').optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
      }),
  }),
});
const inviteAdminValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const registerViaInviteValidationSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Invite token is required'),
    password: z.string().min(8).max(64),
    admin: z.object({
      adminId: z.string().min(1, 'Admin ID is required'),
      name: nameValidationSchema,
      designation: z.string().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      profileImg: z.string().url().optional(),
    }),
  }),
});

export const AdminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,

  inviteAdminValidationSchema,
  registerViaInviteValidationSchema
};