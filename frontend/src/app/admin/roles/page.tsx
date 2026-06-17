"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiX, HiSave, HiCheck, HiShieldCheck, HiLockClosed } from "react-icons/hi";
import { DashboardGlassCard, AdminButton } from "@/components/portal/ui";
import { DeleteConfirmModal } from "@/components/portal/DeleteConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Role, PermissionGroup } from "@/types";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function EditPanel({
  editing,
  catalog,
  onClose,
  onSaved,
}: {
  editing: Role | null;
  catalog: PermissionGroup[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!editing;
  const [name, setName] = useState(editing?.name || "");
  const [description, setDescription] = useState(editing?.description || "");
  const [permissions, setPermissions] = useState<string[]>(editing?.permissions || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) =>
    setPermissions((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));

  const toggleGroup = (group: PermissionGroup) => {
    const keys = group.permissions.map((p) => p.key);
    const allOn = keys.every((k) => permissions.includes(k));
    setPermissions((prev) => (allOn ? prev.filter((p) => !keys.includes(p)) : [...new Set([...prev, ...keys])]));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Role name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api(isEdit ? `/api/roles/${editing!._id}` : "/api/roles", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify({ name, description, permissions }),
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full lg:w-[440px] shrink-0"
    >
      <DashboardGlassCard className="sticky top-6 max-h-[calc(100vh-5rem)] overflow-y-auto admin-scroll">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-border">
          <div>
            <h3 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              {isEdit ? "Edit Role" : "Create Role"}
            </h3>
            {editing?.isSystem && <p className="text-[11px] text-amber-400 mt-0.5 flex items-center gap-1"><HiLockClosed size={11} /> System role — name locked</p>}
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition">
            <HiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Role Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Team Lead"
              disabled={editing?.isSystem}
              className="admin-input w-full disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="admin-input w-full" />
          </div>

          <div>
            <label className="block text-xs text-muted mb-2">Permissions ({permissions.length})</label>
            <div className="space-y-3">
              {catalog.map((group) => {
                const keys = group.permissions.map((p) => p.key);
                const allOn = keys.every((k) => permissions.includes(k));
                return (
                  <div key={group.group} className="rounded-xl border border-white/[0.06] p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-white uppercase tracking-wider">{group.group}</p>
                      <button
                        type="button"
                        onClick={() => toggleGroup(group)}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted hover:text-white transition"
                      >
                        {allOn ? "Clear" : "All"}
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {group.permissions.map((p) => (
                        <label key={p.key} className="flex items-center gap-2.5 cursor-pointer group">
                          <button
                            type="button"
                            onClick={() => toggle(p.key)}
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition ${
                              permissions.includes(p.key) ? "bg-primary border-primary" : "border border-white/20 group-hover:border-primary/50"
                            }`}
                          >
                            {permissions.includes(p.key) && <HiCheck size={11} className="text-white" />}
                          </button>
                          <span className="text-xs text-muted group-hover:text-white transition">{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
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
              {saved ? (<><HiCheck size={14} /> Saved!</>) : saving ? "Saving..." : (<><HiSave size={14} />{isEdit ? "Save Changes" : "Create Role"}</>)}
            </button>
          </div>
        </form>
      </DashboardGlassCard>
    </motion.div>
  );
}

export default function RolesAdminPage() {
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [catalog, setCatalog] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelTarget, setPanelTarget] = useState<Role | null | "new">(undefined as never);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canManage = hasPermission("roles.manage");
  const panelOpen = panelTarget !== (undefined as never);
  const editingItem = panelTarget === "new" ? null : (panelTarget as Role | null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<Role[]>("/api/roles");
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load roles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    api<PermissionGroup[]>("/api/roles/permissions").then((d) => setCatalog(Array.isArray(d) ? d : [])).catch(() => {});
  }, [fetchRoles]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`/api/roles/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      if ((panelTarget as Role)?._id === deleteTarget.id) setPanelTarget(undefined as never);
      fetchRoles();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Roles &amp; Permissions
            </h1>
            <p className="text-muted text-sm mt-1">Define what each role can access</p>
          </div>
          {canManage && (
            <AdminButton variant="primary" className="gap-1.5" onClick={() => setPanelTarget("new")}>
              <HiPlus size={16} /> Create Role
            </AdminButton>
          )}
        </motion.div>

        <motion.div variants={item} className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-24 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((r) => {
                  const isSelected = (panelTarget as Role)?._id === r._id;
                  return (
                    <div
                      key={r._id}
                      onClick={() => canManage && setPanelTarget(isSelected ? (undefined as never) : r)}
                      className={`rounded-xl border p-5 transition-all duration-200 ${canManage ? "cursor-pointer" : ""} ${
                        isSelected ? "border-purple-500/40 bg-purple-500/[0.06]" : "border-white/[0.08] hover:border-purple-500/20 hover:bg-white/[0.02]"
                      }`}
                      style={{ background: isSelected ? undefined : "var(--color-surface)", backdropFilter: "blur(12px)" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shrink-0">
                            <HiShieldCheck size={18} />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm flex items-center gap-1.5">
                              {r.name}
                              {r.isSystem && <HiLockClosed size={11} className="text-amber-400" />}
                            </p>
                            <p className="text-[11px] text-muted">{r.userCount ?? 0} user{(r.userCount ?? 0) !== 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        {canManage && (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setPanelTarget(isSelected ? (undefined as never) : r)} className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition" title="Edit">
                              <HiPencil size={13} />
                            </button>
                            {!r.isSystem && (
                              <button onClick={() => setDeleteTarget({ id: r._id, label: r.name })} className="p-1.5 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/5" title="Delete">
                                <HiTrash size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {r.description && <p className="text-xs text-muted mt-3 leading-relaxed">{r.description}</p>}
                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 bg-white/5 text-muted rounded-full border border-white/10">
                          {r.permissions.length} permission{r.permissions.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {panelOpen && canManage && (
              <EditPanel
                key={panelTarget === "new" ? "new" : (panelTarget as Role)?._id}
                editing={editingItem}
                catalog={catalog}
                onClose={() => setPanelTarget(undefined as never)}
                onSaved={fetchRoles}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Role?"
        itemLabel={deleteTarget?.label}
        description="This will permanently remove this role. Users must be reassigned first."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
