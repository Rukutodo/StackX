"use client";

import { motion } from "framer-motion";
import {
  HiCube,
  HiUserGroup,
  HiMail,
  HiDocumentText,
  HiTrendingUp,
  HiClock,
  HiEye,
  HiCurrencyDollar,
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

const revenueData = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 90 },
  { month: "Apr", value: 81 },
  { month: "May", value: 95 },
  { month: "Jun", value: 110 },
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

      {/* Revenue + Quick Stats row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue overview */}
        <DashboardGlassCard className="lg:col-span-2">
          <DashboardSectionHeader
            title="Revenue Overview"
            subtitle="Monthly revenue trend"
            action={
              <AdminButton variant="ghost" size="sm">
                <HiEye size={14} /> View Report
              </AdminButton>
            }
          />
          {/* Chart placeholder with bars */}
          <div className="flex items-end gap-3 h-48 pt-4">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.value}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary/80 min-h-[8px] relative group"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    ${d.value}k
                  </span>
                </motion.div>
                <span className="text-xs text-muted">{d.month}</span>
              </div>
            ))}
          </div>
        </DashboardGlassCard>

        {/* Quick performance stats */}
        <DashboardGlassCard>
          <DashboardSectionHeader title="Performance" subtitle="This month" />
          <div className="space-y-5">
            {[
              { icon: <HiTrendingUp size={16} />, label: "Conversion Rate", value: "24.8%", color: "text-emerald-400" },
              { icon: <HiEye size={16} />, label: "Page Views", value: "12.4K", color: "text-primary-light" },
              { icon: <HiClock size={16} />, label: "Avg. Response Time", value: "1.8 hrs", color: "text-cyan-400" },
              { icon: <HiCurrencyDollar size={16} />, label: "Revenue", value: "$110K", color: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted">
                    {s.icon}
                  </div>
                  <span className="text-sm text-muted">{s.label}</span>
                </div>
                <span className={`text-sm font-semibold ${s.color}`}>{s.value}</span>
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
