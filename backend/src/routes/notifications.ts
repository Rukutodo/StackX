import express from "express";
import { Notification } from "../models/Notification";
import { protect, AuthRequest } from "../middlewares/authMiddleware";

const router = express.Router();
router.use(protect);

// ─── GET /api/notifications ─────────────────────────
// Recent notifications for the current user.
router.get("/", async (req: AuthRequest, res) => {
  try {
    const items = await Notification.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(30);
    const unread = await Notification.countDocuments({ userId: req.user!.id, read: false });
    res.json({ items, unread });
  } catch (error) {
    console.error("GET /notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// ─── GET /api/notifications/unread-count ────────────
router.get("/unread-count", async (req: AuthRequest, res) => {
  try {
    const unread = await Notification.countDocuments({ userId: req.user!.id, read: false });
    res.json({ unread });
  } catch {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

// ─── PATCH /api/notifications/read-all ──────────────
router.patch("/read-all", async (req: AuthRequest, res) => {
  try {
    await Notification.updateMany({ userId: req.user!.id, read: false }, { read: true });
    res.json({ message: "All marked read" });
  } catch {
    res.status(500).json({ message: "Failed to mark all read" });
  }
});

// ─── PATCH /api/notifications/:id/read ──────────────
router.patch("/:id/read", async (req: AuthRequest, res) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user!.id }, { read: true });
    res.json({ message: "Marked read" });
  } catch {
    res.status(500).json({ message: "Failed to mark read" });
  }
});

export default router;
