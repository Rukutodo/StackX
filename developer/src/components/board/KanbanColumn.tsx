"use client";

import { useDroppable } from "@dnd-kit/core";
import { HiPlus } from "react-icons/hi";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "@/lib/types";

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onCardClick: (task: Task) => void;
  onAdd: (status: TaskStatus) => void;
}

const accent: Record<TaskStatus, string> = {
  backlog: "bg-gray-400",
  todo: "bg-slate-300",
  in_progress: "bg-amber-400",
  in_review: "bg-cyan-400",
  done: "bg-emerald-400",
};

export default function KanbanColumn({ status, label, tasks, onCardClick, onAdd }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${status}`, data: { status } });

  return (
    <div className="flex flex-col w-[280px] shrink-0">
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${accent[status]}`} />
          <h3 className="text-sm font-semibold text-white">{label}</h3>
          <span className="text-xs text-muted bg-white/5 rounded-full px-2 py-0.5">{tasks.length}</span>
        </div>
        <button
          onClick={() => onAdd(status)}
          className="p-1 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
          aria-label={`Add task to ${label}`}
        >
          <HiPlus size={16} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[120px] rounded-xl p-2 space-y-2 transition-colors border ${
          isOver ? "bg-primary/5 border-primary/30" : "bg-white/[0.015] border-white/5"
        }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onClick={() => onCardClick(task)} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-xs text-muted py-6 select-none">Drop tasks here</div>
        )}
      </div>
    </div>
  );
}
