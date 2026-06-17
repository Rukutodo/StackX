/**
 * Permission catalog — the single source of truth for all RBAC permission keys.
 * Grouped for rendering the role editor UI on the frontend.
 */

export interface PermissionDef {
  key: string;
  label: string;
}

export interface PermissionGroup {
  group: string;
  permissions: PermissionDef[];
}

export const PERMISSION_CATALOG: PermissionGroup[] = [
  {
    group: "Dashboard",
    permissions: [{ key: "dashboard.view", label: "View dashboard" }],
  },
  {
    group: "Directory",
    permissions: [{ key: "directory.view", label: "View org directory" }],
  },
  {
    group: "Users",
    permissions: [
      { key: "users.view", label: "View users" },
      { key: "users.create", label: "Create users" },
      { key: "users.edit", label: "Edit users" },
      { key: "users.delete", label: "Delete users" },
    ],
  },
  {
    group: "Roles",
    permissions: [
      { key: "roles.view", label: "View roles" },
      { key: "roles.manage", label: "Create / edit / delete roles" },
    ],
  },
  {
    group: "Tasks",
    permissions: [
      { key: "tasks.view.own", label: "View own tasks" },
      { key: "tasks.view.team", label: "View team tasks" },
      { key: "tasks.view.all", label: "View all tasks" },
      { key: "tasks.create", label: "Create tasks" },
      { key: "tasks.assign", label: "Assign tasks" },
      { key: "tasks.edit", label: "Edit tasks" },
    ],
  },
  {
    group: "Leave",
    permissions: [
      { key: "leave.apply", label: "Apply for leave" },
      { key: "leave.view.own", label: "View own leave" },
      { key: "leave.view.team", label: "View team leave" },
      { key: "leave.approve", label: "Approve / reject leave" },
    ],
  },
  {
    group: "Analytics",
    permissions: [{ key: "analytics.view", label: "View analytics" }],
  },
];

/** Flat list of every valid permission key. */
export const ALL_PERMISSIONS: string[] = PERMISSION_CATALOG.flatMap((g) =>
  g.permissions.map((p) => p.key)
);

/** Default permission sets for the seeded system roles. */
export const SYSTEM_ROLE_PERMISSIONS: Record<"Admin" | "Manager" | "Employee", string[]> = {
  Admin: ALL_PERMISSIONS,
  // Managers are "superiors": they see their reportees' individual analytics
  // (relationship-scoped, no analytics.view needed) but not the org-wide overview.
  Manager: [
    "dashboard.view",
    "directory.view",
    "users.view",
    "tasks.view.team",
    "tasks.create",
    "tasks.assign",
    "tasks.edit",
    "leave.view.team",
    "leave.approve",
    "leave.apply",
    "leave.view.own",
  ],
  Employee: [
    "dashboard.view",
    "directory.view",
    "tasks.view.own",
    "leave.apply",
    "leave.view.own",
  ],
};
