"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, Button } from "@/components/ui";
import { HiArrowRight, HiSparkles, HiSearch, HiFilter, HiX, HiCheck } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
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

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(p.category);
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
    projects.forEach(p => {
      if (p.title.toLowerCase().includes(query)) {
        if (!recommendations.some(r => r.type === "project" && r.text === p.title)) {
          recommendations.push({ type: "project", text: p.title });
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

      {/* Search & Filter Bar */}
      <section id="projects" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 scroll-mt-32">
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
              placeholder="Search projects, tech stack..."
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
                          {rec.type === "category" ? "Service" : "Project"}
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
                  {/* Header */}
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

                  {/* Options */}
                  <div className="py-1.5 max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {categories
                      .filter((c) => c !== "All")
                      .sort((a, b) => {
                        const countA = projects.filter((p) => p.category === a).length;
                        const countB = projects.filter((p) => p.category === b).length;
                        return countB - countA;
                      })
                      .map((cat) => {
                      const isChecked = selectedCategories.includes(cat);
                      const count = projects.filter((p) => p.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-white/[0.04] ${
                            isChecked ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {/* Checkbox */}
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

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 px-4 text-center border border-white/5 rounded-3xl bg-white/[0.02]"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <HiSearch className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>No projects found</h3>
            <p className="text-gray-400 max-w-sm mb-6 text-sm">
              We couldn't find any projects matching your current search or category filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Clear Filters & Search
            </button>
          </motion.div>
        ) : (
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
        )}
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
