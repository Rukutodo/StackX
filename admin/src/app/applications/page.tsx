"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiTrash, HiDownload } from "react-icons/hi";
import Link from "next/link";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DashboardStatCard,
  DataTable,
  AdminButton,
  AdminSelect,
} from "@/components/admin/ui";
import { HiDocumentText, HiUserGroup, HiClock, HiCheckCircle } from "react-icons/hi";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  resume: string;
  portfolioLink: string;
  linkedIn: string;
  coverLetter: string;
  status: string;
  createdAt: string;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Position filter ──────────────────────────────────
  const [positionFilter, setPositionFilter] = useState("all");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/applications`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // Unique positions derived from ALL fetched applications
  const uniquePositions = Array.from(new Set(applications.map((a) => a.position))).sort();

  // Filtered slice shown in the table
  const visibleApplications =
    positionFilter === "all"
      ? applications
      : applications.filter((a) => a.position === positionFilter);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API}/api/applications/${id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchApplications();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/applications/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      setDeleteTarget(null);
      fetchApplications();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Applications
          </h1>
          <p className="text-muted text-sm mt-1">Manage job applications</p>
        </motion.div>

        {/* Stat cards */}
        <motion.div variants={item} className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <DashboardStatCard icon={<HiDocumentText size={20} />} label="Total Applications" value={applications.length} />
          <DashboardStatCard icon={<HiClock size={20} />} label="New / Pending" value={applications.filter((a) => a.status === "new").length} iconBg="bg-cyan-500/10" />
          <DashboardStatCard icon={<HiCheckCircle size={20} />} label="Reviewed" value={applications.filter((a) => a.status === "reviewed").length} iconBg="bg-emerald-500/10" />
          <DashboardStatCard icon={<HiUserGroup size={20} />} label="Positions Applied" value={uniquePositions.length} iconBg="bg-amber-500/10" />
        </motion.div>

        {/* Applications table */}
        <motion.div variants={item}>
          <DashboardGlassCard>
            {/* Header row with title + position filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <DashboardSectionHeader
                title={
                  positionFilter === "all"
                    ? "All Applications"
                    : `Applications — ${positionFilter}`
                }
                subtitle={`${visibleApplications.length} result${visibleApplications.length !== 1 ? "s" : ""}`}
              />

              {/* Position filter dropdown */}
              <div className="w-full sm:w-56 shrink-0">
                <AdminSelect
                  value={positionFilter}
                  onChange={(val) => setPositionFilter(val)}
                  options={[
                    { label: "All Positions", value: "all" },
                    ...uniquePositions.map((p) => ({ label: p, value: p })),
                  ]}
                />
              </div>
            </div>

            {loading ? (
              <div className="py-10 text-center text-muted text-sm">Loading...</div>
            ) : visibleApplications.length === 0 ? (
              <div className="py-10 text-center text-muted text-sm">
                {positionFilter === "all"
                  ? "No applications yet."
                  : `No applications for "${positionFilter}" yet.`}
              </div>
            ) : (
              <DataTable
                columns={[
                  {
                    key: "name",
                    header: "Applicant",
                    render: (row) => (
                      <Link href={`/applications/${row._id}`} className="block group">
                        <p className="text-white font-medium text-sm group-hover:text-primary-light transition-colors">{row.fullName as string}</p>
                        <p className="text-primary-light text-[11px] md:hidden truncate">{row.position as string}</p>
                        <p className="text-muted text-xs truncate max-w-[200px]">{row.email as string}</p>
                      </Link>
                    ),
                  },
                  {
                    key: "position",
                    header: "Position",
                    className: "hidden md:table-cell",
                    render: (row) => <span className="text-sm text-white">{row.position as string}</span>,
                  },
                  {
                    key: "phone",
                    header: "Phone",
                    className: "hidden md:table-cell",
                    render: (row) => <span className="text-sm text-muted">{(row.phone as string) || "—"}</span>,
                  },
                  {
                    key: "experience",
                    header: "Experience",
                    className: "hidden md:table-cell",
                    render: (row) => <span className="text-sm text-muted">{(row.experience as string) || "—"}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => (
                      <div className="w-[140px]" onClick={(e) => e.stopPropagation()}>
                        <AdminSelect
                          value={row.status as string}
                          onChange={(val) => updateStatus(row._id as string, val)}
                          className="!py-2 !px-3 !rounded-lg"
                          options={[
                            { label: "New", value: "new" },
                            { label: "Reviewed", value: "reviewed" },
                            { label: "Shortlisted", value: "shortlisted" },
                            { label: "Rejected", value: "rejected" },
                          ]}
                        />
                      </div>
                    ),
                  },
                  {
                    key: "createdAt",
                    header: "Applied",
                    className: "hidden lg:table-cell text-xs text-muted whitespace-nowrap",
                    render: (row) => <span>{formatDate(row.createdAt as string)}</span>,
                  },
                  {
                    key: "actions",
                    header: "",
                    className: "text-right hidden sm:table-cell",
                    render: (row) => (
                      <div className="flex items-center justify-end gap-1">
                        {(row.resume as string) && (
                          <a
                            href={`${API}${row.resume as string}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                            title="Download Resume"
                          >
                            <HiDownload size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => setDeleteTarget({ id: row._id as string, label: row.fullName as string })}
                          className="p-2 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/5"
                          title="Delete"
                        >
                          <HiTrash size={15} />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={visibleApplications as unknown as Record<string, unknown>[]}
              />
            )}
          </DashboardGlassCard>
        </motion.div>
      </motion.div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Application?"
        itemLabel={deleteTarget?.label}
        description="This will permanently delete this job application including the resume and all submitted details."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
