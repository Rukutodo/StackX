"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiExternalLink, HiStar } from "react-icons/hi";

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  role: string;
  feedback: string;
  rating: number;
  projectType: string;
  portfolioProject: { id: string; slug: string; title: string } | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? "star-filled" : "text-gray-700"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="flex flex-col h-full rounded-2xl border border-white/[0.08] p-6 transition-all duration-300 hover:border-purple-500/25 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/5"
      style={{ background: "rgba(19,19,26,0.7)", backdropFilter: "blur(20px)" }}
    >
      {/* Stars */}
      <Stars rating={t.rating} />

      {/* Feedback */}
      <blockquote className="text-sm text-gray-300 leading-relaxed mt-4 flex-1">
        &ldquo;{t.feedback}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/40 to-violet-600/40 flex items-center justify-center text-sm font-bold text-purple-200 shrink-0">
              {t.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">{t.name}</p>
              <p className="text-xs text-gray-500 leading-tight">
                {t.role ? `${t.role} · ` : ""}{t.company}
              </p>
            </div>
          </div>

          {/* Project type pill or portfolio link */}
          {t.portfolioProject ? (
            <Link
              href={`/portfolio/${t.portfolioProject.slug}`}
              className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors whitespace-nowrap"
            >
              {t.portfolioProject.title}
              <HiExternalLink className="w-3 h-3" />
            </Link>
          ) : t.projectType ? (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/[0.08] whitespace-nowrap">
              {t.projectType}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsClientSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
          <HiStar className="w-8 h-8 text-purple-400" />
        </div>
        <p className="text-white font-medium mb-2">No testimonials yet</p>
        <p className="text-sm text-gray-500">Check back soon — great things are being built!</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {testimonials.map((t, i) => (
        <motion.div
          key={t._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
        >
          <TestimonialCard t={t} />
        </motion.div>
      ))}
    </div>
  );
}
