import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  company: string;
  role: string;
  feedback: string;
  rating: number;
  projectType: string;
  status: "active" | "pending" | "archived";
  order: number;
  portfolioProject: {
    id: string;
    slug: string;
    title: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name:        { type: String, required: true, trim: true },
    company:     { type: String, required: true, trim: true },
    role:        { type: String, default: "" },
    feedback:    { type: String, required: true },
    rating:      { type: Number, min: 1, max: 5, default: 5 },
    projectType: { type: String, default: "" },
    status:      { type: String, enum: ["active", "pending", "archived"], default: "active" },
    order:       { type: Number, default: 0 },
    portfolioProject: {
      id:    { type: String, default: null },
      slug:  { type: String, default: null },
      title: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
