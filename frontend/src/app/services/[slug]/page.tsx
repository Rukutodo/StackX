import { Suspense } from "react";
import ServiceClient from "./ServiceClient";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Fetch on the server
const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getService(params.slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: service.title,
    description: service.tagline,
    alternates: {
      canonical: `/services/${params.slug}`,
    },
  };
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <ServiceClient service={service} />
    </Suspense>
  );
}
