import express from "express";
import { Types } from "mongoose";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { protect, authorize, AuthRequest } from "../middlewares/authMiddleware";
import { notifyMany } from "../utils/notify";

const router = express.Router();
router.use(protect);

const STATUS_LABELS: Record<string, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  review: "In Review",
  done: "Done",
};

/** IDs of the current user's direct reportees. */
async function reporteeIds(userId: string): Promise<string[]> {
  const reportees = await User.find({ managerId: userId }).select("_id");
  return reportees.map((r) => String(r._id));
}

/** Build an assignee filter based on the user's view scope. Returns null = no restriction (see all). */
async function scopeFilter(req: AuthRequest): Promise<Record<string, unknown> | null> {
  const u = req.user!;
  if (u.permissions.includes("tasks.view.all")) return null;
  if (u.permissions.includes("tasks.view.team")) {
    const ids = await reporteeIds(u.id);
    return { assigneeIds: { $in: [u.id, ...ids].map((i) => new Types.ObjectId(i)) } };
  }
  // own only
  return { assigneeIds: new Types.ObjectId(u.id) };
}

/** Normalize an incoming assignee list, enforcing the assign permission. */
function resolveAssignees(req: AuthRequest, raw: unknown): Types.ObjectId[] {
  let ids: string[] = Array.isArray(raw) ? raw.filter(Boolean).map(String) : raw ? [String(raw)] : [];
  // Without tasks.assign a user may only assign to themselves
  if (!req.user!.permissions.includes("tasks.assign")) {
    ids = [req.user!.id];
  }
  if (ids.length === 0) ids = [req.user!.id];
  // de-dupe
  ids = [...new Set(ids)];
  return ids.map((i) => new Types.ObjectId(i));
}

// ─── GET /api/tasks ─────────────────────────────────
// Scoped list. ?assignee=&priority=&status=&mine=true
router.get(
  "/",
  authorize("tasks.view.own", "tasks.view.team", "tasks.view.all"),
  async (req: AuthRequest, res) => {
    try {
      const scope = await scopeFilter(req);
      const filter: Record<string, unknown> = scope ? { ...scope } : {};

      const { assignee, priority, status, mine } = req.query as Record<string, string>;
      if (mine === "true") filter.assigneeIds = new Types.ObjectId(req.user!.id);
      else if (assignee) filter.assigneeIds = new Types.ObjectId(assignee);
      if (priority) filter.priority = priority;
      if (status) filter.status = status;

      const tasks = await Task.find(filter)
        .populate("assigneeIds", "name email")
        .populate("createdById", "name")
        .sort({ status: 1, order: 1, createdAt: -1 });
      res.json(tasks);
    } catch (error) {
      console.error("GET /tasks error:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  }
);

// ─── GET /api/tasks/assignable-users ────────────────
router.get(
  "/assignable-users",
  authorize("tasks.view.own", "tasks.view.team", "tasks.view.all"),
  async (req: AuthRequest, res) => {
    try {
      const u = req.user!;
      let users;
      if (u.permissions.includes("tasks.view.all")) {
        users = await User.find({ status: "active" }).select("name email");
      } else if (u.permissions.includes("tasks.assign") || u.permissions.includes("tasks.view.team")) {
        const ids = await reporteeIds(u.id);
        users = await User.find({ _id: { $in: [u.id, ...ids] } }).select("name email");
      } else {
        users = await User.find({ _id: u.id }).select("name email");
      }
      res.json(users);
    } catch {
      res.status(500).json({ message: "Failed to fetch assignable users" });
    }
  }
);

// ─── POST /api/tasks ────────────────────────────────
router.post("/", authorize("tasks.create"), async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, assigneeIds, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const assignees = resolveAssignees(req, assigneeIds);
    const count = await Task.countDocuments({ status: status || "todo" });
    const task = new Task({
      title,
      description: description || "",
      status: status || "todo",
      priority: priority || "medium",
      assigneeIds: assignees,
      createdById: req.user!.id,
      dueDate: dueDate || null,
      order: count,
    });
    await task.save();

    // Notify everyone assigned (other than the assigner)
    await notifyMany(
      assignees.map((a) => String(a)),
      {
        type: "task_assigned",
        message: `${req.user!.name} assigned you a task: "${task.title}"`,
        actorId: req.user!.id,
        actorName: req.user!.name,
        link: "/tasks",
      },
      req.user!.id
    );

    const populated = await Task.findById(task._id)
      .populate("assigneeIds", "name email")
      .populate("createdById", "name");
    res.status(201).json(populated);
  } catch (error) {
    console.error("POST /tasks error:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// ─── PUT /api/tasks/:id ─────────────────────────────
router.put("/:id", authorize("tasks.edit", "tasks.create"), async (req: AuthRequest, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, description, status, priority, assigneeIds, dueDate } = req.body;
    const prevAssignees = task.assigneeIds.map(String);
    const prevStatus = task.status;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (assigneeIds !== undefined) task.assigneeIds = resolveAssignees(req, assigneeIds);

    // Status changes via PUT respect the same review rule as /move
    if (status !== undefined && status !== task.status) {
      const blocked = isReviewBlocked(req, task, status);
      if (blocked) return res.status(403).json({ message: blocked });
      task.status = status;
    }

    await task.save();

    // Notify newly added assignees
    const added = task.assigneeIds.map(String).filter((id) => !prevAssignees.includes(id));
    await notifyMany(
      added,
      {
        type: "task_assigned",
        message: `${req.user!.name} assigned you a task: "${task.title}"`,
        actorId: req.user!.id,
        actorName: req.user!.name,
        link: "/tasks",
      },
      req.user!.id
    );

    // Notify concerned people of a status change
    if (status !== undefined && status !== prevStatus) {
      await notifyMany(
        [...task.assigneeIds.map(String), String(task.createdById)],
        {
          type: "task_moved",
          message: `${req.user!.name} moved "${task.title}" to ${STATUS_LABELS[task.status] || task.status}`,
          actorId: req.user!.id,
          actorName: req.user!.name,
          link: "/tasks",
        },
        req.user!.id
      );
    }
    const populated = await Task.findById(task._id)
      .populate("assigneeIds", "name email")
      .populate("createdById", "name");
    res.json(populated);
  } catch (error) {
    console.error("PUT /tasks error:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
});

/** Returns an error string if the move violates the review rule, else null. */
function isReviewBlocked(
  req: AuthRequest,
  task: { assigneeIds: Types.ObjectId[]; createdById: Types.ObjectId },
  targetStatus: string
): string | null {
  if (targetStatus !== "done") return null;
  const isAssignee = task.assigneeIds.some((a) => String(a) === req.user!.id);
  const isCreator = String(task.createdById) === req.user!.id;
  // An assignee may not review (complete) their own task unless they are the assigner
  if (isAssignee && !isCreator) {
    return "Assignees can't review their own task — the assigner or a manager must move it to Done.";
  }
  return null;
}

// ─── PATCH /api/tasks/:id/move ──────────────────────
router.patch("/:id/move", authorize("tasks.edit", "tasks.create", "tasks.view.own"), async (req: AuthRequest, res) => {
  try {
    const { status, order } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const prevStatus = task.status;
    if (status !== undefined && status !== task.status) {
      const blocked = isReviewBlocked(req, task, status);
      if (blocked) return res.status(403).json({ message: blocked });
      task.status = status;
    }
    if (order !== undefined) task.order = order;
    await task.save();

    if (status !== undefined && status !== prevStatus) {
      await notifyMany(
        [...task.assigneeIds.map(String), String(task.createdById)],
        {
          type: "task_moved",
          message: `${req.user!.name} moved "${task.title}" to ${STATUS_LABELS[task.status] || task.status}`,
          actorId: req.user!.id,
          actorName: req.user!.name,
          link: "/tasks",
        },
        req.user!.id
      );
    }

    res.json({ message: "Moved", id: task._id, status: task.status, order: task.order });
  } catch {
    res.status(500).json({ message: "Failed to move task" });
  }
});

// ─── DELETE /api/tasks/:id ──────────────────────────
router.delete("/:id", authorize("tasks.edit", "tasks.create"), async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
