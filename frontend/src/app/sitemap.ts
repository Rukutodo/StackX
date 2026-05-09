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

  // Dynamic portfolio routes
  try {
    const res = await fetch(`${SERVER_API}/api/portfolio`);
    if (res.ok) {
      const projects = await res.json();
      const projectRoutes = projects.map((project: any) => ({
        url: `${SITE_URL}/portfolio/${project.slug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : STATIC_LAST_MODIFIED,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
      return [...routes, ...projectRoutes];
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return routes;
}

