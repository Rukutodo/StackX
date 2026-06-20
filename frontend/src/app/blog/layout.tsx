import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("blog", {
    title: "Blog | StackX",
    description: "Insights, tutorials, and updates from the StackX team.",
    canonical: "/blog",
  });
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
