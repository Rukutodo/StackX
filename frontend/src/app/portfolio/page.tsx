import { Suspense } from "react";
import PageJsonLd from "@/components/seo/PageJsonLd";
import PortfolioClient from "./PortfolioClient";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("portfolio", {
    title: "Portfolio & Case Studies",
    description: "Explore StackX's portfolio of successful web development, automation, and ad tech projects. See real results from real clients.",
    canonical: "/portfolio",
  });
}

// For Server Components (SSR), use localhost to bypass NAT hairpin issues on cloud VMs
const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

async function getProjects() {
  try {
    const res = await fetch(`${SERVER_API}/api/portfolio`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getServices() {
  try {
    const res = await fetch(`${SERVER_API}/api/services`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const [projects, services] = await Promise.all([getProjects(), getServices()]);
  const categories = ["All", ...services.map((s: any) => s.title)];

  return (
    <>
      <PageJsonLd pageKey="portfolio" />
      <Suspense fallback={null}>
        <PortfolioClient projects={projects} categories={categories} />
      </Suspense>
    </>
  );
}
