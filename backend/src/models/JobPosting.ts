import mongoose, { Schema, Document } from "mongoose";

export interface IJobPosting extends Document {
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  status: "active" | "draft" | "archived";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobPostingSchema = new Schema<IJobPosting>(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const JobPosting = mongoose.model<IJobPosting>("JobPosting", JobPostingSchema);
