"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiPlus, HiTrash } from "react-icons/hi";

interface JobData {
  _id?: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  status: string;
  order: number;
}

interface Props {
  initial?: JobData | null;
  onClose: () => void;
  onSaved: () => void;
}

const API = "http://129.159.236.176:4000";

const DEPARTMENTS = ["Engineering", "Design", "Automation", "Marketing", "Operations"];
const TYPES = ["Full-time", "Full-time / Contract", "Contract", "Internship", "Part-time"];

export default function JobPostingModal({ initial, onClose, onSaved }: Props) {
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<JobData>({
    title: "",
    department: "Engineering",
    type: "Full-time",
    location: "Remote",
    description: "",
    requirements: [],
    status: "active",
    order: 0,
    ...initial,
  });

  const setField = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const addReq = () => setForm((f) => ({ ...f, requirements: [...f.requirements, ""] }));
  const setReq = (i: number, val: string) => {
    const reqs = [...form.requirements];
    reqs[i] = val;
    setForm((f) => ({ ...f, requirements: reqs }));
  };
  const removeReq = (i: number) =>
    setForm((f) => ({ ...f, requirements: f.requirements.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isEdit ? `${API}/api/jobs/${initial!._id}` : `${API}/api/jobs`;
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
          className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl"
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
              {isEdit ? "Edit Job" : "Post New Job"}
            </h2>
            <button onClick={onClose} className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition">
              <HiX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs text-muted mb-1.5">Job Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Senior Full-Stack Developer"
                className="admin-input w-full"
              />
            </div>

            {/* Department + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Department *</label>
                <select value={form.department} onChange={(e) => setField("department", e.target.value)} className="admin-input w-full">
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Job Type *</label>
                <select value={form.type} onChange={(e) => setField("type", e.target.value)} className="admin-input w-full">
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location + Status + Order */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Location *</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="Remote"
                  className="admin-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setField("status", e.target.value)} className="admin-input w-full">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
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
                placeholder="Describe the role..."
                rows={3}
                className="admin-input w-full resize-none"
              />
            </div>

            {/* Requirements */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted">Requirements</label>
                <button
                  type="button"
                  onClick={addReq}
                  className="flex items-center gap-1 text-xs text-primary-light hover:text-white transition"
                >
                  <HiPlus size={14} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {form.requirements.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={r}
                      onChange={(e) => setReq(i, e.target.value)}
                      placeholder="Requirement..."
                      className="admin-input flex-1"
                    />
                    <button type="button" onClick={() => removeReq(i)} className="p-1.5 text-muted hover:text-red-400 transition">
                      <HiTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
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
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Post Job"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
