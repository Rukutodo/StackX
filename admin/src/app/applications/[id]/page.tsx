"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiDownload, HiExternalLink, HiMail, HiPhone, HiArrowLeft } from "react-icons/hi";
import { DashboardGlassCard, AdminSelect } from "@/components/admin/ui";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id as string;

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/applications/${appId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      if (!res.ok) {
        if (res.status === 404) setApp(null);
        return;
      }
      const data = await res.json();
      setApp(data);
    } catch (err) {
      console.error("Failed to load application:", err);
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    if (appId) fetchApplication();
  }, [appId, fetchApplication]);

  const updateStatus = async (status: string) => {
    try {
      const res = await fetch(`${API}/api/applications/${appId}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApp((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="text-muted text-sm border border-white/10 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm">
          Loading application details...
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-muted text-sm border border-white/10 px-6 py-4 rounded-xl bg-white/5 backdrop-blur-sm">
          Application not found.
        </div>
        <Link 
          href="/applications"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
          <HiArrowLeft size={16} /> Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Header Area */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link 
            href="/applications"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-white transition mb-4"
          >
            <HiArrowLeft size={16} /> Back to Applications
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            {app.fullName}
          </h1>
          <p className="text-primary-light text-sm mt-1 uppercase tracking-wider font-semibold">
            Applied for {app.position}
          </p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <DashboardGlassCard className="p-0 overflow-hidden">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-surface-border bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-muted">Application Status:</label>
              <div className="w-48">
                <AdminSelect
                  value={app.status}
                  onChange={(val) => updateStatus(val)}
                  options={[
                    { label: "New", value: "new" },
                    { label: "Reviewed", value: "reviewed" },
                    { label: "Shortlisted", value: "shortlisted" },
                    { label: "Rejected", value: "rejected" },
                  ]}
                />
              </div>
            </div>
            <div className="text-sm text-muted">
              Submitted on {formatDate(app.createdAt)}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Contact & Metadata */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-poppins)" }}>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <HiMail className="text-primary-light" size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted uppercase tracking-wider">Email</p>
                      <a href={`mailto:${app.email}`} className="text-sm text-white hover:text-primary-light transition truncate block">{app.email}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <HiPhone className="text-primary-light" size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted uppercase tracking-wider">Phone</p>
                      <a href={`tel:${app.phone}`} className="text-sm text-white hover:text-primary-light transition truncate block">{app.phone}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Links */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-poppins)" }}>
                  Application Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-4 py-3 rounded-lg bg-surface-bg border border-white/5">
                    <span className="text-xs text-muted">Experience</span>
                    <span className="text-sm text-white">{app.experience || "Not specified"}</span>
                  </div>
                  
                  {app.portfolioLink && (
                    <a
                      href={app.portfolioLink.startsWith("http") ? app.portfolioLink : `https://${app.portfolioLink}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex justify-between items-center px-4 py-3 rounded-lg bg-surface-bg border border-white/5 hover:border-primary/50 transition"
                    >
                      <span className="text-xs text-muted group-hover:text-white transition">Portfolio</span>
                      <span className="text-sm text-primary-light flex items-center gap-1">
                        View <HiExternalLink size={14} />
                      </span>
                    </a>
                  )}
                  
                  {app.linkedIn && (
                    <a
                      href={app.linkedIn.startsWith("http") ? app.linkedIn : `https://${app.linkedIn}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex justify-between items-center px-4 py-3 rounded-lg bg-surface-bg border border-white/5 hover:border-primary/50 transition"
                    >
                      <span className="text-xs text-muted group-hover:text-white transition">LinkedIn</span>
                      <span className="text-sm text-primary-light flex items-center gap-1">
                        Profile <HiExternalLink size={14} />
                      </span>
                    </a>
                  )}

                  {app.resume && (
                    <a
                      href={`${API}${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex justify-between items-center px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition"
                    >
                      <span className="text-xs text-white font-medium">Resume File</span>
                      <span className="text-sm text-primary-light flex items-center gap-1 font-medium">
                        Download <HiDownload size={16} />
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Cover Letter */}
            <div className="lg:col-span-2 flex flex-col">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-poppins)" }}>
                Cover Letter / Message
              </h3>
              <div className="flex-1 px-6 py-5 rounded-2xl bg-surface-bg border border-white/5">
                <p className="text-sm text-muted/90 leading-relaxed whitespace-pre-wrap">{app.coverLetter || "No cover letter provided."}</p>
              </div>
            </div>
          </div>
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
