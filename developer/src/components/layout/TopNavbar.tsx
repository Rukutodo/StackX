"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt2, HiLogout, HiChevronDown } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/lib/types";

interface TopNavbarProps {
  onMenuToggle: () => void;
  user?: AuthUser | null;
}

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function capitalize(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export default function TopNavbar({ onMenuToggle, user }: TopNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const displayName = user?.name || (user?.username ? capitalize(user.username) : "User");
  const initials = getInitials(displayName);
  const roleLabel = user?.role ? capitalize(user.role) : "Developer";

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
    <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-2xl border-b border-surface-border">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
          aria-label="Toggle sidebar"
        >
          <HiMenuAlt2 size={22} />
        </button>
        <div className="flex-1" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-tight">{displayName}</p>
              <p className="text-[11px] text-muted leading-tight">{roleLabel}</p>
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
                style={{ background: "rgba(19, 19, 26, 0.95)", backdropFilter: "blur(24px)" }}
              >
                <div className="px-4 py-3 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{displayName}</p>
                      <p className="text-[11px] text-muted">{roleLabel}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1.5">
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
    </header>
  );
}
