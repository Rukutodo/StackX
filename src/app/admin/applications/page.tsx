"use client";

import { motion } from "framer-motion";
import { HiEye, HiDownload, HiTrash } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DashboardStatCard,
  DataTable,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";
import { HiDocumentText, HiUserGroup, HiClock, HiCheckCircle } from "react-icons/hi";

const applications = [
  { id: 1, name: "Alex Turner", email: "alex@gmail.com", position: "Senior React Developer", experience: "6 years", date: "Mar 12, 2026", status: "new" as const, resume: "alex_turner_cv.pdf", linkedin: "linkedin.com/in/alexturner" },
  { id: 2, name: "Lisa Wang", email: "lisa.wang@outlook.com", position: "UI/UX Designer", experience: "4 years", date: "Mar 11, 2026", status: "reviewed" as const, resume: "lisa_wang_portfolio.pdf", linkedin: "linkedin.com/in/lisawang" },
  { id: 3, name: "Raj Patel", email: "raj@protonmail.com", position: "Full Stack Developer", experience: "5 years", date: "Mar 10, 2026", status: "new" as const, resume: "raj_patel_resume.pdf", linkedin: "linkedin.com/in/rajpatel" },
  { id: 4, name: "Emma Clark", email: "emma.c@yahoo.com", position: "DevOps Engineer", experience: "7 years", date: "Mar 9, 2026", status: "rejected" as const, resume: "emma_clark_cv.pdf", linkedin: "linkedin.com/in/emmaclark" },
  { id: 5, name: "Tom Baker", email: "tom.baker@gmail.com", position: "Backend Developer", experience: "3 years", date: "Mar 8, 2026", status: "reviewed" as const, resume: "tom_baker_resume.pdf", linkedin: "linkedin.com/in/tombaker" },
  { id: 6, name: "Sophia Lee", email: "sophia@email.com", position: "Senior React Developer", experience: "8 years", date: "Mar 7, 2026", status: "reviewed" as const, resume: "sophia_lee_cv.pdf", linkedin: "linkedin.com/in/sophialee" },
  { id: 7, name: "Daniel Brown", email: "daniel.b@work.com", position: "Full Stack Developer", experience: "2 years", date: "Mar 6, 2026", status: "new" as const, resume: "daniel_brown_resume.pdf", linkedin: "linkedin.com/in/danielbrown" },
  { id: 8, name: "Aisha Khan", email: "aisha.k@gmail.com", position: "UI/UX Designer", experience: "5 years", date: "Mar 5, 2026", status: "rejected" as const, resume: "aisha_khan_portfolio.pdf", linkedin: "linkedin.com/in/aishakhan" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ApplicationsAdminPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          Applications
        </h1>
        <p className="text-muted text-sm mt-1">Manage job applications</p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardStatCard icon={<HiDocumentText size={20} />} label="Total Applications" value={applications.length} trend={{ value: 12, positive: true }} />
        <DashboardStatCard icon={<HiClock size={20} />} label="New / Pending" value={applications.filter((a) => a.status === "new").length} iconBg="bg-cyan-500/10" />
        <DashboardStatCard icon={<HiCheckCircle size={20} />} label="Reviewed" value={applications.filter((a) => a.status === "reviewed").length} iconBg="bg-emerald-500/10" />
        <DashboardStatCard icon={<HiUserGroup size={20} />} label="Positions Applied" value={new Set(applications.map((a) => a.position)).size} iconBg="bg-amber-500/10" />
      </motion.div>

      {/* Applications table */}
      <motion.div variants={item}>
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="All Applications"
            subtitle="Career form submissions"
            action={<AdminButton variant="outline" size="sm">Export CSV</AdminButton>}
          />
          <DataTable
            columns={[
              {
                key: "name",
                header: "Applicant",
                render: (row) => (
                  <div>
                    <p className="text-white font-medium text-sm">{row.name as string}</p>
                    <p className="text-muted text-xs">{row.email as string}</p>
                  </div>
                ),
              },
              {
                key: "position",
                header: "Position",
                render: (row) => <span className="text-sm text-white">{row.position as string}</span>,
              },
              {
                key: "experience",
                header: "Experience",
                render: (row) => <span className="text-sm text-muted">{row.experience as string}</span>,
              },
              {
                key: "status",
                header: "Status",
                render: (row) => <StatusBadge status={row.status as "new" | "reviewed" | "rejected"} />,
              },
              {
                key: "date",
                header: "Applied",
                className: "text-xs text-muted whitespace-nowrap",
              },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: () => (
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition" title="View"><HiEye size={15} /></button>
                    <button className="p-2 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition" title="Download Resume"><HiDownload size={15} /></button>
                    <button className="p-2 text-muted hover:text-red-400 hover:bg-red-500/5 rounded-lg transition" title="Remove"><HiTrash size={15} /></button>
                  </div>
                ),
              },
            ]}
            data={applications}
          />
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
