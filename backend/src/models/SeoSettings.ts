import mongoose, { Schema, Document } from "mongoose";

export interface ISeoSettings extends Document {
  pageKey: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  robots: string;
  canonical: string;
  jsonLdOverrides: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const SeoSettingsSchema = new Schema<ISeoSettings>(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title:              { type: String, default: "", trim: true },
    description:        { type: String, default: "", trim: true },
    keywords:           { type: [String], default: [] },
    ogTitle:            { type: String, default: "", trim: true },
    ogDescription:      { type: String, default: "", trim: true },
    ogImage:            { type: String, default: "", trim: true },
    twitterTitle:       { type: String, default: "", trim: true },
    twitterDescription: { type: String, default: "", trim: true },
    robots:             { type: String, default: "index, follow", trim: true },
    canonical:          { type: String, default: "", trim: true },
    jsonLdOverrides:    { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const SeoSettings = mongoose.model<ISeoSettings>("SeoSettings", SeoSettingsSchema);
