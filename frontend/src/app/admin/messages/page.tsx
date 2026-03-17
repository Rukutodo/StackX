"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiTrash, HiReply, HiArchive } from "react-icons/hi";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  StatusBadge,
  AdminButton,
} from "@/components/admin/ui";

const messages = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", subject: "Website redesign inquiry", message: "Hi StackX team, I'm interested in redesigning our company website. We're looking for a modern, responsive design with e-commerce capabilities. Could we schedule a call to discuss the project scope and timeline?", date: "Mar 13, 2026", time: "2:30 PM", status: "unread" as const, service: "Web Development" },
  { id: 2, name: "Michael Chen", email: "michael@techcorp.io", subject: "Partnership proposal for SaaS project", message: "Hello, I represent TechCorp and we'd love to explore a partnership opportunity with StackX for our upcoming SaaS platform launch. We are impressed by your portfolio and would like to discuss terms.", date: "Mar 13, 2026", time: "10:15 AM", status: "unread" as const, service: "Web Development" },
  { id: 3, name: "Emily Davis", email: "emily@startup.co", subject: "Quote request for mobile app development", message: "We are a seed-stage startup looking for a cross-platform mobile app. The app is a marketplace for local services. Can you provide a ballpark estimate and timeline?", date: "Mar 12, 2026", time: "4:45 PM", status: "unread" as const, service: "Web Development" },
  { id: 4, name: "James Wilson", email: "james@agency.com", subject: "Ad tech integration support needed", message: "We need help integrating a programmatic ad platform into our existing website. We're currently serving ~2M impressions/month and need to scale. What solutions can you offer?", date: "Mar 11, 2026", time: "9:00 AM", status: "read" as const, service: "Ad Tech" },
  { id: 5, name: "Priya Sharma", email: "priya@fintech.in", subject: "CRM automation services", message: "Our fintech company needs a custom CRM with automated lead scoring and email workflows. We have about 5,000 leads per month. Looking for an end-to-end solution.", date: "Mar 10, 2026", time: "3:20 PM", status: "read" as const, service: "Automation" },
  { id: 6, name: "David Kim", email: "david@ecommerce.co", subject: "E-commerce platform upgrade", message: "We need to migrate our existing Shopify store to a custom Next.js solution for better performance and SEO. Currently doing $500K/month in revenue.", date: "Mar 9, 2026", time: "11:30 AM", status: "read" as const, service: "Web Development" },
  { id: 7, name: "Anna Lopez", email: "anna@marketing.co", subject: "Analytics dashboard requirements", message: "We need a real-time analytics dashboard that integrates with Google Ads, Facebook Ads, and our CRM. Looking for something similar to the AdPulse project in your portfolio.", date: "Mar 8, 2026", time: "5:00 PM", status: "read" as const, service: "Ad Tech" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function MessagesAdminPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedMsg = messages.find((m) => m.id === selected);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          Messages
        </h1>
        <p className="text-muted text-sm mt-1">
          Contact form submissions — {messages.filter((m) => m.status === "unread").length} unread
        </p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[calc(100vh-220px)]">
        {/* Message list */}
        <DashboardGlassCard className="lg:col-span-2 p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-surface-border shrink-0">
            <DashboardSectionHeader title="Inbox" subtitle={`${messages.length} messages`} />
          </div>
          <div className="flex-1 overflow-y-auto admin-scroll">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg.id)}
                className={`w-full text-left px-4 py-3.5 border-b border-white/[0.03] transition-all cursor-pointer ${
                  selected === msg.id
                    ? "bg-primary/8 border-l-2 border-l-primary"
                    : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${msg.status === "unread" ? "text-white" : "text-muted"}`}>
                    {msg.name}
                  </span>
                  <span className="text-[10px] text-muted">{msg.time}</span>
                </div>
                <p className={`text-xs truncate ${msg.status === "unread" ? "text-white/80 font-medium" : "text-muted"}`}>
                  {msg.subject}
                </p>
                <p className="text-[11px] text-muted/60 truncate mt-0.5">{msg.message.slice(0, 60)}…</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {msg.status === "unread" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                  <span className="text-[10px] text-muted">{msg.date}</span>
                </div>
              </button>
            ))}
          </div>
        </DashboardGlassCard>

        {/* Message detail */}
        <DashboardGlassCard className="lg:col-span-3 flex flex-col">
          {selectedMsg ? (
            <>
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-surface-border">
                <div>
                  <h3 className="text-white font-semibold">{selectedMsg.subject}</h3>
                  <p className="text-sm text-muted mt-1">
                    From <span className="text-primary-light">{selectedMsg.name}</span> &lt;{selectedMsg.email}&gt;
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={selectedMsg.status} />
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary-light rounded-full border border-primary/20">
                      {selectedMsg.service}
                    </span>
                    <span className="text-xs text-muted">{selectedMsg.date} at {selectedMsg.time}</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <AdminButton variant="ghost" size="sm"><HiArchive size={14} /></AdminButton>
                  <AdminButton variant="ghost" size="sm"><HiTrash size={14} /></AdminButton>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted/90 leading-relaxed whitespace-pre-wrap">{selectedMsg.message}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-surface-border">
                <AdminButton variant="primary" className="gap-1.5 w-full sm:w-auto">
                  <HiReply size={16} /> Reply
                </AdminButton>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
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
