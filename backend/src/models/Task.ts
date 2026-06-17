import mongoose, { Schema, Document, Types } from "mongoose";

export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeIds: Types.ObjectId[];
  createdById: Types.ObjectId; // the assigner
  dueDate: Date | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["backlog", "todo", "in_progress", "review", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    // One or more assignees
    assigneeIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // Who created / assigned the task
    createdById: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);
