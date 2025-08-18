import * as nodemailer from "nodemailer";
import { FastifyInstance } from "fastify";

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

    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"GroovySec Contact" <${process.env.EMAIL_USER}>`,
      to: "alex@groovysec.com, joel@groovysec.com",// or wherever you want to receive form responses
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
      `,
    };

    await transporter.sendMail(mailOptions);

    return reply.send({ success: true });
  });
}