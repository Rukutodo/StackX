"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus, HiTrash, HiX,
  HiSave, HiCheck, HiLink,
  HiExternalLink,
  HiChevronDown, HiChevronUp,
  HiLightningBolt, HiEye, HiCode,
  HiLocationMarker, HiGlobe, HiPhotograph,
  HiDocumentText, HiQuestionMarkCircle,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  AdminSelect,
} from "@/components/admin/ui";
import type { Reference } from "@/types/reference";
import type { ServiceCategory } from "@/types/services";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

export const EMPTY_REFERENCE: Omit<Reference, "_id"> = {
  slug: "",
  title: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  content: "",
  city: "",
  state: "",
  country: "India",
  keywords: "",
  ogImage: "",
  canonical: "",
  robots: "index, follow",
  focusKeyword: "",
  noIndex: false,
  faqs: [],
  service: "",
  relatedReferences: [],
  status: "active",
  order: 0,
};

/* ── Character Counter Badge ─────────────── */
function CharCount({ value, min, max }: { value: string; min: number; max: number }) {
  const len = value.length;
  const color = len === 0 ? "text-muted/40" : len < min ? "text-amber-400" : len <= max ? "text-emerald-400" : "text-red-400";
  return (
    <span className={`text-[10px] font-mono ${color}`}>
      {len}/{max}
    </span>
  );
}

/* ── Collapsible Section ─────────────────── */
function Section({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white/[0.02] hover:bg-white/[0.04] transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-primary-light">{icon}</span>
          <span className="text-sm font-bold uppercase tracking-wider text-white/70">{title}</span>
        </div>
        {open ? <HiChevronUp size={16} className="text-muted" /> : <HiChevronDown size={16} className="text-muted" />}
      </button>
      {open && <div className="px-6 py-5 space-y-5">{children}</div>}
    </div>
  );
}

/* ── FAQ Repeater ────────────────────────── */
function FaqRepeater({
  faqs,
  onChange,
}: {
  faqs: { question: string; answer: string }[];
  onChange: (faqs: { question: string; answer: string }[]) => void;
}) {
  const add = () => onChange([...faqs, { question: "", answer: "" }]);
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));
  const update = (i: number, key: "question" | "answer", val: string) => {
    const updated = [...faqs];
    updated[i] = { ...updated[i], [key]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">FAQ {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-muted hover:text-red-400 transition">
              <HiTrash size={14} />
            </button>
          </div>
          <input
            value={faq.question}
            onChange={(e) => update(i, "question", e.target.value)}
            placeholder="Question..."
            className="admin-input w-full"
          />
          <textarea
            value={faq.answer}
            onChange={(e) => update(i, "answer", e.target.value)}
            placeholder="Answer..."
            rows={3}
            className="admin-input w-full resize-none"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-primary-light hover:text-white transition px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10"
      >
        <HiPlus size={14} /> Add FAQ
      </button>
    </div>
  );
}

/* ── Main Form Component ──────────────────── */
export default function ReferenceForm({
  initialData,
}: {
  initialData?: Reference;
}) {
  const isEdit = !!initialData;
  const router = useRouter();

  const [form, setForm] = useState({
    ...(initialData ? initialData : EMPTY_REFERENCE),
    service: initialData ? (typeof initialData.service === "string" ? initialData.service : initialData.service._id) : "",
    faqs: initialData?.faqs || [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [services, setServices] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    fetch(`${API}/api/services?all=true`)
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [initialData]);

  const set = (k: string, v: unknown) => {
    setForm((f) => {
      const updated = { ...f, [k]: v };
      if (!isEdit && (k === "city" || k === "service")) {
        const serviceObj = services.find((s) => s._id === (k === "service" ? v : f.service));
        const cityVal = k === "city" ? (v as string) : f.city;
        if (serviceObj && cityVal) {
          updated.slug = `${serviceObj.slug}-${cityVal}`
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        }
      }
      if (k === "title" && !isEdit && !f.city) {
        updated.slug = (v as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      }
      return updated;
    });
  };

  const autoFillMeta = () => {
    setForm((f) => ({
      ...f,
      metaTitle: f.title && f.city ? `${f.title} | StackX` : f.title ? `${f.title} | StackX` : f.metaTitle || "",
      metaDescription: f.content
        ? f.content.replace(/<[^>]*>/g, "").replace(/[#*_~`>\-\[\]()!]/g, "").replace(/\s+/g, " ").trim().substring(0, 157)
        : f.description || f.metaDescription || "",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.service) {
      setError("Title and service are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `${API}/api/references/${initialData!._id}` : `${API}/api/references`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed");
      }
      setSaved(true);
      setTimeout(() => {
        router.push("/references");
      }, 700);
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl"
    >
      <form onSubmit={handleSubmit}>
        
        {/* Actions Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-surface-border">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              {isEdit ? "Edit Reference" : "Add Reference"}
            </h1>
            {isEdit && <p className="text-sm text-muted mt-1">{initialData!.title}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/references")}
              className="text-sm font-medium text-muted hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || saved}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-60"
              style={{
                background: saved ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#8B5CF6,#6D28D9)",
                boxShadow: "0 4px 16px rgba(139,92,246,0.25)",
              }}
            >
              {saved ? (
                <>
                  <HiCheck size={16} /> Saved!
                </>
              ) : saving ? (
                "Saving..."
              ) : (
                <>
                  <HiSave size={16} />
                  {isEdit ? "Save Changes" : "Create Reference"}
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <HiX className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <DashboardGlassCard className="p-8">
          <Section title="Basic Info" icon={<HiDocumentText size={16} />} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm text-muted mb-2">Page Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Web Development in Vizag"
                  className="admin-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">
                  <HiLocationMarker size={14} className="inline mr-1" />City
                </label>
                <input
                  value={form.city || ""}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Vizag"
                  className="admin-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">State</label>
                <input
                  value={form.state || ""}
                  onChange={(e) => set("state", e.target.value)}
                  placeholder="Andhra Pradesh"
                  className="admin-input w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-muted mb-2">Route Slug</label>
                <div className="relative flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/30 text-base">/services/</span>
                    <input
                      value={form.slug}
                      onChange={(e) => set("slug", e.target.value)}
                      placeholder="web-development-vizag"
                      className="admin-input w-full pl-[5.5rem] font-mono text-sm"
                    />
                  </div>
                  {isEdit && form.slug && (
                    <a
                      href={`http://localhost:3000/services/${form.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Open in frontend"
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-muted hover:text-white transition shrink-0 border border-white/5"
                    >
                      <HiExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Parent Service *</label>
                <AdminSelect
                  value={form.service as string}
                  onChange={(val) => set("service", val)}
                  placeholder="Select Service"
                  options={services.map((s) => ({ label: s.title, value: s._id }))}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Status</label>
                <AdminSelect
                  value={form.status}
                  onChange={(val) => set("status", val)}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Draft", value: "draft" },
                  ]}
                />
              </div>
            </div>
          </Section>

          <Section title="SEO Settings" icon={<HiGlobe size={16} />} defaultOpen={true}>
            <button
              type="button"
              onClick={autoFillMeta}
              className="mb-5 flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition px-4 py-2 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10"
            >
              <HiLightningBolt size={14} /> Auto-fill from title & content
            </button>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-muted mb-2">Focus Keyword</label>
                <input
                  value={form.focusKeyword || ""}
                  onChange={(e) => set("focusKeyword", e.target.value)}
                  placeholder="web development in vizag"
                  className="admin-input w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-muted">Meta Title</label>
                  <CharCount value={form.metaTitle || ""} min={50} max={60} />
                </div>
                <input
                  value={form.metaTitle || ""}
                  onChange={(e) => set("metaTitle", e.target.value)}
                  placeholder="Web Development in Vizag | StackX"
                  className="admin-input w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-muted">Meta Description</label>
                  <CharCount value={form.metaDescription || ""} min={150} max={160} />
                </div>
                <textarea
                  value={form.metaDescription || ""}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  placeholder="SEO-optimized description..."
                  rows={3}
                  className="admin-input w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Canonical URL Override</label>
                <input
                  value={form.canonical || ""}
                  onChange={(e) => set("canonical", e.target.value)}
                  placeholder={`https://stackx.co.in/services/${form.slug || "..."}`}
                  className="admin-input w-full font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div>
                  <p className="text-sm text-white font-medium">No-Index</p>
                  <p className="text-xs text-muted mt-0.5">Block search engines from indexing this page</p>
                </div>
                <button
                  type="button"
                  onClick={() => set("noIndex", !form.noIndex)}
                  className={`w-12 h-6 rounded-full transition-all duration-200 ${form.noIndex ? "bg-red-500" : "bg-white/10"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.noIndex ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </Section>

          <Section title="Content" icon={<HiCode size={16} />} defaultOpen={true}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-muted mb-2">Short Description / Excerpt</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Brief summary..."
                  rows={2}
                  className="admin-input w-full resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-muted mb-2 block">Page Content (Plain Text)</label>
                <textarea
                  value={form.content || ""}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder="Write location-specific, unique long-form content..."
                  rows={16}
                  className="admin-input w-full resize-y leading-relaxed text-sm"
                />
              </div>
            </div>
          </Section>

          <Section title="Enhancements & Schema" icon={<HiQuestionMarkCircle size={16} />} defaultOpen={false}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-muted mb-3">FAQ Schema</label>
                <FaqRepeater
                  faqs={form.faqs || []}
                  onChange={(faqs) => set("faqs", faqs)}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">
                  <HiPhotograph size={14} className="inline mr-1" />OG Image URL
                </label>
                <input
                  value={form.ogImage || ""}
                  onChange={(e) => set("ogImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="admin-input w-full font-mono text-sm"
                />
              </div>
            </div>
          </Section>

        </DashboardGlassCard>
      </form>
    </motion.div>
  );
}
