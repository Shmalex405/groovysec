import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health (optional if you already have one in index.ts)
  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });

  // ✅ Only GET here. POST /api/leads is handled by routes/leads.ts
  app.get("/api/leads", async (_req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json({ success: true, leads });
    } catch (error) {
      console.error("❌ Fetch leads error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch leads" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}