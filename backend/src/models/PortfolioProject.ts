import mongoose from "mongoose";

const resultMetricSchema = new mongoose.Schema(
  {
    metric: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    projectType: { type: String, default: "" },
  },
  { _id: false }
);

const caseStudySchema = new mongoose.Schema(
  {
    subtitle: { type: String, default: "" },
    overview: { type: String, default: "" },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    features: { type: [String], default: [] },
    results: { type: [resultMetricSchema], default: [] },
    testimonial: { type: testimonialSchema, default: null },
  },
  { _id: false }
);

const portfolioProjectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: "" }, // path to uploaded image
    techStack: { type: [String], default: [] },
    result: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "completed", "draft"],
      default: "active",
    },
    order: { type: Number, default: 0 },
    caseStudy: { type: caseStudySchema, default: null },
  },
  { timestamps: true }
);

export const PortfolioProject = mongoose.model("PortfolioProject", portfolioProjectSchema);
