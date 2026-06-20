import { BlogClientSection, type BlogPost } from "./BlogClient";

const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${SERVER_API}/api/blogs`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogs();

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
        <BlogClientSection posts={posts} />
      </section>
    </div>
  );
}
