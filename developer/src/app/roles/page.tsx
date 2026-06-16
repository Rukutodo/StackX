"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiX, HiLockClosed } from "react-icons/hi";
import {
  DashboardGlassCard,
  DataTable,
  StatusBadge,
  AdminButton,
} from "@/components/ui";
import { usePolling } from "@/lib/usePolling";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/types";
import type { RoleDef, PermissionInfo } from "@/lib/types";

export default function RolesPage() {
  const { can } = useAuth();
  const canManageRoles = can(PERMISSIONS.ROLES_MANAGE);

  const fetcher = useCallback(() => api.get<RoleDef[]>("/roles"), []);
  const { data: roles, loading, refetch } = usePolling(fetcher, { interval: 30000, enabled: canManageRoles });

  const [catalogue, setCatalogue] = useState<PermissionInfo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoleDef | null>(null);

  useEffect(() => {
    if (canManageRoles) api.get<PermissionInfo[]>("/roles/permissions").then(setCatalogue).catch(() => {});
  }, [canManageRoles]);

  if (!canManageRoles) {
    return (
      <div className="py-20 text-center">
        <p className="text-white font-medium">Not authorized</p>
        <p className="text-muted text-sm mt-1">You don&apos;t have permission to manage roles.</p>
      </div>
    );
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this role?")) return;
    try {
      await api.del(`/roles/${id}`);
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Roles
          </h1>
          <p className="text-muted text-sm mt-1">Define roles and the permissions they grant.</p>
        </div>
        <AdminButton variant="primary" size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <HiPlus size={16} /> New Role
        </AdminButton>
      </div>

      <DashboardGlassCard>
        {loading && !roles ? (
          <div className="py-12 text-center text-muted text-sm">Loading…</div>
        ) : (
          <DataTable
            columns={[
              {
                key: "name",
                header: "Role",
                render: (row: RoleDef) => (
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-white font-medium text-sm">{row.name}</p>
                      <p className="text-muted text-xs">{row.description || "—"}</p>
                    </div>
                    {row.isSystem && <HiLockClosed size={13} className="text-muted" title="System role" />}
                  </div>
                ),
              },
              {
                key: "permissions",
                header: "Permissions",
                render: (row: RoleDef) => (
                  <span className="text-sm text-white">
                    {row.permissions.length === catalogue.length && catalogue.length > 0
                      ? "All"
                      : `${row.permissions.length}`}
                  </span>
                ),
              },
              {
                key: "type",
                header: "Type",
                render: (row: RoleDef) => (
                  <StatusBadge status={row.isSystem ? "archived" : "active"} label={row.isSystem ? "System" : "Custom"} />
                ),
              },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: (row: RoleDef) => (
                  <div className="flex items-center justify-end gap-1">
                    {!row.isSystem && (
                      <>
                        <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition" title="Edit">
                          <HiPencil size={15} />
                        </button>
                        <button onClick={() => remove(row._id)} className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Delete">
                          <HiTrash size={15} />
                        </button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
            data={roles || []}
          />
        )}
      </DashboardGlassCard>

      <AnimatePresence>
        {modalOpen && (
          <RoleModal role={editing} catalogue={catalogue} onClose={() => setModalOpen(false)} onSaved={refetch} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Role Builder Modal ─── */
function RoleModal({
  role,
  catalogue,
  onClose,
  onSaved,
}: {
  role: RoleDef | null;
  catalogue: PermissionInfo[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = !!role;
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [permissions, setPermissions] = useState<string[]>(role?.permissions || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggle = (key: string) =>
    setPermissions((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Role name is required");
    setSaving(true);
    setError("");
    try {
      if (editing) await api.put(`/roles/${role!._id}`, { name, description, permissions });
      else await api.post("/roles", { name, description, permissions });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save role");
      setSaving(false);
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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
      >
        <div className="rounded-2xl border border-surface-border p-6 sm:p-8 max-h-[85vh] overflow-y-auto admin-scroll" style={{ background: "rgba(19, 19, 26, 0.97)", backdropFilter: "blur(24px)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              {editing ? "Edit Role" : "New Role"}
            </h2>
            <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer">
              <HiX size={18} />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}

            <div>
              <label className="block text-sm text-white font-medium mb-1.5">Role Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Team Lead" className="admin-input w-full" />
            </div>

            <div>
              <label className="block text-sm text-white font-medium mb-1.5">Description</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" className="admin-input w-full" />
            </div>

            <div>
              <label className="block text-sm text-white font-medium mb-2">Permissions</label>
              <div className="space-y-1.5">
                {catalogue.map((p) => (
                  <label key={p.key} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-primary/30 transition">
                    <input type="checkbox" checked={permissions.includes(p.key)} onChange={() => toggle(p.key)} className="accent-[#8B5CF6]" />
                    <div>
                      <p className="text-sm text-white">{p.label}</p>
                      <p className="text-[11px] text-muted font-mono">{p.key}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AdminButton variant="ghost" onClick={onClose} type="button">Cancel</AdminButton>
              <AdminButton variant="primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Role"}
              </AdminButton>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
