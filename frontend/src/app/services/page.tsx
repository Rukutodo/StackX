import { Suspense } from "react";
import PageJsonLd from "@/components/seo/PageJsonLd";
import ServicesClient from "./ServicesClient";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("services", {
    title: "Services",
    description: "Explore StackX's web development, business automation, and ad tech services. Custom solutions starting from $2,500 with modern tech stacks.",
    canonical: "/services",
  });
}

// Fetch on the server so the page is SEO-friendly
// For Server Components (SSR), use localhost to bypass NAT hairpin issues on cloud VMs
const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

async function getServices() {
  try {
    const res = await fetch(`${SERVER_API}/api/services`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const categories = await getServices();

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "StackX Services",
    "description": "Comprehensive digital and software engineering services provided by StackX.",
    "url": "https://stackx.co.in/services",
    "itemListElement": categories.map((cat: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": cat.title,
        "description": cat.tagline || cat.description,
        "url": `https://stackx.co.in/services/${cat.slug}`,
        "provider": {
          "@type": "Organization",
          "name": "StackX",
          "url": "https://stackx.co.in"
        }
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <PageJsonLd pageKey="services" />
      <Suspense fallback={null}>
        <ServicesClient categories={categories} />
      </Suspense>
    </>
  );
}
