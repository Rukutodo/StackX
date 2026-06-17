import mongoose from "mongoose";
import dotenv from "dotenv";
import { Role } from "./models/Role";
import { User } from "./models/User";
import { Task } from "./models/Task";
import { LeaveRequest } from "./models/LeaveRequest";
import { Notification, NotificationType } from "./models/Notification";
import { SYSTEM_ROLE_PERMISSIONS, ALL_PERMISSIONS } from "./config/permissions";

dotenv.config();

const PW_ADMIN = "admin123";
const PW = "password123";

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
};

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/devportal");
  console.log("Connected to MongoDB for seeding...");
};

const clearAll = async () => {
  await Promise.all([
    Task.deleteMany({}),
    LeaveRequest.deleteMany({}),
    Notification.deleteMany({}),
    User.deleteMany({}),
    Role.deleteMany({}),
  ]);
  console.log("🧹 Cleared existing data.");
};

const seedRoles = async () => {
  const defs = [
    // System roles
    { name: "Admin", description: "Full access to everything", permissions: SYSTEM_ROLE_PERMISSIONS.Admin, isSystem: true },
    { name: "Manager", description: "Manages reportees' tasks and leave", permissions: SYSTEM_ROLE_PERMISSIONS.Manager, isSystem: true },
    { name: "Employee", description: "Standard employee access", permissions: SYSTEM_ROLE_PERMISSIONS.Employee, isSystem: true },
    // Custom roles (edge cases for dynamic RBAC)
    {
      name: "Team Lead",
      description: "Leads a small team; sees their reportees only",
      permissions: [
        "dashboard.view", "directory.view", "users.view",
        "tasks.view.own", "tasks.view.team", "tasks.create", "tasks.assign", "tasks.edit",
        "leave.view.own", "leave.view.team", "leave.apply",
      ],
      isSystem: false,
    },
    {
      name: "HR",
      description: "Manages people and approves leave across the org",
      permissions: [
        "dashboard.view", "directory.view",
        "users.view", "users.create", "users.edit",
        "leave.view.own", "leave.view.team", "leave.approve", "leave.apply",
        "analytics.view",
      ],
      isSystem: false,
    },
    {
      name: "Intern",
      description: "Minimal access — own tasks and leave only",
      permissions: ["dashboard.view", "directory.view", "tasks.view.own", "leave.apply", "leave.view.own"],
      isSystem: false,
    },
  ];
  const map = new Map<string, mongoose.Types.ObjectId>();
  for (const d of defs) {
    const r = await Role.create(d);
    map.set(d.name, r._id as mongoose.Types.ObjectId);
  }
  console.log(`✅ Seeded ${defs.length} roles (3 system + 3 custom).`);
  return map;
};

interface UserSpec {
  name: string;
  email: string;
  role: string;
  manager?: string; // email of manager
  department: string;
  jobTitle: string;
  status?: "active" | "inactive";
  password?: string;
}

const seedUsers = async (roleMap: Map<string, mongoose.Types.ObjectId>) => {
  // Ordered so managers exist before their reportees
  const specs: UserSpec[] = [
    { name: "Portal Admin", email: "admin@devportal.com", role: "Admin", department: "Administration", jobTitle: "System Administrator", password: PW_ADMIN },
    { name: "Sarah Chen", email: "sarah@devportal.com", role: "Manager", manager: "admin@devportal.com", department: "Engineering", jobTitle: "Engineering Manager" },
    { name: "Mike Patel", email: "mike@devportal.com", role: "Manager", manager: "admin@devportal.com", department: "Design", jobTitle: "Design Lead" },
    { name: "Hannah Reyes", email: "hr@devportal.com", role: "HR", manager: "admin@devportal.com", department: "People", jobTitle: "HR Specialist" },
    { name: "Leo Martin", email: "leo@devportal.com", role: "Team Lead", manager: "sarah@devportal.com", department: "Engineering", jobTitle: "Tech Lead" },
    { name: "Alice Wong", email: "alice@devportal.com", role: "Employee", manager: "leo@devportal.com", department: "Engineering", jobTitle: "Frontend Developer" },
    { name: "Bob Singh", email: "bob@devportal.com", role: "Employee", manager: "leo@devportal.com", department: "Engineering", jobTitle: "Backend Developer" },
    { name: "Carol Diaz", email: "carol@devportal.com", role: "Employee", manager: "sarah@devportal.com", department: "Engineering", jobTitle: "Full-Stack Developer" },
    { name: "Dan Kim", email: "dan@devportal.com", role: "Employee", manager: "mike@devportal.com", department: "Design", jobTitle: "UI Designer" },
    { name: "Emma Foster", email: "emma@devportal.com", role: "Employee", manager: "mike@devportal.com", department: "Design", jobTitle: "UX Researcher" },
    { name: "Marco Rossi", email: "marco@devportal.com", role: "Employee", manager: "admin@devportal.com", department: "Marketing", jobTitle: "Marketing Specialist" },
    { name: "Ivy Nakamura", email: "ivy@devportal.com", role: "Intern", manager: "leo@devportal.com", department: "Engineering", jobTitle: "Engineering Intern" },
    // Edge cases
    { name: "Frank Old", email: "frank@devportal.com", role: "Employee", manager: "sarah@devportal.com", department: "Engineering", jobTitle: "Former Developer", status: "inactive" },
    { name: "Nora Webb", email: "nora@devportal.com", role: "Employee", department: "Operations", jobTitle: "Operations Analyst" }, // no manager
  ];

  const userMap = new Map<string, mongoose.Types.ObjectId>();
  for (const s of specs) {
    const u = await User.create({
      name: s.name,
      email: s.email,
      password: s.password || PW,
      roleId: roleMap.get(s.role),
      managerId: s.manager ? userMap.get(s.manager) : null,
      department: s.department,
      jobTitle: s.jobTitle,
      status: s.status || "active",
    });
    userMap.set(s.email, u._id as mongoose.Types.ObjectId);
  }
  console.log(`✅ Seeded ${specs.length} users (incl. 1 inactive + 1 with no manager).`);
  return userMap;
};

interface TaskSpec {
  title: string;
  description?: string;
  status: "backlog" | "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignees: string[]; // emails
  creator: string;
  due?: number | null; // day offset
  doneWeeksAgo?: number; // backdate updatedAt for throughput
}

const seedTasks = async (u: Map<string, mongoose.Types.ObjectId>) => {
  const specs: TaskSpec[] = [
    { title: "Set up CI/CD pipeline", status: "done", priority: "high", assignees: ["alice@devportal.com"], creator: "leo@devportal.com", doneWeeksAgo: 1 },
    { title: "Design new dashboard", description: "Revamp the analytics dashboard layout", status: "in_progress", priority: "medium", assignees: ["dan@devportal.com", "emma@devportal.com"], creator: "mike@devportal.com", due: 5 },
    { title: "Fix login bug", description: "Users report intermittent 401s", status: "todo", priority: "urgent", assignees: ["bob@devportal.com"], creator: "leo@devportal.com", due: -2 }, // overdue
    { title: "Write API documentation", status: "backlog", priority: "low", assignees: ["carol@devportal.com"], creator: "sarah@devportal.com", due: null },
    { title: "Migrate database to v2", description: "Zero-downtime migration", status: "review", priority: "high", assignees: ["bob@devportal.com", "alice@devportal.com"], creator: "leo@devportal.com", due: 1 },
    { title: "Q3 marketing campaign", status: "in_progress", priority: "medium", assignees: ["marco@devportal.com"], creator: "admin@devportal.com", due: 10 },
    { title: "Onboard new hires", status: "todo", priority: "medium", assignees: ["hr@devportal.com"], creator: "admin@devportal.com", due: 3 },
    { title: "Refactor auth module", status: "done", priority: "medium", assignees: ["alice@devportal.com"], creator: "leo@devportal.com", doneWeeksAgo: 2 },
    { title: "User research interviews", status: "done", priority: "low", assignees: ["emma@devportal.com"], creator: "mike@devportal.com", doneWeeksAgo: 1 },
    { title: "Triage backlog", description: "Unassigned — needs an owner", status: "backlog", priority: "low", assignees: [], creator: "sarah@devportal.com", due: null }, // unassigned
    { title: "Security audit", status: "todo", priority: "urgent", assignees: ["bob@devportal.com", "carol@devportal.com"], creator: "sarah@devportal.com", due: 7 },
    { title: "Update style guide", status: "in_progress", priority: "low", assignees: ["dan@devportal.com"], creator: "mike@devportal.com", due: 4 },
    { title: "Performance optimization", status: "review", priority: "high", assignees: ["carol@devportal.com"], creator: "sarah@devportal.com", due: 2 },
    { title: "Deploy v2.0", status: "done", priority: "urgent", assignees: ["alice@devportal.com", "bob@devportal.com"], creator: "leo@devportal.com", doneWeeksAgo: 0 },
  ];

  for (const s of specs) {
    const t = await Task.create({
      title: s.title,
      description: s.description || "",
      status: s.status,
      priority: s.priority,
      assigneeIds: s.assignees.map((e) => u.get(e)!).filter(Boolean),
      createdById: u.get(s.creator),
      dueDate: s.due === null || s.due === undefined ? null : day(s.due),
      order: 0,
    });
    // Backdate completion time so the throughput graph has history
    if (s.status === "done" && s.doneWeeksAgo !== undefined) {
      const when = day(-7 * s.doneWeeksAgo - 1);
      await Task.updateOne({ _id: t._id }, { $set: { updatedAt: when } }, { timestamps: false });
    }
  }
  console.log(`✅ Seeded ${specs.length} tasks (all statuses/priorities, multi-assignee, unassigned, overdue, throughput history).`);
};

interface LeaveSpec {
  user: string;
  type: "sick" | "vacation" | "personal" | "other";
  start: number;
  end: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approver?: string;
  note?: string;
}

const seedLeave = async (u: Map<string, mongoose.Types.ObjectId>) => {
  const specs: LeaveSpec[] = [
    { user: "alice@devportal.com", type: "vacation", start: 14, end: 18, reason: "Family trip", status: "pending" },
    { user: "bob@devportal.com", type: "sick", start: -5, end: -4, reason: "Flu", status: "approved", approver: "leo@devportal.com" },
    { user: "carol@devportal.com", type: "personal", start: 6, end: 6, reason: "Appointment", status: "rejected", approver: "sarah@devportal.com", note: "Critical sprint week" },
    { user: "dan@devportal.com", type: "vacation", start: -20, end: -15, reason: "Annual leave", status: "approved", approver: "mike@devportal.com" },
    { user: "emma@devportal.com", type: "other", start: 3, end: 3, reason: "Conference", status: "pending" },
    { user: "marco@devportal.com", type: "sick", start: -2, end: -1, reason: "Cold", status: "approved", approver: "admin@devportal.com" },
    { user: "ivy@devportal.com", type: "personal", start: 8, end: 9, reason: "Exams", status: "pending" },
    { user: "alice@devportal.com", type: "sick", start: -30, end: -29, reason: "Migraine", status: "approved", approver: "leo@devportal.com" },
  ];

  for (const s of specs) {
    await LeaveRequest.create({
      userId: u.get(s.user),
      type: s.type,
      startDate: day(s.start),
      endDate: day(s.end),
      reason: s.reason,
      status: s.status,
      approverId: s.approver ? u.get(s.approver) : null,
      decisionNote: s.note || "",
      decidedAt: s.status === "pending" ? null : new Date(),
    });
  }
  console.log(`✅ Seeded ${specs.length} leave requests (all types & states).`);
};

const seedNotifications = async (u: Map<string, mongoose.Types.ObjectId>) => {
  const items: { user: string; type: NotificationType; message: string; actor: string }[] = [
    { user: "alice@devportal.com", type: "task_assigned", message: 'Leo Martin assigned you a task: "Set up CI/CD pipeline"', actor: "leo@devportal.com" },
    { user: "bob@devportal.com", type: "task_assigned", message: 'Leo Martin assigned you a task: "Fix login bug"', actor: "leo@devportal.com" },
    { user: "leo@devportal.com", type: "leave_requested", message: "Alice Wong requested vacation leave (in 2 weeks)", actor: "alice@devportal.com" },
    { user: "mike@devportal.com", type: "leave_requested", message: "Emma Foster requested other leave", actor: "emma@devportal.com" },
    { user: "leo@devportal.com", type: "task_moved", message: 'Bob Singh moved "Migrate database to v2" to In Review', actor: "bob@devportal.com" },
    { user: "carol@devportal.com", type: "leave_decision", message: "Sarah Chen rejected your leave request", actor: "sarah@devportal.com" },
  ];
  for (const n of items) {
    await Notification.create({
      userId: u.get(n.user),
      type: n.type,
      message: n.message,
      actorId: u.get(n.actor),
      actorName: "",
      link: n.type.startsWith("leave") ? "/leave" : "/tasks",
      read: false,
    });
  }
  console.log(`✅ Seeded ${items.length} notifications.`);
};

const run = async () => {
  try {
    await connect();
    await clearAll();
    const roleMap = await seedRoles();
    const userMap = await seedUsers(roleMap);
    await seedTasks(userMap);
    await seedLeave(userMap);
    await seedNotifications(userMap);

    console.log("\n🌱 Seeding complete.\n");
    console.log("Login credentials (password for all non-admin users: " + PW + "):");
    console.log("  Admin     →  admin@devportal.com  /  " + PW_ADMIN);
    console.log("  Manager   →  sarah@devportal.com   /  " + PW);
    console.log("  Team Lead →  leo@devportal.com     /  " + PW);
    console.log("  HR        →  hr@devportal.com      /  " + PW);
    console.log("  Employee  →  alice@devportal.com   /  " + PW);
    console.log("  Intern    →  ivy@devportal.com     /  " + PW);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

run();
