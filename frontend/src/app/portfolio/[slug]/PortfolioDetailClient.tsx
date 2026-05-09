"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, Button } from "@/components/ui";
import { HiArrowLeft, HiArrowRight, HiCheckCircle, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { PortfolioProject } from "../PortfolioClient";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

/* ─────────────────────────────────────────────────
   Image Carousel Component
 ───────────────────────────────────────────────── */
function ImageCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const total = images.length;

  const go = (idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  };
  const prev = () => go((current - 1 + total) % total, -1);
  const next = () => go((current + 1) % total, 1);

  // Auto-advance every 4s
  useEffect(() => {
    if (total <= 1) return;
    const t = setTimeout(() => go((current + 1) % total, 1), 4000);
    return () => clearTimeout(t);
  }, [current, total]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  if (total === 0) return null;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-heading font-bold mb-8 text-center"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
          Project Gallery
        </h3>

        {/* Main carousel */}
        <div className="relative max-w-4xl mx-auto select-none">
          {/* Slide */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] aspect-video bg-black/20"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
            <AnimatePresence custom={direction} mode="popLayout" initial={false}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={`${API_BASE}${images[current]}`}
                  alt={`Case study image ${current + 1} of ${total}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Arrows — only show if more than 1 image */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/70 text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <HiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/70 text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <HiChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Counter badge */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              {current + 1} / {total}
            </div>
          </div>

          {/* Dot indicators */}
          {total > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i, i > current ? 1 : -1)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2 bg-purple-500"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail strip — show only if 3+ images */}
          {total >= 3 && (
            <div className="flex gap-2.5 mt-5 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => go(i, i > current ? 1 : -1)}
                  className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === current
                      ? "border-purple-500 opacity-100 scale-[1.03]"
                      : "border-white/10 opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={`${API_BASE}${url}`} alt={`Thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function PortfolioDetailClient({ project }: { project: PortfolioProject }) {
  const cs = project.caseStudy;
  const galleryImages: string[] = (cs as any)?.images ?? [];

  return (
    <div className="pt-24 pb-20">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary-light transition-colors">
          <HiArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20 mb-4">
              {cs?.subtitle || `Case Study — ${project.category}`}
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              {project.title}
            </h1>
            <p className="text-muted text-lg leading-relaxed mb-6">{cs?.overview || project.description}</p>
            <div className="flex gap-4">
              <Button href="/contact" variant="primary">
                Start a Similar Project <HiArrowRight />
              </Button>
            </div>
          </motion.div>

          {/* Project Visual */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-surface-light to-surface border border-surface-border flex items-center justify-center relative overflow-hidden">
              {project.image ? (
                <Image src={`${API_BASE}${project.image}`} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
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
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <GlassCard className="text-center">
                    <p className="text-3xl font-heading font-bold gradient-text mb-1">{r.metric}</p>
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
                  <h3 className="text-xl font-heading font-semibold mb-4 text-error"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                    ⚠️ The Problem
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{cs.problem}</p>
                </GlassCard>
              )}
              {cs.solution && (
                <GlassCard>
                  <h3 className="text-xl font-heading font-semibold mb-4 text-success"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                    ✅ The Solution
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{cs.solution}</p>
                </GlassCard>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Image Carousel — placed after problem/solution ── */}
      {galleryImages.length > 0 && <ImageCarousel images={galleryImages} />}

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <section className="py-16 bg-surface/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-heading font-bold mb-8 text-center"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Technologies Used
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {project.techStack.map((tech) => (
                <span key={tech}
                  className="px-5 py-2.5 text-sm font-medium rounded-xl bg-white/5 border border-white/10 text-muted hover:border-primary/30 hover:text-white transition-all">
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
            <h3 className="text-2xl font-heading font-bold mb-8 text-center"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Key Features Delivered
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {cs.features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-3">
                  <HiCheckCircle className="w-5 h-5 text-success shrink-0" />
                  <span className="text-sm text-muted">{f}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
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
