import { Router } from "express";
import { Resend } from "resend";
import dotenv from "dotenv";
import { storage } from "../storage";
import { insertReviewSchema } from "@shared/schema";

dotenv.config();

const router = Router();

// Initialize Resend (may be undefined if the key is missing)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : undefined;

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

router.post("/", async (req, res) => {
  const body = (req.body || {}) as Record<string, unknown>;

  // 🪤 Honeypot: real users never see/fill the "website" field — bots do.
  // Pretend success, store nothing, send nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return res.status(201).json({ success: true });
  }

  // Validate with the shared Zod schema (same shape as the DB row).
  const parsed = insertReviewSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message;
    return res.status(400).json({
      success: false,
      error: firstIssue || "Please check the form and try again.",
    });
  }

  const data = parsed.data;

  // 💾 Persist as a pending review. If the DB write fails we still email it
  // below, so a genuine review is never lost.
  let stored = false;
  try {
    await storage.createReview(data);
    stored = true;
  } catch (err: any) {
    console.error("❌ Review DB write failed:", {
      message: err?.message,
      name: err?.name,
    });
  }

  // ✅ Respond immediately — never block the user on the email vendor or DB.
  res.status(201).json({ success: true });

  // 🔔 Fire-and-forget the notification email; log any errors.
  ;(async () => {
    try {
      if (!resend) {
        throw new Error("RESEND_API_KEY is missing. Skipping review email.");
      }

      const company = (data.company || "").trim() || "—";
      const experienceText =
        Array.isArray(data.experience) && data.experience.length
          ? data.experience.join(", ")
          : "None selected";

      const statusLine = stored
        ? "Saved as pending — approve before using it publicly."
        : "⚠️ NOT saved to the database — keep this email as the record.";

      const subject = stored
        ? "📝 New Review — pending approval"
        : "📝 New Review — ⚠️ DB SAVE FAILED (copy below)";

      const text = `
New review submitted on groovysec.com

Status: ${statusLine}

Name: ${data.name}
Job title: ${data.jobTitle}
Company: ${company}
Email: ${data.email}
Experience: ${experienceText}

Review:
${data.review}
      `.trim();

      const html = `
        <h2>New review submitted on groovysec.com 📝</h2>
        <p style="padding:8px 12px;border-radius:6px;font-weight:600;background:${
          stored ? "#ecfdf5" : "#fef2f2"
        };color:${stored ? "#065f46" : "#991b1b"};">${statusLine}</p>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Job title:</strong> ${escapeHtml(data.jobTitle)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Experience:</strong> ${escapeHtml(experienceText)}</p>
        <p><strong>Review:</strong></p>
        <blockquote style="border-left:3px solid #cbd5e1;margin:0;padding:4px 0 4px 14px;color:#0f172a;white-space:pre-wrap;">${escapeHtml(
          data.review
        )}</blockquote>
      `;

      const emailResponse = await resend.emails.send({
        from: "GroovySec <noreply@groovysec.com>", // verified sender
        to: ["alex@groovysec.com"],
        subject,
        text,
        html,
        replyTo: data.email,
      });

      console.log("✅ Review email queued/sent:", emailResponse);
    } catch (err: any) {
      console.error("❌ Review email failed:", {
        message: err?.message,
        name: err?.name,
        stack: err?.stack,
      });
    }
  })().catch(() => {
    /* already logged */
  });
});

export default router;
