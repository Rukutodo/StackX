export interface Reference {
  _id: string;
  slug: string;
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
  focusKeyword?: string;
  service: string | { _id: string; title: string; slug: string };
  status: "active" | "draft";
  order: number;
}
