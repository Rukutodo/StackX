import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PortfolioProject } from "../models/PortfolioProject";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── Multer Setup ──────────────────────────────────────────
const uploadDir = path.join(__dirname, "../../uploads/portfolio");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype.split("/")[1]);
    cb(null, extOk || mimeOk);
  },
});

// ─── POST /api/portfolio/upload ────────────────────────────
// Protected: upload a project image
router.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  const url = `/uploads/portfolio/${req.file.filename}`;
  res.json({ url });
});

// ─── GET /api/portfolio ────────────────────────────────────
// Public: returns active + completed projects. ?all=true includes drafts.
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const filter = showAll ? {} : { status: { $in: ["active", "completed"] } };
    const projects = await PortfolioProject.find(filter).sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    res.status(500).json({ message: "Failed to fetch portfolio projects" });
  }
});

// ─── GET /api/portfolio/:slug ──────────────────────────────
// Public: single project by slug (for case study page)
router.get("/:slug", async (req, res) => {
  try {
    const project = await PortfolioProject.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project" });
  }
});

// ─── POST /api/portfolio ───────────────────────────────────
// Protected: create project
router.post("/", protect, async (req, res) => {
  try {
    const { slug, title, category, description, image, techStack, result, featured, status, order, caseStudy } = req.body;

    if (!slug || !title || !category || !description) {
      return res.status(400).json({ message: "slug, title, category, and description are required" });
    }

    const existing = await PortfolioProject.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: `A project with slug "${slug}" already exists` });
    }

    const project = new PortfolioProject({
      slug, title, category, description,
      image: image || "",
      techStack: techStack || [],
      result: result || "",
      featured: featured || false,
      status: status || "active",
      order: order ?? 0,
      caseStudy: caseStudy || null,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
});

// ─── PUT /api/portfolio/:id ────────────────────────────────
// Protected: update project
router.put("/:id", protect, async (req, res) => {
  try {
    const { slug, title, category, description, image, techStack, result, featured, status, order, caseStudy } = req.body;

    // If slug changed, check uniqueness
    if (slug) {
      const conflict = await PortfolioProject.findOne({ slug, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(409).json({ message: `Slug "${slug}" is already used by another project` });
      }
    }

    const updated = await PortfolioProject.findByIdAndUpdate(
      req.params.id,
      { slug, title, category, description, image, techStack, result, featured, status, order, caseStudy },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  } catch (error) {
    console.error("PUT /api/portfolio/:id error:", error);
    res.status(500).json({ message: "Failed to update project" });
  }
});

// ─── DELETE /api/portfolio/:id ─────────────────────────────
// Protected: delete project
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await PortfolioProject.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
});

export default router;
