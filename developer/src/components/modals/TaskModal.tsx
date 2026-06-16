"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";
import { AdminButton, AdminSelect } from "@/components/ui";
import { api } from "@/lib/api";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/types";
import type { Task, TaskStatus, TaskPriority, UserLite } from "@/lib/types";

interface TaskModalProps {
  task?: Task | null; // null/undefined = create mode
  canAssign: boolean;
  developers: UserLite[];
  defaultStatus?: TaskStatus;
  onClose: () => void;
  onSaved: () => void;
}

export default function TaskModal({
  task,
  canAssign,
  developers,
  defaultStatus,
  onClose,
  onSaved,
}: TaskModalProps) {
  const editing = !!task;
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || defaultStatus || "todo");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [assignee, setAssignee] = useState<string>(task?.assignee?._id || "");
  const [dueDate, setDueDate] = useState<string>(task?.dueDate ? task.dueDate.slice(0, 10) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      ...(canAssign ? { assignee: assignee || null } : {}),
    };
    try {
      if (editing) await api.put(`/tasks/${task!._id}`, payload);
      else await api.post("/tasks", payload);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
      >
        <div
          className="rounded-2xl border border-surface-border p-6 sm:p-8 max-h-[85vh] overflow-y-auto admin-scroll"
          style={{ background: "rgba(19, 19, 26, 0.97)", backdropFilter: "blur(24px)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              {editing ? "Edit Task" : "New Task"}
            </h2>
            <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer">
              <HiX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>
            )}

            <div>
              <label className="block text-sm text-white font-medium mb-1.5">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="admin-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-white font-medium mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add detail…"
                rows={3}
                className="admin-input w-full resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Status</label>
                <AdminSelect
                  value={status}
                  onChange={(v) => setStatus(v as TaskStatus)}
                  options={TASK_STATUSES.map((s) => ({ label: s.label, value: s.key }))}
                />
              </div>
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Priority</label>
                <AdminSelect
                  value={priority}
                  onChange={(v) => setPriority(v as TaskPriority)}
                  options={TASK_PRIORITIES.map((p) => ({ label: p.charAt(0).toUpperCase() + p.slice(1), value: p }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {canAssign && (
                <div>
                  <label className="block text-sm text-white font-medium mb-1.5">Assignee</label>
                  <AdminSelect
                    value={assignee}
                    onChange={setAssignee}
                    placeholder="Unassigned"
                    options={[
                      { label: "Unassigned", value: "" },
                      ...developers.map((d) => ({ label: d.name || d.username, value: d._id })),
                    ]}
                  />
                </div>
              )}
              <div className={canAssign ? "" : "col-span-2"}>
                <label className="block text-sm text-white font-medium mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="admin-input w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AdminButton variant="ghost" onClick={onClose} type="button">Cancel</AdminButton>
              <AdminButton variant="primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Task"}
              </AdminButton>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
