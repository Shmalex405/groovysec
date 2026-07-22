#!/usr/bin/env node
/**
 * Builds the site for GitHub Pages deployment into docs/.
 *
 * Replaces the old build:docs shell one-liner. Steps:
 *   1. Build the documentation subsite (documentation/ -> lands in dist/public/docs)
 *   2. Build the main site (vite -> dist/public)
 *   3. Wipe docs/ and copy the fresh build in (preserving CNAME)
 *   4. Create a per-route folder with an index.html whose <title>/meta/OG tags
 *      are rewritten for that route (crawler-visible SEO for the SPA)
 *   5. Copy docs/index.html to 404.html (SPA fallback) and fan out the
 *      documentation subsite's index.html to its known routes
 *   6. Generate sitemap.xml and robots.txt
 *
 * Keep ROUTES in sync with client/src/App.tsx and each page's usePageMeta call.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "docs");
const DIST_PUBLIC = path.join(ROOT, "dist", "public");
const ORIGIN = "https://groovysec.com";

const SITE_NAME = "Groovy Security";
const DEFAULT_TITLE = "Groovy Security - Securing AI, Automating Security";

/** Marketing routes — path, title (suffixed with site name), description. */
const ROUTES = [
  {
    path: "/",
    title: DEFAULT_TITLE,
    description:
      "Groovy Security builds Whiteout AI (enterprise AI governance), Maestro (AI-driven penetration testing), and Secure AI Skills. Govern AI usage, prove compliance, and validate your defenses.",
  },
  {
    path: "/whiteout-ai",
    title: `Whiteout AI — Enterprise AI Governance | ${SITE_NAME}`,
    description:
      "Intercept and govern every AI interaction across browser, desktop, IDE, infrastructure, and cloud. A full 27B-parameter LLM compliance engine with 60+ policies across 9 domains and greater than 99% benchmark accuracy.",
  },
  {
    path: "/maestro",
    title: `Maestro — AI-Driven Penetration Testing | ${SITE_NAME}`,
    description:
      "Maestro deploys 21 specialized AI agents with 213 MCP tools through a 232-test assessment matrix — autonomous red team exploitation across web, API, cloud, Kubernetes, identity providers, and AI/LLM systems with proof of impact.",
  },
  // TEMP: Skills page unpublished 2026-07-16 — excluded from docs build + sitemap; restore to relist.
  // {
  //   path: "/skills",
  //   title: `Secure AI Skills | ${SITE_NAME}`,
  //   description:
  //     "111 production-grade, security-audited skills for AI agents across 14 categories — OWASP ASI Top 10 audited, zero external dependencies, lifetime access.",
  // },
  // {
  //   path: "/skills/success",
  //   title: `Request Received — Secure AI Skills | ${SITE_NAME}`,
  //   description:
  //     "Your Secure AI Skills access request has been received. We'll email you payment and repository access instructions shortly.",
  // },
  {
    path: "/whiteout-ai/government",
    title: `Whiteout AI for Government & Public Sector | ${SITE_NAME}`,
    description:
      "AI governance built for the public sector — 60+ pre-built policies across 9 domains, greater than 99% benchmark accuracy, SSO/MDM/SIEM integration, and audit-ready proof of every AI control.",
  },
  {
    path: "/whiteout-ai/academic-integrity",
    title: `Whiteout AI for Academic Integrity | ${SITE_NAME}`,
    description:
      "AI governance for education — intercept academic integrity violations in real time while preserving AI as a learning resource. 99.21% accuracy on 1,007 education benchmark prompts, built for FERPA.",
  },
  {
    path: "/whiteout-ai/security-whitepaper",
    title: `Whiteout AI Security Whitepaper | ${SITE_NAME}`,
    description:
      "How Whiteout AI enables safe enterprise adoption of generative AI — 60+ policies across 9 compliance domains, 99.59% validated accuracy on the public compliance benchmark, prompt-injection defense for agentic AI, MCP governance, and security-first architecture.",
  },
  {
    path: "/about",
    title: `About | ${SITE_NAME}`,
    description:
      "Groovy Security was founded in 2025 by cybersecurity professionals to close the critical gaps in AI governance and security testing — with offices in Utah and Ireland.",
  },
  {
    path: "/demo",
    title: `Request a Demo | ${SITE_NAME}`,
    description:
      "Schedule a personalized demo of Whiteout AI, Maestro, or Secure AI Skills — a 30-minute walkthrough tailored to your stack and compliance requirements.",
  },
  {
    path: "/download",
    title: `Download Whiteout AI | ${SITE_NAME}`,
    description:
      "Download Whiteout AI for macOS and Windows, plus Desktop Guard, browser extensions for Chrome and Firefox, and IDE extensions for VS Code and JetBrains.",
  },
  {
    path: "/partners",
    title: `Partners | ${SITE_NAME}`,
    description:
      "Partner with Groovy Security — reseller, referral, and technology partnerships for Whiteout AI and Maestro.",
  },
  {
    path: "/contact",
    title: `Contact | ${SITE_NAME}`,
    description:
      "Get in touch with Groovy Security — sales and demos, partnerships, or product support. Offices in Utah, US and Ireland, EU.",
  },
  {
    path: "/resources",
    title: `News & Research | ${SITE_NAME}`,
    description:
      "News and research from Groovy Security — NVIDIA Inception membership, the public 15,915-prompt Whiteout AI compliance benchmark, and our audit of community AI skill security.",
  },
  {
    path: "/security",
    title: `Trust & Security | ${SITE_NAME}`,
    description:
      "How Groovy Security secures its own products — SOC 2 Type II in progress, encryption in transit and at rest, isolated per-customer deployments, audit logging, and a 48-hour critical patch commitment.",
  },
  {
    path: "/terms-of-service",
    title: `Terms of Service | ${SITE_NAME}`,
    description: "Terms of Service for Groovy Security's website, products, and Secure AI Skills.",
  },
  {
    path: "/privacy-policy",
    title: `Privacy Policy | ${SITE_NAME}`,
    description: "How Groovy Security collects, uses, and protects your personal data.",
  },
];

/**
 * Documentation subsite routes (client-rendered; fan out its own index.html).
 * Derived from documentation/public/content so new guides are picked up
 * automatically: content/<category>/<slug>.md -> docs/admin-guides/<category>/<slug>.
 */
const CONTENT_DIR = path.join(ROOT, "documentation", "public", "content");

function docRoutes() {
  const routes = ["docs/admin-guides", "docs/admin-guides/overview"];
  if (!fs.existsSync(CONTENT_DIR)) return routes;
  for (const entry of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(CONTENT_DIR, entry.name))) {
      if (file.endsWith(".md")) {
        routes.push(`docs/admin-guides/${entry.name}/${file.slice(0, -3)}`);
      }
    }
  }
  return routes;
}

const DOC_ROUTES = docRoutes();

/**
 * Blog routes, derived from the Markdown posts in client/src/content/blog.
 * Mirrors the frontmatter parser in client/src/lib/blog.ts — each post gets a
 * crawler-visible /blog/<slug> HTML page and a sitemap entry. Keep the two
 * parsers in sync if the frontmatter format changes.
 */
const BLOG_DIR = path.join(ROOT, "client", "src", "content", "blog");

function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (m) data[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return data;
}

function blogRoutes() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const posts = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const fm = parseFrontmatter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8"));
      const slug = fm.slug || f.replace(/\.md$/, "");
      return {
        path: `/blog/${slug}`,
        title: `${fm.title || slug} | ${SITE_NAME}`,
        description: fm.excerpt || `${fm.title || slug} — from the Groovy Security blog.`,
      };
    });
  return [
    {
      path: "/blog",
      title: `Blog | ${SITE_NAME}`,
      description:
        "Insights on AI governance, compliance, and offensive security from the Groovy Security team — engineering deep dives, research, and product news.",
    },
    ...posts,
  ];
}

ROUTES.push(...blogRoutes());

function run(cmd, cwd) {
  console.log(`\n$ ${cmd}${cwd ? `  (in ${path.relative(ROOT, cwd) || "."})` : ""}`);
  execSync(cmd, { cwd: cwd ?? ROOT, stdio: "inherit" });
}

function escapeAttr(s) {
  return s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

/** Rewrite title/description/OG/Twitter/canonical in the built index.html. */
function injectMeta(html, route) {
  const url = `${ORIGIN}${route.path === "/" ? "/" : route.path}`;
  const title = escapeAttr(route.title);
  const description = escapeAttr(route.description);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${description}"`
    )
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${url}"`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${title}"`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${description}"`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${url}"`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${title}"`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${description}"`
    );
}

function buildSitemap() {
  const locs = [
    ...ROUTES.filter((r) => r.path !== "/skills/success").map(
      (r) => `${ORIGIN}${r.path === "/" ? "/" : r.path}`
    ),
    `${ORIGIN}/docs`,
    ...DOC_ROUTES.map((r) => `${ORIGIN}/${r}`),
  ];
  const urls = locs
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// ── 1. Builds ──────────────────────────────────────────────────────────
run("npm install", path.join(ROOT, "documentation"));
run("npm run build", path.join(ROOT, "documentation"));
run("npm run build");

// ── 2. Refresh docs/ from dist/public (preserve CNAME) ─────────────────
const cname = fs.existsSync(path.join(DOCS, "CNAME"))
  ? fs.readFileSync(path.join(DOCS, "CNAME"), "utf8")
  : "groovysec.com\n";

fs.rmSync(DOCS, { recursive: true, force: true });
fs.cpSync(DIST_PUBLIC, DOCS, { recursive: true });
fs.writeFileSync(path.join(DOCS, "CNAME"), cname);

// ── 3. Per-route folders with injected meta ────────────────────────────
const baseHtml = fs.readFileSync(path.join(DOCS, "index.html"), "utf8");

for (const route of ROUTES) {
  const html = injectMeta(baseHtml, route);
  if (route.path === "/") {
    fs.writeFileSync(path.join(DOCS, "index.html"), html);
  } else {
    const dir = path.join(DOCS, route.path.slice(1));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  }
}

// SPA fallback (default meta)
fs.writeFileSync(path.join(DOCS, "404.html"), baseHtml);

// ── 4. Documentation subsite route fan-out ─────────────────────────────
const docIndexPath = path.join(DOCS, "docs", "index.html");
if (fs.existsSync(docIndexPath)) {
  const docHtml = fs.readFileSync(docIndexPath, "utf8");
  for (const docRoute of DOC_ROUTES) {
    const dir = path.join(DOCS, docRoute);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), docHtml);
  }
} else {
  console.warn("WARN: docs/docs/index.html not found — skipping documentation route fan-out");
}

// ── 5. sitemap.xml + robots.txt ────────────────────────────────────────
fs.writeFileSync(path.join(DOCS, "sitemap.xml"), buildSitemap());
fs.writeFileSync(
  path.join(DOCS, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`
);

console.log(`\n✓ docs/ built: ${ROUTES.length} routes with per-route meta, sitemap.xml, robots.txt`);
