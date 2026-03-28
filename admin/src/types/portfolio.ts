export interface PortfolioProject {
  _id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  techStack: string[];
  result: string;
  featured: boolean;
  status: "active" | "completed" | "draft" | "pending" | "archived" | "unread" | "read" | "new" | "reviewed" | "rejected";
  order: number;
  caseStudy: {
    subtitle: string;
    overview: string;
    problem: string;
    solution: string;
    features: string[];
    results: { metric: string; label: string }[];
    testimonial: {
      name: string;
      company: string;
      feedback: string;
      rating: number;
      projectType: string;
    } | null;
  } | null;
}
