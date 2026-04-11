import express from "express";
import { Testimonial } from "../models/Testimonial";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── GET /api/testimonials ──────────────────────────
// Public: returns active testimonials sorted by order
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const filter = showAll ? {} : { status: "active" };
    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
});

// ─── GET /api/testimonials/:id ──────────────────────
// Protected: single testimonial by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonial" });
  }
});

// ─── POST /api/testimonials ─────────────────────────
// Protected: create testimonial
router.post("/", protect, async (req, res) => {
  try {
    const { name, company, role, feedback, rating, projectType, status, order, portfolioProject } = req.body;

    if (!name || !company || !feedback) {
      return res.status(400).json({ message: "name, company, and feedback are required" });
    }

    const testimonial = new Testimonial({
      name, company,
      role: role || "",
      feedback,
      rating: rating ?? 5,
      projectType: projectType || "",
      status: status || "active",
      order: order ?? 0,
      portfolioProject: portfolioProject || null,
    });

    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    res.status(500).json({ message: "Failed to create testimonial" });
  }
});

// ─── PUT /api/testimonials/:id ──────────────────────
// Protected: update testimonial
router.put("/:id", protect, async (req, res) => {
  try {
    const { name, company, role, feedback, rating, projectType, status, order, portfolioProject } = req.body;

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { name, company, role, feedback, rating, projectType, status, order, portfolioProject: portfolioProject || null },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Testimonial not found" });
    res.json(updated);
  } catch (error) {
    console.error("PUT /api/testimonials/:id error:", error);
    res.status(500).json({ message: "Failed to update testimonial" });
  }
});

// ─── DELETE /api/testimonials/:id ───────────────────
// Protected: delete testimonial
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete testimonial" });
  }
});

export default router;
