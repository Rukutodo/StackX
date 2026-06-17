import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  roleId: Types.ObjectId;
  managerId: Types.ObjectId | null;
  department: string;
  jobTitle: string;
  status: "active" | "inactive";
  presence: "available" | "busy" | "away" | "offline";
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(entered: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    managerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    department: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    presence: { type: String, enum: ["available", "busy", "away", "offline"], default: "available" },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Verify a plaintext password against the stored hash
UserSchema.methods.matchPassword = async function (entered: string) {
  return bcrypt.compare(entered, this.password);
};

// Hash password before save when modified
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model<IUser>("User", UserSchema);
