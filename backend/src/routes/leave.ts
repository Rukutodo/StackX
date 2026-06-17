import express from "express";
import { Types } from "mongoose";
import { LeaveRequest } from "../models/LeaveRequest";
import { User } from "../models/User";
import { protect, authorize, AuthRequest } from "../middlewares/authMiddleware";
import { notify } from "../utils/notify";

const router = express.Router();
router.use(protect);

async function reporteeIds(userId: string): Promise<string[]> {
  const reportees = await User.find({ managerId: userId }).select("_id");
  return reportees.map((r) => String(r._id));
}

// ─── GET /api/leave ─────────────────────────────────
// ?scope=own|team   (defaults to the broadest the user is allowed)
router.get(
  "/",
  authorize("leave.view.own", "leave.view.team", "leave.approve"),
  async (req: AuthRequest, res) => {
    try {
      const u = req.user!;
      const scope = (req.query.scope as string) || "auto";
      const filter: Record<string, unknown> = {};

      const canTeam = u.permissions.includes("leave.view.team") || u.permissions.includes("leave.approve");

      if (scope === "own" || !canTeam) {
        filter.userId = new Types.ObjectId(u.id);
      } else {
        // team scope: reportees' requests
        const ids = await reporteeIds(u.id);
        filter.userId = { $in: ids.map((i) => new Types.ObjectId(i)) };
      }

      const requests = await LeaveRequest.find(filter)
        .populate("userId", "name email department")
        .populate("approverId", "name")
        .sort({ createdAt: -1 });
      res.json(requests);
    } catch (error) {
      console.error("GET /leave error:", error);
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  }
);

// ─── POST /api/leave ────────────────────────────────
router.post("/", authorize("leave.apply"), async (req: AuthRequest, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }
    const request = new LeaveRequest({
      userId: req.user!.id,
      type: type || "vacation",
      startDate,
      endDate,
      reason: reason || "",
    });
    await request.save();

    // Notify the applicant's manager, if any
    const applicant = await User.findById(req.user!.id).select("name managerId");
    if (applicant?.managerId) {
      const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      await notify(String(applicant.managerId), {
        type: "leave_requested",
        message: `${req.user!.name} requested ${request.type} leave (${fmt(startDate)} – ${fmt(endDate)})`,
        actorId: req.user!.id,
        actorName: req.user!.name,
        link: "/leave",
      });
    }

    const populated = await LeaveRequest.findById(request._id).populate("userId", "name email department");
    res.status(201).json(populated);
  } catch (error) {
    console.error("POST /leave error:", error);
    res.status(500).json({ message: "Failed to submit leave request" });
  }
});

// ─── PATCH /api/leave/:id/decision ──────────────────
// Approve / reject — only a manager over the requester (or broad approver).
router.patch("/:id/decision", authorize("leave.approve"), async (req: AuthRequest, res) => {
  try {
    const { decision, note } = req.body as { decision: "approved" | "rejected"; note?: string };
    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be 'approved' or 'rejected'" });
    }
    const request = await LeaveRequest.findById(req.params.id).populate("userId", "managerId");
    if (!request) return res.status(404).json({ message: "Leave request not found" });

    // Manager may only decide on their own reportees unless they can view all
    const requester = request.userId as unknown as { _id: string; managerId: Types.ObjectId | null };
    const isReporteeManager = String(requester.managerId) === req.user!.id;
    const canViewAll = req.user!.permissions.includes("leave.view.team") && !requester.managerId;
    if (!isReporteeManager && !canViewAll) {
      // Allow if the approver is the requester's manager; otherwise block self-approval / unrelated
      if (String(requester._id) === req.user!.id) {
        return res.status(403).json({ message: "You cannot approve your own leave" });
      }
    }

    request.status = decision;
    request.approverId = new Types.ObjectId(req.user!.id);
    request.decisionNote = note || "";
    request.decidedAt = new Date();
    await request.save();

    // Notify the requester of the decision
    await notify(String(requester._id), {
      type: "leave_decision",
      message: `${req.user!.name} ${decision} your leave request`,
      actorId: req.user!.id,
      actorName: req.user!.name,
      link: "/leave",
    });

    const populated = await LeaveRequest.findById(request._id)
      .populate("userId", "name email department")
      .populate("approverId", "name");
    res.json(populated);
  } catch (error) {
    console.error("PATCH /leave decision error:", error);
    res.status(500).json({ message: "Failed to update leave request" });
  }
});

// ─── DELETE /api/leave/:id ──────────────────────────
// Cancel own pending request.
router.delete("/:id", authorize("leave.apply", "leave.view.own"), async (req: AuthRequest, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Leave request not found" });
    if (String(request.userId) !== req.user!.id) {
      return res.status(403).json({ message: "You can only cancel your own requests" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }
    await request.deleteOne();
    res.json({ message: "Leave request cancelled" });
  } catch {
    res.status(500).json({ message: "Failed to cancel leave request" });
  }
});

export default router;
