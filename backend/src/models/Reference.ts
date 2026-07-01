import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

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

    // ── SEO Override Fields ──
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    description: { type: String, trim: true }, // Short fallback description
    keywords: { type: String, trim: true },
    focusKeyword: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    canonical: { type: String, trim: true },
    robots: {
      type: String,
      default: "index, follow",
      trim: true,
    },
    noIndex: { type: Boolean, default: false },

    // ── Rich Content ──
    content: { type: String, trim: true }, // Markdown/HTML long-form content

    // ── Location Fields ──
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, default: "India", trim: true },

    // ── FAQ Module ──
    faqs: { type: [faqSchema], default: [] },

    // ── Linking ──
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
    relatedReferences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reference",
      },
    ],

    // ── Status & Ordering ──
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
