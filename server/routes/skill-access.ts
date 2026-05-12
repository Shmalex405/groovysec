import { Router } from "express";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : undefined;

interface SkillAccessRequest {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  notes?: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

const isEmail = (v: string | undefined) =>
  !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const escapeHtml = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

router.post("/", async (req, res) => {
  const {
    firstName = "",
    lastName = "",
    email = "",
    company = "",
    notes = "",
    acceptedTerms = false,
    acceptedPrivacy = false,
  } = (req.body || {}) as Partial<SkillAccessRequest>;

  if (!firstName.trim() || !lastName.trim() || !isEmail(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide first name, last name, and a valid email address.",
    });
  }

  if (!acceptedTerms || !acceptedPrivacy) {
    return res.status(400).json({
      success: false,
      error: "You must accept the Terms of Service and Privacy Policy to request access.",
    });
  }

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const safeCompany = (company || "").trim() || "—";
  const safeNotes = (notes || "").trim() || "—";

  const text = `
New Groovy Skills access request from groovysec.com 🎟️

👤 Name: ${fullName}
📧 Email: ${email}
🏢 Company: ${safeCompany}
📝 Notes: ${safeNotes}

✅ Accepted Terms of Service
✅ Accepted Privacy Policy

Next step: confirm payment and grant repo access.
  `.trim();

  res.status(201).json({ success: true });

  ;(async () => {
    try {
      if (!resend) {
        throw new Error(
          "RESEND_API_KEY is missing. Skipping email send for /api/skill-access."
        );
      }

      const emailResponse = await resend.emails.send({
        from: "GroovySec <noreply@groovysec.com>",
        to: ["alex@groovysec.com"],
        subject: `🎟️ New Groovy Skills access request — ${fullName}`,
        text,
        html: `
          <h2>New Groovy Skills access request 🎟️</h2>
          <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(safeCompany)}</p>
          <p><strong>Notes:</strong> ${escapeHtml(safeNotes)}</p>
          <hr />
          <p>✅ Accepted Terms of Service</p>
          <p>✅ Accepted Privacy Policy</p>
          <p><em>Next step: confirm payment and grant repo access.</em></p>
        `,
        ...(isEmail(email) ? { replyTo: email } : {}),
      });

      console.log("✅ Skill access email queued/sent:", emailResponse);
    } catch (err: any) {
      console.error("❌ Skill access email send failed:", {
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
