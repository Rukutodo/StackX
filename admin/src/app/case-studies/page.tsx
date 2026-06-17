"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus, HiPencil, HiTrash, HiX, HiSave, HiCheck,
  HiSearch, HiBookOpen, HiStar,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  StatusBadge,
  AdminButton,
  AdminSelect,
  FilterDropdown,
} from "@/components/admin/ui";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { CaseStudy } from "@/types/caseStudies";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

const EMPTY: Omit<CaseStudy, "_id" | "createdAt"> = {
  title: "", slug: "", client: "", service: "", subtitle: "",
  overview: "", problem: "", solution: "",
  features: [], results: [], images: [],
  featured: false, status: "draft", order: 0, portfolioProject: null,
};

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

/* ── Edit / Add Panel ─────────────────────── */
function EditPanel({
  editing,
  onClose,
  onSaved,
}: {
  editing: CaseStudy | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState<Omit<CaseStudy, "_id" | "createdAt">>({ ...EMPTY, ...editing });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [projects, setProjects] = useState<{ _id: string; title: string; slug: string }[]>([]);
  const [services, setServices] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    fetch(`${API}/api/portfolio?all=true`)
      .then((r) => r.json()).then((d) => setProjects(Array.isArray(d) ? d : [])).catch(() => {});
    fetch(`${API}/api/services`)
      .then((r) => r.json()).then((d) => setServices(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!slugTouched) set("slug", toSlug(val));
  };

  /* Features */
  const addFeature = () => set("features", [...form.features, ""]);
  const setFeature = (i: number, val: string) => {
    const f = [...form.features]; f[i] = val; set("features", f);
  };
  const removeFeature = (i: number) => set("features", form.features.filter((_, idx) => idx !== i));

  /* Results */
  const addResult = () => set("results", [...form.results, { metric: "", label: "" }]);
  const setResult = (i: number, k: "metric" | "label", val: string) => {
    const r = [...form.results]; r[i] = { ...r[i], [k]: val }; set("results", r);
  };
  const removeResult = (i: number) => set("results", form.results.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) { setError("Title and slug are required."); return; }
    setSaving(true); setError("");
    try {
      const url = isEdit ? `${API}/api/case-studies/${editing!._id}` : `${API}/api/case-studies`;
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
      className="w-full lg:w-[460px] shrink-0"
    >
      <DashboardGlassCard className="sticky top-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-border">
          <div>
            <h3 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              {isEdit ? "Edit Case Study" : "Add Case Study"}
            </h3>
            {isEdit && <p className="text-xs text-muted mt-0.5">{editing!.title}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition">
            <HiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="E-commerce Platform Redesign" className="admin-input w-full" />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); set("slug", toSlug(e.target.value)); }}
              placeholder="ecommerce-platform-redesign"
              className="admin-input w-full font-mono text-xs"
            />
          </div>

          {/* Client + Service */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Client</label>
              <input value={form.client} onChange={(e) => set("client", e.target.value)}
                placeholder="Acme Corp" className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Service</label>
              <AdminSelect
                value={form.service}
                onChange={(val) => set("service", val)}
                placeholder="Select Service"
                size="sm"
                options={services.map((s) => ({ label: s.title, value: s.title }))}
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Subtitle</label>
            <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Case Study — Web Development" className="admin-input w-full" />
          </div>

          {/* Overview */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Overview</label>
            <textarea value={form.overview} onChange={(e) => set("overview", e.target.value)}
              placeholder="High-level summary of what was built and why it matters..."
              rows={3} className="admin-input w-full resize-none" />
          </div>

          {/* Problem */}
          <div>
            <label className="block text-xs text-muted mb-1.5">The Problem</label>
            <textarea value={form.problem} onChange={(e) => set("problem", e.target.value)}
              placeholder="What challenge did the client face?"
              rows={3} className="admin-input w-full resize-none" />
          </div>

          {/* Solution */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Our Solution</label>
            <textarea value={form.solution} onChange={(e) => set("solution", e.target.value)}
              placeholder="How did StackX approach and solve the challenge?"
              rows={3} className="admin-input w-full resize-none" />
          </div>

          {/* Features */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Key Features</label>
            <div className="space-y-2">
              {form.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <input value={feat} onChange={(e) => setFeature(i, e.target.value)}
                    placeholder={`Feature ${i + 1}`} className="admin-input flex-1 text-sm" />
                  <button type="button" onClick={() => removeFeature(i)}
                    className="p-1 text-muted hover:text-red-400 transition shrink-0">
                    <HiTrash size={13} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addFeature}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition w-fit">
                <HiPlus size={12} /> Add Feature
              </button>
            </div>
          </div>

          {/* Results */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Result Metrics</label>
            <div className="space-y-2">
              {form.results.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={r.metric} onChange={(e) => setResult(i, "metric", e.target.value)}
                    placeholder="3×" className="admin-input w-16 text-center font-bold" />
                  <input value={r.label} onChange={(e) => setResult(i, "label", e.target.value)}
                    placeholder="Engagement Increase" className="admin-input flex-1 text-sm" />
                  <button type="button" onClick={() => removeResult(i)}
                    className="p-1 text-muted hover:text-red-400 transition shrink-0">
                    <HiTrash size={13} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addResult}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition w-fit">
                <HiPlus size={12} /> Add Metric
              </button>
            </div>
          </div>

          {/* Linked Portfolio Project */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Linked Portfolio Project</label>
            <AdminSelect
              value={form.portfolioProject?.id ?? ""}
              onChange={(val) => {
                const proj = projects.find((p) => p._id === val) ?? null;
                set("portfolioProject", proj ? { id: proj._id, slug: proj.slug, title: proj.title } : null);
              }}
              placeholder="Not linked"
              size="sm"
              options={[
                { label: "Not linked", value: "" },
                ...projects.map((p) => ({ label: p.title, value: p._id })),
              ]}
            />
            {form.portfolioProject && (
              <p className="text-[10px] text-purple-400 mt-1">↗ /portfolio/{form.portfolioProject.slug}</p>
            )}
          </div>

          {/* Status + Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Status</label>
              <AdminSelect
                value={form.status}
                onChange={(val) => set("status", val)}
                size="sm"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Draft", value: "draft" },
                  { label: "Archived", value: "archived" },
                ]}
              />
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
          <div className="flex items-center justify-between gap-3 pt-2 sticky bottom-0 pb-1"
            style={{ background: "rgba(13,13,20,0.95)" }}>
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
                : saving ? "Saving..."
                : <><HiSave size={14} />{isEdit ? "Save Changes" : "Add Case Study"}</>}
            </button>
          </div>
        </form>
      </DashboardGlassCard>
    </motion.div>
  );
}

export default function CaseStudiesAdminPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft" | "archived">("all");
  const [filterService, setFilterService] = useState("all");
  const [allServices, setAllServices] = useState<{ _id: string; title: string }[]>([]);
  const [panelTarget, setPanelTarget] = useState<CaseStudy | null | "new">(undefined as any);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const panelOpen = panelTarget !== undefined && panelTarget !== (undefined as any);
  const editingItem = panelTarget === "new" ? null : (panelTarget as CaseStudy | null);

  const fetchCaseStudies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/case-studies?all=true`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      const data = await res.json();
      setCaseStudies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load case studies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCaseStudies();
    fetch(`${API}/api/services`)
      .then((r) => r.json())
      .then((d) => setAllServices(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [fetchCaseStudies]);

  const handleSetFeatured = async (id: string) => {
    try {
      await fetch(`${API}/api/case-studies/${id}/feature`, {
        method: "PATCH",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      fetchCaseStudies();
    } catch (err) { console.error("Set featured failed:", err); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/case-studies/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      setDeleteTarget(null);
      if ((panelTarget as CaseStudy)?._id === deleteTarget.id) setPanelTarget(undefined as any);
      fetchCaseStudies();
    } catch (err) { console.error("Delete failed:", err); } finally { setDeleting(false); }
  };

  const activeCount = caseStudies.filter((cs) => cs.status === "active").length;
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const filtered = caseStudies
    .filter((cs) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        cs.title.toLowerCase().includes(q) ||
        cs.client.toLowerCase().includes(q) ||
        cs.service.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "all" || cs.status === filterStatus;
      const matchesService = filterService === "all" || cs.service === filterService;
      return matchesSearch && matchesStatus && matchesService;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Case Studies
            </h1>
            <p className="text-muted text-sm mt-1">Manage client success stories</p>
          </div>
          <AdminButton variant="primary" className="gap-1.5" onClick={() => setPanelTarget("new")}>
            <HiPlus size={16} /> Add Case Study
          </AdminButton>
        </motion.div>

        {/* Search & Filters */}
        <motion.div variants={item}>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <HiSearch size={16} className="text-muted group-focus-within:text-primary-light transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by title, client or service…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-muted/50 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)" }}
              />
            </div>
            <FilterDropdown
              label="Status"
              value={filterStatus}
              onChange={(val) => setFilterStatus(val as any)}
              options={[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Draft", value: "draft" },
                { label: "Archived", value: "archived" },
              ]}
            />
            <FilterDropdown
              label="Service"
              value={filterService}
              onChange={(val) => setFilterService(val)}
              options={[
                { label: "All", value: "all" },
                ...allServices.map((s) => ({ label: s.title, value: s.title })),
              ]}
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{caseStudies.length}</p>
            <p className="text-sm text-muted mt-1">Total</p>
          </DashboardGlassCard>
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{activeCount}</p>
            <p className="text-sm text-muted mt-1">Published</p>
          </DashboardGlassCard>
          <DashboardGlassCard className="col-span-2 sm:col-span-1 text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{caseStudies.length - activeCount}</p>
            <p className="text-sm text-muted mt-1">Drafts / Archived</p>
          </DashboardGlassCard>
        </motion.div>

        {/* List + Panel */}
        <motion.div variants={item} className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-24 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <DashboardGlassCard>
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                    <HiBookOpen size={24} className="text-purple-400" />
                  </div>
                  <p className="text-white font-medium mb-1">
                    {caseStudies.length === 0 ? "No case studies yet" : "No results found"}
                  </p>
                  <p className="text-sm text-muted">
                    {caseStudies.length === 0
                      ? "Click \"Add Case Study\" to create your first one."
                      : "Try a different search term or filter."}
                  </p>
                </div>
              </DashboardGlassCard>
            ) : (
              <div className="space-y-3">
                {filtered.map((cs) => {
                  const isSelected = (panelTarget as CaseStudy)?._id === cs._id;
                  return (
                    <div
                      key={cs._id}
                      onClick={() => setPanelTarget(isSelected ? (undefined as any) : cs)}
                      className={`rounded-xl border transition-all duration-200 cursor-pointer group ${
                        isSelected
                          ? "border-purple-500/40 bg-purple-500/[0.06] shadow-lg shadow-purple-500/10"
                          : "border-white/[0.08] hover:border-purple-500/20 hover:bg-white/[0.02]"
                      }`}
                      style={{ background: isSelected ? undefined : "rgba(19,19,26,0.6)", backdropFilter: "blur(12px)" }}
                    >
                      <div className="flex items-start gap-4 p-4 sm:p-5">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-purple-600" : "bg-purple-500/20 group-hover:bg-purple-500/30"
                        } transition-colors`}>
                          <HiBookOpen size={16} className="text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium text-sm">{cs.title}</p>
                                {cs.featured && (
                                  <HiStar size={13} className="text-amber-400 shrink-0" title="Featured" />
                                )}
                              </div>
                              <p className="text-xs text-muted">{cs.client}{cs.service ? ` · ${cs.service}` : ""}</p>
                            </div>
                            <StatusBadge status={cs.status} />
                          </div>

                          {cs.subtitle && (
                            <p className="text-xs text-muted/80 mt-1.5 line-clamp-1">{cs.subtitle}</p>
                          )}

                          {/* Metrics preview */}
                          {cs.results.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {cs.results.slice(0, 3).map((r, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/20">
                                  {r.metric} {r.label}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              {cs.portfolioProject && (
                                <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20">
                                  ↗ {cs.portfolioProject.title}
                                </span>
                              )}
                              <span className="text-[10px] text-muted/60">{formatDate(cs.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleSetFeatured(cs._id)}
                                className={`p-1.5 rounded-lg transition ${cs.featured ? "text-amber-400 bg-amber-500/10" : "text-muted hover:text-amber-400 hover:bg-amber-500/5"}`}
                                title={cs.featured ? "Featured" : "Set as featured"}
                              >
                                <HiStar size={13} />
                              </button>
                              <button
                                onClick={() => setPanelTarget(isSelected ? (undefined as any) : cs)}
                                className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                                title="Edit"
                              >
                                <HiPencil size={13} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ id: cs._id, label: cs.title })}
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
                key={panelTarget === "new" ? "new" : (panelTarget as CaseStudy)?._id}
                editing={editingItem}
                onClose={() => setPanelTarget(undefined as any)}
                onSaved={fetchCaseStudies}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Case Study?"
        itemLabel={deleteTarget?.label}
        description="This will permanently remove this case study. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
