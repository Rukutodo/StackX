import fs from "fs";
import path from "path";

/**
 * Physically creates a Next.js page file in the frontend for a new service
 */
export const createServicePage = (slug: string, title: string, tagline: string) => {
    try {
        const servicesDir = path.join(__dirname, "../../../frontend/src/app/services");
        const targetDir = path.join(servicesDir, slug);

        // Prevent overwriting dynamic route folder or existing service pages
        if (fs.existsSync(targetDir) || slug === "[slug]") {
            return;
        }

        fs.mkdirSync(targetDir, { recursive: true });

        // Basic page content that leverages the existing ServiceClient
        const pageContent = `import ServiceClient from '../[slug]/ServiceClient';
import { notFound } from 'next/navigation';

export default async function Page() {
  const SERVER_API = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  
  try {
    const res = await fetch(\`\${SERVER_API}/api/services/slug/${slug}\`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return notFound();
    const service = await res.json();
    return <ServiceClient service={service} />;
  } catch (error) {
    return notFound();
  }
}
`;

        fs.writeFileSync(path.join(targetDir, "page.tsx"), pageContent);
        console.log(`[FileGenerator] Created page for service: ${slug}`);
    } catch (error) {
        console.error(`[FileGenerator] Failed to create page for ${slug}:`, error);
    }
};

/**
 * Deletes the physically created Next.js page file in the frontend
 */
export const deleteServicePage = (slug: string) => {
    try {
        const servicesDir = path.join(__dirname, "../../../frontend/src/app/services");
        const targetDir = path.join(servicesDir, slug);

        // Safeguard to ensure we don't delete the dynamic folder
        if (slug !== "[slug]" && fs.existsSync(targetDir)) {
            fs.rmSync(targetDir, { recursive: true, force: true });
            console.log(`[FileGenerator] Deleted page for service: ${slug}`);
        }
    } catch (error) {
        console.error(`[FileGenerator] Failed to delete page for ${slug}:`, error);
    }
};
