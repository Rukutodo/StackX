"use client";

import { motion } from "framer-motion";
import { GlassCard, Button, TestimonialCard } from "@/components/ui";
import { HiArrowLeft, HiArrowRight, HiCheckCircle } from "react-icons/hi";
import Link from "next/link";

const techStack = [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "AWS S3",
    "Vercel",
    "Tailwind CSS",
    "Framer Motion",
];

const results = [
    { metric: "3x", label: "Community Engagement Increase" },
    { metric: "45%", label: "Cost Savings vs. Competitors" },
    { metric: "99.9%", label: "Platform Uptime" },
    { metric: "2.1s", label: "Average Page Load Time" },
];

const features = [
    "Responsive event management dashboard",
    "Real-time community feed and notifications",
    "Integrated payment processing for events",
    "SEO-optimized landing pages for each community",
    "Admin panel with analytics and reporting",
    "Mobile-first design across all device sizes",
];

export default function CommunizeVizagPage() {
    return (
        <div className="pt-24 pb-20">
            {/* Back link */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary-light transition-colors"
                >
                    <HiArrowLeft className="w-4 h-4" /> Back to Portfolio
                </Link>
            </div>

            {/* Hero */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20 mb-4">
                            Case Study — Web Development
                        </span>
                        <h1
                            className="text-4xl sm:text-5xl font-heading font-bold mb-6"
                            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                        >
                            Communize <span className="gradient-text">VIZAG</span>
                        </h1>
                        <p className="text-muted text-lg leading-relaxed mb-6">
                            A comprehensive digital platform designed to bring communities together
                            in Visakhapatnam through events, engagement, and local networking.
                        </p>
                        <div className="flex gap-4">
                            <Button href="/contact" variant="primary">
                                Start a Similar Project <HiArrowRight />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Project Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-surface-light to-surface border border-surface-border flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-accent/8" />
                            <div className="relative z-10 text-center px-8">
                                <p className="text-5xl font-heading font-bold text-white/10 mb-2">CV</p>
                                <p className="text-sm text-muted">Communize VIZAG Platform</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Results */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map((r, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            >
                                <GlassCard className="text-center">
                                    <p className="text-3xl font-heading font-bold gradient-text mb-1">
                                        {r.metric}
                                    </p>
                                    <p className="text-xs text-muted">{r.label}</p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem & Solution */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <GlassCard>
                            <h3
                                className="text-xl font-heading font-semibold mb-4 text-error"
                                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                            >
                                ⚠️ The Problem
                            </h3>
                            <p className="text-muted text-sm leading-relaxed">
                                Communize VIZAG had no unified digital platform to manage their growing community
                                of 5,000+ members. Event management was done through scattered WhatsApp groups,
                                engagement tracking was non-existent, and their previous website was outdated,
                                slow, and not mobile-friendly. They needed a modern, scalable platform that
                                could handle real-time interactions — but previous quotes from agencies were
                                far beyond their budget.
                            </p>
                        </GlassCard>
                        <GlassCard>
                            <h3
                                className="text-xl font-heading font-semibold mb-4 text-success"
                                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                            >
                                ✅ The Solution
                            </h3>
                            <p className="text-muted text-sm leading-relaxed">
                                StackX built a comprehensive Next.js-powered platform with real-time community
                                feeds, event management, integrated payments, and an admin dashboard — all at
                                45% less cost than competing quotes. We leveraged serverless architecture on
                                AWS to minimize infrastructure costs while maintaining 99.9% uptime. The
                                mobile-first design ensured seamless access across all devices.
                            </p>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 bg-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3
                        className="text-2xl font-heading font-bold mb-8 text-center"
                        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    >
                        Technologies Used
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {techStack.map((tech) => (
                            <span
                                key={tech}
                                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-white/5 border border-white/10 text-muted hover:border-primary/30 hover:text-white transition-all"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3
                        className="text-2xl font-heading font-bold mb-8 text-center"
                        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    >
                        Key Features Delivered
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="flex items-center gap-3"
                            >
                                <HiCheckCircle className="w-5 h-5 text-success shrink-0" />
                                <span className="text-sm text-muted">{f}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="py-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TestimonialCard
                        name="Rajesh Kumar"
                        company="Communize VIZAG"
                        feedback="StackX transformed our digital presence completely. Their attention to detail and cost-effective approach saved us over 35% compared to other agencies while delivering superior quality. The platform has tripled our community engagement."
                        rating={5}
                        projectType="Web Development"
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2
                        className="text-3xl font-heading font-bold mb-4"
                        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                    >
                        Want Similar Results?
                    </h2>
                    <p className="text-muted text-lg mb-8">
                        Let&apos;s discuss how we can build a solution that matches your goals and budget.
                    </p>
                    <Button href="/contact" variant="primary" className="text-base px-8 py-4">
                        Get Free Consultation <HiArrowRight />
                    </Button>
                </div>
            </section>
        </div>
    );
}
