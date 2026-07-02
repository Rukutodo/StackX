"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight,
  HiOutlineLightningBolt,
  HiOutlineGlobe,
  HiOutlineDeviceMobile,
  HiSearch,
  HiFilter,
  HiX,
  HiCheck
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const filterRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecommendations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  const filtered = caseStudies.filter((cs) => {
    const matchesSearch =
      !searchQuery.trim() ||
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cs.overview && cs.overview.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cs.service && cs.service.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory =
      selectedCategories.length === 0 || (cs.service && selectedCategories.includes(cs.service));
    
    return matchesSearch && matchesCategory;
  });

  const recommendations: { type: "category" | "project"; text: string }[] = [];
  if (searchQuery.trim().length > 0) {
    const query = searchQuery.toLowerCase();
    categories.filter(c => c !== "All").forEach(cat => {
      if (cat.toLowerCase().includes(query)) {
        recommendations.push({ type: "category", text: cat });
      }
    });
    caseStudies.forEach(cs => {
      if (cs.title.toLowerCase().includes(query)) {
        if (!recommendations.some(r => r.type === "project" && r.text === cs.title)) {
          recommendations.push({ type: "project", text: cs.title });
        }
      }
    });
  }

  const handleSelectRecommendation = (rec: { type: "category" | "project"; text: string }) => {
    setSearchQuery(rec.text);
    setShowRecommendations(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showRecommendations || recommendations.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev < recommendations.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < recommendations.length) {
        handleSelectRecommendation(recommendations[focusedIndex]);
      }
    }
  };

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

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 group" ref={searchRef}>
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowRecommendations(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowRecommendations(true);
                setFocusedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search case studies, services..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-2xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <HiX className="w-4 h-4" />
              </button>
            )}

            {/* Recommendations Dropdown */}
            <AnimatePresence>
              {showRecommendations && recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-[#0f0a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  <div className="py-2">
                    {recommendations.map((rec, idx) => (
                      <button
                        key={`${rec.type}-${idx}`}
                        onClick={() => handleSelectRecommendation(rec)}
                        onMouseEnter={() => setFocusedIndex(idx)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all text-left ${
                          idx === focusedIndex ? "bg-white/[0.06]" : "hover:bg-white/[0.06]"
                        }`}
                      >
                        <span className="text-gray-200">{rec.text}</span>
                        <span
                          className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md ${
                            rec.type === "category"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {rec.type === "category" ? "Service" : "Case Study"}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-300 ${
                selectedCategories.length > 0
                  ? "bg-purple-600/15 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                  : "bg-white/[0.04] border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <HiFilter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {selectedCategories.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold">
                  {selectedCategories.length}
                </span>
              )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-3 w-[260px] bg-[#0f0a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Categories</span>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-[11px] text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="py-1.5 max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {categories
                      .filter((c) => c !== "All")
                      .sort((a, b) => {
                        const countA = caseStudies.filter((p) => p.service === a).length;
                        const countB = caseStudies.filter((p) => p.service === b).length;
                        return countB - countA;
                      })
                      .map((cat) => {
                      const isChecked = selectedCategories.includes(cat);
                      const count = caseStudies.filter((p) => p.service === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-white/[0.04] ${
                            isChecked ? "text-white" : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-[18px] h-[18px] rounded-md border-2 transition-all duration-200 flex-shrink-0 ${
                              isChecked
                                ? "bg-purple-600 border-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                                : "border-white/20 hover:border-white/40"
                            }`}
                          >
                            {isChecked && <HiCheck className="w-3 h-3 text-white" />}
                          </div>
                          <span className="flex-1 text-left">{cat}</span>
                          <span className="text-[11px] text-gray-600 font-mono">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Filter Tags */}
        {selectedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 mt-4"
          >
            <span className="text-xs text-gray-500 mr-1">Showing:</span>
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/15 border border-purple-500/30 rounded-lg text-xs text-purple-300 font-medium"
              >
                {cat}
                <button onClick={() => toggleCategory(cat)} className="hover:text-white transition-colors">
                  <HiX className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-white transition-colors underline underline-offset-2"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {caseStudies.length === 0 ? (
          <div className="py-28 text-center">
            <p className="text-xl font-semibold text-white mb-2">No case studies yet</p>
            <p className="text-gray-500">Stay tuned for our upcoming project deep-dives.</p>
          </div>
        ) : (
          <section>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 px-4 text-center border border-white/5 rounded-3xl bg-white/[0.02] mb-12"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <HiSearch className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>No case studies found</h3>
                <p className="text-gray-400 max-w-sm mb-6 text-sm">
                  We couldn't find any case studies matching your current search or category filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Clear Filters & Search
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={searchQuery + selectedCategories.join(',')}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 mb-12"
                >
                  {filtered.map((cs, i) => (
                    <CaseStudyCard key={cs._id} cs={cs} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            <CTASection />
          </section>
        )}
      </div>
    </div>
  );
}
