"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiViewGrid,
  HiCube,
  HiPhotograph,
  HiStar,
  HiUserGroup,
  HiBriefcase,
  HiMail,
  HiDocumentText,
  HiCollection,
  HiCog,
  HiX,
} from "react-icons/hi";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: HiViewGrid },
  { href: "/admin/services", label: "Services", icon: HiCube },
  { href: "/admin/portfolio", label: "Portfolio", icon: HiPhotograph },
  { href: "/admin/testimonials", label: "Testimonials", icon: HiStar },
  { href: "/admin/team", label: "Team", icon: HiUserGroup },
  { href: "/admin/jobs", label: "Jobs", icon: HiBriefcase },
  { href: "/admin/messages", label: "Messages", icon: HiMail },
  { href: "/admin/applications", label: "Applications", icon: HiDocumentText },
  { href: "/admin/media", label: "Media", icon: HiCollection },
  { href: "/admin/settings", label: "Settings", icon: HiCog },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-surface-border shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/stackx.svg"
            alt="StackX"
            width={120}
            height={32}
            className="h-7 w-auto"
          />
        </Link>

        {/* Mobile close */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
          aria-label="Close sidebar"
        >
          <HiX size={20} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto admin-scroll py-4 px-3">
        <div className="space-y-0.5">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "sidebar-nav-active bg-primary/10 text-white"
                    : "sidebar-nav-item text-muted hover:text-white"
                  }`}
              >
                <link.icon
                  size={18}
                  className={`sidebar-icon shrink-0 ${active ? "text-primary-light" : ""}`}
                />
                {link.label}

                {/* Notification dot for Messages */}
                {link.label === "Messages" && (
                  <span className="ml-auto w-5 h-5 text-[10px] font-bold bg-primary/20 text-primary-light rounded-full flex items-center justify-center">
                    3
                  </span>
                )}
                {link.label === "Applications" && (
                  <span className="ml-auto w-5 h-5 text-[10px] font-bold bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center">
                    5
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-surface-border shrink-0">
        <div className="admin-glass p-3 rounded-xl">
          <p className="text-xs text-muted">Admin Panel</p>
          <p className="text-xs text-primary-light font-medium mt-0.5">v1.0.0 — Frontend Only</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[260px] bg-surface/90 backdrop-blur-xl border-r border-surface-border z-40">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[260px] bg-surface border-r border-surface-border z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
