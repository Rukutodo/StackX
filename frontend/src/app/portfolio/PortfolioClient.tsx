"use client";

import { motion } from "framer-motion";
import { SectionHeading, GlassCard, Button } from "@/components/ui";
import { HiArrowRight } from "react-icons/hi";
import { useState } from "react";
import Link from "next/link";

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
              <GlassCard className="h-full flex flex-col group">
                {/* Thumbnail */}
                <div className="w-full h-44 rounded-lg bg-gradient-to-br from-surface-light to-surface mb-6 flex items-center justify-center overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={`${API_BASE}${project.image}`}
                      alt={project.title}
                      className="w-full h-full object-cover"
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
