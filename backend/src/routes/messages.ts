import express from "express";
import { Message } from "../models/Message";
import { protect } from "../middlewares/authMiddleware";
import { sendContactConfirmation } from "../utils/mailer";

const router = express.Router();

// ─── POST /api/messages ────────────────────────────
// Public: submit a contact form message
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, service, description } = req.body;

    if (!name || !email || !service || !description) {
      return res.status(400).json({ message: "name, email, service, and description are required" });
    }

    const message = new Message({
      name,
      email,
      phone: phone || "",
      company: company || "",
      service,
      description,
    });

    await message.save();

    // ─── Send confirmation email (non-blocking) ───────────────────────
    sendContactConfirmation(email, name, service, company || "").catch((mailErr) => {
      console.error("⚠️  Failed to send contact confirmation email:", mailErr);
    });

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// ─── GET /api/messages ─────────────────────────────
// Protected: list all messages
router.get("/", protect, async (_req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("GET /api/messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// ─── PUT /api/messages/:id/status ──────────────────
// Protected: update message status (read/unread/archived)
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["unread", "read", "archived"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Message not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update message status" });
  }
});

// ─── DELETE /api/messages/:id ──────────────────────
// Protected: delete a message
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

export default router;
