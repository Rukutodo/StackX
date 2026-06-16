import express from "express";
import { Role } from "../models/Role";
import { AdminUser } from "../models/AdminUser";
import { AuthRequest, protect, requirePermission } from "../middlewares/authMiddleware";
import { PERMISSIONS, ALL_PERMISSIONS, PERMISSION_LABELS } from "../lib/permissions";
import { invalidateRoleCache } from "../lib/roleCache";

const router = express.Router();

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Reject permissions the actor doesn't hold (no privilege escalation via roles). */
function unauthorizedPerms(req: AuthRequest, perms: string[]): string[] {
  const actor = new Set(req.user!.permissions);
  return perms.filter((p) => !actor.has(p));
}

// ─── GET /api/permissions ──────────────────────────
// Catalogue of assignable permissions (for the role builder UI).
router.get("/permissions", protect, (_req, res) => {
  res.json(ALL_PERMISSIONS.map((key) => ({ key, label: PERMISSION_LABELS[key] })));
});

// ─── GET /api/roles ────────────────────────────────
// Anyone who can manage users needs the role list (assignment dropdowns).
router.get("/", protect, requirePermission(PERMISSIONS.USERS_MANAGE), async (_req, res) => {
  try {
    const roles = await Role.find().sort({ isSystem: -1, name: 1 });
    res.json(roles);
  } catch (error) {
    console.error("GET /api/roles error:", error);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
});

// ─── POST /api/roles ───────────────────────────────
router.post("/", protect, requirePermission(PERMISSIONS.ROLES_MANAGE), async (req: AuthRequest, res) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Role name is required" });

    const perms: string[] = Array.isArray(permissions)
      ? permissions.filter((p: string) => ALL_PERMISSIONS.includes(p as never))
      : [];

    const blocked = unauthorizedPerms(req, perms);
    if (blocked.length) {
      return res.status(403).json({ message: "You cannot grant permissions you don't have" });
    }

    const slug = slugify(name);
    if (!slug) return res.status(400).json({ message: "Invalid role name" });
    if (await Role.findOne({ slug })) {
      return res.status(409).json({ message: "A role with that name already exists" });
    }

    const role = await Role.create({ slug, name: name.trim(), description: description || "", permissions: perms, isSystem: false });
    invalidateRoleCache();
    res.status(201).json(role);
  } catch (error) {
    console.error("POST /api/roles error:", error);
    res.status(500).json({ message: "Failed to create role" });
  }
});

// ─── PUT /api/roles/:id ────────────────────────────
router.put("/:id", protect, requirePermission(PERMISSIONS.ROLES_MANAGE), async (req: AuthRequest, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    if (role.isSystem) return res.status(400).json({ message: "System roles cannot be edited" });

    const { name, description, permissions } = req.body;
    if (permissions !== undefined) {
      const perms: string[] = Array.isArray(permissions)
        ? permissions.filter((p: string) => ALL_PERMISSIONS.includes(p as never))
        : [];
      const blocked = unauthorizedPerms(req, perms);
      if (blocked.length) {
        return res.status(403).json({ message: "You cannot grant permissions you don't have" });
      }
      role.permissions = perms;
    }
    if (name !== undefined) role.name = name.trim();
    if (description !== undefined) role.description = description;

    await role.save();
    invalidateRoleCache();
    res.json(role);
  } catch (error) {
    console.error("PUT /api/roles/:id error:", error);
    res.status(500).json({ message: "Failed to update role" });
  }
});

// ─── DELETE /api/roles/:id ─────────────────────────
router.delete("/:id", protect, requirePermission(PERMISSIONS.ROLES_MANAGE), async (req: AuthRequest, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    if (role.isSystem) return res.status(400).json({ message: "System roles cannot be deleted" });

    const inUse = await AdminUser.countDocuments({ role: role.slug });
    if (inUse > 0) {
      return res.status(400).json({ message: `Role is assigned to ${inUse} user(s). Reassign them first.` });
    }

    await role.deleteOne();
    invalidateRoleCache();
    res.json({ message: "Role deleted" });
  } catch (error) {
    console.error("DELETE /api/roles/:id error:", error);
    res.status(500).json({ message: "Failed to delete role" });
  }
});

export default router;
