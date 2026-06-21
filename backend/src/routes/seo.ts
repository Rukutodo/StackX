import express from "express";
import { SeoSettings } from "../models/SeoSettings";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// All page keys the site uses
const ALL_PAGE_KEYS = [
  "home", "about", "services", "portfolio", "careers",
  "testimonials", "contact", "blog", "case-studies",
  "privacy-policy", "terms-of-service",
];

// Default SEO settings for pages (used as fallback when no DB entry exists)
const PAGE_DEFAULTS: Record<string, {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  canonical: string;
}> = {
  home: {
    title: "StackX — We build, validate, and scale business",
    description:
      "High-performance web development, business automation, and ad tech solutions in Vizag at unbeatable costs. Your trusted technology partner.",
    keywords: [
      "web development", "software development", "business automation",
      "ad tech", "SaaS development", "StackX", "cost-effective development",
      "Vizag tech agency", "web development company Vizag", "digital marketing Vizag",
    ],
    ogTitle: "StackX — We build, validate, and scale business",
    ogDescription: "High-performance web solutions, automation systems, and ad tech platforms at industry-leading prices.",
    ogImage: "/og-image.png",
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    canonical: "/",
  },
  about: {
    title: "About Us",
    description: "Learn about StackX's mission, vision, and the team building high-performance digital solutions in Visakhapatnam.",
    keywords: ["about StackX", "StackX team", "Vizag tech company", "software agency India"],
    ogTitle: "About Us | StackX",
    ogDescription: "Meet the team behind StackX — passionate builders of digital solutions.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/about",
  },
  services: {
    title: "Services",
    description: "Explore StackX's web development, business automation, ad tech, and digital marketing services.",
    keywords: ["web development services", "business automation", "ad tech solutions", "digital marketing Vizag"],
    ogTitle: "Services | StackX",
    ogDescription: "Web development, automation, ad tech, and digital marketing services.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/services",
  },
  portfolio: {
    title: "Portfolio & Case Studies",
    description: "Explore StackX's portfolio of successful web development, automation, and ad tech projects.",
    keywords: ["StackX portfolio", "case studies", "web development projects"],
    ogTitle: "Portfolio & Case Studies | StackX",
    ogDescription: "See our work — real projects, real results.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/portfolio",
  },
  careers: {
    title: "Careers",
    description: "Join StackX and help us build the next generation of digital solutions. View open positions.",
    keywords: ["StackX careers", "tech jobs Vizag", "software developer jobs"],
    ogTitle: "Careers | StackX",
    ogDescription: "Join our team and build something extraordinary.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/careers",
  },
  testimonials: {
    title: "Testimonials",
    description: "Read what our clients say about working with StackX.",
    keywords: ["StackX reviews", "client testimonials", "StackX feedback"],
    ogTitle: "Testimonials | StackX",
    ogDescription: "Real stories from real clients who trust StackX.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/testimonials",
  },
  contact: {
    title: "Contact Us",
    description: "Get a free consultation with StackX. Reach out for web development, automation, or ad tech projects.",
    keywords: ["contact StackX", "free consultation", "web development quote"],
    ogTitle: "Contact Us | StackX",
    ogDescription: "Get a free consultation — let's build something great together.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/contact",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Learn how StackX collects, uses, and protects your personal information.",
    keywords: ["privacy policy", "data protection", "StackX privacy"],
    ogTitle: "Privacy Policy | StackX",
    ogDescription: "How we handle your data.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/privacy-policy",
  },
  "terms-of-service": {
    title: "Terms of Service",
    description: "Read the terms and conditions governing the use of StackX services.",
    keywords: ["terms of service", "terms and conditions", "StackX terms"],
    ogTitle: "Terms of Service | StackX",
    ogDescription: "Terms and conditions for using StackX services.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/terms-of-service",
  },
  blog: {
    title: "Blog — StackX",
    description: "Read the latest articles on web development, business automation, ad tech, and digital growth strategies from StackX.",
    keywords: ["StackX blog", "web development blog", "tech articles", "business automation insights", "digital marketing tips"],
    ogTitle: "Blog | StackX",
    ogDescription: "Latest articles on web development, automation, and digital growth.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/blog",
  },
  "case-studies": {
    title: "Case Studies — StackX",
    description: "Explore detailed case studies showcasing how StackX delivered results for clients across web development, automation, and ad tech.",
    keywords: ["StackX case studies", "client success stories", "web development case study", "business automation results"],
    ogTitle: "Case Studies | StackX",
    ogDescription: "Real client success stories — see how we deliver results.",
    ogImage: "/og-image.png",
    robots: "index, follow",
    canonical: "/case-studies",
  },
};

// ─── GET /api/seo ────────────────────────────────────
// Protected: fetch ALL SEO settings (for admin audit dashboard)
router.get("/", protect, async (_req, res) => {
  try {
    const dbSettings = await SeoSettings.find({}).lean();
    const dbMap = new Map(dbSettings.map((s: any) => [s.pageKey, s]));

    // Merge DB settings with defaults for all pages
    const allPages = ALL_PAGE_KEYS.map((key) => {
      const db = dbMap.get(key) as any;
      const defaults = PAGE_DEFAULTS[key];

      if (db) {
        return { ...db, _source: "database" };
      }
      if (defaults) {
        return {
          pageKey: key,
          ...defaults,
          twitterTitle: defaults.ogTitle,
          twitterDescription: defaults.ogDescription,
          jsonLdOverrides: {},
          _source: "defaults",
        };
      }
      return {
        pageKey: key,
        title: "",
        description: "",
        keywords: [],
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        robots: "index, follow",
        canonical: `/${key === "home" ? "" : key}`,
        twitterTitle: "",
        twitterDescription: "",
        jsonLdOverrides: {},
        _source: "empty",
      };
    });

    res.json(allPages);
  } catch (error) {
    console.error("GET /api/seo error:", error);
    res.status(500).json({ message: "Failed to fetch all SEO settings" });
  }
});

// ─── GET /api/seo/:pageKey ───────────────────────────
// Public: fetch SEO settings for a page
router.get("/:pageKey", async (req, res) => {
  try {
    const pageKey = req.params.pageKey as string;
    const settings = await SeoSettings.findOne({ pageKey: pageKey.toLowerCase() });

    if (settings) {
      return res.json(settings);
    }

    // Return defaults if no DB entry exists
    const defaults = PAGE_DEFAULTS[pageKey.toLowerCase()];
    if (defaults) {
      return res.json({
        pageKey: pageKey.toLowerCase(),
        ...defaults,
        twitterTitle: defaults.ogTitle,
        twitterDescription: defaults.ogDescription,
        jsonLdOverrides: {},
      });
    }

    // No defaults either — return empty
    return res.status(404).json({ message: `No SEO settings found for page: ${pageKey}` });
  } catch (error) {
    console.error("GET /api/seo/:pageKey error:", error);
    res.status(500).json({ message: "Failed to fetch SEO settings" });
  }
});

// ─── PUT /api/seo/:pageKey ───────────────────────────
// Protected: create or update SEO settings for a page
router.put("/:pageKey", protect, async (req, res) => {
  try {
    const pageKey = req.params.pageKey as string;
    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      robots,
      canonical,
      jsonLdOverrides,
    } = req.body;

    const settings = await SeoSettings.findOneAndUpdate(
      { pageKey: pageKey.toLowerCase() },
      {
        pageKey: pageKey.toLowerCase(),
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        robots,
        canonical,
        jsonLdOverrides,
      },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.json(settings);
  } catch (error) {
    console.error("PUT /api/seo/:pageKey error:", error);
    res.status(500).json({ message: "Failed to update SEO settings" });
  }
});

export default router;
