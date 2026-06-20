"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiPlus, HiPencil, HiTrash, HiSearch, HiBookOpen, HiStar, HiPhotograph,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  StatusBadge,
  AdminButton,
  FilterDropdown,
} from "@/components/admin/ui";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { CaseStudy } from "@/types/caseStudies";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function CaseStudiesAdminPage() {
  const router = useRouter();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft" | "archived">("all");
  const [filterService, setFilterService] = useState("all");
  const [allServices, setAllServices] = useState<{ _id: string; title: string }[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

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
          <AdminButton variant="primary" className="gap-1.5" onClick={() => router.push("/case-studies/new")}>
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

        {/* List */}
        <motion.div variants={item}>
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
                const isPortfolio = cs.source === "portfolio";
                const editUrl = isPortfolio
                  ? `/portfolio/case-study/${cs.portfolioProjectId}`
                  : `/case-studies/${cs._id}`;

                return (
                <div
                  key={cs._id}
                  onClick={() => router.push(editUrl)}
                  className="rounded-xl border transition-all duration-200 cursor-pointer group border-white/[0.08] hover:border-purple-500/20 hover:bg-white/[0.02]"
                  style={{ background: "rgba(19,19,26,0.6)", backdropFilter: "blur(12px)" }}
                >
                  <div className="flex items-start gap-4 p-4 sm:p-5">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isPortfolio
                        ? "bg-emerald-500/20 group-hover:bg-emerald-500/30"
                        : "bg-purple-500/20 group-hover:bg-purple-500/30"
                    }`}>
                      {isPortfolio
                        ? <HiPhotograph size={16} className="text-white" />
                        : <HiBookOpen size={16} className="text-white" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm">{cs.title}</p>
                            {cs.featured && (
                              <HiStar size={13} className="text-amber-400 shrink-0" title="Featured" />
                            )}
                            {isPortfolio && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 font-medium">
                                From Portfolio
                              </span>
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
                          {!isPortfolio && (
                            <button
                              onClick={() => handleSetFeatured(cs._id)}
                              className={`p-1.5 rounded-lg transition ${cs.featured ? "text-amber-400 bg-amber-500/10" : "text-muted hover:text-amber-400 hover:bg-amber-500/5"}`}
                              title={cs.featured ? "Featured" : "Set as featured"}
                            >
                              <HiStar size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => router.push(editUrl)}
                            className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                            title="Edit"
                          >
                            <HiPencil size={13} />
                          </button>
                          {!isPortfolio && (
                            <button
                              onClick={() => setDeleteTarget({ id: cs._id, label: cs.title })}
                              className="p-1.5 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/5"
                              title="Delete"
                            >
                              <HiTrash size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
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
