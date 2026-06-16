"use client";

import { useState, useEffect, useRef } from "react";
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
    description: "What our clients say",
  },
  {
    href: "/case-studies",
    label: "Case Studies",
    description: "In-depth project analysis",
  },
  {
    href: "/blog",
    label: "Blogs",
    description: "Insights & tutorials",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

            {/* Insights dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setInsightsOpen((o) => !o)}
                className="relative flex items-center gap-1 px-4 py-2 text-[13px] font-medium text-muted/90 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04] tracking-wide uppercase"
              >
                Insights
                <HiChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${insightsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {insightsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 rounded-2xl border border-white/[0.08] shadow-xl shadow-black/40 overflow-hidden"
                    style={{ background: "rgba(19,19,26,0.95)", backdropFilter: "blur(24px)" }}
                  >
                    {insightsLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setInsightsOpen(false)}
                        className="flex flex-col px-4 py-3.5 hover:bg-white/[0.05] transition-colors group border-b border-white/[0.05] last:border-0"
                      >
                        <span className="text-[13px] font-semibold text-white/90 group-hover:text-purple-300 transition-colors">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-0.5">
                          {item.description}
                        </span>
                      </Link>
                    ))}
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
            className="lg:hidden p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition"
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
                  className="w-full flex items-center justify-between px-4 py-3 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span>Insights</span>
                  <HiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${mobileInsightsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileInsightsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pl-4"
                    >
                      {insightsLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => { setMobileOpen(false); setMobileInsightsOpen(false); }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                          {item.label}
                        </Link>
                      ))}
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
