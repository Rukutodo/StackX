"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { 
  LuCode as Code, 
  LuLayoutDashboard as Layout, 
  LuZap as Zap, 
  LuCheck as CheckCircle, 
  LuArrowRight as ArrowRight, 
  LuChevronDown as ChevronDown, 
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
  LuRocket as Rocket
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

export default function WebDevelopmentServiceClient({
  overrideTitle,
  overrideTagline,
  overrideBadge = "Premium Web Development"
}: {
  overrideTitle?: string;
  overrideTagline?: string;
  overrideBadge?: string;
}) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const toggleFaq = (index: number) => setActiveFaq(activeFaq === index ? null : index);

  const displayTitle = overrideTitle || "Experiences That Scale";
  const displayTagline = overrideTagline || "We engineer high-performance, visually stunning web applications tailored to elevate your brand and drive conversion. From custom marketing sites to complex SaaS platforms, we turn your vision into reality.";

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

            <motion.div className="flex-1 w-full" initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
              <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden gradient-border bg-gradient-to-br from-surface via-surface-light to-surface animate-pulse-glow">
                {/* [Hero Illustration/GIF Placeholder] */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center animate-float">
                      <Monitor className="w-12 h-12 text-primary-light" />
                    </div>
                    <p className="text-primary-light/70 text-sm font-semibold tracking-widest uppercase mb-1">Tailored {overrideBadge}</p>
                    <p className="text-muted/50 text-xs">High-performance digital solutions</p>
                  </div>
                </div>
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

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}>
              {[
                { icon: Layout, title: "Front-End Development", desc: "Immersive, lightning-fast user interfaces utilizing React, Next.js, and advanced modern CSS.", color: "from-primary/20 to-accent/10" },
                { icon: Server, title: "Back-End Architecture", desc: "Scalable, secure APIs and database structures capable of handling high-volume traffic.", color: "from-accent/20 to-primary/10" },
                { icon: Globe, title: "E-Commerce Solutions", desc: "High-converting online stores built on headless Shopify or fully custom stacks.", color: "from-primary/15 to-success/10" },
                { icon: Database, title: "CMS Integration", desc: "Flexible content management setups using Sanity, Contentful, or Strapi for easy editing.", color: "from-accent/15 to-primary/10" },
                { icon: Smartphone, title: "Progressive Web Apps", desc: "App-like experiences directly in the browser, fully offline capable and blazing fast.", color: "from-primary/20 to-accent/15" },
                { icon: Zap, title: "Performance Optimization", desc: "Core Web Vitals auditing and deep speed optimization for higher SEO rankings.", color: "from-warning/10 to-primary/15" }
              ].map((service, idx) => (
                <motion.div key={idx} variants={scaleIn} className="glass-card glass-card-hover p-8 group relative overflow-hidden transition-all duration-500 hover:-translate-y-2">
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
          </div>
        </section>

        {/* ═══════════ WHY CHOOSE US ═══════════ */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-light/50 via-transparent to-accent/[0.03] pointer-events-none" />
          <FloatingOrb className="w-80 h-80 bg-primary/12 blur-[120px] top-1/2 -translate-y-1/2 -left-40" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <motion.div className="flex-1 w-full" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInLeft}>
                <div className="relative w-full aspect-square md:aspect-video lg:aspect-square rounded-2xl overflow-hidden gradient-border">
                  {/* [Why Choose Us GIF Placeholder] */}
                  <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-light to-surface flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/20 flex items-center justify-center animate-float-reverse">
                        <Shield className="w-10 h-10 text-accent" />
                      </div>
                      <p className="text-accent/60 text-sm font-semibold tracking-widest uppercase mb-1">[Why Us GIF / Illustration]</p>
                      <p className="text-muted/50 text-xs">Replace with trust-building visual</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div className="flex-1" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <motion.h2 variants={slideInRight} className="text-3xl md:text-5xl font-bold font-heading mb-6">Why Partner With <span className="gradient-text-glow">StackX</span></motion.h2>
                <motion.p variants={slideInRight} className="text-muted mb-10 text-lg">We don&apos;t just write code; we build digital assets that drive real business value.</motion.p>

                <div className="space-y-6">
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
              {/* Glowing connecting line */}
              <div className="hidden lg:block absolute top-[48px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 z-0 shadow-[0_0_8px_rgba(139,92,246,0.3)]" />

              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}>
                {[
                  { step: "01", title: "Discovery & Strategy", desc: "Understanding your business goals, audience, and technical requirements.", icon: Globe },
                  { step: "02", title: "Prototyping & UX", desc: "Structuring the application flow, wireframes, and interactive prototypes.", icon: Layout },
                  { step: "03", title: "Development", desc: "Agile sprints building robust, scalable front-end and back-end features.", icon: Code },
                  { step: "04", title: "QA & Launch", desc: "Cross-browser testing, performance auditing, and zero-downtime deployment.", icon: Rocket }
                ].map((process, idx) => (
                  <motion.div key={idx} variants={fadeInUp} className="relative p-6 text-center group">
                    {/* [Process Step GIF Placeholder] */}
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-surface-light to-surface border-2 border-surface-border mx-auto flex items-center justify-center mb-6 relative group-hover:border-primary/60 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all duration-500">
                      <span className="text-3xl font-bold gradient-text">{process.step}</span>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
                        <process.icon className="w-4 h-4 text-primary-light" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{process.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{process.desc}</p>
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

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {[
                { tag: "Web Application", title: "Fintech Dashboard", desc: "A high-performance financial data visualization tool built with React and D3.js." },
                { tag: "E-Commerce", title: "Luxury Fashion Store", desc: "Headless Shopify storefront with stunning product animations and 3D views." },
                { tag: "SaaS Platform", title: "HR Management Suite", desc: "Enterprise-grade HR platform with real-time analytics and role-based access." }
              ].map((project, idx) => (
                <motion.div key={idx} variants={scaleIn} className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer border border-surface-border/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-light via-surface to-surface-light flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="w-10 h-10 text-primary/20 mx-auto mb-2" />
                      <p className="text-muted/50 text-xs uppercase tracking-widest">[Project Image {idx + 1}]</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                    <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.tag}</span>
                    <h3 className="text-2xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{project.title}</h3>
                    <p className="text-muted text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 line-clamp-2">{project.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {[
                { name: "Sarah Jenkins", role: "CTO, TechFlow", quote: "StackX transformed our outdated monolith into a lightning-fast modern web app. Their engineering rigor is unmatched." },
                { name: "Marcus Chen", role: "Founder, Elevate SaaS", quote: "The best development agency we've partnered with. Flawless execution and incredible communication throughout." },
                { name: "Emma Watson", role: "Marketing Dir, Nova", quote: "Conversion rates doubled in the first month post-launch purely thanks to their UX optimizations." }
              ].map((testimonial, idx) => (
                <motion.div key={idx} variants={scaleIn} className="glass-card p-8 relative bg-gradient-to-br from-surface-light/50 to-transparent hover:-translate-y-2 transition-all duration-500 group">
                  <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 font-serif text-7xl leading-none transition-colors">&ldquo;</div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-warning text-warning" />)}
                  </div>
                  <p className="text-foreground mb-8 text-sm leading-relaxed relative z-10">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/20 shrink-0">
                      <Users className="w-5 h-5 text-primary-light" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{testimonial.name}</h4>
                      <p className="text-xs text-muted mt-0.5">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
            <motion.div className="space-y-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {[
                { q: "How long does a typical web development project take?", a: "Depending on complexity, a standard marketing site might take 4-6 weeks, while a custom web application can take 3-6 months. We provide detailed, realistic timelines during our discovery phase." },
                { q: "Do you build from scratch or use pre-made templates?", a: "We build 100% custom, hand-coded solutions tailored specifically to your brand and technical requirements. We do not rely on pre-made themes." },
                { q: "Do you provide ongoing maintenance after launch?", a: "Yes, we offer flexible retainer packages for ongoing support, security updates, feature additions, and performance monitoring." },
                { q: "What technology stack do you specialize in?", a: "Our core frontend stack utilizes React, Next.js, and Tailwind CSS. For backend, we leverage Node.js, Python, and scalable cloud environments." }
              ].map((faq, index) => (
                <motion.div key={index} variants={fadeInUp} className="glass-card overflow-hidden hover:border-primary/20 transition-colors">
                  <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none group">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors pr-8">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${activeFaq === index ? 'rotate-180 bg-primary/20 text-primary' : 'bg-surface-light text-muted'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <div className="p-6 pt-0 text-muted text-sm leading-relaxed border-t border-surface-border/30 mt-2">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
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

        {/* ═══════════ OTHER SERVICES ═══════════ */}
        <section className="relative pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h3 className="text-xl font-bold font-heading mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>Explore Other Services</motion.h3>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {[
                { title: "UI/UX Design", icon: Layers, link: "/services/ui-ux-design" },
                { title: "Mobile App Dev", icon: Smartphone, link: "/services/mobile-development" },
                { title: "SEO Optimization", icon: BarChart, link: "/services/seo" },
                { title: "Cloud Hosting", icon: Server, link: "/services/cloud" }
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
