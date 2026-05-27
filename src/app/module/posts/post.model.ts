/* eslint-disable @typescript-eslint/no-explicit-any */
// ✅ Fix — type `this` explicitly
import { Schema, model, Query } from 'mongoose';
import { IPost } from './post.interface';

// ─── Media ────────────────────────────────────────────────────────────────────

const postMediaSchema = new Schema(
  {
    mediaType: {
      type: String,
      enum: ['image', 'video', 'link'],
      required: true,
    },
    url: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
  },
  { _id: false },
);

// ─── Reaction ─────────────────────────────────────────────────────────────────

const postReactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reactionType: {
      type: String,
      enum: ['like', 'love', 'insightful', 'support'],
      required: true,
    },
  },
  { _id: false },
);

// ─── Post ─────────────────────────────────────────────────────────────────────

const postSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    authorRole: {
      type: String,
      enum: ['student', 'alumni'],
      required: [true, 'Author role is required'],
    },
    type: {
      type: String,
      enum: ['blog', 'opportunity', 'course', 'seminar', 'general'],
      required: [true, 'Post type is required'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    media: [postMediaSchema],
    tags: [{ type: String, trim: true }],

    reactions: [postReactionSchema],

  reactionCounts: {
  type: Schema.Types.Mixed,
  default: () => ({
    like: 0,
    love: 0,
    insightful: 0,
    support: 0,
  }),
},

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: { type: Date, default: null },
    rejectionReason: { type: String, trim: true, default: null },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

postSchema.index({ status: 1 });
postSchema.index({ type: 1 });
postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ status: 1, type: 1 });

// ─── Soft delete ──────────────────────────────────────────────────────────────

postSchema.pre(/^find/, function (this: Query<any, any, any, any>, next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});


export const Post = model<IPost>('Post', postSchema);



