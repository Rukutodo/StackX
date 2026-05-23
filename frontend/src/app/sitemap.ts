import { MetadataRoute } from "next";

const SERVER_API = process.env.INTERNAL_API_URL || "http://localhost:4000";
const SITE_URL = "https://stackx.co.in";

// Use the date of the last major content update for static routes
const STATIC_LAST_MODIFIED = new Date("2026-05-01");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/careers",
    "/testimonials",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes
  try {
    const [portfolioRes, servicesRes, referencesRes] = await Promise.all([
      fetch(`${SERVER_API}/api/portfolio`),
      fetch(`${SERVER_API}/api/services`),
      fetch(`${SERVER_API}/api/references`),
    ]);

    if (portfolioRes.ok) {
      const projects = await portfolioRes.json();
      projects.forEach((p: any) => {
        routes.push({
          url: `${SITE_URL}/portfolio/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : STATIC_LAST_MODIFIED,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    }

    if (servicesRes.ok) {
      const services = await servicesRes.json();
      services.forEach((s: any) => {
        routes.push({
          url: `${SITE_URL}/services/${s.slug}`,
          lastModified: s.updatedAt ? new Date(s.updatedAt) : STATIC_LAST_MODIFIED,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }

    if (referencesRes.ok) {
      const references = await referencesRes.json();
      references.forEach((r: any) => {
        routes.push({
          url: `${SITE_URL}/${r.slug}`,
          lastModified: r.updatedAt ? new Date(r.updatedAt) : STATIC_LAST_MODIFIED,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return routes;
}

