"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const insightsLinks = [
  {
    href: "/testimonials",
    label: "Testimonials",
    description: "What our clients say about working with us",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    href: "/case-studies",
    label: "Case Studies",
    description: "In-depth analysis of our successful projects",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    href: "/blog",
    label: "Blogs",
    description: "Latest insights, tutorials & tech trends",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5" />
      </svg>
    ),
  },
];

/* ─────────── Decorative left panel for desktop mega dropdown ─────────── */
function InsightsPromoPanel() {
  return (
    <div className="relative w-[200px] shrink-0 rounded-xl overflow-hidden flex flex-col justify-end p-4"
      style={{
        background: "linear-gradient(160deg, rgba(139,92,246,0.25) 0%, rgba(109,40,217,0.15) 40%, rgba(6,182,212,0.12) 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Decorative floating shapes */}
      <div className="absolute top-4 left-5 w-6 h-6 rounded-md border border-purple-400/30 bg-purple-500/10 rotate-12 animate-float" />
      <div className="absolute top-5 right-4 w-4 h-4 rounded-full border border-cyan-400/30 bg-cyan-500/10 animate-float-reverse" />

      {/* Sparkle icon */}
      <div className="relative z-10 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/20 border border-purple-400/20 flex items-center justify-center backdrop-blur-sm">
          <svg className="w-4 h-4 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
      </div>
      <p className="relative z-10 text-[13px] font-semibold text-white/90 leading-snug"
        style={{ fontFamily: "var(--font-heading)" }}>
        Explore Our Insights
      </p>
      <p className="relative z-10 text-[10px] text-gray-400 leading-relaxed mt-0.5">
        Stories, case studies & articles.
      </p>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setInsightsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setInsightsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setInsightsOpen(false), 150);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  if (!mounted) return <div className="h-22" />; // Placeholder to avoid layout shift

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-surface/85 backdrop-blur-2xl border-b border-surface-border shadow-lg shadow-primary/5 py-1"
          : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-22">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/stackx.svg"
              alt="StackX"
              width={160}
              height={56}
              className="h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5 mx-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-[13px] font-medium text-muted/90 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04] tracking-wide uppercase"
              >
                {link.label}
              </Link>
            ))}

            {/* Insights mega dropdown — hover-triggered */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setInsightsOpen((o) => !o)}
                className={`relative flex items-center gap-1 px-4 py-2 text-[13px] font-medium transition-colors rounded-lg tracking-wide uppercase cursor-pointer ${
                  insightsOpen
                    ? "text-white bg-white/[0.06]"
                    : "text-muted/90 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Insights
                <HiChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${insightsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {insightsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute right-0 top-full mt-3 rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden"
                    style={{
                      background: "rgba(14,14,20,0.97)",
                      backdropFilter: "blur(32px)",
                      WebkitBackdropFilter: "blur(32px)",
                    }}
                  >
                    {/* Subtle top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                    <div className="flex p-2.5 gap-2.5">
                      {/* Left — Decorative promo panel */}
                      <InsightsPromoPanel />

                      {/* Right — Navigation items in a horizontal row */}
                      <div className="flex items-stretch gap-1">
                        {insightsLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setInsightsOpen(false)}
                            className="group flex flex-col items-center text-center w-[145px] px-3 py-4 rounded-xl hover:bg-white/[0.05] transition-all duration-200"
                          >
                            {/* Icon container */}
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/15 to-violet-600/10 border border-purple-500/15 flex items-center justify-center shrink-0 text-purple-400/70 group-hover:text-purple-300 group-hover:border-purple-500/30 group-hover:from-purple-500/20 group-hover:to-violet-600/15 group-hover:shadow-lg group-hover:shadow-purple-500/10 transition-all duration-200 mb-2.5">
                              {item.icon}
                            </div>
                            <span className="text-[13px] font-semibold text-white/90 group-hover:text-white transition-colors leading-tight flex items-center gap-1">
                              {item.label}
                              <svg className="w-3 h-3 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all duration-200" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                              </svg>
                            </span>
                            <span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors mt-1 leading-snug">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Bottom bar CTA */}
                    <div className="px-4 py-2 border-t border-white/[0.06]">
                      <Link
                        href="/contact"
                        onClick={() => setInsightsOpen(false)}
                        className="group flex items-center justify-center gap-2 py-1 text-[11px] font-medium text-gray-500 hover:text-purple-300 transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/70 group-hover:bg-green-400 transition-colors animate-pulse" />
                        Have a project in mind? Let&apos;s talk
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-deep rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 border border-white/10"
            >
              Get Free Consultation
              <span className="text-xs">→</span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-surface/95 backdrop-blur-xl border-b border-surface-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Insights accordion */}
              <div>
                <button
                  onClick={() => setMobileInsightsOpen((o) => !o)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    mobileInsightsOpen
                      ? "text-white bg-white/[0.05]"
                      : "text-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    Insights
                  </span>
                  <HiChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${mobileInsightsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileInsightsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-1 px-2 space-y-1.5">
                        {insightsLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => { setMobileOpen(false); setMobileInsightsOpen(false); }}
                            className="group flex items-start gap-3 px-3 py-3 rounded-xl border border-white/[0.06] hover:border-purple-500/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200"
                          >
                            {/* Icon */}
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/15 to-violet-600/10 border border-purple-500/15 flex items-center justify-center shrink-0 text-purple-400/70 group-hover:text-purple-300 transition-colors">
                              {item.icon}
                            </div>
                            <div className="flex flex-col min-w-0 pt-0.5">
                              <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors leading-tight">
                                {item.label}
                              </span>
                              <span className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                                {item.description}
                              </span>
                            </div>
                            <svg className="w-4 h-4 text-gray-700 group-hover:text-purple-400 shrink-0 mt-1 ml-auto transition-colors" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block mt-3 px-4 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-deep rounded-lg"
              >
                Get Free Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
