"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiExternalLink } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";

const projects = [
  {
    id: 1, title: "Communize Vizag", category: "Web Development",
    description: "Community engagement platform for Visakhapatnam city",
    tech: ["Next.js", "React", "Tailwind CSS"], status: "completed" as const, featured: true,
    result: "3x user engagement",
  },
  {
    id: 2, title: "AutoFlow CRM", category: "Automation",
    description: "Intelligent CRM with automated lead scoring and follow-ups",
    tech: ["Node.js", "Python", "PostgreSQL"], status: "active" as const, featured: true,
    result: "45% cost savings",
  },
  {
    id: 3, title: "AdPulse Analytics", category: "Ad Tech",
    description: "Real-time advertising analytics and optimization dashboard",
    tech: ["React", "D3.js", "AWS"], status: "active" as const, featured: false,
    result: "2x ROAS improvement",
  },
  {
    id: 4, title: "ShopEase E-Commerce", category: "Web Development",
    description: "Modern e-commerce platform with AI product recommendations",
    tech: ["Next.js", "Stripe", "MongoDB"], status: "completed" as const, featured: false,
    result: "180% revenue growth",
  },
  {
    id: 5, title: "TaskForge", category: "Automation",
    description: "Project management tool with automated workflow triggers",
    tech: ["React", "Firebase", "Node.js"], status: "active" as const, featured: true,
    result: "60% time savings",
  },
  {
    id: 6, title: "BidStream RTB", category: "Ad Tech",
    description: "Real-time bidding platform for programmatic advertising",
    tech: ["Go", "Redis", "Kafka"], status: "draft" as const, featured: false,
    result: "In development",
  },
];

const categories = ["All", "Web Development", "Automation", "Ad Tech"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function PortfolioAdminPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Portfolio
          </h1>
          <p className="text-muted text-sm mt-1">Manage your project case studies</p>
        </div>
        <AdminButton variant="primary" className="gap-1.5">
          <HiPlus size={16} /> Add Project
        </AdminButton>
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={item} className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 font-medium cursor-pointer ${
              filter === cat
                ? "bg-primary/15 text-primary-light border border-primary/30"
                : "bg-white/5 text-muted border border-transparent hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Project cards grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((project) => (
          <DashboardGlassCard key={project.id} className="flex flex-col">
            {/* Gradient thumbnail placeholder */}
            <div className="relative h-36 rounded-lg mb-4 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center overflow-hidden">
              <span className="text-2xl font-bold text-white/20">{project.title.charAt(0)}</span>
              {project.featured && (
                <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase bg-primary/20 text-primary-light rounded-full border border-primary/30">
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-white font-semibold text-sm">{project.title}</h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-muted text-xs leading-relaxed mb-3 flex-1">{project.description}</p>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tech.map((t) => (
                <span key={t} className="px-2 py-0.5 text-[10px] bg-white/5 text-muted rounded-md border border-white/5">
                  {t}
                </span>
              ))}
            </div>

            {/* Result + Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
              <span className="text-xs text-primary-light font-medium">{project.result}</span>
              <div className="flex gap-1">
                <button className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"><HiExternalLink size={14} /></button>
                <button className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"><HiPencil size={14} /></button>
                <button className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/5 rounded-lg transition"><HiTrash size={14} /></button>
              </div>
            </div>
          </DashboardGlassCard>
        ))}
      </motion.div>
    </motion.div>
  );
}
