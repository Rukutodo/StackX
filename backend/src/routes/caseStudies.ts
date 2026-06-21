import express from "express";
import { CaseStudy } from "../models/CaseStudy";
import { PortfolioProject } from "../models/PortfolioProject";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── GET /api/case-studies ──────────────────────────
// Public: active case studies sorted by order
// Merges standalone CaseStudy docs + portfolio projects that have embedded case studies
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const filter = showAll ? {} : { status: "active" };

    // 1. Standalone case studies from the CaseStudy collection
    const standalone = await CaseStudy.find(filter).sort({ order: 1, createdAt: -1 });
    const standaloneItems = standalone.map((cs) => ({
      ...cs.toObject(),
      source: "standalone" as const,
    }));

    // 2. Portfolio projects that have an embedded case study
    const portfolioFilter: any = { caseStudy: { $ne: null } };
    if (!showAll) {
      portfolioFilter.status = { $in: ["active", "completed"] };
    }
    const portfolioProjects = await PortfolioProject.find(portfolioFilter).sort({ order: 1 });

    // Check which portfolio projects are already linked to a standalone case study
    const linkedPortfolioIds = new Set(
      standalone
        .filter((cs) => cs.portfolioProject?.id)
        .map((cs) => cs.portfolioProject!.id)
    );

    const portfolioItems = portfolioProjects
      .filter((p) => !linkedPortfolioIds.has(p._id.toString())) // avoid duplicates
      .filter((p) => {
        // Only include if the embedded case study has some real content
        const cs = p.caseStudy as any;
        return cs && (cs.overview || cs.problem || cs.solution || (cs.features && cs.features.length > 0));
      })
      .map((p) => {
        const cs = p.caseStudy as any;
        return {
          _id: `portfolio_${p._id}`,
          title: p.title,
          slug: p.slug,
          client: "",
          service: (p as any).category || "",
          subtitle: cs?.subtitle || "",
          overview: cs?.overview || "",
          problem: cs?.problem || "",
          solution: cs?.solution || "",
          features: cs?.features || [],
          results: cs?.results || [],
          images: cs?.images || [],
          featured: p.featured || false,
          status: p.status === "completed" ? "active" : p.status,
          order: p.order || 0,
          portfolioProject: { id: p._id.toString(), slug: p.slug, title: p.title },
          createdAt: (p as any).createdAt,
          updatedAt: (p as any).updatedAt,
          source: "portfolio" as const,
          portfolioProjectId: p._id.toString(),
        };
      });

    // 3. Merge and sort
    const merged = [...standaloneItems, ...portfolioItems].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    res.json(merged);
  } catch (error) {
    console.error("GET /api/case-studies error:", error);
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
      { returnDocument: 'after', runValidators: true }
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
      { returnDocument: 'after' }
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
