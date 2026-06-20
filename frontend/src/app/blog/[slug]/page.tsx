import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostClient } from "./BlogPostClient";
import type { BlogPost } from "../BlogClient";

const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

interface BlogPostFull extends BlogPost {
  content: string;
  createdAt?: string;
}

async function getBlog(slug: string): Promise<BlogPostFull | null> {
  try {
    const res = await fetch(`${SERVER_API}/api/blogs/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${SERVER_API}/api/blogs`);
    if (!res.ok) return [];
    const blogs: BlogPost[] = await res.json();
    return blogs.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
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
  const post = await getBlog(slug);
  if (!post) notFound();

  return <BlogPostClient post={post} content={post.content} />;
}
