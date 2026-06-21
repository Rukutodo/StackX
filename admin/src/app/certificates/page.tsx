"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiX } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DataTable,
  StatusBadge,
  AdminButton,
  AdminSelect,
} from "@/components/admin/ui";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

interface Certificate {
  _id: string;
  certificateId: string;
  recipientName: string;
  courseOrRole: string;
  issueDate: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  signature1Url?: string;
  signature2Url?: string;
  status: "valid" | "revoked";
  createdAt: string;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState({
    certificateId: "",
    recipientName: "",
    courseOrRole: "",
    issueDate: "",
    startDate: "",
    endDate: "",
    duration: "",
    signature1Url: "",
    signature2Url: "",
    status: "valid" as "valid" | "revoked",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("stackx_token");
      const res = await fetch(`${API}/api/certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCertificates(data);
      }
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  // Auto-calculate duration
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        let months = (end.getFullYear() - start.getFullYear()) * 12;
        months -= start.getMonth();
        months += end.getMonth();
        
        let durationStr = "";
        if (months <= 0) {
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          durationStr = `${diffDays} Days`;
        } else {
          durationStr = `${months} Month${months > 1 ? "s" : ""}`;
        }
        
        setFormData(prev => {
          if (prev.duration === durationStr) return prev;
          return { ...prev, duration: durationStr };
        });
      }
    }
  }, [formData.startDate, formData.endDate]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/certificates/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      setDeleteTarget(null);
      fetchCertificates();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const openModal = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        certificateId: cert.certificateId,
        recipientName: cert.recipientName,
        courseOrRole: cert.courseOrRole,
        issueDate: cert.issueDate.split('T')[0], // format for date input
        startDate: cert.startDate ? cert.startDate.split('T')[0] : "",
        endDate: cert.endDate ? cert.endDate.split('T')[0] : "",
        duration: cert.duration || "",
        signature1Url: cert.signature1Url || "",
        signature2Url: cert.signature2Url || "",
        status: cert.status,
      });
    } else {
      setEditingCert(null);
      // Auto-generate a unique ID suggestion
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        certificateId: `STX-${new Date().getFullYear()}-${randomNum}`,
        recipientName: "",
        courseOrRole: "",
        issueDate: new Date().toISOString().split('T')[0],
        startDate: "",
        endDate: "",
        duration: "",
        signature1Url: "",
        signature2Url: "",
        status: "valid",
      });
    }
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    
    try {
      const url = editingCert 
        ? `${API}/api/certificates/${editingCert._id}` 
        : `${API}/api/certificates`;
      const method = editingCert ? "PUT" : "POST";

      const payload: any = {
        ...formData,
        issueDate: new Date(formData.issueDate).toISOString()
      };
      if (formData.startDate) payload.startDate = new Date(formData.startDate).toISOString();
      if (formData.endDate) payload.endDate = new Date(formData.endDate).toISOString();

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save certificate");
      }

      closeModal();
      fetchCertificates();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "signature1Url" | "signature2Url") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const token = localStorage.getItem("stackx_token");
    const uploadData = new FormData();
    uploadData.append("image", file);
    
    try {
      const res = await fetch(`${API}/api/certificates/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, [field]: data.url }));
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
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
              Certificates
            </h1>
            <p className="text-muted text-sm mt-1">Issue and manage digital certificates</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 font-medium rounded-xl px-5 py-2.5 text-sm transition-all duration-200 cursor-pointer bg-gradient-to-r from-primary to-primary-deep text-white hover:shadow-lg hover:shadow-primary/25"
          >
            <HiPlus size={16} /> Issue Certificate
          </button>
        </motion.div>

        {/* Quick stats */}
        <motion.div variants={item} className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Total Issued", value: certificates.length, color: "text-white" },
            { label: "Valid", value: certificates.filter((c) => c.status === "valid").length, color: "text-emerald-400" },
            { label: "Revoked", value: certificates.filter((c) => c.status === "revoked").length, color: "text-red-400" },
          ].map((s) => (
            <DashboardGlassCard key={s.label} className="text-center py-4">
              <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </DashboardGlassCard>
          ))}
        </motion.div>

        {/* Certificates table */}
        <motion.div variants={item}>
          <DashboardGlassCard>
            <DashboardSectionHeader title="Issued Certificates" subtitle={`${certificates.length} records`} />
            {loading ? (
              <div className="py-10 text-center text-muted text-sm">Loading...</div>
            ) : (
              <DataTable
                columns={[
                  {
                    key: "certificateId",
                    header: "Certificate ID",
                    render: (row) => (
                      <div className="font-mono text-sm text-primary-light font-medium tracking-tight">
                        {row.certificateId as string}
                      </div>
                    ),
                  },
                  {
                    key: "recipient",
                    header: "Recipient & Course",
                    render: (row) => (
                      <div>
                        <p className="text-white font-medium text-sm">{row.recipientName as string}</p>
                        <p className="text-muted text-xs mt-1 truncate max-w-[200px] md:max-w-xs">{row.courseOrRole as string}</p>
                      </div>
                    ),
                  },
                  {
                    key: "issueDate",
                    header: "Issued Date",
                    className: "hidden sm:table-cell text-sm text-muted whitespace-nowrap",
                    render: (row) => <span>{row.issueDate ? formatDate(row.issueDate as string) : "—"}</span>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    className: "hidden md:table-cell",
                    render: (row) => {
                      const st = row.status as string;
                      const isRevoked = st === "revoked";
                      return (
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isRevoked ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${isRevoked ? "bg-red-500" : "bg-emerald-500"}`} />
                           {st.toUpperCase()}
                         </span>
                      )
                    },
                  },
                  {
                    key: "actions",
                    header: "",
                    className: "text-right",
                    render: (row) => (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(row as unknown as Certificate)}
                          className="p-2 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                          title="Edit"
                        >
                          <HiPencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: row._id as string, label: row.certificateId as string })}
                          className="p-2 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/5"
                          title="Delete"
                        >
                          <HiTrash size={15} />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={certificates as unknown as Record<string, unknown>[]}
              />
            )}
          </DashboardGlassCard>
        </motion.div>
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface border border-surface-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-surface-hover/50">
                <h3 className="text-lg font-bold text-white font-heading">
                  {editingCert ? "Edit Certificate" : "Issue New Certificate"}
                </h3>
                <button onClick={closeModal} className="p-2 text-muted hover:text-white rounded-lg transition-colors">
                  <HiX size={20} />
                </button>
              </div>
              
              {/* Body */}
              <form onSubmit={handleSave} className="p-6 overflow-y-auto admin-scroll space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">Certificate ID</label>
                  <input 
                    type="text"
                    value={formData.certificateId} 
                    onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })} 
                    placeholder="e.g. STX-2026-001" 
                    className="w-full bg-surface-hover border border-surface-border text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    required 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">Recipient Name</label>
                  <input 
                    type="text"
                    value={formData.recipientName} 
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })} 
                    placeholder="e.g. John Doe" 
                    className="w-full bg-surface-hover border border-surface-border text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    required 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">Course, Role, or Title</label>
                  <input 
                    type="text"
                    value={formData.courseOrRole} 
                    onChange={(e) => setFormData({ ...formData, courseOrRole: e.target.value })} 
                    placeholder="e.g. Full Stack Web Development Internship" 
                    className="w-full bg-surface-hover border border-surface-border text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Start Date (Optional)</label>
                    <input 
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-surface-hover border border-surface-border text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">End Date (Optional)</label>
                    <input 
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-surface-hover border border-surface-border text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Duration (Optional)</label>
                    <input 
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 6 Months"
                      className="w-full bg-surface-hover border border-surface-border text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Issue Date</label>
                    <input 
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="w-full bg-surface-hover border border-surface-border text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      required
                    />
                  </div>
                </div>
                  
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">Status</label>
                  <AdminSelect 
                    options={[
                      { label: "Valid", value: "valid" },
                      { label: "Revoked", value: "revoked" },
                    ]}
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val as any })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Signature 1</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "signature1Url")}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary-light hover:file:bg-primary/20"
                    />
                    {formData.signature1Url && (
                      <img src={`${API}${formData.signature1Url}`} alt="Sig 1" className="h-10 mt-2 object-contain bg-white/5 p-1 rounded" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider">Signature 2</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "signature2Url")}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary-light hover:file:bg-primary/20"
                    />
                    {formData.signature2Url && (
                      <img src={`${API}${formData.signature2Url}`} alt="Sig 2" className="h-10 mt-2 object-contain bg-white/5 p-1 rounded" />
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <AdminButton type="button" variant="ghost" onClick={closeModal}>Cancel</AdminButton>
                  <AdminButton type="submit" loading={saving}>
                    {editingCert ? "Save Changes" : "Issue Certificate"}
                  </AdminButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Certificate?"
        itemLabel={deleteTarget?.label}
        description="This will permanently delete the certificate record. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
