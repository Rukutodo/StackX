"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  SectionHeading,
  GlassCard,
  Button,
  AnimatedCounter,
  TestimonialCard,
} from "@/components/ui";
import LeadershipSection from "@/components/sections/LeadershipSection";
import {
  HiCode,
  HiCog,
  HiChartBar,
  HiShieldCheck,
  HiLightningBolt,
  HiStar,
  HiCurrencyDollar,
  HiArrowRight,
  HiLightBulb,
  HiLocationMarker,
  HiTrendingUp,
} from "react-icons/hi";
import { useState, useEffect, useCallback } from "react";

/* ── Data ─────────────────────────────────────────────── */

const stats = [
  { end: 5, suffix: "+", label: "Projects Delivered" },
  { end: 5, suffix: "+", label: "Happy Clients" },
  { end: 99.9, suffix: "%", label: "Uptime Guaranteed" },
  { end: 40, suffix: "%", label: "Cost Savings" },
];

const services = [
  {
    icon: HiCode,
    title: "Web Development",
    desc: "Custom web applications, SaaS platforms, e-commerce solutions, and progressive web apps built with modern technologies.",
    color: "from-primary to-primary-deep",
  },
  {
    icon: HiChartBar,
    title: "Ad Tech Solutions",
    desc: "Performance driven advertising platforms, analytics dashboards, and programmatic ad tech development.",
    color: "from-accent to-accent-dark",
  },
    {
    icon: HiCog,
    title: "Digital Marketing",
    desc: "Digital marketing, performance campaigns, and analytics systems designed to bring real customers,not just traffic",
    color: "from-primary-light to-accent",
  },
  {
  icon: HiLightBulb,
  title: "Market Research & Insights",
  desc: "Every product starts with clarity. We research your market, validate your ideas, and shape them around real demand — helping businesses build what truly works, especially in Vizag.",
  color: "from-accent-dark to-primary",
},
];

const whyItems = [
  {
  icon: HiLocationMarker,
  title: "Built for Vizag",
  desc: "We’re local , Which means we deeply understand the audience, behavior, and market dynamics. We build solutions that actually work for Vizag businesses.",
 },
 {
  icon: HiLightningBolt,
  title: "Enthusiasm",
  desc: "A passionate team that treats your project as our own, going above and beyond to deliver excellence.",
},
 {
  icon: HiTrendingUp,
  title: "We Think Beyond Launch",
  desc: "Launch is just the start. Everything we build is designed to grow, adapt, and scale with your business.",
 },
{
  icon: HiCurrencyDollar,
  title: "Spend It Right",
  desc: "Working with us means spending smarter. We focus on clarity, execution, and long-term value  so you don’t end up paying later to fix what should’ve been done right the first time.",
},
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "Communize VIZAG",
    feedback:
      "StackX transformed our digital presence completely. Their attention to detail and cost-effective approach saved us over 35% compared to other agencies while delivering superior quality.",
    rating: 5,
    projectType: "Web Development",
  },
  {
    name: "Sarah Mitchell",
    company: "AdScale Inc.",
    feedback:
      "The ad tech platform they built handles millions of impressions daily without breaking a sweat. Their technical expertise is truly world-class.",
    rating: 5,
    projectType: "Ad Tech",
  },
  {
    name: "Amit Patel",
    company: "FlowSync",
    feedback:
      "Our business processes are now 60% more efficient thanks to the automation solutions StackX implemented. Truly a game-changer for our operations.",
    rating: 5,
    projectType: "Automation",
  },
  {
    name: "Emily Chen",
    company: "TechNova",
    feedback:
      "Working with StackX was a breath of fresh air. They understood our vision from day one and delivered a product that exceeded all expectations.",
    rating: 4,
    projectType: "Web Development",
  },
];

const clientLogos = [
  "Communize",
  "AdScale",
  "FlowSync",
  "TechNova",
  "DataBridge",
  "CloudPeak",
  "NexGen",
  "Finora",
];

/* ── Component ────────────────────────────────────────── */

export default function HomePageClient() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((p) => (p + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial(
      (p) => (p - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative pt-24 pb-8 lg:min-h-screen lg:flex lg:items-center lg:pt-20 overflow-hidden" id="hero">
        {/* ── Layered Background Effects ── */}
        <div className="hero-grid" />
        <div className="hero-scan-line" />
        <div className="hero-glow bg-primary top-10 -left-60 w-[700px] h-[700px]" />
        <div className="hero-glow bg-accent bottom-10 -right-60 w-[500px] h-[500px]" />
        <div className="hero-glow bg-primary-deep top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.07]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.08),transparent_50%)]" />

        {/* ── Floating Particles ── */}
        {[
          { w: 4, h: 4, top: '15%', left: '8%', bg: 'bg-primary/40', dur: '7s', delay: '0s' },
          { w: 3, h: 3, top: '25%', left: '85%', bg: 'bg-accent/50', dur: '5s', delay: '1s' },
          { w: 5, h: 5, top: '70%', left: '12%', bg: 'bg-primary-light/30', dur: '8s', delay: '2s' },
          { w: 3, h: 3, top: '80%', left: '75%', bg: 'bg-primary/30', dur: '6s', delay: '0.5s' },
          { w: 4, h: 4, top: '45%', left: '92%', bg: 'bg-accent/40', dur: '9s', delay: '3s' },
          { w: 2, h: 2, top: '60%', left: '5%', bg: 'bg-accent/50', dur: '6s', delay: '1.5s' },
        ].map((p, i) => (
          <div
            key={`particle-${i}`}
            className={`particle ${p.bg} w-${p.w} h-${p.h} hidden sm:block`}
            style={{
              top: p.top,
              left: p.left,
              width: `${p.w * 4}px`,
              height: `${p.h * 4}px`,
              ['--particle-duration' as string]: p.dur,
              ['--particle-delay' as string]: p.delay,
            }}
          />
        ))}

        {/* ── Main Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 sm:py-14 lg:py-0">
          <div className="lg:flex lg:items-center lg:gap-8">

            {/* ═══ TEXT CONTENT ═══ */}
            <div className="text-left lg:flex-1 lg:max-w-[55%]">
              {/* Shimmer Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <span className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full hero-badge-shimmer text-primary-light border border-primary/25 mb-5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Powering Digital Growth in Vizag
                </span>
              </motion.div>

              {/* ★ MOBILE ORBITAL — floats right beside headline on < lg ★ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="float-right lg:hidden w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] ml-3 sm:ml-5 -mt-1 mb-2 relative"
              >
                <div className="relative w-full h-full">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border border-primary/25 animate-[spin_25s_linear_infinite]" />
                  {/* Middle ring */}
                  <div className="absolute inset-3 sm:inset-4 rounded-full border border-accent/20 animate-[spin_18s_linear_infinite_reverse]" />
                  {/* Inner ring */}
                  <div className="absolute inset-7 sm:inset-9 rounded-full border border-primary/15" />

                  {/* Center logo orb */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/15 blur-sm" />
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-primary via-primary-deep to-accent flex items-center justify-center shadow-xl shadow-primary/30 p-2.5 sm:p-3">
                        <Image
                          src="/StackXhero.svg"
                          alt="StackX"
                          width={56}
                          height={56}
                          priority
                          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Decorative dots */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent/60" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-light/60" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent/60" />
                </div>
              </motion.div>

              {/* Headline with rotating words */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                className="text-[2.2rem] sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem] font-heading font-bold leading-none lg:leading-[1.08] tracking-tight"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                We Build, Validate &{" "}
                <span className="rotating-words">
                  <span className="rotating-words-inner">
                    <span>Scale Businesses</span>
                    <span>Drive Growth</span>
                    <span>Create Impact</span>
                    <span>Launch Brands</span>
                    <span>Scale Businesses</span>
                    {/* 5th span duplicates 1st for seamless loop */}
                  </span>
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-xl text-muted max-w-xl leading-relaxed"
              >
                From idea to growth , we combine technology, marketing, and real market insight to build what actually works.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 sm:mt-8 flex flex-row items-start gap-3 sm:gap-4"
              >
                <Button href="/contact" variant="primary" className="text-sm sm:text-base px-5 sm:px-8 py-3 sm:py-4 animate-pulse-glow">
                  Get Free Consultation
                  <HiArrowRight />
                </Button>
                <Button href="/portfolio" variant="secondary" className="text-sm sm:text-base px-5 sm:px-8 py-3 sm:py-4">
                  View Our Work
                </Button>
              </motion.div>
            </div>

            {/* ═══ DESKTOP ORBITAL — shown lg+ in flex column ═══ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
              className="hidden lg:flex items-center justify-center lg:flex-1"
            >
              <div className="relative w-[400px] h-[400px] xl:w-[440px] xl:h-[440px]">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-primary/10 animate-[spin_30s_linear_infinite]" />
                {/* Middle ring */}
                <div className="absolute inset-8 rounded-full border border-accent/10 animate-[spin_20s_linear_infinite_reverse]" />
                {/* Inner ring */}
                <div className="absolute inset-16 rounded-full border border-primary/15" />
                {/* Innermost glow ring */}
                <div className="absolute inset-24 rounded-full bg-gradient-to-br from-primary/5 to-accent/5" />

                {/* Center glowing orb with StackX logo */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="relative">
                    {/* Outer glow ring */}
                    <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 blur-md" />
                    {/* Main orb */}
                    <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-primary via-primary-deep to-accent flex items-center justify-center shadow-2xl shadow-primary/40 p-6">
                      <Image
                        src="/StackXhero.svg"
                        alt="StackX"
                        width={120}
                        height={120}
                        className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Orbiting icons */}
                {[
                  { icon: "💻", dur: '12s', color: 'from-primary/20 to-primary/5' },
                  { icon: "📊", dur: '12s', color: 'from-accent/20 to-accent/5', startDelay: '3s' },
                  { icon: "🚀", dur: '12s', color: 'from-primary-light/20 to-primary-light/5', startDelay: '6s' },
                  { icon: "⚡", dur: '12s', color: 'from-accent/20 to-accent/5', startDelay: '9s' },
                ].map((orb, i) => (
                  <div
                    key={`orb-${i}`}
                    className="orbit-item z-10"
                    style={{
                      ['--orbit-duration' as string]: orb.dur,
                      animationDelay: orb.startDelay || '0s',
                    }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${orb.color} border border-white/10 backdrop-blur-sm flex items-center justify-center text-xl shadow-lg`}>
                      {orb.icon}
                    </div>
                  </div>
                ))}

                {/* Decorative dots on rings */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/60 shadow-lg shadow-primary/40" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent/60 shadow-lg shadow-accent/40" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-light/60 shadow-lg shadow-primary-light/40" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent/60 shadow-lg shadow-accent/40" />

                {/* Floating labels */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 px-3 py-1.5 rounded-lg bg-surface/80 border border-primary/20 backdrop-blur-sm shadow-xl"
                >
                  <span className="text-xs font-medium text-primary-light">Web Dev</span>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-6 -left-6 px-3 py-1.5 rounded-lg bg-surface/80 border border-accent/20 backdrop-blur-sm shadow-xl"
                >
                  <span className="text-xs font-medium text-accent">Ad Tech</span>
                </motion.div>

                <motion.div
                  animate={{ y: [-3, 7, -3] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="absolute top-1/2 -right-14 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-surface/80 border border-primary-light/20 backdrop-blur-sm shadow-xl"
                >
                  <span className="text-xs font-medium text-primary-light">Marketing</span>
                </motion.div>

                <motion.div
                  animate={{ y: [3, -7, 3] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-1/3 -left-10 px-3 py-1.5 rounded-lg bg-surface/80 border border-accent/20 backdrop-blur-sm shadow-xl"
                >
                  <span className="text-xs font-medium text-accent">Research</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-10 sm:py-16 lg:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <AnimatedCounter
                key={i}
                end={stat.end}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CLIENT LOGOS ═══ */}
      <section className="py-12 border-y border-surface-border bg-surface/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-center text-xs uppercase tracking-widest text-muted">
            Trusted by innovative companies
          </p>
        </div>
        <div className="relative">
          <div className="flex animate-marquee">
            {[...clientLogos, ...clientLogos].map((name, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-8 px-8 py-3 rounded-lg bg-white/[0.03] border border-white/[0.05]"
              >
                <span className="text-lg font-heading font-semibold text-muted/50 whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES OVERVIEW ═══ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="What We Do"
            title="Services That Drive Growth"
            subtitle="From concept to launch to growth, everything we do is designed to move your business forward."
          />

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
                className="glass-card glass-card-hover p-8 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg relative z-10`}
                >
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3
                  className="text-xl font-heading font-semibold mb-3 relative z-10"
                  style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                >
                  {service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-4 relative z-10">
                  {service.desc}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-sm text-primary-light hover:text-accent transition-colors relative z-10"
                >
                  Learn more <HiArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY STACKX ═══ */}
      <section className="py-24 relative bg-surface/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.06),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="Why Choose Us"
            title="Why StackX?"
            subtitle="We understand how businesses grow in Vizag and build systems that actually work here."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItems.map((item, i) => (
              <GlassCard key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-primary-light" />
                </div>
                <h3
                  className="text-lg font-heading font-semibold mb-2"
                  style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LEADERSHIP TEAM ═══ */}
      <LeadershipSection variant="compact" />

      {/* ═══ TESTIMONIALS CAROUSEL ═══ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Testimonials"
            title="What Our Clients Say"
            subtitle="Real stories from real clients who trust StackX to power their digital growth."
          />

          <div className="max-w-3xl mx-auto relative">
            <div className="overflow-hidden">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <TestimonialCard {...testimonials[currentTestimonial]} />
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-white hover:border-primary/30 transition-all cursor-pointer"
                aria-label="Previous testimonial"
              >
                ←
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === currentTestimonial
                      ? "bg-primary w-6"
                      : "bg-white/20"
                      }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-white hover:border-primary/30 transition-all cursor-pointer"
                aria-label="Next testimonial"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="hero-glow bg-primary top-0 left-1/4" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Ready to Build Something{" "}
              <span className="gradient-text">Extraordinary?</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-10">
              Let&apos;s discuss your project and show you how we can deliver
              premium results at unbeatable costs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/contact" variant="primary" className="text-base px-8 py-4">
                Start Your Project
                <HiArrowRight />
              </Button>
              <Button href="/services" variant="outline" className="text-base px-8 py-4">
                Explore Services
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
