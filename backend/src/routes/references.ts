import express from "express";
import { Reference } from "../models/Reference";
import { protect } from "../middlewares/authMiddleware";
import { ServiceCategory } from "../models/ServiceCategory";

const router = express.Router();

const SITE_URL = "https://stackx.co.in";

// ─── Helper: Auto-fill SEO fields ────────────────────────
function autoFillSeo(data: any) {
  // Auto-generate slug from service slug + city
  // (only if slug is empty and both service slug and city are available)
  // This is handled in the POST route with the service lookup

  // Auto meta title
  if (!data.metaTitle && data.title && data.city) {
    data.metaTitle = `${data.title} | StackX`;
  }

  // Auto meta description from content or description
  if (!data.metaDescription) {
    if (data.content) {
      // Strip HTML/markdown and take first 160 chars
      const plain = data.content
        .replace(/<[^>]*>/g, "")
        .replace(/[#*_~`>\-\[\]()!]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      data.metaDescription = plain.substring(0, 157) + (plain.length > 157 ? "..." : "");
    } else if (data.description) {
      data.metaDescription = data.description.substring(0, 160);
    }
  }

  // Auto canonical
  if (!data.canonical && data.slug) {
    data.canonical = `${SITE_URL}/services/${data.slug}`;
  }

  // Sync robots with noIndex
  if (data.noIndex) {
    data.robots = "noindex, nofollow";
  }

  return data;
}

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

// ─── GET /api/references/related/:serviceId ────────────────
// Returns all active references for a given parent service (for internal linking)
router.get("/related/:serviceId", async (req, res) => {
  try {
    const references = await Reference.find({
      service: req.params.serviceId,
      status: "active",
    })
      .select("title slug city")
      .sort({ order: 1 });
    res.json(references);
  } catch (error) {
    console.error("GET /api/references/related/:serviceId error:", error);
    res.status(500).json({ message: "Failed to fetch related references" });
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
      })
      .populate("relatedReferences", "title slug city");
    
    if (!reference) return res.status(404).json({ message: "Reference not found" });

    // Also fetch sibling references (same service, excluding self)
    const siblings = await Reference.find({
      service: reference.service._id,
      status: "active",
      _id: { $ne: reference._id },
    })
      .select("title slug city")
      .sort({ order: 1 })
      .limit(12);

    const result: any = reference.toObject();
    result.siblingReferences = siblings;

    res.json(result);
  } catch (error) {
    console.error("GET /api/references/slug/:slug error:", error);
    res.status(500).json({ message: "Failed to fetch reference" });
  }
});

// ─── GET /api/references/:id ───────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const reference = await Reference.findById(req.params.id)
      .populate("service")
      .populate("relatedReferences", "title slug city");
    if (!reference) return res.status(404).json({ message: "Reference not found" });
    res.json(reference);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reference" });
  }
});

// ─── POST /api/references ──────────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    let {
      slug, title, description, metaTitle, metaDescription, content,
      city, state, country,
      keywords, ogImage, canonical, robots, focusKeyword, noIndex,
      faqs, service, relatedReferences,
      status, order,
    } = req.body;

    if (!title || !service) {
      return res.status(400).json({ message: "title and service are required" });
    }

    // Look up service for auto-slug
    const serviceDoc = await ServiceCategory.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({ message: "Associated service not found" });
    }

    // Auto-generate slug from service + city if not provided
    if (!slug && city) {
      slug = `${serviceDoc.slug}-${city}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    } else if (!slug) {
      slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    const existing = await Reference.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: `A reference with slug "${slug}" already exists` });
    }

    // Auto-fill SEO fields
    let data: any = {
      slug, title, description, metaTitle, metaDescription, content,
      city, state, country,
      keywords, ogImage, canonical, robots, focusKeyword, noIndex,
      faqs: faqs || [],
      service,
      relatedReferences: relatedReferences || [],
      status: status || "active",
      order: order ?? 0,
    };
    data = autoFillSeo(data);

    const reference = new Reference(data);
    await reference.save();
    res.status(201).json(reference);
  } catch (error: any) {
    console.error("POST /api/references error:", error);
    res.status(500).json({ message: "Failed to create reference", error: error.message });
  }
});

// ─── PUT /api/references/:id ───────────────────────────────
router.put("/:id", protect, async (req, res) => {
  try {
    let {
      slug, title, description, metaTitle, metaDescription, content,
      city, state, country,
      keywords, ogImage, canonical, robots, focusKeyword, noIndex,
      faqs, service, relatedReferences,
      status, order,
    } = req.body;

    const reference = await Reference.findById(req.params.id);
    if (!reference) return res.status(404).json({ message: "Reference not found" });

    if (slug && slug !== reference.slug) {
      const conflict = await Reference.findOne({ slug, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(409).json({ message: `Slug "${slug}" is already used by another reference` });
      }
    }

    let data: any = {
      slug, title, description, metaTitle, metaDescription, content,
      city, state, country,
      keywords, ogImage, canonical, robots, focusKeyword, noIndex,
      faqs: faqs || [],
      service,
      relatedReferences: relatedReferences || [],
      status, order,
    };

    // Only auto-fill if the fields are explicitly empty (not just undefined)
    if (metaTitle === "" || metaTitle === undefined) {
      data.metaTitle = metaTitle; // keep empty to let auto-fill run
    }
    if (metaDescription === "" || metaDescription === undefined) {
      data.metaDescription = metaDescription;
    }
    if (canonical === "" || canonical === undefined) {
      data.canonical = canonical;
    }

    data = autoFillSeo(data);

    const updated = await Reference.findByIdAndUpdate(
      req.params.id,
      data,
      { returnDocument: 'after', runValidators: true }
    )
      .populate("service")
      .populate("relatedReferences", "title slug city");

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
