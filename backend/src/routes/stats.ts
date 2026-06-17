import express from "express";
import { Types } from "mongoose";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { Task } from "../models/Task";
import { protect, authorize, AuthRequest } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

// ─── GET /api/stats ─────────────────────────────────
// Returns role-appropriate data:
//   - personal: stats for everyone (my tasks, reportees, team tasks)
//   - org: org-wide counts ONLY for users who can view users (admin/HR)
router.get("/", authorize("dashboard.view"), async (req: AuthRequest, res) => {
  try {
    const me = new Types.ObjectId(req.user!.id);

    // ── Personal / superior stats (everyone) ──
    const reportees = await User.find({ managerId: me }).select("_id");
    const reporteeIds = reportees.map((r) => r._id);
    const [myTotalTasks, myOpenTasks, teamOpenTasks] = await Promise.all([
      Task.countDocuments({ assigneeIds: me }),
      Task.countDocuments({ assigneeIds: me, status: { $ne: "done" } }),
      reporteeIds.length
        ? Task.countDocuments({ assigneeIds: { $in: reporteeIds }, status: { $ne: "done" } })
        : Promise.resolve(0),
    ]);

    const personal = {
      reporteeCount: reporteeIds.length,
      myTotalTasks,
      myOpenTasks,
      teamOpenTasks,
    };

    // ── Org-wide stats (only if allowed to view users) ──
    const canViewOrg = req.user!.permissions.includes("users.view");
    if (!canViewOrg) {
      return res.json({ personal, org: null });
    }

    const [totalUsers, activeUsers, totalRoles] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      Role.countDocuments(),
    ]);

    // Count by role (joined to role name)
    const byRoleRaw = await User.aggregate([
      { $group: { _id: "$roleId", count: { $sum: 1 } } },
    ]);
    const roles = await Role.find().select("name");
    const roleMap = new Map(roles.map((r) => [String(r._id), r.name]));
    const byRole = byRoleRaw.map((r) => ({
      role: roleMap.get(String(r._id)) || "Unknown",
      count: r.count,
    }));

    // Count by department
    const byDeptRaw = await User.aggregate([
      { $match: { department: { $ne: "" } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const byDepartment = byDeptRaw.map((d) => ({ department: d._id, count: d.count }));

    const totalDepartments = byDepartment.length;

    // Recent hires
    const recentHires = await User.find()
      .select("name email department jobTitle status createdAt")
      .populate("roleId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      personal,
      org: {
        counts: { totalUsers, activeUsers, totalRoles, totalDepartments },
        byRole,
        byDepartment,
        recentHires,
      },
    });
  } catch (error) {
    console.error("GET /stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

export default router;
