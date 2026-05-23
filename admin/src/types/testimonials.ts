export interface Testimonial {
  _id: string;
  name: string;
  company: string;
  role: string;
  feedback: string;
  rating: number;
  projectType: string;
  status: "active" | "pending" | "archived";
  order: number;
  portfolioProject: { id: string; slug: string; title: string } | null;
  createdAt: string;
}
