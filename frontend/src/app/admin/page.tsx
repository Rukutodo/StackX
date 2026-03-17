"use client";

import { motion } from "framer-motion";
import {
  HiCube,
  HiUserGroup,
  HiMail,
  HiDocumentText,
  HiPlus,
  HiPencil,
  HiPhotograph,
  HiBriefcase,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DashboardStatCard,
  DataTable,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";

/* ─── Mock Data ─── */
const stats = [
  {
    icon: <HiCube size={20} />,
    label: "Total Projects",
    value: "156",
    trend: { value: 12, positive: true },
    iconBg: "bg-primary/10",
  },
  {
    icon: <HiUserGroup size={20} />,
    label: "Active Clients",
    value: "84",
    trend: { value: 8, positive: true },
    iconBg: "bg-cyan-500/10",
  },
  {
    icon: <HiMail size={20} />,
    label: "New Messages",
    value: "23",
    trend: { value: 5, positive: true },
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: <HiDocumentText size={20} />,
    label: "Applications",
    value: "47",
    trend: { value: 3, positive: false },
    iconBg: "bg-amber-500/10",
  },
];

const recentMessages = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", subject: "Website redesign inquiry", date: "2 hours ago", status: "unread" as const },
  { id: 2, name: "Michael Chen", email: "michael@techcorp.io", subject: "Partnership proposal", date: "5 hours ago", status: "unread" as const },
  { id: 3, name: "Emily Davis", email: "emily@startup.co", subject: "Quote for mobile app", date: "1 day ago", status: "read" as const },
  { id: 4, name: "James Wilson", email: "james@agency.com", subject: "Ad tech integration", date: "2 days ago", status: "read" as const },
  { id: 5, name: "Priya Sharma", email: "priya@fintech.in", subject: "Automation services", date: "3 days ago", status: "read" as const },
];

const recentApplications = [
  { id: 1, name: "Alex Turner", position: "Senior React Developer", date: "Mar 12, 2026", status: "new" as const },
  { id: 2, name: "Lisa Wang", position: "UI/UX Designer", date: "Mar 11, 2026", status: "reviewed" as const },
  { id: 3, name: "Raj Patel", position: "Full Stack Developer", date: "Mar 10, 2026", status: "new" as const },
  { id: 4, name: "Emma Clark", position: "DevOps Engineer", date: "Mar 9, 2026", status: "rejected" as const },
  { id: 5, name: "Tom Baker", position: "Backend Developer", date: "Mar 8, 2026", status: "reviewed" as const },
];

const quickActions = [
  { icon: <HiPlus size={20} />, label: "Add Service", desc: "Create a new service listing", href: "/admin/services", color: "from-primary to-purple-700" },
  { icon: <HiPhotograph size={20} />, label: "Add Portfolio", desc: "Upload a new project", href: "/admin/portfolio", color: "from-cyan-500 to-cyan-700" },
  { icon: <HiPencil size={20} />, label: "Manage Team", desc: "Edit team members", href: "/admin/team", color: "from-emerald-500 to-emerald-700" },
  { icon: <HiBriefcase size={20} />, label: "Post Job", desc: "Create a job opening", href: "/admin/jobs", color: "from-amber-500 to-amber-700" },
];

const recentActivity = [
  { id: 1, action: "New message received", detail: "Sarah Johnson — Website redesign inquiry", time: "2 hours ago", dot: "bg-primary" },
  { id: 2, action: "Application submitted", detail: "Alex Turner applied for Senior React Developer", time: "4 hours ago", dot: "bg-cyan-400" },
  { id: 3, action: "Portfolio updated", detail: "Communize Vizag project published", time: "1 day ago", dot: "bg-emerald-400" },
  { id: 4, action: "Service modified", detail: "Web Development pricing updated", time: "1 day ago", dot: "bg-amber-400" },
  { id: 5, action: "New message received", detail: "Michael Chen — Partnership proposal", time: "2 days ago", dot: "bg-primary" },
  { id: 6, action: "Team member added", detail: "Priya Sharma joined as DevOps Lead", time: "3 days ago", dot: "bg-emerald-400" },
  { id: 7, action: "Job posting created", detail: "UI/UX Designer position published", time: "3 days ago", dot: "bg-amber-400" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminDashboardPage() {
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

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </motion.div>

      {/* Quick Actions + Recent Activity */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <DashboardGlassCard>
          <DashboardSectionHeader title="Quick Actions" subtitle="Common shortcuts" />
          <div className="space-y-3">
            {quickActions.map((a) => (
              <a
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform`}>
                  {a.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{a.label}</p>
                  <p className="text-xs text-muted">{a.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </DashboardGlassCard>

        {/* Recent Activity */}
        <DashboardGlassCard className="lg:col-span-2">
          <DashboardSectionHeader title="Recent Activity" subtitle="Latest updates across the platform" />
          <div className="space-y-0">
            {recentActivity.map((event, i) => (
              <div key={event.id} className="flex gap-4 py-3 relative">
                {/* Timeline line */}
                {i < recentActivity.length - 1 && (
                  <div className="absolute left-[7px] top-[28px] w-px h-[calc(100%-12px)] bg-surface-border" />
                )}
                {/* Dot */}
                <div className={`w-[15px] h-[15px] rounded-full ${event.dot} shrink-0 mt-0.5 ring-4 ring-surface`} />
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{event.action}</p>
                  <p className="text-xs text-muted truncate">{event.detail}</p>
                </div>
                <span className="text-xs text-muted whitespace-nowrap shrink-0">{event.time}</span>
              </div>
            ))}
          </div>
        </DashboardGlassCard>
      </motion.div>

      {/* Tables row */}
      <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Messages */}
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="Recent Messages"
            subtitle="Latest contact form submissions"
            action={
              <AdminButton variant="outline" size="sm" className="text-xs">
                View All
              </AdminButton>
            }
          />
          <DataTable
            columns={[
              {
                key: "name",
                header: "From",
                render: (row) => (
                  <div>
                    <p className="text-white font-medium text-sm">{row.name as string}</p>
                    <p className="text-muted text-xs">{row.email as string}</p>
                  </div>
                ),
              },
              { key: "subject", header: "Subject" },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <StatusBadge status={row.status as "unread" | "read"} />
                ),
              },
              {
                key: "date",
                header: "",
                className: "text-right text-xs text-muted whitespace-nowrap",
              },
            ]}
            data={recentMessages}
          />
        </DashboardGlassCard>

        {/* Recent Applications */}
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="Recent Applications"
            subtitle="Latest career applications"
            action={
              <AdminButton variant="outline" size="sm" className="text-xs">
                View All
              </AdminButton>
            }
          />
          <DataTable
            columns={[
              {
                key: "name",
                header: "Applicant",
                render: (row) => (
                  <p className="text-white font-medium text-sm">{row.name as string}</p>
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
                key: "date",
                header: "Date",
                className: "text-right text-xs text-muted whitespace-nowrap",
              },
            ]}
            data={recentApplications}
          />
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
