import mongoose, { Schema, Document } from "mongoose";
import { ALL_PERMISSIONS } from "../lib/permissions";

export interface IRole extends Document {
  slug: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    permissions: [{ type: String, enum: ALL_PERMISSIONS }],
    // system roles (admin/manager/developer) cannot be deleted
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>("Role", RoleSchema);
