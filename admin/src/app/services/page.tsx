"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiPencil, HiTrash, HiPlus, HiChevronDown, HiChevronUp } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";
import ServiceCategoryModal from "@/components/admin/modals/ServiceCategoryModal";
import type { ServiceCategory } from "@/types/services";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ServicesAdminPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; editing: ServiceCategory | null }>({
    open: false,
    editing: null,
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/services?all=true");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    try {
      await fetch(`http://localhost:4000/api/services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setDeleteConfirm(null);
      fetchServices();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openAdd = () => setModal({ open: true, editing: null });
  const openEdit = (cat: ServiceCategory) => setModal({ open: true, editing: cat });
  const closeModal = () => setModal({ open: false, editing: null });

  return (
    <>
      {modal.open && (
        <ServiceCategoryModal
          initial={modal.editing}
          onClose={closeModal}
          onSaved={fetchServices}
        />
      )}

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Services
            </h1>
            <p className="text-muted text-sm mt-1">Manage your service offerings</p>
          </div>
          <AdminButton variant="primary" className="gap-1.5" onClick={openAdd}>
            <HiPlus size={16} /> Add Service
          </AdminButton>
        </motion.div>

        {/* Table / Cards */}
        <motion.div variants={item}>
          <DashboardGlassCard>
            <DashboardSectionHeader
              title="All Service Categories"
              subtitle={loading ? "Loading…" : `${categories.length} categories configured`}
            />

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className="text-muted text-sm text-center py-10">No services yet. Click &quot;Add Service&quot; to create one.</p>
            ) : (
              <div className="space-y-3 mt-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="rounded-xl border transition-all"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {/* Row */}
                    <div className="flex items-center justify-between px-4 py-3 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="text-white font-medium text-base sm:text-sm truncate">{cat.title}</p>
                          <StatusBadge status={cat.status as "active" | "draft"} />
                        </div>
                        <p className="text-muted text-sm sm:text-xs mt-0.5 truncate">{cat.tagline}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-primary-light text-sm font-semibold">Starting {cat.pricing}</p>
                        <p className="text-muted text-xs">{cat.items.length} sub-services</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setExpanded(expanded === cat._id ? null : cat._id)}
                          className="p-2 sm:p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
                          title="View items"
                        >
                          {expanded === cat._id ? <HiChevronUp size={18} className="sm:w-[15px] sm:h-[15px]" /> : <HiChevronDown size={18} className="sm:w-[15px] sm:h-[15px]" />}
                        </button>
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 sm:p-2.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                          title="Edit"
                        >
                          <HiPencil size={18} className="sm:w-[15px] sm:h-[15px]" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className={`p-2 rounded-lg transition text-sm ${
                            deleteConfirm === cat._id
                              ? "bg-red-500/10 text-red-400"
                              : "text-muted hover:text-red-400 hover:bg-red-500/5"
                          }`}
                          title={deleteConfirm === cat._id ? "Click again to confirm" : "Delete"}
                        >
                          <HiTrash size={15} />
                          {deleteConfirm === cat._id && <span className="text-xs ml-1">Confirm?</span>}
                        </button>
                      </div>
                    </div>

                    {/* Expandable items */}
                    {expanded === cat._id && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <p className="text-sm sm:text-xs text-muted uppercase tracking-wider mt-3 mb-2">Sub-services</p>
                        <div className="space-y-2">
                          {cat.items.map((it, i) => (
                            <div key={i} className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                              <p className="text-white text-sm sm:text-xs font-medium">{it.title}</p>
                              <p className="text-muted text-sm sm:text-xs mt-0.5 sm:line-clamp-2">{it.desc}</p>
                            </div>
                          ))}
                        </div>
                        {cat.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {cat.techStack.map((t) => (
                              <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-white/5 border border-white/10 text-muted">{t}</span>
                            ))}
                          </div>
                        )}
                        {cat.caseStudy && (
                          <a href={cat.caseStudy.href} className="inline-block mt-2 text-xs text-primary-light hover:text-accent transition">
                            Case study: {cat.caseStudy.title} →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </DashboardGlassCard>
        </motion.div>
      </motion.div>
    </>
  );
}
