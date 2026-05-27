import { z } from 'zod';
// import { Types } from 'mongoose';

// ─── Helpers ──────────────────────────────────────────────────────────────────

// const objectId = z
//   .string()
//   .refine((val) => Types.ObjectId.isValid(val), { message: 'Invalid ObjectId' });

// ─── Media ────────────────────────────────────────────────────────────────────

const postMediaSchema = z.object({
  mediaType: z.enum(['image', 'video', 'link'], {
    required_error: 'Media type is required',
    invalid_type_error: 'Media type must be image, video, or link',
  }),
  url: z.string({ required_error: 'URL is required' }).trim().min(1, 'URL cannot be empty'),
  caption: z.string().trim().optional(),
});

// ─── Reaction ─────────────────────────────────────────────────────────────────

// const postReactionSchema = z.object({
//   userId: objectId,
//   reactionType: z.enum(['like', 'love', 'insightful', 'support'], {
//     required_error: 'Reaction type is required',
//     invalid_type_error: 'Reaction type must be like, love, insightful, or support',
//   }),
// });

// ─── Create Post ──────────────────────────────────────────────────────────────

export const createPostValidationSchema = z.object({
  body: z.object({
    type: z.enum(['blog', 'opportunity', 'course', 'seminar', 'general'], {
      required_error: 'Post type is required',
      invalid_type_error: 'Post type must be blog, opportunity, course, seminar, or general',
    }),
    title: z
      .string()
      .trim()
      .max(200, 'Title cannot exceed 200 characters')
      .optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(1, 'Description cannot be empty'),
    media: z.array(postMediaSchema).optional().default([]),
    tags: z.array(z.string().trim().min(1)).optional().default([]),
  }),
});

// ─── Update Post ──────────────────────────────────────────────────────────────

export const updatePostValidationSchema = z.object({
  body: z
    .object({
      title: z.string().trim().max(200, 'Title cannot exceed 200 characters').optional(),
      description: z.string().trim().min(1, 'Description cannot be empty').optional(),
      media: z.array(postMediaSchema).optional(),
      tags: z.array(z.string().trim().min(1)).optional(),
      type: z
        .enum(['blog', 'opportunity', 'course', 'seminar', 'general'])
        .optional(),
    })
    .strict(), // prevents injecting status, isDeleted, author, etc.
});



export const PostValidations = {
   createPostValidationSchema,
  updatePostValidationSchema,

};