import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | StackX",
  description: "Insights, tutorials, and updates from the StackX team.",
  alternates: { canonical: "/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
