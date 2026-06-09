import { BlogClientSection, type BlogPost } from "./BlogClient";

const SAMPLE_POSTS: BlogPost[] = [
  {
    slug: "building-scalable-web-apps-with-nextjs",
    title: "Building Scalable Web Applications with Next.js",
    excerpt:
      "Learn how to architect large-scale Next.js applications that stay fast as your team and user base grow — from code splitting to ISR.",
    category: "Engineering",
    readingTime: "6 min read",
    publishedAt: "May 28, 2025",
    author: "StackX Team",
    coverGradient:
      "bg-gradient-to-br from-violet-900/70 via-purple-800/60 to-indigo-900/70",
  },
  {
    slug: "why-business-automation-matters-in-2025",
    title: "Why Business Automation Matters More Than Ever in 2025",
    excerpt:
      "From repetitive data entry to intelligent workflows — here's how modern automation is transforming the way teams operate.",
    category: "Business",
    readingTime: "5 min read",
    publishedAt: "May 15, 2025",
    author: "StackX Team",
    coverGradient:
      "bg-gradient-to-br from-fuchsia-900/70 via-pink-800/60 to-rose-900/70",
  },
  {
    slug: "design-systems-that-scale",
    title: "Design Systems That Scale: Lessons from Real Projects",
    excerpt:
      "After shipping design systems for over a dozen clients, here are the patterns that hold up and the mistakes that cost the most.",
    category: "Design",
    readingTime: "7 min read",
    publishedAt: "Apr 30, 2025",
    author: "StackX Team",
    coverGradient:
      "bg-gradient-to-br from-cyan-900/70 via-teal-800/60 to-emerald-900/70",
  },
  {
    slug: "ad-tech-explained-for-founders",
    title: "Ad Tech Explained for Non-Technical Founders",
    excerpt:
      "Pixels, bid streams, DSPs — ad tech is full of jargon. This plain-English guide breaks down what you actually need to know.",
    category: "Ad Tech",
    readingTime: "8 min read",
    publishedAt: "Apr 12, 2025",
    author: "StackX Team",
    coverGradient:
      "bg-gradient-to-br from-amber-900/70 via-orange-800/60 to-yellow-900/70",
  },
  {
    slug: "how-we-cut-page-load-time-by-60-percent",
    title: "How We Cut Page Load Time by 60% Without Rewriting Anything",
    excerpt:
      "A case study in pragmatic performance: the seven changes that made the biggest difference on a production Next.js app.",
    category: "Performance",
    readingTime: "5 min read",
    publishedAt: "Mar 25, 2025",
    author: "StackX Team",
    coverGradient:
      "bg-gradient-to-br from-blue-900/70 via-sky-800/60 to-indigo-900/70",
  },
  {
    slug: "client-collaboration-that-actually-works",
    title: "Client Collaboration That Actually Works",
    excerpt:
      "The async-first rituals, feedback frameworks, and communication norms that have made every StackX project run smoother.",
    category: "Process",
    readingTime: "4 min read",
    publishedAt: "Mar 10, 2025",
    author: "StackX Team",
    coverGradient:
      "bg-gradient-to-br from-green-900/70 via-emerald-800/60 to-teal-900/70",
  },
];

export default function BlogPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-6">
            Insights
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">
            The StackX Blog
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Engineering deep-dives, design thinking, business strategy, and lessons from shipping real products.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogClientSection posts={SAMPLE_POSTS} />
      </section>
    </div>
  );
}
