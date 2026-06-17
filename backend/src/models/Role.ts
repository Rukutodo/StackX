import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    permissions: [{ type: String }],
    // System roles (Admin / Manager / Employee) are seeded and cannot be deleted.
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>("Role", RoleSchema);
