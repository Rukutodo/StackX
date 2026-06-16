"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiX } from "react-icons/hi";
import {
  DashboardGlassCard,
  DataTable,
  StatusBadge,
  AdminButton,
  AdminSelect,
} from "@/components/ui";
import { usePolling } from "@/lib/usePolling";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/types";
import type { UserLite, RoleDef } from "@/lib/types";

export default function TeamPage() {
  const { user, can } = useAuth();
  const canManageUsers = can(PERMISSIONS.USERS_MANAGE);

  const fetcher = useCallback(() => api.get<UserLite[]>("/users"), []);
  const { data: users, loading, refetch } = usePolling(fetcher, { interval: 30000, enabled: canManageUsers });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserLite | null>(null);

  if (!canManageUsers) {
    return (
      <div className="py-20 text-center">
        <p className="text-white font-medium">Not authorized</p>
        <p className="text-muted text-sm mt-1">You don&apos;t have permission to manage the team.</p>
      </div>
    );
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this account?")) return;
    try {
      await api.del(`/users/${id}`);
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
            Team
          </h1>
          <p className="text-muted text-sm mt-1">Manage developer and manager accounts.</p>
        </div>
        <AdminButton variant="primary" size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <HiPlus size={16} /> Add Member
        </AdminButton>
      </div>

      <DashboardGlassCard>
        {loading && !users ? (
          <div className="py-12 text-center text-muted text-sm">Loading…</div>
        ) : (users || []).length === 0 ? (
          <div className="py-12 text-center text-muted text-sm">No team members yet.</div>
        ) : (
          <DataTable
            columns={[
              {
                key: "name",
                header: "Member",
                render: (row: UserLite) => (
                  <div>
                    <p className="text-white font-medium text-sm">{row.name || row.username}</p>
                    <p className="text-muted text-xs">@{row.username}</p>
                  </div>
                ),
              },
              { key: "email", header: "Email", render: (row: UserLite) => <span className="text-sm text-muted">{row.email || "—"}</span> },
              { key: "role", header: "Role", render: (row: UserLite) => <span className="text-sm text-white capitalize">{row.role}</span> },
              {
                key: "isActive",
                header: "Status",
                render: (row: UserLite) => <StatusBadge status={row.isActive === false ? "archived" : "active"} label={row.isActive === false ? "Inactive" : "Active"} />,
              },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: (row: UserLite) => (
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setEditing(row); setModalOpen(true); }} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition" title="Edit">
                      <HiPencil size={15} />
                    </button>
                    {row._id !== user?.id && (
                      <button onClick={() => remove(row._id)} className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Delete">
                        <HiTrash size={15} />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            data={users || []}
          />
        )}
      </DashboardGlassCard>

      <AnimatePresence>
        {modalOpen && (
          <UserModal user={editing} onClose={() => setModalOpen(false)} onSaved={refetch} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Inline User Modal ─── */
function UserModal({ user, onClose, onSaved }: { user: UserLite | null; onClose: () => void; onSaved: () => void }) {
  const editing = !!user;
  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState<string>(user?.role || "developer");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(user?.isActive !== false);
  const [roles, setRoles] = useState<RoleDef[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<RoleDef[]>("/roles").then(setRoles).catch(() => setRoles([]));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return setError("Username is required");
    if (!editing && password.length < 6) return setError("Password must be at least 6 characters");
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.put(`/users/${user!._id}`, { name, email, role, isActive, ...(password ? { password } : {}) });
      } else {
        await api.post("/users", { username, password, name, email, role });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
      >
        <div className="rounded-2xl border border-surface-border p-6 sm:p-8" style={{ background: "rgba(19, 19, 26, 0.97)", backdropFilter: "blur(24px)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              {editing ? "Edit Member" : "Add Member"}
            </h2>
            <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer">
              <HiX size={18} />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} disabled={editing} className="admin-input w-full disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="admin-input w-full" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white font-medium mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">Role</label>
                <AdminSelect
                  value={role}
                  onChange={setRole}
                  options={roles.map((r) => ({ label: r.name, value: r.slug }))}
                />
              </div>
              <div>
                <label className="block text-sm text-white font-medium mb-1.5">
                  {editing ? "New Password" : "Password"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editing ? "Leave blank to keep" : "Min 6 characters"}
                  className="admin-input w-full"
                />
              </div>
            </div>

            {editing && (
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#8B5CF6]" />
                Account active
              </label>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <AdminButton variant="ghost" onClick={onClose} type="button">Cancel</AdminButton>
              <AdminButton variant="primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save Changes" : "Create"}
              </AdminButton>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
