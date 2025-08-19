import { Router } from "express";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

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

router.post("/", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    company,
    role,
    companySize,
    aiUsage,
    useCase,
  }: LeadRequest = req.body;

  try {
    const fullName = `${firstName} ${lastName}`;
    const aiUsageText = aiUsage?.length ? aiUsage.join(", ") : "None provided";
    const useCaseText = useCase || "None provided";

    const message = `
New Lead Submitted from groovysec.com 🚀

👤 Name: ${fullName}
📧 Email: ${email}
🏢 Company: ${company}
🧑‍💼 Role: ${role}
👥 Company Size: ${companySize}
🤖 AI Usage Areas: ${aiUsageText}
📌 Use Case: ${useCaseText}
    `;

    const emailResponse = await resend.emails.send({
      from: "GroovySec <noreply@groovysec.com>", // use verified subdomain
      to: ["sec.groovy@gmail.com"],                    // recipient inbox
      subject: "🚨 New Demo Request from GroovySec",
      text: message,
      html: `
        <h2>New Lead Submitted from groovysec.com 🚀</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Company Size:</strong> ${companySize}</p>
        <p><strong>AI Usage Areas:</strong> ${aiUsageText}</p>
        <p><strong>Use Case:</strong> ${useCaseText}</p>
      `,
      replyTo: email, // so you can reply directly to the lead from Gmail
    });

    console.log("✅ Email sent:", emailResponse);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error sending lead notification:", error);
    return res.status(500).json({ error: "Failed to send lead email" });
  }
});

export default router;