import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  certificateId: string;
  recipientName: string;
  courseOrRole: string;
  issueDate: Date;
  startDate?: Date;
  endDate?: Date;
  duration?: string;
  signature1Url?: string;
  signature2Url?: string;
  status: "valid" | "revoked";
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateId: { type: String, required: true, unique: true, trim: true },
    recipientName: { type: String, required: true, trim: true },
    courseOrRole: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: String, trim: true },
    signature1Url: { type: String, trim: true },
    signature2Url: { type: String, trim: true },
    status: {
      type: String,
      enum: ["valid", "revoked"],
      default: "valid",
    },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model<ICertificate>("Certificate", CertificateSchema);
