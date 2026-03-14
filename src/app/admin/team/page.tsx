"use client";

import { motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiMail } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  AdminButton,
} from "@/components/admin/ui";

const teamMembers = [
  { id: 1, name: "Nuraj", role: "CEO & Founder", department: "Leadership", email: "nuraj@stackx.dev", image: "/team/nuraj.png", status: "Active" },
  { id: 2, name: "Roshan", role: "CTO", department: "Engineering", email: "roshan@stackx.dev", image: "/team/roshan.jpeg", status: "Active" },
  { id: 3, name: "Venu", role: "Lead Developer", department: "Engineering", email: "venu@stackx.dev", image: "/team/venu.jpeg", status: "Active" },
  { id: 4, name: "Ananya Reddy", role: "UI/UX Designer", department: "Design", email: "ananya@stackx.dev", image: null, status: "Active" },
  { id: 5, name: "Kiran Rao", role: "Backend Developer", department: "Engineering", email: "kiran@stackx.dev", image: null, status: "Active" },
  { id: 6, name: "Meera Joshi", role: "Project Manager", department: "Operations", email: "meera@stackx.dev", image: null, status: "On Leave" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function TeamAdminPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Team
          </h1>
          <p className="text-muted text-sm mt-1">Manage your team members</p>
        </div>
        <AdminButton variant="primary" className="gap-1.5">
          <HiPlus size={16} /> Add Member
        </AdminButton>
      </motion.div>

      {/* Team grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <DashboardGlassCard key={member.id} className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-2xl font-bold text-white/40 mb-4 overflow-hidden">
              {member.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                member.name.charAt(0)
              )}
            </div>

            <h3 className="text-white font-semibold text-sm">{member.name}</h3>
            <p className="text-primary-light text-xs font-medium mt-0.5">{member.role}</p>
            <p className="text-muted text-xs mt-0.5">{member.department}</p>

            <span className={`mt-3 px-2.5 py-0.5 text-[10px] font-medium rounded-full border ${
              member.status === "Active"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}>
              {member.status}
            </span>

            <div className="flex items-center gap-1 mt-4 pt-4 border-t border-surface-border w-full justify-center">
              <button className="p-2 text-muted hover:text-cyan-400 hover:bg-cyan-500/5 rounded-lg transition"><HiMail size={15} /></button>
              <button className="p-2 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"><HiPencil size={15} /></button>
              <button className="p-2 text-muted hover:text-red-400 hover:bg-red-500/5 rounded-lg transition"><HiTrash size={15} /></button>
            </div>
          </DashboardGlassCard>
        ))}
      </motion.div>
    </motion.div>
  );
}
