"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiX, HiSave, HiCheck, HiSearch, HiUsers } from "react-icons/hi";
import {
  DashboardGlassCard,
  StatusBadge,
  AdminButton,
  AdminSelect,
  FilterDropdown,
  PresenceDot,
} from "@/components/portal/ui";
import { DeleteConfirmModal } from "@/components/portal/DeleteConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { usePolling } from "@/lib/usePolling";
import type { PortalUser, Role } from "@/types";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface FormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  roleId: string;
  managerId: string;
  department: string;
  jobTitle: string;
  status: "active" | "inactive";
}

const EMPTY: FormState = {
  name: "", email: "", password: "", phone: "", roleId: "", managerId: "",
  department: "", jobTitle: "", status: "active",
};

function EditPanel({
  editing,
  roles,
  users,
  onClose,
  onSaved,
}: {
  editing: PortalUser | null;
  roles: Role[];
  users: PortalUser[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState<FormState>(
    editing
      ? {
          name: editing.name,
          email: editing.email,
          password: "",
          phone: editing.phone || "",
          roleId: editing.roleId?._id || "",
          managerId: editing.managerId?._id || "",
          department: editing.department,
          jobTitle: editing.jobTitle,
          status: editing.status,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.roleId || (!isEdit && !form.password)) {
      setError("Name, email, role" + (isEdit ? "" : ", and password") + " are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        roleId: form.roleId,
        managerId: form.managerId || null,
        department: form.department,
        jobTitle: form.jobTitle,
        phone: form.phone,
        status: form.status,
      };
      if (form.password) payload.password = form.password;

      await api(isEdit ? `/api/users/${editing!._id}` : "/api/users", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setSaved(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 700);
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  // Managers can't be the user being edited
  const managerOptions = [
    { label: "No manager", value: "" },
    ...users
      .filter((u) => u._id !== editing?._id)
      .map((u) => ({ label: `${u.name} (${u.roleId?.name || "—"})`, value: u._id })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full lg:w-[420px] shrink-0"
    >
      <DashboardGlassCard className="sticky top-6 max-h-[calc(100vh-5rem)] overflow-y-auto admin-scroll">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-border">
          <div>
            <h3 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              {isEdit ? "Edit User" : "Add User"}
            </h3>
            {isEdit && <p className="text-xs text-muted mt-0.5">{editing!.email}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition">
            <HiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Full Name *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" className="admin-input w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@company.com" className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 000 0000" className="admin-input w-full" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">{isEdit ? "New Password (optional)" : "Password *"}</label>
            <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder={isEdit ? "Leave blank to keep current" : "Min 6 characters"} className="admin-input w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Role *</label>
              <AdminSelect
                value={form.roleId}
                onChange={(v) => set("roleId", v)}
                placeholder="Select role"
                size="sm"
                options={roles.map((r) => ({ label: r.name, value: r._id }))}
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Status</label>
              <AdminSelect
                value={form.status}
                onChange={(v) => set("status", v as "active" | "inactive")}
                size="sm"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Department</label>
              <input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="Engineering" className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Job Title</label>
              <input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="Developer" className="admin-input w-full" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Reports To (Manager)</label>
            <AdminSelect value={form.managerId} onChange={(v) => set("managerId", v)} placeholder="No manager" size="sm" options={managerOptions} />
          </div>

          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <HiX className="w-3.5 h-3.5 shrink-0" /> {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm text-muted hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || saved}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-60"
              style={{
                background: saved ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#8B5CF6,#6D28D9)",
                boxShadow: "0 4px 16px rgba(139,92,246,0.25)",
              }}
            >
              {saved ? (<><HiCheck size={14} /> Saved!</>) : saving ? "Saving..." : (<><HiSave size={14} />{isEdit ? "Save Changes" : "Add User"}</>)}
            </button>
          </div>
        </form>
      </DashboardGlassCard>
    </motion.div>
  );
}

export default function UsersAdminPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [panelTarget, setPanelTarget] = useState<PortalUser | null | "new">(undefined as never);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canCreate = hasPermission("users.create");
  const canEdit = hasPermission("users.edit");
  const canDelete = hasPermission("users.delete");

  const panelOpen = panelTarget !== (undefined as never);
  const editingItem = panelTarget === "new" ? null : (panelTarget as PortalUser | null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<PortalUser[]>("/api/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    api<Role[]>("/api/roles").then((d) => setRoles(Array.isArray(d) ? d : [])).catch(() => {});
    api<string[]>("/api/users/departments").then((d) => setDepartments(Array.isArray(d) ? d : [])).catch(() => {});
  }, [fetchUsers]);

  // Silent refresh to keep presence dots current (no skeleton flash, paused while editing)
  usePolling(() => {
    api<PortalUser[]>("/api/users").then((d) => setUsers(Array.isArray(d) ? d : [])).catch(() => {});
  }, 30000, !panelOpen);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`/api/users/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      if ((panelTarget as PortalUser)?._id === deleteTarget.id) setPanelTarget(undefined as never);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      alert((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const filtered = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.jobTitle || "").toLowerCase().includes(q);
    const matchesRole = filterRole === "all" || u.roleId?._id === filterRole;
    const matchesDept = filterDept === "all" || u.department === filterDept;
    const matchesStatus = filterStatus === "all" || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === "active").length;

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Users
            </h1>
            <p className="text-muted text-sm mt-1">Manage employees, roles, and reporting lines</p>
          </div>
          {canCreate && (
            <AdminButton variant="primary" className="gap-1.5" onClick={() => setPanelTarget("new")}>
              <HiPlus size={16} /> Add User
            </AdminButton>
          )}
        </motion.div>

        <motion.div variants={item}>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <HiSearch size={16} className="text-muted group-focus-within:text-primary-light transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or title…"
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
            <FilterDropdown
              label="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-3 gap-3 sm:gap-4">
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{users.length}</p>
            <p className="text-sm text-muted mt-1">Total</p>
          </DashboardGlassCard>
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{activeCount}</p>
            <p className="text-sm text-muted mt-1">Active</p>
          </DashboardGlassCard>
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{roles.length}</p>
            <p className="text-sm text-muted mt-1">Roles</p>
          </DashboardGlassCard>
        </motion.div>

        <motion.div variants={item} className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <DashboardGlassCard>
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <HiUsers size={24} className="text-primary-light" />
                  </div>
                  <p className="text-white font-medium mb-1">{users.length === 0 ? "No users yet" : "No results found"}</p>
                  <p className="text-sm text-muted">{users.length === 0 ? "Add your first employee." : "Try a different search or filter."}</p>
                </div>
              </DashboardGlassCard>
            ) : (
              <div className="space-y-3">
                {filtered.map((u) => {
                  const isSelected = (panelTarget as PortalUser)?._id === u._id;
                  return (
                    <div
                      key={u._id}
                      onClick={() => canEdit && setPanelTarget(isSelected ? (undefined as never) : u)}
                      className={`rounded-xl border transition-all duration-200 ${canEdit ? "cursor-pointer" : ""} group ${
                        isSelected
                          ? "border-purple-500/40 bg-purple-500/[0.06] shadow-lg shadow-purple-500/10"
                          : "border-white/[0.08] hover:border-purple-500/20 hover:bg-white/[0.02]"
                      }`}
                      style={{ background: isSelected ? undefined : "var(--color-surface)", backdropFilter: "blur(12px)" }}
                    >
                      <div className="flex items-center gap-4 p-4 sm:p-5">
                        <div className="relative shrink-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white ${isSelected ? "bg-purple-600" : "bg-gradient-to-br from-primary to-accent"}`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <PresenceDot presence={u.presence} lastSeen={u.lastSeen} size={11} className="absolute -bottom-0.5 -right-0.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <p className="text-white font-medium text-sm">{u.name}</p>
                              <p className="text-xs text-muted">{u.email}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {u.roleId && (
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary-light rounded-full border border-primary/20">
                                  {u.roleId.name}
                                </span>
                              )}
                              <StatusBadge status={u.status} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                            <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted">
                              {u.jobTitle && <span>{u.jobTitle}</span>}
                              {u.department && <span>· {u.department}</span>}
                              {u.managerId && <span>· Reports to {u.managerId.name}</span>}
                              <span>· {formatDate(u.createdAt)}</span>
                            </div>
                            {(canEdit || canDelete) && (
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                {canEdit && (
                                  <button
                                    onClick={() => setPanelTarget(isSelected ? (undefined as never) : u)}
                                    className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                                    title="Edit"
                                  >
                                    <HiPencil size={13} />
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    onClick={() => setDeleteTarget({ id: u._id, label: u.name })}
                                    className="p-1.5 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/5"
                                    title="Delete"
                                  >
                                    <HiTrash size={13} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {panelOpen && (canCreate || canEdit) && (
              <EditPanel
                key={panelTarget === "new" ? "new" : (panelTarget as PortalUser)?._id}
                editing={editingItem}
                roles={roles}
                users={users}
                onClose={() => setPanelTarget(undefined as never)}
                onSaved={fetchUsers}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete User?"
        itemLabel={deleteTarget?.label}
        description="This will permanently remove this user account. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
