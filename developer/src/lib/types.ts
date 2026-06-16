/** Role is a dynamic slug referencing the Role collection. */
export type Role = string;

/** Permission keys — must mirror backend src/lib/permissions.ts */
export const PERMISSIONS = {
  TASKS_VIEW_ALL: "tasks.view_all",
  TASKS_ASSIGN: "tasks.assign",
  TASKS_MANAGE: "tasks.manage",
  LEAVES_REVIEW: "leaves.review",
  ANALYTICS_VIEW_TEAM: "analytics.view_team",
  USERS_MANAGE: "users.manage",
  ROLES_MANAGE: "roles.manage",
} as const;

export interface PermissionInfo {
  key: string;
  label: string;
}

export interface RoleDef {
  _id: string;
  slug: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  name?: string;
  role: Role;
  email?: string;
  permissions: string[];
}

export interface UserLite {
  _id: string;
  username: string;
  name?: string;
  email?: string;
  role: Role;
  isActive?: boolean;
  avatar?: string;
  createdAt?: string;
}

export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export const TASK_STATUSES: { key: TaskStatus; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "in_review", label: "In Review" },
  { key: "done", label: "Done" },
];

export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];

export interface Task {
  _id: string;
  title: string;
  description: string;
  assignee: UserLite | null;
  reporter: UserLite | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  labels: string[];
  order: number;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LeaveType = "sick" | "vacation" | "personal" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected";

export const LEAVE_TYPES: LeaveType[] = ["sick", "vacation", "personal", "other"];

export interface Leave {
  _id: string;
  user: UserLite | null;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: UserLite | null;
  reviewNote?: string;
  reviewedAt?: string | null;
  createdAt: string;
}

export interface Analytics {
  scope: "team" | "self";
  summary: { total: number; done: number; inProgress: number; overdue: number };
  byStatus: { status: TaskStatus; count: number }[];
  byPriority: { priority: TaskPriority; count: number }[];
  throughput: { label: string; count: number }[];
  perDeveloper: { _id: string; name: string; total: number; done: number }[];
  leaveByType: { type: LeaveType; count: number }[];
  developerCount?: number;
}
