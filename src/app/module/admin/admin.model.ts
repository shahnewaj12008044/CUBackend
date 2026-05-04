// =========================
// ADMIN MODEL
// =========================

import { Schema, model, Query } from 'mongoose'; // <-- 1. Import Query here
import { IAdmin, IAdminInvite } from './admin.interface';

const adminSchema = new Schema<IAdmin>(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    contactNo: {
      type: String,
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      default: 'admin',
      trim: true,
    },
    profileImg: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Query middleware to exclude soft‑deleted admins by default
// Query middleware to exclude soft‑deleted admins by default
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminSchema.pre(/^find/, function (this: Query<any, any, any, any>, next) { // <-- 2. Type 'this' explicitly
  this.find({ isDeleted: { $ne: true } });
  next();
});


export const Admin = model<IAdmin>('Admin', adminSchema);

//! Admin Invite Model

const adminInviteSchema = new Schema<IAdminInvite>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Auto-delete expired invites from DB
adminInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AdminInvite = model<IAdminInvite>('AdminInvite', adminInviteSchema);