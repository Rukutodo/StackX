import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import PortfolioDetailClient from "./PortfolioDetailClient";
import type { PortfolioProject } from "../PortfolioClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${project.title} | Case Study`,
    description: project.description,
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
    authors: [{ name: "StackX Engineering Team", url: "https://stackx.co.in/about" }],
    publisher: "StackX",
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://stackx.co.in/portfolio/${slug}`,
      siteName: "StackX Portfolio",
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
        ...previousImages,
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

// Use internal API URL for server-side fetching
const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";

async function getProject(slug: string): Promise<PortfolioProject | null> {
  try {
    const res = await fetch(`${SERVER_API}/api/portfolio/${slug}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error fetching project ${slug}:`, error);
    return null;
  }
}

// Optional: Pre-render all current projects at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${SERVER_API}/api/portfolio`);
    if (!res.ok) return [];
    const projects: PortfolioProject[] = await res.json();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://stackx.co.in",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Portfolio",
                item: "https://stackx.co.in/portfolio",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: project.title,
                item: `https://stackx.co.in/portfolio/${slug}`,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            url: `https://stackx.co.in/portfolio/${slug}`,
            image: project.image,
            author: {
              "@type": "Organization",
              "@id": "https://stackx.co.in/#organization",
              name: "StackX",
            },
            publisher: {
              "@type": "Organization",
              "@id": "https://stackx.co.in/#organization",
              name: "StackX",
            },
          }),
        }}
      />
      <PortfolioDetailClient project={project} />
    </>
  );
}
