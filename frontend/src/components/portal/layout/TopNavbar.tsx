"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiMenuAlt2,
  HiBell,
  HiLogout,
  HiKey,
  HiChevronDown,
  HiX,
  HiCheckCircle,
  HiExclamationCircle,
  HiClipboardList,
  HiSwitchHorizontal,
  HiCalendar,
  HiSun,
  HiMoon,
  HiUser,
} from "react-icons/hi";
import { useAuth, type AuthUser, TOKEN_KEY } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { usePolling } from "@/lib/usePolling";
import { PresenceDot } from "@/components/portal/ui";
import { PRESENCE_META, type Presence, type AppNotification, type NotificationType } from "@/types";

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const NOTIF_ICON: Record<NotificationType, React.ReactNode> = {
  task_assigned: <HiClipboardList size={15} />,
  task_updated: <HiClipboardList size={15} />,
  task_moved: <HiSwitchHorizontal size={15} />,
  leave_requested: <HiCalendar size={15} />,
  leave_decision: <HiCalendar size={15} />,
};

function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await api<{ items: AppNotification[]; unread: number }>("/api/notifications");
      setItems(data.items || []);
      setUnread(data.unread || 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  usePolling(load, 20000);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      setUnread(0);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      try {
        await api("/api/notifications/read-all", { method: "PATCH" });
      } catch {
        /* ignore */
      }
    }
  };

  const openItem = (n: AppNotification) => {
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="relative p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
        aria-label="Notifications"
      >
        <HiBell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 text-[10px] font-bold bg-primary text-white rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-surface-border overflow-hidden z-50"
            style={{ background: "var(--color-surface)", backdropFilter: "blur(24px)" }}
          >
            <div className="px-4 py-3 border-b border-surface-border">
              <p className="text-sm font-semibold text-white">Notifications</p>
            </div>
            <div className="max-h-96 overflow-y-auto admin-scroll">
              {items.length === 0 ? (
                <p className="text-sm text-muted text-center py-10">You&apos;re all caught up.</p>
              ) : (
                items.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => openItem(n)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 transition hover:bg-white/[0.03] ${
                      n.read ? "" : "bg-primary/[0.05]"
                    }`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary-light flex items-center justify-center shrink-0">
                      {NOTIF_ICON[n.type]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-white leading-snug">{n.message}</span>
                      <span className="block text-[10px] text-muted mt-1">{timeAgo(n.createdAt)}</span>
                    </span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TopNavbarProps {
  onMenuToggle: () => void;
  user?: AuthUser | null;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/auth";

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("devportal_theme", next);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <HiSun size={20} /> : <HiMoon size={20} />}
    </button>
  );
}

export default function TopNavbar({ onMenuToggle, user }: TopNavbarProps) {
  const { logout, presence, updatePresence } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || "User";
  const roleName = user?.role?.name || "Employee";
  const initials = user?.name ? getInitials(user.name) : "U";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-2xl border-b border-surface-border">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
              aria-label="Toggle sidebar"
            >
              <HiMenuAlt2 size={22} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />

            <div className="w-px h-8 bg-surface-border mx-1" />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition cursor-pointer"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <PresenceDot presence={presence} size={10} className="absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white leading-tight">{displayName}</p>
                  <p className="text-[11px] text-muted leading-tight">{roleName}</p>
                </div>
                <HiChevronDown
                  size={14}
                  className={`text-muted transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-surface-border overflow-hidden z-50"
                    style={{ background: "var(--color-surface)", backdropFilter: "blur(24px)" }}
                  >
                    <div className="px-4 py-3 border-b border-surface-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                          <p className="text-[11px] text-muted">{roleName}</p>
                          {user?.managerName && (
                            <p className="text-[11px] text-muted mt-0.5">Reports to {user.managerName}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Presence picker */}
                    <div className="px-3 py-2.5 border-b border-surface-border">
                      <p className="text-[10px] text-muted uppercase tracking-wider px-1 mb-1.5">Set status</p>
                      <div className="grid grid-cols-2 gap-1">
                        {(Object.keys(PRESENCE_META) as Presence[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => updatePresence(p)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                              presence === p ? "bg-primary/15 text-white" : "text-muted hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PRESENCE_META[p].color }} />
                            {PRESENCE_META[p].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="py-1.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-white/5 transition cursor-pointer"
                      >
                        <HiUser size={16} />
                        Edit Profile
                      </button>
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
                        onClick={logout}
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

      <AnimatePresence>
        {resetModalOpen && <ResetPasswordModal onClose={() => setResetModalOpen(false)} />}
        {profileModalOpen && <ProfileModal user={user} onClose={() => setProfileModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function ProfileModal({ user, onClose }: { user?: AuthUser | null; onClose: () => void }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputStyle = { background: "var(--color-surface)", border: "1px solid rgba(139, 92, 246, 0.12)" };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");
    setLoading(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await fetch(`${API_BASE}/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to update profile");
        setLoading(false);
        return;
      }
      setSuccess(true);
      // Reload so the updated name/email propagate everywhere
      setTimeout(() => window.location.reload(), 900);
    } catch {
      setError("Could not connect to server");
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
      >
        <div className="rounded-2xl border border-surface-border p-6 sm:p-8 mx-4" style={{ background: "var(--color-surface)", backdropFilter: "blur(24px)" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Edit Profile</h2>
              <p className="text-xs text-muted mt-1">Update your name, email, and phone. Role &amp; reporting are set by your admin.</p>
            </div>
            <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"><HiX size={18} /></button>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <HiCheckCircle size={48} className="text-emerald-400" />
              <p className="text-white font-medium">Profile Updated!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Read-only org info (set by admin) */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {user?.role?.name && (
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20">{user.role.name}</span>
                )}
                {user?.managerName && (
                  <span className="text-muted">Reports to <span className="text-white">{user.managerName}</span></span>
                )}
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <HiExclamationCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                  className="w-full px-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 outline-none focus:border-[rgba(139,92,246,0.45)] transition" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                  className="w-full px-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 outline-none focus:border-[rgba(139,92,246,0.45)] transition" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Phone <span className="text-muted font-normal">(optional)</span></label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000"
                  className="w-full px-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 outline-none focus:border-[rgba(139,92,246,0.45)] transition" style={inputStyle} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 text-sm font-semibold text-white rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
                {loading ? "Saving…" : (<><HiUser size={16} /> Save Profile</>)}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}

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
    if (!oldPassword || !newPassword || !confirmPassword) return setError("All fields are required");
    if (newPassword.length < 6) return setError("New password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setError("New passwords do not match");

    setLoading(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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
      setTimeout(onClose, 2000);
    } catch {
      setError("Could not connect to server");
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "var(--color-surface)",
    border: "1px solid rgba(139, 92, 246, 0.12)",
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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
      >
        <div
          className="rounded-2xl border border-surface-border p-6 sm:p-8 mx-4"
          style={{ background: "var(--color-surface)", backdropFilter: "blur(24px)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                Reset Password
              </h2>
              <p className="text-xs text-muted mt-1">Enter your current and new password</p>
            </div>
            <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer">
              <HiX size={18} />
            </button>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <HiCheckCircle size={48} className="text-emerald-400" />
              <p className="text-white font-medium">Password Updated!</p>
              <p className="text-xs text-muted">Your password has been changed successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <HiExclamationCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 outline-none focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full px-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 outline-none focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 text-sm text-white rounded-xl placeholder:text-muted/50 outline-none focus:border-[rgba(139,92,246,0.45)] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300"
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 4px 24px rgba(139, 92, 246, 0.25)" }}
              >
                {loading ? "Updating…" : (<><HiKey size={16} /> Update Password</>)}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}
