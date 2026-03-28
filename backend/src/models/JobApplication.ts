import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  resume: string;
  portfolioLink: string;
  linkedIn: string;
  coverLetter: string;
  status: "new" | "reviewed" | "shortlisted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    experience: { type: String, default: "" },
    resume: { type: String, default: "" },
    portfolioLink: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    coverLetter: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "shortlisted", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
