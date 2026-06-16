"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { AnimatePresence } from "framer-motion";
import { HiPlus } from "react-icons/hi";
import KanbanColumn from "@/components/board/KanbanColumn";
import TaskCard from "@/components/board/TaskCard";
import TaskModal from "@/components/modals/TaskModal";
import { AdminButton, FilterDropdown } from "@/components/ui";
import { usePolling } from "@/lib/usePolling";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { TASK_STATUSES, PERMISSIONS } from "@/lib/types";
import type { Task, TaskStatus, UserLite } from "@/lib/types";

export default function BoardPage() {
  const { can } = useAuth();
  const canAssign = can(PERMISSIONS.TASKS_ASSIGN);

  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [developers, setDevelopers] = useState<UserLite[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState<TaskStatus>("todo");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const fetcher = useCallback(async () => {
    const [tasks] = await Promise.all([
      api.get<Task[]>("/tasks"),
      canAssign && developers.length === 0
        ? api.get<UserLite[]>("/users?role=developer&active=true").then(setDevelopers)
        : Promise.resolve(),
    ]);
    return tasks;
  }, [canAssign, developers.length]);

  const { data: tasks, setData: setTasks, loading, refetch } = usePolling(fetcher, { interval: 20000 });

  const filtered = useMemo(() => {
    let list = tasks || [];
    if (canAssign && assigneeFilter !== "all") {
      list = list.filter((t) => t.assignee?._id === assigneeFilter);
    }
    return list;
  }, [tasks, canAssign, assigneeFilter]);

  const columns = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { backlog: [], todo: [], in_progress: [], in_review: [], done: [] };
    for (const t of filtered) map[t.status]?.push(t);
    for (const k of Object.keys(map) as TaskStatus[]) map[k].sort((a, b) => a.order - b.order);
    return map;
  }, [filtered]);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveTask((tasks || []).find((t) => t._id === e.active.id) || null);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;

    const taskId = String(active.id);
    const overId = String(over.id);
    const destStatus: TaskStatus = overId.startsWith("col:")
      ? (overId.slice(4) as TaskStatus)
      : ((over.data.current?.status as TaskStatus) ?? null);

    if (!destStatus) return;
    const moved = (tasks || []).find((t) => t._id === taskId);
    if (!moved || moved.status === destStatus) return;

    const order = (columns[destStatus]?.length ?? 0) + 1;

    // optimistic update
    setTasks((prev) =>
      (prev || []).map((t) => (t._id === taskId ? { ...t, status: destStatus, order } : t))
    );

    try {
      await api.patch(`/tasks/${taskId}/move`, { status: destStatus, order });
    } catch {
      refetch(); // revert to server truth on failure
    }
  };

  const openNew = (status: TaskStatus) => {
    setEditingTask(null);
    setNewStatus(status);
    setModalOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Kanban Board
          </h1>
          <p className="text-muted text-sm mt-1">
            {canAssign ? "Drag tasks across the team's workflow." : "Drag your tasks across the workflow."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canAssign && (
            <FilterDropdown
              label="Assignee"
              value={assigneeFilter}
              onChange={setAssigneeFilter}
              options={[
                { label: "All", value: "all" },
                ...developers.map((d) => ({ label: d.name || d.username, value: d._id })),
              ]}
            />
          )}
          <AdminButton variant="primary" size="sm" onClick={() => openNew("todo")}>
            <HiPlus size={16} /> New Task
          </AdminButton>
        </div>
      </div>

      {loading && !tasks ? (
        <div className="py-20 text-center text-muted text-sm">Loading board…</div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 admin-scroll">
            {TASK_STATUSES.map(({ key, label }) => (
              <KanbanColumn
                key={key}
                status={key}
                label={label}
                tasks={columns[key]}
                onCardClick={openEdit}
                onAdd={openNew}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      <AnimatePresence>
        {modalOpen && (
          <TaskModal
            task={editingTask}
            canAssign={canAssign}
            developers={developers}
            defaultStatus={newStatus}
            onClose={() => setModalOpen(false)}
            onSaved={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
