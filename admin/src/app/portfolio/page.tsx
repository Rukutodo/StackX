"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiExternalLink } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";
import PortfolioProjectModal from "@/components/admin/modals/PortfolioProjectModal";
import type { PortfolioProject } from "@/types/portfolio";
import Link from "next/link";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";



const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [modal, setModal] = useState<{ open: boolean; editing: PortfolioProject | null }>({
    open: false,
    editing: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    try {
      await fetch(`${API}/api/portfolio/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
      });
      setDeleteConfirm(null);
      fetchProjects();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openAdd = () => setModal({ open: true, editing: null });
  const openEdit = (proj: PortfolioProject) => setModal({ open: true, editing: proj });
  const closeModal = () => setModal({ open: false, editing: null });

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      {modal.open && (
        <PortfolioProjectModal
          initial={modal.editing}
          categories={categories.filter(c => c !== "All")}
          onClose={closeModal}
          onSaved={fetchProjects}
        />
      )}

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Portfolio
            </h1>
            <p className="text-muted text-sm mt-1">Manage your project case studies</p>
          </div>
          <AdminButton variant="primary" className="gap-1.5" onClick={openAdd}>
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
                <DashboardGlassCard key={project._id} className="flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative h-36 rounded-lg mb-4 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center overflow-hidden">
                    {project.image ? (
                      <img
                        src={`${API}${project.image}`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white/20">{project.title.charAt(0)}</span>
                    )}
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
                    {project.techStack.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] bg-white/5 text-muted rounded-md border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Case study badge */}
                  {project.caseStudy && (
                    <div className="mb-3">
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                        Has Case Study
                      </span>
                    </div>
                  )}

                  {/* Result + Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                    <span className="text-xs text-primary-light font-medium">{project.result}</span>
                    <div className="flex gap-1">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        target="_blank"
                        className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
                      >
                        <HiExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => openEdit(project)}
                        className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                      >
                        <HiPencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className={`p-1.5 rounded-lg transition text-sm ${
                          deleteConfirm === project._id
                            ? "bg-red-500/10 text-red-400"
                            : "text-muted hover:text-red-400 hover:bg-red-500/5"
                        }`}
                        title={deleteConfirm === project._id ? "Click again to confirm" : "Delete"}
                      >
                        <HiTrash size={14} />
                        {deleteConfirm === project._id && <span className="text-xs ml-1">Confirm?</span>}
                      </button>
                    </div>
                  </div>
                </DashboardGlassCard>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
