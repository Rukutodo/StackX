import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { JobApplication } from "../models/JobApplication";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── Multer Setup for Resumes ──────────────────────
const uploadDir = path.join(__dirname, "../../uploads/resumes");
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /pdf|doc|docx|txt/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    cb(null, extOk);
  },
});

// ─── POST /api/applications ────────────────────────
// Public: submit a job application with optional resume upload
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { fullName, email, phone, position, experience, portfolioLink, linkedIn, coverLetter } = req.body;

    if (!fullName || !email || !phone || !position || !coverLetter) {
      return res.status(400).json({ message: "fullName, email, phone, position, and coverLetter are required" });
    }

    const resumePath = req.file ? `/uploads/resumes/${req.file.filename}` : "";

    const application = new JobApplication({
      fullName,
      email,
      phone,
      position,
      experience: experience || "",
      resume: resumePath,
      portfolioLink: portfolioLink || "",
      linkedIn: linkedIn || "",
      coverLetter,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
});

// ─── GET /api/applications ─────────────────────────
// Protected: list all applications
router.get("/", protect, async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("GET /api/applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// ─── GET /api/applications/:id ─────────────────────
// Protected: get a single application
router.get("/:id", protect, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    console.error("GET /api/applications/:id error:", error);
    res.status(500).json({ message: "Failed to fetch application" });
  }
});

// ─── PUT /api/applications/:id/status ──────────────
// Protected: update application status
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "reviewed", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Application not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update application status" });
  }
});

// ─── DELETE /api/applications/:id ──────────────────
// Protected: delete application
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await JobApplication.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete application" });
  }
});

export default router;
