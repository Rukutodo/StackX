"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { HiClipboardList, HiCheckCircle, HiClock, HiExclamation } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DashboardStatCard,
} from "@/components/ui";
import { BarChart, LineChart, DonutChart } from "@/components/charts";
import { usePolling } from "@/lib/usePolling";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/types";
import type { Analytics } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};
const PRIORITY_COLORS: Record<string, string> = {
  low: "#64748B",
  medium: "#06B6D4",
  high: "#F59E0B",
  urgent: "#EF4444",
};

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AnalyticsPage() {
  const { can } = useAuth();
  const isManager = can(PERMISSIONS.ANALYTICS_VIEW_TEAM);

  const fetcher = useCallback(() => api.get<Analytics>("/analytics"), []);
  const { data, loading } = usePolling(fetcher, { interval: 30000 });

  if (loading && !data) {
    return <div className="py-20 text-center text-muted text-sm">Loading analytics…</div>;
  }
  if (!data) return <div className="py-20 text-center text-muted text-sm">No analytics available.</div>;

  const s = data.summary;

  return (
    <motion.div initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          {isManager ? "Team Analytics" : "My Analytics"}
        </h1>
        <p className="text-muted text-sm mt-1">
          {isManager
            ? `Across ${data.developerCount ?? 0} active developers.`
            : "Insights into your workload and throughput."}
        </p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <DashboardStatCard icon={<HiClipboardList size={20} />} label="Total Tasks" value={s.total} iconBg="bg-cyan-500/10" />
        <DashboardStatCard icon={<HiClock size={20} />} label="In Progress" value={s.inProgress} iconBg="bg-amber-500/10" />
        <DashboardStatCard icon={<HiCheckCircle size={20} />} label="Completed" value={s.done} iconBg="bg-emerald-500/10" />
        <DashboardStatCard icon={<HiExclamation size={20} />} label="Overdue" value={s.overdue} iconBg="bg-rose-500/10" />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardGlassCard>
          <DashboardSectionHeader title="Tasks by Status" subtitle="Current distribution" />
          <DonutChart
            data={data.byStatus.map((b) => ({ label: STATUS_LABELS[b.status] || b.status, value: b.count }))}
          />
        </DashboardGlassCard>

        <DashboardGlassCard>
          <DashboardSectionHeader title="Tasks by Priority" subtitle="Where attention is needed" />
          <BarChart
            data={data.byPriority.map((b) => ({
              label: b.priority.charAt(0).toUpperCase() + b.priority.slice(1),
              value: b.count,
              color: PRIORITY_COLORS[b.priority],
            }))}
          />
        </DashboardGlassCard>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardGlassCard>
          <DashboardSectionHeader title="Throughput" subtitle="Completed tasks per week" />
          <LineChart data={data.throughput} />
        </DashboardGlassCard>

        {isManager ? (
          <DashboardGlassCard>
            <DashboardSectionHeader title="Per-Developer Throughput" subtitle="Completed vs total" />
            {data.perDeveloper.length === 0 ? (
              <div className="py-12 text-center text-muted text-sm">No developer data yet.</div>
            ) : (
              <div className="space-y-3 pt-1">
                {data.perDeveloper.map((d) => {
                  const pct = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0;
                  return (
                    <div key={d._id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white font-medium">{d.name}</span>
                        <span className="text-muted">{d.done}/{d.total} done</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </DashboardGlassCard>
        ) : (
          <DashboardGlassCard>
            <DashboardSectionHeader title="My Leave Usage" subtitle="Approved leaves by type" />
            {data.leaveByType.length === 0 ? (
              <div className="py-12 text-center text-muted text-sm">No approved leaves yet.</div>
            ) : (
              <BarChart data={data.leaveByType.map((l) => ({ label: l.type, value: l.count }))} />
            )}
          </DashboardGlassCard>
        )}
      </motion.div>

      {isManager && data.leaveByType.length > 0 && (
        <motion.div variants={item}>
          <DashboardGlassCard>
            <DashboardSectionHeader title="Team Leave Usage" subtitle="Approved leaves by type" />
            <DonutChart data={data.leaveByType.map((l) => ({ label: l.type, value: l.count }))} />
          </DashboardGlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}
