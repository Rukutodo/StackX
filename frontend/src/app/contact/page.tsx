import PageJsonLd from "@/components/seo/PageJsonLd";
import ContactContent from "./ContactContent";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("contact", {
    title: "Contact Us",
    description: "Get a free consultation with StackX. We respond within 2 business hours to help you build, validate, and scale your business.",
    canonical: "/contact",
  });
}

export default function ContactPage() {
  return (
    <>
      <PageJsonLd pageKey="contact" />
      <ContactContent />
    </>
  );
}
