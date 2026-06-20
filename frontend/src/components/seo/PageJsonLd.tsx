import { fetchSeoSettings } from "@/lib/seo";

export default async function PageJsonLd({ pageKey }: { pageKey: string }) {
  const seo = await fetchSeoSettings(pageKey);

  if (!seo || !seo.jsonLdOverrides || Object.keys(seo.jsonLdOverrides).length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLdOverrides) }}
    />
  );
}
