"use client";

import { motion } from "framer-motion";
import { SectionHeading, GlassCard, Button } from "@/components/ui";
import {
    HiMail,
    HiPhone,
    HiLocationMarker,
    HiArrowRight,
} from "react-icons/hi";
import { FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { useState, FormEvent } from "react";

const serviceOptions = [
    "Web Development",
    "Business Automation",
    "Ad Tech Solutions",
    "SaaS Development",
    "E-Commerce",
    "Other",
];

const budgetOptions = [
    "Under $3,000",
    "$3,000 – $10,000",
    "$10,000 – $25,000",
    "$25,000 – $50,000",
    "$50,000+",
    "Not sure yet",
];

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        budget: "",
        description: "",
        timeline: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [recaptcha, setRecaptcha] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errs.email = "Valid email is required";
        if (!form.service) errs.service = "Please select a service";
        if (!form.description.trim()) errs.description = "Please describe your project";
        if (!recaptcha) errs.recaptcha = "Please verify you are human";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setSubmitted(true);
        }
    };

    return (
        <div className="pt-24 pb-20">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <SectionHeading
                        badge="Contact Us"
                        title="Let's Build Something Great Together"
                        subtitle="Book a free consultation and discover how StackX can deliver premium results at unbeatable costs."
                    />
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info Sidebar */}
                    <div className="space-y-6 lg:order-last">
                        <GlassCard hover={false}>
                            <h3
                                className="text-lg font-heading font-semibold mb-6"
                                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                            >
                                Get In Touch
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <HiMail className="w-5 h-5 text-primary-light" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Email</p>
                                        <p className="text-sm text-white">hello@stackx.dev</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <HiPhone className="w-5 h-5 text-primary-light" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Phone</p>
                                        <p className="text-sm text-white">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <HiLocationMarker className="w-5 h-5 text-primary-light" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Location</p>
                                        <p className="text-sm text-white">Visakhapatnam, India</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-surface-border">
                                <p className="text-xs text-muted mb-3">Follow us</p>
                                <div className="flex gap-3">
                                    {[
                                        { icon: FaTwitter, label: "Twitter" },
                                        { icon: FaLinkedinIn, label: "LinkedIn" },
                                        { icon: FaGithub, label: "GitHub" },
                                    ].map((s) => (
                                        <a
                                            key={s.label}
                                            href="#"
                                            aria-label={s.label}
                                            className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-muted hover:text-primary hover:bg-white/10 transition-all"
                                        >
                                            <s.icon size={16} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard hover={false}>
                            <h4
                                className="text-sm font-heading font-semibold mb-3"
                                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                            >
                                Response Time
                            </h4>
                            <p className="text-sm text-muted leading-relaxed">
                                We typically respond within <strong className="text-white">2 business hours</strong>.
                                For urgent inquiries, reach out via phone.
                            </p>
                        </GlassCard>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <GlassCard hover={false}>
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                                        <span className="text-4xl">🎉</span>
                                    </div>
                                    <h3
                                        className="text-2xl font-heading font-bold mb-3"
                                        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                                    >
                                        Thank You!
                                    </h3>
                                    <p className="text-muted max-w-md mx-auto mb-2">
                                        Your consultation request has been received. We&apos;ll get back to you within 2 business hours.
                                    </p>
                                    <p className="text-xs text-muted">
                                        A confirmation email has been sent to{" "}
                                        <span className="text-primary-light">{form.email || "your inbox"}</span>.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <h3
                                        className="text-xl font-heading font-semibold mb-1"
                                        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                                    >
                                        Book Free Consultation
                                    </h3>
                                    <p className="text-sm text-muted mb-6">
                                        Tell us about your project and we&apos;ll prepare a tailored proposal.
                                    </p>

                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <InputField
                                            label="Full Name *"
                                            value={form.name}
                                            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                                            error={errors.name}
                                            placeholder="John Doe"
                                        />
                                        <InputField
                                            label="Email *"
                                            type="email"
                                            value={form.email}
                                            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                                            error={errors.email}
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <InputField
                                            label="Phone Number"
                                            type="tel"
                                            value={form.phone}
                                            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                        <InputField
                                            label="Company"
                                            value={form.company}
                                            onChange={(v) => setForm((f) => ({ ...f, company: v }))}
                                            placeholder="Your Company"
                                        />
                                    </div>

                                    {/* Service Interest */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Service Interest *
                                        </label>
                                        <select
                                            value={form.service}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, service: e.target.value }))
                                            }
                                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-white focus:ring-1 focus:ring-primary/25 transition-all appearance-none cursor-pointer ${errors.service
                                                    ? "border-error"
                                                    : "border-white/10 focus:border-primary/50"
                                                }`}
                                        >
                                            <option value="" className="bg-surface text-muted">
                                                Select a service
                                            </option>
                                            {serviceOptions.map((s) => (
                                                <option key={s} value={s} className="bg-surface">
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.service && (
                                            <p className="text-error text-xs mt-1">{errors.service}</p>
                                        )}
                                    </div>

                                    {/* Budget */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Project Budget Range
                                        </label>
                                        <select
                                            value={form.budget}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, budget: e.target.value }))
                                            }
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-surface text-muted">
                                                Select budget range
                                            </option>
                                            {budgetOptions.map((b) => (
                                                <option key={b} value={b} className="bg-surface">
                                                    {b}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Project Description *
                                        </label>
                                        <textarea
                                            value={form.description}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, description: e.target.value }))
                                            }
                                            rows={5}
                                            placeholder="Describe your project requirements, goals, and any specific features you need..."
                                            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-white placeholder:text-muted/50 focus:ring-1 focus:ring-primary/25 transition-all resize-none ${errors.description
                                                    ? "border-error"
                                                    : "border-white/10 focus:border-primary/50"
                                                }`}
                                        />
                                        {errors.description && (
                                            <p className="text-error text-xs mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <InputField
                                        label="Preferred Timeline"
                                        value={form.timeline}
                                        onChange={(v) => setForm((f) => ({ ...f, timeline: v }))}
                                        placeholder="e.g., 2-3 months, ASAP, flexible"
                                    />

                                    {/* reCAPTCHA */}
                                    <div>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={recaptcha}
                                                onChange={(e) => setRecaptcha(e.target.checked)}
                                                className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary accent-primary cursor-pointer"
                                            />
                                            <span className="text-sm text-muted">
                                                I&apos;m not a robot (reCAPTCHA)
                                            </span>
                                        </label>
                                        {errors.recaptcha && (
                                            <p className="text-error text-xs mt-1">{errors.recaptcha}</p>
                                        )}
                                    </div>

                                    <Button type="submit" variant="primary" className="w-full py-4 text-base">
                                        Send Consultation Request <HiArrowRight />
                                    </Button>

                                    <p className="text-xs text-muted text-center">
                                        By submitting, you agree to our privacy policy. We&apos;ll never share your data.
                                    </p>
                                </form>
                            )}
                        </GlassCard>
                    </div>
                </div>
            </section>
        </div>
    );
}

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
            <label className="block text-sm font-medium text-white mb-2">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-white placeholder:text-muted/50 focus:ring-1 focus:ring-primary/25 transition-all ${error
                        ? "border-error focus:border-error"
                        : "border-white/10 focus:border-primary/50"
                    }`}
            />
            {error && <p className="text-error text-xs mt-1">{error}</p>}
        </div>
    );
}
