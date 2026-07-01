import HomePageClient from "./HomePageClient";
import PageJsonLd from "@/components/seo/PageJsonLd";
import type { Metadata } from "next";

const SERVER_API = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── ISR: Revalidate every 1 hour ──────────────────
export const revalidate = 60;

// ─── Fetch SEO settings from the backend ───────────
async function getSeoSettings() {
  try {
    const res = await fetch(`${SERVER_API}/api/seo/home`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Dynamic Metadata (fetched from DB with static fallbacks) ───
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  return {
    title: seo?.title || "StackX — We build, validate, and scale business",
    description:
      seo?.description ||
      "High-performance web development, business automation, and ad tech solutions in Vizag at unbeatable costs. Your trusted technology partner.",
    keywords: seo?.keywords || [
      "web development",
      "software development",
      "business automation",
      "ad tech",
      "SaaS development",
      "StackX",
      "cost-effective development",
      "Vizag tech agency",
      "web development company Vizag",
      "digital marketing Vizag",
    ],
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large" as const,
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large" as const,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: seo?.canonical || "/",
    },
    openGraph: {
      title: seo?.ogTitle || "StackX — We build, validate, and scale business",
      description:
        seo?.ogDescription ||
        "High-performance web solutions, automation systems, and ad tech platforms at industry-leading prices.",
      url: "https://stackx.co.in",
      siteName: "StackX",
      images: [
        {
          url: seo?.ogImage || "/og-image.png",
          width: 1200,
          height: 630,
          alt: "StackX — We build, validate, and scale business",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || "StackX — We build, validate, and scale business",
      description:
        seo?.twitterDescription ||
        "High-performance web development and automation at unbeatable costs.",
      images: [seo?.ogImage || "/og-image.png"],
    },
  };
}

// ─── Homepage-specific JSON-LD (WebPage schema) ────
const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://stackx.co.in/#webpage",
  url: "https://stackx.co.in",
  name: "StackX — We build, validate, and scale business",
  description:
    "High-performance web development, business automation, and ad tech solutions. Your trusted technology partner for startups, marketing teams, and enterprises.",
  isPartOf: { "@id": "https://stackx.co.in/#website" },
  about: { "@id": "https://stackx.co.in/#organization" },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: "https://stackx.co.in/og-image.png",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    "@id": "https://stackx.co.in/#breadcrumb",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://stackx.co.in",
      },
    ],
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".hero-subheading"],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      {/* Inject any dynamic JSON-LD from the admin dashboard */}
      <PageJsonLd pageKey="home" />
      <HomePageClient />
    </>
  );
}
