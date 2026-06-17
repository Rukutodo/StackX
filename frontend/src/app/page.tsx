"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  HiUsers,
  HiShieldCheck,
  HiOfficeBuilding,
  HiUserAdd,
  HiViewBoards,
  HiCalendar,
  HiUserGroup,
  HiClock,
  HiArrowRight,
  HiClipboardCheck,
} from "react-icons/hi";
import {
  DashboardStatCard,
  DashboardGlassCard,
  DashboardSectionHeader,
  StatusBadge,
  DataTable,
} from "@/components/portal/ui";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { DashboardStats, Task, TaskStatus } from "@/types";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const TASK_STATUS: Record<TaskStatus, { label: string; cls: string }> = {
  backlog: { label: "Backlog", cls: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  todo: { label: "To Do", cls: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  in_progress: { label: "In Progress", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  review: { label: "In Review", cls: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
  done: { label: "Done", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
};

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  desc: string;
  href: string;
  color: string;
  perm: string;
}

const quickActions: QuickAction[] = [
  { icon: <HiUserAdd size={20} />, label: "Add User", desc: "Onboard a team member", href: "/admin/users", color: "from-primary to-purple-700", perm: "users.create" },
  { icon: <HiShieldCheck size={20} />, label: "Manage Roles", desc: "Create roles & permissions", href: "/admin/roles", color: "from-cyan-500 to-cyan-700", perm: "roles.manage" },
  { icon: <HiViewBoards size={20} />, label: "Kanban Board", desc: "View & assign tasks", href: "/tasks", color: "from-emerald-500 to-emerald-700", perm: "tasks.view.own" },
  { icon: <HiCalendar size={20} />, label: "Leave", desc: "Apply or review leave", href: "/leave", color: "from-amber-500 to-amber-700", perm: "leave.apply" },
  { icon: <HiUserGroup size={20} />, label: "Directory", desc: "Search the organization", href: "/directory", color: "from-pink-500 to-rose-700", perm: "directory.view" },
];

export default function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const hasTaskView = hasPermission("tasks.view.own") || hasPermission("tasks.view.team") || hasPermission("tasks.view.all");

  const fetchData = useCallback(async () => {
    try {
      const json = await api<DashboardStats>("/api/stats");
      setData(json);
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
    if (hasTaskView) {
      try {
        const t = await api<Task[]>("/api/tasks?mine=true");
        setMyTasks(Array.isArray(t) ? t : []);
      } catch {
        /* ignore */
      }
    }
    setLoading(false);
  }, [hasTaskView]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const org = data?.org;
  const p = data?.personal;
  const visibleActions = quickActions.filter((a) => hasPermission(a.perm));
  const activeMyTasks = myTasks.filter((t) => t.status !== "done");
  const inReviewMine = myTasks.filter((t) => t.status === "review").length;
  const doneMine = myTasks.filter((t) => t.status === "done").length;
  const isSuperior = (p?.reporteeCount ?? 0) > 0;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formatDue = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : null);

  // Stat cards are role-aware: everyone sees their own tasks; superiors also see
  // their reportees + team workload; only admins/HR (users.view) see org-wide counts.
  const statCards: { icon: React.ReactNode; label: string; value: string | number; iconBg?: string }[] = [];
  if (hasTaskView) {
    statCards.push({ icon: <HiViewBoards />, label: "My Active / Total Tasks", value: loading ? "—" : `${activeMyTasks.length} / ${myTasks.length}` });
    statCards.push({ icon: <HiClipboardCheck />, label: "Completed", value: loading ? "—" : doneMine, iconBg: "bg-emerald-500/10" });
    if (inReviewMine > 0) statCards.push({ icon: <HiClock />, label: "In Review", value: inReviewMine, iconBg: "bg-purple-500/10" });
  }
  if (isSuperior) {
    statCards.push({ icon: <HiUserGroup />, label: "My Reportees", value: loading ? "—" : p!.reporteeCount, iconBg: "bg-cyan-500/10" });
    statCards.push({ icon: <HiViewBoards />, label: "Team Open Tasks", value: loading ? "—" : p!.teamOpenTasks, iconBg: "bg-amber-500/10" });
  }
  if (org) {
    statCards.push({ icon: <HiUsers />, label: "Total Employees", value: org.counts.totalUsers, iconBg: "bg-emerald-500/10" });
    statCards.push({ icon: <HiShieldCheck />, label: "Roles", value: org.counts.totalRoles, iconBg: "bg-cyan-500/10" });
    statCards.push({ icon: <HiOfficeBuilding />, label: "Departments", value: org.counts.totalDepartments, iconBg: "bg-amber-500/10" });
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-muted text-sm mt-1">Here&apos;s what&apos;s on your plate today.</p>
      </motion.div>

      {/* Stat cards (role-aware) */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((s, i) => (
          <DashboardStatCard key={i} icon={s.icon} label={s.label} value={s.value} iconBg={s.iconBg} />
        ))}
      </motion.div>

      {/* Quick actions */}
      {visibleActions.length > 0 && (
        <motion.div variants={item}>
          <DashboardSectionHeader title="Quick Actions" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {visibleActions.map((a) => (
              <Link key={a.label} href={a.href}>
                <div className="admin-glass p-4 h-full hover:border-[rgba(139,92,246,0.3)] transition group cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white mb-3 group-hover:scale-105 transition`}>
                    {a.icon}
                  </div>
                  <p className="text-sm font-semibold text-white">{a.label}</p>
                  <p className="text-xs text-muted mt-0.5">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* My Tasks */}
      {hasTaskView && (
        <motion.div variants={item}>
          <DashboardGlassCard hover={false}>
            <DashboardSectionHeader
              title="My Tasks"
              subtitle="Tasks assigned to you"
              action={
                <Link href="/tasks" className="text-xs text-primary-light hover:text-white transition inline-flex items-center gap-1">
                  Open board <HiArrowRight size={12} />
                </Link>
              }
            />
            {loading ? (
              <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />)}</div>
            ) : myTasks.length === 0 ? (
              <p className="text-sm text-muted py-8 text-center">No tasks assigned to you yet.</p>
            ) : (
              <div className="space-y-2">
                {myTasks.slice(0, 6).map((t) => (
                  <Link
                    key={t._id}
                    href="/tasks"
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-purple-500/20 hover:bg-white/[0.02] transition"
                  >
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${TASK_STATUS[t.status].cls}`}>{TASK_STATUS[t.status].label}</span>
                    <span className="text-sm text-white flex-1 min-w-0 truncate">{t.title}</span>
                    {t.createdById && <span className="text-[10px] text-muted hidden sm:block">by {t.createdById.name}</span>}
                    {t.dueDate && <span className="text-[10px] text-muted flex items-center gap-1 shrink-0"><HiClock size={11} /> {formatDue(t.dueDate)}</span>}
                  </Link>
                ))}
              </div>
            )}
          </DashboardGlassCard>
        </motion.div>
      )}

      {/* Admin-only: Recent Employees + By Role */}
      {org && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <DashboardGlassCard hover={false}>
              <DashboardSectionHeader title="Recent Employees" subtitle="Newest members of the organization" />
              {loading ? (
                <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="h-12 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />)}</div>
              ) : org.recentHires.length > 0 ? (
                <DataTable
                  columns={[
                    { key: "name", header: "Name", render: (r) => (<div><p className="text-white font-medium">{r.name as string}</p><p className="text-xs text-muted">{r.email as string}</p></div>) },
                    { key: "department", header: "Department", render: (r) => (r.department as string) || "—" },
                    { key: "role", header: "Role", render: (r) => ((r.roleId as { name?: string })?.name) || "—" },
                    { key: "status", header: "Status", render: (r) => <StatusBadge status={(r.status as "active") || "active"} /> },
                    { key: "createdAt", header: "Joined", render: (r) => formatDate(r.createdAt as string) },
                  ]}
                  data={org.recentHires as unknown as Record<string, unknown>[]}
                />
              ) : (
                <p className="text-sm text-muted py-8 text-center">No employees yet.</p>
              )}
            </DashboardGlassCard>
          </motion.div>

          <motion.div variants={item}>
            <DashboardGlassCard hover={false}>
              <DashboardSectionHeader title="By Role" />
              {loading ? (
                <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="h-8 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />)}</div>
              ) : (
                <div className="space-y-3">
                  {org.byRole.map((r) => {
                    const total = org.counts.totalUsers || 1;
                    const pct = Math.round((r.count / total) * 100);
                    return (
                      <div key={r.role}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-white">{r.role}</span>
                          <span className="text-muted">{r.count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {org.byRole.length === 0 && <p className="text-sm text-muted">No data.</p>}
                </div>
              )}
            </DashboardGlassCard>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
