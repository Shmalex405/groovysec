import { Resend } from "resend";
import { FastifyInstance } from "fastify";

const resend = new Resend(process.env.RESEND_API_KEY);

export function registerContactRoute(server: FastifyInstance) {
  server.post("/api/contact", async (req, reply) => {
    const {
      firstName,
      lastName,
      email,
      company,
      role,
      companySize,
      useCase,
      currentAIUsage,
    } = req.body as {
      firstName: string;
      lastName: string;
      email: string;
      company: string;
      role: string;
      companySize: string;
      useCase: string;
      currentAIUsage: string[];
    };

    const { data, error } = await resend.emails.send({
      from: "Whiteout AI <alex@groovysec.com>", // ✅ This domain must be verified in Resend
      to: ["alex@groovysec.com", "joel@groovysec.com"],
      subject: "New Demo Request - Whiteout AI",
      text: `
New Contact Request

Name: ${firstName} ${lastName}
Email: ${email}
Company: ${company}
Role: ${role}
Company Size: ${companySize}
Current AI Usage: ${currentAIUsage.join(", ")}
Primary Use Case:
${useCase}
      `.trim(),
    });

    if (error) {
      console.error("❌ Email error:", error);
      return reply.status(500).send({ success: false, error });
    }

    return reply.send({ success: true, data });
  });
}