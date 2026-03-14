"use client";

import { motion } from "framer-motion";
import { HiPlus, HiPencil, HiEye, HiTrash } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DataTable,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";

const jobs = [
  { id: 1, title: "Senior React Developer", department: "Engineering", type: "Full-time", location: "Remote", applicants: 18, status: "active" as const, posted: "Mar 1, 2026" },
  { id: 2, title: "UI/UX Designer", department: "Design", type: "Full-time", location: "Remote", applicants: 12, status: "active" as const, posted: "Feb 25, 2026" },
  { id: 3, title: "Full Stack Developer", department: "Engineering", type: "Full-time", location: "Hybrid", applicants: 24, status: "active" as const, posted: "Feb 20, 2026" },
  { id: 4, title: "DevOps Engineer", department: "Engineering", type: "Full-time", location: "Remote", applicants: 8, status: "active" as const, posted: "Feb 15, 2026" },
  { id: 5, title: "Backend Developer", department: "Engineering", type: "Contract", location: "Remote", applicants: 6, status: "draft" as const, posted: "—" },
  { id: 6, title: "Marketing Intern", department: "Marketing", type: "Internship", location: "On-site", applicants: 31, status: "archived" as const, posted: "Jan 10, 2026" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function JobsAdminPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Jobs
          </h1>
          <p className="text-muted text-sm mt-1">Manage job listings and openings</p>
        </div>
        <AdminButton variant="primary" className="gap-1.5">
          <HiPlus size={16} /> Post Job
        </AdminButton>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Listings", value: jobs.filter((j) => j.status === "active").length, color: "text-emerald-400" },
          { label: "Draft", value: jobs.filter((j) => j.status === "draft").length, color: "text-gray-400" },
          { label: "Archived", value: jobs.filter((j) => j.status === "archived").length, color: "text-amber-400" },
          { label: "Total Applicants", value: jobs.reduce((s, j) => s + j.applicants, 0), color: "text-primary-light" },
        ].map((s) => (
          <DashboardGlassCard key={s.label} className="text-center py-4">
            <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </DashboardGlassCard>
        ))}
      </motion.div>

      {/* Jobs table */}
      <motion.div variants={item}>
        <DashboardGlassCard>
          <DashboardSectionHeader title="All Job Listings" subtitle={`${jobs.length} positions`} />
          <DataTable
            columns={[
              {
                key: "title",
                header: "Position",
                render: (row) => (
                  <div>
                    <p className="text-white font-medium text-sm">{row.title as string}</p>
                    <p className="text-muted text-xs">{row.department as string} · {row.type as string}</p>
                  </div>
                ),
              },
              {
                key: "location",
                header: "Location",
                render: (row) => <span className="text-sm text-muted">{row.location as string}</span>,
              },
              {
                key: "applicants",
                header: "Applicants",
                render: (row) => (
                  <span className="text-sm text-white font-medium">{row.applicants as number}</span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (row) => <StatusBadge status={row.status as "active" | "draft" | "archived"} />,
              },
              {
                key: "posted",
                header: "Posted",
                className: "text-xs text-muted whitespace-nowrap",
              },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: () => (
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"><HiEye size={15} /></button>
                    <button className="p-2 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"><HiPencil size={15} /></button>
                    <button className="p-2 text-muted hover:text-red-400 hover:bg-red-500/5 rounded-lg transition"><HiTrash size={15} /></button>
                  </div>
                ),
              },
            ]}
            data={jobs}
          />
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
