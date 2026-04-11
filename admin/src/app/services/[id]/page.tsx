"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiArrowLeft, HiPlus, HiTrash, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  AdminButton,
} from "@/components/admin/ui";
import type { ServiceCategory } from "@/types/services";
import { ICON_MAP } from "@/types/services";

const PORTFOLIO_API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/portfolio";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/services";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const EMPTY_FORM = {
  slug: "",
  title: "",
  tagline: "",
  pricing: "",
  icon: "HiCode",
  techStack: [] as string[],
  items: [] as { title: string; desc: string }[],
  caseStudy: null as { title: string; href: string } | null,
  status: "active",
  order: 0,
};

export default function ServiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  const isNew = serviceId === "new";

  /* ── State ── */
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [techStackInput, setTechStackInput] = useState("");
  const [hasCaseStudy, setHasCaseStudy] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [removeConfirm, setRemoveConfirm] = useState<number | null>(null);
  const [portfolioProjects, setPortfolioProjects] = useState<{ _id: string; title: string; slug: string }[]>([]);

  /* ── Fetch existing service ── */
  const fetchService = useCallback(async () => {
    if (isNew) return;
    try {
      const res = await fetch(`${API}?all=true`);
      const data: ServiceCategory[] = await res.json();
      const found = data.find((s) => s._id === serviceId);
      if (found) {
        setForm({
          slug: found.slug,
          title: found.title,
          tagline: found.tagline,
          pricing: found.pricing,
          icon: found.icon || "HiCode",
          techStack: found.techStack,
          items: found.items,
          caseStudy: found.caseStudy,
          status: found.status,
          order: found.order,
        });
        setTechStackInput(found.techStack.join(", "));
        setHasCaseStudy(!!found.caseStudy);
      } else {
        setError("Service not found");
      }
    } catch (err) {
      console.error("Failed to load service:", err);
      setError("Failed to load service data");
    } finally {
      setLoading(false);
    }
  }, [serviceId, isNew]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // Fetch portfolio projects that have case studies
  useEffect(() => {
    fetch(`${PORTFOLIO_API}?all=true`)
      .then((r) => r.json())
      .then((data: any[]) => {
        const withCS = data.filter((p) => p.caseStudy !== null && p.caseStudy !== undefined);
        setPortfolioProjects(withCS.map((p) => ({ _id: p._id, title: p.title, slug: p.slug })));
      })
      .catch(() => {});
  }, []);

  /* ── Auto-slug ── */
  useEffect(() => {
    if (isNew) {
      setForm((f) => ({
        ...f,
        slug: f.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [form.title, isNew]);

  /* ── Helpers ── */
  const setField = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { title: "", desc: "" }] }));

  const removeItem = (i: number) => {
    setRemoveConfirm(null);
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  };

  const setItemField = (i: number, key: "title" | "desc", val: string) =>
    setForm((f) => {
      const items = [...f.items];
      items[i] = { ...items[i], [key]: val };
      return { ...f, items };
    });

  /* ── Submit ── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      techStack: techStackInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      caseStudy:
        hasCaseStudy && form.caseStudy?.title ? form.caseStudy : null,
    };

    try {
      const url = isNew ? API : `${API}/${serviceId}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save");
      }

      setSuccess(isNew ? "Service created successfully!" : "Service updated successfully!");
      setTimeout(() => router.push("/services"), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="h-[600px] rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header with back button */}
      <motion.div variants={item} className="flex items-center gap-4">
        <button
          onClick={() => router.push("/services")}
          className="p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition"
        >
          <HiArrowLeft size={20} />
        </button>
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {isNew ? "Add New Service" : "Edit Service"}
          </h1>
          <p className="text-muted text-sm mt-0.5">
            {isNew
              ? "Create a new service category for your platform"
              : `Editing: ${form.title}`}
          </p>
        </div>
      </motion.div>

      {/* Success / Error banners */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <HiCheckCircle size={20} className="text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-300">{success}</p>
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <HiExclamationCircle size={20} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left column — main fields */}
          <motion.div variants={item} className="xl:col-span-2 space-y-6">
            {/* Basic Info */}
            <DashboardGlassCard>
              <DashboardSectionHeader title="Basic Information" subtitle="Core details about this service" />

              <div className="space-y-4 mt-4">
                {/* Title + Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-medium">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setField("title", e.target.value)}
                      placeholder="Web Development"
                      className="admin-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5 font-medium">
                      Slug <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      value={form.slug}
                      onChange={(e) => setField("slug", e.target.value)}
                      placeholder="web-development"
                      className="admin-input w-full"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-medium">
                    Tagline <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    value={form.tagline}
                    onChange={(e) => setField("tagline", e.target.value)}
                    placeholder="Custom-built digital experiences"
                    className="admin-input w-full"
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-medium">
                    Tech Stack <span className="text-muted/60">(comma-separated)</span>
                  </label>
                  <input
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="React, Next.js, TypeScript, Node.js"
                    className="admin-input w-full"
                  />
                  {techStackInput && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {techStackInput
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 text-xs rounded-full bg-primary/10 border border-primary/20 text-primary-light"
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </DashboardGlassCard>

            {/* Sub-services (Accordion Items) */}
            <DashboardGlassCard>
              <DashboardSectionHeader
                title="Sub-services"
                subtitle="Individual services within this category"
                action={
                  <AdminButton variant="outline" size="sm" className="text-xs gap-1" onClick={addItem}>
                    <HiPlus size={14} /> Add Item
                  </AdminButton>
                }
              />

              {form.items.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted text-sm">No sub-services added yet.</p>
                  <button
                    type="button"
                    onClick={addItem}
                    className="mt-2 text-xs text-primary-light hover:text-white transition"
                  >
                    + Add your first sub-service
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  {form.items.map((it, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-4 space-y-3 group"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: removeConfirm === i
                          ? "1px solid rgba(239,68,68,0.25)"
                          : "1px solid rgba(255,255,255,0.06)",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted/50 font-mono w-6 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <input
                          value={it.title}
                          onChange={(e) => setItemField(i, "title", e.target.value)}
                          placeholder="Item title"
                          className="admin-input flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => setRemoveConfirm(removeConfirm === i ? null : i)}
                          className={`p-2 transition rounded-lg opacity-0 group-hover:opacity-100 ${
                            removeConfirm === i
                              ? "text-red-400 bg-red-500/10"
                              : "text-muted hover:text-red-400 hover:bg-red-500/5"
                          }`}
                        >
                          <HiTrash size={14} />
                        </button>
                      </div>

                      {/* Inline casual remove confirmation */}
                      {removeConfirm === i && (
                        <div className="ml-9 flex items-center gap-3 py-1.5 px-3 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                          <span className="text-xs text-red-300/80 flex-1">Remove this sub-service?</span>
                          <button
                            type="button"
                            onClick={() => removeItem(i)}
                            className="text-xs font-medium text-red-400 hover:text-red-300 transition px-2 py-0.5 rounded hover:bg-red-500/10"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => setRemoveConfirm(null)}
                            className="text-xs text-gray-500 hover:text-gray-300 transition px-2 py-0.5 rounded hover:bg-white/5"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      <div className="ml-9">
                        <textarea
                          value={it.desc}
                          onChange={(e) => setItemField(i, "desc", e.target.value)}
                          placeholder="Item description"
                          rows={2}
                          className="admin-input w-full resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardGlassCard>

            {/* Case Study */}
            <DashboardGlassCard>
              <DashboardSectionHeader title="Case Study" subtitle="Link to a portfolio case study" />
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    id="has-case-study"
                    type="checkbox"
                    checked={hasCaseStudy}
                    onChange={(e) => {
                      setHasCaseStudy(e.target.checked);
                      if (!e.target.checked) setField("caseStudy", null);
                    }}
                    className="w-4 h-4 accent-purple-500"
                  />
                  <label htmlFor="has-case-study" className="text-sm text-muted cursor-pointer">
                    Link a case study
                  </label>
                </div>

                {hasCaseStudy && (
                  <div className="space-y-3">
                    {portfolioProjects.length > 0 ? (
                      <div>
                        <label className="block text-xs text-muted mb-1.5 font-medium">
                          Pick a Portfolio Project
                        </label>
                        <select
                          className="admin-input w-full"
                          value={form.caseStudy?.href?.replace("/portfolio/", "") ?? ""}
                          onChange={(e) => {
                            const slug = e.target.value;
                            if (!slug) { setField("caseStudy", null); return; }
                            const proj = portfolioProjects.find((p) => p.slug === slug);
                            if (proj) {
                              setField("caseStudy", { title: proj.title, href: `/portfolio/${proj.slug}` });
                            }
                          }}
                        >
                          <option value="">— Select a project —</option>
                          {portfolioProjects.map((p) => (
                            <option key={p._id} value={p.slug}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-400/80 px-3 py-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/10">
                        No portfolio projects with case studies found. Enable a case study on a project first.
                      </p>
                    )}

                    {/* Manual override */}
                    <details className="group">
                      <summary className="text-xs text-muted/60 cursor-pointer hover:text-muted transition select-none">
                        Or enter manually
                      </summary>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-xs text-muted mb-1.5 font-medium">Title</label>
                          <input
                            value={form.caseStudy?.title ?? ""}
                            onChange={(e) => setField("caseStudy", { ...form.caseStudy, title: e.target.value })}
                            placeholder="Project name"
                            className="admin-input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted mb-1.5 font-medium">Link URL</label>
                          <input
                            value={form.caseStudy?.href ?? ""}
                            onChange={(e) => setField("caseStudy", { ...form.caseStudy, href: e.target.value })}
                            placeholder="/portfolio/my-project"
                            className="admin-input w-full"
                          />
                        </div>
                      </div>
                    </details>

                    {/* Preview */}
                    {form.caseStudy?.title && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/[0.07] border border-purple-500/15">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                        <span className="text-xs text-purple-300 font-medium">{form.caseStudy.title}</span>
                        {form.caseStudy.href && (
                          <a
                            href={form.caseStudy.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-xs text-purple-400/60 hover:text-purple-300 transition"
                          >
                            Preview ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DashboardGlassCard>
          </motion.div>

          {/* Right column — sidebar settings */}
          <motion.div variants={item} className="space-y-6">
            {/* Status / Pricing / Order */}
            <DashboardGlassCard>
              <DashboardSectionHeader title="Settings" subtitle="Pricing, status & display order" />
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-medium">
                    Starting Price <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    value={form.pricing}
                    onChange={(e) => setField("pricing", e.target.value)}
                    placeholder="$3,000"
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-medium">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setField("order", Number(e.target.value))}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5 font-medium">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setField("status", e.target.value)}
                    className="admin-input w-full"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </DashboardGlassCard>

            {/* Icon Picker */}
            <DashboardGlassCard>
              <DashboardSectionHeader title="Icon" subtitle="Choose an icon for this service" />
              <div className="grid grid-cols-6 gap-1.5 mt-4">
                {Object.keys(ICON_MAP).map((name) => {
                  const Ic = ICON_MAP[name];
                  const selected = form.icon === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => setField("icon", name)}
                      className="p-2.5 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: selected
                          ? "rgba(139,92,246,0.25)"
                          : "rgba(255,255,255,0.03)",
                        border: selected
                          ? "1px solid rgba(139,92,246,0.7)"
                          : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Ic
                        className={`w-4 h-4 ${selected ? "text-purple-400" : "text-muted"}`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted mt-2 opacity-60">
                Selected: {form.icon ?? "HiCode"}
              </p>
            </DashboardGlassCard>

            {/* Actions */}
            <DashboardGlassCard>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                    boxShadow: "0 4px 24px rgba(139, 92, 246, 0.25)",
                  }}
                >
                  {saving
                    ? "Saving…"
                    : isNew
                      ? "Create Service"
                      : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/services")}
                  className="w-full py-2.5 text-sm text-muted hover:text-white rounded-xl hover:bg-white/5 transition text-center"
                >
                  Cancel
                </button>
              </div>
            </DashboardGlassCard>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
