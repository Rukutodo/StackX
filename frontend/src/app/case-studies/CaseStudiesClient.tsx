"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight,
  HiOutlineLightningBolt,
  HiOutlineGlobe,
  HiOutlineDeviceMobile,
} from "react-icons/hi";
import type { CaseStudy } from "./page";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

function StatPill({ value, label, icon: Icon }: { value: string; label: string; icon?: any }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
      {Icon && <Icon className="w-3.5 h-3.5 text-purple-400" />}
      <span className="text-sm font-bold text-white">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}



function CaseStudyCard({ cs, index }: { cs: CaseStudy; index: number }) {
  const href = cs.portfolioProject ? `/portfolio/${cs.portfolioProject.slug}` : "/contact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.055 }}
      className="group flex flex-col h-full rounded-2xl border border-white/[0.07] overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 bg-surface/40 backdrop-blur-xl"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden border-b border-white/[0.05]">
        {cs.images?.[0] ? (
          <Image
            src={`${API_BASE}${cs.images[0]}`}
            alt={cs.title}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-light to-surface flex items-center justify-center">
            <span className="text-4xl font-bold text-white/5">{cs.title.charAt(0)}</span>
          </div>
        )}
        {cs.service && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 rounded-lg">
              {cs.service}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-6 flex flex-col flex-1">
        {cs.client && (
          <p className="text-[9px] sm:text-xs text-purple-400 font-medium mb-0.5 sm:mb-1 line-clamp-1">{cs.client}</p>
        )}
        <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
          {cs.title}
        </h3>
        <p className="hidden sm:block text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3 flex-1">
          {cs.subtitle || cs.overview}
        </p>

        <div className="hidden sm:flex items-center justify-between pt-5 border-t border-white/[0.06] mt-auto">
          {cs.results?.[0] && (
            <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              {cs.results[0].metric} {cs.results[0].label}
            </span>
          )}
          <Link
            href={href}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white transition-colors ml-auto"
          >
            Details
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
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
          <p className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Ready to build your success story?
          </p>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Our expert team is ready to turn your vision into reality.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-deep rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 border border-white/10"
          >
            Start Your Project
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function CaseStudiesPageClient({
  caseStudies,
  categories,
}: {
  caseStudies: CaseStudy[];
  categories: string[];
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? caseStudies
      : caseStudies.filter((cs) => cs.service === activeFilter);

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.11),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgb(139,92,246) 1px, transparent 1px), linear-gradient(90deg, rgb(139,92,246) 1px, transparent 1px)`,
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
              <HiOutlineLightningBolt className="w-3.5 h-3.5" />
              Success Stories
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Our In-Depth{" "}
              <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                Case Studies
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover how we tackle complex challenges and deliver high-performance solutions across various industries.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <StatPill value={`${caseStudies.length}+`} label="Projects Delivered" icon={HiOutlineGlobe} />
              <StatPill value="100%" label="Client Satisfaction" icon={HiOutlineLightningBolt} />
              <StatPill value="24/7" label="Support" icon={HiOutlineDeviceMobile} />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {caseStudies.length === 0 ? (
          <div className="py-28 text-center">
            <p className="text-xl font-semibold text-white mb-2">No case studies yet</p>
            <p className="text-gray-500">Stay tuned for our upcoming project deep-dives.</p>
          </div>
        ) : (
          <>
            {/* All case studies */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-white">All Case Studies</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Explore {caseStudies.length} {caseStudies.length === 1 ? "project" : "projects"}</p>
                </div>

                {/* Filter pills */}
                {categories.length > 2 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                          activeFilter === cat
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            : "bg-white/[0.04] text-gray-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {cat}
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
                  className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
                >
                  {filtered.length > 0 ? (
                    filtered.map((cs, i) => (
                      <CaseStudyCard key={cs._id} cs={cs} index={i} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <p className="text-white font-medium">No case studies in this category</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </section>

            <CTASection />
          </>
        )}
      </div>
    </div>
  );
}
