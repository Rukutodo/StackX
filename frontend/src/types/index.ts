export type Presence = "available" | "busy" | "away" | "offline";

export const PRESENCE_META: Record<Presence, { label: string; color: string }> = {
  available: { label: "Available", color: "#10b981" },
  busy: { label: "Busy", color: "#ef4444" },
  away: { label: "Away", color: "#f59e0b" },
  offline: { label: "Offline", color: "#9ca3af" },
};

export interface RoleRef {
  _id: string;
  name: string;
  permissions?: string[];
}

export interface UserRef {
  _id: string;
  name: string;
  email: string;
}

export interface PortalUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  roleId: RoleRef | null;
  managerId: UserRef | null;
  department: string;
  jobTitle: string;
  status: "active" | "inactive";
  presence?: Presence;
  lastSeen?: string;
  createdAt: string;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount?: number;
  createdAt: string;
}

export interface PermissionDef {
  key: string;
  label: string;
}

export interface PermissionGroup {
  group: string;
  permissions: PermissionDef[];
}

export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeIds: UserRef[];
  createdById: { _id: string; name: string } | null;
  dueDate: string | null;
  order: number;
  createdAt: string;
}

export type LeaveType = "sick" | "vacation" | "personal" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  _id: string;
  userId: { _id: string; name: string; email: string; department?: string } | null;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  approverId: { _id: string; name: string } | null;
  decisionNote: string;
  decidedAt: string | null;
  createdAt: string;
}

export interface Analytics {
  headcount: { total: number; active: number; inactive: number };
  byDepartment: { label: string; count: number }[];
  byRole: { label: string; count: number }[];
  tasks: { total: number; byStatus: { label: string; count: number }[] };
  leave: { total: number; byStatus: { label: string; count: number }[]; byType: { label: string; count: number }[] };
}

export type NotificationType = "task_assigned" | "task_updated" | "task_moved" | "leave_requested" | "leave_decision";

export interface AppNotification {
  _id: string;
  type: NotificationType;
  message: string;
  actorName: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface UserAnalytics {
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    status: "active" | "inactive";
    role: string | null;
    manager: string | null;
    joinedAt: string;
  };
  tasks: {
    total: number;
    completed: number;
    overdue: number;
    completionRate: number;
    byStatus: { label: string; count: number }[];
    throughput: { label: string; count: number }[];
  };
  leave: {
    total: number;
    daysTaken: number;
    byStatus: { label: string; count: number }[];
    byType: { label: string; count: number }[];
  };
}

export interface DashboardStats {
  personal: {
    reporteeCount: number;
    myTotalTasks: number;
    myOpenTasks: number;
    teamOpenTasks: number;
  };
  org: {
    counts: {
      totalUsers: number;
      activeUsers: number;
      totalRoles: number;
      totalDepartments: number;
    };
    byRole: { role: string; count: number }[];
    byDepartment: { department: string; count: number }[];
    recentHires: Array<{
      _id: string;
      name: string;
      email: string;
      department: string;
      jobTitle: string;
      status: string;
      roleId: { name: string } | null;
      createdAt: string;
    }>;
  } | null;
}
