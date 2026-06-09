"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  role: string;
  feedback: string;
  rating: number;
  projectType: string;
  portfolioProject: { id: string; slug: string; title: string } | null;
}

const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

const QUOTE_PATH =
  "M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "lg" ? "w-6 h-6" : size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${cls} ${i < rating ? "text-amber-400" : "text-gray-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "lg"
      ? "w-14 h-14 text-lg rounded-2xl"
      : size === "md"
      ? "w-10 h-10 text-sm rounded-xl"
      : "w-8 h-8 text-xs rounded-lg";
  return (
    <div
      className={`${cls} bg-gradient-to-br from-purple-600/50 to-violet-700/50 flex items-center justify-center font-bold text-purple-100 border border-purple-500/20 shrink-0`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function StatPill({
  value,
  label,
  star,
}: {
  value: string;
  label: string;
  star?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
      {star && (
        <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d={STAR_PATH} />
        </svg>
      )}
      <span className="text-sm font-bold text-white">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

function FeaturedTestimonial({ t }: { t: Testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="relative rounded-3xl p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(139,92,246,0.5) 0%, rgba(109,40,217,0.3) 50%, rgba(6,182,212,0.2) 100%)",
      }}
    >
      <div
        className="rounded-3xl p-8 sm:p-10 relative overflow-hidden"
        style={{
          background: "rgba(19,19,26,0.97)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Ambient glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-600/[0.04] rounded-full blur-3xl pointer-events-none" />

        {/* Large decorative quote */}
        <svg
          className="absolute top-6 right-8 w-24 h-24 text-purple-500/[0.08]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d={QUOTE_PATH} />
        </svg>

        <div className="relative z-10">
          {/* Stars + badge */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Stars rating={t.rating} size="md" />
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
              Featured Review
            </span>
          </div>

          {/* Quote */}
          <blockquote
            className="text-xl sm:text-2xl font-semibold text-white/90 leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            &ldquo;{t.feedback}&rdquo;
          </blockquote>

          {/* Author row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={t.name} size="lg" />
              <div>
                <p className="text-base font-semibold text-white">{t.name}</p>
                <p className="text-sm text-gray-400">
                  {t.role ? `${t.role} · ` : ""}
                  {t.company}
                </p>
              </div>
            </div>
            {t.portfolioProject && (
              <Link
                href={`/portfolio/${t.portfolioProject.slug}`}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors cursor-pointer"
              >
                View Project
                <HiExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.055 }}
      className="group flex flex-col h-full rounded-2xl border border-white/[0.07] p-6 transition-all duration-300 hover:border-purple-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 cursor-default"
      style={{ background: "rgba(19,19,26,0.7)", backdropFilter: "blur(20px)" }}
    >
      {/* Top */}
      <div className="flex items-start justify-between mb-4">
        <svg
          className="w-7 h-7 text-purple-500/35"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d={QUOTE_PATH} />
        </svg>
        <Stars rating={t.rating} />
      </div>

      {/* Feedback */}
      <blockquote className="text-sm text-gray-300 leading-relaxed flex-1 mb-5 line-clamp-4">
        {t.feedback}
      </blockquote>

      {/* Author */}
      <div className="pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar name={t.name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-white/90 leading-tight">
                {t.name}
              </p>
              <p className="text-xs text-gray-500 leading-tight mt-0.5">
                {t.role ? `${t.role} · ` : ""}
                {t.company}
              </p>
            </div>
          </div>
          {t.portfolioProject ? (
            <Link
              href={`/portfolio/${t.portfolioProject.slug}`}
              className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.portfolioProject.title}
              <HiExternalLink className="w-3 h-3" />
            </Link>
          ) : t.projectType ? (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/[0.05] text-gray-400 border border-white/[0.08] whitespace-nowrap">
              {t.projectType}
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

function RatingSummary({ avg, count }: { avg: string; count: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-20 py-14 px-8 rounded-3xl text-center border border-white/[0.07]"
      style={{ background: "rgba(19,19,26,0.55)", backdropFilter: "blur(20px)" }}
    >
      <p
        className="text-7xl font-bold mb-2"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
          {avg}
        </span>
        <span className="text-3xl text-gray-600 font-normal"> / 5</span>
      </p>
      <div className="flex items-center justify-center gap-1.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className="w-6 h-6 text-amber-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </div>
      <p className="text-gray-500 text-sm">
        Average rating based on{" "}
        <span className="text-white font-medium">{count}+</span> verified client
        reviews
      </p>
    </motion.div>
  );
}

function CTASection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-8 rounded-3xl p-px"
      style={{
        background:
          "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(109,40,217,0.2), rgba(6,182,212,0.12))",
      }}
    >
      <div
        className="rounded-3xl px-8 py-14 text-center relative overflow-hidden"
        style={{ background: "rgba(12,12,18,0.97)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.07),transparent_70%)] pointer-events-none" />
        <div className="relative z-10">
          <p
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Ready to be our next success story?
          </p>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Let&apos;s build something remarkable together.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-deep rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 border border-white/10 cursor-pointer"
          >
            Get Free Consultation
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsPageClient({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const avgRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
        ).toFixed(1)
      : "5.0";

  const projectTypes = [
    "All",
    ...Array.from(
      new Set(testimonials.map((t) => t.projectType).filter(Boolean))
    ),
  ];
  const [activeFilter, setActiveFilter] = useState("All");

  // Pick featured: first 5-star, fallback to first
  const featured =
    testimonials.find((t) => t.rating === 5) ?? testimonials[0];
  const rest = testimonials.filter((t) => t._id !== featured?._id);
  const filtered =
    activeFilter === "All"
      ? rest
      : rest.filter((t) => t.projectType === activeFilter);

  // ─── Hero ────────────────────────────────────────────────────────────────
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.11),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-6">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d={QUOTE_PATH} />
              </svg>
              Client Reviews
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Trusted by Teams{" "}
              <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Don&apos;t take our word for it — hear from the clients who have
              experienced the StackX difference firsthand.
            </p>

            {testimonials.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                <StatPill value={`${testimonials.length}+`} label="Client Reviews" />
                <StatPill value={avgRating} label="Avg. Rating" star />
                <StatPill value="100%" label="Would Recommend" />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {testimonials.length === 0 ? (
          /* ── Empty state ──────────────────────────────────────────────── */
          <div className="py-28 text-center">
            <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
              <svg
                className="w-10 h-10 text-purple-400/50"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d={QUOTE_PATH} />
              </svg>
            </div>
            <p className="text-xl font-semibold text-white mb-2">
              No testimonials yet
            </p>
            <p className="text-gray-500">
              Great things are being built — check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* ── Featured ──────────────────────────────────────────────── */}
            <section className="mb-16">
              <FeaturedTestimonial t={featured} />
            </section>

            {/* ── All Reviews ───────────────────────────────────────────── */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h2
                    className="text-xl font-semibold text-white"
                    style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                  >
                    All Reviews
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {rest.length} client review{rest.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Filter pills */}
                {projectTypes.length > 2 && (
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveFilter(type)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                          activeFilter === type
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            : "bg-white/[0.04] text-gray-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {filtered.length > 0 ? (
                    filtered.map((t, i) => (
                      <TestimonialCard key={t._id} t={t} index={i} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <p className="text-white font-medium mb-1">
                        No reviews in this category
                      </p>
                      <p className="text-sm text-gray-500">
                        Try selecting a different filter
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </section>

            {/* ── Rating summary ────────────────────────────────────────── */}
            <RatingSummary avg={avgRating} count={testimonials.length} />

            {/* ── CTA ───────────────────────────────────────────────────── */}
            <CTASection />
          </>
        )}
      </div>
    </div>
  );
}
