"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowLeft, HiPlus, HiTrash, HiCheckCircle, HiExclamationCircle, HiStar, HiLink, HiShieldCheck, HiSparkles, HiChevronDown } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  AdminButton,
} from "@/components/admin/ui";
import type { ServiceCategory } from "@/types/services";
import { ICON_MAP } from "@/types/services";
import type { Testimonial } from "@/types/testimonials";
import type { PortfolioProject } from "@/types/portfolio";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_FORM = {
  slug: "",
  title: "",
  tagline: "",
  pricing: "",
  description: "", // SEO Meta Description
  keywords: "",
  ogImage: "",
  canonical: "",
  robots: "index, follow",
  focusKeyword: "",
  techStack: [] as string[],
  items: [] as { title: string; desc: string }[],
  caseStudy: null as { title: string; href: string } | null,
  status: "active",
  pageType: "auto" as "original" | "auto",
  order: 0,
  featuredProjects: [] as string[],
  testimonials: [] as string[],
};

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

export default function ServiceEditPage() {
  const { id } = useParams();
  const isNew = id === "new";
  const router = useRouter();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [removeConfirm, setRemoveConfirm] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "seo">("general");

  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);

  // Collapsible state (stores indices of COLLAPSED items)
  const [collapsedItems, setCollapsedItems] = useState<number[]>([]);

  // Toggle functions
  const toggleItemCollapse = (i: number) => {
    setCollapsedItems(prev => 
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const fetchService = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/services/${id}`);
      if (!res.ok) throw new Error("Service not found");
      const found = await res.json();
      setForm({
        slug: found.slug,
        title: found.title,
        tagline: found.tagline,
        pricing: found.pricing,
        description: found.description || "",
        keywords: found.keywords || "",
        ogImage: found.ogImage || "",
        canonical: found.canonical || "",
        robots: found.robots || "index, follow",
        focusKeyword: found.focusKeyword || "",
        techStack: found.techStack,
        items: found.items,
        caseStudy: found.caseStudy,
        status: found.status,
        pageType: found.pageType || "auto",
        order: found.order,
        featuredProjects: found.featuredProjects || [],
        testimonials: found.testimonials || [],
      });
    } catch (err) {
      setError("Failed to load service data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNew) fetchService();
    fetch(`${API}/api/portfolio`).then(r => r.json()).then(setPortfolioProjects);
    fetch(`${API}/api/testimonials`).then(r => r.json()).then(setAllTestimonials);
  }, [id, isNew, fetchService]);

  const addSubService = () => {
    setForm((f) => ({ ...f, items: [...f.items, { title: "", desc: "" }] }));
  };

  const removeSubService = (i: number) => {
    setRemoveConfirm(null);
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
    setCollapsedItems(prev => prev.filter(idx => idx !== i).map(idx => idx > i ? idx - 1 : idx));
  };

  const setSubServiceField = (i: number, key: "title" | "desc", val: string) =>
    setForm((f) => {
      const items = [...f.items];
      items[i] = { ...items[i], [key]: val };
      return { ...f, items };
    });

  const toggleFeaturedProject = (id: string) => {
    setForm(f => {
      const current = f.featuredProjects || [];
      const updated = current.includes(id) 
        ? current.filter(x => x !== id) 
        : [...current, id];
      return { ...f, featuredProjects: updated };
    });
  };

  const toggleTestimonial = (id: string) => {
    setForm(f => {
      const current = f.testimonials || [];
      const updated = current.includes(id) 
        ? current.filter(x => x !== id) 
        : [...current, id];
      return { ...f, testimonials: updated };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = isNew
        ? `${API}/api/services`
        : `${API}/api/services/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save service");
      }

      setSuccess(`Service ${isNew ? "created" : "updated"} successfully!`);
      if (isNew) {
        const created = await res.json();
        router.push(`/services/${created._id}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-20">
      <motion.div variants={item} className="flex items-center gap-4">
        <button
          onClick={() => router.push("/services")}
          type="button"
          className="p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition"
        >
          <HiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-heading">
            {isNew ? "Create Service" : `Edit: ${form.title}`}
          </h1>
          <p className="text-sm text-muted">Manage service details and physical Next.js pages</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={item} className="space-y-6">
            <DashboardGlassCard>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
                <DashboardSectionHeader title="Service Configuration" subtitle="Manage details and SEO settings" />
                <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab("general")}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition ${activeTab === 'general' ? 'bg-primary/20 text-primary-light shadow-sm' : 'text-muted hover:text-white'}`}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("seo")}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition ${activeTab === 'seo' ? 'bg-primary/20 text-primary-light shadow-sm' : 'text-muted hover:text-white'}`}
                  >
                    Technical SEO
                  </button>
                </div>
              </div>

              {activeTab === "general" ? (
                <>
                  <div className="mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted/50 uppercase tracking-widest">Page Management Type</label>
                      <div className="flex items-center gap-4 mt-2">
                        <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${form.pageType === 'original' ? 'bg-primary/10 border-primary/40 text-white' : 'bg-transparent border-white/5 text-muted hover:bg-white/5'}`}>
                          <input 
                            type="radio" 
                            className="hidden" 
                            name="pageType" 
                            value="original" 
                            checked={form.pageType === 'original'} 
                            onChange={() => setForm({...form, pageType: 'original'})} 
                          />
                          <HiShieldCheck className={form.pageType === 'original' ? 'text-primary' : 'text-muted/30'} size={20} />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">Original</span>
                            <span className="text-[10px] opacity-60">Manual code</span>
                          </div>
                        </label>
                        <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${form.pageType === 'auto' ? 'bg-primary/10 border-primary/40 text-white' : 'bg-transparent border-white/5 text-muted hover:bg-white/5'}`}>
                          <input 
                            type="radio" 
                            className="hidden" 
                            name="pageType" 
                            value="auto" 
                            checked={form.pageType === 'auto'} 
                            onChange={() => setForm({...form, pageType: 'auto'})} 
                          />
                          <HiSparkles className={form.pageType === 'auto' ? 'text-primary' : 'text-muted/30'} size={20} />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">Auto</span>
                            <span className="text-[10px] opacity-60">Generated</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Service Title</label>
                      <input
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Web Development"
                        className="admin-input w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">URL Slug (Next.js Folder)</label>
                      <input
                        required
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="web-development"
                        className="admin-input w-full font-mono"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Marketing Tagline</label>
                      <input
                        required
                        value={form.tagline}
                        onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                        placeholder="We build high-performance digital experiences..."
                        className="admin-input w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Pricing / Starting At</label>
                      <input
                        required
                        value={form.pricing}
                        onChange={(e) => setForm({ ...form, pricing: e.target.value })}
                        placeholder="Starts from ₹25,000"
                        className="admin-input w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                        className="admin-input w-full"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Icon Picker & Tech Stack */}
                  <div className="space-y-6 mt-8 pt-6 border-t border-white/5">
                    <div>
                      <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider block mb-4">Service Icon</label>
                      <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-12 gap-2">
                        {Object.keys(ICON_MAP).map((name) => {
                          const Ic = ICON_MAP[name];
                          const selected = (form as any).icon === name;
                          return (
                            <button
                              key={name}
                              type="button"
                              title={name}
                              onClick={() => setForm({ ...form, icon: name } as any)}
                              className={`p-3 rounded-xl flex items-center justify-center transition-all border ${
                                selected 
                                  ? "bg-primary/20 border-primary/50 text-primary-light shadow-lg shadow-primary/10" 
                                  : "bg-white/[0.02] border-white/5 text-muted hover:border-white/10 hover:bg-white/[0.04]"
                              }`}
                            >
                              <Ic size={20} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Tech Stack (comma-separated)</label>
                      <input
                        value={form.techStack.join(", ")}
                        onChange={(e) => setForm({ ...form, techStack: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                        placeholder="React, Next.js, TypeScript, Node.js"
                        className="admin-input w-full"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.techStack.map((t, i) => (
                          <span key={i} className="px-2 py-1 text-[10px] font-medium bg-primary/10 text-primary-light rounded-md border border-primary/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Focus Keyword</label>
                      <input
                        value={form.focusKeyword}
                        onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })}
                        placeholder="e.g. web design agency pune"
                        className="admin-input w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Meta Robots</label>
                      <select
                        value={form.robots}
                        onChange={(e) => setForm({ ...form, robots: e.target.value })}
                        className="admin-input w-full"
                      >
                        <option value="index, follow">Index, Follow</option>
                        <option value="noindex, nofollow">Noindex, Nofollow</option>
                        <option value="index, nofollow">Index, Nofollow</option>
                        <option value="noindex, follow">Noindex, Follow</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Meta Description (Overwrites Tagline in Search)</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="An optimized description for search engines..."
                      rows={3}
                      className="admin-input w-full resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Meta Keywords (comma-separated)</label>
                    <textarea
                      value={form.keywords}
                      onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                      placeholder="pune agency, fullstack, stackx"
                      rows={2}
                      className="admin-input w-full resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">OG Image URL (Social Share Image)</label>
                    <input
                      value={form.ogImage}
                      onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                      placeholder="https://example.com/social-preview.jpg"
                      className="admin-input w-full font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted/80 uppercase tracking-wider">Canonical URL Override</label>
                    <input
                      value={form.canonical}
                      onChange={(e) => setForm({ ...form, canonical: e.target.value })}
                      placeholder="https://stackx.co.in/services/master-page"
                      className="admin-input w-full text-sm"
                    />
                  </div>
                </div>
              )}
            </DashboardGlassCard>

            <DashboardGlassCard>
              <DashboardSectionHeader
                title="Sub-services"
                subtitle="The detailed offerings shown in the accordion section"
                action={
                  <AdminButton variant="outline" size="sm" type="button" className="text-xs gap-1" onClick={addSubService}>
                    <HiPlus size={14} /> Add Item
                  </AdminButton>
                }
              />
              <div className="space-y-4 mt-4">
                {form.items.map((sub, i) => {
                  const isCollapsed = collapsedItems.includes(i);
                  return (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: removeConfirm === i
                          ? "1px solid rgba(239,68,68,0.25)"
                          : "1px solid rgba(255,255,255,0.06)",
                        transition: "border-color 0.2s",
                      }}
                    >
                      {/* Card Header */}
                      <div 
                        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/[0.02] transition"
                        onClick={() => toggleItemCollapse(i)}
                      >
                        <HiChevronDown 
                          size={18} 
                          className={`text-muted transition-transform duration-300 ${isCollapsed ? "-rotate-90" : ""}`} 
                        />
                        <div className="flex-1 min-w-0">
                          {isCollapsed ? (
                            <span className="text-sm font-semibold text-white truncate">
                              {sub.title || "Untitled Sub-service"}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-muted/80 uppercase tracking-wider">
                              Sub-service #{i + 1}
                            </span>
                          )}
                        </div>
                        
                        <div onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setRemoveConfirm(removeConfirm === i ? null : i)}
                            className={`p-2 transition rounded-xl ${
                              removeConfirm === i
                                ? "text-red-400 bg-red-500/10"
                                : "text-muted hover:text-red-400 hover:bg-red-500/5"
                            }`}
                          >
                            <HiTrash size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Card Content */}
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                          >
                            <div className="p-4 pt-0 space-y-4 border-t border-white/[0.03]">
                              <div className="space-y-4 mt-4">
                                <input
                                  required
                                  value={sub.title}
                                  onChange={(e) => setSubServiceField(i, "title", e.target.value)}
                                  placeholder="Item Title (e.g. Next.js Architecture)"
                                  className="admin-input w-full text-sm font-semibold"
                                />
                                <textarea
                                  required
                                  value={sub.desc}
                                  onChange={(e) => setSubServiceField(i, "desc", e.target.value)}
                                  placeholder="Detailed description..."
                                  rows={2}
                                  className="admin-input w-full text-xs text-muted resize-none"
                                />
                              </div>

                              {removeConfirm === i && (
                                <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-red-500/[0.06] border border-red-500/10 mt-2">
                                  <span className="text-xs text-red-300/80 flex-1 italic">Remove this sub-service?</span>
                                  <button
                                    type="button"
                                    onClick={() => removeSubService(i)}
                                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition px-2 py-0.5"
                                  >
                                    Remove
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setRemoveConfirm(null)}
                                    className="text-xs text-gray-500 hover:text-gray-300 transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </DashboardGlassCard>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={item} className="sticky top-6 space-y-6">
            <DashboardGlassCard className="p-4">
              <div className="flex flex-col gap-3">
                <AdminButton type="submit" disabled={saving} className="w-full justify-center gap-2 h-12 text-base">
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <HiCheckCircle size={20} />
                  )}
                  {isNew ? "Create Service" : "Save / Sync Changes"}
                </AdminButton>
                <AdminButton
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/services")}
                  className="w-full justify-center"
                >
                  Cancel Changes
                </AdminButton>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2">
                  <HiExclamationCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex gap-2">
                  <HiCheckCircle size={16} className="shrink-0" />
                  {success}
                </div>
              )}
            </DashboardGlassCard>

            <DashboardGlassCard>
              <DashboardSectionHeader title="Featured Projects" subtitle="Select related case studies" />
              <div className="space-y-2 mt-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                {portfolioProjects.map((proj) => (
                  <button
                    key={proj._id}
                    type="button"
                    onClick={() => toggleFeaturedProject(proj._id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-center justify-between group ${
                      form.featuredProjects.includes(proj._id)
                        ? "bg-primary/20 text-primary-light border border-primary/30"
                        : "bg-white/5 text-muted hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <span className="truncate pr-2">{proj.title}</span>
                    {form.featuredProjects.includes(proj._id) && <HiStar className="shrink-0" />}
                  </button>
                ))}
              </div>
            </DashboardGlassCard>

            <DashboardGlassCard>
              <DashboardSectionHeader title="Testimonials" subtitle="Link customer reviews" />
              <div className="space-y-2 mt-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                {allTestimonials.map((t) => (
                  <button
                    key={t._id}
                    type="button"
                    onClick={() => toggleTestimonial(t._id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-center justify-between group ${
                      form.testimonials.includes(t._id)
                        ? "bg-primary/20 text-primary-light border border-primary/30"
                        : "bg-white/5 text-muted hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <span className="truncate pr-2">{t.name} ({t.company})</span>
                    {form.testimonials.includes(t._id) && <HiStar className="shrink-0" />}
                  </button>
                ))}
              </div>
            </DashboardGlassCard>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
