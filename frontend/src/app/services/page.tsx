import { Suspense } from "react";
import ServicesClient from "./ServicesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore StackX's web development, business automation, and ad tech services. Custom solutions starting from $2,500 with modern tech stacks.",
};

// Fetch on the server so the page is SEO-friendly
// For Server Components (SSR), use localhost to bypass NAT hairpin issues on cloud VMs
const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

async function getServices() {
  try {
    const res = await fetch(`${SERVER_API}/api/services`, {
      cache: "no-store", // always fresh
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const categories = await getServices();
  return (
    <Suspense fallback={null}>
      <ServicesClient categories={categories} />
    </Suspense>
  );
}
