import express from "express";
import mongoose from "mongoose";
import { Task, TASK_STATUSES, TASK_PRIORITIES } from "../models/Task";
import { Leave } from "../models/Leave";
import { AdminUser } from "../models/AdminUser";
import { AuthRequest, protect, can } from "../middlewares/authMiddleware";
import { PERMISSIONS } from "../lib/permissions";

const router = express.Router();

// ─── GET /api/analytics ────────────────────────────
// Users with team analytics permission see team-wide data; others see their own.
router.get("/", protect, async (req: AuthRequest, res) => {
  try {
    const manager = can(req, PERMISSIONS.ANALYTICS_VIEW_TEAM);

    // Base scope: developers are limited to their own tasks
    const taskMatch: Record<string, unknown> = manager
      ? {}
      : { assignee: new mongoose.Types.ObjectId(req.user!.id) };

    const [byStatusRaw, byPriorityRaw, totals, throughputRaw, perDevRaw, leaveRaw] =
      await Promise.all([
        // tasks grouped by status
        Task.aggregate([
          { $match: taskMatch },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        // tasks grouped by priority
        Task.aggregate([
          { $match: taskMatch },
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),
        // headline totals
        Task.aggregate([
          { $match: taskMatch },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
              inProgress: {
                $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] },
              },
              overdue: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $ne: ["$status", "done"] },
                        { $ne: ["$dueDate", null] },
                        { $lt: ["$dueDate", new Date()] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]),
        // throughput: completed tasks per ISO week (last 8 weeks)
        Task.aggregate([
          {
            $match: {
              ...taskMatch,
              status: "done",
              completedAt: { $ne: null },
            },
          },
          {
            $group: {
              _id: {
                year: { $isoWeekYear: "$completedAt" },
                week: { $isoWeek: "$completedAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.week": 1 } },
        ]),
        // per-developer throughput (managers only)
        manager
          ? Task.aggregate([
              { $match: { assignee: { $ne: null } } },
              {
                $group: {
                  _id: "$assignee",
                  total: { $sum: 1 },
                  done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
                },
              },
              {
                $lookup: {
                  from: "adminusers",
                  localField: "_id",
                  foreignField: "_id",
                  as: "user",
                },
              },
              { $unwind: "$user" },
              {
                $project: {
                  _id: 1,
                  total: 1,
                  done: 1,
                  name: { $ifNull: ["$user.name", "$user.username"] },
                },
              },
              { $sort: { done: -1 } },
            ])
          : Promise.resolve([]),
        // leave usage by type (approved)
        Leave.aggregate([
          {
            $match: manager
              ? { status: "approved" }
              : {
                  status: "approved",
                  user: new mongoose.Types.ObjectId(req.user!.id),
                },
          },
          { $group: { _id: "$type", count: { $sum: 1 } } },
        ]),
      ]);

    // Normalise grouped results into stable, zero-filled shapes
    const byStatus = TASK_STATUSES.map((s) => ({
      status: s,
      count: byStatusRaw.find((r) => r._id === s)?.count || 0,
    }));
    const byPriority = TASK_PRIORITIES.map((p) => ({
      priority: p,
      count: byPriorityRaw.find((r) => r._id === p)?.count || 0,
    }));
    const throughput = throughputRaw.map((r) => ({
      label: `W${r._id.week}`,
      count: r.count,
    }));
    const leaveByType = leaveRaw.map((r) => ({ type: r._id, count: r.count }));

    const summary = totals[0] || { total: 0, done: 0, inProgress: 0, overdue: 0 };
    delete (summary as any)._id;

    // headcount context (managers)
    const developerCount = manager
      ? await AdminUser.countDocuments({ role: "developer", isActive: true })
      : undefined;

    res.json({
      scope: manager ? "team" : "self",
      summary,
      byStatus,
      byPriority,
      throughput,
      perDeveloper: perDevRaw,
      leaveByType,
      developerCount,
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

export default router;
