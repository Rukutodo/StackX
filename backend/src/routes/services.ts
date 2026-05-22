import express from "express";
import { ServiceCategory } from "../models/ServiceCategory";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── GET /api/services ─────────────────────────────────────
// Public: returns only active categories sorted by order
// Admin: pass ?all=true to include drafts (still needs no auth — admin page handles display)
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
// Fetch a single service by its slug, populating featured projects and testimonials
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
// Protected: admin only
router.post("/", protect, async (req, res) => {
  try {
    const { 
      slug, title, tagline, pricing, techStack, items, 
      caseStudy, status, order, featuredProjects, testimonials 
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
      techStack: techStack || [],
      items: items || [],
      caseStudy: caseStudy || null,
      status: status || "active",
      order: order ?? 0,
      featuredProjects: featuredProjects || [],
      testimonials: testimonials || [],
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("POST /api/services error:", error);
    res.status(500).json({ message: "Failed to create service" });
  }
});

// ─── PUT /api/services/:id ─────────────────────────────────
// Protected: admin only
router.put("/:id", protect, async (req, res) => {
  try {
    const { 
      slug, title, tagline, pricing, techStack, items, 
      caseStudy, status, order, featuredProjects, testimonials 
    } = req.body;

    // If slug changed, check it doesn't conflict with another doc
    if (slug) {
      const conflict = await ServiceCategory.findOne({ slug, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(409).json({ message: `Slug "${slug}" is already used by another service` });
      }
    }

    const updated = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      { 
        slug, title, tagline, pricing, techStack, items, 
        caseStudy, status, order, featuredProjects, testimonials 
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Service not found" });
    res.json(updated);
  } catch (error) {
    console.error("PUT /api/services/:id error:", error);
    res.status(500).json({ message: "Failed to update service" });
  }
});

// ─── DELETE /api/services/:id ──────────────────────────────
// Protected: admin only
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await ServiceCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service" });
  }
});

export default router;
