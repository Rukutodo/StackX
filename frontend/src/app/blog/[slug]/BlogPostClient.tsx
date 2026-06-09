"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiArrowLeft, HiClock, HiCalendar } from "react-icons/hi";
import type { BlogPost } from "../BlogClient";

export function BlogPostClient({
  post,
  content,
}: {
  post: BlogPost;
  content: string;
}) {
  return (
    <div className="pt-28 pb-20">
      {/* Back */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      {/* Cover banner */}
      <div className={`w-full h-56 sm:h-72 ${post.coverGradient} mb-12`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-10 pb-8 border-b border-white/[0.07]">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600/40 to-violet-600/40 flex items-center justify-center text-xs font-bold text-purple-200">
                {post.author.charAt(0)}
              </div>
              <span className="text-gray-300 font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiCalendar className="w-4 h-4" />
              {post.publishedAt}
            </div>
            <div className="flex items-center gap-1.5">
              <HiClock className="w-4 h-4" />
              {post.readingTime}
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-invert prose-purple max-w-none text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </motion.div>

        {/* Footer CTA */}
        <div className="mt-16 pt-10 border-t border-white/[0.07] text-center">
          <p className="text-gray-400 mb-4 text-sm">Want to work with us?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-deep rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 border border-white/10"
          >
            Get Free Consultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
