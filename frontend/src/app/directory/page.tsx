"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiSearch, HiUserGroup, HiMail, HiOfficeBuilding } from "react-icons/hi";
import { DashboardGlassCard, FilterDropdown, PresenceDot } from "@/components/portal/ui";
import { api } from "@/lib/api";
import { usePolling } from "@/lib/usePolling";
import type { PortalUser, Role } from "@/types";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function DirectoryPage() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDept, setFilterDept] = useState("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<PortalUser[]>("/api/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load directory:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Silent refresh (no skeleton flash) — keeps presence dots fresh
  usePolling(() => {
    api<PortalUser[]>("/api/users").then((d) => setUsers(Array.isArray(d) ? d : [])).catch(() => {});
  }, 30000);

  useEffect(() => {
    fetchUsers();
    api<Role[]>("/api/roles").then((d) => setRoles(Array.isArray(d) ? d : [])).catch(() => {});
    api<string[]>("/api/users/departments").then((d) => setDepartments(Array.isArray(d) ? d : [])).catch(() => {});
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.jobTitle || "").toLowerCase().includes(q) ||
      (u.department || "").toLowerCase().includes(q);
    const matchesRole = filterRole === "all" || u.roleId?._id === filterRole;
    const matchesDept = filterDept === "all" || u.department === filterDept;
    return matchesSearch && matchesRole && matchesDept && u.status === "active";
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          Directory
        </h1>
        <p className="text-muted text-sm mt-1">Find anyone across the organization</p>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] group">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <HiSearch size={16} className="text-muted group-focus-within:text-primary-light transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, title or department…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-muted/50 outline-none transition-all"
              style={{ background: "var(--color-surface-light)", border: "1px solid var(--color-surface-border)" }}
            />
          </div>
          <FilterDropdown
            label="Role"
            value={filterRole}
            onChange={setFilterRole}
            options={[{ label: "All", value: "all" }, ...roles.map((r) => ({ label: r.name, value: r._id }))]}
          />
          <FilterDropdown
            label="Dept"
            value={filterDept}
            onChange={setFilterDept}
            options={[{ label: "All", value: "all" }, ...departments.map((d) => ({ label: d, value: d }))]}
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-32 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <DashboardGlassCard>
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HiUserGroup size={24} className="text-primary-light" />
            </div>
            <p className="text-white font-medium mb-1">No people found</p>
            <p className="text-sm text-muted">Try a different search or filter.</p>
          </div>
        </DashboardGlassCard>
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u) => (
            <div
              key={u._id}
              className="rounded-xl border border-white/[0.08] p-5 hover:border-purple-500/20 hover:bg-white/[0.02] transition"
              style={{ background: "var(--color-surface)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-base font-bold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <PresenceDot presence={u.presence} lastSeen={u.lastSeen} size={12} className="absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{u.name}</p>
                  <p className="text-xs text-muted truncate">{u.jobTitle || u.roleId?.name || "Employee"}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted">
                <p className="flex items-center gap-2 truncate"><HiMail size={13} className="shrink-0" /> {u.email}</p>
                {u.department && <p className="flex items-center gap-2"><HiOfficeBuilding size={13} className="shrink-0" /> {u.department}</p>}
              </div>
              <div className="flex items-center gap-2 mt-3">
                {u.roleId && (
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary-light rounded-full border border-primary/20">{u.roleId.name}</span>
                )}
                {u.managerId && <span className="text-[10px] text-muted">Reports to {u.managerId.name}</span>}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
