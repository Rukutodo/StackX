import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import rolesRoutes from "./routes/roles";
import statsRoutes from "./routes/stats";
import tasksRoutes from "./routes/tasks";
import leaveRoutes from "./routes/leave";
import analyticsRoutes from "./routes/analytics";
import notificationsRoutes from "./routes/notifications";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  "http://localhost:3002",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.get("/", (_req, res) => {
  res.send("Employee Portal API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
