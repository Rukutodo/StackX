import express from "express";
import { AdminUser } from "../models/AdminUser";
import { Role } from "../models/Role";
import { AuthRequest, protect, requirePermission } from "../middlewares/authMiddleware";
import { PERMISSIONS } from "../lib/permissions";

const router = express.Router();

const publicFields = "_id username name email role isActive avatar createdAt";

/**
 * Privilege-escalation guard: an actor may only grant a role whose permissions
 * are a subset of their own. Prevents e.g. a manager creating an admin.
 * Returns an error message if blocked, or null if allowed.
 */
async function checkRoleGrant(req: AuthRequest, roleSlug: string): Promise<string | null> {
  const role = await Role.findOne({ slug: roleSlug });
  if (!role) return "Unknown role";
  const actorPerms = new Set(req.user!.permissions);
  const missing = role.permissions.filter((p) => !actorPerms.has(p));
  if (missing.length > 0) {
    return "You cannot assign a role with permissions you don't have";
  }
  return null;
}

// ─── GET /api/users ────────────────────────────────
// Any authenticated user: list users (assignment dropdowns, team view).
router.get("/", protect, async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.active === "true") filter.isActive = true;

    const users = await AdminUser.find(filter).select(publicFields).sort({ name: 1, username: 1 });
    res.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ─── POST /api/users ───────────────────────────────
// Requires users.manage. Role is a dynamic slug; escalation-guarded.
router.post("/", protect, requirePermission(PERMISSIONS.USERS_MANAGE), async (req: AuthRequest, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const roleSlug = (role || "developer").toLowerCase();
    const grantError = await checkRoleGrant(req, roleSlug);
    if (grantError) return res.status(403).json({ message: grantError });

    const exists = await AdminUser.findOne({ username });
    if (exists) return res.status(409).json({ message: "Username already taken" });

    const user = new AdminUser({ username, password, name: name || username, email, role: roleSlug });
    await user.save();

    const safe = await AdminUser.findById(user._id).select(publicFields);
    res.status(201).json(safe);
  } catch (error) {
    console.error("POST /api/users error:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// ─── PUT /api/users/:id ────────────────────────────
router.put("/:id", protect, requirePermission(PERMISSIONS.USERS_MANAGE), async (req: AuthRequest, res) => {
  try {
    const { name, email, role, isActive, password } = req.body;
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role !== undefined) {
      const roleSlug = String(role).toLowerCase();
      const grantError = await checkRoleGrant(req, roleSlug);
      if (grantError) return res.status(403).json({ message: grantError });
      (user as any).role = roleSlug;
    }
    if (name !== undefined) (user as any).name = name;
    if (email !== undefined) (user as any).email = email;
    if (isActive !== undefined) (user as any).isActive = !!isActive;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      (user as any).password = password; // hashed by pre-save hook
    }

    await user.save();
    const safe = await AdminUser.findById(user._id).select(publicFields);
    res.json(safe);
  } catch (error) {
    console.error("PUT /api/users/:id error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// ─── DELETE /api/users/:id ─────────────────────────
router.delete("/:id", protect, requirePermission(PERMISSIONS.USERS_MANAGE), async (req: AuthRequest, res) => {
  try {
    if (req.user?.id === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    const deleted = await AdminUser.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
