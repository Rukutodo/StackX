"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard, Button, TestimonialCard } from "@/components/ui";
import { HiArrowLeft, HiArrowRight, HiCheckCircle } from "react-icons/hi";
import Link from "next/link";
import type { PortfolioProject } from "../PortfolioClient";

const API_BASE = "http://129.159.236.176:4000";

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/portfolio/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProject(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted">Loading project…</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Project Not Found</h1>
          <p className="text-muted text-sm mb-6">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Button href="/portfolio" variant="primary">
            <HiArrowLeft /> Back to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  const cs = project.caseStudy;

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
              {cs?.subtitle || `Case Study — ${project.category}`}
            </span>
            <h1
              className="text-4xl sm:text-5xl font-heading font-bold mb-6"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              {project.title}
            </h1>
            <p className="text-muted text-lg leading-relaxed mb-6">
              {cs?.overview || project.description}
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
              {project.image ? (
                <img
                  src={`${API_BASE}${project.image}`}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-accent/8" />
                  <div className="relative z-10 text-center px-8">
                    <p className="text-5xl font-heading font-bold text-white/10 mb-2">
                      {project.title.split(" ").map((w) => w[0]).join("")}
                    </p>
                    <p className="text-sm text-muted">{project.title}</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Metrics */}
      {cs?.results && cs.results.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {cs.results.map((r, i) => (
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
      )}

      {/* Problem & Solution */}
      {cs && (cs.problem || cs.solution) && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {cs.problem && (
                <GlassCard>
                  <h3
                    className="text-xl font-heading font-semibold mb-4 text-error"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                  >
                    ⚠️ The Problem
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{cs.problem}</p>
                </GlassCard>
              )}
              {cs.solution && (
                <GlassCard>
                  <h3
                    className="text-xl font-heading font-semibold mb-4 text-success"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                  >
                    ✅ The Solution
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{cs.solution}</p>
                </GlassCard>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <section className="py-16 bg-surface/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3
              className="text-2xl font-heading font-bold mb-8 text-center"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Technologies Used
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {project.techStack.map((tech) => (
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
      )}

      {/* Features */}
      {cs?.features && cs.features.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3
              className="text-2xl font-heading font-bold mb-8 text-center"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Key Features Delivered
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {cs.features.map((f, i) => (
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
      )}

      {/* Testimonial */}
      {cs?.testimonial && (
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <TestimonialCard
              name={cs.testimonial.name}
              company={cs.testimonial.company}
              feedback={cs.testimonial.feedback}
              rating={cs.testimonial.rating}
              projectType={cs.testimonial.projectType}
            />
          </div>
        </section>
      )}

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
