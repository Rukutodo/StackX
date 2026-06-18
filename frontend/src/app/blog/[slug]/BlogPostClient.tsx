"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiArrowLeft, HiClock, HiCalendar } from "react-icons/hi";
import { type BlogPost, coverGradientFor } from "../BlogClient";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

interface BlogPostFull extends BlogPost {
  content: string;
  createdAt?: string;
}

export function BlogPostClient({
  post,
  content,
}: {
  post: BlogPostFull;
  content: string;
}) {
  const router = useRouter();

  const displayDate =
    post.publishedAt ||
    (post.createdAt
      ? new Date(post.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "");

  return (
    <div className="pt-28 pb-20">
      {/* Back — returns to the previous page */}
      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Category */}
          <span className="inline-block text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-4">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white leading-tight mb-3">
            {post.title}
          </h1>

          {/* Created on — just under the title */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600/40 to-violet-600/40 flex items-center justify-center text-xs font-bold text-purple-200">
                {post.author.charAt(0)}
              </div>
              <span className="text-gray-300 font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiCalendar className="w-4 h-4" />
              Created on {displayDate}
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-1.5">
                <HiClock className="w-4 h-4" />
                {post.readingTime}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Cover image — whole image, natural proportions (no crop, no distortion) */}
      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${API_BASE}${post.coverImage}`}
            alt={post.title}
            className="w-full h-auto rounded-2xl border border-white/[0.07]"
          />
        ) : (
          <div className={`w-full aspect-[16/9] rounded-2xl ${coverGradientFor(post)}`} />
        )}
      </div>

      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />

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
