"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowUp, HiArrowDown, HiChevronDown } from "react-icons/hi";

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
            {trend.positive ? "↑" : "↓"}{trend.value}%
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
}

export function AdminSelect({ value, options, onChange, className = "", placeholder }: AdminSelectProps) {
  const [open, setOpen] = useState(false);
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

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <div
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition cursor-pointer select-none ${className}`}
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
            className="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-[#13131A] shadow-2xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto admin-scroll p-1.5 space-y-0.5">
              {options.map((opt) => (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
