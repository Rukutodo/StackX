"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiPlus, HiTrash } from "react-icons/hi";
import type { ServiceCategory } from "@/types/services";
import { ICON_MAP } from "@/types/services";

interface Props {
  initial?: ServiceCategory | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY: Omit<ServiceCategory, "_id" | "status"> & { status: string } = {
  slug: "",
  title: "",
  tagline: "",
  pricing: "",
  icon: "HiCode",
  techStack: [],
  items: [],
  caseStudy: null,
  status: "active",
  order: 0,
  pageType: "auto",
  featuredProjects: [],
  testimonials: [],
};

export default function ServiceCategoryModal({ initial, onClose, onSaved }: Props) {
  const isEdit = !!initial;

  /* ── Form state ── */
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [techStackInput, setTechStackInput] = useState(initial?.techStack.join(", ") ?? "");
  const [hasCaseStudy, setHasCaseStudy] = useState(!!initial?.caseStudy);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from title when creating
  useEffect(() => {
    if (!isEdit) {
      setForm((f) => ({ ...f, slug: f.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }));
    }
  }, [form.title, isEdit]);

  const setField = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  /* ── Items helpers ── */
  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, { title: "", desc: "" }] }));
  const removeItem = (i: number) => setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
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

    const payload = {
      ...form,
      techStack: techStackInput.split(",").map((s) => s.trim()).filter(Boolean),
      caseStudy: hasCaseStudy && form.caseStudy?.title ? form.caseStudy : null,
    };

    try {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/services/${initial!._id}`
        : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/services";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`
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

  /* ── JSX ── */
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
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-surface-border"
            style={{ background: "rgba(19,19,26,0.95)" }}>
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              {isEdit ? "Edit Service Category" : "Add Service Category"}
            </h2>
            <button onClick={onClose} className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition">
              <HiX size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Row: Title + Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Title *</label>
                <input
                  required value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="Web Development"
                  className="admin-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Slug *</label>
                <input
                  required value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  placeholder="web-development"
                  className="admin-input w-full"
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs text-muted mb-1.5">Tagline *</label>
              <input
                required value={form.tagline}
                onChange={(e) => setField("tagline", e.target.value)}
                placeholder="Custom-built digital experiences"
                className="admin-input w-full"
              />
            </div>

            {/* Row: Pricing + Order + Status */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Starting Price *</label>
                <input
                  required value={form.pricing}
                  onChange={(e) => setField("pricing", e.target.value)}
                  placeholder="$3,000"
                  className="admin-input w-full"
                />
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
              <div>
                <label className="block text-xs text-muted mb-1.5">Status</label>
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

            {/* Icon Picker */}
            <div>
              <label className="block text-xs text-muted mb-2">Icon</label>
              <div className="grid grid-cols-9 gap-1.5">
                {Object.keys(ICON_MAP).map((name) => {
                  const Ic = ICON_MAP[name];
                  const selected = form.icon === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => setField("icon", name)}
                      className="p-2 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: selected ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.03)",
                        border: selected ? "1px solid rgba(139,92,246,0.7)" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Ic className={`w-4 h-4 ${selected ? "text-purple-400" : "text-muted"}`} />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted mt-1 opacity-60">Selected: {form.icon ?? "HiCode"}</p>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-xs text-muted mb-1.5">Tech Stack (comma-separated)</label>
              <input
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="React, Next.js, TypeScript, Node.js"
                className="admin-input w-full"
              />
            </div>

            {/* Accordion Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted">Accordion Items</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 text-xs text-primary-light hover:text-white transition"
                >
                  <HiPlus size={14} /> Add Item
                </button>
              </div>
              <div className="space-y-3">
                {form.items.map((item, i) => (
                  <div key={i} className="rounded-xl p-3 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2">
                      <input
                        value={item.title}
                        onChange={(e) => setItemField(i, "title", e.target.value)}
                        placeholder="Item title"
                        className="admin-input flex-1"
                      />
                      <button type="button" onClick={() => removeItem(i)} className="p-1.5 text-muted hover:text-red-400 transition rounded-lg">
                        <HiTrash size={14} />
                      </button>
                    </div>
                    <textarea
                      value={item.desc}
                      onChange={(e) => setItemField(i, "desc", e.target.value)}
                      placeholder="Item description"
                      rows={2}
                      className="admin-input w-full resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Case Study */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="has-case-study"
                  type="checkbox"
                  checked={hasCaseStudy}
                  onChange={(e) => setHasCaseStudy(e.target.checked)}
                  className="w-4 h-4 accent-purple-500"
                />
                <label htmlFor="has-case-study" className="text-xs text-muted cursor-pointer">Include Case Study link</label>
              </div>
              {hasCaseStudy && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    value={form.caseStudy?.title ?? ""}
                    onChange={(e) => setField("caseStudy", { ...form.caseStudy, title: e.target.value })}
                    placeholder="Case study title"
                    className="admin-input w-full"
                  />
                  <input
                    value={form.caseStudy?.href ?? ""}
                    onChange={(e) => setField("caseStudy", { ...form.caseStudy, href: e.target.value })}
                    placeholder="/portfolio/my-project"
                    className="admin-input w-full"
                  />
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
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
