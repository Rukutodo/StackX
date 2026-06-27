"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui";
import {
  HiCode, HiCog, HiChartBar, HiChevronDown, HiArrowRight,
  HiGlobe, HiLightningBolt, HiDatabase, HiShieldCheck, HiColorSwatch,
  HiCurrencyDollar, HiCloud, HiDesktopComputer, HiDeviceMobile, HiCube,
  HiTrendingUp, HiBriefcase, HiSparkles, HiTemplate, HiSupport,
} from "react-icons/hi";
import { useState } from "react";
import type { ComponentType } from "react";

/* ── Types ───────────────────────────────────────── */
export interface AccordionItem {
  title: string;
  desc: string;
}

export interface CaseStudy {
  title: string;
  href: string;
}

export interface ServiceCategory {
  _id: string;
  slug: string;
  title: string;
  icon?: string; // icon name stored in DB, e.g. "HiCode"
  tagline: string;
  pricing: string;
  techStack: string[];
  items: AccordionItem[];
  caseStudy: CaseStudy | null;
  status: "active" | "draft";
  order: number;
}

/* ── All available icons (name → component) ── */
export const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  HiCode, HiCog, HiChartBar, HiGlobe, HiLightningBolt, HiDatabase,
  HiShieldCheck, HiColorSwatch, HiCurrencyDollar, HiCloud, HiDesktopComputer,
  HiDeviceMobile, HiCube, HiTrendingUp, HiBriefcase, HiSparkles,
  HiTemplate, HiSupport,
};

/* ── Color mapping by slug ── */
const slugColors: Record<string, string> = {
  "web-development":            "from-violet-500 to-purple-700",
  "ad-tech-solutions":          "from-cyan-500 to-teal-600",
  "digital-marketing":          "from-rose-500 to-pink-600",
  "market-research-and-insights": "from-amber-500 to-orange-600",
  automation:                   "from-emerald-500 to-green-600",
  adtech:                       "from-cyan-500 to-teal-600",
};
const defaultColor = "from-primary to-primary-deep";

/* ── Accordion ───────────────────────────────────── */
function Accordion({ title, desc, index }: { title: string; desc: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-white/[0.04] last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 sm:py-5 text-left group cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-bold text-muted/30 tracking-widest shrink-0 w-6">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm sm:text-base font-medium text-white/90 group-hover:text-primary-light transition-colors duration-300 truncate">
            {title}
          </span>
        </div>
        <HiChevronDown
          className={`w-5 h-5 text-muted/50 transition-transform duration-300 shrink-0 ml-4 ${open ? "rotate-180 text-primary-light" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-5 pl-9 text-sm text-muted leading-relaxed">{desc}</p>
      </motion.div>
    </div>
  );
}

/* ── Main Client Component ───────────────────────── */
export default function ServicesClient({ categories }: { categories: ServiceCategory[] }) {
  return (
    <div className="pt-24 pb-0">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-16 pb-24 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.08),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Floating accent blobs */}
        <div className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 rounded-full bg-accent/8 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              What We Offer
            </motion.span>

            {/* Main title */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Our{" "}
              <span className="gradient-text">Services</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 sm:mt-8 text-muted text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              End-to-end technology solutions — from web development to marketing and ad tech — at costs that actually make sense.
            </p>

            {/* Decorative accent */}
            <div className="mt-8 mx-auto w-28 h-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary-light" />
          </motion.div>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-6"
          >
            {[
              { label: "Services", value: `${categories.length}+` },
              { label: "Tech Stacks", value: "15+" },
              { label: "Satisfaction", value: "100%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="text-xl sm:text-2xl font-bold gradient-text"
                  style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-muted uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══ SERVICE CARDS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 pb-20">
        {categories.map((cat, catIndex) => {
          const color = slugColors[cat.slug] ?? defaultColor;
          const Icon = (cat.icon && ICON_MAP[cat.icon]) ? ICON_MAP[cat.icon] : HiCode;

          return (
            <motion.div
              key={cat._id}
              id={cat.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: catIndex * 0.08 }}
              className="scroll-mt-24 group"
            >
              <div
                className="relative rounded-2xl xl:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Top gradient accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`}
                />

                <div className="p-6 sm:p-8 lg:p-10">
                  {/* ── Card Header ── */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                      {/* Number + Icon */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <span className="text-[9px] font-bold tracking-[0.2em] text-muted/25 uppercase">
                          {String(catIndex + 1).padStart(2, "0")}
                        </span>
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}
                        >
                          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>

                      {/* Title + Tagline */}
                      <div className="min-w-0">
                        <Link
                          href={`/services/${cat.slug}`}
                          className="inline-block group/link"
                        >
                          <h2
                            className="text-2xl sm:text-3xl font-heading font-bold text-white group-hover/link:text-primary-light transition-colors duration-300"
                            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                          >
                            {cat.title}
                          </h2>
                        </Link>
                        <p className="mt-1.5 text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                          {cat.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="lg:text-right shrink-0 pl-[4.5rem] lg:pl-0">
                      <p className="text-[10px] font-semibold text-muted/50 uppercase tracking-[0.15em] mb-1">
                        Starting from
                      </p>
                      <p
                        className="text-2xl sm:text-3xl font-bold gradient-text"
                        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                      >
                        {cat.pricing}
                      </p>
                    </div>
                  </div>

                  {/* ── Tech Stack Chips ── */}
                  {cat.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {cat.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-[11px] font-medium rounded-lg text-muted/80 transition-colors duration-300 hover:text-primary-light"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ── Accordion Sub-services ── */}
                  {cat.items.length > 0 && (
                    <div
                      className="rounded-xl mb-8 px-4 sm:px-6"
                      style={{
                        background: "rgba(255,255,255,0.01)",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {cat.items.map((item, idx) => (
                        <Accordion key={item.title} title={item.title} desc={item.desc} index={idx} />
                      ))}
                    </div>
                  )}

                  {/* ── Card Footer ── */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <Button href="/contact" variant="primary">
                        Get a Quote <HiArrowRight />
                      </Button>
                      <Link
                        href={`/services/${cat.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-muted hover:text-white rounded-xl transition-all duration-300 hover:bg-white/5"
                      >
                        Learn More
                        <HiArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    {cat.caseStudy && (
                      <a
                        href={cat.caseStudy.href}
                        className="text-sm text-primary-light hover:text-accent transition-colors inline-flex items-center gap-1.5 group/cs"
                      >
                        <span className="underline underline-offset-4 decoration-primary/30 group-hover/cs:decoration-accent/50 transition-colors">
                          Case study: {cat.caseStudy.title}
                        </span>
                        <HiArrowRight className="w-4 h-4 group-hover/cs:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/6" />
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-primary/8 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/6 blur-[120px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20 mb-6">
              Let&apos;s Talk
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-5"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Not Sure What{" "}
              <span className="gradient-text">You Need?</span>
            </h2>
            <p className="text-muted text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Book a free consultation and let&apos;s figure out the best solution for your business together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/contact" variant="primary" className="text-base px-8 py-4">
                Book Free Consultation <HiArrowRight />
              </Button>
              <Button href="/portfolio" variant="secondary" className="text-base px-8 py-4">
                View Our Work
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
