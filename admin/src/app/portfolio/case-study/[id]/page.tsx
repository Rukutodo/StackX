"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiArrowLeft, HiPlus, HiTrash, HiSave, HiCheck, HiX,
  HiLightBulb, HiPuzzle, HiChip, HiChartBar, HiPhotograph, HiUpload,
} from "react-icons/hi";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

interface CaseStudy {
  subtitle: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  results: { metric: string; label: string }[];
  images: string[];
  testimonial: null;
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  caseStudy: CaseStudy | null;
}

const EMPTY_CS: CaseStudy = {
  subtitle: "", overview: "", problem: "", solution: "",
  features: [], results: [], images: [], testimonial: null,
};

/* ── Section card ───────────────────────────────── */
function Section({ icon, title, accent, children }: {
  icon: React.ReactNode; title: string; accent: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-5 sm:p-6 space-y-4 ${accent}`}
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
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [cs, setCs] = useState<CaseStudy>({ ...EMPTY_CS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/portfolio/id/${id}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      if (!res.ok) throw new Error("Not found");
      const data: Project = await res.json();
      setProject(data);
      setCs({ ...EMPTY_CS, ...data.caseStudy });
    } catch {
      setError("Failed to load project.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  const setField = (k: keyof CaseStudy, v: unknown) => setCs((c) => ({ ...c, [k]: v }));

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
      setCs((c) => ({ ...c, images: [...(c.images ?? []), ...data.urls] }));
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) =>
    setCs((c) => ({ ...c, images: (c.images ?? []).filter((_, idx) => idx !== i) }));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    uploadImages(files);
  };

  /* Features */
  const addFeature = () => setCs((c) => ({ ...c, features: [...c.features, ""] }));
  const setFeature = (i: number, val: string) =>
    setCs((c) => { const f = [...c.features]; f[i] = val; return { ...c, features: f }; });
  const removeFeature = (i: number) =>
    setCs((c) => ({ ...c, features: c.features.filter((_, idx) => idx !== i) }));

  /* Results */
  const addResult = () => setCs((c) => ({ ...c, results: [...c.results, { metric: "", label: "" }] }));
  const setResult = (i: number, k: "metric" | "label", val: string) =>
    setCs((c) => { const r = [...c.results]; r[i] = { ...r[i], [k]: val }; return { ...c, results: r }; });
  const removeResult = (i: number) =>
    setCs((c) => ({ ...c, results: c.results.filter((_, idx) => idx !== i) }));

  /* Submit */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await fetch(`${API}/api/portfolio/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        credentials: "include",
        body: JSON.stringify({ caseStudy: cs }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Failed to save"); }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-5 animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-white/5" />
        {[1, 2, 3].map((n) => <div key={n} className="h-40 rounded-xl bg-white/5" />)}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-white font-medium mb-4">Project not found</p>
        <button onClick={() => router.push("/portfolio")}
          className="text-sm text-purple-400 hover:text-purple-300 transition">
          ← Back to Portfolio
        </button>
      </div>
    );
  }

  const images = cs.images ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <button onClick={() => router.push(`/portfolio/edit/${id}`)}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition mb-3">
          <HiArrowLeft className="w-3.5 h-3.5" /> Back to Project Settings
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Case Study Editor
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              {project.title}
            </p>
          </div>
          <a href={`/portfolio/${project.slug}`} target="_blank" rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition px-4 py-2 rounded-xl border border-white/[0.08] hover:border-white/20">
            Preview ↗
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Overview ── */}
        <Section icon={<HiLightBulb className="w-4 h-4" />} title="Overview" accent="border-purple-500/20">
          <div>
            <FieldLabel>Subtitle</FieldLabel>
            <input value={cs.subtitle} onChange={(e) => setField("subtitle", e.target.value)}
              placeholder="Case Study — Web Development" className="admin-input w-full" />
          </div>
          <div>
            <FieldLabel>Project Overview</FieldLabel>
            <textarea value={cs.overview} onChange={(e) => setField("overview", e.target.value)}
              placeholder="High-level summary of what was built and why it matters..."
              rows={4} className="admin-input w-full resize-none" />
          </div>
        </Section>

        {/* ── Problem & Solution ── */}
        <Section icon={<HiPuzzle className="w-4 h-4" />} title="Problem & Solution" accent="border-cyan-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <FieldLabel>The Problem</FieldLabel>
              <textarea value={cs.problem} onChange={(e) => setField("problem", e.target.value)}
                placeholder="What challenge did the client face? What pain points existed?"
                rows={5} className="admin-input w-full resize-none" />
            </div>
            <div>
              <FieldLabel>Our Solution</FieldLabel>
              <textarea value={cs.solution} onChange={(e) => setField("solution", e.target.value)}
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
            {cs.features.map((feat, i) => (
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
            {cs.features.length === 0 && (
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
            {cs.results.map((r, i) => (
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
            {cs.results.length === 0 && (
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
          <button type="button" onClick={() => router.push(`/portfolio/edit/${id}`)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition px-4 py-2.5 rounded-xl hover:bg-white/5">
            <HiArrowLeft className="w-4 h-4" /> Back to Project
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
              : <><HiSave className="w-4 h-4" /> Save Case Study</>}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
