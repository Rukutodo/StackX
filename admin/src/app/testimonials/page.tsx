"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus, HiPencil, HiTrash, HiStar, HiX,
  HiSave, HiCheck,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { Testimonial } from "@/types/testimonials";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

interface PortfolioItem {
  _id: string;
  title: string;
  slug: string;
  status: string;
}

const EMPTY: Omit<Testimonial, "_id" | "createdAt"> = {
  name: "", company: "", role: "", feedback: "",
  rating: 5, projectType: "", status: "active", order: 0, portfolioProject: null,
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

/* ── Star display ─────────────────────────── */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar key={i} size={size} className={i < rating ? "text-amber-400" : "text-gray-700"} />
      ))}
    </div>
  );
}

/* ── Interactive star picker ──────────────── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        return (
          <button
            key={i} type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <HiStar size={22} className={n <= (hover || value) ? "text-amber-400" : "text-gray-700"} />
          </button>
        );
      })}
      <span className="text-xs text-gray-500 ml-2 self-center">{value}/5</span>
    </div>
  );
}

/* ── Edit / Add Panel ─────────────────────── */
function EditPanel({
  editing,
  onClose,
  onSaved,
}: {
  editing: Testimonial | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState({ ...EMPTY, ...editing });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);

  // Fetch portfolio projects for picker
  useEffect(() => {
    fetch(`${API}/api/portfolio?all=true`)
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const setPortfolioProject = (proj: PortfolioItem | null) => {
    set("portfolioProject", proj ? { id: proj._id, slug: proj.slug, title: proj.title } : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.feedback) {
      setError("Name, company, and feedback are required.");
      return;
    }
    setSaving(true); setError("");
    try {
      const url = isEdit ? `${API}/api/testimonials/${editing!._id}` : `${API}/api/testimonials`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Failed"); }
      setSaved(true);
      setTimeout(() => { onSaved(); onClose(); }, 700);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full lg:w-[420px] shrink-0"
    >
      <DashboardGlassCard className="sticky top-6 h-fit">
        {/* Panel header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-border">
          <div>
            <h3 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              {isEdit ? "Edit Testimonial" : "Add Testimonial"}
            </h3>
            {isEdit && <p className="text-xs text-muted mt-0.5">{editing!.name} · {editing!.company}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition">
            <HiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Client Name *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="John Doe" className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Company *</label>
              <input value={form.company} onChange={(e) => set("company", e.target.value)}
                placeholder="Acme Corp" className="admin-input w-full" />
            </div>
          </div>

          {/* Role + Project Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Role / Title</label>
              <input value={form.role} onChange={(e) => set("role", e.target.value)}
                placeholder="CEO" className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Project Type</label>
              <input value={form.projectType} onChange={(e) => set("projectType", e.target.value)}
                placeholder="Web Development" className="admin-input w-full" />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs text-muted mb-2">Rating</label>
            <StarPicker value={form.rating} onChange={(n) => set("rating", n)} />
          </div>

          {/* Linked Portfolio Project */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Linked Portfolio Project</label>
            <select
              value={form.portfolioProject?.id ?? ""}
              onChange={(e) => {
                const proj = projects.find((p) => p._id === e.target.value) ?? null;
                setPortfolioProject(proj);
              }}
              className="admin-input w-full"
            >
              <option value="">— Not linked —</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
            {form.portfolioProject && (
              <p className="text-[10px] text-purple-400 mt-1 flex items-center gap-1">
                <span>↗</span> Will link to: /portfolio/{form.portfolioProject.slug}
              </p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Feedback *</label>
            <textarea
              value={form.feedback}
              onChange={(e) => set("feedback", e.target.value)}
              placeholder="What did the client say about working with StackX?"
              rows={4}
              className="admin-input w-full resize-none"
            />
          </div>

          {/* Status + Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="admin-input w-full">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))}
                className="admin-input w-full" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <HiX className="w-3.5 h-3.5 shrink-0" /> {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="text-sm text-muted hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={saving || saved}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-60"
              style={{
                background: saved ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#8B5CF6,#6D28D9)",
                boxShadow: "0 4px 16px rgba(139,92,246,0.25)",
              }}>
              {saved
                ? <><HiCheck size={14} /> Saved!</>
                : saving
                ? "Saving..."
                : <><HiSave size={14} />{isEdit ? "Save Changes" : "Add Testimonial"}</>}
            </button>
          </div>
        </form>
      </DashboardGlassCard>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────── */
export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelTarget, setPanelTarget] = useState<Testimonial | null | "new">(undefined as any);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const panelOpen = panelTarget !== undefined && panelTarget !== (undefined as any);
  const editingItem = panelTarget === "new" ? null : (panelTarget as Testimonial | null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/testimonials?all=true`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/testimonials/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      setDeleteTarget(null);
      if ((panelTarget as Testimonial)?._id === deleteTarget.id) setPanelTarget(undefined as any);
      fetchTestimonials();
    } catch (err) { console.error("Delete failed:", err); } finally { setDeleting(false); }
  };

  const activeCount = testimonials.filter((t) => t.status === "active").length;
  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : "—";

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Testimonials
          </h1>
          <p className="text-muted text-sm mt-1">Manage client reviews and feedback</p>
        </div>
        <AdminButton variant="primary" className="gap-1.5" onClick={() => setPanelTarget("new")}>
          <HiPlus size={16} /> Add Testimonial
        </AdminButton>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <DashboardGlassCard className="text-center py-5">
          <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{testimonials.length}</p>
          <p className="text-sm text-muted mt-1">Total Reviews</p>
        </DashboardGlassCard>
        <DashboardGlassCard className="text-center py-5">
          <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{avgRating}</p>
          <p className="text-sm text-muted mt-1">Avg Rating</p>
        </DashboardGlassCard>
        <DashboardGlassCard className="col-span-2 sm:col-span-1 text-center py-5">
          <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{activeCount}</p>
          <p className="text-sm text-muted mt-1">Published</p>
        </DashboardGlassCard>
      </motion.div>

      {/* Content area — list + panel side by side on desktop */}
      <motion.div variants={item} className="flex flex-col lg:flex-row gap-5 items-start">

        {/* Testimonials list */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <DashboardGlassCard>
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <HiStar size={24} className="text-amber-400" />
                </div>
                <p className="text-white font-medium mb-1">No testimonials yet</p>
                <p className="text-sm text-muted">Click &quot;Add Testimonial&quot; to create your first review.</p>
              </div>
            </DashboardGlassCard>
          ) : (
            <div className="space-y-3">
              {testimonials.map((t) => {
                const isSelected = (panelTarget as Testimonial)?._id === t._id;
                return (
                  <div
                    key={t._id}
                    onClick={() => setPanelTarget(isSelected ? (undefined as any) : t)}
                    className={`rounded-xl border transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? "border-purple-500/40 bg-purple-500/[0.06] shadow-lg shadow-purple-500/10"
                        : "border-white/[0.08] hover:border-purple-500/20 hover:bg-white/[0.02]"
                    }`}
                    style={{ background: isSelected ? undefined : "rgba(19,19,26,0.6)", backdropFilter: "blur(12px)" }}
                  >
                    <div className="flex items-start gap-4 p-4 sm:p-5">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white ${
                        isSelected ? "bg-purple-600" : "bg-purple-500/20 group-hover:bg-purple-500/30"
                      } transition-colors`}>
                        {t.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-white font-medium text-sm">{t.name}</p>
                            <p className="text-xs text-muted">{t.role ? `${t.role} · ` : ""}{t.company}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Stars rating={t.rating} />
                            <StatusBadge status={t.status} />
                          </div>
                        </div>

                        <p className="text-xs text-muted/80 mt-2 leading-relaxed line-clamp-2">{t.feedback}</p>

                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {t.portfolioProject && (
                              <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20 flex items-center gap-1">
                                ↗ {t.portfolioProject.title}
                              </span>
                            )}
                            {t.projectType && (
                              <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary-light rounded-full border border-primary/20">
                                {t.projectType}
                              </span>
                            )}
                            <span className="text-[10px] text-muted/60">{formatDate(t.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setPanelTarget(isSelected ? (undefined as any) : t)}
                              className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                              title="Edit"
                            >
                              <HiPencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: t._id, label: t.name })}
                              className="p-1.5 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/5"
                              title="Delete"
                            >
                              <HiTrash size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit / Add panel */}
        <AnimatePresence mode="wait">
          {panelOpen && (
            <EditPanel
              key={panelTarget === "new" ? "new" : (panelTarget as Testimonial)?._id}
              editing={editingItem}
              onClose={() => setPanelTarget(undefined as any)}
              onSaved={fetchTestimonials}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>

    <DeleteConfirmModal
      open={!!deleteTarget}
      title="Delete Testimonial?"
      itemLabel={deleteTarget?.label}
      description="This will permanently remove this client testimonial. This cannot be undone."
      onConfirm={handleDelete}
      onCancel={() => setDeleteTarget(null)}
      loading={deleting}
    />
    </>
  );
}
