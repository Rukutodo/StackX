import express from "express";
import { ServiceCategory } from "../models/ServiceCategory";
import { PortfolioProject } from "../models/PortfolioProject";
import { JobPosting } from "../models/JobPosting";
import { JobApplication } from "../models/JobApplication";
import { Message } from "../models/Message";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── GET /api/stats ────────────────────────────────
// Protected: dashboard overview stats
router.get("/", protect, async (_req, res) => {
  try {
    const [
      totalServices,
      totalProjects,
      activeProjects,
      totalJobs,
      activeJobs,
      totalApplications,
      newApplications,
      totalMessages,
      unreadMessages,
      recentApplications,
      recentJobs,
      recentMessages,
    ] = await Promise.all([
      ServiceCategory.countDocuments(),
      PortfolioProject.countDocuments(),
      PortfolioProject.countDocuments({ status: { $in: ["active", "completed"] } }),
      JobPosting.countDocuments(),
      JobPosting.countDocuments({ status: "active" }),
      JobApplication.countDocuments(),
      JobApplication.countDocuments({ status: "new" }),
      Message.countDocuments(),
      Message.countDocuments({ status: "unread" }),
      JobApplication.find().sort({ createdAt: -1 }).limit(5).lean(),
      JobPosting.find().sort({ createdAt: -1 }).limit(5).lean(),
      Message.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Build recent activity from latest applications, jobs, and messages
    const activity: Array<{ action: string; detail: string; time: string; dot: string; ts: number }> = [];

    for (const app of recentApplications) {
      activity.push({
        action: "Application submitted",
        detail: `${app.fullName} applied for ${app.position}`,
        time: formatRelative(app.createdAt),
        dot: "bg-cyan-400",
        ts: new Date(app.createdAt).getTime(),
      });
    }

    for (const job of recentJobs) {
      activity.push({
        action: "Job posting created",
        detail: `${job.title} position published`,
        time: formatRelative(job.createdAt),
        dot: "bg-amber-400",
        ts: new Date(job.createdAt).getTime(),
      });
    }

    for (const msg of recentMessages) {
      activity.push({
        action: "New message received",
        detail: `${msg.name} — ${msg.service}`,
        time: formatRelative(msg.createdAt),
        dot: "bg-primary",
        ts: new Date(msg.createdAt).getTime(),
      });
    }

    // Sort by timestamp descending (most recent first)
    activity.sort((a, b) => b.ts - a.ts);

    res.json({
      counts: {
        totalServices,
        totalProjects,
        activeProjects,
        totalJobs,
        activeJobs,
        totalApplications,
        newApplications,
        totalMessages,
        unreadMessages,
      },
      recentApplications: recentApplications.map((a) => ({
        _id: a._id,
        fullName: a.fullName,
        email: a.email,
        position: a.position,
        status: a.status,
        createdAt: a.createdAt,
      })),
      recentJobs: recentJobs.map((j) => ({
        _id: j._id,
        title: j.title,
        department: j.department,
        type: j.type,
        status: j.status,
        createdAt: j.createdAt,
      })),
      recentMessages: recentMessages.map((m) => ({
        _id: m._id,
        name: m.name,
        email: m.email,
        service: m.service,
        status: m.status,
        createdAt: m.createdAt,
      })),
      recentActivity: activity.slice(0, 10).map(({ ts, ...rest }) => rest),
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

function formatRelative(date: Date): string {
  const now = Date.now();
  const ms = now - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default router;
