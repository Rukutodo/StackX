import type { Metadata } from "next";
import { SectionHeading, TestimonialCard } from "@/components/ui";
import { TestimonialsClientSection } from "./TestimonialsClient";

export const metadata: Metadata = {
  title: "Testimonials | StackX",
  description: "Read what our clients say about StackX — real reviews from real projects.",
};

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

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
    const res = await fetch(`${API}/api/testimonials`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TestimonialsPage() {
  const testimonials = await fetchTestimonials();

  // Calculate live average rating
  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
      : "5.0";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge="Testimonials"
            title="Trusted by Teams Worldwide"
            subtitle="Don't take our word for it — hear from the clients who have experienced the StackX difference."
          />
        </div>
      </section>

      {/* Grid — client component for animations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialsClientSection testimonials={testimonials} />
      </section>

      {/* Average Rating */}
      <section className="py-20 mt-12">
        <div className="max-w-lg mx-auto px-4 text-center">
          <p className="text-6xl font-heading font-bold gradient-text mb-2">{avgRating}</p>
          <div className="flex items-center justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="w-6 h-6 star-filled" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-muted text-sm">
            Average rating across {testimonials.length > 0 ? `${testimonials.length}+` : "our"} clients
          </p>
        </div>
      </section>
    </div>
  );
}
