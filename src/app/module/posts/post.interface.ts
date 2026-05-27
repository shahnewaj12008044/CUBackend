import { Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type TPostStatus = 'pending' | 'approved' | 'rejected';
export type TReactionType = 'like' | 'love' | 'insightful' | 'support';
export type TAuthorRole = 'student' | 'alumni';
export type TPostType = 'blog' | 'opportunity' | 'course' | 'seminar' | 'general';

export type TMediaType = 'image' | 'video' | 'link';  // ✅ simplified — image, video, external link

// ─── Media ────────────────────────────────────────────────────────────────────

export interface IPostMedia {
  mediaType: TMediaType;
  url: string;
  caption?: string;  // ✅ caption per media item
}

// ─── Reaction ─────────────────────────────────────────────────────────────────

export interface IPostReaction {
  userId: Types.ObjectId;
  reactionType: TReactionType;
}

// ─── Main Post ────────────────────────────────────────────────────────────────

export interface IPost {
  author: Types.ObjectId;        // ref: User
  authorRole: TAuthorRole;
  type: TPostType;               // category tag only — no structural difference

  title?: string;                // optional — not every post needs a title
  description: string;           // main caption / post body

  media?: IPostMedia[];          // image, video, or external links

  tags?: string[];               // e.g. ['machine learning', 'internship']

  reactions: IPostReaction[];
  reactionCounts: Record<TReactionType, number>;
  commentCount: number;

  status: TPostStatus;
  approvedBy?: Types.ObjectId;   // ref: User (admin)
  approvedAt?: Date;
  rejectionReason?: string;

  isDeleted: boolean;
}

