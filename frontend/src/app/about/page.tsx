import AboutContent from "./AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about StackX's mission, vision, and the team building premium software at unbeatable costs in Vizag.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
