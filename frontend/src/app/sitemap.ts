import { MetadataRoute } from "next";

const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";
const SITE_URL = "https://stackx.co.in";

// Use the date of the last major content update for static routes
const STATIC_LAST_MODIFIED = new Date("2026-05-01");

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    { route: "", priority: 1.0 },
    { route: "/about", priority: 0.9 },
    { route: "/services", priority: 0.9 },
    { route: "/careers", priority: 0.9 },
    { route: "/testimonials", priority: 0.9 },
    { route: "/contact", priority: 0.9 },
    { route: "/case-studies", priority: 0.7 },
    { route: "/blog", priority: 0.6 },
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map(({ route, priority }) => ({
    url: `${SITE_URL}${route}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority,
  }));

  // Helper to fetch data safely
  const fetchData = async (endpoint: string) => {
    try {
      const res = await fetch(`${SERVER_API}${endpoint}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        return [];
      }
    } catch (error) {
      console.error(`Sitemap generation error for ${endpoint}:`, error);
    }
    return [];
  };

  // Dynamic routes
  const [services, references, caseStudies, blogs] = await Promise.all([
    fetchData("/api/services"),
    fetchData("/api/references"),
    fetchData("/api/case-studies"),
    fetchData("/api/blogs"),
  ]);

  services.forEach((s: any) => {
    routes.push({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  references.forEach((r: any) => {
    routes.push({
      url: `${SITE_URL}/services/${r.slug}`,
      lastModified: r.updatedAt ? new Date(r.updatedAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
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

  blogs.forEach((b: any) => {
    routes.push({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  return routes;
}
