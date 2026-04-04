import { Suspense } from "react";
import PortfolioClient from "./PortfolioClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies",
  description:
    "Explore StackX's portfolio of successful web development, automation, and ad tech projects. See real results from real clients.",
};

async function getProjects() {
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/portfolio", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getServices() {
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/services", {
      cache: "no-store",
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
    <Suspense fallback={null}>
      <PortfolioClient projects={projects} categories={categories} />
    </Suspense>
  );
}
