import HomePageClient from "./HomePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StackX — We build, validate, and scale business",
  description: "High-performance web development, business automation, and ad tech solutions in Vizag at unbeatable costs. Your trusted technology partner.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
