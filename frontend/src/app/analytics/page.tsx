"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiUsers, HiViewBoards, HiCalendar, HiOfficeBuilding, HiCheckCircle, HiExclamation, HiTrendingUp } from "react-icons/hi";
import { DashboardStatCard, DashboardGlassCard, DashboardSectionHeader, AdminSelect } from "@/components/portal/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Analytics, UserAnalytics, PortalUser } from "@/types";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const BAR_COLORS = ["from-primary to-accent", "from-cyan-500 to-blue-600", "from-emerald-500 to-teal-600", "from-amber-500 to-orange-600", "from-pink-500 to-rose-600", "from-violet-500 to-purple-700"];
const TASK_STATUS_COLORS: Record<string, string> = { backlog: "#6b7280", todo: "#06b6d4", in_progress: "#f59e0b", done: "#10b981" };
const LEAVE_STATUS_COLORS: Record<string, string> = { pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444" };

function Skeleton() {
  return <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="h-8 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />)}</div>;
}

function BarList({ data, colorOffset = 0 }: { data: { label: string; count: number }[]; colorOffset?: number }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  if (data.length === 0) return <p className="text-sm text-muted py-4 text-center">No data.</p>;
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-white capitalize">{d.label.replace("_", " ")}</span>
            <span className="text-muted">{d.count}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(d.count / max) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.05 }} className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[(i + colorOffset) % BAR_COLORS.length]}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Donut({ segments }: { segments: { label: string; count: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.count, 0) || 1;
  let acc = 0;
  const stops = segments.map((s) => {
    const start = (acc / total) * 100;
    acc += s.count;
    return `${s.color} ${start}% ${(acc / total) * 100}%`;
  });
  const hasData = segments.some((s) => s.count > 0);
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 shrink-0">
        <div className="w-full h-full rounded-full" style={{ background: hasData ? `conic-gradient(${stops.join(", ")})` : "rgba(255,255,255,0.05)" }} />
        <div className="absolute inset-[18%] rounded-full bg-surface flex items-center justify-center flex-col">
          <span className="text-xl font-bold text-white">{segments.reduce((s, x) => s + x.count, 0)}</span>
          <span className="text-[10px] text-muted">total</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-white capitalize">{s.label.replace("_", " ")}</span>
            <span className="text-muted">· {s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Throughput area/bar graph (last 8 weeks) ── */
function ThroughputGraph({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div>
      <div className="flex items-end gap-2 h-40">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 group">
            <span className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition">{d.count}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-accent min-h-[3px]"
              style={{ minHeight: d.count > 0 ? 6 : 3 }}
            />
            <span className="text-[9px] text-muted/70 whitespace-nowrap">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Individual user analytics view ── */
function UserView({ userId }: { userId: string }) {
  const [data, setData] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<UserAnalytics>(`/api/analytics/user/${userId}`)
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="h-96 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />;
  if (!data) return <DashboardGlassCard><p className="text-sm text-muted py-8 text-center">Could not load analytics for this user.</p></DashboardGlassCard>;

  const { user, tasks, leave } = data;
  const totalThroughput = tasks.throughput.reduce((s, t) => s + t.count, 0);
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Profile header */}
      <motion.div variants={item}>
        <DashboardGlassCard hover={false}>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-white">{user.name}</p>
              <p className="text-xs text-muted">{user.jobTitle || user.role || "Employee"} · {user.email}</p>
            </div>
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {user.role && <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20">{user.role}</span>}
              {user.department && <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-muted border border-white/10">{user.department}</span>}
              {user.manager && <span className="text-[11px] text-muted">Reports to {user.manager}</span>}
            </div>
          </div>
          <p className="text-[11px] text-muted mt-3">Joined {fmt(user.joinedAt)}</p>
        </DashboardGlassCard>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <DashboardStatCard icon={<HiViewBoards />} label="Total Tasks" value={tasks.total} />
        <DashboardStatCard icon={<HiCheckCircle />} label="Completed" value={tasks.completed} iconBg="bg-emerald-500/10" />
        <DashboardStatCard icon={<HiTrendingUp />} label="Completion" value={`${tasks.completionRate}%`} iconBg="bg-cyan-500/10" />
        <DashboardStatCard icon={<HiExclamation />} label="Overdue" value={tasks.overdue} iconBg="bg-red-500/10" />
        <DashboardStatCard icon={<HiCalendar />} label="Leave Days" value={leave.daysTaken} iconBg="bg-amber-500/10" />
      </motion.div>

      {/* Throughput */}
      <motion.div variants={item}>
        <DashboardGlassCard hover={false}>
          <DashboardSectionHeader title="Task Throughput" subtitle={`${totalThroughput} tasks completed in the last 8 weeks`} />
          <ThroughputGraph data={tasks.throughput} />
        </DashboardGlassCard>
      </motion.div>

      {/* Task progress + leave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <DashboardGlassCard hover={false}>
            <DashboardSectionHeader title="Task Progress" subtitle="Their tasks by status" />
            <BarList data={tasks.byStatus} />
          </DashboardGlassCard>
        </motion.div>

        <motion.div variants={item}>
          <DashboardGlassCard hover={false}>
            <DashboardSectionHeader title="Leave by Status" />
            <Donut segments={leave.byStatus.map((l) => ({ label: l.label, count: l.count, color: LEAVE_STATUS_COLORS[l.label] || "#8b5cf6" }))} />
            {leave.byType.length > 0 && (
              <div className="mt-5 pt-5 border-t border-white/[0.06]">
                <p className="text-xs text-muted mb-3">Days taken by type</p>
                <BarList data={leave.byType} colorOffset={3} />
              </div>
            )}
          </DashboardGlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Organization overview ── */
function OrgView() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Analytics>("/api/analytics").then(setData).catch((e) => console.error(e)).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <DashboardStatCard icon={<HiUsers />} label="Headcount" value={loading ? "—" : data?.headcount.total ?? 0} />
        <DashboardStatCard icon={<HiOfficeBuilding />} label="Departments" value={loading ? "—" : data?.byDepartment.length ?? 0} iconBg="bg-cyan-500/10" />
        <DashboardStatCard icon={<HiViewBoards />} label="Total Tasks" value={loading ? "—" : data?.tasks.total ?? 0} iconBg="bg-amber-500/10" />
        <DashboardStatCard icon={<HiCalendar />} label="Leave Requests" value={loading ? "—" : data?.leave.total ?? 0} iconBg="bg-emerald-500/10" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}><DashboardGlassCard hover={false}><DashboardSectionHeader title="Headcount by Department" />{loading ? <Skeleton /> : <BarList data={data?.byDepartment ?? []} />}</DashboardGlassCard></motion.div>
        <motion.div variants={item}><DashboardGlassCard hover={false}><DashboardSectionHeader title="Headcount by Role" />{loading ? <Skeleton /> : <BarList data={data?.byRole ?? []} colorOffset={2} />}</DashboardGlassCard></motion.div>
        <motion.div variants={item}><DashboardGlassCard hover={false}><DashboardSectionHeader title="Tasks by Status" />{loading ? <Skeleton /> : <Donut segments={(data?.tasks.byStatus ?? []).map((t) => ({ label: t.label, count: t.count, color: TASK_STATUS_COLORS[t.label] || "#8b5cf6" }))} />}</DashboardGlassCard></motion.div>
        <motion.div variants={item}><DashboardGlassCard hover={false}><DashboardSectionHeader title="Leave by Status" />{loading ? <Skeleton /> : <Donut segments={(data?.leave.byStatus ?? []).map((l) => ({ label: l.label, count: l.count, color: LEAVE_STATUS_COLORS[l.label] || "#8b5cf6" }))} />}</DashboardGlassCard></motion.div>
      </div>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const { user, hasPermission } = useAuth();
  const hasOrgView = hasPermission("analytics.view");
  // Org overview is the default only for those allowed to see it; everyone else lands on themselves.
  const [view, setView] = useState<string>(hasOrgView ? "org" : user?.id || "self");
  const [people, setPeople] = useState<Pick<PortalUser, "_id" | "name">[]>([]);

  useEffect(() => {
    api<Pick<PortalUser, "_id" | "name">[]>("/api/analytics/users")
      .then((d) => setPeople(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const personOptions = people.map((p) => ({ label: p._id === user?.id ? `${p.name} (You)` : p.name, value: p._id }));
  const options = hasOrgView
    ? [{ label: "Organization Overview", value: "org" }, ...personOptions]
    : personOptions;
  // Hide the picker entirely when there's only one thing to show (e.g. an employee seeing just themselves)
  const showPicker = options.length > 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Analytics</h1>
          <p className="text-muted text-sm mt-1">
            {view === "org" ? "Organization-wide insights" : hasOrgView ? "Individual performance & leave" : "Your performance & leave"}
          </p>
        </div>
        {showPicker && (
          <div className="w-full sm:w-64">
            <AdminSelect value={view} onChange={setView} placeholder="Select view" options={options} />
          </div>
        )}
      </div>

      {view === "org" ? <OrgView /> : <UserView userId={view} key={view} />}
    </div>
  );
}
