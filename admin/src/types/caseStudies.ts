export interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  client: string;
  service: string;
  subtitle: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  results: { metric: string; label: string }[];
  images: string[];
  featured: boolean;
  status: "active" | "draft" | "archived";
  order: number;
  portfolioProject: { id: string; slug: string; title: string } | null;
  createdAt: string;
  /** Where this case study data comes from */
  source?: "standalone" | "portfolio";
  /** If source is "portfolio", the MongoDB _id of the PortfolioProject */
  portfolioProjectId?: string;
}
