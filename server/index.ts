import * as dotenv from "dotenv";
dotenv.config();
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// CORS first
app.use(
  cors({
    origin: ["https://groovysec.com", "https://www.groovysec.com"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// Health
app.get("/healthz", (_req, res) =>
  res.status(200).json({ status: "ok", uptime: process.uptime() })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🔎 Move logging BEFORE routes so it catches them
app.use((req, res, next) => {
  const start = Date.now();
  let captured: any;
  const orig = res.json;
  res.json = function (body: any, ...args: any[]) {
    captured = body;
    // @ts-ignore
    return orig.apply(this, [body, ...args]);
  };
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      let line = `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (captured) {
        try {
          line += ` :: ${JSON.stringify(captured)}`;
        } catch {}
      }
      if (line.length > 250) line = line.slice(0, 249) + "…";
      log(line);
    }
  });
  next();
});

// ✅ Register the *only* API routes (this defines /api/leads)
(async () => {
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Unhandled error:", err);
    res.status(status).json({ message });
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    { port, host: "0.0.0.0", reusePort: true },
    () => {
      log(`🚀 Server running on port ${port}`);
      log(`✅ Healthcheck at /healthz`);
    }
  );
})();