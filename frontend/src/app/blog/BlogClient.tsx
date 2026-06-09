"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiClock, HiArrowRight } from "react-icons/hi";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedAt: string;
  author: string;
  coverGradient: string;
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col h-full rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-300 hover:border-purple-500/25 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/5"
        style={{ background: "rgba(19,19,26,0.7)", backdropFilter: "blur(20px)" }}
      >
        {/* Cover */}
        <div
          className={`h-44 w-full flex items-end p-5 ${post.coverGradient}`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/30 text-white/80 backdrop-blur-sm border border-white/10">
            {post.category}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="text-base font-semibold text-white leading-snug group-hover:text-purple-300 transition-colors mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-3">
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
                <p className="text-[10px] text-gray-500">{post.publishedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <HiClock className="w-3.5 h-3.5" />
              {post.readingTime}
            </div>
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
