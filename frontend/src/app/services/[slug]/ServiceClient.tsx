"use client";

import { motion } from "framer-motion";
import { SectionHeading, GlassCard, Button } from "@/components/ui";
import { HiArrowRight, HiChevronDown, HiCode } from "react-icons/hi";
import { useState } from "react";
import { ICON_MAP } from "../ServicesClient";
import FeaturedWorkSection from "@/components/sections/FeaturedWorkSection";
import SuccessStoriesSection from "@/components/sections/SuccessStoriesSection";

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

function Accordion({ title, desc }: { title: string; desc: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-surface-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group cursor-pointer"
      >
        <span className="text-lg font-medium text-white group-hover:text-primary-light transition-colors">
          {title}
        </span>
        <HiChevronDown
          className={`w-6 h-6 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-muted leading-relaxed">{desc}</p>
      </motion.div>
    </div>
  );
}

export default function ServiceClient({ service }: { service: ServiceCategory }) {
  const Icon = (service.icon && ICON_MAP[service.icon]) ? ICON_MAP[service.icon] : HiCode;

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center shadow-2xl mb-8">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-muted max-w-3xl leading-relaxed">
              {service.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Details */}
          <div className="lg:col-span-2">
             <div className="mb-12">
                <h3 className="text-2xl font-heading font-bold mb-8">Service Features</h3>
                <div className="border-t border-surface-border">
                  {service.items.map((item) => (
                    <Accordion key={item.title} title={item.title} desc={item.desc} />
                  ))}
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <GlassCard hover={false} className="sticky top-28 border-white/5 bg-white/[0.02]">
              <div className="mb-6">
                <p className="text-sm text-muted uppercase tracking-widest mb-1">Investment</p>
                <p className="text-4xl font-heading font-bold gradient-text">{service.pricing}</p>
              </div>
              
              <div className="mb-8">
                <p className="text-sm text-muted uppercase tracking-widest mb-4">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {service.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-muted">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <Button href="/contact" variant="primary" className="w-full py-4">
                Get Started <HiArrowRight />
              </Button>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      {service.featuredProjects && service.featuredProjects.length > 0 && (
        <FeaturedWorkSection 
            projects={service.featuredProjects} 
            title={`Featured ${service.title} Work`}
            subtitle={`Explore a selection of our recent ${service.title.toLowerCase()} projects.`}
        />
      )}

      {/* Testimonials Section */}
      {service.testimonials && service.testimonials.length > 0 && (
        <SuccessStoriesSection testimonials={service.testimonials} />
      )}

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">
               Ready to start your <span className="gradient-text">{service.title}</span> project?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              Book a consultation today and let&apos;s build something amazing together.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
               <Button href="/contact" variant="primary" className="px-10 py-4">
                 Book Consultation <HiArrowRight />
               </Button>
               <Button href="/services" variant="secondary" className="px-10 py-4">
                 Back to Services
               </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
