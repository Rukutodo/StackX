"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiExternalLink, HiDocumentText } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";
import type { PortfolioProject } from "@/types/portfolio";
import Link from "next/link";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function PortfolioAdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/portfolio?all=true`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load portfolio:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/services`);
      const data = await res.json();
      const serviceNames = Array.isArray(data) ? data.map((s: any) => s.title) : [];
      setCategories(["All", ...serviceNames]);
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchServices();
  }, [fetchProjects, fetchServices]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/portfolio/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Portfolio
          </h1>
          <p className="text-muted text-sm mt-1">Manage your project case studies</p>
        </div>
        <AdminButton variant="primary" className="gap-1.5" onClick={() => router.push("/portfolio/new")}>
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
      <motion.div variants={item}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <DashboardGlassCard>
            <p className="text-muted text-sm text-center py-10">
              {projects.length === 0
                ? 'No projects yet. Click "Add Project" to create one.'
                : "No projects match the selected filter."}
            </p>
          </DashboardGlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <DashboardGlassCard key={project._id} className="flex flex-col group">
                {/* Thumbnail */}
                <div className="relative h-36 rounded-lg mb-4 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center overflow-hidden">
                  {project.image ? (
                    <img src={`${API}${project.image}`} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white/20">{project.title.charAt(0)}</span>
                  )}
                  {project.featured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase bg-primary/20 text-primary-light rounded-full border border-primary/30">
                      Featured
                    </span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      onClick={() => router.push(`/portfolio/edit/${project._id}`)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-white/90 text-gray-900 hover:bg-white transition"
                    >
                      <HiPencil size={14} /> Edit
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-semibold text-sm">{project.title}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-muted text-xs leading-relaxed mb-3 flex-1 line-clamp-2">{project.description}</p>

                {/* Tech stack pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.techStack.slice(0, 4).map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] bg-white/5 text-muted rounded-md border border-white/5">{t}</span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="px-2 py-0.5 text-[10px] bg-white/5 text-muted rounded-md border border-white/5">+{project.techStack.length - 4}</span>
                  )}
                </div>

                {project.caseStudy && (
                  <div className="mb-3">
                    <button
                      onClick={() => router.push(`/portfolio/case-study/${project._id}`)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition"
                    >
                      <HiDocumentText size={11} /> Edit Case Study
                    </button>
                  </div>
                )}

                {/* Result + Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                  <span className="text-xs text-primary-light font-medium truncate flex-1 mr-2">{project.result}</span>
                  <div className="flex gap-1 shrink-0">
                    <Link href={`/portfolio/${project.slug}`} target="_blank"
                      className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition" title="Preview">
                      <HiExternalLink size={14} />
                    </Link>
                    <button onClick={() => router.push(`/portfolio/edit/${project._id}`)}
                      className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition" title="Edit">
                      <HiPencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: project._id, label: project.title })}
                      className="p-1.5 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/5"
                      title="Delete"
                    >
                      <HiTrash size={14} />
                    </button>
                  </div>
                </div>
              </DashboardGlassCard>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>

    <DeleteConfirmModal
      open={!!deleteTarget}
      title="Delete Portfolio Project?"
      itemLabel={deleteTarget?.label}
      description="This will permanently remove the project and all its case study content. This cannot be undone."
      onConfirm={handleDelete}
      onCancel={() => setDeleteTarget(null)}
      loading={deleting}
    />
    </>
  );
}
