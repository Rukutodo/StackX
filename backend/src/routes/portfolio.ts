import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PortfolioProject } from "../models/PortfolioProject";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── Multer Setup ──────────────────────────────────────────
const uploadDir = path.join(process.cwd(), "uploads/portfolio");
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
// Protected: upload a single project image
router.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  const url = `/uploads/portfolio/${req.file.filename}`;
  res.json({ url });
});

// ─── POST /api/portfolio/upload-multiple ───────────────────
// Protected: upload multiple case study images (max 10)
router.post("/upload-multiple", protect, upload.array("images", 10), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No image files provided" });
  }
  const urls = files.map((f) => `/uploads/portfolio/${f.filename}`);
  res.json({ urls });
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

// ─── GET /api/portfolio/id/:id ────────────────────────────
// Protected: single project by MongoDB _id (for admin edit)
router.get("/id/:id", protect, async (req, res) => {
  try {
    const project = await PortfolioProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project" });
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

    const existingProject = await PortfolioProject.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // If slug changed, check uniqueness
    if (slug && slug !== existingProject.slug) {
      const conflict = await PortfolioProject.findOne({ slug });
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

    // ── Clean up deleted images from disk ──────────────────────────────
    const oldImages: string[] = [];
    if (existingProject.image && existingProject.image.startsWith("/uploads/")) {
      oldImages.push(existingProject.image);
    }
    const oldCsImages: string[] = (existingProject.caseStudy as any)?.images ?? [];
    for (const img of oldCsImages) {
      if (img && img.startsWith("/uploads/")) {
        oldImages.push(img);
      }
    }

    const newImages: string[] = [];
    if (image && image.startsWith("/uploads/")) {
      newImages.push(image);
    }
    const newCsImages: string[] = caseStudy?.images ?? [];
    for (const img of newCsImages) {
      if (img && img.startsWith("/uploads/")) {
        newImages.push(img);
      }
    }

    // Find images that were in the old project but are not in the new project
    const deletedImages = oldImages.filter(oldImg => !newImages.includes(oldImg));

    // Delete them
    for (const relPath of deletedImages) {
      const absPath = path.join(process.cwd(), relPath);
      try {
        if (fs.existsSync(absPath)) {
          fs.unlinkSync(absPath);
          console.log(`🗑️  Deleted orphaned image: ${relPath}`);
        }
      } catch (fileErr) {
        console.warn(`⚠️  Could not delete orphaned image ${relPath}:`, fileErr);
      }
    }

    res.json(updated);
  } catch (error) {
    console.error("PUT /api/portfolio/:id error:", error);
    res.status(500).json({ message: "Failed to update project" });
  }
});

// ─── DELETE /api/portfolio/:id ─────────────────────────────
// Protected: delete project AND clean up all uploaded images from disk
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await PortfolioProject.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });

    // ── Collect every image path stored in this project ──────────────────────
    // Image paths are stored as "/uploads/portfolio/<filename>" in the DB.
    // We convert them to absolute filesystem paths and delete each one.
    const imagePaths: string[] = [];

    // Main cover image
    if (deleted.image && deleted.image.startsWith("/uploads/")) {
      imagePaths.push(deleted.image);
    }

    // Case study images (caseStudy.images is an array of URLs)
    const csImages: string[] = (deleted.caseStudy as any)?.images ?? [];
    for (const img of csImages) {
      if (img && img.startsWith("/uploads/")) {
        imagePaths.push(img);
      }
    }

    // ── Delete files from disk (silently skip missing files) ─────────────────
    for (const relPath of imagePaths) {
      const absPath = path.join(process.cwd(), relPath);
      try {
        if (fs.existsSync(absPath)) {
          fs.unlinkSync(absPath);
          console.log(`🗑️  Deleted image: ${relPath}`);
        }
      } catch (fileErr) {
        // Non-fatal — log but don't fail the request
        console.warn(`⚠️  Could not delete image ${relPath}:`, fileErr);
      }
    }

    res.json({ message: "Project deleted successfully", imagesRemoved: imagePaths.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
});


export default router;
