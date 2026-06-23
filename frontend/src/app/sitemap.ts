import { MetadataRoute } from "next";

const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";
const SITE_URL = "https://www.stackx.co.in";

// Use the date of the last major content update for static routes
const STATIC_LAST_MODIFIED = new Date("2026-05-01");

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/careers",
    "/testimonials",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/blog",
    "/case-studies",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  // Helper to fetch data safely
  const fetchData = async (endpoint: string) => {
    try {
      const res = await fetch(`${SERVER_API}${endpoint}`);
      if (res.ok) return await res.json();
    } catch (error) {
      console.error(`Sitemap generation error for ${endpoint}:`, error);
    }
    return [];
  };

  // Dynamic routes
  const [projects, services, references, blogs, caseStudies] = await Promise.all([
    fetchData("/api/portfolio"),
    fetchData("/api/services"),
    fetchData("/api/references"),
    fetchData("/api/blogs"),
    fetchData("/api/case-studies"),
  ]);

  projects.forEach((p: any) => {
    routes.push({
      url: `${SITE_URL}/portfolio/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  services.forEach((s: any) => {
    routes.push({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  references.forEach((r: any) => {
    routes.push({
      url: `${SITE_URL}/${r.slug}`,
      lastModified: r.updatedAt ? new Date(r.updatedAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  blogs.forEach((b: any) => {
    routes.push({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  caseStudies.forEach((c: any) => {
    routes.push({
      url: `${SITE_URL}/case-studies/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  return routes;
}

