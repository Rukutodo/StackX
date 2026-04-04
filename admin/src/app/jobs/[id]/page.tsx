"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { HiArrowLeft, HiPlus, HiTrash } from "react-icons/hi";
import { DashboardGlassCard, AdminSelect } from "@/components/admin/ui";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

const DEPARTMENTS = ["Engineering", "Design", "Automation", "Marketing", "Operations"];
const TYPES = ["Full-time", "Full-time / Contract", "Contract", "Internship", "Part-time"];

interface JobData {
  _id?: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  status: string;
  order: number;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function JobEditPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const isEdit = jobId !== "new";

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<JobData>({
    title: "",
    department: "Engineering",
    type: "Full-time",
    location: "Remote",
    description: "",
    requirements: [],
    status: "active",
    order: 0,
  });

  useEffect(() => {
    if (!isEdit) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`${API}/api/jobs/${jobId}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
        });
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error("Failed to load job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, isEdit]);

  const setField = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const addReq = () => setForm((f) => ({ ...f, requirements: [...f.requirements, ""] }));
  const setReq = (i: number, val: string) => {
    const reqs = [...form.requirements];
    reqs[i] = val;
    setForm((f) => ({ ...f, requirements: reqs }));
  };
  const removeReq = (i: number) =>
    setForm((f) => ({ ...f, requirements: f.requirements.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isEdit ? `${API}/api/jobs/${jobId}` : `${API}/api/jobs`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save");
      }

      router.push("/jobs");
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="text-muted text-sm border border-white/10 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm">
          Loading job details...
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto w-full">
      <motion.div variants={item}>
        <Link 
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-white transition mb-6"
        >
          <HiArrowLeft size={16} /> Back to Jobs
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          {isEdit ? "Edit Job Posting" : "Create New Job"}
        </h1>
        <p className="text-muted text-sm mt-1">
          {isEdit ? "Update the details for this open position." : "Publish a new career opportunity."}
        </p>
      </motion.div>

      <motion.div variants={item}>
        <DashboardGlassCard className="p-0 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Job Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. Senior Full-Stack Developer"
                className="admin-input w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition placeholder:text-muted/50"
              />
            </div>

            {/* Grid 1: Department + Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Department *</label>
                <AdminSelect
                  value={form.department}
                  onChange={(val) => setField("department", val)}
                  options={DEPARTMENTS.map(d => ({ label: d, value: d }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Job Type *</label>
                <AdminSelect
                  value={form.type}
                  onChange={(val) => setField("type", val)}
                  options={TYPES.map(t => ({ label: t, value: t }))}
                />
              </div>
            </div>

            {/* Grid 2: Location + Status + Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Location *</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="e.g. Remote, NY"
                  className="admin-input w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition placeholder:text-muted/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Status</label>
                <AdminSelect
                  value={form.status}
                  onChange={(val) => setField("status", val)}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Draft", value: "draft" },
                    { label: "Archived", value: "archived" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Sort Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setField("order", Number(e.target.value))}
                  className="admin-input w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Description *</label>
              <textarea
                required
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Describe the role, responsibilities, and team..."
                rows={5}
                className="admin-input w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition resize-y placeholder:text-muted/50"
              />
            </div>

            {/* Requirements */}
            <div className="pt-2 border-t border-surface-border">
              <div className="flex items-center justify-between mb-4 mt-4">
                <label className="block text-xs font-medium text-white uppercase tracking-wider">Candidate Requirements</label>
              </div>
              
              {form.requirements.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                  <p className="text-sm text-muted">No specific requirements added yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {form.requirements.map((r, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/10 text-muted flex items-center justify-center text-xs font-medium shrink-0">
                        {i + 1}
                      </div>
                      <textarea
                        value={r}
                        onChange={(e) => setReq(i, e.target.value)}
                        placeholder="Add a requirement..."
                        rows={2}
                        className="admin-input flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 transition placeholder:text-muted/50 resize-y min-h-[44px]"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeReq(i)} 
                        className="p-2.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Remove requirement"
                      >
                        <HiTrash size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                onClick={addReq}
                className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-medium text-primary-light border border-primary/30 border-dashed hover:border-primary hover:bg-primary/10 px-4 py-3.5 rounded-xl transition"
              >
                <HiPlus size={18} /> Add Requirement
              </button>
            </div>

            {/* Error Area */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-surface-border mt-8">
              <Link 
                href="/jobs" 
                className="px-5 py-2.5 text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-sm font-bold text-white rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ background: "linear-gradient(135deg,#8B5CF6,#6D28D9)", boxShadow: "0 4px 20px rgba(139,92,246,0.25)" }}
              >
                {saving && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Publish Job"}
              </button>
            </div>
            
          </form>
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
