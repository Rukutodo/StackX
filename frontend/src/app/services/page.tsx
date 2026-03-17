"use client";

import { motion } from "framer-motion";
import { SectionHeading, GlassCard, Button } from "@/components/ui";
import { HiCode, HiCog, HiChartBar, HiChevronDown, HiArrowRight } from "react-icons/hi";
import { useState } from "react";
import type { Metadata } from "next";

/* ── Data ───────────────────────────────────────── */

const categories = [
    {
        id: "web-development",
        icon: HiCode,
        title: "Web Development",
        tagline: "Custom-built digital experiences",
        color: "from-primary to-primary-deep",
        pricing: "$3,000",
        techStack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Vercel"],
        items: [
            {
                title: "Custom Web Applications",
                desc: "Full-stack applications built with modern frameworks like React, Next.js, and Node.js. We deliver scalable, maintainable, and high-performance solutions tailored to your business needs.",
            },
            {
                title: "SaaS Platform Development",
                desc: "End-to-end SaaS products with multi-tenancy, subscription management, user authentication, and analytics dashboards. Built for scale from day one.",
            },
            {
                title: "E-Commerce Solutions",
                desc: "High-converting online stores with seamless checkout experiences, inventory management, payment processing, and order fulfillment integrations.",
            },
            {
                title: "Progressive Web Apps",
                desc: "Native-like experiences on the web with offline capabilities, push notifications, and lightning-fast performance across all devices.",
            },
        ],
        caseStudy: { title: "Communize VIZAG", href: "/portfolio/communize-vizag" },
    },
    {
        id: "automation",
        icon: HiCog,
        title: "Business Automation",
        tagline: "Streamline & scale your operations",
        color: "from-accent to-accent-dark",
        pricing: "$2,500",
        techStack: ["Python", "Zapier", "n8n", "Selenium", "REST APIs", "Webhooks", "Docker"],
        items: [
            {
                title: "Workflow Automation",
                desc: "Eliminate repetitive tasks with intelligent automation pipelines. We connect your tools, automate data flows, and create custom triggers for your business processes.",
            },
            {
                title: "CRM & ERP Integration",
                desc: "Seamless integration between your CRM, ERP, and other business tools. Automated data syncing, report generation, and real-time notifications.",
            },
            {
                title: "Data Pipeline Automation",
                desc: "Automated data collection, transformation, and loading (ETL) pipelines that keep your analytics up-to-date and your team informed.",
            },
            {
                title: "Custom Bot Development",
                desc: "Intelligent chatbots, Slack bots, and notification systems that handle customer queries, internal requests, and routine tasks automatically.",
            },
        ],
        caseStudy: { title: "FlowSync Automation", href: "/portfolio" },
    },
    {
        id: "adtech",
        icon: HiChartBar,
        title: "Ad Tech Solutions",
        tagline: "Data-driven advertising technology",
        color: "from-primary-light to-accent",
        pricing: "$5,000",
        techStack: ["Python", "React", "BigQuery", "Google Ads API", "Meta API", "Kafka", "Redis"],
        items: [
            {
                title: "Programmatic Ad Platforms",
                desc: "Custom DSP/SSP platforms for programmatic advertising with real-time bidding, audience targeting, and campaign optimization.",
            },
            {
                title: "Analytics & Reporting Dashboards",
                desc: "Real-time analytics dashboards with custom KPIs, automated reporting, cross-channel attribution, and actionable insights.",
            },
            {
                title: "Ad Campaign Management",
                desc: "Unified campaign management tools that consolidate Google Ads, Meta, TikTok, and other platforms into a single powerful interface.",
            },
            {
                title: "Conversion Tracking & Attribution",
                desc: "Server-side tracking, first-party data solutions, and multi-touch attribution models for accurate campaign performance measurement.",
            },
        ],
        caseStudy: { title: "AdScale Platform", href: "/portfolio" },
    },
];

/* ── Component ──────────────────────────────────── */

function Accordion({ title, desc }: { title: string; desc: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-surface-border last:border-b-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-4 text-left group cursor-pointer"
            >
                <span className="text-sm font-medium text-white group-hover:text-primary-light transition-colors">
                    {title}
                </span>
                <HiChevronDown
                    className={`w-5 h-5 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <p className="pb-4 text-sm text-muted leading-relaxed">{desc}</p>
            </motion.div>
        </div>
    );
}

export default function ServicesPage() {
    return (
        <div className="pt-24 pb-20">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <SectionHeading
                        badge="Our Services"
                        title="Solutions That Scale With You"
                        subtitle="From web development to business automation and ad tech — we provide end-to-end technology solutions at costs that make sense."
                    />
                </div>
            </section>

            {/* Service Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={cat.id}
                        id={cat.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="scroll-mt-24"
                    >
                        <GlassCard hover={false} className="overflow-hidden">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}
                                    >
                                        <cat.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3
                                            className="text-2xl font-heading font-bold"
                                            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                                        >
                                            {cat.title}
                                        </h3>
                                        <p className="text-sm text-muted">{cat.tagline}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted uppercase tracking-wider">Starting from</p>
                                    <p className="text-2xl font-heading font-bold gradient-text">
                                        {cat.pricing}
                                    </p>
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {cat.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-muted"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Accordion Items */}
                            <div className="mb-8">
                                {cat.items.map((item) => (
                                    <Accordion key={item.title} title={item.title} desc={item.desc} />
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-surface-border">
                                <Button href="/contact" variant="primary">
                                    Get a Quote <HiArrowRight />
                                </Button>
                                <a
                                    href={cat.caseStudy.href}
                                    className="text-sm text-primary-light hover:text-accent transition-colors inline-flex items-center gap-1"
                                >
                                    View case study: {cat.caseStudy.title} <HiArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </section>

            {/* CTA */}
            <section className="py-24 mt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2
                            className="text-3xl sm:text-4xl font-heading font-bold mb-4"
                            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                        >
                            Not Sure What You Need?
                        </h2>
                        <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
                            Book a free consultation and let&apos;s figure out the best solution for your business together.
                        </p>
                        <Button href="/contact" variant="primary" className="text-base px-8 py-4">
                            Book Free Consultation <HiArrowRight />
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
