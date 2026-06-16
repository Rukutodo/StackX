import mongoose, { Schema, Document, Types } from "mongoose";

export type LeaveType = "sick" | "vacation" | "personal" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected";

export const LEAVE_TYPES: LeaveType[] = ["sick", "vacation", "personal", "other"];
export const LEAVE_STATUSES: LeaveStatus[] = ["pending", "approved", "rejected"];

export interface ILeave extends Document {
  user: Types.ObjectId;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: Types.ObjectId | null;
  reviewNote?: string;
  reviewedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveSchema = new Schema<ILeave>(
  {
    user: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    type: {
      type: String,
      enum: LEAVE_TYPES,
      default: "vacation",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: LEAVE_STATUSES,
      default: "pending",
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "AdminUser", default: null },
    reviewNote: { type: String, default: "" },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

LeaveSchema.index({ user: 1, status: 1 });
LeaveSchema.index({ status: 1, startDate: -1 });

export const Leave = mongoose.model<ILeave>("Leave", LeaveSchema);
