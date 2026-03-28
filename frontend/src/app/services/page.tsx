import { Suspense } from "react";
import ServicesClient from "./ServicesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore StackX's web development, business automation, and ad tech services. Custom solutions starting from $2,500 with modern tech stacks.",
};

// Fetch on the server so the page is SEO-friendly
async function getServices() {
  try {
    const res = await fetch("http://localhost:4000/api/services", {
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
