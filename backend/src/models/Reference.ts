import mongoose from "mongoose";

const referenceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    keywords: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    canonical: { type: String, trim: true },
    robots: { 
      type: String, 
      default: "index, follow",
      trim: true 
    },
    focusKeyword: { type: String, trim: true },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Reference = mongoose.model("Reference", referenceSchema);
