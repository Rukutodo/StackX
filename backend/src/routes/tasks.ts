import express from "express";
import mongoose from "mongoose";
import { Task, TASK_STATUSES, TaskStatus } from "../models/Task";
import { AuthRequest, protect, can } from "../middlewares/authMiddleware";
import { PERMISSIONS } from "../lib/permissions";

const router = express.Router();

const isValidId = (v: unknown): v is string =>
  typeof v === "string" && mongoose.Types.ObjectId.isValid(v);

const populate = [
  { path: "assignee", select: "_id username name avatar role" },
  { path: "reporter", select: "_id username name avatar role" },
];

const viewAll = (req: AuthRequest) => can(req, PERMISSIONS.TASKS_VIEW_ALL);
const canAssign = (req: AuthRequest) => can(req, PERMISSIONS.TASKS_ASSIGN);
const canManage = (req: AuthRequest) => can(req, PERMISSIONS.TASKS_MANAGE);

// ─── GET /api/tasks ────────────────────────────────
// Managers see all tasks; developers see only tasks assigned to them.
// Filters: ?status=, ?assignee=, ?priority=
router.get("/", protect, async (req: AuthRequest, res) => {
  try {
    const filter: Record<string, unknown> = {};

    if (!viewAll(req)) {
      // users without "view all" are scoped to their own tasks
      filter.assignee = req.user!.id;
    } else if (isValidId(req.query.assignee)) {
      filter.assignee = req.query.assignee;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter)
      .populate(populate)
      .sort({ status: 1, order: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// ─── POST /api/tasks ───────────────────────────────
// Managers create & assign to anyone. Developers may create tasks for themselves.
router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const { title, description, assignee, status, priority, dueDate, labels } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const finalStatus: TaskStatus = TASK_STATUSES.includes(status) ? status : "todo";

    // users without assign permission can only create tasks for themselves
    let finalAssignee = assignee || null;
    if (!canAssign(req)) finalAssignee = req.user!.id;

    // place new card at the top of its column
    const order = (await Task.countDocuments({ status: finalStatus })) + 1;

    const task = new Task({
      title,
      description: description || "",
      assignee: finalAssignee,
      reporter: req.user!.id,
      status: finalStatus,
      priority: priority || "medium",
      dueDate: dueDate || undefined,
      labels: labels || [],
      order,
      completedAt: finalStatus === "done" ? new Date() : null,
    });
    await task.save();

    const populated = await Task.findById(task._id).populate(populate);
    res.status(201).json(populated);
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// ─── PUT /api/tasks/:id ────────────────────────────
// Managers update anything; developers update only their own tasks (not reassign).
router.put("/:id", protect, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!canManage(req) && String(task.assignee) !== req.user!.id) {
      return res.status(403).json({ message: "You can only edit tasks assigned to you" });
    }

    const { title, description, status, priority, dueDate, labels, assignee } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || undefined;
    if (labels !== undefined) task.labels = labels;
    if (status !== undefined && TASK_STATUSES.includes(status)) {
      task.status = status;
      task.completedAt = status === "done" ? task.completedAt || new Date() : null;
    }
    // only users with assign permission may reassign
    if (assignee !== undefined && canAssign(req)) task.assignee = assignee || null;

    await task.save();
    const populated = await Task.findById(task._id).populate(populate);
    res.json(populated);
  } catch (error) {
    console.error("PUT /api/tasks/:id error:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// ─── PATCH /api/tasks/:id/move ─────────────────────
// Kanban drag: change status + order. Developers may move only their own tasks.
router.patch("/:id/move", protect, async (req: AuthRequest, res) => {
  try {
    const { status, order } = req.body;
    if (!TASK_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!canManage(req) && String(task.assignee) !== req.user!.id) {
      return res.status(403).json({ message: "You can only move tasks assigned to you" });
    }

    task.status = status;
    task.order = typeof order === "number" ? order : task.order;
    task.completedAt = status === "done" ? task.completedAt || new Date() : null;
    await task.save();

    const populated = await Task.findById(task._id).populate(populate);
    res.json(populated);
  } catch (error) {
    console.error("PATCH /api/tasks/:id/move error:", error);
    res.status(500).json({ message: "Failed to move task" });
  }
});

// ─── DELETE /api/tasks/:id ─────────────────────────
// Managers, or the developer who reported the task.
router.delete("/:id", protect, async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!canManage(req) && String(task.reporter) !== req.user!.id) {
      return res.status(403).json({ message: "Not allowed to delete this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/tasks/:id error:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
