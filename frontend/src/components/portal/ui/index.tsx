"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowUp, HiArrowDown, HiChevronDown, HiSearch } from "react-icons/hi";

/* ─── Dashboard Glass Card ─── */
interface DashboardGlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function DashboardGlassCard({
  children,
  className = "",
  hover = true,
}: DashboardGlassCardProps) {
  return (
    <div
      className={`admin-glass ${hover ? "" : "hover:border-[rgba(139,92,246,0.12)] hover:shadow-none"} p-6 ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Dashboard Section Header ─── */
interface DashboardSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function DashboardSectionHeader({
  title,
  subtitle,
  action,
}: DashboardSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2
          className="text-xl font-semibold text-white"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* ─── Dashboard Stat Card ─── */
interface DashboardStatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  iconBg?: string;
}

export function DashboardStatCard({
  icon,
  label,
  value,
  trend,
  iconBg = "bg-primary/10",
}: DashboardStatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="admin-glass stat-card-border p-3 sm:p-5"
    >
      {/* Mobile: compact horizontal layout */}
      <div className="flex items-center gap-2.5 sm:hidden">
        <div
          className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center text-primary-light shrink-0 [&>svg]:w-4 [&>svg]:h-4`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p
            className="text-base font-bold text-white leading-tight truncate"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {value}
          </p>
          <p className="text-[10px] text-muted leading-tight truncate">{label}</p>
        </div>
        {trend && (
          <span
            className={`ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
              trend.positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend.positive ? <HiArrowUp className="inline w-2.5 h-2.5" /> : <HiArrowDown className="inline w-2.5 h-2.5" />}{trend.value}%
          </span>
        )}
      </div>

      {/* Desktop: full vertical layout */}
      <div className="hidden sm:block">
        <div className="flex items-start justify-between">
          <div
            className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center text-primary-light`}
          >
            {icon}
          </div>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${
                trend.positive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {trend.positive ? (
                <HiArrowUp className="w-3 h-3" />
              ) : (
                <HiArrowDown className="w-3 h-3" />
              )}
              {trend.value}%
            </span>
          )}
        </div>
        <div className="mt-4">
          <p
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {value}
          </p>
          <p className="text-sm text-muted mt-0.5">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Status Badge ─── */
interface StatusBadgeProps {
  status: "active" | "pending" | "completed" | "archived" | "draft" | "unread" | "read" | "new" | "reviewed" | "rejected";
  label?: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  archived: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  unread: "bg-primary/10 text-primary-light border-primary/20",
  read: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  reviewed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusStyles[status] || statusStyles.draft}`}
    >
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ─── Presence Dot (Teams-style availability) ─── */
const PRESENCE_COLORS: Record<string, string> = {
  available: "#10b981",
  busy: "#ef4444",
  away: "#f59e0b",
  offline: "#9ca3af",
};

const PRESENCE_STALE_MS = 150 * 1000; // heartbeat older than this ⇒ treat as offline

export function PresenceDot({
  presence = "offline",
  lastSeen,
  size = 10,
  ring = "var(--color-surface)",
  className = "",
}: {
  presence?: string;
  lastSeen?: string;
  size?: number;
  ring?: string;
  className?: string;
}) {
  const stale = lastSeen ? Date.now() - new Date(lastSeen).getTime() > PRESENCE_STALE_MS : false;
  const effective = stale ? "offline" : presence;
  return (
    <span
      title={effective.charAt(0).toUpperCase() + effective.slice(1)}
      className={`inline-block rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: PRESENCE_COLORS[effective] || PRESENCE_COLORS.offline,
        boxShadow: `0 0 0 2px ${ring}`,
      }}
    />
  );
}

/* ─── Data Table ─── */
interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="admin-table w-full text-left">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className || ""}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={onRowClick ? "cursor-pointer" : ""}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={col.className || ""}>
                  {col.render
                    ? col.render(row)
                    : (row[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Admin Button ─── */
interface AdminButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  title?: string;
}

const adminBtnVariants: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-primary to-primary-deep text-white hover:shadow-lg hover:shadow-primary/25",
  secondary:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10",
  outline:
    "border border-primary/30 text-primary-light hover:bg-primary/10",
  ghost: "text-muted hover:text-white hover:bg-white/5",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
};

export function AdminButton({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  type = "button",
  disabled = false,
  title,
}: AdminButtonProps) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${adminBtnVariants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ─── Admin Select ─── */
export interface AdminSelectOption {
  label: string;
  value: string;
}

interface AdminSelectProps {
  value: string;
  options: AdminSelectOption[];
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  size?: "sm" | "md";
}

export function AdminSelect({ value, options, onChange, className = "", placeholder, size = "md" }: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Reset the search box whenever the dropdown closes
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const selectedOption = options.find((o) => o.value === value);
  // Show a search box once the list gets long enough to need filtering
  const searchable = options.length > 6;
  const filteredOptions = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const containerClasses = size === "sm"
    ? `flex items-center justify-between bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-primary/50 transition cursor-pointer select-none ${className}`
    : `flex items-center justify-between bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition cursor-pointer select-none ${className}`;

  return (
    <div ref={ref} className="relative w-full">
      <div
        onClick={() => setOpen(!open)}
        className={containerClasses}
      >
        <span className={selectedOption ? "text-white text-sm" : "text-muted text-sm"}>
          {selectedOption ? selectedOption.label : placeholder || "Select..."}
        </span>
        <HiChevronDown
          size={16}
          className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-[var(--color-surface)] shadow-2xl overflow-hidden"
          >
            {searchable && (
              <div className="p-1.5 border-b border-white/10">
                <div className="relative">
                  <HiSearch size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="w-full pl-8 pr-2 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-muted/60 outline-none focus:border-primary/40"
                  />
                </div>
              </div>
            )}
            <div className="max-h-60 overflow-y-auto admin-scroll p-1.5 space-y-0.5">
              {filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition select-none ${
                    value === opt.value
                      ? "bg-primary/20 text-white font-medium"
                      : "text-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {opt.label}
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-3 py-3 text-xs text-muted text-center">No matches</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Filter Dropdown ─── */
interface FilterDropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  className?: string;
}

export function FilterDropdown({ label, value, options, onChange, className = "" }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const searchable = options.length > 6;
  const filteredOptions = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div ref={ref} className={`relative shrink-0 select-none ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200"
        style={{
          background: "var(--color-surface-light)",
          border: "1px solid var(--color-surface-border)",
        }}
      >
        <span className="text-muted text-xs font-semibold uppercase tracking-wider shrink-0">{label}</span>
        <span className="text-white text-sm font-medium">{selected?.label || value}</span>
        <HiChevronDown
          size={14}
          className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-50 min-w-[180px] mt-2 rounded-xl border border-white/10 bg-[var(--color-surface)] shadow-2xl overflow-hidden"
          >
            {searchable && (
              <div className="p-1.5 border-b border-white/10">
                <div className="relative">
                  <HiSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder-muted/60 outline-none focus:border-primary/40"
                  />
                </div>
              </div>
            )}
            <div className="max-h-60 overflow-y-auto admin-scroll p-1.5 space-y-0.5">
              {filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 text-xs rounded-lg cursor-pointer transition ${
                    value === opt.value
                      ? "bg-primary/20 text-white font-medium"
                      : "text-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {opt.label}
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-3 py-3 text-xs text-muted text-center">No matches</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
