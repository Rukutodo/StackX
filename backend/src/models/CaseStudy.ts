import mongoose, { Schema, Document } from "mongoose";

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  client: string;
  service: string;
  subtitle: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  results: { metric: string; label: string }[];
  images: string[];
  featured: boolean;
  status: "active" | "draft" | "archived";
  order: number;
  portfolioProject: { id: string; slug: string; title: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title:    { type: String, required: true, trim: true },
    slug:     { type: String, required: true, unique: true, trim: true },
    client:   { type: String, default: "" },
    service:  { type: String, default: "" },
    subtitle: { type: String, default: "" },
    overview: { type: String, default: "" },
    problem:  { type: String, default: "" },
    solution: { type: String, default: "" },
    features: [{ type: String }],
    results:  [{ metric: { type: String }, label: { type: String } }],
    images:   [{ type: String }],
    featured: { type: Boolean, default: false },
    status:   { type: String, enum: ["active", "draft", "archived"], default: "draft" },
    order:    { type: Number, default: 0 },
    portfolioProject: {
      id:    { type: String, default: null },
      slug:  { type: String, default: null },
      title: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export const CaseStudy = mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);
