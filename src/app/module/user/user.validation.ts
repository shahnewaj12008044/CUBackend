import { z } from 'zod';

const updateMyAccountValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email must be a string',
      })
      .email('Invalid email format')
      .trim()
      .optional(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({
        required_error: 'Old password is required',
      })
      .min(1, 'Old password cannot be empty'),

    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'New password must be at least 6 characters'),
  }),
});

const adminUpdateUserValidationSchema = z.object({
  body: z
    .object({
      role: z.enum(['student', 'teacher', 'alumni', 'admin']).optional(),
      status: z.enum(['active', 'blocked', 'pending']).optional(),
      isDeleted: z.boolean().optional(),
      isVerified: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const UserValidations = {
  updateMyAccountValidationSchema,
  changePasswordValidationSchema,
  adminUpdateUserValidationSchema,
};