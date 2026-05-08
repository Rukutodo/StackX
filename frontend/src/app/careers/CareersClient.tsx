"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  HiChevronDown,
  HiBriefcase,
  HiLocationMarker,
  HiClock,
  HiCheckCircle,
  HiArrowRight,
  HiTrendingUp,
  HiGlobe,
  HiCurrencyDollar,
  HiSparkles,
  HiX,
  HiDocumentText,
  HiCheck,
} from "react-icons/hi";
import { useState, FormEvent, useRef, useEffect } from "react";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

/* ── Types ─────────────────────────────────────── */

export interface JobPosting {
  _id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  status: string;
  order: number;
}

/* ── Perks data ─────────────────────────────────── */

const PERKS = [
  {
    icon: HiGlobe,
    label: "Remote-First",
    desc: "Work from anywhere in the world",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: HiTrendingUp,
    label: "Growth & Learning",
    desc: "Continuous learning budget & mentorship",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: HiClock,
    label: "Flexible Hours",
    desc: "Async-friendly, results-driven culture",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: HiCurrencyDollar,
    label: "Competitive Pay",
    desc: "Market-rate + equity opportunities",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

/* ── Job Listing Card ───────────────────────────── */

function JobListing({
  job,
  onApply,
  index,
}: {
  job: JobPosting;
  onApply: (title: string) => void;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  const typeColor =
    job.type?.toLowerCase().includes("full")
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : job.type?.toLowerCase().includes("part")
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-blue-500/10 text-blue-400 border-blue-500/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        open
          ? "border-purple-500/40 shadow-lg shadow-purple-500/10 bg-[rgba(139,92,246,0.04)]"
          : "border-white/[0.08] bg-[rgba(19,19,26,0.7)] hover:border-purple-500/25 hover:shadow-md hover:shadow-purple-500/5"
      }`}
      style={{ backdropFilter: "blur(20px)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left cursor-pointer p-5 sm:p-6"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${typeColor}`}>
              {job.type}
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/20">
              {job.department}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-rose-500/10 text-rose-300 border-rose-500/20 animate-pulse">
              Now Hiring
            </span>
          </div>
          <h3
            className="text-base sm:text-lg font-semibold text-white truncate"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <HiLocationMarker className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <HiBriefcase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              {job.department}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`hidden sm:flex items-center gap-1 text-xs font-medium text-purple-300 transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          >
            View Details
          </span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              open ? "bg-purple-500/20 rotate-180" : "bg-white/5 hover:bg-purple-500/15"
            }`}
          >
            <HiChevronDown className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-white/5 pt-5 space-y-5">
              <p className="text-sm text-gray-300 leading-relaxed">{job.description}</p>
              {job.requirements.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <HiCheckCircle className="w-4 h-4 text-purple-400" />
                    Requirements
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2.5 bg-white/[0.03] rounded-lg px-3 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => onApply(job.title)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Apply for this Role
                <HiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Reusable Input Field ───────────────────────── */

function InputField({
  label, value, onChange, error, type = "text", placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}{required && <span className="text-purple-400 ml-0.5">*</span>}
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/[0.04] border transition-all duration-200 focus:outline-none ${
          error ? "border-red-500/50 focus:border-red-500/70 bg-red-500/[0.04]"
                : "border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.06]"
        }`}
      />
      {error && <p className="text-red-400 text-xs flex items-center gap-1"><HiX className="w-3 h-3 shrink-0" />{error}</p>}
    </div>
  );
}

/* ── Position Custom Dropdown ───────────────────── */

function PositionDropdown({
  jobs, value, onChange, error,
}: {
  jobs: JobPosting[]; value: string; onChange: (v: string) => void; error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Build options: only active jobs from backend
  const options = jobs.map((j) => ({ label: j.title, sub: j.department, value: j.title }));

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Position Applied For <span className="text-purple-400">*</span>
      </label>

      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className={`w-full px-4 py-3 rounded-xl text-sm flex items-center justify-between cursor-pointer transition-all duration-200 border select-none ${
          error
            ? "border-red-500/50 bg-red-500/[0.04]"
            : open
            ? "border-purple-500/50 bg-white/[0.06]"
            : "border-white/[0.08] bg-white/[0.04] hover:border-purple-500/30 hover:bg-white/[0.05]"
        }`}
      >
        <div className="flex-1 min-w-0">
          {selected ? (
            <div>
              <p className="text-white font-medium truncate">{selected.label}</p>
              <p className="text-xs text-gray-500 truncate">{selected.sub}</p>
            </div>
          ) : (
            <span className="text-gray-500">— Select a position —</span>
          )}
        </div>
        <HiChevronDown
          className={`w-5 h-5 text-gray-500 shrink-0 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/40"
            style={{
              background: "rgba(15,15,22,0.97)",
              backdropFilter: "blur(24px)",
              top: "calc(100% + 4px)",
              left: 0,
            }}
          >
            {/* Header */}
            <div className="px-4 pt-3 pb-2 border-b border-white/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
                {jobs.length > 0 ? `${jobs.length} Active Position${jobs.length > 1 ? "s" : ""}` : "No open positions"}
              </p>
            </div>

            <div className="max-h-56 overflow-y-auto py-1.5">
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`mx-1.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-purple-500/15 text-purple-200"
                        : "hover:bg-white/[0.05] text-gray-300 hover:text-white"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{opt.label}</p>
                      <p className={`text-xs truncate ${isSelected ? "text-purple-400" : "text-gray-500"}`}>
                        {opt.sub}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center shrink-0">
                        <HiCheck className="w-3 h-3 text-purple-300" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-red-400 text-xs flex items-center gap-1"><HiX className="w-3 h-3 shrink-0" />{error}</p>}
    </div>
  );
}

/* ── Section Label ──────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-5 pb-3 border-b border-white/[0.06]">
      {children}
    </p>
  );
}

/* ── Main Client Component ──────────────────────── */

export default function CareersClient({ jobs }: { jobs: JobPosting[] }) {
  const [applyingFor, setApplyingFor] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", experience: "",
    portfolioLink: "", linkedIn: "", coverLetter: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleApply = (title: string) => {
    setApplyingFor(title);
    setSubmitted(false);
    setSubmitError("");
    setTimeout(() => {
      document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!applyingFor.trim()) errs.position = "Please select a position";
    if (!form.coverLetter.trim()) errs.coverLetter = "Cover letter is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("position", applyingFor);
      fd.append("experience", form.experience);
      fd.append("portfolioLink", form.portfolioLink);
      fd.append("linkedIn", form.linkedIn);
      fd.append("coverLetter", form.coverLetter);
      const resumeFile = fileRef.current?.files?.[0];
      if (resumeFile) fd.append("resume", resumeFile);
      const res = await fetch(`${API}/api/applications`, { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit");
      }
      setSubmitted(true);
      setForm({ fullName: "", email: "", phone: "", experience: "", portfolioLink: "", linkedIn: "", coverLetter: "" });
      setApplyingFor("");
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>

      {/* ══ HERO ══ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, #06B6D4 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 mb-6">
              <HiSparkles className="w-3.5 h-3.5" /> We&apos;re Hiring
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Build the Future{" "}
            <span className="block" style={{ background: "linear-gradient(135deg, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              With Us
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            We&apos;re always looking for talented people who share our passion for building exceptional software at accessible costs.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3">
            <a href="#open-positions" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-200">
              View Openings <HiArrowRight className="w-4 h-4" />
            </a>
            <a href="#application-form" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20 transition-all duration-200">
              Apply Directly
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══ PERKS ══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-8">
          Why join StackX?
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERKS.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`relative group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${perk.border} overflow-hidden`}
                style={{ background: "rgba(19,19,26,0.7)", backdropFilter: "blur(20px)" }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${perk.color} border ${perk.border}`}>
                  <Icon className={`w-5 h-5 ${perk.iconColor}`} />
                </div>
                <h3 className="relative text-sm font-semibold text-white mb-1" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{perk.label}</h3>
                <p className="relative text-xs text-gray-400 leading-relaxed">{perk.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══ OPEN POSITIONS ══ */}
      <section id="open-positions" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 scroll-mt-24">
        <div className="flex items-center gap-3 mb-8">
          <motion.h2 initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Open Positions
          </motion.h2>
          {jobs.length > 0 && (
            <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {jobs.length} {jobs.length === 1 ? "role" : "roles"}
            </span>
          )}
        </div>
        {jobs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/[0.08] bg-[rgba(19,19,26,0.7)] p-12 text-center"
            style={{ backdropFilter: "blur(20px)" }}>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <HiBriefcase className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">No open positions right now</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              We&apos;re not actively hiring, but you can still apply below — we&apos;ll reach out when the right role opens.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => <JobListing key={job._id} job={job} onApply={handleApply} index={i} />)}
          </div>
        )}
      </section>

      {/* ══ APPLICATION FORM ══ */}
      <section id="application-form" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 mb-4">
            Join the Team
          </span>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Apply Now
          </h2>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            {applyingFor
              ? <><span className="text-gray-500">Applying for: </span><span className="text-purple-300 font-semibold">{applyingFor}</span></>
              : "Fill in the form below — we read every single application."}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/[0.08] overflow-hidden"
          style={{ background: "rgba(19,19,26,0.85)", backdropFilter: "blur(28px)" }}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center px-6 sm:px-12 py-16 sm:py-20">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                      <HiCheckCircle className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.2) 0%, transparent 70%)", filter: "blur(24px)" }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                  Application Submitted! 🎉
                </h3>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-8">
                  Thanks for applying to StackX! We&apos;ll carefully review your application and get back to you within 5 business days.
                </p>
                <button onClick={() => { setSubmitted(false); setApplyingFor(""); }}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4">
                  Submit another application
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-5 sm:p-8 space-y-8">

                {/* 1. Personal Info */}
                <div>
                  <SectionLabel>Personal Information</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <InputField label="Full Name" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))}
                      error={errors.fullName} placeholder="John Doe" required />
                    <InputField label="Email Address" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                      error={errors.email} placeholder="john@example.com" required />
                    <InputField label="Phone Number" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                      error={errors.phone} placeholder="+91 9490973391" required />
                    <InputField label="Years of Experience" value={form.experience} onChange={(v) => setForm((f) => ({ ...f, experience: v }))}
                      placeholder="e.g. 3 years" />
                  </div>
                </div>

                {/* 2. Role Details */}
                <div>
                  <SectionLabel>Role Details</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Position — custom dropdown populated from backend jobs */}
                    <div className="relative">
                      <PositionDropdown
                        jobs={jobs}
                        value={applyingFor}
                        onChange={(v) => { setApplyingFor(v); setErrors((e) => ({ ...e, position: "" })); }}
                        error={errors.position}
                      />
                    </div>

                    {/* Resume upload */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Resume / CV</label>
                      <div className="relative">
                        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg"
                          onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full px-4 py-3 rounded-xl text-sm border border-dashed border-white/[0.12] bg-white/[0.03] hover:border-purple-500/40 hover:bg-purple-500/[0.04] transition-all duration-200 flex items-center gap-3 min-h-[48px]">
                          <HiDocumentText className="w-4 h-4 text-purple-400 shrink-0" />
                          <span className={`text-sm truncate flex-1 ${fileName ? "text-white" : "text-gray-600"}`}>
                            {fileName || "PDF, JPG, JPEG accepted"}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 font-medium border border-purple-500/20 whitespace-nowrap shrink-0">
                            Browse
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Online Presence */}
                <div>
                  <SectionLabel>Online Presence</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <InputField label="Portfolio / Website" value={form.portfolioLink} onChange={(v) => setForm((f) => ({ ...f, portfolioLink: v }))}
                      placeholder="https://myportfolio.com" />
                    <InputField label="LinkedIn Profile" value={form.linkedIn} onChange={(v) => setForm((f) => ({ ...f, linkedIn: v }))}
                      placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>

                {/* 4. Cover Letter */}
                <div>
                  <SectionLabel>Cover Letter <span className="text-purple-400 normal-case font-normal tracking-normal">*</span></SectionLabel>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tell us about yourself</label>
                    <textarea value={form.coverLetter} onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
                      rows={6} placeholder="Why are you a great fit for this role? What excites you about working at StackX?"
                      className={`w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/[0.04] border transition-all duration-200 focus:outline-none resize-none leading-relaxed ${
                        errors.coverLetter ? "border-red-500/50 focus:border-red-500/70" : "border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.06]"
                      }`} />
                    {errors.coverLetter && <p className="text-red-400 text-xs flex items-center gap-1"><HiX className="w-3 h-3 shrink-0" />{errors.coverLetter}</p>}
                  </div>
                </div>

                {submitError && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                    <HiX className="w-4 h-4 shrink-0 mt-0.5" />{submitError}
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2">
                  {submitting ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>Submitting Application...</>
                  ) : (<>Submit Application<HiArrowRight className="w-4 h-4" /></>)}
                </button>

                <p className="text-center text-xs text-gray-600">
                  We respond to every application — usually within 5 business days.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
