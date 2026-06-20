import type { Metadata } from "next";
import PageJsonLd from "@/components/seo/PageJsonLd";
import { CaseStudiesPageClient } from "./CaseStudiesClient";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("case-studies", {
    title: "Case Studies | StackX",
    description: "Explore our in-depth case studies and see how StackX delivers high-impact digital solutions.",
    canonical: "/case-studies",
  });
}

const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

export interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  client: string;
  service: string;
  subtitle: string;
  overview: string;
  results: { metric: string; label: string }[];
  images: string[];
  portfolioProject: { id: string; slug: string; title: string } | null;
  featured: boolean;
  order: number;
}

async function fetchCaseStudies(): Promise<CaseStudy[]> {
  try {
    const res = await fetch(`${SERVER_API}/api/case-studies`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function fetchServices(): Promise<{ title: string }[]> {
  try {
    const res = await fetch(`${SERVER_API}/api/services`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CaseStudiesPage() {
  const [caseStudies, services] = await Promise.all([fetchCaseStudies(), fetchServices()]);
  const categories = ["All", ...services.map((s) => s.title)];
  return (
    <>
      <PageJsonLd pageKey="case-studies" />
      <CaseStudiesPageClient caseStudies={caseStudies} categories={categories} />
    </>
  );
}
