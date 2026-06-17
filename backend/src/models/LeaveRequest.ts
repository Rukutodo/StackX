import mongoose, { Schema, Document, Types } from "mongoose";

export type LeaveType = "sick" | "vacation" | "personal" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface ILeaveRequest extends Document {
  userId: Types.ObjectId;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  approverId: Types.ObjectId | null;
  decisionNote: string;
  decidedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["sick", "vacation", "personal", "other"], default: "vacation" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approverId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    decisionNote: { type: String, default: "" },
    decidedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const LeaveRequest = mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);
