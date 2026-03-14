"use client";

import { motion } from "framer-motion";
import {
  DashboardGlassCard,
  DashboardSectionHeader,
  AdminButton,
} from "@/components/admin/ui";
import { HiSave, HiGlobe, HiMail, HiShieldCheck, HiColorSwatch, HiCode } from "react-icons/hi";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function SettingsField({ label, type = "text", placeholder, value, description }: {
  label: string; type?: string; placeholder?: string; value?: string; description?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-white font-medium mb-1.5">{label}</label>
      {description && <p className="text-xs text-muted mb-2">{description}</p>}
      {type === "textarea" ? (
        <textarea
          defaultValue={value}
          placeholder={placeholder}
          rows={3}
          className="admin-search w-full px-4 py-2.5 text-sm text-white rounded-xl placeholder:text-muted/60 resize-none"
        />
      ) : (
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className="admin-search w-full px-4 py-2.5 text-sm text-white rounded-xl placeholder:text-muted/60"
        />
      )}
    </div>
  );
}

function ToggleSwitch({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <button
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${defaultOn ? "bg-primary" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${defaultOn ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

export default function SettingsAdminPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl">
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          Settings
        </h1>
        <p className="text-muted text-sm mt-1">Configure your admin dashboard and website preferences</p>
      </motion.div>

      {/* General Settings */}
      <motion.div variants={item}>
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="General"
            subtitle="Basic site information"
            action={<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary-light"><HiGlobe size={18} /></div>}
          />
          <div className="space-y-5">
            <SettingsField label="Site Name" value="StackX" placeholder="Your company name" />
            <SettingsField label="Tagline" value="Professional Web Development at Unbeatable Costs" placeholder="Short tagline" />
            <SettingsField label="Contact Email" type="email" value="hello@stackx.dev" placeholder="admin@example.com" />
            <SettingsField label="Phone" value="+1 (555) 123-4567" placeholder="+1 (xxx) xxx-xxxx" />
            <SettingsField label="Address" value="Visakhapatnam, India" placeholder="City, Country" />
          </div>
        </DashboardGlassCard>
      </motion.div>

      {/* SEO Settings */}
      <motion.div variants={item}>
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="SEO"
            subtitle="Search engine optimization"
            action={<div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400"><HiCode size={18} /></div>}
          />
          <div className="space-y-5">
            <SettingsField
              label="Meta Title"
              value="StackX — Professional Web Development at Unbeatable Costs"
              description="Recommended: 50-60 characters"
            />
            <SettingsField
              label="Meta Description"
              type="textarea"
              value="StackX delivers high-performance web development, business automation, and ad tech solutions at unbeatable costs."
              description="Recommended: 150-160 characters"
            />
            <SettingsField
              label="Keywords"
              value="web development, software development, business automation, ad tech, SaaS"
              description="Comma-separated keywords"
            />
          </div>
        </DashboardGlassCard>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={item}>
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="Notifications"
            subtitle="Email and alert preferences"
            action={<div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400"><HiMail size={18} /></div>}
          />
          <div className="divide-y divide-surface-border">
            <ToggleSwitch label="New contact form submissions" description="Get notified when someone submits the contact form" defaultOn />
            <ToggleSwitch label="New career applications" description="Get notified when someone applies for a job" defaultOn />
            <ToggleSwitch label="Weekly summary report" description="Receive a weekly digest of site activity" />
            <ToggleSwitch label="System alerts" description="Critical alerts about site performance and errors" defaultOn />
          </div>
        </DashboardGlassCard>
      </motion.div>

      {/* Security */}
      <motion.div variants={item}>
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="Security"
            subtitle="Authentication and access"
            action={<div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400"><HiShieldCheck size={18} /></div>}
          />
          <div className="divide-y divide-surface-border">
            <ToggleSwitch label="Two-factor authentication" description="Add an extra layer of security to your account" />
            <ToggleSwitch label="reCAPTCHA on forms" description="Protect contact and career forms from spam" defaultOn />
            <ToggleSwitch label="Session timeout" description="Auto-logout after 30 minutes of inactivity" defaultOn />
          </div>
        </DashboardGlassCard>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={item}>
        <DashboardGlassCard>
          <DashboardSectionHeader
            title="Appearance"
            subtitle="Theme and display preferences"
            action={<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary-light"><HiColorSwatch size={18} /></div>}
          />
          <div className="divide-y divide-surface-border">
            <ToggleSwitch label="Dark mode" description="Use dark glassmorphism theme (default)" defaultOn />
            <ToggleSwitch label="Custom cursor" description="Show the animated dual-ring cursor on desktop" defaultOn />
            <ToggleSwitch label="Animations" description="Enable Framer Motion scroll and hover animations" defaultOn />
          </div>
        </DashboardGlassCard>
      </motion.div>

      {/* Save button */}
      <motion.div variants={item} className="flex justify-end pb-6">
        <AdminButton variant="primary" className="gap-1.5 px-8">
          <HiSave size={16} /> Save Changes
        </AdminButton>
      </motion.div>
    </motion.div>
  );
}
