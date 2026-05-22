"use client";

import { motion } from "framer-motion";
import { HiStar, HiUser } from "react-icons/hi";
import { GlassCard } from "@/components/ui";

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  role?: string;
  feedback: string;
  rating: number;
}

interface SuccessStoriesSectionProps {
  testimonials: Testimonial[];
}

export default function SuccessStoriesSection({ testimonials }: SuccessStoriesSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Client <span className="gradient-text">Success Stories</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col p-8 border-white/5 bg-white/[0.02] relative group">
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <HiStar
                      key={idx}
                      className={`w-4 h-4 ${idx < t.rating ? "text-amber-400" : "text-white/10"}`}
                    />
                  ))}
                </div>

                <p className="text-muted text-sm sm:text-base leading-relaxed mb-8 flex-1 italic">
                   &ldquo;{t.feedback}&rdquo;
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary-light border border-white/10 shrink-0">
                    <HiUser size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{t.name}</p>
                    <p className="text-xs text-muted truncate">{t.role ? `${t.role}, ` : ""}{t.company}</p>
                  </div>
                </div>

                {/* Decorative Quote Mark */}
                <div className="absolute top-8 right-8 text-white/[0.03] select-none pointer-events-none">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H13.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56929 13 6.017 13H5.017V21H6.017Z" />
                   </svg>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
