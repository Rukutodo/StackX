"use client";

import { motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiStar } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DataTable,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";

const testimonials = [
  { id: 1, name: "Sarah Johnson", company: "TechFlow Inc.", rating: 5, project: "Web Dev", status: "active" as const, feedback: "StackX transformed our online presence completely. The team delivered exceptional quality..." },
  { id: 2, name: "Michael Chen", company: "InnovatePro", rating: 5, project: "Automation", status: "active" as const, feedback: "The CRM automation solution saved us 45% in operational costs. Highly recommend..." },
  { id: 3, name: "Emily Davis", company: "BrightAds", rating: 4, project: "Ad Tech", status: "active" as const, feedback: "Great work on the programmatic ad platform. Saw immediate improvements in ROAS..." },
  { id: 4, name: "James Wilson", company: "CloudNine SaaS", rating: 5, project: "Web Dev", status: "active" as const, feedback: "Outstanding SaaS dashboard with beautiful UI and excellent performance..." },
  { id: 5, name: "Priya Sharma", company: "FinEdge", rating: 5, project: "Automation", status: "active" as const, feedback: "The workflow automation platform streamlined our processes significantly..." },
  { id: 6, name: "Tom Baker", company: "EcoVentures", rating: 4, project: "Web Dev", status: "pending" as const, feedback: "Solid website development with great attention to design details..." },
  { id: 7, name: "Lisa Wang", company: "DataPulse", rating: 5, project: "Ad Tech", status: "active" as const, feedback: "Real-time analytics dashboard exceeded all our expectations for performance..." },
  { id: 8, name: "Raj Patel", company: "GrowthLab", rating: 4, project: "Automation", status: "pending" as const, feedback: "The chatbot integration improved our customer response rate dramatically..." },
];

const avgRating = (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1);

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar key={i} size={14} className={i < rating ? "text-amber-400" : "text-gray-600"} />
      ))}
    </div>
  );
}

export default function TestimonialsAdminPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Testimonials
          </h1>
          <p className="text-muted text-sm mt-1">Manage client reviews and feedback</p>
        </div>
        <AdminButton variant="primary" className="gap-1.5">
          <HiPlus size={16} /> Add Testimonial
        </AdminButton>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardGlassCard className="text-center py-5">
          <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{testimonials.length}</p>
          <p className="text-sm text-muted mt-1">Total Reviews</p>
        </DashboardGlassCard>
        <DashboardGlassCard className="text-center py-5">
          <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{avgRating}</p>
          <p className="text-sm text-muted mt-1">Average Rating</p>
        </DashboardGlassCard>
        <DashboardGlassCard className="text-center py-5">
          <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{testimonials.filter(t => t.status === "active").length}</p>
          <p className="text-sm text-muted mt-1">Published</p>
        </DashboardGlassCard>
      </motion.div>

      {/* Testimonials table */}
      <motion.div variants={item}>
        <DashboardGlassCard>
          <DashboardSectionHeader title="All Testimonials" subtitle="Client reviews and ratings" />
          <DataTable
            columns={[
              {
                key: "name",
                header: "Client",
                render: (row) => (
                  <div>
                    <p className="text-white font-medium text-sm">{row.name as string}</p>
                    <p className="text-muted text-xs">{row.company as string}</p>
                  </div>
                ),
              },
              {
                key: "rating",
                header: "Rating",
                render: (row) => <Stars rating={row.rating as number} />,
              },
              {
                key: "feedback",
                header: "Feedback",
                render: (row) => (
                  <p className="text-muted text-xs max-w-xs truncate">{row.feedback as string}</p>
                ),
              },
              {
                key: "project",
                header: "Project",
                render: (row) => (
                  <span className="text-xs px-2.5 py-0.5 bg-primary/10 text-primary-light rounded-full border border-primary/20">
                    {row.project as string}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                render: (row) => <StatusBadge status={row.status as "active" | "pending"} />,
              },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: () => (
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"><HiPencil size={15} /></button>
                    <button className="p-2 text-muted hover:text-red-400 hover:bg-red-500/5 rounded-lg transition"><HiTrash size={15} /></button>
                  </div>
                ),
              },
            ]}
            data={testimonials}
          />
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
