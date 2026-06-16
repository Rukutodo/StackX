import express from "express";
import mongoose from "mongoose";
import { Leave, LEAVE_TYPES, LEAVE_STATUSES } from "../models/Leave";
import { AuthRequest, protect, requirePermission, can } from "../middlewares/authMiddleware";
import { PERMISSIONS } from "../lib/permissions";

const router = express.Router();

const isValidId = (v: unknown): v is string =>
  typeof v === "string" && mongoose.Types.ObjectId.isValid(v);

const populate = [
  { path: "user", select: "_id username name avatar role" },
  { path: "reviewedBy", select: "_id username name" },
];

const canReview = (req: AuthRequest) => can(req, PERMISSIONS.LEAVES_REVIEW);

// ─── GET /api/leaves ───────────────────────────────
// Managers see all (optionally ?user= / ?status=); developers see only their own.
router.get("/", protect, async (req: AuthRequest, res) => {
  try {
    const filter: Record<string, unknown> = {};
    if (!canReview(req)) {
      filter.user = req.user!.id;
    } else if (isValidId(req.query.user)) {
      filter.user = req.query.user;
    }
    if (req.query.status) filter.status = req.query.status;

    const leaves = await Leave.find(filter).populate(populate).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error("GET /api/leaves error:", error);
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
});

// ─── POST /api/leaves ──────────────────────────────
// Any authenticated user requests leave for themselves.
router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "endDate cannot be before startDate" });
    }

    const leave = new Leave({
      user: req.user!.id,
      type: LEAVE_TYPES.includes(type) ? type : "vacation",
      startDate,
      endDate,
      reason: reason || "",
      status: "pending",
    });
    await leave.save();

    const populated = await Leave.findById(leave._id).populate(populate);
    res.status(201).json(populated);
  } catch (error) {
    console.error("POST /api/leaves error:", error);
    res.status(500).json({ message: "Failed to create leave request" });
  }
});

// ─── PATCH /api/leaves/:id/review ──────────────────
// Manager only: approve or reject a pending request.
router.patch("/:id/review", protect, requirePermission(PERMISSIONS.LEAVES_REVIEW), async (req: AuthRequest, res) => {
  try {
    const { status, reviewNote } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be 'approved' or 'rejected'" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    leave.status = status;
    leave.reviewNote = reviewNote || "";
    leave.reviewedBy = req.user!.id as any;
    leave.reviewedAt = new Date();
    await leave.save();

    const populated = await Leave.findById(leave._id).populate(populate);
    res.json(populated);
  } catch (error) {
    console.error("PATCH /api/leaves/:id/review error:", error);
    res.status(500).json({ message: "Failed to review leave request" });
  }
});

// ─── DELETE /api/leaves/:id ────────────────────────
// Owner may cancel their own pending request; managers may delete any.
router.delete("/:id", protect, async (req: AuthRequest, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    const owner = String(leave.user) === req.user!.id;
    if (!canReview(req) && !owner) {
      return res.status(403).json({ message: "Not allowed" });
    }
    if (owner && !canReview(req) && leave.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }

    await leave.deleteOne();
    res.json({ message: "Leave request removed" });
  } catch (error) {
    console.error("DELETE /api/leaves/:id error:", error);
    res.status(500).json({ message: "Failed to remove leave request" });
  }
});

export default router;
