"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HiClock, HiArrowRight } from "react-icons/hi";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";
// Next.js 16 blocks its image optimizer from fetching private/loopback IPs (SSRF guard),
// so skip optimization when the backend is local. Production (public domain) optimizes normally.
const LOCAL_IMAGES = API_BASE.includes("localhost") || API_BASE.includes("127.0.0.1");

export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedAt?: string;
  createdAt?: string;
  author: string;
  coverImage?: string;
  coverGradient?: string;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  Engineering: "bg-gradient-to-br from-violet-900/70 via-purple-800/60 to-indigo-900/70",
  Business: "bg-gradient-to-br from-fuchsia-900/70 via-pink-800/60 to-rose-900/70",
  Design: "bg-gradient-to-br from-cyan-900/70 via-teal-800/60 to-emerald-900/70",
  "Ad Tech": "bg-gradient-to-br from-amber-900/70 via-orange-800/60 to-yellow-900/70",
  Performance: "bg-gradient-to-br from-blue-900/70 via-sky-800/60 to-indigo-900/70",
  Process: "bg-gradient-to-br from-green-900/70 via-emerald-800/60 to-teal-900/70",
};

export function coverGradientFor(post: BlogPost) {
  return (
    post.coverGradient ||
    CATEGORY_GRADIENTS[post.category] ||
    "bg-gradient-to-br from-purple-900/70 via-violet-800/60 to-indigo-900/70"
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const displayDate =
    post.publishedAt ||
    (post.createdAt
      ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "");

  return (
    <motion.div
      className="min-w-0"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 5) * 0.05 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col h-full rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-300 hover:border-purple-500/25 [@media(hover:hover)]:hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/5"
        style={{ background: "rgba(19,19,26,0.85)" }}
      >
        {/* Cover */}
        <div className="h-44 w-full relative overflow-hidden">
          {post.coverImage ? (
            <Image
              src={`${API_BASE}${post.coverImage}`}
              alt={post.title}
              fill
              unoptimized={LOCAL_IMAGES}
              className="object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className={`w-full h-full ${coverGradientFor(post)}`} />
          )}
          <div className="absolute inset-0 flex items-end p-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/40 text-white/90 backdrop-blur-sm border border-white/10">
              {post.category}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6 min-w-0">
          <h3 className="text-base font-semibold text-white leading-snug group-hover:text-purple-300 transition-colors mb-2 break-words">
            {post.title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-3 break-words">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600/40 to-violet-600/40 flex items-center justify-center text-xs font-bold text-purple-200">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-medium text-white/80">{post.author}</p>
                <p className="text-[10px] text-gray-500">{displayDate}</p>
              </div>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <HiClock className="w-3.5 h-3.5" />
                {post.readingTime}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BlogClientSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
          <HiArrowRight className="w-8 h-8 text-purple-400" />
        </div>
        <p className="text-white font-medium mb-2">No posts yet</p>
        <p className="text-sm text-gray-500">Check back soon — great content is on the way!</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post, i) => (
        <BlogCard key={post.slug} post={post} index={i} />
      ))}
    </div>
  );
}
