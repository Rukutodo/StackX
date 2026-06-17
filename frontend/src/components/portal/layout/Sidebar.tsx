"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiViewGrid,
  HiViewBoards,
  HiCalendar,
  HiUsers,
  HiChartBar,
  HiUserGroup,
  HiShieldCheck,
  HiX,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";

interface NavLink {
  href: string;
  label: string;
  icon: typeof HiViewGrid;
  /** User needs ANY of these permissions to see the link. */
  perms: string[];
}

const sidebarLinks: NavLink[] = [
  { href: "/", label: "Dashboard", icon: HiViewGrid, perms: ["dashboard.view"] },
  { href: "/tasks", label: "Kanban Board", icon: HiViewBoards, perms: ["tasks.view.own", "tasks.view.team", "tasks.view.all"] },
  { href: "/leave", label: "Leave", icon: HiCalendar, perms: ["leave.apply", "leave.view.own", "leave.view.team", "leave.approve"] },
  { href: "/directory", label: "Directory", icon: HiUserGroup, perms: ["directory.view"] },
  { href: "/analytics", label: "Analytics", icon: HiChartBar, perms: [] },
  { href: "/admin/users", label: "Users", icon: HiUsers, perms: ["users.view"] },
  { href: "/admin/roles", label: "Roles", icon: HiShieldCheck, perms: ["roles.view", "roles.manage"] },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Links with no perms are visible to every authenticated user
  const visibleLinks = sidebarLinks.filter((l) => l.perms.length === 0 || l.perms.some((p) => hasPermission(p)));

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-surface-border shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/stackx.svg" alt="Employee Portal" width={120} height={32} className="h-7 w-auto" />
        </Link>
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
          {visibleLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active ? "sidebar-nav-active bg-primary/10 text-white" : "sidebar-nav-item text-muted hover:text-white"}`}
              >
                <link.icon size={18} className={`sidebar-icon shrink-0 ${active ? "text-primary-light" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-surface-border shrink-0">
        <div className="admin-glass p-3 rounded-xl">
          <p className="text-xs text-muted">Employee Portal</p>
          <p className="text-xs text-primary-light font-medium mt-0.5">v1.0.0</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[260px] bg-surface/90 backdrop-blur-xl border-r border-surface-border z-40">
        {sidebarContent}
      </aside>

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
