import type { Metadata } from "next";
import PageJsonLd from "@/components/seo/PageJsonLd";
import { TestimonialsPageClient } from "./TestimonialsClient";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("testimonials", {
    title: "Testimonials | StackX",
    description: "Read what our clients say about StackX — real reviews from real projects.",
    canonical: "/testimonials",
  });
}

const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

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

async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${SERVER_API}/api/testimonials`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TestimonialsPage() {
  const testimonials = await fetchTestimonials();
  return (
    <>
      <PageJsonLd pageKey="testimonials" />
      <TestimonialsPageClient testimonials={testimonials} />
    </>
  );
}
