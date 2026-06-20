import PageJsonLd from "@/components/seo/PageJsonLd";
import AboutContent from "./AboutContent";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("about", {
    title: "About Us",
    description: "Learn about StackX's mission, vision, and the team building premium software at unbeatable costs in Vizag.",
    canonical: "/about",
  });
}

export default function AboutPage() {
  return (
    <>
      <PageJsonLd pageKey="about" />
      <AboutContent />
    </>
  );
}
