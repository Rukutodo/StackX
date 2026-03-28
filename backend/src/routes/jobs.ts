import express from "express";
import { JobPosting } from "../models/JobPosting";
import { JobApplication } from "../models/JobApplication";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ─── GET /api/jobs ─────────────────────────────────
// Public: active jobs. ?all=true includes draft/archived.
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const filter = showAll ? {} : { status: "active" };
    const jobs = await JobPosting.find(filter).sort({ order: 1 });

    // Attach applicant count for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await JobApplication.countDocuments({ position: job.title });
        return { ...job.toObject(), applicants: count };
      })
    );

    res.json(jobsWithCounts);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// ─── GET /api/jobs/:id ─────────────────────────────
// Public: single job for detail page
router.get("/:id", async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job" });
  }
});

// ─── POST /api/jobs ────────────────────────────────
// Protected: create job posting
router.post("/", protect, async (req, res) => {
  try {
    const { title, department, type, location, description, requirements, status, order } = req.body;

    if (!title || !department || !type || !location || !description) {
      return res.status(400).json({ message: "title, department, type, location, and description are required" });
    }

    const job = new JobPosting({
      title, department, type, location, description,
      requirements: requirements || [],
      status: status || "active",
      order: order ?? 0,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
});

// ─── PUT /api/jobs/:id ─────────────────────────────
// Protected: update job posting
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await JobPosting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Job not found" });
    res.json(updated);
  } catch (error) {
    console.error("PUT /api/jobs/:id error:", error);
    res.status(500).json({ message: "Failed to update job" });
  }
});

// ─── DELETE /api/jobs/:id ──────────────────────────
// Protected: delete job posting
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await JobPosting.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
});

export default router;
