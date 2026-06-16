import mongoose, { Schema, Document, Types } from "mongoose";

export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export const TASK_STATUSES: TaskStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
];
export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];

export interface ITask extends Document {
  title: string;
  description: string;
  assignee: Types.ObjectId | null;
  reporter: Types.ObjectId;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  labels: string[];
  order: number;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    assignee: { type: Schema.Types.ObjectId, ref: "AdminUser", default: null },
    reporter: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "todo",
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "medium",
    },
    dueDate: { type: Date },
    labels: [{ type: String }],
    // position within its status column (lower = higher in the column)
    order: { type: Number, default: 0 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Common query paths: by assignee, by status (for the board)
TaskSchema.index({ assignee: 1, status: 1 });
TaskSchema.index({ status: 1, order: 1 });

export const Task = mongoose.model<ITask>("Task", TaskSchema);
