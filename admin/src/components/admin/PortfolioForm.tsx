"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiArrowLeft, HiPhotograph, HiX,
  HiSave, HiStar, HiCheck, HiArrowRight, HiInformationCircle,
} from "react-icons/hi";
import type { PortfolioProject } from "@/types/portfolio";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

const EMPTY_FORM = {
  slug: "",
  title: "",
  category: "Web Development",
  description: "",
  image: "",
  techStack: [] as string[],
  result: "",
  featured: false,
  status: "active" as string,
  order: 0,
  caseStudy: null as PortfolioProject["caseStudy"],
};


/* ── Section wrapper ─────────────────────────────── */
function FormSection({ title, children, accent = "purple" }: { title: string; children: React.ReactNode; accent?: "purple" | "cyan" | "emerald" }) {
  const borderColor = accent === "cyan" ? "border-cyan-500/20" : accent === "emerald" ? "border-emerald-500/20" : "border-purple-500/20";
  const textColor = accent === "cyan" ? "text-cyan-400" : accent === "emerald" ? "text-emerald-400" : "text-purple-400";
  return (
    <div className={`rounded-xl border p-5 sm:p-6 space-y-5 ${borderColor}`} style={{ background: "rgba(19,19,26,0.7)", backdropFilter: "blur(16px)" }}>
      <h3 className={`text-xs font-bold uppercase tracking-widest ${textColor} pb-2 border-b border-white/[0.06]`}>{title}</h3>
      {children}
    </div>
  );
}

/* ── Field label ──────────────────────────────────── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
      {children}{required && <span className="text-purple-400 ml-0.5">*</span>}
    </label>
  );
}

/* ── Main form component ─────────────────────────── */
interface PortfolioFormProps {
  initial?: PortfolioProject | null;
  categories: string[];
  isEdit: boolean;
}

export default function PortfolioForm({ initial, categories, isEdit }: PortfolioFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const [techInput, setTechInput] = useState(initial?.techStack?.join(", ") ?? "");
  const [hasCaseStudy, setHasCaseStudy] = useState(!!initial?.caseStudy);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Auto slug from title when creating
  useEffect(() => {
    if (!isEdit) {
      setForm((f) => ({
        ...f,
        slug: f.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [form.title, isEdit]);

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  /* ── Image Upload ── */
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("image", file);
    try {
      const res = await fetch(`${API}/api/portfolio/upload`, {
        method: "POST", credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      set("image", data.url);
    } catch { setError("Image upload failed"); }
    finally { setUploading(false); }
  };

  /* ── Submit ── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    const payload = {
      ...form,
      techStack: techInput.split(",").map((s) => s.trim()).filter(Boolean),
      // If case study is disabled, set to null. If enabled, preserve whatever data exists.
      caseStudy: hasCaseStudy ? (form.caseStudy ?? { subtitle: "", overview: "", problem: "", solution: "", features: [], results: [], testimonial: null }) : null,
    };
    try {
      const url = isEdit ? `${API}/api/portfolio/${initial!._id}` : `${API}/api/portfolio`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Failed to save"); }
      setSaved(true);
      setTimeout(() => router.push("/portfolio"), 800);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Section 1: Core Info ── */}
      <FormSection title="Project Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel required>Project Title</FieldLabel>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="Amazing Project" className="admin-input w-full" />
          </div>
          <div>
            <FieldLabel required>URL Slug</FieldLabel>
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)}
              placeholder="amazing-project" className="admin-input w-full" />
            <p className="text-[10px] text-gray-600 mt-1">Auto-generated from title</p>
          </div>
        </div>

        <div>
          <FieldLabel required>Short Description</FieldLabel>
          <textarea required value={form.description} onChange={(e) => set("description", e.target.value)}
            placeholder="A brief, compelling description of what this project does..."
            rows={3} className="admin-input w-full resize-none" />
        </div>

        <div>
          <FieldLabel>Key Result / Outcome</FieldLabel>
          <input value={form.result} onChange={(e) => set("result", e.target.value)}
            placeholder="e.g. 3× increase in engagement" className="admin-input w-full" />
        </div>
      </FormSection>

      {/* ── Section 2: Metadata ── */}
      <FormSection title="Classification & Display" accent="cyan">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <FieldLabel required>Category</FieldLabel>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="admin-input w-full">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="admin-input w-full">
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <FieldLabel>Display Order</FieldLabel>
            <input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))}
              className="admin-input w-full" />
          </div>
        </div>

        <div>
          <FieldLabel>Tech Stack</FieldLabel>
          <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
            placeholder="React, Node.js, PostgreSQL, AWS" className="admin-input w-full" />
          <p className="text-[10px] text-gray-600 mt-1">Comma-separated list of technologies used</p>
          {/* Live preview pills */}
          {techInput.trim() && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {techInput.split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                <span key={i} className="px-2.5 py-0.5 text-xs bg-white/5 text-gray-400 rounded-md border border-white/[0.08]">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Featured toggle */}
        <div
          onClick={() => set("featured", !form.featured)}
          className={`flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 border transition-all duration-200 select-none ${
            form.featured ? "bg-amber-500/10 border-amber-500/25" : "bg-white/[0.03] border-white/[0.08] hover:border-white/15"
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.featured ? "bg-amber-500/20" : "bg-white/5"}`}>
            <HiStar className={`w-4 h-4 ${form.featured ? "text-amber-400" : "text-gray-500"}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${form.featured ? "text-amber-300" : "text-gray-300"}`}>Featured Project</p>
            <p className="text-xs text-gray-500">Show this project prominently on the homepage and portfolio</p>
          </div>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${form.featured ? "bg-amber-500" : "bg-white/10"}`}>
            {form.featured && <HiCheck className="w-3 h-3 text-white" />}
          </div>
        </div>
      </FormSection>

      {/* ── Section 3: Image ── */}
      <FormSection title="Project Image" accent="purple">
        <div>
          {form.image ? (
            <div className="relative">
              <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden border border-white/[0.08]">
                <img src={`${API}${form.image}`} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <button
                type="button" onClick={() => set("image", "")}
                className="mt-3 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition"
              >
                <HiX className="w-3.5 h-3.5" /> Remove image
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                uploading ? "border-purple-500/40 bg-purple-500/[0.04]" : "border-white/[0.10] hover:border-purple-500/30 hover:bg-purple-500/[0.03]"
              }`}
            >
              <HiPhotograph className={`w-8 h-8 ${uploading ? "text-purple-400 animate-pulse" : "text-gray-600"}`} />
              <div className="text-center">
                <p className="text-sm text-gray-400">{uploading ? "Uploading..." : "Click to upload project image"}</p>
                <p className="text-xs text-gray-600 mt-1">PNG, JPG, WebP — max 10 MB</p>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }} />
        </div>
      </FormSection>

      {/* ── Section 4: Case Study Toggle ── */}
      <div
        className="rounded-xl border transition-all duration-300 overflow-hidden"
        style={{
          background: "rgba(19,19,26,0.7)",
          backdropFilter: "blur(16px)",
          borderColor: hasCaseStudy ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${hasCaseStudy ? "bg-purple-500/20" : "bg-white/5"}`}>
              <HiStar className={`w-4 h-4 ${hasCaseStudy ? "text-purple-400" : "text-gray-500"}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Case Study</p>
              <p className="text-xs text-gray-500">Enable a full case study deep-dive for this project</p>
            </div>
          </div>
          {/* Toggle switch */}
          <button
            type="button"
            onClick={() => {
              const next = !hasCaseStudy;
              setHasCaseStudy(next);
              if (next && !form.caseStudy) {
                set("caseStudy", { subtitle: "", overview: "", problem: "", solution: "", features: [], results: [], testimonial: null });
              }
            }}
            className={`w-11 h-6 rounded-full transition-all duration-200 relative shrink-0 ${hasCaseStudy ? "bg-purple-600" : "bg-white/10"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${hasCaseStudy ? "left-6" : "left-1"}`} />
          </button>
        </div>

        {/* When enabled — show link to case study page (edit mode) or note (create mode) */}
        {hasCaseStudy && (
          <div className="border-t border-white/[0.06] px-5 sm:px-6 py-4">
            {isEdit && initial?._id ? (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-white font-medium">Case study is enabled ✓</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Edit the full case study content — overview, problem, solution, features, and metrics.
                  </p>
                </div>
                <a
                  href={`/portfolio/case-study/${initial._id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors whitespace-nowrap shrink-0"
                >
                  <HiArrowRight className="w-4 h-4" />
                  Edit Case Study
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <HiInformationCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Case study content is managed on a separate page. After you save this project, an &quot;Edit Case Study&quot; button will appear here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm">
          <HiX className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Action Bar ── */}
      <div className="sticky bottom-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 border-t border-white/[0.06] flex items-center justify-between gap-4"
        style={{ background: "rgba(13,13,20,0.95)", backdropFilter: "blur(20px)" }}>
        <button type="button" onClick={() => router.push("/portfolio")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition px-4 py-2.5 rounded-xl hover:bg-white/5">
          <HiArrowLeft className="w-4 h-4" /> Discard & Go Back
        </button>
        <button type="submit" disabled={saving || saved}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-60"
          style={{ background: saved ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#8B5CF6,#6D28D9)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>
          {saved ? <><HiCheck className="w-4 h-4" /> Saved!</> : saving ? "Saving..." : <><HiSave className="w-4 h-4" />{isEdit ? "Save Changes" : "Create Project"}</>}
        </button>
      </div>

    </form>
  );
}
