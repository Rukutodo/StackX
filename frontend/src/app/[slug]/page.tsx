import { notFound } from "next/navigation";

export default async function ReservedDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // This route is only for non-reserved root slugs that aren't handled by other folders.
  // We've moved references to /services/[slug], so this should 404 for unknown slugs.
  
  const reserved = ["services", "portfolio", "testimonials", "contact", "about", "careers", "privacy-policy", "terms-of-service"];
  if (reserved.includes(slug)) {
    notFound();
  }

  notFound();
}
