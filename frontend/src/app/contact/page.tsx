"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiArrowRight,
  HiSparkles,
  HiX,
  HiCheckCircle,
  HiClock,
  HiSelector,
  HiChat,
} from "react-icons/hi";
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { useState, useEffect, useRef, FormEvent } from "react";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

const serviceOptions = [
  "Web Development",
  "Business Automation",
  "Ad Tech Solutions",
  "SaaS Development",
  "E-Commerce",
  "Other",
];



const contactInfo = [
  {
    icon: HiMail,
    label: "Email",
    value: "hello@stackx.co.in",
    href: "mailto:hello@stackx.co.in",
    color: "from-purple-500/20 to-violet-500/20",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: HiPhone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: HiLocationMarker,
    label: "Location",
    value: "Visakhapatnam, India",
    href: "https://maps.google.com/?q=Visakhapatnam",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: HiClock,
    label: "Response Time",
    value: "Within 2 business hours",
    href: null,
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
];

const socials = [
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
  { icon: FaGithub, label: "GitHub", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
];

/* ── Custom Select Dropdown ─────────────────────────── */
function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  required,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        {label}
        {required && <span className="text-purple-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className={`w-full px-4 py-3 rounded-xl text-sm flex items-center justify-between cursor-pointer transition-all duration-200 border ${
            error
              ? "border-red-500/50 bg-red-500/[0.04]"
              : open
              ? "border-purple-500/50 bg-white/[0.06]"
              : "border-white/[0.08] bg-white/[0.04] hover:border-purple-500/30 hover:bg-white/[0.05]"
          }`}
        >
          <span className={!value ? "text-gray-500" : "text-white"}>{value || placeholder}</span>
          <HiSelector className="w-5 h-5 text-gray-500 shrink-0" />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute top-[calc(100%+6px)] left-0 w-full rounded-xl border border-white/[0.08] bg-[#13131a] shadow-2xl overflow-hidden z-50"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <div className="max-h-52 overflow-y-auto py-1.5">
                {options.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => { onChange(opt); setOpen(false); }}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 flex items-center gap-2 ${
                      value === opt
                        ? "bg-purple-500/20 text-purple-300"
                        : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${value === opt ? "bg-purple-400" : "bg-gray-600"}`} />
                    {opt}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <HiX className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Input Field ─────────────────────────────────────── */
function InputField({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
        {required && <span className="text-purple-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/[0.04] border transition-all duration-200 focus:outline-none ${
          error
            ? "border-red-500/50 focus:border-red-500/70 bg-red-500/[0.04]"
            : "border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.06]"
        }`}
      />
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <HiX className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email is required";
    if (!form.service) errs.service = "Please select a service";
    if (!form.description.trim()) errs.description = "Please describe your project";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send message");
      }
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)", filter: "blur(90px)" }}
          />
          <div
            className="absolute top-20 right-[10%] w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, #06B6D4 0%, transparent 70%)", filter: "blur(70px)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 mb-6">
              <HiSparkles className="w-3.5 h-3.5" />
              Free Consultation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Let&apos;s Build Something{" "}
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #A78BFA, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Great Together
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Book a free consultation and discover how StackX can deliver premium results at
            unbeatable costs. We respond within 2 business hours.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════ CONTACT INFO CARDS ═══════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map((item, i) => {
            const Icon = item.icon;
            const Wrapper = item.href ? "a" : "div";
            const wrapperProps = item.href
              ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                {/* @ts-ignore */}
                <Wrapper
                  {...wrapperProps}
                  className={`group relative rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.border} overflow-hidden block`}
                  style={{ background: "rgba(19,19,26,0.7)", backdropFilter: "blur(20px)" }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${item.color} border ${item.border}`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <p className="relative text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{item.label}</p>
                  <p className="relative text-sm font-medium text-white">{item.value}</p>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── Left Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Why Choose Us */}
            <div
              className="rounded-2xl border border-white/[0.08] p-6"
              style={{ background: "rgba(19,19,26,0.85)", backdropFilter: "blur(28px)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                  <HiSparkles className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Why StackX?</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Free consultation, no strings attached",
                  "Enterprise quality at startup prices",
                  "Reply within 2 business hours",
                  "100% project delivery rate",
                  "Transparent pricing, no hidden fees",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <HiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div
              className="rounded-2xl border border-white/[0.08] p-6"
              style={{ background: "rgba(19,19,26,0.85)", backdropFilter: "blur(28px)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                  <HiChat className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Follow Us</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] hover:border-purple-500/25 transition-all duration-200 text-sm"
                  >
                    <s.icon size={15} />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div
              className="rounded-2xl border border-white/[0.08] overflow-hidden"
              style={{ background: "rgba(19,19,26,0.85)", backdropFilter: "blur(28px)" }}
            >
              <AnimatePresence mode="wait">
                {/* ── Success ── */}
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center px-8 py-20"
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                        >
                          <HiCheckCircle className="w-10 h-10 text-emerald-400" />
                        </motion.div>
                      </div>
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.2) 0%, transparent 70%)", filter: "blur(24px)" }}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                      Message Received! 🎉
                    </h3>
                    <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-2">
                      Thanks for reaching out! We&apos;ll get back to you within 2 business hours with a tailored proposal.
                    </p>
                    <p className="text-xs text-gray-500 mb-8">
                      Confirmation sent to{" "}
                      <span className="text-purple-400">{form.email || "your inbox"}</span>
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", company: "", service: "", description: "" }); }}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4"
                    >
                      Send another message
                    </button>
                  </motion.div>

                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 sm:p-8 space-y-8"
                  >
                    {/* Header */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Free Consultation</p>
                      <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                        Book Your Call
                      </h2>
                      <p className="text-sm text-gray-500">
                        Tell us about your project and we&apos;ll prepare a tailored proposal.
                      </p>
                    </div>

                    {/* ── Personal Info ── */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4 pb-3 border-b border-white/[0.06]">
                        Your Details
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                          label="Full Name"
                          value={form.name}
                          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                          error={errors.name}
                          placeholder="John Doe"
                          required
                        />
                        <InputField
                          label="Email"
                          type="email"
                          value={form.email}
                          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                          error={errors.email}
                          placeholder="john@company.com"
                          required
                        />
                        <InputField
                          label="Phone"
                          type="tel"
                          value={form.phone}
                          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                          placeholder="+91 98765 43210"
                        />
                        <InputField
                          label="Company"
                          value={form.company}
                          onChange={(v) => setForm((f) => ({ ...f, company: v }))}
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    {/* ── Project Info ── */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4 pb-3 border-b border-white/[0.06]">
                        Project Details
                      </p>
                      <div className="space-y-4">
                        <CustomSelect
                          label="Service Interest"
                          options={serviceOptions}
                          value={form.service}
                          onChange={(v) => { setForm((f) => ({ ...f, service: v })); setErrors((e) => ({ ...e, service: "" })); }}
                          placeholder="Select a service"
                          error={errors.service}
                          required
                        />

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Project Description <span className="text-purple-400">*</span>
                          </label>
                          <textarea
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            rows={5}
                            placeholder="Describe your project requirements, goals, and any specific features you need..."
                            className={`w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/[0.04] border transition-all duration-200 focus:outline-none resize-none leading-relaxed ${
                              errors.description
                                ? "border-red-500/50 focus:border-red-500/70"
                                : "border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.06]"
                            }`}
                          />
                          {errors.description && (
                            <p className="text-red-400 text-xs flex items-center gap-1">
                              <HiX className="w-3 h-3 shrink-0" />
                              {errors.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>


                    {/* Error */}
                    {submitError && (
                      <div className="px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                        <HiX className="w-4 h-4 shrink-0 mt-0.5" />
                        {submitError}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending Request...
                        </>
                      ) : (
                        <>
                          Send Consultation Request
                          <HiArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-600 text-center">
                      By submitting, you agree to our privacy policy. We&apos;ll never share your data.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
