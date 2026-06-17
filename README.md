# Employee Portal

An internal employee portal for managing people, tasks, leave, and team analytics — with **dynamic role-based access control (RBAC)**, a drag-and-drop Kanban board, leave approvals, a live org directory, Teams-style presence, in-app notifications, and a light/dark theme.

It is a standalone application that adopts the **StackX admin design language** (dark glassmorphism, purple `#8B5CF6` + cyan `#06B6D4` accents) and ships a fully matching light theme.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Seed Data & Credentials](#seed-data--credentials)
- [RBAC Model](#rbac-model)
- [Key Behaviors](#key-behaviors)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

---

## Features

| Area | Description |
|------|-------------|
| **Authentication** | Email/password login, JWT (HTTP-only cookie + Bearer), self-service password reset. |
| **Dynamic RBAC** | Admins create custom roles with granular permissions and assign them to users. 3 system roles (Admin/Manager/Employee) are seeded and non-deletable. |
| **Role-aware Dashboard** | Employees see their own task stats; superiors also see reportee count + team workload; admins/HR see org-wide counts and recent hires. |
| **Kanban Board** | 5 columns (Backlog → To Do → In Progress → In Review → Done), native drag-and-drop, **multiple assignees**, assigner tracking, priorities (low/medium/high/urgent), due dates, "Assigned to me" toggle, and live polling. |
| **Review separation** | An assignee cannot move their own task to **Done** — the assigner or a manager reviews it. |
| **Leave** | Apply for leave (sick/vacation/personal/other), track your requests, and approve/reject your team's requests as a manager. |
| **Directory** | Org-wide searchable people directory with presence dots. |
| **Analytics** | Org overview (admins/HR) + per-user analytics (self, or your subordinates if you're a superior): task throughput (8-week graph), task progress, leave stats. |
| **Notifications** | Functional bell with unread badge — fires on task assignment, task status changes, leave requests, and leave decisions ("who" + "what"). |
| **Presence** | Teams-style availability (Available/Busy/Away/Offline). Manual **and** automatic: auto-away on idle, online on connect, offline on disconnect via heartbeat + `lastSeen`. |
| **Profile** | Users self-edit name/email/phone; role/manager are set by superiors. "Reports to" is shown in the profile. |
| **Theming** | Light/dark theme toggle, persisted, with no flash-of-unstyled-content. |
| **Searchable selects** | Dropdowns become filterable search boxes once they exceed 6 options. |

---

## Tech Stack

**Frontend** — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, react-icons
**Backend** — Express 5, Mongoose 9, MongoDB, JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `cors`
**Tooling** — `ts-node` + `nodemon` (backend dev), Turbopack (frontend dev)

---

## Architecture

```
developer-portal/
├── backend/                 Express + Mongoose API  →  http://localhost:5000
│   └── src/
│       ├── config/          db connection, permission catalog
│       ├── models/          User, Role, Task, LeaveRequest, Notification
│       ├── middlewares/     protect (JWT) + authorize(...perms)
│       ├── routes/          auth, users, roles, stats, tasks, leave, analytics, notifications
│       ├── utils/           notify helper
│       ├── seed.ts          comprehensive demo data
│       └── server.ts
└── frontend/                Next.js app           →  http://localhost:3002
    └── src/
        ├── app/             routes: /, /login, /tasks, /leave, /directory, /analytics, /admin/users, /admin/roles
        ├── components/portal/  UI kit, layout (Sidebar/TopNavbar), PresenceManager, modals
        ├── context/         AuthContext (user, permissions, presence)
        ├── lib/             api client, usePolling
        └── types/
```

- **Two processes, two ports.** The frontend talks to the backend via `NEXT_PUBLIC_API_URL`.
- **Auth** is a JWT stored both as an HTTP-only cookie and in `localStorage` (`devportal_token`), sent as a Bearer token.

---

## Getting Started

### Prerequisites
- Node.js 20+
- A MongoDB connection string (MongoDB Atlas or local)

### 1. Backend

```bash
cd backend
npm install
# create .env (see Environment Variables below)
npm run seed     # seeds roles, users, tasks, leave, notifications
npm run dev      # starts API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
# create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev      # starts app on http://localhost:3002
```

Open **http://localhost:3002** and log in with a seeded account.

---

## Seed Data & Credentials

`npm run seed` (in `backend/`) **wipes and recreates** all data: 6 roles (3 system + Team Lead, HR, Intern), 14 users across departments with a manager hierarchy (including an inactive user and one with no manager), 14 tasks covering every status/priority plus multi-assignee/unassigned/overdue/throughput history, 8 leave requests in all states, and sample notifications.

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@devportal.com` | `admin123` |
| Manager | `sarah@devportal.com` | `password123` |
| Team Lead | `leo@devportal.com` | `password123` |
| HR | `hr@devportal.com` | `password123` |
| Employee | `alice@devportal.com` | `password123` |
| Intern | `ivy@devportal.com` | `password123` |

> All non-admin users share the password `password123`.

---

## RBAC Model

Permissions are string keys grouped in `backend/src/config/permissions.ts`:

| Group | Keys |
|-------|------|
| Dashboard | `dashboard.view` |
| Directory | `directory.view` |
| Users | `users.view`, `users.create`, `users.edit`, `users.delete` |
| Roles | `roles.view`, `roles.manage` |
| Tasks | `tasks.view.own`, `tasks.view.team`, `tasks.view.all`, `tasks.create`, `tasks.assign`, `tasks.edit` |
| Leave | `leave.apply`, `leave.view.own`, `leave.view.team`, `leave.approve` |
| Analytics | `analytics.view` |

- Routes are guarded server-side by `authorize(...perms)`; the sidebar and actions are filtered client-side by the same permissions.
- **Scoping** is relationship-based where it matters: task/leave "team" views and per-user analytics resolve to a user's **direct reportees** (`managerId`), while admin-level access (`users.edit`) unlocks the whole org.

---

## Key Behaviors

- **Task review separation** — assignees can advance a task to *In Review* but cannot mark it *Done*; the assigner or a manager does. Enforced in the API and the UI.
- **Analytics access** — everyone sees their own; superiors see their subordinates; org overview requires `analytics.view` (admins/HR).
- **Presence** — `PresenceManager` runs a 60s heartbeat (`/api/auth/heartbeat`), auto-away after 5 min idle, online-on-connect, and a best-effort offline beacon on tab close; others are shown offline if `lastSeen` is stale (>150s). Directory and user lists poll every 30s.
- **Theming** — driven by `data-theme` on `<html>`; Tailwind tokens reference CSS variables (`@theme`, not `@theme inline`) so the whole UI re-themes at runtime.

---

## API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/auth/login` | email + password → token |
| GET | `/api/auth/me` | current user (+ permissions, presence, managerName) |
| PUT | `/api/auth/me` | self-edit name/email/phone/presence |
| POST | `/api/auth/heartbeat` | presence heartbeat |
| POST | `/api/auth/offline` | mark offline (beacon) |
| POST | `/api/auth/logout` / `/api/auth/reset-password` | |
| GET/POST/PUT/DELETE | `/api/users` | list/search/CRUD (guarded) + `/departments` |
| GET/POST/PUT/DELETE | `/api/roles` | role CRUD + `/permissions` catalog |
| GET | `/api/stats` | role-aware dashboard data (`personal` + `org`) |
| GET/POST/PUT/PATCH/DELETE | `/api/tasks` | scoped board; `/assignable-users`, `/:id/move` |
| GET/POST/PATCH/DELETE | `/api/leave` | apply, list (own/team), `/:id/decision` |
| GET | `/api/analytics` | org overview; `/users`, `/user/:id` for per-user |
| GET/PATCH | `/api/notifications` | list, unread-count, read-all, `/:id/read` |

---

## Project Structure

See [Architecture](#architecture). Notable models:

- **User** — name, email, password, phone, roleId, managerId, department, jobTitle, status, presence, lastSeen
- **Role** — name, description, permissions[], isSystem
- **Task** — title, description, status, priority, assigneeIds[], createdById, dueDate, order
- **LeaveRequest** — userId, type, startDate, endDate, reason, status, approverId, decisionNote
- **Notification** — userId, type, message, actorId/actorName, link, read

---

## Environment Variables

**`backend/.env`**
```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-long-random-secret>
FRONTEND_URL=http://localhost:3002
```

**`frontend/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Notes

- The backend caps its dev heap via `NODE_OPTIONS` in the `dev` script; the frontend runs on Turbopack.
- `npm run seed` is destructive (clears collections) — use it only for fresh/demo databases.
