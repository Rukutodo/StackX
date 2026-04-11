import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import servicesRoutes from "./routes/services";
import portfolioRoutes from "./routes/portfolio";
import jobsRoutes from "./routes/jobs";
import applicationsRoutes from "./routes/applications";
import messagesRoutes from "./routes/messages";
import testimonialsRoutes from "./routes/testimonials";
import statsRoutes from "./routes/stats";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://129.159.236.176:3000", "http://129.159.236.176:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files — use process.cwd() so path resolves correctly
// whether running via ts-node (dev) or compiled JS (production)
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/stats", statsRoutes);

// Basic health check
app.get("/", (req, res) => {
  res.send("StackX Backend API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
