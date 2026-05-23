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
import { ICON_MAP } from "../ServicesClient";
import FeaturedWorkSection from "@/components/sections/FeaturedWorkSection";
import SuccessStoriesSection from "@/components/sections/SuccessStoriesSection";
import { GlassCard, Button } from "@/components/ui";

interface AccordionItem {
  title: string;
  desc: string;
}

interface ServiceCategory {
  _id: string;
  slug: string;
  title: string;
  icon?: string;
  tagline: string;
  pricing: string;
  techStack: string[];
  items: AccordionItem[];
  featuredProjects: any[];
  testimonials: any[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

function FloatingOrb({ className }: { className?: string }) {
  return <div className={`absolute rounded-full pointer-events-none ${className}`} />;
}

export default function ServiceClient({ 
  service,
  overrideTitle,
  overrideTagline
}: { 
  service: ServiceCategory;
  overrideTitle?: string;
  overrideTagline?: string;
}) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const toggleFaq = (index: number) => setActiveFaq(activeFaq === index ? null : index);

  const Icon = (service.icon && ICON_MAP[service.icon]) ? ICON_MAP[service.icon] : Code;
  const displayTitle = overrideTitle || service.title;
  const displayTagline = overrideTagline || service.tagline;

  // Use DB items if they exist, otherwise fallback to defaults based on slug
  const hasItems = service.items && service.items.length > 0;
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Fixed Background Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[150px] animate-pulse" />
        <div className="absolute top-[30%] right-[-15%] w-[45%] h-[45%] rounded-full bg-accent/12 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary-deep/10 blur-[120px]" />
        <div className="absolute inset-0 hero-grid opacity-40" />
      </div>

      <div className="relative z-10 pt-24">
        {/* ═══════════ HERO SECTION ═══════════ */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <FloatingOrb className="w-72 h-72 bg-primary/20 blur-[100px] top-20 left-10 animate-float" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
            <motion.div className="flex-1 text-left" initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-sm font-medium text-primary-light mb-6 hero-badge-shimmer">
                <Icon className="w-4 h-4" />
                <span>{service.title} Solutions</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold font-heading leading-tight mb-6">
                {displayTitle}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-muted mb-8 max-w-2xl">
                {displayTagline}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact" variant="primary" className="px-8 py-4 rounded-xl font-semibold shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]">
                  Start Your Project <ArrowRight className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-6 px-4">
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-widest">Investment</p>
                    <p className="text-2xl font-bold gradient-text">{service.pricing}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="flex-1 w-full" initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden gradient-border bg-gradient-to-br from-surface via-surface-light to-surface animate-pulse-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center animate-float">
                      <Icon className="w-12 h-12 text-primary-light" />
                    </div>
                    <p className="text-primary-light/70 text-sm font-semibold tracking-widest uppercase mb-1">Tailored {service.title}</p>
                    <p className="text-muted/50 text-xs">High-performance digital solutions</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ SERVICE BREAKDOWN ═══════════ */}
        {hasItems && (
          <section className="relative py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Core <span className="gradient-text-glow">Offerings</span></h2>
                <p className="text-muted max-w-2xl mx-auto text-lg">Comprehensive solutions combining cutting-edge technology with unparalleled design.</p>
              </motion.div>

              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}>
                {service.items.map((item, idx) => (
                  <motion.div key={idx} variants={scaleIn} className="glass-card glass-card-hover p-8 group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-white/[0.01] border-white/5">
                    <div className="relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 flex items-center justify-center text-primary-light mb-6 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="relative z-10 text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="relative z-10 text-muted leading-relaxed text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* ═══════════ TECH STACK ═══════════ */}
        {service.techStack && service.techStack.length > 0 && (
          <section className="py-20 border-y border-white/5 bg-white/[0.01]">
            <div className="max-w-7xl mx-auto px-4 text-center">
               <p className="text-xs font-bold text-muted uppercase tracking-[0.3em] mb-10">Technologies We Use</p>
               <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                  {service.techStack.map((tech) => (
                    <span key={tech} className="text-lg sm:text-2xl font-bold text-white/20 hover:text-primary-light transition-colors duration-300 cursor-default">
                      {tech}
                    </span>
                  ))}
               </div>
            </div>
          </section>
        )}

        {/* ═══════════ FEATURED WORK ═══════════ */}
        {service.featuredProjects && service.featuredProjects.length > 0 && (
          <FeaturedWorkSection 
              projects={service.featuredProjects} 
              title={`Featured ${displayTitle} Work`}
              subtitle={`Explore a selection of our recent ${displayTitle.toLowerCase()} projects.`}
          />
        )}

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        {service.testimonials && service.testimonials.length > 0 && (
          <SuccessStoriesSection testimonials={service.testimonials} />
        )}

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="relative py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="relative rounded-3xl overflow-hidden gradient-border shadow-[0_0_60px_rgba(139,92,246,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-light to-surface z-0" />
              <div className="relative z-10 text-center py-20 px-8">
                <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">Ready to Build <br/><span className="gradient-text-glow">Something Amazing?</span></h2>
                <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">Let&apos;s discuss your vision and see how our engineering team can bring it to life.</p>
                <Button href="/contact" variant="primary" className="px-10 py-5 rounded-xl font-bold inline-flex items-center gap-3 shadow-[0_0_25px_rgba(139,92,246,0.5)]">
                  Start a Conversation <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
