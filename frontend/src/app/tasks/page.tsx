"use client";

import { useState, useEffect, useCallback, type FormEvent, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiX, HiSave, HiPencil, HiTrash, HiClock, HiUserCircle, HiLockClosed } from "react-icons/hi";
import { AdminButton, AdminSelect, FilterDropdown } from "@/components/portal/ui";
import { DeleteConfirmModal } from "@/components/portal/DeleteConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { usePolling } from "@/lib/usePolling";
import type { Task, TaskStatus, TaskPriority, UserRef } from "@/types";

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "In Review" },
  { key: "done", label: "Done" },
];

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  medium: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  urgent: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface FormState {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeIds: string[];
  dueDate: string;
}

const EMPTY: FormState = { title: "", description: "", status: "todo", priority: "medium", assigneeIds: [], dueDate: "" };

function AvatarStack({ users }: { users: UserRef[] }) {
  const shown = users.slice(0, 3);
  const extra = users.length - shown.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((u) => (
        <span
          key={u._id}
          title={u.name}
          className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[9px] font-bold ring-2 ring-[#1a1a25]"
        >
          {u.name.charAt(0).toUpperCase()}
        </span>
      ))}
      {extra > 0 && (
        <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[9px] font-bold ring-2 ring-[#1a1a25]">
          +{extra}
        </span>
      )}
    </div>
  );
}

function TaskModal({
  editing,
  assignables,
  canAssign,
  onClose,
  onSaved,
}: {
  editing: Task | null;
  assignables: UserRef[];
  canAssign: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState<FormState>(
    editing
      ? {
          title: editing.title,
          description: editing.description,
          status: editing.status,
          priority: editing.priority,
          assigneeIds: editing.assigneeIds.map((a) => a._id),
          dueDate: editing.dueDate ? editing.dueDate.slice(0, 10) : "",
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormState, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  // Multi-assignee row helpers
  const addAssigneeRow = () => set("assigneeIds", [...form.assigneeIds, ""]);
  const setAssignee = (i: number, val: string) => {
    const next = [...form.assigneeIds];
    next[i] = val;
    set("assigneeIds", next);
  };
  const removeAssignee = (i: number) => set("assigneeIds", form.assigneeIds.filter((_, idx) => idx !== i));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required.");
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate || null,
        assigneeIds: form.assigneeIds.filter(Boolean),
      };
      await api(isEdit ? `/api/tasks/${editing!._id}` : "/api/tasks", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      onSaved();
      onClose();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
      >
        <div className="rounded-2xl border border-surface-border p-6 sm:p-8 max-h-[90vh] overflow-y-auto admin-scroll" style={{ background: "var(--color-surface)", backdropFilter: "blur(24px)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              {isEdit ? "Edit Task" : "New Task"}
            </h2>
            <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition">
              <HiX size={18} />
            </button>
          </div>

          {isEdit && editing!.createdById && (
            <p className="text-xs text-muted mb-4 flex items-center gap-1.5">
              <HiUserCircle size={14} /> Assigned by <span className="text-white font-medium">{editing!.createdById.name}</span>
            </p>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="What needs doing?" className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Details…" className="admin-input w-full resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1.5">Status</label>
                <AdminSelect value={form.status} onChange={(v) => set("status", v)} size="sm" options={COLUMNS.map((c) => ({ label: c.label, value: c.key }))} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Priority</label>
                <AdminSelect value={form.priority} onChange={(v) => set("priority", v)} size="sm" options={[{ label: "Low", value: "low" }, { label: "Medium", value: "medium" }, { label: "High", value: "high" }, { label: "Urgent", value: "urgent" }]} />
              </div>
            </div>

            {/* Multi-assignee */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-muted">Assignees</label>
                {canAssign && (
                  <button type="button" onClick={addAssigneeRow} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-primary/10 text-primary-light hover:bg-primary/20 transition">
                    <HiPlus size={12} /> Add assignee
                  </button>
                )}
              </div>
              {!canAssign ? (
                <p className="text-xs text-muted bg-white/5 rounded-lg px-3 py-2.5 border border-white/10">This task will be assigned to you.</p>
              ) : form.assigneeIds.length === 0 ? (
                <p className="text-[11px] text-muted/70 py-1">No assignees yet — click &ldquo;Add assignee&rdquo;. Defaults to you if left empty.</p>
              ) : (
                <div className="space-y-2">
                  {form.assigneeIds.map((val, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1">
                        <AdminSelect
                          value={val}
                          onChange={(v) => setAssignee(i, v)}
                          size="sm"
                          placeholder="Select person"
                          options={assignables.map((u) => ({ label: u.name, value: u._id }))}
                        />
                      </div>
                      <button type="button" onClick={() => removeAssignee(i)} className="p-1.5 text-muted hover:text-red-400 rounded-lg transition shrink-0">
                        <HiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-muted mb-1.5">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} className="admin-input w-full" />
            </div>

            {error && <p className="text-red-400 text-xs flex items-center gap-1.5"><HiX className="w-3.5 h-3.5" /> {error}</p>}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="text-sm text-muted hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60" style={{ background: "linear-gradient(135deg,#8B5CF6,#6D28D9)" }}>
                {saving ? "Saving…" : (<><HiSave size={14} /> {isEdit ? "Save" : "Create"}</>)}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}

export default function TasksPage() {
  const { user, hasPermission } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignables, setAssignables] = useState<UserRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [modalTarget, setModalTarget] = useState<Task | null | "new">(undefined as never);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const [notice, setNotice] = useState("");
  const [mineOnly, setMineOnly] = useState(false);

  const canCreate = hasPermission("tasks.create");
  const canEdit = hasPermission("tasks.edit") || canCreate;
  const canAssign = hasPermission("tasks.assign");

  const modalOpen = modalTarget !== (undefined as never);

  // A user who is an assignee (and not the assigner) may not move a task to Done
  const canReview = useCallback(
    (t: Task) => {
      const isAssignee = t.assigneeIds.some((a) => a._id === user?.id);
      const isCreator = t.createdById?._id === user?.id;
      return !isAssignee || isCreator;
    },
    [user]
  );

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Task[]>("/api/tasks");
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    api<UserRef[]>("/api/tasks/assignable-users").then((d) => setAssignables(Array.isArray(d) ? d : [])).catch(() => {});
  }, [fetchTasks]);

  // Live refresh — paused while dragging or editing to avoid disrupting the user
  usePolling(fetchTasks, 15000, !modalOpen && !dragId);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`/api/tasks/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchTasks();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const onDrop = async (status: TaskStatus) => {
    setDragOverCol(null);
    const id = dragId;
    setDragId(null);
    if (!id) return;
    const task = tasks.find((t) => t._id === id);
    if (!task || task.status === status) return;

    // Enforce review separation client-side
    if (status === "done" && !canReview(task)) {
      setNotice("You're an assignee — the assigner or a manager must review and move this to Done.");
      setTimeout(() => setNotice(""), 3500);
      return;
    }

    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
    try {
      const order = tasks.filter((t) => t.status === status).length;
      await api(`/api/tasks/${id}/move`, { method: "PATCH", body: JSON.stringify({ status, order }) });
    } catch (err) {
      setNotice((err as Error).message);
      setTimeout(() => setNotice(""), 3500);
      fetchTasks();
    }
  };

  const filtered = tasks.filter((t) => {
    const mp = filterPriority === "all" || t.priority === filterPriority;
    const ma = filterAssignee === "all" || t.assigneeIds.some((a) => a._id === filterAssignee);
    const mine = !mineOnly || t.assigneeIds.some((a) => a._id === user?.id);
    return mp && ma && mine;
  });

  const byColumn = (status: TaskStatus) => filtered.filter((t) => t.status === status);
  const formatDue = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : null);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Kanban Board
            </h1>
            <p className="text-muted text-sm mt-1">Drag cards between columns. Assignees move work to Review; the assigner approves Done.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Assigned-to-me toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={mineOnly}
              onClick={() => setMineOnly((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-border text-sm text-muted hover:text-white transition cursor-pointer"
            >
              <span className={`relative w-9 h-5 rounded-full transition-colors ${mineOnly ? "bg-primary" : "bg-white/10"}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${mineOnly ? "translate-x-4" : ""}`} />
              </span>
              Assigned to me
            </button>
            <FilterDropdown label="Priority" value={filterPriority} onChange={setFilterPriority} options={[{ label: "All", value: "all" }, { label: "Urgent", value: "urgent" }, { label: "High", value: "high" }, { label: "Medium", value: "medium" }, { label: "Low", value: "low" }]} />
            {assignables.length > 1 && (
              <FilterDropdown label="Assignee" value={filterAssignee} onChange={setFilterAssignee} options={[{ label: "All", value: "all" }, ...assignables.map((u) => ({ label: u.name, value: u._id }))]} />
            )}
            {canCreate && (
              <AdminButton variant="primary" className="gap-1.5" onClick={() => setModalTarget("new")}>
                <HiPlus size={16} /> New Task
              </AdminButton>
            )}
          </div>
        </div>

        <AnimatePresence>
          {notice && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
              <HiLockClosed size={15} className="shrink-0" /> {notice}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {COLUMNS.map((c) => <div key={c.key} className="h-96 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {COLUMNS.map((col) => {
              const items = byColumn(col.key);
              return (
                <div
                  key={col.key}
                  onDragOver={(e: DragEvent) => { e.preventDefault(); setDragOverCol(col.key); }}
                  onDragLeave={() => setDragOverCol((c) => (c === col.key ? null : c))}
                  onDrop={() => onDrop(col.key)}
                  className={`rounded-xl border p-3 transition-colors min-h-[400px] ${dragOverCol === col.key ? "bg-white/[0.03] border-white/15" : "border-white/[0.06]"}`}
                  style={{ background: dragOverCol === col.key ? undefined : "var(--color-surface)" }}
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-semibold text-white">{col.label}</h3>
                    <span className="text-[11px] text-muted bg-white/5 rounded-full px-2 py-0.5">{items.length}</span>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((t) => {
                      const reviewLocked = !canReview(t);
                      return (
                        <div
                          key={t._id}
                          draggable={canEdit}
                          onDragStart={() => setDragId(t._id)}
                          onDragEnd={() => setDragId(null)}
                          onClick={() => canEdit && setModalTarget(t)}
                          className={`group rounded-xl border border-white/[0.08] p-3.5 transition-all ${canEdit ? "cursor-grab active:cursor-grabbing hover:border-purple-500/30" : ""} ${dragId === t._id ? "opacity-40" : ""}`}
                          style={{ background: "var(--color-surface-light)" }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-white font-medium leading-snug">{t.title}</p>
                            {canEdit && (
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => setModalTarget(t)} className="p-1 text-muted hover:text-primary-light rounded transition" title="Edit"><HiPencil size={12} /></button>
                                <button onClick={() => setDeleteTarget({ id: t._id, label: t.title })} className="p-1 text-muted hover:text-red-400 rounded transition" title="Delete"><HiTrash size={12} /></button>
                              </div>
                            )}
                          </div>
                          {t.description && <p className="text-xs text-muted mt-1.5 line-clamp-2">{t.description}</p>}

                          {/* Assigner */}
                          {t.createdById && (
                            <p className="text-[10px] text-muted/70 mt-2 flex items-center gap-1">
                              <HiUserCircle size={11} /> by {t.createdById.name}
                              {reviewLocked && col.key === "review" && <span className="text-amber-400/80 ml-1">· awaiting review</span>}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
                            <div className="flex items-center gap-2 text-[10px] text-muted">
                              {t.dueDate && <span className="flex items-center gap-1"><HiClock size={11} /> {formatDue(t.dueDate)}</span>}
                              {t.assigneeIds.length > 0 && <AvatarStack users={t.assigneeIds} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {items.length === 0 && (
                      <div className="text-center py-8 text-xs text-muted/60 border border-dashed border-white/[0.06] rounded-xl">Drop tasks here</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (canCreate || canEdit) && (
          <TaskModal
            editing={modalTarget === "new" ? null : (modalTarget as Task)}
            assignables={assignables}
            canAssign={canAssign}
            onClose={() => setModalTarget(undefined as never)}
            onSaved={fetchTasks}
          />
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Task?"
        itemLabel={deleteTarget?.label}
        description="This will permanently remove this task."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
