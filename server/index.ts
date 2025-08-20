import * as dotenv from "dotenv";
dotenv.config();
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";        // GET /api/leads + createServer
import { setupVite, serveStatic, log } from "./vite";
import leadsRouter from "./routes/leads";        // ✅ POST /api/leads lives here

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
  let captured: any;
  // Bind to keep the correct `this`
  const origJson = res.json.bind(res) as (body?: any) => Response;

  res.json = (body?: any) => {
    captured = body;
    return origJson(body);
  };
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      let line = `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (captured) {
        try { line += ` :: ${JSON.stringify(captured)}`; } catch {}
      }
      if (line.length > 250) line = line.slice(0, 249) + "…";
      log(line);
    }
  });
  next();
});

/** ✅ Mount the ONLY POST /api/leads route */
app.use("/api/leads", leadsRouter);

(async () => {
  /** Register remaining routes (GET /api/leads) and get the server */
  const server = await registerRoutes(app);

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