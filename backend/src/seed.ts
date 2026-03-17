import mongoose from "mongoose";
import dotenv from "dotenv";
import { AdminUser } from "./models/AdminUser";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stackx");
    console.log("Connected to MongoDB for seeding...");
  } catch (error: any) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists. Skipping seed.");
      process.exit(0);
    }

    // Create default admin
    const admin = new AdminUser({
      username: "admin",
      password: "password123", // Will be hashed automatically by pre-save hook
    });

    await admin.save();
    console.log("✅ Default admin user successfully created!");
    console.log("Username: admin");
    console.log("Password: password123");
    
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
