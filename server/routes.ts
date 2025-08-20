import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { z } from "zod";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead capture endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      // 1) Validate payload
      const leadData = insertLeadSchema.parse(req.body);

      // 2) Persist
      const lead = await storage.createLead(leadData);

      // 3) Email notify (non-blocking of storage, but we await to surface errors)
      const {
        firstName,
        lastName,
        email,
        company,
        role,
        companySize,
        aiUsage,
        useCase,
      } = leadData;

      const fullName = `${(firstName || "").trim()} ${(lastName || "").trim()}`.trim();
      const aiUsageText =
        Array.isArray(aiUsage) && aiUsage.length ? aiUsage.join(", ") : "None provided";
      const useCaseText = (useCase || "None provided").trim();

      const text = `
New Lead Submitted from groovysec.com 🚀

👤 Name: ${fullName}
📧 Email: ${email}
🏢 Company: ${company}
🧑‍💼 Role: ${role}
👥 Company Size: ${companySize}
🤖 AI Usage Areas: ${aiUsageText}
📌 Use Case: ${useCaseText}
      `.trim();

      const html = `
        <h2>New Lead Submitted from groovysec.com 🚀</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Company Size:</strong> ${companySize}</p>
        <p><strong>AI Usage Areas:</strong> ${aiUsageText}</p>
        <p><strong>Use Case:</strong> ${useCaseText}</p>
      `;

      let emailId: string | null = null;
      try {
        const emailResp = await resend.emails.send({
          from: "GroovySec <noreply@groovysec.com>", // verified root domain
          to: ["sec.groovy@gmail.com"],
          subject: "🚨 New Demo Request from GroovySec",
          text,
          html,
          replyTo: email, // reply goes to the lead
        });
        // Resend SDK returns { id?: string, ... }
        // @ts-ignore — tolerate older typings
        emailId = emailResp?.id ?? null;
        console.log("✅ Lead email sent:", emailResp);
      } catch (mailErr) {
        console.error("❌ Failed to send lead email:", mailErr);
        // We still return 201 since the lead was stored successfully
      }

      return res.status(201).json({ success: true, lead, emailId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Invalid form data",
          details: error.errors,
        });
      }
      console.error("❌ Lead submission error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to submit lead",
      });
    }
  });

  // Get all leads (for admin purposes)
  app.get("/api/leads", async (_req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json({ success: true, leads });
    } catch (error) {
      console.error("❌ Fetch leads error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch leads",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}