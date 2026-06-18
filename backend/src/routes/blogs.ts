import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Blog } from "../models/Blog";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── Multer Setup ──────────────────────────────────────────
const uploadDir = path.join(process.cwd(), "uploads/blogs");
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

// ─── POST /api/blogs/upload ────────────────────────────────
router.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  const url = `/uploads/blogs/${req.file.filename}`;
  res.json({ url });
});

// ─── POST /api/blogs/fetch-image ───────────────────────────
// Protected: grab an image from Unsplash based on `query` (the blog title),
// download it into uploads/blogs, and return the local path. If no Unsplash
// access key is configured (or the query has no match), falls back to a
// random image so the button always works.
router.post("/fetch-image", protect, async (req, res) => {
  try {
    const query = (req.body?.query || "").toString().trim();
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    let imageUrl = "";
    let source: "unsplash" | "random" = "random";

    // 1. Try Unsplash (title-based) if a key is configured
    if (accessKey && query) {
      try {
        const apiRes = await fetch(
          `https://api.unsplash.com/photos/random?orientation=landscape&query=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Client-ID ${accessKey}` } }
        );
        if (apiRes.ok) {
          const data: any = await apiRes.json();
          imageUrl = data?.urls?.regular || "";
          if (imageUrl) source = "unsplash";
        }
      } catch {
        // ignore — fall through to random fallback
      }
    }

    // 2. Fallback: a random landscape image (no key, or no Unsplash match)
    if (!imageUrl) {
      imageUrl = `https://picsum.photos/1200/630?random=${Date.now()}`;
      source = "random";
    }

    // 3. Download the image bytes and save locally
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return res.status(502).json({ message: "Could not download image from provider" });
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    res.json({ url: `/uploads/blogs/${filename}`, source });
  } catch (error) {
    console.error("POST /api/blogs/fetch-image error:", error);
    res.status(500).json({ message: "Failed to fetch image" });
  }
});

// ─── GET /api/blogs ────────────────────────────────────────
// Public: returns active blogs. ?all=true includes drafts.
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const filter = showAll ? {} : { status: "active" };
    const blogs = await Blog.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

// ─── GET /api/blogs/id/:id ─────────────────────────────────
// Protected: single blog by MongoDB _id (for admin edit)
router.get("/id/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
});

// ─── GET /api/blogs/:slug ──────────────────────────────────
// Public: single blog by slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
});

// ─── POST /api/blogs ───────────────────────────────────────
// Protected: create blog
router.post("/", protect, async (req, res) => {
  try {
    const { slug, title, excerpt, category, coverImage, content, author, readingTime, status, order } = req.body;

    if (!slug || !title) {
      return res.status(400).json({ message: "slug and title are required" });
    }

    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: `A blog with slug "${slug}" already exists` });
    }

    const blog = new Blog({
      slug, title,
      excerpt: excerpt || "",
      category: category || "General",
      coverImage: coverImage || "",
      content: content || "",
      author: author || "StackX Team",
      readingTime: readingTime || "",
      status: status || "draft",
      order: order ?? 0,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
});

// ─── PUT /api/blogs/:id ────────────────────────────────────
// Protected: update blog
router.put("/:id", protect, async (req, res) => {
  try {
    const { slug, title, excerpt, category, coverImage, content, author, readingTime, status, order } = req.body;

    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Blog not found" });

    if (slug && slug !== existing.slug) {
      const conflict = await Blog.findOne({ slug });
      if (conflict) {
        return res.status(409).json({ message: `Slug "${slug}" is already used by another blog` });
      }
    }

    // Clean up old cover image if it changed
    if (existing.coverImage && existing.coverImage.startsWith("/uploads/") &&
        coverImage && coverImage !== existing.coverImage) {
      const absPath = path.join(process.cwd(), existing.coverImage);
      try {
        if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
      } catch {}
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { slug, title, excerpt, category, coverImage, content, author, readingTime, status, order },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Blog not found" });
    res.json(updated);
  } catch (error) {
    console.error("PUT /api/blogs/:id error:", error);
    res.status(500).json({ message: "Failed to update blog" });
  }
});

// ─── DELETE /api/blogs/:id ─────────────────────────────────
// Protected: delete blog and clean up image
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found" });

    if (deleted.coverImage && deleted.coverImage.startsWith("/uploads/")) {
      const absPath = path.join(process.cwd(), deleted.coverImage);
      try {
        if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
      } catch {}
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog" });
  }
});

export default router;
