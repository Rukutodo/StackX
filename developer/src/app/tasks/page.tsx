"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import {
  DashboardGlassCard,
  DataTable,
  StatusBadge,
  PriorityBadge,
  AdminButton,
  FilterDropdown,
} from "@/components/ui";
import TaskModal from "@/components/modals/TaskModal";
import { usePolling } from "@/lib/usePolling";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { TASK_STATUSES, TASK_PRIORITIES, PERMISSIONS } from "@/lib/types";
import type { Task, UserLite } from "@/lib/types";

export default function TasksPage() {
  const { user, can } = useAuth();
  const canAssign = can(PERMISSIONS.TASKS_ASSIGN);
  const canManage = can(PERMISSIONS.TASKS_MANAGE);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [developers, setDevelopers] = useState<UserLite[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetcher = useCallback(async () => {
    const [tasks] = await Promise.all([
      api.get<Task[]>("/tasks"),
      canAssign && developers.length === 0
        ? api.get<UserLite[]>("/users?role=developer&active=true").then(setDevelopers)
        : Promise.resolve(),
    ]);
    return tasks;
  }, [canAssign, developers.length]);

  const { data: tasks, loading, refetch } = usePolling(fetcher, { interval: 25000 });

  const filtered = useMemo(() => {
    return (tasks || []).filter(
      (t) =>
        (statusFilter === "all" || t.status === statusFilter) &&
        (priorityFilter === "all" || t.priority === priorityFilter)
    );
  }, [tasks, statusFilter, priorityFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.del(`/tasks/${id}`);
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Tasks
          </h1>
          <p className="text-muted text-sm mt-1">
            {canAssign ? "Assign and track work across the team." : "Your assigned work."}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ label: "All", value: "all" }, ...TASK_STATUSES.map((s) => ({ label: s.label, value: s.key }))]}
          />
          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[{ label: "All", value: "all" }, ...TASK_PRIORITIES.map((p) => ({ label: p, value: p }))]}
          />
          <AdminButton variant="primary" size="sm" onClick={() => { setEditingTask(null); setModalOpen(true); }}>
            <HiPlus size={16} /> New Task
          </AdminButton>
        </div>
      </div>

      <DashboardGlassCard>
        {loading && !tasks ? (
          <div className="py-12 text-center text-muted text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted text-sm">No tasks match these filters.</div>
        ) : (
          <DataTable
            columns={[
              {
                key: "title",
                header: "Task",
                render: (row: Task) => (
                  <div>
                    <p className="text-white font-medium text-sm">{row.title}</p>
                    {row.description && <p className="text-muted text-xs truncate max-w-xs">{row.description}</p>}
                  </div>
                ),
              },
              {
                key: "assignee",
                header: "Assignee",
                render: (row: Task) => (
                  <span className="text-sm text-white">
                    {row.assignee?.name || row.assignee?.username || <span className="text-muted">Unassigned</span>}
                  </span>
                ),
              },
              { key: "priority", header: "Priority", render: (row: Task) => <PriorityBadge priority={row.priority} /> },
              { key: "status", header: "Status", render: (row: Task) => <StatusBadge status={row.status} /> },
              {
                key: "dueDate",
                header: "Due",
                className: "text-xs text-muted whitespace-nowrap",
                render: (row: Task) => <span>{fmtDate(row.dueDate)}</span>,
              },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: (row: Task) => (
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => { setEditingTask(row); setModalOpen(true); }}
                      className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
                      title="Edit"
                    >
                      <HiPencil size={15} />
                    </button>
                    {(canManage || row.reporter?._id === user?.id) && (
                      <button
                        onClick={() => handleDelete(row._id)}
                        className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete"
                      >
                        <HiTrash size={15} />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            data={filtered}
          />
        )}
      </DashboardGlassCard>

      <AnimatePresence>
        {modalOpen && (
          <TaskModal
            task={editingTask}
            canAssign={canAssign}
            developers={developers}
            onClose={() => setModalOpen(false)}
            onSaved={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
