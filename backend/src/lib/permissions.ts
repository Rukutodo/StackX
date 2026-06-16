/**
 * Permission catalogue for the developer dashboard's RBAC.
 * Roles are dynamic (stored in the Role collection); these are the
 * fixed permission keys a role can grant.
 */
export const PERMISSIONS = {
  TASKS_VIEW_ALL: "tasks.view_all",
  TASKS_ASSIGN: "tasks.assign",
  TASKS_MANAGE: "tasks.manage",
  LEAVES_REVIEW: "leaves.review",
  ANALYTICS_VIEW_TEAM: "analytics.view_team",
  USERS_MANAGE: "users.manage",
  ROLES_MANAGE: "roles.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

export const PERMISSION_LABELS: Record<Permission, string> = {
  "tasks.view_all": "View all tasks",
  "tasks.assign": "Assign tasks to others",
  "tasks.manage": "Edit / delete any task",
  "leaves.review": "Approve / reject leaves",
  "analytics.view_team": "View team analytics",
  "users.manage": "Manage user accounts",
  "roles.manage": "Manage roles",
};

/** System roles seeded on startup. `isSystem` roles cannot be deleted. */
export const SYSTEM_ROLES: {
  slug: string;
  name: string;
  description: string;
  permissions: Permission[];
}[] = [
  {
    slug: "admin",
    name: "Admin",
    description: "Full access, including creating roles and accounts.",
    permissions: ALL_PERMISSIONS,
  },
  {
    slug: "manager",
    name: "Manager",
    description: "Manages the team, tasks, leaves and accounts.",
    permissions: [
      PERMISSIONS.TASKS_VIEW_ALL,
      PERMISSIONS.TASKS_ASSIGN,
      PERMISSIONS.TASKS_MANAGE,
      PERMISSIONS.LEAVES_REVIEW,
      PERMISSIONS.ANALYTICS_VIEW_TEAM,
      PERMISSIONS.USERS_MANAGE,
    ],
  },
  {
    slug: "developer",
    name: "Developer",
    description: "Works on their own tasks and requests leave.",
    permissions: [],
  },
];
