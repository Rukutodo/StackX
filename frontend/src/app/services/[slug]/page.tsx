import { Suspense } from "react";
import ServiceClient from "./ServiceClient";
import WebDevelopmentServiceClient from "./WebDevelopmentServiceClient";
import DigitalMarketingServiceClient from "./DigitalMarketingServiceClient";
import AdTechSolutionsServiceClient from "./AdTechSolutionsServiceClient";
import MarketResearchAndInsightsServiceClient from "./MarketResearchAndInsightsServiceClient";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Use internal API URL if available (faster on some hosting)
const SERVER_API = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const SITE_URL = "https://stackx.co.in";

async function getReference(slug: string) {
  try {
    const res = await fetch(`${SERVER_API}/api/references/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Fetch reference error:", err);
    return null;
  }
}

async function getService(slug: string) {
  try {
    const res = await fetch(`${SERVER_API}/api/services/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const [servicesRes, referencesRes] = await Promise.all([
      fetch(`${SERVER_API}/api/services`),
      fetch(`${SERVER_API}/api/references`),
    ]);

    const slugs: { slug: string }[] = [];

    if (servicesRes.ok) {
      const services = await servicesRes.json();
      services.forEach((s: any) => slugs.push({ slug: s.slug }));
    }

    if (referencesRes.ok) {
      const references = await referencesRes.json();
      references.forEach((r: any) => slugs.push({ slug: r.slug }));
    }

    return slugs;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // Try reference first (location-based SEO page)
  const reference = await getReference(slug);
  if (reference) {
    const service = reference.service;
    const metaTitle = reference.metaTitle || reference.title || service.title;
    const metaDesc = reference.metaDescription || reference.description || service.tagline;
    const canonicalUrl = reference.canonical || `${SITE_URL}/services/${slug}`;
    const robots = reference.noIndex ? "noindex, nofollow" : (reference.robots || "index, follow");

    return {
      title: metaTitle,
      description: metaDesc,
      keywords: reference.keywords,
      robots,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: metaTitle,
        description: metaDesc,
        url: canonicalUrl,
        siteName: "StackX",
        images: reference.ogImage ? [{ url: reference.ogImage }] : undefined,
      },
    };
  }

  // Try service second
  const service = await getService(slug);
  if (service) {
    return {
      title: service.title,
      description: service.description || service.tagline,
      keywords: service.keywords,
      robots: service.robots || "index, follow",
      alternates: {
        canonical: service.canonical || `${SITE_URL}/services/${slug}`,
      },
      openGraph: {
        title: service.title,
        description: service.description || service.tagline,
        url: `${SITE_URL}/services/${slug}`,
        siteName: "StackX",
        images: service.ogImage ? [{ url: service.ogImage }] : undefined,
      },
    };
  }

  return { title: "Service Not Found" };
}

export default async function DynamicServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let targetService = null;
  let referenceData = null;

  // 1. Try to find a matching reference
  const reference = await getReference(slug);
  if (reference && reference.service) {
    targetService = reference.service;
    referenceData = reference;
  } else {
    // 2. Try to find a matching service directly
    const service = await getService(slug);
    if (service) {
      targetService = service;
    }
  }

  if (!targetService) {
    notFound();
  }

  // ── Build JSON-LD Schema ──
  const jsonLdTitle = referenceData?.metaTitle || referenceData?.title || targetService.title;
  const jsonLdDesc = referenceData?.metaDescription || referenceData?.description || targetService.description || targetService.tagline;
  const jsonLdImage = referenceData?.ogImage || targetService.ogImage;
  const pageUrl = `${SITE_URL}/services/${slug}`;

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": jsonLdTitle,
        "description": jsonLdDesc,
        "provider": { "@type": "Organization", "name": "StackX" },
        ...(referenceData?.city && {
          "areaServed": {
            "@type": "City",
            "name": referenceData.city,
            ...(referenceData.state && { "containedInPlace": { "@type": "State", "name": referenceData.state } }),
          },
        }),
      },
      {
        "@type": "LocalBusiness",
        "name": "StackX",
        "image": jsonLdImage || `${SITE_URL}/logo.png`,
        "@id": SITE_URL,
        "url": SITE_URL,
      },
      // BreadcrumbList schema
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": `${SITE_URL}/services`,
          },
          ...(referenceData
            ? [
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": targetService.title,
                  "item": `${SITE_URL}/services/${targetService.slug}`,
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": referenceData.title,
                  "item": pageUrl,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": targetService.title,
                  "item": pageUrl,
                },
              ]),
        ],
      },
    ],
  };

  // FAQ schema — from reference FAQs first, then service FAQs as fallback
  const faqs = referenceData?.faqs?.length > 0
    ? referenceData.faqs
    : targetService.faqs?.length > 0
    ? targetService.faqs
    : [];

  if (faqs.length > 0) {
    jsonLd["@graph"].push({
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    });
  }

  // ── Determine which client component to render ──
  const serviceSlug = targetService.slug;

  // Collect internal linking data
  const siblingRefs = referenceData?.siblingReferences || [];
  const manualRelated = referenceData?.relatedReferences || [];
  const internalLinks = manualRelated.length > 0 ? manualRelated : siblingRefs;

  // Common override props
  const overrideTitle = referenceData?.title || targetService.title;
  const overrideTagline = referenceData?.description || targetService.tagline;

  // Breadcrumb data
  const breadcrumbs = referenceData
    ? [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: targetService.title, href: `/services/${targetService.slug}` },
        { label: referenceData.title, href: `/services/${slug}` },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: targetService.title, href: `/services/${slug}` },
      ];

  const sharedProps = {
    overrideTitle,
    overrideTagline,
    initialFaqs: faqs,
    referenceContent: referenceData?.content || "",
    breadcrumbs,
    city: referenceData?.city || "",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {serviceSlug === "web-development" ? (
        <Suspense fallback={null}>
          <WebDevelopmentServiceClient {...sharedProps} />
        </Suspense>
      ) : serviceSlug === "digital-marketing" ? (
        <Suspense fallback={null}>
          <DigitalMarketingServiceClient {...sharedProps} />
        </Suspense>
      ) : serviceSlug === "ad-tech-solutions" ? (
        <Suspense fallback={null}>
          <AdTechSolutionsServiceClient {...sharedProps} />
        </Suspense>
      ) : serviceSlug === "market-research-and-insights" ? (
        <Suspense fallback={null}>
          <MarketResearchAndInsightsServiceClient {...sharedProps} />
        </Suspense>
      ) : (
        <Suspense fallback={null}>
          <ServiceClient
            service={targetService}
            {...sharedProps}
          />
        </Suspense>
      )}
    </>
  );
}
