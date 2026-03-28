import mongoose from "mongoose";

const accordionItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false }
);

const serviceCategorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    icon: { type: String, default: "HiCode", trim: true }, // icon name from react-icons/hi
    tagline: { type: String, required: true, trim: true },
    pricing: { type: String, required: true, trim: true }, // e.g. "$3,000"
    techStack: { type: [String], default: [] },
    items: { type: [accordionItemSchema], default: [] },
    caseStudy: { type: caseStudySchema, default: null },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ServiceCategory = mongoose.model("ServiceCategory", serviceCategorySchema);
