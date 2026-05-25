import { Suspense } from "react";
import ServiceClient from "./ServiceClient";
import WebDevelopmentServiceClient from "./WebDevelopmentServiceClient";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Use internal API URL if available (faster on some hosting)
const SERVER_API = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getReference(slug: string) {
  try {
    const res = await fetch(`${SERVER_API}/api/references/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Fetch reference error:", err);
    return null;
  }
}

async function getService(slug: string) {
  try {
    const res = await fetch(`${SERVER_API}/api/services/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const [servicesRes, referencesRes] = await Promise.all([
      fetch(`${SERVER_API}/api/services`),
      fetch(`${SERVER_API}/api/references`),
    ]);

    const slugs: { slug: string }[] = [];

    if (servicesRes.ok) {
      const services = await servicesRes.json();
      services.forEach((s: any) => slugs.push({ slug: s.slug }));
    }

    if (referencesRes.ok) {
      const references = await referencesRes.json();
      references.forEach((r: any) => slugs.push({ slug: r.slug }));
    }

    return slugs;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // Try reference first (Exact Mirror with unique SEO)
  const reference = await getReference(slug);
  if (reference) {
    const service = reference.service;
    return {
      title: reference.title || service.title,
      description: reference.description || service.tagline,
      keywords: reference.keywords,
      robots: reference.robots || "index, follow",
      alternates: {
        canonical: reference.canonical || `https://stackx.co.in/services/${service.slug}`,
      },
      openGraph: {
        title: reference.title || service.title,
        description: reference.description || service.tagline,
        images: reference.ogImage ? [{ url: reference.ogImage }] : undefined,
      }
    };
  }

  // Try service second
  const service = await getService(slug);
  if (service) {
    return {
      title: service.title,
      description: service.description || service.tagline,
      keywords: service.keywords,
      robots: service.robots || "index, follow",
      alternates: {
        canonical: service.canonical || `/services/${slug}`,
      },
      openGraph: {
        title: service.title,
        description: service.description || service.tagline,
        images: service.ogImage ? [{ url: service.ogImage }] : undefined,
      }
    };
  }

  return { title: "Service Not Found" };
}

export default async function DynamicServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let targetService = null;
  let referenceData = null;

  // 1. Try to find a matching reference (Exact Mirror)
  const reference = await getReference(slug);
  if (reference && reference.service) {
    targetService = reference.service;
    referenceData = reference;
  } else {
    // 2. Try to find a matching service directly
    const service = await getService(slug);
    if (service) {
      targetService = service;
    }
  }

  if (!targetService) {
    notFound();
  }

  const isWebDev = targetService.slug === "web-development";

  const jsonLdTitle = referenceData?.title || targetService.title;
  const jsonLdDesc = referenceData?.description || targetService.description || targetService.tagline;
  const jsonLdImage = referenceData?.ogImage || targetService.ogImage;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": jsonLdTitle,
        "description": jsonLdDesc,
        "provider": { "@type": "Organization", "name": "StackX" }
      },
      {
        "@type": "LocalBusiness",
        "name": "StackX",
        "image": jsonLdImage || "https://stackx.co.in/logo.png",
        "@id": "https://stackx.co.in",
        "url": "https://stackx.co.in"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {isWebDev ? (
        <Suspense fallback={null}>
          <WebDevelopmentServiceClient />
        </Suspense>
      ) : (
        <Suspense fallback={null}>
          <ServiceClient 
            service={targetService} 
            overrideTitle={referenceData?.title}
            overrideTagline={referenceData?.description}
          />
        </Suspense>
      )}
    </>
  );
}
