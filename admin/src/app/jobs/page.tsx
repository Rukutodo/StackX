"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DataTable,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";
import Link from "next/link";

const API = "http://localhost:4000";

interface Job {
  _id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  status: string;
  order: number;
  applicants: number;
  createdAt: string;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function JobsAdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/jobs?all=true`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
    try {
      await fetch(`${API}/api/jobs/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      setDeleteConfirm(null);
      fetchJobs();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Jobs
            </h1>
            <p className="text-muted text-sm mt-1">Manage job listings and openings</p>
          </div>
          <Link href="/jobs/new" className="inline-flex items-center justify-center gap-2 font-medium rounded-xl px-5 py-2.5 text-sm transition-all duration-200 cursor-pointer bg-gradient-to-r from-primary to-primary-deep text-white hover:shadow-lg hover:shadow-primary/25">
            <HiPlus size={16} /> Post Job
          </Link>
        </motion.div>

        {/* Quick stats */}
        <motion.div variants={item} className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Active Listings", value: jobs.filter((j) => j.status === "active").length, color: "text-emerald-400" },
            { label: "Draft", value: jobs.filter((j) => j.status === "draft").length, color: "text-gray-400" },
            { label: "Archived", value: jobs.filter((j) => j.status === "archived").length, color: "text-amber-400" },
            { label: "Total Applicants", value: jobs.reduce((s, j) => s + (j.applicants || 0), 0), color: "text-primary-light" },
          ].map((s) => (
            <DashboardGlassCard key={s.label} className="text-center py-4">
              <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </DashboardGlassCard>
          ))}
        </motion.div>

        {/* Jobs table */}
        <motion.div variants={item}>
          <DashboardGlassCard>
            <DashboardSectionHeader title="All Job Listings" subtitle={`${jobs.length} positions`} />
            {loading ? (
              <div className="py-10 text-center text-muted text-sm">Loading...</div>
            ) : (
              <DataTable
                columns={[
                  {
                    key: "title",
                    header: "Position",
                    render: (row) => (
                      <Link href={`/jobs/${row._id}`} className="block group">
                        <p className="text-white font-medium text-sm group-hover:text-primary-light transition-colors">{row.title as string}</p>
                        <div className="flex items-center gap-2 mt-1 md:hidden">
                          <StatusBadge status={row.status as "active"| "draft" | "archived"} />
                        </div>
                        <p className="text-muted text-xs mt-1">{row.department as string} · {row.type as string} <span className="md:hidden">· {row.location as string}</span></p>
                      </Link>
                    ),
                  },
                  {
                    key: "location",
                    header: "Location",
                    className: "hidden md:table-cell",
                    render: (row) => <span className="text-sm text-muted">{row.location as string}</span>,
                  },
                  {
                    key: "applicants",
                    header: "Applicants",
                    className: "hidden sm:table-cell",
                    render: (row) => (
                      <span className="text-sm text-white font-medium">{(row.applicants as number) || 0}</span>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    className: "hidden md:table-cell",
                    render: (row) => <StatusBadge status={row.status as "active" | "draft" | "archived"} />,
                  },
                  {
                    key: "createdAt",
                    header: "Posted",
                    className: "hidden lg:table-cell text-xs text-muted whitespace-nowrap",
                    render: (row) => <span>{row.createdAt ? formatDate(row.createdAt as string) : "—"}</span>,
                  },
                  {
                    key: "actions",
                    header: "",
                    className: "text-right hidden sm:table-cell",
                    render: (row) => (
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/jobs/${row._id}`}
                          className="p-2 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                        >
                          <HiPencil size={15} />
                        </Link>
                        <button
                          onClick={(e) => { e.preventDefault(); handleDelete(row._id as string); }}
                          className={`p-2 rounded-lg transition ${deleteConfirm === row._id ? "bg-red-500/10 text-red-400" : "text-muted hover:text-red-400 hover:bg-red-500/5"}`}
                          title={deleteConfirm === row._id ? "Click again to confirm" : "Delete"}
                        >
                          <HiTrash size={15} />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={jobs as unknown as Record<string, unknown>[]}
              />
            )}
          </DashboardGlassCard>
        </motion.div>
      </motion.div>
    </>
  );
}
