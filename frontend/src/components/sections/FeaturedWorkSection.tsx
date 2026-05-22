"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HiArrowRight, HiDesktopComputer } from "react-icons/hi";
import { SectionHeading, GlassCard } from "@/components/ui";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

interface Project {
  _id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image?: string;
}

interface FeaturedWorkSectionProps {
  projects: Project[];
  title?: string;
  subtitle?: string;
}

export default function FeaturedWorkSection({ 
  projects, 
  title = "Featured Work", 
  subtitle = "Explore a selection of our recent projects." 
}: FeaturedWorkSectionProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
             <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
                {title.split(' ').map((word, i) => (
                    <span key={i} className={i === 1 ? "gradient-text" : "text-white"}>
                        {word}{' '}
                    </span>
                ))}
            </h2>
            <p className="mt-4 text-muted text-lg leading-relaxed">
              {subtitle}
            </p>
          </div>
          <Link 
            href="/portfolio" 
            className="text-primary-light hover:text-accent transition-colors inline-flex items-center gap-2 font-medium"
          >
            View Complete Portfolio <HiArrowRight />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/portfolio/${project.slug}`} className="block group">
                <GlassCard className="aspect-[4/3] flex flex-col items-center justify-center p-0 overflow-hidden relative border-white/5 bg-white/[0.02]">
                   {project.image ? (
                    <Image
                      src={`${API_BASE}${project.image}`}
                      alt={project.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-500" />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary-light transition-colors group-hover:scale-110 transition-transform duration-500">
                      <HiDesktopComputer size={32} />
                    </div>
                    <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/60 group-hover:text-white transition-colors">
                      {project.title}
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
