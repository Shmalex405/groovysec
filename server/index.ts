import * as dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";        // createServer
import { setupVite, serveStatic, log } from "./vite";
import leadsRouter from "./routes/leads";        // ✅ POST /api/leads lives here
import skillAccessRouter from "./routes/skill-access"; // ✅ POST /api/skill-access
import reviewsRouter from "./routes/reviews";     // ✅ POST /api/reviews

const app = express();

/** CORS */
app.use(
  cors({
    origin: ["https://groovysec.com", "https://www.groovysec.com"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

/** Health */
app.get("/healthz", (_req, res) =>
  res.status(200).json({ status: "ok", uptime: process.uptime() })
);

/** Body parsing */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** API logging (before routes) */
app.use((req, res, next) => {
  const start = Date.now();
  // Method, path, status and timing only: response bodies can hold form data.
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`);
    }
  });
  next();
});

/** ✅ Mount the ONLY POST /api/leads route */
app.use("/api/leads", leadsRouter);
app.use("/api/skill-access", skillAccessRouter);
app.use("/api/reviews", reviewsRouter);

(async () => {
  /** Register remaining routes and get the server */
  const server = await registerRoutes(app);

  /** Unknown API paths get a JSON 404 instead of falling through to the SPA */
  app.use("/api", (_req, res) => {
    res.status(404).json({ success: false, error: "Not found" });
  });

  /** Error handler */
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    console.error("Unhandled error:", err);
    res.status(status).json({ message });
  });

  /** Vite vs static */
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