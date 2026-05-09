import ContactContent from "./ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get a free consultation with StackX. We respond within 2 business hours to help you build, validate, and scale your business.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
