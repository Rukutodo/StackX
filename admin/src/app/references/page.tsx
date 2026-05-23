"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus, HiPencil, HiTrash, HiX,
  HiSave, HiCheck, HiLink, HiCollection, HiInformationCircle,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { Reference } from "@/types/reference";
import type { ServiceCategory } from "@/types/services";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

const EMPTY: Omit<Reference, "_id"> = {
  slug: "",
  title: "",
  description: "",
  keywords: "",
  ogImage: "",
  canonical: "",
  robots: "index, follow",
  focusKeyword: "",
  service: "",
  status: "active",
  order: 0,
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

/* ── Edit / Add Panel ─────────────────────── */
function EditPanel({
  editing,
  onClose,
  onSaved,
}: {
  editing: Reference | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState({ 
    ...EMPTY, 
    ...editing,
    service: editing ? (typeof editing.service === 'string' ? editing.service : editing.service._id) : ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [activeTab, setActiveTab] = useState<"general" | "seo">("general");

  // Fetch services for picker
  useEffect(() => {
    fetch(`${API}/api/services?all=true`)
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const set = (k: string, v: unknown) => {
    setForm((f) => {
      const updated = { ...f, [k]: v };
      // Auto-slug generation for NEW items only
      if (k === "title" && !isEdit) {
        updated.slug = (v as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      }
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.service) {
      setError("Title, slug, and service are required.");
      return;
    }
    setSaving(true); setError("");
    try {
      const url = isEdit ? `${API}/api/references/${editing!._id}` : `${API}/api/references`;
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
      className="w-full lg:w-[480px] shrink-0"
    >
      <DashboardGlassCard className="sticky top-6 h-fit max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
        {/* Panel header */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-surface-border">
          <div>
            <h3 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              {isEdit ? "Edit Reference" : "Add Reference"}
            </h3>
            {isEdit && <p className="text-xs text-muted mt-0.5 truncate max-w-[200px]">{editing!.title}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition">
            <HiX size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition ${activeTab === 'general' ? 'bg-primary/20 text-primary-light shadow-sm' : 'text-muted hover:text-white'}`}
          >
            General
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition ${activeTab === 'seo' ? 'bg-primary/20 text-primary-light shadow-sm' : 'text-muted hover:text-white'}`}
          >
            Technical SEO
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "general" ? (
            <>
              {/* Title */}
              <div>
                <label className="block text-xs text-muted mb-1.5">Reference Title *</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)}
                  placeholder="Venu Web Services" className="admin-input w-full" />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs text-muted mb-1.5">Route Slug *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/30 text-sm">/</span>
                  <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                    placeholder="venu" className="admin-input w-full pl-5 font-mono text-sm" />
                </div>
                <p className="text-[10px] text-muted/50 mt-1 italic">The final URL will be stackx.co.in/{form.slug || '...'}</p>
              </div>

              {/* Associated Service */}
              <div>
                <label className="block text-xs text-muted mb-1.5">Parent Service *</label>
                <select
                  value={form.service as string}
                  onChange={(e) => set("service", e.target.value)}
                  className="admin-input w-full"
                >
                  <option value="">— Select Service —</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>{s.title}</option>
                  ))}
                </select>
              </div>

              {/* Status + Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)} className="admin-input w-full">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Display Order</label>
                  <input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))}
                    className="admin-input w-full" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Focus Keyword */}
              <div>
                <label className="block text-xs text-muted mb-1.5">Focus Keyword</label>
                <input value={form.focusKeyword} onChange={(e) => set("focusKeyword", e.target.value)}
                  placeholder="web design agency" className="admin-input w-full" />
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-xs text-muted mb-1.5">Meta Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Optimized description for search engines..."
                  rows={3}
                  className="admin-input w-full resize-none text-sm"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs text-muted mb-1.5">Meta Keywords (comma-separated)</label>
                <textarea
                  value={form.keywords}
                  onChange={(e) => set("keywords", e.target.value)}
                  placeholder="agency, web design, pune, stackx"
                  rows={2}
                  className="admin-input w-full resize-none text-sm"
                />
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-xs text-muted mb-1.5">OG Image URL</label>
                <input value={form.ogImage} onChange={(e) => set("ogImage", e.target.value)}
                  placeholder="https://example.com/image.jpg" className="admin-input w-full font-mono text-[10px]" />
              </div>

              {/* Canonical + Robots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1.5">Canonical URL Override</label>
                  <input value={form.canonical} onChange={(e) => set("canonical", e.target.value)}
                    placeholder="https://..." className="admin-input w-full text-[10px]" />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Meta Robots</label>
                  <select value={form.robots} onChange={(e) => set("robots", e.target.value)} className="admin-input w-full">
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, nofollow">Noindex, Nofollow</option>
                    <option value="index, nofollow">Index, Nofollow</option>
                    <option value="noindex, follow">Noindex, Follow</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <HiX className="w-3.5 h-3.5 shrink-0" /> {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-surface-border">
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
                : <><HiSave size={14} />{isEdit ? "Save Changes" : "Add Reference"}</>}
            </button>
          </div>
        </form>
      </DashboardGlassCard>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────── */
export default function ReferenceAdminPage() {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelTarget, setPanelTarget] = useState<Reference | null | "new">(undefined as any);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const panelOpen = panelTarget !== undefined && panelTarget !== (undefined as any);
  const editingItem = panelTarget === "new" ? null : (panelTarget as Reference | null);

  const fetchReferences = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/references?all=true`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      const data = await res.json();
      setReferences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load references:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReferences(); }, [fetchReferences]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/references/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      setDeleteTarget(null);
      if ((panelTarget as Reference)?._id === deleteTarget.id) setPanelTarget(undefined as any);
      fetchReferences();
    } catch (err) { console.error("Delete failed:", err); } finally { setDeleting(false); }
  };

  const activeCount = references.filter((r) => r.status === "active").length;

  return (
    <>
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Reference Pages
          </h1>
          <p className="text-muted text-sm mt-1">Manage unique SEO route mappings for services</p>
        </div>
        <AdminButton variant="primary" className="gap-1.5" onClick={() => setPanelTarget("new")}>
          <HiPlus size={16} /> Add Reference
        </AdminButton>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:gap-4">
        <DashboardGlassCard className="text-center py-5">
          <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{references.length}</p>
          <p className="text-sm text-muted mt-1">Total Mappings</p>
        </DashboardGlassCard>
        <DashboardGlassCard className="text-center py-5">
          <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{activeCount}</p>
          <p className="text-sm text-muted mt-1">Active Routes</p>
        </DashboardGlassCard>
      </motion.div>

      {/* Content area — list + panel side by side on desktop */}
      <motion.div variants={item} className="flex flex-col lg:flex-row gap-5 items-start">

        {/* References list */}
        <div className="flex-1 min-w-0 w-full">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
              ))}
            </div>
          ) : references.length === 0 ? (
            <DashboardGlassCard>
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <HiCollection size={24} className="text-primary-light" />
                </div>
                <p className="text-white font-medium mb-1">No reference pages yet</p>
                <p className="text-sm text-muted">Create a reference to map a custom URL to a service.</p>
              </div>
            </DashboardGlassCard>
          ) : (
            <div className="space-y-3">
              {references.map((r) => {
                const isSelected = (panelTarget as Reference)?._id === r._id;
                const service = typeof r.service === 'string' ? { title: 'Unknown', slug: '...' } : r.service;
                
                return (
                  <div
                    key={r._id}
                    onClick={() => setPanelTarget(isSelected ? (undefined as any) : r)}
                    className={`rounded-xl border transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? "border-primary/40 bg-primary/[0.06] shadow-lg shadow-primary/10"
                        : "border-white/[0.08] hover:border-primary/20 hover:bg-white/[0.02]"
                    }`}
                    style={{ background: isSelected ? undefined : "rgba(19,19,26,0.6)", backdropFilter: "blur(12px)" }}
                  >
                    <div className="flex items-center gap-4 p-4 sm:p-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white ${
                        isSelected ? "bg-primary" : "bg-primary/20 group-hover:bg-primary/30"
                      } transition-colors`}>
                        <HiLink size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-white font-medium text-sm">{r.title}</p>
                            <p className="text-[10px] font-mono text-muted/60 mt-0.5">/{r.slug}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge status={r.status} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 bg-white/5 text-muted rounded-full border border-white/10 flex items-center gap-1">
                              Parent: {service.title}
                            </span>
                            <span className="text-[10px] text-muted/40 italic">Order: {r.order}</span>
                          </div>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setPanelTarget(isSelected ? (undefined as any) : r)}
                              className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                            >
                              <HiPencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: r._id, label: r.title })}
                              className="p-1.5 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/5"
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
              key={panelTarget === "new" ? "new" : (panelTarget as Reference)?._id}
              editing={editingItem}
              onClose={() => setPanelTarget(undefined as any)}
              onSaved={fetchReferences}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>

    <DeleteConfirmModal
      open={!!deleteTarget}
      title="Delete Reference Page?"
      itemLabel={deleteTarget?.label}
      description="This will permanently remove this URL mapping and its physical folder. This cannot be undone."
      onConfirm={handleDelete}
      onCancel={() => setDeleteTarget(null)}
      loading={deleting}
    />
    </>
  );
}
