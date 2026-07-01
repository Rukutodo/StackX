"use client";

import { motion } from "framer-motion";
import { GlassCard, Button } from "@/components/ui";
import { HiArrowRight, HiSparkles } from "react-icons/hi";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── Types ───────────────────────────────────────── */

export interface CaseStudyResult {
  metric: string;
  label: string;
}

export interface CaseStudyTestimonial {
  name: string;
  company: string;
  feedback: string;
  rating: number;
  projectType: string;
}

export interface CaseStudy {
  subtitle: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  results: CaseStudyResult[];
  testimonial: CaseStudyTestimonial | null;
}

export interface PortfolioProject {
  _id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  techStack: string[];
  result: string;
  featured: boolean;
  status: "active" | "completed" | "draft";
  order: number;
  caseStudy: CaseStudy | null;
}

/* ── Component ──────────────────────────────────── */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

export default function PortfolioClient({ projects, categories }: { projects: PortfolioProject[]; categories: string[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, #06B6D4 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 mb-6">
              <HiSparkles className="w-3.5 h-3.5" /> Portfolio
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Our Work Speaks{" "}
            <span className="block" style={{ background: "linear-gradient(135deg, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              for Itself
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Explore our case studies and see how we&apos;ve helped businesses transform with technology.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3">
            <a href="#projects" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-500 hover:to-violet-500 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-200">
              View Projects <HiArrowRight className="w-4 h-4" />
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20 transition-all duration-200">
              Start a Project
            </a>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 scroll-mt-24">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all cursor-pointer ${
                activeFilter === f
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
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              layout
            >
              <GlassCard className="h-full flex flex-col group relative">
                {/* Thumbnail */}
                <div className="w-full h-44 rounded-lg bg-gradient-to-br from-surface-light to-surface mb-6 flex items-center justify-center overflow-hidden relative">
                  {project.image ? (
                    <Image
                      src={`${API_BASE}${project.image}`}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500" />
                      <span className="text-4xl font-heading font-bold text-white/10 relative z-10">
                        {project.title.charAt(0)}
                      </span>
                    </>
                  )}
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
                  {project.description}
                </p>

                {/* Tech */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((t) => (
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
                  {project.caseStudy ? (
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="text-sm text-primary-light hover:text-accent transition-colors inline-flex items-center gap-1 after:absolute after:inset-0"
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
