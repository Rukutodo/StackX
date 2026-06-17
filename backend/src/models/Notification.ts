import mongoose, { Schema, Document, Types } from "mongoose";

export type NotificationType =
  | "task_assigned"
  | "task_updated"
  | "task_moved"
  | "leave_requested"
  | "leave_decision";

export interface INotification extends Document {
  userId: Types.ObjectId; // recipient
  type: NotificationType;
  message: string;
  actorId: Types.ObjectId | null;
  actorName: string;
  link: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["task_assigned", "task_updated", "task_moved", "leave_requested", "leave_decision"],
      required: true,
    },
    message: { type: String, required: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    actorName: { type: String, default: "" },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
