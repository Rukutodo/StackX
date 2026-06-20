"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  HiSearch, HiSave, HiCheck, HiX, HiCode,
  HiGlobeAlt, HiEye, HiShieldCheck, HiDocumentText,
  HiPhotograph, HiExclamation, HiCheckCircle, HiMinusCircle,
  HiExternalLink, HiClipboardCopy, HiRefresh,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  AdminButton,
  AdminSelect,
} from "@/components/admin/ui";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

/* ── Page options ──────────────────────────────────── */
const PAGE_OPTIONS = [
  { label: "Homepage", value: "home" },
  { label: "About Us", value: "about" },
  { label: "Services", value: "services" },
  { label: "Portfolio", value: "portfolio" },
  { label: "Careers", value: "careers" },
  { label: "Testimonials", value: "testimonials" },
  { label: "Contact Us", value: "contact" },
  { label: "Blog", value: "blog" },
  { label: "Case Studies", value: "case-studies" },
  { label: "Privacy Policy", value: "privacy-policy" },
  { label: "Terms of Service", value: "terms-of-service" },
];

const TABS = [
  { id: "meta", label: "Page Meta", icon: HiDocumentText },
  { id: "social", label: "Social Preview", icon: HiEye },
  { id: "jsonld", label: "JSON-LD", icon: HiCode },
  { id: "audit", label: "SEO Audit", icon: HiShieldCheck },
];

const ROBOTS_PRESETS = [
  { label: "Index, Follow (recommended)", value: "index, follow" },
  { label: "Index, Follow + Rich Snippets", value: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
  { label: "No Index, Follow", value: "noindex, follow" },
  { label: "No Index, No Follow", value: "noindex, nofollow" },
  { label: "Custom", value: "__custom__" },
];

/* ── Types ─────────────────────────────────────────── */
interface SeoData {
  pageKey: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  robots: string;
  canonical: string;
  jsonLdOverrides: Record<string, unknown>;
  _source?: string;
}

const EMPTY_SEO: SeoData = {
  pageKey: "home", title: "", description: "", keywords: [],
  ogTitle: "", ogDescription: "", ogImage: "", twitterTitle: "",
  twitterDescription: "", robots: "index, follow", canonical: "/",
  jsonLdOverrides: {},
};

/* ── Character count indicator ────────────────────── */
function CharCount({ current, min, max }: { current: number; min: number; max: number }) {
  const color = current === 0 ? "text-muted/40" : current < min ? "text-amber-400" : current <= max ? "text-emerald-400" : "text-red-400";
  return (
    <span className={`text-[10px] font-mono ${color}`}>
      {current}/{max}
      {current > 0 && current < min && " (too short)"}
      {current > max && " (too long)"}
      {current >= min && current <= max && " ✓"}
    </span>
  );
}

/* ── Keyword chip input ───────────────────────────── */
function KeywordInput({ keywords, onChange }: { keywords: string[]; onChange: (kw: string[]) => void }) {
  const [input, setInput] = useState("");

  const addKeyword = () => {
    const trimmed = input.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed]);
    }
    setInput("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
        {keywords.map((kw, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-primary/10 text-primary-light border border-primary/20"
          >
            {kw}
            <button
              type="button"
              onClick={() => onChange(keywords.filter((_, j) => j !== i))}
              className="hover:text-red-400 transition-colors ml-0.5"
            >
              <HiX size={10} />
            </button>
          </span>
        ))}
        {keywords.length === 0 && (
          <span className="text-xs text-muted/40 self-center">No keywords added</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
          placeholder="Type a keyword and press Enter"
          className="admin-input flex-1"
        />
        <AdminButton variant="secondary" size="sm" onClick={addKeyword}>Add</AdminButton>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export default function SeoAdminPage() {
  const [activeTab, setActiveTab] = useState("meta");
  const [selectedPage, setSelectedPage] = useState("home");
  const [form, setForm] = useState<SeoData>({ ...EMPTY_SEO });
  const [allPages, setAllPages] = useState<SeoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [jsonText, setJsonText] = useState("{}");
  const [jsonValid, setJsonValid] = useState(true);
  const [customRobots, setCustomRobots] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("stackx_token") || "" : "";

  /* ── Fetch all pages for audit ── */
  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/seo`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAllPages(data);
      }
    } catch { /* silent */ }
  }, [token]);

  /* ── Fetch single page ── */
  const fetchPage = useCallback(async (pageKey: string) => {
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`${API}/api/seo/${pageKey}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setForm({
          pageKey: data.pageKey || pageKey,
          title: data.title || "",
          description: data.description || "",
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          ogTitle: data.ogTitle || "",
          ogDescription: data.ogDescription || "",
          ogImage: data.ogImage || "",
          twitterTitle: data.twitterTitle || "",
          twitterDescription: data.twitterDescription || "",
          robots: data.robots || "index, follow",
          canonical: data.canonical || "",
          jsonLdOverrides: data.jsonLdOverrides || {},
        });
        const jld = data.jsonLdOverrides && Object.keys(data.jsonLdOverrides).length > 0
          ? JSON.stringify(data.jsonLdOverrides, null, 2) : "{}";
        setJsonText(jld);
        setJsonValid(true);
        // Check if robots matches a preset
        const isPreset = ROBOTS_PRESETS.some(p => p.value === data.robots);
        setCustomRobots(!isPreset);
      }
    } catch {
      setError("Failed to load SEO settings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { fetchPage(selectedPage); }, [selectedPage, fetchPage]);

  const set = (k: keyof SeoData, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  /* ── Save ── */
  const handleSave = async (e?: FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    // Parse JSON-LD
    let jsonLdObj: Record<string, unknown> = {};
    if (jsonText.trim() && jsonText.trim() !== "{}") {
      try {
        jsonLdObj = JSON.parse(jsonText);
      } catch {
        setError("Invalid JSON in JSON-LD overrides. Please fix the syntax.");
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(`${API}/api/seo/${selectedPage}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ ...form, jsonLdOverrides: jsonLdObj }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Save failed");
      }
      setSaved(true);
      fetchAll(); // refresh audit data
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try { JSON.parse(val); setJsonValid(true); } catch { setJsonValid(false); }
  };

  const pageLabel = PAGE_OPTIONS.find(p => p.value === selectedPage)?.label || selectedPage;
  const canonicalUrl = form.canonical
    ? (form.canonical.startsWith("http") ? form.canonical : `https://stackx.co.in${form.canonical}`)
    : `https://stackx.co.in/${selectedPage === "home" ? "" : selectedPage}`;

  /* ── Audit scoring ── */
  const getPageScore = (page: SeoData) => {
    let score = 0;
    const checks = [];
    const t = (page.title || "").length;
    const d = (page.description || "").length;

    // Title
    if (t > 0 && t <= 70) { score += 15; checks.push({ label: "Title tag", ok: true }); }
    else if (t > 70) { score += 8; checks.push({ label: "Title tag", ok: true, warn: "Too long" }); }
    else { checks.push({ label: "Title tag", ok: false }); }

    // Description
    if (d >= 120 && d <= 160) { score += 15; checks.push({ label: "Meta description", ok: true }); }
    else if (d > 0 && d < 120) { score += 10; checks.push({ label: "Meta description", ok: true, warn: "Short" }); }
    else if (d > 160) { score += 8; checks.push({ label: "Meta description", ok: true, warn: "Too long" }); }
    else { checks.push({ label: "Meta description", ok: false }); }

    // Keywords
    if ((page.keywords || []).length >= 3) { score += 10; checks.push({ label: "Keywords (3+)", ok: true }); }
    else if ((page.keywords || []).length > 0) { score += 5; checks.push({ label: "Keywords", ok: true, warn: "Few" }); }
    else { checks.push({ label: "Keywords", ok: false }); }

    // Canonical
    if (page.canonical) { score += 10; checks.push({ label: "Canonical URL", ok: true }); }
    else { checks.push({ label: "Canonical URL", ok: false }); }

    // Robots
    if (page.robots) { score += 10; checks.push({ label: "Robots directive", ok: true }); }
    else { checks.push({ label: "Robots directive", ok: false }); }

    // OG Title
    if (page.ogTitle) { score += 10; checks.push({ label: "OG title", ok: true }); }
    else { checks.push({ label: "OG title", ok: false }); }

    // OG Description
    if (page.ogDescription) { score += 10; checks.push({ label: "OG description", ok: true }); }
    else { checks.push({ label: "OG description", ok: false }); }

    // OG Image
    if (page.ogImage) { score += 10; checks.push({ label: "OG image", ok: true }); }
    else { checks.push({ label: "OG image", ok: false }); }

    // Twitter
    if (page.twitterTitle || page.ogTitle) { score += 5; checks.push({ label: "Twitter card", ok: true }); }
    else { checks.push({ label: "Twitter card", ok: false }); }

    // JSON-LD
    const hasJsonLd = page.jsonLdOverrides && Object.keys(page.jsonLdOverrides).length > 0;
    if (hasJsonLd) { score += 5; checks.push({ label: "JSON-LD overrides", ok: true }); }
    else { checks.push({ label: "JSON-LD overrides", ok: false, warn: "Optional" }); }

    return { score, checks };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ══════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════ */
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* ── Header ── */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            SEO Manager
          </h1>
          <p className="text-muted text-sm mt-1">Manage meta tags, social previews, and structured data for every page</p>
        </div>
        <div className="flex items-center gap-3">
          <AdminButton
            variant="secondary" size="sm"
            onClick={() => { fetchPage(selectedPage); fetchAll(); }}
            title="Refresh"
          >
            <HiRefresh size={14} /> Refresh
          </AdminButton>
          <AdminButton
            variant="primary"
            onClick={() => handleSave()}
            disabled={saving || saved}
          >
            {saved ? <><HiCheck size={14} /> Saved!</> : saving ? "Saving..." : <><HiSave size={14} /> Save Changes</>}
          </AdminButton>
        </div>
      </motion.div>

      {/* ── Page selector + Tabs ── */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="w-full sm:w-56">
          <AdminSelect
            value={selectedPage}
            onChange={(val) => setSelectedPage(val)}
            options={PAGE_OPTIONS}
            size="sm"
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary-light border border-primary/25"
                  : "text-muted hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <tab.icon size={13} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Error banner ── */}
      {error && (
        <motion.div variants={item} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <HiExclamation size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
          <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-300"><HiX size={14} /></button>
        </motion.div>
      )}

      {/* ── Loading ── */}
      {loading ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <DashboardGlassCard>
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-muted">Loading SEO settings...</p>
              </div>
            </div>
          </DashboardGlassCard>
        </motion.div>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════
              TAB 1: PAGE META
              ══════════════════════════════════════════════════ */}
          {activeTab === "meta" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Main form — 2 cols */}
              <div className="lg:col-span-2 space-y-5">
                <DashboardGlassCard>
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)" }}>
                    <HiDocumentText size={16} className="text-primary-light" />
                    Meta Tags — {pageLabel}
                  </h3>
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-muted">Title Tag *</label>
                        <CharCount current={form.title.length} min={30} max={65} />
                      </div>
                      <input
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                        placeholder="Page title for search engines"
                        className="admin-input w-full"
                      />
                    </div>
                    {/* Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-muted">Meta Description *</label>
                        <CharCount current={form.description.length} min={120} max={160} />
                      </div>
                      <textarea
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="A compelling description of this page for search engine results"
                        rows={3}
                        className="admin-input w-full resize-none"
                      />
                    </div>
                    {/* Keywords */}
                    <div>
                      <label className="block text-xs text-muted mb-1.5">Keywords</label>
                      <KeywordInput keywords={form.keywords} onChange={(kw) => set("keywords", kw)} />
                    </div>
                    {/* Robots + Canonical row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted mb-1.5">Robots Directive</label>
                        <AdminSelect
                          value={customRobots ? "__custom__" : form.robots}
                          onChange={(val) => {
                            if (val === "__custom__") {
                              setCustomRobots(true);
                            } else {
                              setCustomRobots(false);
                              set("robots", val);
                            }
                          }}
                          options={ROBOTS_PRESETS}
                          size="sm"
                        />
                        {customRobots && (
                          <input
                            value={form.robots}
                            onChange={(e) => set("robots", e.target.value)}
                            placeholder="e.g., noindex, follow"
                            className="admin-input w-full mt-2"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1.5">Canonical URL</label>
                        <input
                          value={form.canonical}
                          onChange={(e) => set("canonical", e.target.value)}
                          placeholder="/"
                          className="admin-input w-full"
                        />
                        <p className="text-[10px] text-muted/60 mt-1">Relative to https://stackx.co.in</p>
                      </div>
                    </div>
                  </div>
                </DashboardGlassCard>
              </div>

              {/* Sidebar — SERP preview */}
              <div className="space-y-5">
                <DashboardGlassCard>
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)" }}>
                    <HiSearch size={16} className="text-primary-light" />
                    Google Preview
                  </h3>
                  <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                    {/* SERP mock */}
                    <div className="space-y-1">
                      <p className="text-xs text-emerald-400 font-normal truncate">
                        {canonicalUrl}
                      </p>
                      <p className="text-sm font-medium text-[#8ab4f8] leading-snug line-clamp-2 hover:underline cursor-pointer">
                        {form.title || "Page Title"}
                      </p>
                      <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-3">
                        {form.description || "Meta description will appear here. Write a compelling description to increase click-through rate."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-surface-border">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted">Title: <span className={form.title.length >= 30 && form.title.length <= 65 ? "text-emerald-400" : "text-amber-400"}>{form.title.length} chars</span></span>
                      <span className="text-muted">Desc: <span className={form.description.length >= 120 && form.description.length <= 160 ? "text-emerald-400" : "text-amber-400"}>{form.description.length} chars</span></span>
                    </div>
                  </div>
                </DashboardGlassCard>

                {/* Quick info */}
                <DashboardGlassCard>
                  <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "var(--font-poppins)" }}>
                    Tips
                  </h3>
                  <div className="space-y-2.5 text-xs text-muted leading-relaxed">
                    <p>• <strong className="text-white/80">Title:</strong> 50-60 chars. Include primary keyword early.</p>
                    <p>• <strong className="text-white/80">Description:</strong> 150-160 chars. Include a call-to-action.</p>
                    <p>• <strong className="text-white/80">Keywords:</strong> 5-10 relevant terms.</p>
                    <p>• <strong className="text-white/80">Canonical:</strong> Self-referencing. Prevents duplicate content.</p>
                  </div>
                </DashboardGlassCard>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 2: SOCIAL PREVIEW
              ══════════════════════════════════════════════════ */}
          {activeTab === "social" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Form */}
              <div className="space-y-5">
                <DashboardGlassCard>
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)" }}>
                    <HiGlobeAlt size={16} className="text-primary-light" />
                    Open Graph (Facebook / LinkedIn)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-muted">OG Title</label>
                        <CharCount current={(form.ogTitle || "").length} min={30} max={65} />
                      </div>
                      <input value={form.ogTitle} onChange={(e) => set("ogTitle", e.target.value)}
                        placeholder="Defaults to page title" className="admin-input w-full" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-muted">OG Description</label>
                        <CharCount current={(form.ogDescription || "").length} min={60} max={160} />
                      </div>
                      <textarea value={form.ogDescription} onChange={(e) => set("ogDescription", e.target.value)}
                        placeholder="Defaults to meta description" rows={2} className="admin-input w-full resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1.5">OG Image URL</label>
                      <input value={form.ogImage} onChange={(e) => set("ogImage", e.target.value)}
                        placeholder="/og-image.png" className="admin-input w-full" />
                      <p className="text-[10px] text-muted/60 mt-1">Recommended: 1200×630px</p>
                    </div>
                  </div>
                </DashboardGlassCard>

                <DashboardGlassCard>
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)" }}>
                    <span className="text-primary-light text-base">𝕏</span>
                    Twitter / X Card
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-muted mb-1.5">Twitter Title</label>
                      <input value={form.twitterTitle} onChange={(e) => set("twitterTitle", e.target.value)}
                        placeholder="Defaults to OG title" className="admin-input w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1.5">Twitter Description</label>
                      <textarea value={form.twitterDescription} onChange={(e) => set("twitterDescription", e.target.value)}
                        placeholder="Defaults to OG description" rows={2} className="admin-input w-full resize-none" />
                    </div>
                  </div>
                </DashboardGlassCard>
              </div>

              {/* Live previews */}
              <div className="space-y-5">
                {/* Facebook/LinkedIn preview */}
                <DashboardGlassCard>
                  <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
                    Facebook / LinkedIn Preview
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    {/* Image area */}
                    <div className="aspect-[1200/630] bg-surface flex items-center justify-center relative">
                      {form.ogImage ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/10">
                          <HiPhotograph size={40} className="text-muted/30" />
                          <span className="absolute bottom-2 right-2 text-[9px] text-muted/60 bg-black/40 px-1.5 py-0.5 rounded">{form.ogImage}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted/30">
                          <HiPhotograph size={40} />
                          <span className="text-[10px]">No OG image set</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <p className="text-[10px] text-muted/60 uppercase tracking-wider mb-1">stackx.co.in</p>
                      <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                        {form.ogTitle || form.title || "OG Title"}
                      </p>
                      <p className="text-xs text-muted mt-1 line-clamp-2">
                        {form.ogDescription || form.description || "OG description will appear here."}
                      </p>
                    </div>
                  </div>
                </DashboardGlassCard>

                {/* Twitter preview */}
                <DashboardGlassCard>
                  <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
                    Twitter / X Preview
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <div className="aspect-[2/1] bg-surface flex items-center justify-center relative">
                      {form.ogImage ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/15 to-primary/10">
                          <HiPhotograph size={36} className="text-muted/30" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted/30">
                          <HiPhotograph size={36} />
                          <span className="text-[10px]">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <p className="text-sm font-semibold text-white line-clamp-1">
                        {form.twitterTitle || form.ogTitle || form.title || "Twitter Title"}
                      </p>
                      <p className="text-xs text-muted mt-1 line-clamp-2">
                        {form.twitterDescription || form.ogDescription || form.description || "Twitter description"}
                      </p>
                      <p className="text-[10px] text-muted/50 mt-1.5 flex items-center gap-1">
                        <HiExternalLink size={10} />stackx.co.in
                      </p>
                    </div>
                  </div>
                </DashboardGlassCard>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 3: JSON-LD
              ══════════════════════════════════════════════════ */}
          {activeTab === "jsonld" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <DashboardGlassCard>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)" }}>
                      <HiCode size={16} className="text-primary-light" />
                      JSON-LD Overrides — {pageLabel}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        jsonValid
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {jsonValid ? "✓ Valid JSON" : "✗ Invalid JSON"}
                      </span>
                      <button
                        onClick={() => copyToClipboard(jsonText)}
                        className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
                        title="Copy JSON"
                      >
                        {copied ? <HiCheck size={13} className="text-emerald-400" /> : <HiClipboardCopy size={13} />}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={jsonText}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    rows={18}
                    className="admin-input w-full resize-none font-mono text-xs leading-relaxed"
                    spellCheck={false}
                    style={{ tabSize: 2 }}
                  />
                  <p className="text-[10px] text-muted/60 mt-2">
                    This JSON is merged into the page&apos;s structured data. Leave as {"{ }"} for no overrides.
                  </p>
                </DashboardGlassCard>
              </div>

              {/* Quick templates */}
              <div className="space-y-5">
                <DashboardGlassCard>
                  <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "var(--font-poppins)" }}>
                    Quick Templates
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "FAQ Page", icon: "❓", template: { "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "Your question?", acceptedAnswer: { "@type": "Answer", text: "Your answer." } }] } },
                      { label: "Local Business", icon: "📍", template: { "@type": "LocalBusiness", name: "StackX", address: { "@type": "PostalAddress", addressLocality: "Visakhapatnam", addressCountry: "IN" } } },
                      { label: "Product", icon: "📦", template: { "@type": "Product", name: "Your Product", description: "Description", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } } },
                      { label: "Breadcrumb", icon: "🔗", template: { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://stackx.co.in" }] } },
                    ].map((tpl) => (
                      <button
                        key={tpl.label}
                        onClick={() => { setJsonText(JSON.stringify(tpl.template, null, 2)); setJsonValid(true); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left text-muted hover:text-white hover:bg-white/5 transition border border-transparent hover:border-white/10"
                      >
                        <span className="text-base">{tpl.icon}</span>
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </DashboardGlassCard>

                <DashboardGlassCard>
                  <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "var(--font-poppins)" }}>
                    About JSON-LD
                  </h3>
                  <div className="space-y-2 text-xs text-muted leading-relaxed">
                    <p>JSON-LD helps search engines understand your page content as structured data.</p>
                    <p>The global Organization and WebSite schemas are set in the root layout. Use this field for <strong className="text-white/80">page-specific</strong> additions.</p>
                    <p>Validate at <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">Rich Results Test ↗</a></p>
                  </div>
                </DashboardGlassCard>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 4: SEO AUDIT
              ══════════════════════════════════════════════════ */}
          {activeTab === "audit" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {(() => {
                  const scores = allPages.map(p => getPageScore(p).score);
                  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                  const perfect = scores.filter(s => s >= 95).length;
                  const needsWork = scores.filter(s => s < 70).length;
                  const dbPages = allPages.filter(p => p._source === "database").length;
                  return (
                    <>
                      <DashboardGlassCard className="text-center py-5">
                        <p className={`text-3xl font-bold ${avg >= 80 ? "text-emerald-400" : avg >= 60 ? "text-amber-400" : "text-red-400"}`} style={{ fontFamily: "var(--font-poppins)" }}>{avg}</p>
                        <p className="text-sm text-muted mt-1">Avg Score</p>
                      </DashboardGlassCard>
                      <DashboardGlassCard className="text-center py-5">
                        <p className="text-3xl font-bold text-emerald-400" style={{ fontFamily: "var(--font-poppins)" }}>{perfect}</p>
                        <p className="text-sm text-muted mt-1">Excellent</p>
                      </DashboardGlassCard>
                      <DashboardGlassCard className="text-center py-5">
                        <p className="text-3xl font-bold text-amber-400" style={{ fontFamily: "var(--font-poppins)" }}>{needsWork}</p>
                        <p className="text-sm text-muted mt-1">Needs Work</p>
                      </DashboardGlassCard>
                      <DashboardGlassCard className="text-center py-5">
                        <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins)" }}>{dbPages}/{allPages.length}</p>
                        <p className="text-sm text-muted mt-1">Customized</p>
                      </DashboardGlassCard>
                    </>
                  );
                })()}
              </div>

              {/* Per-page audit cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {allPages.map((page) => {
                  const { score, checks } = getPageScore(page);
                  const label = PAGE_OPTIONS.find(p => p.value === page.pageKey)?.label || page.pageKey;
                  const scoreColor = score >= 90 ? "text-emerald-400" : score >= 70 ? "text-amber-400" : "text-red-400";
                  const barColor = score >= 90 ? "bg-emerald-400" : score >= 70 ? "bg-amber-400" : "bg-red-400";

                  return (
                    <DashboardGlassCard key={page.pageKey} className="relative overflow-hidden">
                      {/* Score bar */}
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className={`h-full ${barColor} transition-all duration-700`} style={{ width: `${score}%` }} />
                      </div>

                      <div className="flex items-start justify-between mb-3 pt-1">
                        <div>
                          <h4 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>{label}</h4>
                          <p className="text-[10px] text-muted mt-0.5">/{page.pageKey === "home" ? "" : page.pageKey}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${scoreColor}`} style={{ fontFamily: "var(--font-poppins)" }}>{score}</p>
                          <p className="text-[9px] text-muted">/ 100</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {checks.map((check, ci) => (
                          <div key={ci} className="flex items-center gap-2 text-[11px]">
                            {check.ok ? (
                              <HiCheckCircle size={13} className={check.warn ? "text-amber-400" : "text-emerald-400"} />
                            ) : (
                              <HiMinusCircle size={13} className={check.warn === "Optional" ? "text-gray-500" : "text-red-400"} />
                            )}
                            <span className={check.ok ? "text-muted" : check.warn === "Optional" ? "text-muted/50" : "text-red-300"}>
                              {check.label}
                            </span>
                            {check.warn && (
                              <span className="text-[9px] text-amber-400/70 ml-auto">{check.warn}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Source badge */}
                      <div className="mt-3 pt-2 border-t border-surface-border flex items-center justify-between">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
                          page._source === "database"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : page._source === "defaults"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}>
                          {page._source === "database" ? "Saved in DB" : page._source === "defaults" ? "Using defaults" : "Not configured"}
                        </span>
                        <button
                          onClick={() => { setSelectedPage(page.pageKey); setActiveTab("meta"); }}
                          className="text-[10px] text-primary-light hover:underline"
                        >
                          Edit →
                        </button>
                      </div>
                    </DashboardGlassCard>
                  );
                })}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
