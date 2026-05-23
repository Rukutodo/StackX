import express from "express";
import { Reference } from "../models/Reference";
import { protect } from "../middlewares/authMiddleware";
import { ServiceCategory } from "../models/ServiceCategory";

const router = express.Router();

// ─── GET /api/references ───────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const filter = showAll ? {} : { status: "active" };
    const references = await Reference.find(filter)
      .populate("service", "title slug")
      .sort({ order: 1 });
    res.json(references);
  } catch (error) {
    console.error("GET /api/references error:", error);
    res.status(500).json({ message: "Failed to fetch references" });
  }
});

// ─── GET /api/references/slug/:slug ────────────────────────
router.get("/slug/:slug", async (req, res) => {
  try {
    const reference = await Reference.findOne({ slug: req.params.slug })
      .populate({
        path: "service",
        populate: [
          { path: "featuredProjects" },
          { path: "testimonials" }
        ]
      });
    
    if (!reference) return res.status(404).json({ message: "Reference not found" });
    res.json(reference);
  } catch (error) {
    console.error("GET /api/references/slug/:slug error:", error);
    res.status(500).json({ message: "Failed to fetch reference" });
  }
});

// ─── GET /api/references/:id ───────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const reference = await Reference.findById(req.params.id).populate("service");
    if (!reference) return res.status(404).json({ message: "Reference not found" });
    res.json(reference);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reference" });
  }
});

// ─── POST /api/references ──────────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const { slug, title, description, keywords, ogImage, canonical, robots, focusKeyword, service, status, order } = req.body;

    if (!slug || !title || !service) {
      return res.status(400).json({ message: "slug, title, and service are required" });
    }

    const existing = await Reference.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: `A reference with slug "${slug}" already exists` });
    }

    const serviceDoc = await ServiceCategory.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({ message: "Associated service not found" });
    }

    const reference = new Reference({
      slug,
      title,
      description,
      keywords,
      ogImage,
      canonical,
      robots,
      focusKeyword,
      service,
      status: status || "active",
      order: order ?? 0,
    });

    await reference.save();
    res.status(201).json(reference);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create reference", error: error.message });
  }
});

// ─── PUT /api/references/:id ───────────────────────────────
router.put("/:id", protect, async (req, res) => {
  try {
    const { slug, title, description, keywords, ogImage, canonical, robots, focusKeyword, service, status, order } = req.body;

    const reference = await Reference.findById(req.params.id);
    if (!reference) return res.status(404).json({ message: "Reference not found" });

    if (slug && slug !== reference.slug) {
      const conflict = await Reference.findOne({ slug, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(409).json({ message: `Slug "${slug}" is already used by another reference` });
      }
    }

    const updated = await Reference.findByIdAndUpdate(
      req.params.id,
      { slug, title, description, keywords, ogImage, canonical, robots, focusKeyword, service, status, order },
      { new: true, runValidators: true }
    ).populate("service");

    res.json(updated);
  } catch (error) {
    console.error("PUT /api/references/:id error:", error);
    res.status(500).json({ message: "Failed to update reference" });
  }
});

// ─── DELETE /api/references/:id ────────────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    const reference = await Reference.findById(req.params.id);
    if (!reference) return res.status(404).json({ message: "Reference not found" });

    await Reference.findByIdAndDelete(req.params.id);
    res.json({ message: "Reference deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete reference" });
  }
});

export default router;
