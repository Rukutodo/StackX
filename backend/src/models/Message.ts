import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  description: string;
  timeline: string;
  status: "unread" | "read" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    service: { type: String, required: true },
    budget: { type: String, default: "" },
    description: { type: String, required: true },
    timeline: { type: String, default: "" },
    status: { type: String, enum: ["unread", "read", "archived"], default: "unread" },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
