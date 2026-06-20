"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiArrowLeft, HiPlus, HiTrash, HiSave, HiCheck, HiX,
  HiLightBulb, HiPuzzle, HiChip, HiChartBar, HiPhotograph, HiUpload,
  HiInformationCircle, HiStar, HiExternalLink,
} from "react-icons/hi";
import {
  AdminSelect,
} from "@/components/admin/ui";
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

/* ── Section card ───────────────────────────────── */
function Section({ icon, title, accent, className = "", children }: {
  icon: React.ReactNode; title: string; accent: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-5 sm:p-6 space-y-4 ${accent} ${className}`}
      style={{ background: "rgba(19,19,26,0.7)", backdropFilter: "blur(16px)" }}>
      <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
        <span className="text-purple-400">{icon}</span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{children}</label>;
}

export default function CaseStudyEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Omit<CaseStudy, "_id" | "createdAt">>({ ...EMPTY });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  // Dropdowns data
  const [projects, setProjects] = useState<{ _id: string; title: string; slug: string }[]>([]);
  const [services, setServices] = useState<{ _id: string; title: string }[]>([]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  // Fetch case study data for editing
  const fetchCaseStudy = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/case-studies/${id}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        client: data.client || "",
        service: data.service || "",
        subtitle: data.subtitle || "",
        overview: data.overview || "",
        problem: data.problem || "",
        solution: data.solution || "",
        features: data.features || [],
        results: data.results || [],
        images: data.images || [],
        featured: data.featured || false,
        status: data.status || "draft",
        order: data.order ?? 0,
        portfolioProject: data.portfolioProject || null,
      });
    } catch {
      setError("Failed to load case study.");
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  // Fetch dropdown data (projects + services)
  useEffect(() => {
    fetch(`${API}/api/portfolio?all=true`)
      .then((r) => r.json()).then((d) => setProjects(Array.isArray(d) ? d : [])).catch(() => {});
    fetch(`${API}/api/services`)
      .then((r) => r.json()).then((d) => setServices(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => { fetchCaseStudy(); }, [fetchCaseStudy]);

  // Auto-slug from title (only for new)
  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!slugTouched) set("slug", toSlug(val));
  };

  /* Images */
  const uploadImages = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));
    try {
      const res = await fetch(`${API}/api/portfolio/upload-multiple`, {
        method: "POST",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((c) => ({ ...c, images: [...(c.images ?? []), ...data.urls] }));
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) =>
    setForm((c) => ({ ...c, images: (c.images ?? []).filter((_, idx) => idx !== i) }));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    uploadImages(files);
  };

  /* Features */
  const addFeature = () => setForm((c) => ({ ...c, features: [...c.features, ""] }));
  const setFeature = (i: number, val: string) =>
    setForm((c) => { const f = [...c.features]; f[i] = val; return { ...c, features: f }; });
  const removeFeature = (i: number) =>
    setForm((c) => ({ ...c, features: c.features.filter((_, idx) => idx !== i) }));

  /* Results */
  const addResult = () => setForm((c) => ({ ...c, results: [...c.results, { metric: "", label: "" }] }));
  const setResult = (i: number, k: "metric" | "label", val: string) =>
    setForm((c) => { const r = [...c.results]; r[i] = { ...r[i], [k]: val }; return { ...c, results: r }; });
  const removeResult = (i: number) =>
    setForm((c) => ({ ...c, results: c.results.filter((_, idx) => idx !== i) }));

  /* Submit */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true); setError("");
    try {
      const url = isNew ? `${API}/api/case-studies` : `${API}/api/case-studies/${id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Failed to save"); }
      setSaved(true);
      if (isNew) {
        const created = await res.json();
        setTimeout(() => router.push(`/case-studies/${created._id}`), 1200);
      } else {
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const images = form.images ?? [];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-5 animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-white/5" />
        {[1, 2, 3].map((n) => <div key={n} className="h-40 rounded-xl bg-white/5" />)}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <button onClick={() => router.push("/case-studies")}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition mb-3">
          <HiArrowLeft className="w-3.5 h-3.5" /> Back to Case Studies
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              {isNew ? "Create Case Study" : "Edit Case Study"}
            </h1>
            {!isNew && form.title && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                {form.title}
              </p>
            )}
          </div>
          {!isNew && form.slug && (
            <a href={`/case-studies/${form.slug}`} target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition px-4 py-2 rounded-xl border border-white/[0.08] hover:border-white/20 flex items-center gap-1.5">
              <HiExternalLink className="w-4 h-4" /> Preview
            </a>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Identity ── */}
        <Section icon={<HiInformationCircle className="w-4 h-4" />} title="Identity" accent="border-indigo-500/20" className="relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Title *</FieldLabel>
              <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="E-commerce Platform Redesign" className="admin-input w-full" />
            </div>
            <div>
              <FieldLabel>Slug *</FieldLabel>
              <input
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); set("slug", toSlug(e.target.value)); }}
                placeholder="ecommerce-platform-redesign"
                className="admin-input w-full font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Client</FieldLabel>
              <input value={form.client} onChange={(e) => set("client", e.target.value)}
                placeholder="Acme Corp" className="admin-input w-full" />
            </div>
            <div>
              <FieldLabel>Service</FieldLabel>
              <AdminSelect
                value={form.service}
                onChange={(val) => set("service", val)}
                placeholder="Select Service"
                size="sm"
                options={services.map((s) => ({ label: s.title, value: s.title }))}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Subtitle</FieldLabel>
            <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Case Study — Web Development" className="admin-input w-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FieldLabel>Status</FieldLabel>
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
              <FieldLabel>Display Order</FieldLabel>
              <input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))}
                className="admin-input w-full" />
            </div>
            <div>
              <FieldLabel>Featured</FieldLabel>
              <button
                type="button"
                onClick={() => set("featured", !form.featured)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  form.featured
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "bg-white/[0.04] text-gray-400 border border-white/[0.08] hover:bg-white/[0.08]"
                }`}
              >
                <HiStar className={`w-4 h-4 ${form.featured ? "text-amber-400" : ""}`} />
                {form.featured ? "Featured" : "Not Featured"}
              </button>
            </div>
          </div>

          {/* Linked Portfolio Project */}
          <div>
            <FieldLabel>Linked Portfolio Project</FieldLabel>
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
        </Section>

        {/* ── Overview ── */}
        <Section icon={<HiLightBulb className="w-4 h-4" />} title="Overview" accent="border-purple-500/20" className="relative z-10">
          <div>
            <FieldLabel>Project Overview</FieldLabel>
            <textarea value={form.overview} onChange={(e) => set("overview", e.target.value)}
              placeholder="High-level summary of what was built and why it matters..."
              rows={4} className="admin-input w-full resize-none" />
          </div>
        </Section>

        {/* ── Problem & Solution ── */}
        <Section icon={<HiPuzzle className="w-4 h-4" />} title="Problem & Solution" accent="border-cyan-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <FieldLabel>The Problem</FieldLabel>
              <textarea value={form.problem} onChange={(e) => set("problem", e.target.value)}
                placeholder="What challenge did the client face? What pain points existed?"
                rows={5} className="admin-input w-full resize-none" />
            </div>
            <div>
              <FieldLabel>Our Solution</FieldLabel>
              <textarea value={form.solution} onChange={(e) => set("solution", e.target.value)}
                placeholder="How did StackX approach and solve the challenge?"
                rows={5} className="admin-input w-full resize-none" />
            </div>
          </div>
        </Section>

        {/* ── Case Study Images ── */}
        <Section icon={<HiPhotograph className="w-4 h-4" />} title="Project Gallery" accent="border-violet-500/20">
          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-3 h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
              dragOver
                ? "border-violet-500/60 bg-violet-500/[0.07]"
                : uploading
                ? "border-violet-500/40 bg-violet-500/[0.04] cursor-not-allowed"
                : "border-white/[0.10] hover:border-violet-500/40 hover:bg-violet-500/[0.03]"
            }`}
          >
            {uploading ? (
              <>
                <HiUpload className="w-7 h-7 text-violet-400 animate-bounce" />
                <p className="text-sm text-violet-300">Uploading images...</p>
              </>
            ) : (
              <>
                <HiPhotograph className="w-7 h-7 text-gray-600" />
                <div className="text-center">
                  <p className="text-sm text-gray-400">Click or drag & drop to upload images</p>
                  <p className="text-xs text-gray-600 mt-1">PNG, JPG, WebP — up to 10 images, 5 MB each</p>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length) uploadImages(files);
              e.target.value = "";
            }}
          />

          {/* Image grid preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {images.map((url, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-white/[0.08] aspect-video bg-black/20">
                  <img src={`${API}${url}`} alt={`Case study image ${i + 1}`} className="w-full h-full object-cover" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition"
                      title="Remove image"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Index badge */}
                  <span className="absolute top-2 left-2 w-5 h-5 rounded-md bg-black/60 text-white text-[10px] flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && !uploading && (
            <p className="text-xs text-gray-600 text-center py-1">
              No images uploaded yet. These will appear in a carousel on the case study page.
            </p>
          )}

          {images.length > 0 && (
            <p className="text-xs text-gray-600 text-center">
              {images.length} image{images.length !== 1 ? "s" : ""} · hover to remove · order is preserved
            </p>
          )}
        </Section>

        {/* ── Key Features ── */}
        <Section icon={<HiChip className="w-4 h-4" />} title="Key Features" accent="border-emerald-500/20">
          <div className="space-y-2.5">
            {form.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <input value={feat} onChange={(e) => setFeature(i, e.target.value)}
                  placeholder={`Feature ${i + 1}`} className="admin-input flex-1" />
                <button type="button" onClick={() => removeFeature(i)}
                  className="p-1.5 text-gray-600 hover:text-red-400 transition shrink-0">
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
            {form.features.length === 0 && (
              <p className="text-xs text-gray-600 py-1">No features added yet.</p>
            )}
            <button type="button" onClick={addFeature}
              className="mt-1 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition w-fit">
              <HiPlus className="w-3.5 h-3.5" /> Add Feature
            </button>
          </div>
        </Section>

        {/* ── Result Metrics ── */}
        <Section icon={<HiChartBar className="w-4 h-4" />} title="Result Metrics" accent="border-amber-500/20">
          <div className="space-y-2.5">
            {form.results.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <input value={r.metric} onChange={(e) => setResult(i, "metric", e.target.value)}
                  placeholder="3×" className="admin-input w-20 text-center font-bold text-lg" />
                <input value={r.label} onChange={(e) => setResult(i, "label", e.target.value)}
                  placeholder="Engagement Increase" className="admin-input flex-1" />
                <button type="button" onClick={() => removeResult(i)}
                  className="p-1.5 text-gray-600 hover:text-red-400 transition shrink-0">
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
            {form.results.length === 0 && (
              <p className="text-xs text-gray-600 py-1">No metrics added yet.</p>
            )}
            <button type="button" onClick={addResult}
              className="mt-1 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition w-fit">
              <HiPlus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </div>
        </Section>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm">
            <HiX className="w-4 h-4 shrink-0" /> {error}
            <button type="button" onClick={() => setError("")} className="ml-auto text-red-400/60 hover:text-red-400">
              <HiX className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Sticky action bar */}
        <div className="sticky bottom-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 border-t border-white/[0.06] flex items-center justify-between gap-4"
          style={{ background: "rgba(13,13,20,0.95)", backdropFilter: "blur(20px)" }}>
          <button type="button" onClick={() => router.push("/case-studies")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition px-4 py-2.5 rounded-xl hover:bg-white/5">
            <HiArrowLeft className="w-4 h-4" /> Back to Case Studies
          </button>
          <button type="submit" disabled={saving || saved || uploading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-60"
            style={{
              background: saved ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#8B5CF6,#6D28D9)",
              boxShadow: "0 4px 20px rgba(139,92,246,0.3)",
            }}>
            {saved
              ? <><HiCheck className="w-4 h-4" /> Saved!</>
              : saving ? "Saving..."
              : uploading ? "Uploading..."
              : <><HiSave className="w-4 h-4" /> {isNew ? "Create Case Study" : "Save Case Study"}</>}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
