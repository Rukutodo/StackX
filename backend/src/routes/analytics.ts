import express from "express";
import { Types } from "mongoose";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { Task } from "../models/Task";
import { LeaveRequest } from "../models/LeaveRequest";
import { protect, authorize, AuthRequest } from "../middlewares/authMiddleware";

const router = express.Router();
router.use(protect);

/**
 * Users the current viewer may inspect for analytics:
 *  - Admin-level (can edit users) → everyone (null = unrestricted)
 *  - Superiors → themselves + their direct reportees
 *  - Everyone else → only themselves
 */
async function inspectableUserIds(req: AuthRequest): Promise<string[] | null> {
  if (req.user!.permissions.includes("users.edit")) return null; // admin-level: all users
  const reportees = await User.find({ managerId: req.user!.id }).select("_id");
  return [req.user!.id, ...reportees.map((r) => String(r._id))];
}

function leaveDays(start: Date, end: Date): number {
  const d = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1;
  return d > 0 ? d : 1;
}

// ─── GET /api/analytics ─────────────────────────────
router.get("/", authorize("analytics.view"), async (_req, res) => {
  try {
    const [totalUsers, activeUsers, inactiveUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "inactive" }),
    ]);

    // Headcount by department
    const byDeptRaw = await User.aggregate([
      { $match: { department: { $ne: "" } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const byDepartment = byDeptRaw.map((d) => ({ label: d._id, count: d.count }));

    // Headcount by role
    const byRoleRaw = await User.aggregate([{ $group: { _id: "$roleId", count: { $sum: 1 } } }]);
    const roles = await Role.find().select("name");
    const roleMap = new Map(roles.map((r) => [String(r._id), r.name]));
    const byRole = byRoleRaw.map((r) => ({ label: roleMap.get(String(r._id)) || "Unknown", count: r.count }));

    // Task throughput by status
    const taskRaw = await Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const taskStatusMap = new Map(taskRaw.map((t) => [t._id, t.count]));
    const tasksByStatus = ["backlog", "todo", "in_progress", "review", "done"].map((s) => ({
      label: s,
      count: taskStatusMap.get(s) || 0,
    }));
    const totalTasks = taskRaw.reduce((sum, t) => sum + t.count, 0);

    // Leave utilization by status
    const leaveRaw = await LeaveRequest.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const leaveStatusMap = new Map(leaveRaw.map((l) => [l._id, l.count]));
    const leaveByStatus = ["pending", "approved", "rejected"].map((s) => ({
      label: s,
      count: leaveStatusMap.get(s) || 0,
    }));
    const totalLeave = leaveRaw.reduce((sum, l) => sum + l.count, 0);

    // Leave by type
    const leaveTypeRaw = await LeaveRequest.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]);
    const leaveByType = leaveTypeRaw.map((l) => ({ label: l._id, count: l.count }));

    res.json({
      headcount: { total: totalUsers, active: activeUsers, inactive: inactiveUsers },
      byDepartment,
      byRole,
      tasks: { total: totalTasks, byStatus: tasksByStatus },
      leave: { total: totalLeave, byStatus: leaveByStatus, byType: leaveByType },
    });
  } catch (error) {
    console.error("GET /analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

// ─── GET /api/analytics/users ───────────────────────
// Person-picker list. Any authenticated user (gets at least themselves);
// superiors also get their reportees; admins get everyone.
router.get("/users", async (req: AuthRequest, res) => {
  try {
    const allowed = await inspectableUserIds(req);
    const filter = allowed ? { _id: { $in: allowed.map((i) => new Types.ObjectId(i)) } } : {};
    const users = await User.find(filter)
      .select("name email department jobTitle")
      .populate("roleId", "name")
      .sort({ name: 1 });
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ─── GET /api/analytics/user/:id ────────────────────
// Per-user analytics. Visible to the user themselves, their superior, or an admin.
router.get("/user/:id", async (req: AuthRequest, res) => {
  try {
    const targetId = String(req.params.id);

    // Scope check
    const allowed = await inspectableUserIds(req);
    if (allowed && !allowed.includes(targetId)) {
      return res.status(403).json({ message: "You cannot view this user's analytics" });
    }

    const user = await User.findById(targetId)
      .select("name email department jobTitle status createdAt")
      .populate("roleId", "name")
      .populate("managerId", "name");
    if (!user) return res.status(404).json({ message: "User not found" });

    const uid = new Types.ObjectId(targetId);
    const now = new Date();

    // Tasks assigned to this user
    const taskRaw = await Task.aggregate([
      { $match: { assigneeIds: uid } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const taskMap = new Map(taskRaw.map((t) => [t._id, t.count]));
    const tasksByStatus = ["backlog", "todo", "in_progress", "review", "done"].map((s) => ({ label: s, count: taskMap.get(s) || 0 }));
    const totalTasks = taskRaw.reduce((sum, t) => sum + t.count, 0);
    const completedTasks = taskMap.get("done") || 0;
    const overdueTasks = await Task.countDocuments({
      assigneeIds: uid,
      status: { $ne: "done" },
      dueDate: { $ne: null, $lt: now },
    });
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Leave for this user
    const leaveRaw = await LeaveRequest.aggregate([
      { $match: { userId: uid } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const leaveMap = new Map(leaveRaw.map((l) => [l._id, l.count]));
    const leaveByStatus = ["pending", "approved", "rejected"].map((s) => ({ label: s, count: leaveMap.get(s) || 0 }));
    const totalLeave = leaveRaw.reduce((sum, l) => sum + l.count, 0);

    // Days taken (approved) + by type
    const approved = await LeaveRequest.find({ userId: uid, status: "approved" }).select("type startDate endDate");
    let daysTaken = 0;
    const typeDays: Record<string, number> = {};
    for (const lr of approved) {
      const d = leaveDays(lr.startDate, lr.endDate);
      daysTaken += d;
      typeDays[lr.type] = (typeDays[lr.type] || 0) + d;
    }
    const leaveByType = Object.entries(typeDays).map(([label, count]) => ({ label, count }));

    // Throughput — tasks completed per week over the last 8 weeks (by updatedAt of done tasks)
    const WEEKS = 8;
    const msWeek = 7 * 86400000;
    const startWindow = new Date(now.getTime() - WEEKS * msWeek);
    const doneTasks = await Task.find({
      assigneeIds: uid,
      status: "done",
      updatedAt: { $gte: startWindow },
    }).select("updatedAt");

    // Assign each completed task to its week bucket
    const throughput = Array.from({ length: WEEKS }, (_, i) => {
      const weekStart = new Date(now.getTime() - (WEEKS - 1 - i) * msWeek);
      return { label: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: 0 };
    });
    for (const t of doneTasks) {
      const diffWeeks = Math.floor((now.getTime() - new Date(t.updatedAt).getTime()) / msWeek);
      const idx = WEEKS - 1 - diffWeeks;
      if (idx >= 0 && idx < WEEKS) throughput[idx].count += 1;
    }

    res.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        department: user.department,
        jobTitle: user.jobTitle,
        status: user.status,
        role: (user.roleId as unknown as { name?: string })?.name || null,
        manager: (user.managerId as unknown as { name?: string })?.name || null,
        joinedAt: user.createdAt,
      },
      tasks: { total: totalTasks, completed: completedTasks, overdue: overdueTasks, completionRate, byStatus: tasksByStatus, throughput },
      leave: { total: totalLeave, daysTaken, byStatus: leaveByStatus, byType: leaveByType },
    });
  } catch (error) {
    console.error("GET /analytics/user error:", error);
    res.status(500).json({ message: "Failed to fetch user analytics" });
  }
});

export default router;
