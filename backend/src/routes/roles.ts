import express from "express";
import { Role } from "../models/Role";
import { User } from "../models/User";
import { protect, authorize } from "../middlewares/authMiddleware";
import { PERMISSION_CATALOG, ALL_PERMISSIONS } from "../config/permissions";

const router = express.Router();

router.use(protect);

// ─── GET /api/roles/permissions ─────────────────────
// The permission catalog for the role editor UI.
router.get("/permissions", authorize("roles.view", "roles.manage"), (_req, res) => {
  res.json(PERMISSION_CATALOG);
});

// ─── GET /api/roles ─────────────────────────────────
// Includes a userCount per role.
router.get("/", authorize("roles.view", "roles.manage", "users.view"), async (_req, res) => {
  try {
    const roles = await Role.find().sort({ isSystem: -1, name: 1 });
    const counts = await User.aggregate([
      { $group: { _id: "$roleId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    const withCounts = roles.map((r) => ({
      ...r.toObject(),
      userCount: countMap.get(String(r._id)) || 0,
    }));
    res.json(withCounts);
  } catch (error) {
    console.error("GET /roles error:", error);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
});

// ─── POST /api/roles ────────────────────────────────
router.post("/", authorize("roles.manage"), async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name) return res.status(400).json({ message: "Role name is required" });

    const exists = await Role.findOne({ name });
    if (exists) return res.status(400).json({ message: "A role with this name already exists" });

    const validPerms = (permissions || []).filter((p: string) => ALL_PERMISSIONS.includes(p));
    const role = new Role({ name, description: description || "", permissions: validPerms });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    console.error("POST /roles error:", error);
    res.status(500).json({ message: "Failed to create role" });
  }
});

// ─── PUT /api/roles/:id ─────────────────────────────
router.put("/:id", authorize("roles.manage"), async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    // System roles: permissions editable, but the name is locked.
    if (!role.isSystem && name !== undefined) role.name = name;
    if (description !== undefined) role.description = description;
    if (permissions !== undefined) {
      role.permissions = permissions.filter((p: string) => ALL_PERMISSIONS.includes(p));
    }
    await role.save();
    res.json(role);
  } catch (error) {
    console.error("PUT /roles error:", error);
    res.status(500).json({ message: "Failed to update role" });
  }
});

// ─── DELETE /api/roles/:id ──────────────────────────
router.delete("/:id", authorize("roles.manage"), async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    if (role.isSystem) return res.status(400).json({ message: "System roles cannot be deleted" });

    const inUse = await User.countDocuments({ roleId: role._id });
    if (inUse > 0) {
      return res.status(400).json({
        message: `Cannot delete — ${inUse} user(s) are assigned to this role. Reassign them first.`,
      });
    }
    await role.deleteOne();
    res.json({ message: "Role deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete role" });
  }
});

export default router;
