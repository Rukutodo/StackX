"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiMenuAlt2,
  HiBell,
  HiLogout,
  HiKey,
  HiUser,
  HiChevronDown,
  HiX,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";

interface TopNavbarProps {
  onMenuToggle: () => void;
}

const API_BASE = "http://localhost:4000/api/auth";

export default function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("stackx_token");
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch { /* ignore */ }
    window.location.href = "/login";
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-2xl border-b border-surface-border">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Left: hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
              aria-label="Toggle sidebar"
            >
              <HiMenuAlt2 size={22} />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button
              className="relative p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition"
              aria-label="Notifications"
            >
              <HiBell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full admin-pulse" />
            </button>

            <div className="w-px h-8 bg-surface-border mx-1" />

            {/* Admin profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  SX
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white leading-tight">Admin</p>
                  <p className="text-[11px] text-muted leading-tight">admin@stackx.dev</p>
                </div>
                <HiChevronDown
                  size={14}
                  className={`text-muted transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-surface-border overflow-hidden z-50"
                    style={{ background: "rgba(19, 19, 26, 0.95)", backdropFilter: "blur(24px)" }}
                  >
                    {/* Profile info header */}
                    <div className="px-4 py-3 border-b border-surface-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                          SX
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Admin</p>
                          <p className="text-[11px] text-muted">admin@stackx.dev</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setResetModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-white/5 transition cursor-pointer"
                      >
                        <HiKey size={16} />
                        Reset Password
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-white hover:bg-red-500/10 transition cursor-pointer"
                      >
                        <HiLogout size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetModalOpen && (
          <ResetPasswordModal onClose={() => setResetModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Reset Password Modal ─── */
function ResetPasswordModal({ onClose }: { onClose: () => void }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("stackx_token");
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      // Auto-close after 2s
      setTimeout(onClose, 2000);
    } catch {
      setError("Could not connect to server");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
      >
        <div
          className="rounded-2xl border border-surface-border p-6 sm:p-8 mx-4"
          style={{ background: "rgba(19, 19, 26, 0.95)", backdropFilter: "blur(24px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                Reset Password
              </h2>
              <p className="text-xs text-muted mt-1">Enter your current and new password</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
            >
              <HiX size={18} />
            </button>
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <HiCheckCircle size={48} className="text-emerald-400" />
              <p className="text-white font-medium">Password Updated!</p>
              <p className="text-xs text-muted">Your password has been changed successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <HiExclamationCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Old password */}
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 outline-none focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300"
                  style={{
                    background: "rgba(19, 19, 26, 0.6)",
                    border: "1px solid rgba(139, 92, 246, 0.12)",
                  }}
                />
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full px-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 outline-none focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300"
                  style={{
                    background: "rgba(19, 19, 26, 0.6)",
                    border: "1px solid rgba(139, 92, 246, 0.12)",
                  }}
                />
              </div>

              {/* Confirm new password */}
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 outline-none focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300"
                  style={{
                    background: "rgba(19, 19, 26, 0.6)",
                    border: "1px solid rgba(139, 92, 246, 0.12)",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                  boxShadow: "0 4px 24px rgba(139, 92, 246, 0.25)",
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Updating…
                  </>
                ) : (
                  <>
                    <HiKey size={16} />
                    Update Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}
