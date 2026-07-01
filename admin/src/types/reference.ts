export interface Reference {
  _id: string;
  slug: string;
  title: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  content?: string;
  city?: string;
  state?: string;
  country?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
  focusKeyword?: string;
  noIndex?: boolean;
  faqs?: { question: string; answer: string }[];
  service: string | { _id: string; title: string; slug: string };
  relatedReferences?: string[] | { _id: string; title: string; slug: string; city?: string }[];
  status: "active" | "draft";
  order: number;
}
