import express from "express";
import { ServiceCategory } from "../models/ServiceCategory";
import { protect } from "../middlewares/authMiddleware";
import { 
  createServicePage, 
  deleteServicePage 
} from "../utils/fileGenerator";

const router = express.Router();

// ─── GET /api/services ─────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const filter = showAll ? {} : { status: "active" };
    const categories = await ServiceCategory.find(filter).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    console.error("GET /api/services error:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

// ─── GET /api/services/slug/:slug ──────────────────────────
router.get("/slug/:slug", async (req, res) => {
  try {
    const category = await ServiceCategory.findOne({ slug: req.params.slug })
      .populate("featuredProjects")
      .populate("testimonials");
    
    if (!category) return res.status(404).json({ message: "Service not found" });
    res.json(category);
  } catch (error) {
    console.error("GET /api/services/slug/:slug error:", error);
    res.status(500).json({ message: "Failed to fetch service" });
  }
});

// ─── GET /api/services/:id ─────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id)
      .populate("featuredProjects")
      .populate("testimonials");
    if (!category) return res.status(404).json({ message: "Service not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service" });
  }
});

// ─── POST /api/services ────────────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const { 
      slug, title, tagline, pricing, techStack, items, 
      caseStudy, status, order, featuredProjects, testimonials,
      pageType, description, keywords, ogImage, canonical, robots, focusKeyword
    } = req.body;

    if (!slug || !title || !tagline || !pricing) {
      return res.status(400).json({ message: "slug, title, tagline, and pricing are required" });
    }

    const existing = await ServiceCategory.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: `A service with slug "${slug}" already exists` });
    }

    const category = new ServiceCategory({
      slug, title, tagline, pricing,
      description, keywords, ogImage, canonical, robots, focusKeyword,
      techStack: techStack || [],
      items: items || [],
      caseStudy: caseStudy || null,
      pageType: pageType || "auto",
      status: status || "active",
      order: order ?? 0,
      featuredProjects: (featuredProjects || []).filter((id: string) => id && id.length === 24),
      testimonials: (testimonials || []).filter((id: string) => id && id.length === 24),
    });

    await category.save();

    // Physically create the Next.js page files ONLY if type is auto
    if (category.pageType === "auto") {
      createServicePage(slug, title, tagline);
    }

    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create service", error: error.message });
  }
});

// ─── PUT /api/services/:id ─────────────────────────────────
router.put("/:id", protect, async (req, res) => {
  try {
    const { 
      slug, title, tagline, pricing, techStack, items, 
      caseStudy, status, order, featuredProjects, testimonials,
      pageType, description, keywords, ogImage, canonical, robots, focusKeyword
    } = req.body;

    const oldCategory = await ServiceCategory.findById(req.params.id);
    if (!oldCategory) return res.status(404).json({ message: "Service not found" });

    const oldSlug = oldCategory.slug;

    if (slug && slug !== oldSlug) {
      const conflict = await ServiceCategory.findOne({ slug, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(409).json({ message: `Slug "${slug}" is already used by another service` });
      }
    }

    const updated = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      { 
        slug, title, tagline, pricing, techStack, items, 
        caseStudy, status, order, featuredProjects, testimonials,
        pageType, description, keywords, ogImage, canonical, robots, focusKeyword
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Service not found" });

    // --- File Sync Logic ---
    if (updated.pageType === "auto") {
      const newSlug = updated.slug;
      if (newSlug !== oldSlug) {
        deleteServicePage(oldSlug);
        createServicePage(newSlug, updated.title, updated.tagline);
      }
    }

    res.json(updated);
  } catch (error) {
    console.error("PUT /api/services/:id error:", error);
    res.status(500).json({ message: "Failed to update service" });
  }
});

// ─── DELETE /api/services/:id ──────────────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Service not found" });

    const slug = category.slug;

    await ServiceCategory.findByIdAndDelete(req.params.id);

    // Physically delete the Next.js page folder safely
    deleteServicePage(slug);
    
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service" });
  }
});

export default router;
