"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { HiCalendar, HiChat } from "react-icons/hi";
import { PriorityBadge } from "@/components/ui";
import type { Task } from "@/lib/types";

function initials(name: string) {
  const parts = (name || "?").trim().split(/\s+/);
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

const isOverdue = (t: Task) => t.dueDate && t.status !== "done" && new Date(t.dueDate) < new Date();

export default function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: { status: task.status },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  const assigneeName = task.assignee?.name || task.assignee?.username;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="group rounded-xl border border-white/8 bg-surface-light/60 p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors touch-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm text-white font-medium leading-snug">{task.title}</p>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="text-xs text-muted line-clamp-2 mb-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {assigneeName ? (
            <div
              className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-bold"
              title={assigneeName}
            >
              {initials(assigneeName)}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-white/20" title="Unassigned" />
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${isOverdue(task) ? "text-red-400" : "text-muted"}`}>
              <HiCalendar size={12} />
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
          {task.labels?.length > 0 && (
            <span className="flex items-center gap-1 text-muted">
              <HiChat size={12} />
              {task.labels.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
