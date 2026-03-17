"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
} from "react-icons/hi";
import { useState, useEffect, useCallback } from "react";

/* ── Data ─────────────────────────────────────────────── */

const stats = [
  { end: 150, suffix: "+", label: "Projects Delivered" },
  { end: 80, suffix: "+", label: "Happy Clients" },
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
    icon: HiCog,
    title: "Business Automation",
    desc: "Streamline operations with intelligent workflow automation, CRM integrations, and custom business process solutions.",
    color: "from-accent to-accent-dark",
  },
  {
    icon: HiChartBar,
    title: "Ad Tech Solutions",
    desc: "Performance-driven advertising platforms, analytics dashboards, and programmatic ad tech development.",
    color: "from-primary-light to-accent",
  },
];

const whyItems = [
  {
    icon: HiShieldCheck,
    title: "Professionalism",
    desc: "Enterprise-grade code quality with rigorous testing, CI/CD pipelines, and comprehensive documentation.",
  },
  {
    icon: HiLightningBolt,
    title: "Enthusiasm",
    desc: "A passionate team that treats your project as our own, going above and beyond to deliver excellence.",
  },
  {
    icon: HiStar,
    title: "Experience",
    desc: "150+ successful projects across diverse industries with deep expertise in modern tech stacks.",
  },
  {
    icon: HiCurrencyDollar,
    title: "Cost Efficiency",
    desc: "Premium quality at 40% lower costs. We optimize every dollar without compromising on performance.",
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

export default function HomePage() {
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
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background effects */}
        <div className="hero-glow bg-primary top-20 -left-40" />
        <div className="hero-glow bg-accent bottom-20 -right-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]" />

        {/* Floating shapes */}
        <div className="absolute top-32 right-[15%] w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/10 animate-float hidden lg:block" />
        <div className="absolute bottom-40 left-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-transparent border border-accent/10 animate-float-reverse hidden lg:block" />
        <div className="absolute top-60 left-[20%] w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light/10 to-transparent border border-primary-light/10 animate-float hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-light border border-primary/20 mb-6">
                🚀 Software Development Agency
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Professional Web Development at{" "}
              <span className="gradient-text">Unbeatable Costs</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
            >
              We build high-performance web solutions, automation systems, and ad&nbsp;tech
              platforms — optimizing costs by up to 40% without compromising quality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button href="/contact" variant="primary" className="text-base px-8 py-4 animate-pulse-glow">
                Get Free Consultation
                <HiArrowRight />
              </Button>
              <Button href="/portfolio" variant="secondary" className="text-base px-8 py-4">
                View Our Work
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-20 relative">
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
            subtitle="From concept to deployment, we deliver end-to-end solutions that transform your business."
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
            subtitle="We combine technical excellence with cost efficiency to deliver solutions that truly matter."
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
