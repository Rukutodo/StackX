"use client";

import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiClipboardList,
  HiCheckCircle,
  HiClock,
  HiExclamation,
  HiViewBoards,
  HiCalendar,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DashboardStatCard,
  StatusBadge,
  PriorityBadge,
} from "@/components/ui";
import { usePolling } from "@/lib/usePolling";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/types";
import type { Analytics, Task, Leave } from "@/lib/types";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DashboardPage() {
  const { user, can } = useAuth();
  const isManager = can(PERMISSIONS.ANALYTICS_VIEW_TEAM);

  const fetcher = useCallback(
    () =>
      Promise.all([
        api.get<Analytics>("/analytics"),
        api.get<Task[]>("/tasks"),
        api.get<Leave[]>("/leaves"),
      ]),
    []
  );
  const { data, loading } = usePolling(fetcher, { interval: 30000 });

  const [analytics, tasks, leaves] = data || [null, [], []];
  const summary = analytics?.summary;
  const recentTasks = (tasks || []).slice(0, 5);
  const pendingLeaves = (leaves || []).filter((l) => l.status === "pending").slice(0, 5);

  return (
    <motion.div initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          Welcome back, {user?.name || user?.username}
        </h1>
        <p className="text-muted text-sm mt-1">
          {isManager ? "Team overview across the engineering org." : "Here's what's on your plate."}
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <DashboardGlassCard key={i} className="h-20 sm:h-24 animate-pulse"><></></DashboardGlassCard>
          ))
        ) : (
          <>
            <DashboardStatCard icon={<HiClipboardList size={20} />} label={isManager ? "Total Tasks" : "My Tasks"} value={summary?.total ?? 0} iconBg="bg-cyan-500/10" />
            <DashboardStatCard icon={<HiClock size={20} />} label="In Progress" value={summary?.inProgress ?? 0} iconBg="bg-amber-500/10" />
            <DashboardStatCard icon={<HiCheckCircle size={20} />} label="Completed" value={summary?.done ?? 0} iconBg="bg-emerald-500/10" />
            <DashboardStatCard icon={<HiExclamation size={20} />} label="Overdue" value={summary?.overdue ?? 0} iconBg="bg-rose-500/10" />
          </>
        )}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent tasks */}
        <DashboardGlassCard className="lg:col-span-2">
          <DashboardSectionHeader
            title={isManager ? "Recent Tasks" : "My Tasks"}
            subtitle="Latest activity"
            action={
              <Link href="/board" className="text-xs text-primary-light hover:text-white flex items-center gap-1">
                <HiViewBoards size={14} /> Board
              </Link>
            }
          />
          {loading ? (
            <div className="py-8 text-center text-muted text-sm">Loading…</div>
          ) : recentTasks.length === 0 ? (
            <div className="py-8 text-center text-muted text-sm">No tasks yet.</div>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((t) => (
                <div key={t._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{t.title}</p>
                    <p className="text-xs text-muted truncate">
                      {t.assignee?.name || t.assignee?.username || "Unassigned"}
                    </p>
                  </div>
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </DashboardGlassCard>

        {/* Pending leaves */}
        <DashboardGlassCard>
          <DashboardSectionHeader
            title={isManager ? "Pending Leaves" : "My Leaves"}
            subtitle={isManager ? "Awaiting review" : "Recent requests"}
            action={
              <Link href="/leaves" className="text-xs text-primary-light hover:text-white flex items-center gap-1">
                <HiCalendar size={14} /> All
              </Link>
            }
          />
          {loading ? (
            <div className="py-8 text-center text-muted text-sm">Loading…</div>
          ) : pendingLeaves.length === 0 ? (
            <div className="py-8 text-center text-muted text-sm">Nothing pending.</div>
          ) : (
            <div className="space-y-2">
              {pendingLeaves.map((l) => (
                <div key={l._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate capitalize">{l.type}</p>
                    <p className="text-xs text-muted truncate">{l.user?.name || l.user?.username}</p>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          )}
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
