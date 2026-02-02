import { Router } from "express";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Initialize Resend (may be undefined if the key is missing)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : undefined;

interface LeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  companySize: string;
  aiUsage: string[];
  useCase?: string;
}

const isEmail = (v: string | undefined) =>
  !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

router.post("/", async (req, res) => {
  // Pull fields defensively
  const {
    firstName = "",
    lastName = "",
    email = "",
    company = "",
    role = "",
    companySize = "",
    aiUsage = [],
    useCase = "",
  } = (req.body || {}) as Partial<LeadRequest>;

  // Minimal validation (keep it soft — we don’t want to 500 on the user)
  if (!firstName || !lastName || !company || !isEmail(email)) {
    // 400 with a helpful message
    return res.status(400).json({
      success: false,
      error:
        "Please provide first name, last name, company, and a valid email address.",
    });
  }

  // Build strings safely
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const aiUsageText =
    Array.isArray(aiUsage) && aiUsage.length
      ? aiUsage.join(", ")
      : "None provided";
  const useCaseText = (useCase || "None provided").trim();

  const message = `
New Lead Submitted from groovysec.com 🚀

👤 Name: ${fullName}
📧 Email: ${email}
🏢 Company: ${company}
🧑‍💼 Role: ${role || "—"}
👥 Company Size: ${companySize || "—"}
🤖 AI Usage Areas: ${aiUsageText}
📌 Use Case: ${useCaseText}
  `.trim();

  // ✅ Respond to the user immediately so UI never shows a 500 due to email vendor issues
  res.status(201).json({ success: true });

  // 🔔 Fire-and-forget the email send; log any errors
  ;(async () => {
    try {
      if (!resend) {
        throw new Error(
          "RESEND_API_KEY is missing. Skipping email send for /api/leads."
        );
      }

      const emailResponse = await resend.emails.send({
        from: "GroovySec <noreply@groovysec.com>", // verified sender
        to: ["alex@groovysec.com"],
        subject: "🚨 New Demo Request from GroovySec",
        text: message, // plain text fallback
        html: `
          <h2>New Lead Submitted from groovysec.com 🚀</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Role:</strong> ${role || "—"}</p>
          <p><strong>Company Size:</strong> ${companySize || "—"}</p>
          <p><strong>AI Usage Areas:</strong> ${aiUsageText}</p>
          <p><strong>Use Case:</strong> ${useCaseText}</p>
        `,
        // Only include replyTo if the email is valid
        ...(isEmail(email) ? { replyTo: email } : {}),
      });

      console.log("✅ Email queued/sent:", emailResponse);
    } catch (err: any) {
      console.error("❌ Email send failed:", {
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