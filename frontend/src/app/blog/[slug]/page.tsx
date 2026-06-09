import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostClient } from "./BlogPostClient";
import type { BlogPost } from "../BlogClient";

const POSTS: (BlogPost & { content: string })[] = [
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
    content: `
      <p>Next.js has become the go-to framework for teams that need both developer experience and production performance. But as codebases grow, it's easy to let architectural debt accumulate. Here are the patterns that keep large Next.js apps fast and maintainable.</p>
      <h2>1. Route-level code splitting is free — use it</h2>
      <p>Every page in the App Router is automatically split into its own bundle. Keep page components lean and push heavy logic into server components so the client never downloads code it doesn't execute.</p>
      <h2>2. Choose your data strategy per route</h2>
      <p>Static generation (SSG) for marketing pages, ISR for content that updates infrequently, and dynamic rendering only where freshness truly matters. Mixing strategies per route is a feature, not a compromise.</p>
      <h2>3. Colocate components with routes</h2>
      <p>A component only used by one route should live next to that route, not in a shared <code>/components</code> folder. Shared components earn their place in the shared folder; everything else is noise.</p>
      <h2>4. Turbopack in dev, webpack in prod (for now)</h2>
      <p>Next.js 15+ ships Turbopack for development by default. The faster rebuild cycle compounds over a long day. Keep production builds on webpack until Turbopack's production support matures.</p>
      <p>These four habits alone will carry most teams through the first hundred thousand lines of code without a painful rewrite.</p>
    `,
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
    content: `
      <p>In 2025, the gap between automated businesses and manual ones isn't just efficiency — it's survival. Here's what we've seen working across dozens of client engagements.</p>
      <h2>The hidden cost of manual work</h2>
      <p>Every time an employee copies data between systems, sends a status-update email, or generates a weekly report from scratch, the business is paying senior salaries for junior work. Multiply that across a 50-person team and the number gets uncomfortable fast.</p>
      <h2>Where automation delivers fastest ROI</h2>
      <p>Lead routing, invoice generation, onboarding checklists, and recurring report distribution are the four areas where we consistently see automation pay for itself in under 90 days.</p>
      <h2>The automation-first mindset</h2>
      <p>The companies winning with automation aren't the ones who built the fanciest workflows — they're the ones who asked "should a human be doing this?" before writing the first job description.</p>
      <p>If you're not sure where to start, audit one week of your team's recurring tasks. The answer will be obvious.</p>
    `,
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
    content: `
      <p>A design system is supposed to make your team faster. Most don't — because they optimise for coverage instead of clarity. Here's what we learned the hard way.</p>
      <h2>Start with tokens, not components</h2>
      <p>Color, spacing, radius, and shadow tokens are the atoms of your system. If you build components before locking tokens, every refactor cascades through hundreds of files. Get the tokens right first.</p>
      <h2>Don't abstract until it hurts</h2>
      <p>Premature componentisation is just as costly as premature code abstraction. If a pattern has appeared fewer than three times in production, it doesn't deserve a design system component yet.</p>
      <h2>Document the why, not the how</h2>
      <p>Storybook is great for showing what a component looks like. It's terrible at explaining when to use it versus an alternative. Write that guidance. Future contributors will thank you.</p>
      <h2>The "last 10%" is where systems die</h2>
      <p>Every system looks great in the demo. It breaks down on the edge cases: RTL layouts, empty states, error states, long strings, and small screens. Build those in from day one or you'll be retrofitting forever.</p>
    `,
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
    content: `
      <p>If you've ever sat in an ad tech meeting and nodded along while secretly googling terms under the table, this post is for you.</p>
      <h2>The three players in every ad transaction</h2>
      <p><strong>Advertisers</strong> want to reach people. <strong>Publishers</strong> have audiences and sell access to them. <strong>Ad networks / exchanges</strong> sit in between, matching buyers and sellers in real time. That's the whole industry.</p>
      <h2>What a DSP actually does</h2>
      <p>A Demand-Side Platform lets advertisers bid on ad impressions across many exchanges from one place. When you load a webpage, your browser fires dozens of bid requests simultaneously. DSPs evaluate them in milliseconds and decide what to bid. The winning bid serves the ad.</p>
      <h2>Pixels and why they matter</h2>
      <p>A pixel is a tiny piece of JavaScript that fires when a user takes an action — visiting a page, adding to cart, converting. It sends that signal back to your ad platform so you can measure results and optimise bidding.</p>
      <h2>What founders actually need to know</h2>
      <p>You don't need to understand header bidding floors or cookie syncing to grow your business. You need to know: what events you're measuring, whether your attribution model is accurate, and whether your customer acquisition cost is below your LTV. Everything else is detail.</p>
    `,
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
    content: `
      <p>The client came to us with a Lighthouse performance score of 34. After two weeks of targeted changes — no rewrite, no framework swap — it was 87. Here's exactly what we did.</p>
      <h2>1. Switched all images to next/image</h2>
      <p>Their original codebase used raw &lt;img&gt; tags with full-resolution PNGs. Swapping to next/image added automatic WebP conversion, lazy loading, and proper sizing. That alone improved LCP by ~1.2s.</p>
      <h2>2. Moved data fetching to the server</h2>
      <p>Three pages were fetching API data client-side on mount, causing visible layout shift. Moved those to server components. First Contentful Paint improved across all three.</p>
      <h2>3. Audited and tree-shook icon imports</h2>
      <p>They were importing entire icon libraries. Switching to named imports per icon removed 180KB from the JS bundle.</p>
      <h2>4. Added ISR to content-heavy pages</h2>
      <p>Pages that had been dynamically rendered on every request now cache and revalidate every 60 seconds. Server response times dropped from ~800ms to ~40ms for cached pages.</p>
      <p>The lesson: performance problems are almost always death by a thousand cuts. Find the cuts, fix them one by one.</p>
    `,
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
    content: `
      <p>The biggest source of project delays isn't technical complexity — it's unclear feedback loops. Here's the collaboration operating system we've refined over three years of client work.</p>
      <h2>Weekly async update, not a sync meeting</h2>
      <p>Every Friday we send a short Loom video: what shipped, what's next, what we need. Clients watch it when convenient, reply async. We've eliminated 90% of "just checking in" emails.</p>
      <h2>Feedback requests are specific</h2>
      <p>Instead of "let us know what you think," we ask "does this button label match the action correctly?" Specific questions get specific answers. Vague questions get silence or scope creep.</p>
      <h2>One decision-maker per workstream</h2>
      <p>Projects stall when feedback comes from five people with equal authority. Before kickoff we establish who has final say on design and who has final say on functionality. If it's the same person, great. If not, we need them both in the same room for cross-cutting decisions.</p>
      <h2>The "good enough to ship" standard</h2>
      <p>Perfection is the enemy of done. We use a shared rubric: if this shipped today, would it embarrass us or cause problems for users? If no, it ships. Refinement happens in the next cycle.</p>
    `,
  },
];

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | StackX Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return <BlogPostClient post={post} content={post.content} />;
}
