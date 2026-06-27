import type { Metadata } from "next";

const SERVER_API = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const SITE_URL = "https://stackx.co.in";

export interface SeoApiResponse {
  pageKey: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  robots: string;
  canonical: string;
  jsonLdOverrides: Record<string, unknown>;
}

/**
 * Fetch SEO settings from the backend API for a given page key.
 * Returns null on failure so callers can fall back to hardcoded defaults.
 */
export async function fetchSeoSettings(pageKey: string): Promise<SeoApiResponse | null> {
  try {
    const res = await fetch(`${SERVER_API}/api/seo/${pageKey}`, {
      next: { revalidate: 3600 }, // ISR — refresh every hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Build Next.js Metadata from SEO API response + static fallbacks.
 * Usage in any page.tsx:
 *
 *   export async function generateMetadata(): Promise<Metadata> {
 *     return buildMetadata("about", {
 *       title: "About Us",
 *       description: "...",
 *       canonical: "/about",
 *     });
 *   }
 */
export async function buildMetadata(
  pageKey: string,
  fallback: { title: string; description: string; canonical: string }
): Promise<Metadata> {
  const seo = await fetchSeoSettings(pageKey);

  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const canonical = seo?.canonical || fallback.canonical;
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  const ogImage = seo?.ogImage || "/og-image.png";

  return {
    title,
    description,
    keywords: seo?.keywords || [],
    robots: seo?.robots || "index, follow",
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `${SITE_URL}${canonical}`,
      siteName: "StackX",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || ogTitle,
      description: seo?.twitterDescription || ogDescription,
      images: [ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`],
    },
  };
}
