import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Certificate } from "../models/Certificate";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── Multer Setup ──────────────────────────────────────────
const uploadDir = path.join(process.cwd(), "uploads/certificates");
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

// ─── POST /api/certificates/upload ─────────────────────────
router.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  const url = `/uploads/certificates/${req.file.filename}`;
  res.json({ url });
});

// GET /api/certificates/:certificateId - Public Verification Route
router.get("/:certificateId", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.certificateId 
    });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/certificates - Admin List All
router.get("/", protect, async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/certificates - Admin Create
router.post("/", protect, async (req, res) => {
  try {
    // Check if ID already exists
    const existing = await Certificate.findOne({ certificateId: req.body.certificateId });
    if (existing) {
      return res.status(400).json({ message: "Certificate ID already exists" });
    }

    const certificate = new Certificate(req.body);
    await certificate.save();
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

// PUT /api/certificates/:id - Admin Update (e.g., Revoke)
router.put("/:id", protect, async (req, res) => {
  try {
    // Ensure uniqueness if certificateId is changed
    if (req.body.certificateId) {
      const existing = await Certificate.findOne({ 
        certificateId: req.body.certificateId
      });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Certificate ID already exists" });
      }
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

// DELETE /api/certificates/:id - Admin Delete
router.delete("/:id", protect, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
