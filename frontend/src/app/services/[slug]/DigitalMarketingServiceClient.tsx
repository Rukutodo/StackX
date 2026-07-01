"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LuCode as Code, 
  LuLayoutDashboard as Layout, 
  LuZap as Zap, 
  LuCheck as CheckCircle, 
  LuArrowRight as ArrowRight, 
  LuChevronDown as ChevronDown, 
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuStar as Star, 
  LuGlobe as Globe, 
  LuShield as Shield, 
  LuLayers as Layers, 
  LuMonitor as Monitor, 
  LuDatabase as Database, 
  LuChartBar as BarChart, 
  LuUsers as Users, 
  LuArrowUpRight as ArrowUpRight, 
  LuServer as Server, 
  LuSmartphone as Smartphone,
  LuRocket as Rocket,
  LuMapPin as MapPin
} from "react-icons/lu";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};
const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};
const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

/* Floating Orb component for reusable ambient glows */
function FloatingOrb({ className }: { className?: string }) {
  return <div className={`absolute rounded-full pointer-events-none ${className}`} />;
}

export default function DigitalMarketingServiceClient({
  overrideTitle,
  overrideTagline,
  overrideBadge = "Data-Driven Digital Marketing",
  initialFaqs = [],
  referenceContent = "",
  breadcrumbs = [],
  city = "",
}: {
  overrideTitle?: string;
  overrideTagline?: string;
  overrideBadge?: string;
  initialFaqs?: { question: string; answer: string }[];
  referenceContent?: string;
  breadcrumbs?: { label: string; href: string }[];
  city?: string;
}) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const toggleFaq = (index: number) => setActiveFaq(activeFaq === index ? null : index);

  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeServiceSlide, setActiveServiceSlide] = useState(0);
  const serviceScrollRef = useRef<HTMLDivElement>(null);

  const handleServiceScroll = () => {
    if (serviceScrollRef.current && serviceScrollRef.current.children[0]) {
      const scrollLeft = serviceScrollRef.current.scrollLeft;
      const childWidth = (serviceScrollRef.current.children[0] as HTMLElement).offsetWidth;
      // account for gap (gap-4 is 16px)
      const index = Math.round(scrollLeft / (childWidth + 16));
      setActiveServiceSlide(index);
    }
  };

  const scrollServiceTo = (index: number) => {
    if (serviceScrollRef.current && serviceScrollRef.current.children[index]) {
      serviceScrollRef.current.children[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const heroSlides = [
    "/illustrations/web-dev/webdevhero1.svg",
    "/illustrations/web-dev/webdevhero2.svg",
    "/illustrations/web-dev/webdevhero3.svg"
  ];

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/portfolio?featured=true`);
        if (res.ok) {
          const data = await res.json();
          // Filter strictly for Web Development projects (or related web categories)
          const webProjects = data.filter((p: any) => 
            p.category === "Web Development" || p.category === "SaaS" || p.category === "E-commerce"
          );
          setProjects(webProjects.slice(0, 3));
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    }

    async function fetchTestimonials() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          const webTestimonials = data.filter((t: any) => {
            const pt = (t.projectType || "").toLowerCase();
            return pt.includes("web") || pt.includes("saas") || pt.includes("e-commerce") || pt.includes("platform");
          });
          setTestimonials(webTestimonials.slice(0, 3));
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
        setTestimonials([]);
      } finally {
        setLoadingTestimonials(false);
      }
    }

    fetchProjects();
    fetchTestimonials();

    const heroTimer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(heroTimer);
  }, [heroSlides.length]);

  const displayTitle = overrideTitle || "Data-Driven Digital Marketing";
  const displayTagline = overrideTagline || "We engineer high-performance, visually stunning web applications tailored to elevate your brand and drive conversion. From custom marketing sites to complex SaaS platforms, we turn your vision into reality.";

  const hasFaqs = initialFaqs.length > 0;
  const hasContent = referenceContent.trim().length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Fixed Background Ambient - brighter & more colorful */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[150px] animate-pulse" />
        <div className="absolute top-[30%] right-[-15%] w-[45%] h-[45%] rounded-full bg-accent/12 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary-deep/10 blur-[120px]" />
        <div className="absolute inset-0 hero-grid opacity-40" />
      </div>

      <div className="relative z-10 pt-20 lg:pt-0">

        {/* ═══════════ BREADCRUMB ═══════════ */}
        {breadcrumbs.length > 0 && (
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-0 lg:pt-32" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-muted flex-wrap">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="w-3 h-3 text-muted/40" />}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-white/70 font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-primary-light transition">{crumb.label}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* ═══════════ HERO SECTION ═══════════ */}
        <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 overflow-hidden">
          {/* Hero gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <FloatingOrb className="w-72 h-72 bg-primary/20 blur-[100px] top-20 left-10 animate-float" />
          <FloatingOrb className="w-56 h-56 bg-accent/15 blur-[80px] bottom-10 right-20 animate-float-reverse" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
            <motion.div className="flex-1 text-left" initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-sm font-medium text-primary-light mb-6 hero-badge-shimmer">
                <Code className="w-4 h-4" />
                <span>{overrideBadge}</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold font-heading leading-tight mb-6">
                {overrideTitle ? overrideTitle : <>Build Digital <br className="hidden lg:block"/><span className="gradient-text-glow">Experiences That Scale</span></>}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-muted mb-8 max-w-2xl">
                {displayTagline}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 rounded-xl bg-primary hover:bg-primary-deep text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] hover:scale-[1.02]">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 rounded-xl glass-card hover:border-primary/50 text-foreground font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]">
                  View Portfolio
                </button>
              </motion.div>
            </motion.div>

            <motion.div className="flex-1 w-full flex items-center justify-center" initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
              <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHeroSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Image
                      src={heroSlides[currentHeroSlide]}
                      alt="Web Development Service"
                      fill
                      priority
                      className="object-contain drop-shadow-2xl p-4"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ SERVICE BREAKDOWN ═══════════ */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
          <FloatingOrb className="w-64 h-64 bg-accent/10 blur-[100px] -top-20 right-0" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Core <span className="gradient-text-glow">Offerings</span></h2>
              <p className="text-muted max-w-2xl mx-auto text-lg">Comprehensive web solutions combining cutting-edge technology with unparalleled design aesthetics.</p>
            </motion.div>

            <motion.div 
              ref={serviceScrollRef}
              onScroll={handleServiceScroll}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-80px" }} 
              variants={staggerContainer}
            >
              {[
                { icon: Layout, title: "Front-End Development", desc: "Immersive, lightning-fast user interfaces utilizing React, Next.js, and advanced modern CSS.", color: "from-primary/20 to-accent/10" },
                { icon: Server, title: "Back-End Architecture", desc: "Scalable, secure APIs and database structures capable of handling high-volume traffic.", color: "from-accent/20 to-primary/10" },
                { icon: Globe, title: "E-Commerce Solutions", desc: "High-converting online stores built on headless Shopify or fully custom stacks.", color: "from-primary/15 to-success/10" },
                { icon: Database, title: "CMS Integration", desc: "Flexible content management setups using Sanity, Contentful, or Strapi for easy editing.", color: "from-accent/15 to-primary/10" },
                { icon: Smartphone, title: "Progressive Web Apps", desc: "App-like experiences directly in the browser, fully offline capable and blazing fast.", color: "from-primary/20 to-accent/15" },
                { icon: Zap, title: "Performance Optimization", desc: "Core Web Vitals auditing and deep speed optimization for higher SEO rankings.", color: "from-warning/10 to-primary/15" }
              ].map((service, idx) => (
                <motion.div key={idx} variants={scaleIn} className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center glass-card glass-card-hover p-6 md:p-8 group relative overflow-hidden transition-all duration-500 hover:-translate-y-2">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:-translate-y-0 transition-all duration-500">
                    <service.icon className="w-36 h-36 text-primary" />
                  </div>
                  {/* [Service Icon/GIF Placeholder] */}
                  <div className="relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 flex items-center justify-center text-primary-light mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all duration-300">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="relative z-10 text-muted leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Carousel Controls */}
            <div className="flex md:hidden items-center justify-center gap-4 mt-2">
              <button 
                onClick={() => scrollServiceTo(activeServiceSlide === 0 ? 5 : activeServiceSlide - 1)} 
                className="w-10 h-10 rounded-full bg-surface-light border border-white/10 flex items-center justify-center text-muted hover:text-white hover:bg-surface-light/80 transition-all"
                aria-label="Previous offering"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollServiceTo(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeServiceSlide === idx ? "bg-primary w-6" : "bg-white/20 hover:bg-white/40"}`}
                    aria-label={`Go to offering ${idx + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={() => scrollServiceTo(activeServiceSlide === 5 ? 0 : activeServiceSlide + 1)} 
                className="w-10 h-10 rounded-full bg-surface-light border border-white/10 flex items-center justify-center text-muted hover:text-white hover:bg-surface-light/80 transition-all"
                aria-label="Next offering"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════ WHY CHOOSE US ═══════════ */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-light/50 via-transparent to-accent/[0.03] pointer-events-none" />
          <FloatingOrb className="w-80 h-80 bg-primary/12 blur-[120px] top-1/2 -translate-y-1/2 -left-40" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
              <motion.div className="flex-1 w-full" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInLeft}>
                <div className="relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">
                  <Image
                    src="/why-webdev2.svg"
                    alt="Why Choose StackX for Web Development"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>

              <motion.div className="flex-1" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <motion.h2 variants={slideInRight} className="text-3xl md:text-5xl font-bold font-heading mb-6">Why Partner With <span className="gradient-text-glow">StackX</span></motion.h2>
                <motion.p variants={slideInRight} className="text-muted mb-8 text-lg">We don&apos;t just write code; we build digital assets that drive real business value.</motion.p>

                <div className="space-y-3">
                  {[
                    { title: "Pixel-Perfect Implementation", desc: "Exact translation of UI/UX designs into flawless, fully responsive code across all devices." },
                    { title: "Performance First Architecture", desc: "Heavily optimized codebases ensuring sub-second load times and seamless interactions." },
                    { title: "SEO & Accessibility Ready", desc: "Built with semantic HTML, rich snippets, and accessibility best practices from day one." },
                    { title: "Enterprise-Grade Security", desc: "Robust data protection, secure API endpoints, and defense against common web vulnerabilities." }
                  ].map((item, idx) => (
                    <motion.div key={idx} variants={fadeInUp} className="flex gap-4 group p-4 rounded-xl hover:bg-surface-light/50 transition-all duration-300">
                      <div className="mt-1 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all duration-300">
                        <CheckCircle className="w-5 h-5 text-primary-light" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground mb-1">{item.title}</h4>
                        <p className="text-muted text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════ PROCESS SECTION ═══════════ */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent pointer-events-none" />
          <FloatingOrb className="w-72 h-72 bg-accent/10 blur-[100px] top-20 right-10" />
          <FloatingOrb className="w-56 h-56 bg-primary/10 blur-[80px] bottom-20 left-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Our Proven <span className="gradient-text-glow">Process</span></h2>
              <p className="text-muted max-w-2xl mx-auto text-lg">A streamlined, transparent workflow ensuring delivery on time and above expectations.</p>
            </motion.div>

            <div className="relative">
              {/* Glowing connecting line (Desktop) */}
              <div className="hidden lg:block absolute top-[48px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 z-0 shadow-[0_0_8px_rgba(139,92,246,0.3)]" />

              <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 relative z-10" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}>
                {[
                  { step: "01", title: "Discovery & Strategy", desc: "Understanding your business goals, audience, and technical requirements.", icon: Globe },
                  { step: "02", title: "Prototyping & UX", desc: "Structuring the application flow, wireframes, and interactive prototypes.", icon: Layout },
                  { step: "03", title: "Development", desc: "Agile sprints building robust, scalable front-end and back-end features.", icon: Code },
                  { step: "04", title: "QA & Launch", desc: "Cross-browser testing, performance auditing, and zero-downtime deployment.", icon: Rocket }
                ].map((process, idx) => (
                  <motion.div key={idx} variants={fadeInUp} className="relative p-3 sm:p-6 text-center group">
                    {/* [Process Step GIF Placeholder] */}
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-surface-light border-2 border-surface-border mx-auto flex items-center justify-center mb-3 sm:mb-6 relative group-hover:border-primary/60 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all duration-500">
                      <span className="text-xl sm:text-3xl font-bold gradient-text">{process.step}</span>
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
                        <process.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-light" />
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-3 text-foreground">{process.title}</h3>
                    <p className="text-muted text-xs sm:text-sm leading-relaxed">{process.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════ RESULTS & METRICS ═══════════ */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] via-accent/[0.03] to-primary/[0.04] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {[
                { metric: "100", label: "Core Web Vitals", gradient: "from-primary/10 to-accent/5" },
                { metric: "99.9%", label: "Uptime Guaranteed", gradient: "from-accent/10 to-primary/5" },
                { metric: "3x", label: "Faster Load Times", gradient: "from-primary/10 to-success/5" },
                { metric: "2.5x", label: "Avg. Conversion Boost", gradient: "from-warning/8 to-primary/5" }
              ].map((stat, idx) => (
                <motion.div key={idx} variants={scaleIn} className={`glass-card p-6 md:p-10 text-center flex flex-col justify-center items-center group hover:-translate-y-2 transition-all duration-500 bg-gradient-to-br ${stat.gradient}`}>
                  <h3 className="text-4xl md:text-6xl font-bold gradient-text-glow mb-3 font-heading group-hover:scale-110 transition-transform duration-500">{stat.metric}</h3>
                  <p className="text-xs md:text-sm text-muted uppercase tracking-widest font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════ PRICING ═══════════ */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.04] to-transparent pointer-events-none" />
          <FloatingOrb className="w-60 h-60 bg-primary/10 blur-[100px] top-10 left-10" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Transparent <span className="gradient-text-glow">Pricing</span></h2>
              <p className="text-muted max-w-2xl mx-auto text-lg">Investment plans structured to match your scale, ambition, and technical needs.</p>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="glass-card p-8 flex flex-col hover:-translate-y-2 transition-all duration-500 bg-gradient-to-b from-surface-light/30 to-transparent">
                <h3 className="text-2xl font-bold mb-2">Startup</h3>
                <p className="text-muted text-sm mb-6 h-10">Perfect for startups needing a modern, blazing-fast web presence.</p>
                <div className="mb-8 pb-8 border-b border-surface-border"><span className="text-4xl font-bold gradient-text">Custom</span></div>
                <ul className="space-y-4 mb-8 flex-1 text-sm text-muted">
                  {["Up to 5 Pages","Responsive Design & Animations","Basic Technical SEO Setup","Advanced Contact Forms"].map((f,i)=>(
                    <li key={i} className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-primary" /> {f}</li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-xl border border-surface-border hover:border-primary hover:bg-primary/10 transition-all duration-300 font-semibold text-foreground hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">Inquire Now</button>
              </motion.div>

              <motion.div variants={scaleIn} className="glass-card p-8 flex flex-col relative md:-translate-y-4 shadow-[0_0_40px_rgba(139,92,246,0.2)] border-primary/50 bg-gradient-to-b from-primary/10 via-surface-light to-surface hover:-translate-y-6 transition-all duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Most Popular</div>
                <h3 className="text-2xl font-bold mb-2">Business Plus</h3>
                <p className="text-muted text-sm mb-6 h-10">Advanced features, dynamic content, and CMS integrations for growing companies.</p>
                <div className="mb-8 pb-8 border-b border-surface-border"><span className="text-4xl font-bold gradient-text">Custom</span></div>
                <ul className="space-y-4 mb-8 flex-1 text-sm text-muted">
                  {["Up to 15 Pages","Headless CMS Integration","Complex Scroll Animations","Deep Performance Optimization","Analytics & Event Tracking"].map((f,i)=>(
                    <li key={i} className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-primary" /> {f}</li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-xl bg-primary hover:bg-primary-deep text-white transition-all duration-300 font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]">Inquire Now</button>
              </motion.div>

              <motion.div variants={fadeInUp} className="glass-card p-8 flex flex-col hover:-translate-y-2 transition-all duration-500 bg-gradient-to-b from-surface-light/30 to-transparent">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-muted text-sm mb-6 h-10">Complex web applications, client portals, or high-volume custom E-commerce.</p>
                <div className="mb-8 pb-8 border-b border-surface-border"><span className="text-4xl font-bold gradient-text">Custom</span></div>
                <ul className="space-y-4 mb-8 flex-1 text-sm text-muted">
                  {["Unlimited Pages / Dynamic Routing","Full-Stack App / Custom Database","Complex 3rd-Party API Integrations","Enterprise Security & Auth","Priority 24/7 SLA Support"].map((f,i)=>(
                    <li key={i} className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-primary" /> {f}</li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-xl border border-surface-border hover:border-primary hover:bg-primary/10 transition-all duration-300 font-semibold text-foreground hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">Inquire Now</button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ PORTFOLIO ═══════════ */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] via-transparent to-primary/[0.03] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div>
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Featured <span className="gradient-text-glow">Work</span></h2>
                <p className="text-muted text-lg max-w-xl">Explore a selection of our recent web development projects.</p>
              </div>
              <Link href="/portfolio" className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-medium border-b border-transparent hover:border-primary-light pb-1">
                View Complete Portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {loadingProjects ? (
                // Skeletons
                [1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-full h-[300px] md:h-[450px] rounded-2xl border border-surface-border/50 bg-surface animate-pulse"></div>
                ))
              ) : projects.length > 0 ? (
                projects.map((project, idx) => (
                  <motion.div 
                    key={project._id || idx} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group glass-card rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] bg-gradient-to-b from-surface-light/50 to-transparent"
                  >
                    
                    {/* Image Section */}
                    <div className="w-full relative aspect-video overflow-hidden border-b border-surface-border/50 bg-surface">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 z-10 group-hover:opacity-0 transition-opacity duration-500" />
                      {project.image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${project.image}`}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Monitor className="w-10 h-10 text-primary/20 mb-2 group-hover:scale-110 transition-transform duration-500" />
                          <p className="text-muted/50 text-[10px] uppercase tracking-widest font-medium">{project.title}</p>
                        </div>
                      )}
                      {project.result && (
                        <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded bg-background/90 backdrop-blur-md border border-surface-border text-success text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <BarChart className="w-3 h-3" /> {project.result}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4 md:p-6 flex flex-col flex-1">
                      <span className="text-primary-light text-[8px] md:text-[10px] font-bold uppercase tracking-wider mb-1 md:mb-2 line-clamp-1">
                        {project.category || "Featured Work"}
                      </span>
                      
                      <h3 className="text-sm md:text-xl font-bold font-heading mb-1 md:mb-2 group-hover:text-primary-light transition-colors duration-300 line-clamp-1">
                        {project.title}
                      </h3>
                      
                      <p className="text-muted text-xs md:text-sm leading-relaxed mb-3 md:mb-5 flex-1 line-clamp-2 md:line-clamp-3">
                        {project.description}
                      </p>

                      {project.techStack && project.techStack.length > 0 && (
                        <div className="mb-3 md:mb-5 flex flex-wrap gap-1 md:gap-1.5 hidden sm:flex">
                          {project.techStack.slice(0, 3).map((tech: string, i: number) => (
                            <span key={i} className="px-1.5 md:px-2 py-0.5 rounded bg-surface border border-white/5 text-muted-light text-[8px] md:text-[10px] font-medium transition-colors">
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="px-1.5 md:px-2 py-0.5 rounded bg-transparent border border-white/5 text-muted/60 text-[8px] md:text-[10px] font-medium">
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {project.slug && project.caseStudy && (
                        <div className="mt-auto pt-3 md:pt-4 border-t border-surface-border/50">
                          <Link href={`/portfolio/${project.slug}`} className="inline-flex items-center gap-1 md:gap-2 text-primary-light text-xs md:text-sm font-bold hover:text-white transition-colors duration-300 group/btn">
                            <span className="hidden sm:inline">View Case Study</span><span className="sm:hidden">View</span> <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                [
                  { category: "Web Application", title: "Fintech Dashboard", description: "A high-performance financial data visualization tool built with React and D3.js.", result: "300% Faster Load" },
                  { category: "E-Commerce", title: "Luxury Fashion Store", description: "Headless Shopify storefront with stunning product animations and 3D views.", result: "2x Conversion" },
                  { category: "SaaS Platform", title: "HR Management Suite", description: "Enterprise-grade HR platform with real-time analytics and role-based access.", result: "99.9% Uptime" }
                ].map((project, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group glass-card rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] bg-gradient-to-b from-surface-light/50 to-transparent"
                  >
                    <div className="w-full relative aspect-video overflow-hidden border-b border-surface-border/50 bg-surface">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 z-10 group-hover:opacity-0 transition-opacity duration-500" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Monitor className="w-10 h-10 text-primary/20 mb-2 group-hover:scale-110 transition-transform duration-500" />
                        <p className="text-muted/50 text-[10px] uppercase tracking-widest font-medium">[Project Image {idx + 1}]</p>
                      </div>
                      <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded bg-background/90 backdrop-blur-md border border-surface-border text-success text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <BarChart className="w-3 h-3" /> {project.result}
                      </div>
                    </div>
                    <div className="p-4 md:p-6 flex flex-col flex-1">
                      <span className="text-primary-light text-[8px] md:text-[10px] font-bold uppercase tracking-wider mb-1 md:mb-2 line-clamp-1">
                        {project.category}
                      </span>
                      <h3 className="text-sm md:text-xl font-bold font-heading mb-1 md:mb-2 group-hover:text-primary-light transition-colors duration-300 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-muted text-xs md:text-sm leading-relaxed mb-3 md:mb-5 flex-1 line-clamp-2 md:line-clamp-3">
                        {project.description}
                      </p>
                      <div className="mt-auto pt-3 md:pt-4 border-t border-surface-border/50">
                        <button className="inline-flex items-center gap-1 md:gap-2 text-primary-light text-xs md:text-sm font-bold hover:text-white transition-colors duration-300 group/btn">
                          <span className="hidden sm:inline">View Case Study</span><span className="sm:hidden">View</span> <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
          <FloatingOrb className="w-72 h-72 bg-accent/10 blur-[100px] top-0 right-20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Client <span className="gradient-text-glow">Success Stories</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loadingTestimonials ? (
                // Skeletons
                [1, 2, 3].map(i => (
                  <div key={i} className="w-full h-[250px] rounded-2xl border border-surface-border/50 bg-surface animate-pulse"></div>
                ))
              ) : testimonials.length > 0 ? (
                testimonials.map((testimonial, idx) => (
                  <motion.div 
                    key={testimonial._id || idx} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="glass-card p-8 relative bg-gradient-to-br from-surface-light/50 to-transparent hover:-translate-y-2 transition-all duration-500 group shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] border-t border-white/5"
                  >
                    <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 font-serif text-7xl leading-none transition-colors">&ldquo;</div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'fill-warning text-warning' : 'fill-surface-light text-surface-light'}`} />
                      ))}
                    </div>
                    <p className="text-foreground mb-8 text-sm leading-relaxed relative z-10">&ldquo;{testimonial.feedback || testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/20 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Users className="w-5 h-5 text-primary-light" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{testimonial.name}</h4>
                        <p className="text-xs text-muted mt-0.5">{testimonial.role}{testimonial.role && testimonial.company ? ', ' : ''}{testimonial.company}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                [
                  { name: "Sarah Jenkins", role: "CTO, TechFlow", quote: "StackX transformed our outdated monolith into a lightning-fast modern web app. Their engineering rigor is unmatched.", rating: 5 },
                  { name: "Marcus Chen", role: "Founder, Elevate SaaS", quote: "The best development agency we've partnered with. Flawless execution and incredible communication throughout.", rating: 5 },
                  { name: "Emma Watson", role: "Marketing Dir, Nova", quote: "Conversion rates doubled in the first month post-launch purely thanks to their UX optimizations.", rating: 5 }
                ].map((testimonial, idx) => (
                  <motion.div key={idx} variants={scaleIn} className="glass-card p-8 relative bg-gradient-to-br from-surface-light/50 to-transparent hover:-translate-y-2 transition-all duration-500 group shadow-[0_0_20px_rgba(0,0,0,0.15)] border-t border-white/5">
                    <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 font-serif text-7xl leading-none transition-colors">&ldquo;</div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'fill-warning text-warning' : 'fill-surface-light text-surface-light'}`} />
                      ))}
                    </div>
                    <p className="text-foreground mb-8 text-sm leading-relaxed relative z-10">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/20 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Users className="w-5 h-5 text-primary-light" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{testimonial.name}</h4>
                        <p className="text-xs text-muted mt-0.5">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
              <p className="text-muted">Everything you need to know about our web development services.</p>
            </motion.div>

            {(() => {
              // Use DB FAQs if available, otherwise fall back to hardcoded defaults
              const faqItems = initialFaqs.length > 0 ? initialFaqs : [
                { question: "How long does a typical web development project take?", answer: "Depending on complexity, a standard marketing site might take 4-6 weeks, while a custom web application can take 3-6 months. We provide detailed, realistic timelines during our discovery phase." },
                { question: "Do you build from scratch or use pre-made templates?", answer: "We build 100% custom, hand-coded solutions tailored specifically to your brand and technical requirements. We do not rely on pre-made themes." },
                { question: "Do you provide ongoing maintenance after launch?", answer: "Yes, we offer flexible retainer packages for ongoing support, security updates, feature additions, and performance monitoring." },
                { question: "What technology stack do you specialize in?", answer: "Our core frontend stack utilizes React, Next.js, and Tailwind CSS. For backend, we leverage Node.js, Python, and scalable cloud environments." }
              ];
              return (
                <div className="space-y-4">
                  {faqItems.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: index * 0.07 }}
                      className="glass-card overflow-hidden hover:border-primary/20 transition-colors"
                    >
                      <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none group">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors pr-8">{faq.question}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${activeFaq === index ? 'rotate-180 bg-primary/20 text-primary' : 'bg-surface-light text-muted'}`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>
                      <AnimatePresence>
                        {activeFaq === index && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                            <div className="p-6 pt-0 text-muted text-sm leading-relaxed border-t border-surface-border/30 mt-2">{faq.answer}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="relative py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="relative rounded-3xl overflow-hidden gradient-border shadow-[0_0_60px_rgba(139,92,246,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-light to-surface z-0" />
              <FloatingOrb className="w-[500px] h-[500px] bg-primary/25 blur-[120px] -top-1/2 right-0 z-0" />
              <FloatingOrb className="w-[400px] h-[400px] bg-accent/20 blur-[100px] -bottom-1/2 left-0 z-0" />
              <div className="relative z-10 text-center py-20 px-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 animate-float">
                  <Rocket className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">Ready to Build <br/><span className="gradient-text-glow">Something Amazing?</span></h2>
                <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">Let&apos;s discuss your vision and see how our engineering team can bring it to life.</p>
                <button className="px-10 py-5 rounded-xl bg-primary hover:bg-primary-deep text-white font-bold transition-all duration-300 inline-flex items-center gap-3 shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] hover:scale-[1.03] group">
                  Start a Conversation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ RICH CONTENT (from Reference) ═══════════ */}
        {hasContent && (
          <section className="py-20 relative border-t border-white/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-6 text-muted leading-relaxed text-lg text-justify">
                {referenceContent.split('\n').filter(p => p.trim() !== '').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        )}



        {/* ═══════════ OTHER SERVICES ═══════════ */}
        <section className="relative pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h3 className="text-xl font-bold font-heading mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>Explore Other Services</motion.h3>
            <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {[
                { title: "Ad Tech Solutions", icon: BarChart, link: "/services/ad-tech-solutions" },
                { title: "Digital Marketing", icon: Rocket, link: "/services/digital-marketing" },
                { title: "Market Research & Insights", icon: Users, link: "/services/market-research" }
              ].map((srv, idx) => (
                <motion.div key={idx} variants={fadeInUp}>
                  <Link href={srv.link} className="glass-card p-6 flex items-center justify-between group hover:border-primary/40 hover:bg-surface-light/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3">
                      <srv.icon className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                      <span className="font-semibold text-sm group-hover:text-primary-light transition-colors">{srv.title}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
