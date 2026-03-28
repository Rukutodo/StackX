"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiTrash, HiReply, HiEye, HiPhone, HiMail, HiOfficeBuilding, HiClock, HiCurrencyDollar } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  DashboardStatCard,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";
import { HiDocumentText, HiCheckCircle, HiArchive, HiArrowLeft } from "react-icons/hi";

const API = "http://localhost:4000";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  description: string;
  timeline: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const selectedMsg = messages.find((m) => m._id === selected);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/messages`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Auto-mark as read when selected
  const handleSelect = async (id: string) => {
    setSelected(id);
    const msg = messages.find((m) => m._id === id);
    if (msg && msg.status === "unread") {
      await updateStatus(id, "read");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API}/api/messages/${id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchMessages();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
    try {
      await fetch(`${API}/api/messages/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      setDeleteConfirm(null);
      if (selected === id) setSelected(null);
      fetchMessages();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const readCount = messages.filter((m) => m.status === "read").length;
  const archivedCount = messages.filter((m) => m.status === "archived").length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          Messages
        </h1>
        <p className="text-muted text-sm mt-1">
          Contact form submissions — {unreadCount} unread
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <DashboardStatCard icon={<HiDocumentText size={20} />} label="Total Messages" value={messages.length} />
        <DashboardStatCard icon={<HiMail size={20} />} label="Unread" value={unreadCount} iconBg="bg-cyan-500/10" />
        <DashboardStatCard icon={<HiCheckCircle size={20} />} label="Read" value={readCount} iconBg="bg-emerald-500/10" />
        <DashboardStatCard icon={<HiArchive size={20} />} label="Archived" value={archivedCount} iconBg="bg-amber-500/10" />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Message list */}
        <DashboardGlassCard className={`lg:col-span-2 p-0 overflow-hidden flex-col ${selectedMsg ? "hidden lg:flex" : "flex"}`}>
          <div className="p-4 border-b border-surface-border shrink-0">
            <DashboardSectionHeader title="Inbox" subtitle={`${messages.length} messages`} />
          </div>
          <div className="flex-1 overflow-y-auto admin-scroll">
            {loading ? (
              <div className="py-10 text-center text-muted text-sm">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="py-10 text-center text-muted text-sm">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => handleSelect(msg._id)}
                  className={`w-full text-left px-4 py-3.5 border-b border-white/[0.03] transition-all cursor-pointer ${
                    selected === msg._id
                      ? "bg-primary/8 border-l-2 border-l-primary"
                      : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${msg.status === "unread" ? "text-white" : "text-muted"}`}>
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-muted">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className={`text-xs truncate ${msg.status === "unread" ? "text-white/80 font-medium" : "text-muted"}`}>
                    {msg.service} {msg.company ? `— ${msg.company}` : ""}
                  </p>
                  <p className="text-[11px] text-muted/60 truncate mt-0.5">{msg.description.slice(0, 80)}…</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {msg.status === "unread" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                    <span className="text-[10px] text-muted">{formatDate(msg.createdAt)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </DashboardGlassCard>

        {/* Message detail */}
        <DashboardGlassCard className={`lg:col-span-3 p-0 overflow-hidden flex-col ${selectedMsg ? "flex" : "hidden lg:flex"}`}>
          {selectedMsg ? (
            <div className="flex flex-col h-full">
              {/* Mobile Back Button */}
              <div className="lg:hidden p-4 border-b border-surface-border shrink-0 bg-white/5">
                <button onClick={() => setSelected(null)} className="flex items-center text-sm font-medium text-white hover:text-primary-light transition">
                  <HiArrowLeft className="mr-2" size={16} /> Back to Messages
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 admin-scroll">
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-surface-border">
                  <div>
                  <h3 className="text-white font-semibold">{selectedMsg.name}</h3>
                  <p className="text-sm text-muted mt-1">
                    <a href={`mailto:${selectedMsg.email}`} className="text-primary-light hover:underline">{selectedMsg.email}</a>
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StatusBadge status={selectedMsg.status} />
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary-light rounded-full border border-primary/20">
                      {selectedMsg.service}
                    </span>
                    <span className="text-xs text-muted">{formatDate(selectedMsg.createdAt)} at {formatTime(selectedMsg.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {selectedMsg.status !== "archived" && (
                    <AdminButton variant="ghost" size="sm" onClick={() => updateStatus(selectedMsg._id, "archived")}>
                      <HiArchive size={14} />
                    </AdminButton>
                  )}
                  {selectedMsg.status === "archived" && (
                    <AdminButton variant="ghost" size="sm" onClick={() => updateStatus(selectedMsg._id, "read")}>
                      <HiEye size={14} />
                    </AdminButton>
                  )}
                  <button
                    onClick={() => handleDelete(selectedMsg._id)}
                    className={`p-2 rounded-lg transition text-sm ${deleteConfirm === selectedMsg._id ? "bg-red-500/10 text-red-400" : "text-muted hover:text-red-400 hover:bg-red-500/5"}`}
                    title={deleteConfirm === selectedMsg._id ? "Click again to confirm" : "Delete"}
                  >
                    <HiTrash size={14} />
                  </button>
                </div>
              </div>

              {/* Contact details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {selectedMsg.phone && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <HiPhone className="text-primary-light shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Phone</p>
                      <a href={`tel:${selectedMsg.phone}`} className="text-xs text-white hover:text-primary-light transition">{selectedMsg.phone}</a>
                    </div>
                  </div>
                )}
                {selectedMsg.company && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <HiOfficeBuilding className="text-primary-light shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Company</p>
                      <p className="text-xs text-white">{selectedMsg.company}</p>
                    </div>
                  </div>
                )}
                {selectedMsg.budget && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <HiCurrencyDollar className="text-primary-light shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Budget</p>
                      <p className="text-xs text-white">{selectedMsg.budget}</p>
                    </div>
                  </div>
                )}
                {selectedMsg.timeline && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <HiClock className="text-primary-light shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Timeline</p>
                      <p className="text-xs text-white">{selectedMsg.timeline}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "var(--font-poppins)" }}>Project Description</h4>
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-muted/90 leading-relaxed whitespace-pre-wrap">{selectedMsg.description}</p>
                </div>
              </div>

              {/* Reply button */}
              <div className="pt-4 mt-4 border-t border-surface-border">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.service} Inquiry`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-primary-deep text-white hover:opacity-90 transition-opacity"
                >
                  <HiReply size={16} /> Reply via Email
                </a>
              </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-5">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <HiReply size={24} className="text-muted/40" />
                </div>
                <p className="text-muted text-sm">Select a message to view</p>
              </div>
            </div>
          )}
        </DashboardGlassCard>
      </motion.div>
    </motion.div>
  );
}
