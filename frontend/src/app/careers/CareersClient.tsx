"use client";

import { motion } from "framer-motion";
import { SectionHeading, GlassCard, Button } from "@/components/ui";
import {
  HiChevronDown,
  HiBriefcase,
  HiLocationMarker,
  HiClock,
} from "react-icons/hi";
import { useState, FormEvent, useRef } from "react";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

/* ── Types ──────────────────────────────────────── */

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
  applicants?: number;
}

/* ── Job Listing Component ─────────────────────── */

function JobListing({
  job,
  onApply,
}: {
  job: JobPosting;
  onApply: (title: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left cursor-pointer"
      >
        <div>
          <h3
            className="text-lg font-heading font-semibold text-white"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted">
            <span className="flex items-center gap-1">
              <HiBriefcase className="w-3.5 h-3.5" /> {job.department}
            </span>
            <span className="flex items-center gap-1">
              <HiClock className="w-3.5 h-3.5" /> {job.type}
            </span>
            <span className="flex items-center gap-1">
              <HiLocationMarker className="w-3.5 h-3.5" /> {job.location}
            </span>
          </div>
        </div>
        <HiChevronDown
          className={`w-5 h-5 text-muted transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-6 space-y-4">
          <p className="text-sm text-muted leading-relaxed">{job.description}</p>
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Requirements</h4>
            <ul className="space-y-1.5">
              {job.requirements.map((r, i) => (
                <li key={i} className="text-sm text-muted flex items-start gap-2">
                  <span className="text-primary-light mt-1">•</span> {r}
                </li>
              ))}
            </ul>
          </div>
          <Button variant="primary" onClick={() => onApply(job.title)}>
            Apply Now
          </Button>
        </div>
      </motion.div>
    </GlassCard>
  );
}

/* ── Input Field Component ─────────────────────── */

function InputField({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-white placeholder:text-muted/50 focus:ring-1 focus:ring-primary/25 transition-all ${
          error ? "border-error focus:border-error" : "border-white/10 focus:border-primary/50"
        }`}
      />
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ── Main Client Component ─────────────────────── */

export default function CareersClient({ jobs }: { jobs: JobPosting[] }) {
  const [applyingFor, setApplyingFor] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    portfolioLink: "",
    linkedIn: "",
    coverLetter: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleApply = (title: string) => {
    setApplyingFor(title);
    setForm((f) => ({ ...f, position: title }));
    setSubmitted(false);
    setSubmitError("");
    document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.position.trim()) errs.position = "Position is required";
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
      fd.append("position", form.position);
      fd.append("experience", form.experience);
      fd.append("portfolioLink", form.portfolioLink);
      fd.append("linkedIn", form.linkedIn);
      fd.append("coverLetter", form.coverLetter);

      const resumeFile = fileRef.current?.files?.[0];
      if (resumeFile) {
        fd.append("resume", resumeFile);
      }

      const res = await fetch(`${API}/api/applications`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit");
      }

      setSubmitted(true);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        portfolioLink: "",
        linkedIn: "",
        coverLetter: "",
      });
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="Careers"
            title="Build the Future With Us"
            subtitle="We're always looking for talented people who share our passion for building exceptional software at accessible costs."
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: "🌍", label: "Remote-First" },
            { emoji: "📈", label: "Growth & Learning" },
            { emoji: "⏰", label: "Flexible Hours" },
            { emoji: "💰", label: "Competitive Pay" },
          ].map((b, i) => (
            <GlassCard key={i} className="text-center py-6">
              <span className="text-2xl mb-2 block">{b.emoji}</span>
              <span className="text-sm font-medium text-white">{b.label}</span>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Job Listings */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h3
          className="text-2xl font-heading font-bold mb-8 text-center"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          Open Positions
        </h3>
        {jobs.length === 0 ? (
          <GlassCard>
            <p className="text-muted text-sm text-center py-10">
              No open positions at the moment. Check back soon!
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobListing key={job._id} job={job} onApply={handleApply} />
            ))}
          </div>
        )}
      </section>

      {/* Application Form */}
      <section
        id="application-form"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <GlassCard hover={false}>
          <h3
            className="text-2xl font-heading font-bold mb-2 text-center"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Apply Now
          </h3>
          <p className="text-sm text-muted text-center mb-8">
            {applyingFor
              ? `Applying for: ${applyingFor}`
              : "Select a position above or fill in the form below"}
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h4 className="text-xl font-heading font-semibold mb-2">
                Application Submitted!
              </h4>
              <p className="text-muted text-sm">
                Thank you for your interest. We&apos;ll review your application and get back to you within 5 business days.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField
                  label="Full Name *"
                  value={form.fullName}
                  onChange={(v) => setForm((f) => ({ ...f, fullName: v }))}
                  error={errors.fullName}
                  placeholder="John Doe"
                />
                <InputField
                  label="Email *"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  error={errors.email}
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField
                  label="Phone Number *"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                  error={errors.phone}
                  placeholder="+91 98765 43210"
                />
                <InputField
                  label="Position Applied For *"
                  value={form.position}
                  onChange={(v) => setForm((f) => ({ ...f, position: v }))}
                  error={errors.position}
                  placeholder="Full-Stack Developer"
                />
              </div>
              <InputField
                label="Years of Experience"
                value={form.experience}
                onChange={(v) => setForm((f) => ({ ...f, experience: v }))}
                placeholder="e.g. 5 years"
              />
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Resume / CV Upload
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary-light cursor-pointer"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField
                  label="Portfolio Link"
                  value={form.portfolioLink}
                  onChange={(v) => setForm((f) => ({ ...f, portfolioLink: v }))}
                  placeholder="https://portfolio.com"
                />
                <InputField
                  label="LinkedIn Profile"
                  value={form.linkedIn}
                  onChange={(v) => setForm((f) => ({ ...f, linkedIn: v }))}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={form.coverLetter}
                  onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
                  rows={5}
                  placeholder="Tell us why you'd be a great fit..."
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-white placeholder:text-muted/50 focus:ring-1 focus:ring-primary/25 transition-all resize-none ${
                    errors.coverLetter
                      ? "border-error focus:border-error"
                      : "border-white/10 focus:border-primary/50"
                  }`}
                />
                {errors.coverLetter && (
                  <p className="text-error text-xs mt-1">{errors.coverLetter}</p>
                )}
              </div>
              {submitError && <p className="text-red-400 text-sm">{submitError}</p>}
              <Button type="submit" variant="primary" className="w-full py-4" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          )}
        </GlassCard>
      </section>
    </div>
  );
}
