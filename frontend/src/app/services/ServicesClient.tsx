"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeading, GlassCard, Button } from "@/components/ui";
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

/* ── Static frontend mappings (color by slug) ── */
const slugMeta: Record<string, { color: string }> = {
  "web-development": { color: "from-primary to-primary-deep" },
  automation:        { color: "from-accent to-accent-dark" },
  adtech:            { color: "from-primary-light to-accent" },
};

const defaultMeta = { color: "from-primary to-primary-deep" };

/* ── Accordion ───────────────────────────────────── */
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

/* ── Main Client Component ───────────────────────── */
export default function ServicesClient({ categories }: { categories: ServiceCategory[] }) {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
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
        {categories.map((cat) => {
          const meta = slugMeta[cat.slug] ?? defaultMeta;
          // Resolve icon: DB field wins, then slug-map fallback, then default
          const Icon = (cat.icon && ICON_MAP[cat.icon]) ? ICON_MAP[cat.icon] : HiCode;

          return (
            <motion.div
              key={cat._id}
              id={cat.slug}
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
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <Link href={`/services/${cat.slug}`} className="hover:text-primary-light transition-colors">
                        <h3
                          className="text-2xl font-heading font-bold"
                          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                        >
                          {cat.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted">{cat.tagline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted uppercase tracking-wider">Starting from</p>
                    <p className="text-2xl font-heading font-bold gradient-text">{cat.pricing}</p>
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
                  <div className="flex items-center gap-3">
                    <Button href="/contact" variant="primary">
                      Get a Quote <HiArrowRight />
                    </Button>
                    <Button href={`/services/${cat.slug}`} variant="secondary">
                      Learn More
                    </Button>
                  </div>
                  {cat.caseStudy && (
                    <a
                      href={cat.caseStudy.href}
                      className="text-sm text-primary-light hover:text-accent transition-colors inline-flex items-center gap-1"
                    >
                      View case study: {cat.caseStudy.title} <HiArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
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
