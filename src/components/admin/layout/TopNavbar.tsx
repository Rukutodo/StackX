"use client";

import { HiMenuAlt2, HiBell, HiSearch } from "react-icons/hi";

interface TopNavbarProps {
  onMenuToggle: () => void;
}

export default function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-2xl border-b border-surface-border">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: hamburger + search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
            aria-label="Toggle sidebar"
          >
            <HiMenuAlt2 size={22} />
          </button>

          {/* Search */}
          <div className="relative hidden sm:block">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search…"
              className="admin-search w-64 lg:w-80 pl-9 pr-4 py-2 text-sm text-white rounded-xl placeholder:text-muted/60"
            />
          </div>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button
            className="relative p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition"
            aria-label="Notifications"
          >
            <HiBell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full admin-pulse" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-surface-border mx-1" />

          {/* Admin avatar */}
          <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
              SX
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-tight">Admin</p>
              <p className="text-[11px] text-muted leading-tight">admin@stackx.dev</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
