"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiExclamation, HiX, HiTrash } from "react-icons/hi";

interface DeleteConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  itemLabel?: string; // e.g. name of the item being deleted
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteConfirmModal({
  open,
  title = "Delete this item?",
  description = "This action cannot be undone. The item will be permanently removed.",
  itemLabel,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.90, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-sm rounded-2xl border border-red-500/20 p-6 shadow-2xl"
              style={{ background: "rgba(19,13,13,0.97)", backdropFilter: "blur(24px)" }}
            >
              {/* Close */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                <HiX className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <HiExclamation className="w-6 h-6 text-red-400" />
              </div>

              {/* Text */}
              <h2 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-poppins, sans-serif)" }}>
                {title}
              </h2>

              {itemLabel && (
                <p className="text-xs text-gray-500 mb-1">
                  You are about to delete:&nbsp;
                  <span className="text-white font-semibold">&ldquo;{itemLabel}&rdquo;</span>
                </p>
              )}

              <p className="text-sm text-gray-400 leading-relaxed mb-6">{description}</p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-300 rounded-xl border border-white/[0.08] hover:bg-white/5 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 4px 16px rgba(239,68,68,0.3)" }}
                >
                  <HiTrash className="w-4 h-4" />
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
