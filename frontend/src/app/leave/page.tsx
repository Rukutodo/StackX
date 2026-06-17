"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion } from "framer-motion";
import { HiPlus, HiCheck, HiX, HiCalendar, HiClock } from "react-icons/hi";
import { DashboardGlassCard, AdminButton, AdminSelect, StatusBadge } from "@/components/portal/ui";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { usePolling } from "@/lib/usePolling";
import type { LeaveRequest, LeaveType } from "@/types";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const TYPE_LABELS: Record<LeaveType, string> = { sick: "Sick", vacation: "Vacation", personal: "Personal", other: "Other" };

function daysBetween(a: string, b: string) {
  const d = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1;
  return d > 0 ? d : 1;
}

function ApplyForm({ onApplied }: { onApplied: () => void }) {
  const [type, setType] = useState<LeaveType>("vacation");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return setError("Please pick start and end dates.");
    setSaving(true);
    setError("");
    try {
      await api("/api/leave", { method: "POST", body: JSON.stringify({ type, startDate, endDate, reason }) });
      setDone(true);
      setStartDate(""); setEndDate(""); setReason(""); setType("casual");
      setTimeout(() => setDone(false), 1500);
      onApplied();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardGlassCard hover={false}>
      <h3 className="text-base font-semibold text-white mb-4" style={{ fontFamily: "var(--font-poppins)" }}>Apply for Leave</h3>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1.5">Leave Type</label>
          <AdminSelect value={type} onChange={(v) => setType(v as LeaveType)} size="sm" options={Object.entries(TYPE_LABELS).map(([v, l]) => ({ label: l, value: v }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1.5">From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="admin-input w-full" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="admin-input w-full" />
          </div>
        </div>
        {startDate && endDate && (
          <p className="text-[11px] text-primary-light">{daysBetween(startDate, endDate)} day(s)</p>
        )}
        <div>
          <label className="block text-xs text-muted mb-1.5">Reason</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Optional note for your manager" className="admin-input w-full resize-none" />
        </div>
        {error && <p className="text-red-400 text-xs flex items-center gap-1.5"><HiX className="w-3.5 h-3.5" /> {error}</p>}
        <button type="submit" disabled={saving || done} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-60" style={{ background: done ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#8B5CF6,#6D28D9)" }}>
          {done ? (<><HiCheck size={15} /> Submitted!</>) : saving ? "Submitting…" : (<><HiPlus size={15} /> Submit Request</>)}
        </button>
      </form>
    </DashboardGlassCard>
  );
}

function RequestCard({ r, showUser, canDecide, onDecision, onCancel }: {
  r: LeaveRequest;
  showUser: boolean;
  canDecide: boolean;
  onDecision: (id: string, decision: "approved" | "rejected") => void;
  onCancel: (id: string) => void;
}) {
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <div className="rounded-xl border border-white/[0.08] p-4" style={{ background: "var(--color-surface)" }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          {showUser && r.userId && <p className="text-sm text-white font-medium">{r.userId.name}</p>}
          <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
            <span className="text-primary-light font-medium">{TYPE_LABELS[r.type]}</span>
            <span className="flex items-center gap-1"><HiCalendar size={12} /> {fmt(r.startDate)} → {fmt(r.endDate)}</span>
            <span>· {daysBetween(r.startDate, r.endDate)}d</span>
          </div>
        </div>
        <StatusBadge status={r.status === "approved" ? "active" : r.status === "rejected" ? "rejected" : "pending"} label={r.status} />
      </div>
      {r.reason && <p className="text-xs text-muted mt-2">{r.reason}</p>}
      {r.status === "pending" && canDecide && (
        <div className="flex items-center gap-2 mt-3">
          <button onClick={() => onDecision(r._id, "approved")} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"><HiCheck size={13} /> Approve</button>
          <button onClick={() => onDecision(r._id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"><HiX size={13} /> Reject</button>
        </div>
      )}
      {r.status === "pending" && !canDecide && (
        <button onClick={() => onCancel(r._id)} className="mt-3 text-xs text-muted hover:text-red-400 transition">Cancel request</button>
      )}
      {r.status !== "pending" && r.approverId && (
        <p className="text-[11px] text-muted mt-2 flex items-center gap-1"><HiClock size={11} /> {r.status} by {r.approverId.name}</p>
      )}
    </div>
  );
}

export default function LeavePage() {
  const { hasPermission } = useAuth();
  const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);
  const [teamRequests, setTeamRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const canApply = hasPermission("leave.apply");
  const canApprove = hasPermission("leave.approve");
  const canViewTeam = hasPermission("leave.view.team") || canApprove;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const mine = await api<LeaveRequest[]>("/api/leave?scope=own");
      setMyRequests(Array.isArray(mine) ? mine : []);
      if (canViewTeam) {
        const team = await api<LeaveRequest[]>("/api/leave?scope=team");
        setTeamRequests(Array.isArray(team) ? team : []);
      }
    } catch (err) {
      console.error("Failed to load leave:", err);
    } finally {
      setLoading(false);
    }
  }, [canViewTeam]);

  useEffect(() => { load(); }, [load]);
  usePolling(load, 20000);

  const decide = async (id: string, decision: "approved" | "rejected") => {
    try {
      await api(`/api/leave/${id}/decision`, { method: "PATCH", body: JSON.stringify({ decision }) });
      load();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const cancel = async (id: string) => {
    try {
      await api(`/api/leave/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const pendingTeam = teamRequests.filter((r) => r.status === "pending");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Leave</h1>
        <p className="text-muted text-sm mt-1">Request time off and track approvals</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Apply + my requests */}
        <motion.div variants={item} className="space-y-6">
          {canApply && <ApplyForm onApplied={load} />}
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          {/* Team approvals */}
          {canViewTeam && (
            <DashboardGlassCard hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>Team Requests</h3>
                {pendingTeam.length > 0 && <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{pendingTeam.length} pending</span>}
              </div>
              {loading ? (
                <div className="space-y-3">{[1, 2].map((n) => <div key={n} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />)}</div>
              ) : teamRequests.length === 0 ? (
                <p className="text-sm text-muted py-6 text-center">No team requests.</p>
              ) : (
                <div className="space-y-3">
                  {teamRequests.map((r) => <RequestCard key={r._id} r={r} showUser canDecide={canApprove} onDecision={decide} onCancel={cancel} />)}
                </div>
              )}
            </DashboardGlassCard>
          )}

          {/* My requests */}
          <DashboardGlassCard hover={false}>
            <h3 className="text-base font-semibold text-white mb-4" style={{ fontFamily: "var(--font-poppins)" }}>My Requests</h3>
            {loading ? (
              <div className="space-y-3">{[1, 2].map((n) => <div key={n} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />)}</div>
            ) : myRequests.length === 0 ? (
              <p className="text-sm text-muted py-6 text-center">You haven&apos;t requested any leave yet.</p>
            ) : (
              <div className="space-y-3">
                {myRequests.map((r) => <RequestCard key={r._id} r={r} showUser={false} canDecide={false} onDecision={decide} onCancel={cancel} />)}
              </div>
            )}
          </DashboardGlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
