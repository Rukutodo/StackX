"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiViewGrid,
  HiViewBoards,
  HiClipboardList,
  HiCalendar,
  HiChartBar,
  HiUserGroup,
  HiShieldCheck,
  HiX,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/types";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  permission?: string;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Dashboard", icon: HiViewGrid },
  { href: "/board", label: "Kanban Board", icon: HiViewBoards },
  { href: "/tasks", label: "Tasks", icon: HiClipboardList },
  { href: "/leaves", label: "Leaves", icon: HiCalendar },
  { href: "/analytics", label: "Analytics", icon: HiChartBar },
  { href: "/team", label: "Team", icon: HiUserGroup, permission: PERMISSIONS.USERS_MANAGE },
  { href: "/roles", label: "Roles", icon: HiShieldCheck, permission: PERMISSIONS.ROLES_MANAGE },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  role: string;
}

export default function Sidebar({ mobileOpen, onClose, role }: SidebarProps) {
  const pathname = usePathname();
  const { can } = useAuth();

  const links = navLinks.filter((l) => !l.permission || can(l.permission));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 h-16 border-b border-surface-border shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/stackx.svg" alt="StackX" width={120} height={32} className="h-7 w-auto" />
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
          aria-label="Close sidebar"
        >
          <HiX size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto admin-scroll py-4 px-3">
        <div className="space-y-0.5">
          {links.map((link) => {
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
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-surface-border shrink-0">
        <div className="admin-glass p-3 rounded-xl">
          <p className="text-xs text-muted">Developer Portal</p>
          <p className="text-xs text-primary-light font-medium mt-0.5 capitalize">{role}</p>
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
