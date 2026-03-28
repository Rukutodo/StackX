"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiPlus, HiTrash, HiPhotograph } from "react-icons/hi";
import type { PortfolioProject } from "@/types/portfolio";

interface Props {
  initial?: PortfolioProject | null;
  categories: string[];
  onClose: () => void;
  onSaved: () => void;
}

const API = "http://129.159.236.176:4000";

const EMPTY = {
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

export default function PortfolioProjectModal({ initial, categories, onClose, onSaved }: Props) {
  const isEdit = !!initial;

  /* ── form state ── */
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [techInput, setTechInput] = useState(initial?.techStack.join(", ") ?? "");
  const [hasCaseStudy, setHasCaseStudy] = useState(!!initial?.caseStudy);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-slug from title
  useEffect(() => {
    if (!isEdit) {
      setForm((f) => ({
        ...f,
        slug: f.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [form.title, isEdit]);

  const setField = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  /* ── Case Study helpers ── */
  const ensureCaseStudy = () => {
    if (!form.caseStudy) {
      setForm((f) => ({
        ...f,
        caseStudy: {
          subtitle: "",
          overview: "",
          problem: "",
          solution: "",
          features: [],
          results: [],
          testimonial: null,
        },
      }));
    }
  };

  const setCsField = (key: string, value: unknown) =>
    setForm((f) => ({
      ...f,
      caseStudy: f.caseStudy ? { ...f.caseStudy, [key]: value } : null,
    }));

  const addCsFeature = () =>
    setForm((f) => ({
      ...f,
      caseStudy: f.caseStudy
        ? { ...f.caseStudy, features: [...f.caseStudy.features, ""] }
        : null,
    }));

  const setCsFeature = (i: number, val: string) =>
    setForm((f) => {
      if (!f.caseStudy) return f;
      const features = [...f.caseStudy.features];
      features[i] = val;
      return { ...f, caseStudy: { ...f.caseStudy, features } };
    });

  const removeCsFeature = (i: number) =>
    setForm((f) => {
      if (!f.caseStudy) return f;
      return {
        ...f,
        caseStudy: { ...f.caseStudy, features: f.caseStudy.features.filter((_, idx) => idx !== i) },
      };
    });

  const addCsResult = () =>
    setForm((f) => ({
      ...f,
      caseStudy: f.caseStudy
        ? { ...f.caseStudy, results: [...f.caseStudy.results, { metric: "", label: "" }] }
        : null,
    }));

  const setCsResult = (i: number, key: "metric" | "label", val: string) =>
    setForm((f) => {
      if (!f.caseStudy) return f;
      const results = [...f.caseStudy.results];
      results[i] = { ...results[i], [key]: val };
      return { ...f, caseStudy: { ...f.caseStudy, results } };
    });

  const removeCsResult = (i: number) =>
    setForm((f) => {
      if (!f.caseStudy) return f;
      return {
        ...f,
        caseStudy: { ...f.caseStudy, results: f.caseStudy.results.filter((_, idx) => idx !== i) },
      };
    });

  /* ── Image Upload ── */
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch(`${API}/api/portfolio/upload`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setField("image", data.url);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ── Submit ── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      techStack: techInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      caseStudy: hasCaseStudy && form.caseStudy ? form.caseStudy : null,
    };

    try {
      const url = isEdit
        ? `${API}/api/portfolio/${initial!._id}`
        : `${API}/api/portfolio`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save");
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(6px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{
            background: "rgba(19,19,26,0.9)",
            border: "1px solid rgba(139,92,246,0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-surface-border"
            style={{ background: "rgba(19,19,26,0.95)" }}
          >
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              {isEdit ? "Edit Project" : "Add Project"}
            </h2>
            <button onClick={onClose} className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition">
              <HiX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title + Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="Project Name"
                  className="admin-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Slug *</label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  placeholder="project-name"
                  className="admin-input w-full"
                />
              </div>
            </div>

            {/* Category + Status + Order */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="admin-input w-full"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                  className="admin-input w-full"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setField("order", Number(e.target.value))}
                  className="admin-input w-full"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-muted mb-1.5">Description *</label>
              <textarea
                required
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Brief project description"
                rows={2}
                className="admin-input w-full resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs text-muted mb-1.5">Project Image</label>
              <div className="flex items-center gap-4">
                {form.image ? (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-surface-border">
                    <img
                      src={`${API}${form.image}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setField("image", "")}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-red-500/80 rounded text-white"
                    >
                      <HiX size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted rounded-xl border border-dashed border-white/15 hover:border-primary/30 hover:text-white transition"
                  >
                    <HiPhotograph size={16} />
                    {uploading ? "Uploading…" : "Upload Image"}
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            {/* Tech Stack + Result */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Tech Stack (comma-separated)</label>
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React, Node.js, PostgreSQL"
                  className="admin-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Key Result</label>
                <input
                  value={form.result}
                  onChange={(e) => setField("result", e.target.value)}
                  placeholder="3x engagement increase"
                  className="admin-input w-full"
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
              <input
                id="featured"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setField("featured", e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
              <label htmlFor="featured" className="text-xs text-muted cursor-pointer">
                Mark as Featured Project
              </label>
            </div>

            {/* ── Case Study Section ── */}
            <div className="border-t border-surface-border pt-5">
              <div className="flex items-center gap-2 mb-3">
                <input
                  id="has-cs"
                  type="checkbox"
                  checked={hasCaseStudy}
                  onChange={(e) => {
                    setHasCaseStudy(e.target.checked);
                    if (e.target.checked) ensureCaseStudy();
                  }}
                  className="w-4 h-4 accent-purple-500"
                />
                <label htmlFor="has-cs" className="text-sm text-white font-medium cursor-pointer">
                  Include Case Study
                </label>
              </div>

              {hasCaseStudy && form.caseStudy && (
                <div className="space-y-4 pl-2 border-l-2 border-primary/20 ml-2">
                  {/* Subtitle + Overview */}
                  <div>
                    <label className="block text-xs text-muted mb-1.5">Subtitle</label>
                    <input
                      value={form.caseStudy.subtitle}
                      onChange={(e) => setCsField("subtitle", e.target.value)}
                      placeholder="Case Study — Web Development"
                      className="admin-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">Overview</label>
                    <textarea
                      value={form.caseStudy.overview}
                      onChange={(e) => setCsField("overview", e.target.value)}
                      placeholder="Detailed project overview"
                      rows={2}
                      className="admin-input w-full resize-none"
                    />
                  </div>

                  {/* Problem + Solution */}
                  <div>
                    <label className="block text-xs text-muted mb-1.5">Problem</label>
                    <textarea
                      value={form.caseStudy.problem}
                      onChange={(e) => setCsField("problem", e.target.value)}
                      placeholder="What challenge did the client face?"
                      rows={3}
                      className="admin-input w-full resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">Solution</label>
                    <textarea
                      value={form.caseStudy.solution}
                      onChange={(e) => setCsField("solution", e.target.value)}
                      placeholder="How did StackX solve it?"
                      rows={3}
                      className="admin-input w-full resize-none"
                    />
                  </div>

                  {/* Features list */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-muted">Key Features</label>
                      <button
                        type="button"
                        onClick={addCsFeature}
                        className="flex items-center gap-1 text-xs text-primary-light hover:text-white transition"
                      >
                        <HiPlus size={14} /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.caseStudy.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            value={f}
                            onChange={(e) => setCsFeature(i, e.target.value)}
                            placeholder="Feature description"
                            className="admin-input flex-1"
                          />
                          <button type="button" onClick={() => removeCsFeature(i)} className="p-1.5 text-muted hover:text-red-400 transition">
                            <HiTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Result Metrics */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-muted">Result Metrics</label>
                      <button
                        type="button"
                        onClick={addCsResult}
                        className="flex items-center gap-1 text-xs text-primary-light hover:text-white transition"
                      >
                        <HiPlus size={14} /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.caseStudy.results.map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            value={r.metric}
                            onChange={(e) => setCsResult(i, "metric", e.target.value)}
                            placeholder="3x"
                            className="admin-input w-20"
                          />
                          <input
                            value={r.label}
                            onChange={(e) => setCsResult(i, "label", e.target.value)}
                            placeholder="Engagement Increase"
                            className="admin-input flex-1"
                          />
                          <button type="button" onClick={() => removeCsResult(i)} className="p-1.5 text-muted hover:text-red-400 transition">
                            <HiTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div>
                    <label className="text-xs text-muted mb-2 block">Client Testimonial</label>
                    <div className="space-y-2 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={form.caseStudy.testimonial?.name ?? ""}
                          onChange={(e) =>
                            setCsField("testimonial", { ...(form.caseStudy?.testimonial || { name: "", company: "", feedback: "", rating: 5, projectType: "" }), name: e.target.value })
                          }
                          placeholder="Client name"
                          className="admin-input w-full"
                        />
                        <input
                          value={form.caseStudy.testimonial?.company ?? ""}
                          onChange={(e) =>
                            setCsField("testimonial", { ...(form.caseStudy?.testimonial || { name: "", company: "", feedback: "", rating: 5, projectType: "" }), company: e.target.value })
                          }
                          placeholder="Company"
                          className="admin-input w-full"
                        />
                      </div>
                      <textarea
                        value={form.caseStudy.testimonial?.feedback ?? ""}
                        onChange={(e) =>
                          setCsField("testimonial", { ...(form.caseStudy?.testimonial || { name: "", company: "", feedback: "", rating: 5, projectType: "" }), feedback: e.target.value })
                        }
                        placeholder="What the client said about the project"
                        rows={2}
                        className="admin-input w-full resize-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-muted mb-1">Rating</label>
                          <select
                            value={form.caseStudy.testimonial?.rating ?? 5}
                            onChange={(e) =>
                              setCsField("testimonial", { ...(form.caseStudy?.testimonial || { name: "", company: "", feedback: "", rating: 5, projectType: "" }), rating: Number(e.target.value) })
                            }
                            className="admin-input w-full"
                          >
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-muted mb-1">Project Type</label>
                          <input
                            value={form.caseStudy.testimonial?.projectType ?? ""}
                            onChange={(e) =>
                              setCsField("testimonial", { ...(form.caseStudy?.testimonial || { name: "", company: "", feedback: "", rating: 5, projectType: "" }), projectType: e.target.value })
                            }
                            placeholder="Web Development"
                            className="admin-input w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-white rounded-lg hover:bg-white/5 transition">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#8B5CF6,#6D28D9)", boxShadow: "0 4px 20px rgba(139,92,246,0.25)" }}
              >
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
