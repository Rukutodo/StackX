import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const serviceCategorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  icon: { type: String, default: "HiCode" },
  tagline: { type: String, required: true },
  pricing: { type: String, required: true },
  description: { type: String },
  techStack: { type: [String], default: [] },
  accordions: { type: Array, default: [] },
  faqs: { type: Array, default: [] },
  relatedCaseStudies: { type: Array, default: [] },
});

const ServiceCategory = mongoose.models.ServiceCategory || mongoose.model("ServiceCategory", serviceCategorySchema);

const services = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: "HiCode",
    tagline: "Custom web applications, SaaS platforms, e-commerce solutions, and progressive web apps built with modern technologies.",
    pricing: "Starting at $3,000",
    description: "High-performance custom web development services.",
    techStack: ["Next.js", "React", "Node.js", "MongoDB"],
  },
  {
    slug: "ad-tech-solutions",
    title: "Ad Tech Solutions",
    icon: "HiChartBar",
    tagline: "Performance driven advertising platforms, analytics dashboards, and programmatic ad tech development.",
    pricing: "Custom Pricing",
    description: "Robust ad tech solutions for modern advertising.",
    techStack: ["TypeScript", "Python", "AWS", "Redis"],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    icon: "HiCog",
    tagline: "Digital marketing, performance campaigns, and analytics systems designed to bring real customers, not just traffic.",
    pricing: "Starting at $1,000/mo",
    description: "Data-driven digital marketing and SEO services.",
    techStack: ["SEO", "Google Ads", "Analytics", "Social Media"],
  },
  {
    slug: "market-research-and-insights",
    title: "Market Research & Insights",
    icon: "HiLightBulb",
    tagline: "Every product starts with clarity. We research your market, validate your ideas, and shape them around real demand.",
    pricing: "Starting at $2,000",
    description: "In-depth market research and product validation.",
    techStack: ["Data Analysis", "Surveys", "Market Trends"],
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to DB.");

    for (const s of services) {
      const existing = await ServiceCategory.findOne({ slug: s.slug });
      if (!existing) {
        await ServiceCategory.create(s);
        console.log(`Created service: ${s.title}`);
      } else {
        console.log(`Service already exists: ${s.title}`);
      }
    }
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    mongoose.connection.close();
    console.log("Done.");
  }
}

seed();
