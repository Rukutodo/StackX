"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  HiCube,
  HiDocumentText,
  HiPlus,
  HiPencil,
  HiPhotograph,
  HiBriefcase,
  HiMail,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DashboardStatCard,
  DataTable,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";

const API = "http://129.159.236.176:4000";

/* ─── Types ─── */

interface DashboardStats {
  counts: {
    totalServices: number;
    totalProjects: number;
    activeProjects: number;
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplications: number;
    totalMessages: number;
    unreadMessages: number;
  };
  recentApplications: Array<{
    _id: string;
    fullName: string;
    email: string;
    position: string;
    status: string;
    createdAt: string;
  }>;
  recentMessages: Array<{
    _id: string;
    name: string;
    email: string;
    service: string;
    status: string;
    createdAt: string;
  }>;
  recentActivity: Array<{
    action: string;
    detail: string;
    time: string;
    dot: string;
  }>;
}

/* ─── Quick Actions (static) ─── */

const quickActions = [
  { icon: <HiPlus size={20} />, label: "Add Service", desc: "Create a new service listing", href: "/services", color: "from-primary to-purple-700" },
  { icon: <HiPhotograph size={20} />, label: "Add Portfolio", desc: "Upload a new project", href: "/portfolio", color: "from-cyan-500 to-cyan-700" },
  { icon: <HiPencil size={20} />, label: "Manage Team", desc: "Edit team members", href: "/team", color: "from-emerald-500 to-emerald-700" },
  { icon: <HiBriefcase size={20} />, label: "Post Job", desc: "Create a job opening", href: "/jobs", color: "from-amber-500 to-amber-700" },
];

/* ─── Animations ─── */

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

/* ─── Page ─── */

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/stats`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      if (!res.ok) throw new Error("Failed");
      const json: DashboardStats = await res.json();
      setData(json);
    } catch (err) {
      console.error("Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const c = data?.counts;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Page header */}
      <motion.div variants={item}>
        <h1
          className="text-2xl lg:text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          Dashboard
        </h1>
        <p className="text-muted text-sm mt-1">Welcome back — here&apos;s an overview of your platform.</p>
      </motion.div>

      {/* Stat Cards — 4 cards, responsive: 2-col on mobile, 4-col on desktop */}
      <motion.div variants={item} className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <DashboardGlassCard key={i} className="h-20 sm:h-24 animate-pulse"><></></DashboardGlassCard>
          ))
        ) : (
          <>
            <DashboardStatCard
              icon={<HiCube size={20} />}
              label="Portfolio Projects"
              value={c?.totalProjects ?? 0}
              iconBg="bg-cyan-500/10"
            />
            <DashboardStatCard
              icon={<HiBriefcase size={20} />}
              label="Active Jobs"
              value={c?.activeJobs ?? 0}
              iconBg="bg-emerald-500/10"
            />
            <DashboardStatCard
              icon={<HiDocumentText size={20} />}
              label="Applications"
              value={`${c?.newApplications ?? 0} new / ${c?.totalApplications ?? 0}`}
              iconBg="bg-amber-500/10"
            />
            <DashboardStatCard
              icon={<HiMail size={20} />}
              label="Messages"
              value={`${c?.unreadMessages ?? 0} unread / ${c?.totalMessages ?? 0}`}
              iconBg="bg-rose-500/10"
            />
          </>
        )}
      </motion.div>

      {/* Quick Actions + Recent Activity (limited to 5) */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <DashboardGlassCard>
          <DashboardSectionHeader title="Quick Actions" subtitle="Common shortcuts" />
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-2.5 p-2 sm:p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group bg-white/[0.02] sm:bg-transparent"
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5`}>
                  {a.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-white truncate">{a.label}</p>
                  <p className="hidden sm:block text-xs text-muted truncate">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </DashboardGlassCard>

        {/* Recent Activity — max 5 */}
        <DashboardGlassCard className="lg:col-span-2">
          <DashboardSectionHeader title="Recent Activity" subtitle="Latest updates across the platform" />
          {loading ? (
            <div className="py-8 text-center text-muted text-sm">Loading...</div>
          ) : !data?.recentActivity?.length ? (
            <div className="py-8 text-center text-muted text-sm">No recent activity yet.</div>
          ) : (
            <div className="space-y-0">
              {data.recentActivity.slice(0, 5).map((event, i, arr) => (
                <div key={i} className="flex gap-4 py-3 relative">
                  {i < arr.length - 1 && (
                    <div className="absolute left-[7px] top-[28px] w-px h-[calc(100%-12px)] bg-surface-border" />
                  )}
                  <div className={`w-[15px] h-[15px] rounded-full ${event.dot} shrink-0 mt-0.5 ring-4 ring-surface`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{event.action}</p>
                    <p className="text-xs text-muted truncate">{event.detail}</p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap shrink-0">{event.time}</span>
                </div>
              ))}
            </div>
          )}
        </DashboardGlassCard>
      </motion.div>

      {/* Tables row — each limited to 5 */}
      <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Messages */}
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="Recent Messages"
            subtitle="Latest contact form submissions"
            action={
              <Link href="/messages">
                <AdminButton variant="outline" size="sm" className="text-xs">
                  View All
                </AdminButton>
              </Link>
            }
          />
          {loading ? (
            <div className="py-8 text-center text-muted text-sm">Loading...</div>
          ) : !data?.recentMessages?.length ? (
            <div className="py-8 text-center text-muted text-sm">No messages yet.</div>
          ) : (
            <DataTable
              columns={[
                {
                  key: "name",
                  header: "Sender",
                  render: (row) => (
                    <div>
                      <p className="text-white font-medium text-sm">{row.name as string}</p>
                      <p className="text-muted text-xs">{row.email as string}</p>
                    </div>
                  ),
                },
                { key: "service", header: "Service" },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <StatusBadge status={row.status as "unread" | "read" | "archived"} />
                  ),
                },
                {
                  key: "createdAt",
                  header: "Date",
                  className: "text-right text-xs text-muted whitespace-nowrap",
                  render: (row) => <span>{formatDate(row.createdAt as string)}</span>,
                },
              ]}
              data={data.recentMessages.slice(0, 5)}
            />
          )}
        </DashboardGlassCard>

        {/* Recent Applications */}
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="Recent Applications"
            subtitle="Latest career applications"
            action={
              <Link href="/applications">
                <AdminButton variant="outline" size="sm" className="text-xs">
                  View All
                </AdminButton>
              </Link>
            }
          />
          {loading ? (
            <div className="py-8 text-center text-muted text-sm">Loading...</div>
          ) : !data?.recentApplications?.length ? (
            <div className="py-8 text-center text-muted text-sm">No applications yet.</div>
          ) : (
            <DataTable
              columns={[
                {
                  key: "name",
                  header: "Applicant",
                  render: (row) => (
                    <div>
                      <p className="text-white font-medium text-sm">{row.fullName as string}</p>
                      <p className="text-muted text-xs">{row.email as string}</p>
                    </div>
                  ),
                },
                { key: "position", header: "Position" },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <StatusBadge status={row.status as "new" | "reviewed" | "rejected"} />
                  ),
                },
                {
                  key: "createdAt",
                  header: "Date",
                  className: "text-right text-xs text-muted whitespace-nowrap",
                  render: (row) => <span>{formatDate(row.createdAt as string)}</span>,
                },
              ]}
              data={data.recentApplications.slice(0, 5)}
            />
          )}
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
