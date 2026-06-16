"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";
import { AdminButton, AdminSelect } from "@/components/ui";
import { api } from "@/lib/api";
import { LEAVE_TYPES } from "@/lib/types";
import type { LeaveType } from "@/lib/types";

export default function LeaveModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [type, setType] = useState<LeaveType>("vacation");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError("Start and end dates are required");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.post("/leaves", { type, startDate, endDate, reason });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
      >
        <div
          className="rounded-2xl border border-surface-border p-6 sm:p-8"
          style={{ background: "rgba(19, 19, 26, 0.97)", backdropFilter: "blur(24px)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Request Leave
            </h2>
            <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer">
              <HiX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}

            <div>
              <label className="block text-sm text-white font-medium mb-1.5">Type</label>
              <AdminSelect
                value={type}
                onChange={(v) => setType(v as LeaveType)}
                options={LEAVE_TYPES.map((t) => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">From</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">To</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="admin-input w-full" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white font-medium mb-1.5">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Optional note for your manager"
                className="admin-input w-full resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AdminButton variant="ghost" onClick={onClose} type="button">Cancel</AdminButton>
              <AdminButton variant="primary" type="submit" disabled={saving}>
                {saving ? "Submitting…" : "Submit Request"}
              </AdminButton>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
