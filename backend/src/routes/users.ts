import express from "express";
import { User } from "../models/User";
import { protect, authorize, AuthRequest } from "../middlewares/authMiddleware";

const router = express.Router();

// All user routes require authentication
router.use(protect);

// ─── GET /api/users ─────────────────────────────────
// List / search / filter. Visible to anyone who can view users OR the directory.
// ?q=&role=<roleId>&department=&status=
router.get("/", authorize("users.view", "directory.view"), async (req, res) => {
  try {
    const { q, role, department, status } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};

    if (role) filter.roleId = role;
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { jobTitle: { $regex: q, $options: "i" } },
        { department: { $regex: q, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .populate("roleId", "name")
      .populate("managerId", "name email")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("GET /users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ─── GET /api/users/departments ─────────────────────
// Distinct department list for filters.
router.get("/departments", authorize("users.view", "directory.view"), async (_req, res) => {
  try {
    const depts = await User.distinct("department", { department: { $ne: "" } });
    res.json(depts.sort());
  } catch {
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});

// ─── GET /api/users/:id ─────────────────────────────
router.get("/:id", authorize("users.view", "directory.view"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("roleId", "name permissions")
      .populate("managerId", "name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// ─── POST /api/users ────────────────────────────────
router.post("/", authorize("users.create"), async (req, res) => {
  try {
    const { name, email, password, roleId, managerId, department, jobTitle, status, phone } = req.body;
    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: "name, email, password and roleId are required" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "A user with this email already exists" });

    const user = new User({
      name,
      email,
      password,
      phone: phone || "",
      roleId,
      managerId: managerId || null,
      department: department || "",
      jobTitle: jobTitle || "",
      status: status || "active",
    });
    await user.save();

    const safe = await User.findById(user._id)
      .select("-password")
      .populate("roleId", "name")
      .populate("managerId", "name email");
    res.status(201).json(safe);
  } catch (error) {
    console.error("POST /users error:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// ─── PUT /api/users/:id ─────────────────────────────
router.put("/:id", authorize("users.edit"), async (req, res) => {
  try {
    const { name, email, roleId, managerId, department, jobTitle, status, password, phone } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent a user from being assigned as their own manager
    if (managerId && String(managerId) === String(user._id)) {
      return res.status(400).json({ message: "A user cannot be their own manager" });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (roleId !== undefined) user.roleId = roleId;
    if (managerId !== undefined) user.managerId = managerId || null;
    if (department !== undefined) user.department = department;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (phone !== undefined) user.phone = phone;
    if (status !== undefined) user.status = status;
    if (password) user.password = password; // re-hashed by pre-save hook

    await user.save();

    const safe = await User.findById(user._id)
      .select("-password")
      .populate("roleId", "name")
      .populate("managerId", "name email");
    res.json(safe);
  } catch (error) {
    console.error("PUT /users error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// ─── DELETE /api/users/:id ──────────────────────────
router.delete("/:id", authorize("users.delete"), async (req: AuthRequest, res) => {
  try {
    if (String(req.params.id) === String(req.user!.id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    // Clear this user as a manager from any reportees
    await User.updateMany({ managerId: req.params.id }, { managerId: null });
    res.json({ message: "User deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
