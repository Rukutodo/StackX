import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: "", trim: true },
    category: { type: String, default: "General", trim: true },
    coverImage: { type: String, default: "" },
    content: { type: String, default: "" },
    author: { type: String, default: "StackX Team", trim: true },
    readingTime: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "draft",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
