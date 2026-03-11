"use client";

import { motion } from "framer-motion";
import { SectionHeading, GlassCard, Button } from "@/components/ui";
import { HiArrowRight, HiExternalLink } from "react-icons/hi";
import { useState } from "react";
import Link from "next/link";

/* ── Data ───────────────────────────────────────── */

const filters = ["All", "Web Development", "Automation", "Ad Tech"];

const projects = [
    {
        slug: "communize-vizag",
        title: "Communize VIZAG",
        category: "Web Development",
        desc: "Complete digital platform for community engagement and event management in Visakhapatnam.",
        tech: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
        result: "3x engagement increase",
        featured: true,
    },
    {
        slug: "",
        title: "AdScale Platform",
        category: "Ad Tech",
        desc: "Real-time programmatic advertising platform processing millions of daily impressions.",
        tech: ["React", "Python", "BigQuery", "Kafka"],
        result: "10M+ daily impressions",
        featured: false,
    },
    {
        slug: "",
        title: "FlowSync Automation",
        category: "Automation",
        desc: "End-to-end business process automation reducing manual tasks by 60%.",
        tech: ["Python", "n8n", "REST APIs", "Docker"],
        result: "60% efficiency gain",
        featured: false,
    },
    {
        slug: "",
        title: "TechNova Dashboard",
        category: "Web Development",
        desc: "Enterprise analytics dashboard with real-time data visualization and reporting.",
        tech: ["React", "D3.js", "Node.js", "MongoDB"],
        result: "50% faster reporting",
        featured: false,
    },
    {
        slug: "",
        title: "DataBridge Sync",
        category: "Automation",
        desc: "Multi-platform data synchronization system for enterprise resource planning.",
        tech: ["Python", "Celery", "Redis", "PostgreSQL"],
        result: "99.9% sync accuracy",
        featured: false,
    },
    {
        slug: "",
        title: "NexGen Ads Manager",
        category: "Ad Tech",
        desc: "Unified cross-platform campaign management for digital advertising teams.",
        tech: ["React", "Node.js", "Google Ads API", "Meta API"],
        result: "35% ROAS improvement",
        featured: false,
    },
];

/* ── Component ──────────────────────────────────── */

export default function PortfolioPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered =
        activeFilter === "All"
            ? projects
            : projects.filter((p) => p.category === activeFilter);

    return (
        <div className="pt-24 pb-20">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <SectionHeading
                        badge="Portfolio"
                        title="Our Work Speaks for Itself"
                        subtitle="Explore our case studies and see how we've helped businesses transform with technology."
                    />
                </div>
            </section>

            {/* Filters */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-5 py-2 text-sm font-medium rounded-full border transition-all cursor-pointer ${activeFilter === f
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white/5 text-muted border-white/10 hover:border-primary/30 hover:text-white"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((project, i) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            layout
                        >
                            <GlassCard className="h-full flex flex-col group">
                                {/* Thumbnail placeholder */}
                                <div className="w-full h-44 rounded-lg bg-gradient-to-br from-surface-light to-surface mb-6 flex items-center justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500" />
                                    <span className="text-4xl font-heading font-bold text-white/10 relative z-10">
                                        {project.title.charAt(0)}
                                    </span>
                                    {project.featured && (
                                        <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-medium uppercase tracking-wider bg-primary text-white rounded-full z-10">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                {/* Category */}
                                <span className="text-xs text-primary-light font-medium uppercase tracking-wider mb-2">
                                    {project.category}
                                </span>

                                <h3
                                    className="text-lg font-heading font-semibold mb-2"
                                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                                >
                                    {project.title}
                                </h3>
                                <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                                    {project.desc}
                                </p>

                                {/* Tech */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.tech.map((t) => (
                                        <span
                                            key={t}
                                            className="px-2 py-0.5 text-[10px] font-medium rounded bg-white/5 text-muted border border-white/5"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Result */}
                                <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                                    <span className="text-sm font-medium gradient-text">
                                        {project.result}
                                    </span>
                                    {project.slug ? (
                                        <Link
                                            href={`/portfolio/${project.slug}`}
                                            className="text-sm text-primary-light hover:text-accent transition-colors inline-flex items-center gap-1"
                                        >
                                            View Details <HiArrowRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <span className="text-xs text-muted">Case study coming soon</span>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 mt-12">
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
                            Want to Be Our Next{" "}
                            <span className="gradient-text">Success Story?</span>
                        </h2>
                        <p className="text-muted text-lg mb-8">
                            Let&apos;s discuss how we can help transform your business with technology.
                        </p>
                        <Button href="/contact" variant="primary" className="text-base px-8 py-4">
                            Start Your Project <HiArrowRight />
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
