import express from "express";
import { CaseStudy } from "../models/CaseStudy";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── GET /api/case-studies ──────────────────────────
// Public: active case studies sorted by order
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const filter = showAll ? {} : { status: "active" };
    const caseStudies = await CaseStudy.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(caseStudies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch case studies" });
  }
});

// ─── GET /api/case-studies/slug/:slug ───────────────
// Public: single case study by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const cs = await CaseStudy.findOne({ slug: req.params.slug });
    if (!cs) return res.status(404).json({ message: "Case study not found" });
    res.json(cs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch case study" });
  }
});

// ─── GET /api/case-studies/:id ──────────────────────
// Protected: single case study by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const cs = await CaseStudy.findById(req.params.id);
    if (!cs) return res.status(404).json({ message: "Case study not found" });
    res.json(cs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch case study" });
  }
});

// ─── POST /api/case-studies ─────────────────────────
// Protected: create case study
router.post("/", protect, async (req, res) => {
  try {
    const {
      title, slug, client, service, subtitle, overview, problem,
      solution, features, results, images, status, order, portfolioProject,
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ message: "title and slug are required" });
    }

    const cs = new CaseStudy({
      title, slug,
      client: client || "",
      service: service || "",
      subtitle: subtitle || "",
      overview: overview || "",
      problem: problem || "",
      solution: solution || "",
      features: features || [],
      results: results || [],
      images: images || [],
      status: status || "draft",
      order: order ?? 0,
      portfolioProject: portfolioProject || null,
    });

    await cs.save();
    res.status(201).json(cs);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A case study with this slug already exists" });
    }
    res.status(500).json({ message: "Failed to create case study" });
  }
});

// ─── PUT /api/case-studies/:id ──────────────────────
// Protected: update case study
router.put("/:id", protect, async (req, res) => {
  try {
    const {
      title, slug, client, service, subtitle, overview, problem,
      solution, features, results, images, status, order, portfolioProject,
    } = req.body;

    const updated = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      {
        title, slug, client, service, subtitle, overview, problem,
        solution, features, results, images, status, order,
        portfolioProject: portfolioProject || null,
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Case study not found" });
    res.json(updated);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A case study with this slug already exists" });
    }
    res.status(500).json({ message: "Failed to update case study" });
  }
});

// ─── PATCH /api/case-studies/:id/feature ────────────
// Protected: set one case study as featured, unset all others
router.patch("/:id/feature", protect, async (req, res) => {
  try {
    await CaseStudy.updateMany({}, { featured: false });
    const updated = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      { featured: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Case study not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to set featured case study" });
  }
});

// ─── DELETE /api/case-studies/:id ───────────────────
// Protected: delete case study
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Case study not found" });
    res.json({ message: "Case study deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete case study" });
  }
});

export default router;
