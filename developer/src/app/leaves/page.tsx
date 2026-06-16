"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HiPlus, HiCheck, HiX, HiTrash } from "react-icons/hi";
import {
  DashboardGlassCard,
  DataTable,
  StatusBadge,
  AdminButton,
  FilterDropdown,
} from "@/components/ui";
import LeaveModal from "@/components/modals/LeaveModal";
import { usePolling } from "@/lib/usePolling";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/types";
import type { Leave } from "@/lib/types";

export default function LeavesPage() {
  const { user, can } = useAuth();
  // "isManager" here means: can review/manage others' leaves
  const isManager = can(PERMISSIONS.LEAVES_REVIEW);

  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const fetcher = useCallback(() => api.get<Leave[]>("/leaves"), []);
  const { data: leaves, loading, refetch } = usePolling(fetcher, { interval: 25000 });

  const filtered = useMemo(
    () => (leaves || []).filter((l) => statusFilter === "all" || l.status === statusFilter),
    [leaves, statusFilter]
  );

  const review = async (id: string, status: "approved" | "rejected") => {
    try {
      await api.patch(`/leaves/${id}/review`, { status });
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this leave request?")) return;
    try {
      await api.del(`/leaves/${id}`);
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const days = (l: Leave) =>
    Math.round((new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / 86400000) + 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Leaves
          </h1>
          <p className="text-muted text-sm mt-1">
            {isManager ? "Review and manage team leave requests." : "Request and track your time off."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ]}
          />
          <AdminButton variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <HiPlus size={16} /> Request Leave
          </AdminButton>
        </div>
      </div>

      <DashboardGlassCard>
        {loading && !leaves ? (
          <div className="py-12 text-center text-muted text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted text-sm">No leave requests.</div>
        ) : (
          <DataTable
            columns={[
              ...(isManager
                ? [{
                    key: "user",
                    header: "Employee",
                    render: (row: Leave) => (
                      <span className="text-sm text-white">{row.user?.name || row.user?.username}</span>
                    ),
                  }]
                : []),
              { key: "type", header: "Type", render: (row: Leave) => <span className="text-sm text-white capitalize">{row.type}</span> },
              {
                key: "dates",
                header: "Dates",
                render: (row: Leave) => (
                  <span className="text-sm text-white">
                    {fmt(row.startDate)} – {fmt(row.endDate)}{" "}
                    <span className="text-muted text-xs">({days(row)}d)</span>
                  </span>
                ),
              },
              { key: "reason", header: "Reason", render: (row: Leave) => <span className="text-xs text-muted truncate max-w-[200px] block">{row.reason || "—"}</span> },
              { key: "status", header: "Status", render: (row: Leave) => <StatusBadge status={row.status} /> },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: (row: Leave) => (
                  <div className="flex items-center justify-end gap-1">
                    {isManager && row.status === "pending" && (
                      <>
                        <button onClick={() => review(row._id, "approved")} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition" title="Approve">
                          <HiCheck size={16} />
                        </button>
                        <button onClick={() => review(row._id, "rejected")} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Reject">
                          <HiX size={16} />
                        </button>
                      </>
                    )}
                    {(isManager || (row.user?._id === user?.id && row.status === "pending")) && (
                      <button onClick={() => remove(row._id)} className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Remove">
                        <HiTrash size={15} />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            data={filtered}
          />
        )}
      </DashboardGlassCard>

      <AnimatePresence>
        {modalOpen && <LeaveModal onClose={() => setModalOpen(false)} onSaved={refetch} />}
      </AnimatePresence>
    </div>
  );
}
