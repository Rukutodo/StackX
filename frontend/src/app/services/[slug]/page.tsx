import { Suspense } from "react";
import ServiceClient from "./ServiceClient";
import WebDevelopmentServiceClient from "../web-development/WebDevelopmentServiceClient";
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
  
  // 1. Try to find a matching reference (Exact Mirror)
  const reference = await getReference(slug);
  if (reference && reference.service) {
    if (reference.service.slug === "web-development") {
      return (
        <Suspense fallback={null}>
          <WebDevelopmentServiceClient />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={null}>
        <ServiceClient service={reference.service} />
      </Suspense>
    );
  }

  // 2. Try to find a matching service directly
  const service = await getService(slug);
  if (service) {
    if (slug === "web-development") {
      return (
        <Suspense fallback={null}>
          <WebDevelopmentServiceClient />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={null}>
        <ServiceClient service={service} />
      </Suspense>
    );
  }

  notFound();
}
