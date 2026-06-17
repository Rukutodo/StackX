import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { protect, AuthRequest } from "../middlewares/authMiddleware";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretfallbackkey";

// ─── POST /api/auth/login ───────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: (email || "").toLowerCase() }).populate("roleId");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    if (user.status !== "active") return res.status(403).json({ message: "Account is inactive" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const role = user.roleId as unknown as { _id: string; name: string; permissions: string[] };
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: { id: role._id, name: role.name },
        permissions: role.permissions || [],
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ─── GET /api/auth/me ───────────────────────────────
router.get("/me", protect, async (req: AuthRequest, res) => {
  const u = req.user!;
  const full = await User.findById(u.id)
    .select("phone department jobTitle presence managerId")
    .populate("managerId", "name");
  const manager = full?.managerId as unknown as { name?: string } | null;
  res.json({
    user: {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: full?.phone || "",
      department: full?.department || "",
      jobTitle: full?.jobTitle || "",
      presence: full?.presence || "available",
      role: { id: u.roleId, name: u.roleName },
      permissions: u.permissions,
      managerId: u.managerId,
      managerName: manager?.name || null,
    },
  });
});

// ─── PUT /api/auth/me ───────────────────────────────
// Self-service profile edit. Users may change ONLY their own name, email, phone.
// Role, manager, status, department are intentionally NOT editable here — those
// are managed by superiors via /api/users.
router.put("/me", protect, async (req: AuthRequest, res) => {
  try {
    const { name, email, phone, presence } = req.body;
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (presence !== undefined && ["available", "busy", "away", "offline"].includes(presence)) {
      user.presence = presence;
    }

    if (email !== undefined && email.toLowerCase() !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: "That email is already in use" });
      user.email = email;
    }
    if (name !== undefined) {
      if (!String(name).trim()) return res.status(400).json({ message: "Name cannot be empty" });
      user.name = name;
    }
    if (phone !== undefined) user.phone = phone; // optional

    await user.save();
    res.json({
      user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, presence: user.presence },
    });
  } catch (error) {
    console.error("PUT /auth/me error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// ─── POST /api/auth/heartbeat ───────────────────────
// Keeps the user marked online; others infer offline when this goes stale.
router.post("/heartbeat", protect, async (req: AuthRequest, res) => {
  try {
    await User.updateOne({ _id: req.user!.id }, { lastSeen: new Date() }, { timestamps: false });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "heartbeat failed" });
  }
});

// ─── POST /api/auth/offline ─────────────────────────
// Best-effort on tab close (via sendBeacon, cookie-authenticated). Marks offline now.
router.post("/offline", async (req, res) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
  if (!token) return res.status(200).json({ ok: false });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await User.updateOne(
      { _id: decoded.id },
      { presence: "offline", lastSeen: new Date() },
      { timestamps: false }
    );
  } catch {
    /* ignore */
  }
  res.json({ ok: true });
});

// ─── POST /api/auth/logout ──────────────────────────
router.post("/logout", async (req, res) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      await User.updateOne({ _id: decoded.id }, { presence: "offline" }, { timestamps: false });
    } catch {
      /* ignore */
    }
  }
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// ─── POST /api/auth/reset-password ──────────────────
router.post("/reset-password", protect, async (req: AuthRequest, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Both old and new passwords are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
