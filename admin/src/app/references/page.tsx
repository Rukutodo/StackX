"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiPlus, HiPencil, HiTrash,
  HiLink, HiCollection,
  HiSearch,
  HiLocationMarker,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  StatusBadge,
  AdminButton,
  FilterDropdown,
} from "@/components/admin/ui";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { Reference } from "@/types/reference";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ReferenceAdminPage() {
  const router = useRouter();
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft">("all");
  const [filterService, setFilterService] = useState("all");
  const [allServices, setAllServices] = useState<{ _id: string; title: string }[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    fetchReferences();
    fetch(`${API}/api/services`)
      .then((r) => r.json())
      .then((d) => setAllServices(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [fetchReferences]);

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
      fetchReferences();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = references.filter((r) => r.status === "active").length;
  const citiesCount = new Set(references.map((r) => r.city).filter(Boolean)).size;

  const filteredReferences = references.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q) || (r.city || "").toLowerCase().includes(q);
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const serviceTitle = typeof r.service === "string" ? r.service : (r.service as any)?.title ?? "";
    const matchesService = filterService === "all" || serviceTitle === filterService;
    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Reference Pages
            </h1>
            <p className="text-muted text-sm mt-1">Location-based SEO pages with rich content & schema</p>
          </div>
          <AdminButton variant="primary" className="gap-1.5" onClick={() => router.push("/references/new")}>
            <HiPlus size={16} /> Add Reference
          </AdminButton>
        </motion.div>

        {/* Search & Filters */}
        <motion.div variants={item}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <HiSearch size={16} className="text-muted group-focus-within:text-primary-light transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by title, slug, or city…"
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
        <motion.div variants={item} className="grid grid-cols-3 gap-3 sm:gap-4">
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{references.length}</p>
            <p className="text-sm text-muted mt-1">Total Pages</p>
          </DashboardGlassCard>
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{activeCount}</p>
            <p className="text-sm text-muted mt-1">Active</p>
          </DashboardGlassCard>
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{citiesCount}</p>
            <p className="text-sm text-muted mt-1">Cities</p>
          </DashboardGlassCard>
        </motion.div>

        {/* Content area */}
        <motion.div variants={item}>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
              ))}
            </div>
          ) : filteredReferences.length === 0 ? (
            <DashboardGlassCard>
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <HiCollection size={24} className="text-primary-light" />
                </div>
                <p className="text-white font-medium mb-1">No reference pages yet</p>
                <p className="text-sm text-muted">Create a reference to map a location-specific URL to a service.</p>
                <AdminButton variant="primary" className="mt-6 gap-1.5 mx-auto" onClick={() => router.push("/references/new")}>
                  <HiPlus size={16} /> Add First Reference
                </AdminButton>
              </div>
            </DashboardGlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReferences.map((r) => {
                const service = typeof r.service === "string" ? { title: "Unknown", slug: "..." } : r.service;

                return (
                  <div
                    key={r._id}
                    onClick={() => router.push(`/references/${r._id}`)}
                    className="rounded-xl border border-white/[0.08] hover:border-primary/30 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer group shadow-lg"
                    style={{ background: "rgba(19,19,26,0.6)", backdropFilter: "blur(12px)" }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate group-hover:text-primary-light transition-colors">{r.title}</p>
                          <p className="text-xs font-mono text-muted/60 mt-1 truncate">/services/{r.slug}</p>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {r.city && (
                          <span className="text-xs px-2.5 py-1 bg-accent/10 text-accent rounded-lg border border-accent/15 flex items-center gap-1.5">
                            <HiLocationMarker size={12} /> {r.city}
                          </span>
                        )}
                        <span className="text-xs px-2.5 py-1 bg-white/5 text-muted rounded-lg border border-white/10 flex items-center gap-1.5">
                          <HiLink size={12} /> {service.title}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          {r.faqs && r.faqs.length > 0 && (
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/15">
                              {r.faqs.length} FAQs
                            </span>
                          )}
                          {r.noIndex && (
                            <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/15">
                              noindex
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/references/${r._id}`);
                            }}
                            className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/10 rounded-lg transition"
                          >
                            <HiPencil size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget({ id: r._id, label: r.title });
                            }}
                            className="p-1.5 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/10"
                          >
                            <HiTrash size={14} />
                          </button>
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
        title="Delete Reference Page?"
        itemLabel={deleteTarget?.label}
        description="This will permanently remove this reference page and its SEO data. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
