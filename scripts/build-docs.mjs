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
      "Intercept and govern every AI interaction across browser, desktop, IDE, infrastructure, and cloud. A full 27B-parameter LLM compliance engine with 60+ policies across 9 domains and 99.19% benchmark accuracy.",
  },
  {
    path: "/maestro",
    title: `Maestro — AI-Driven Penetration Testing | ${SITE_NAME}`,
    description:
      "Maestro deploys 21 specialized AI agents with 213 MCP tools through a 232-test assessment matrix — autonomous red team exploitation across web, API, cloud, Kubernetes, identity providers, and AI/LLM systems with proof of impact.",
  },
  {
    path: "/skills",
    title: `Secure AI Skills | ${SITE_NAME}`,
    description:
      "111 production-grade, security-audited skills for AI agents across 14 categories — OWASP ASI Top 10 audited, zero external dependencies, lifetime access.",
  },
  {
    path: "/skills/success",
    title: `Request Received — Secure AI Skills | ${SITE_NAME}`,
    description:
      "Your Secure AI Skills access request has been received. We'll email you payment and repository access instructions shortly.",
  },
  {
    path: "/whiteout-ai/government",
    title: `Whiteout AI for Government & Public Sector | ${SITE_NAME}`,
    description:
      "AI governance built for the public sector — 60+ pre-built policies across 9 domains, 99.19% benchmark accuracy, SSO/MDM/SIEM integration, and audit-ready proof of every AI control.",
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
      "How Whiteout AI enables safe enterprise adoption of generative AI — 60+ policies across 9 compliance domains, 99.19% accuracy on a 15,915-prompt public benchmark, and security-first architecture.",
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

/** Documentation subsite routes (client-rendered; fan out its own index.html). */
const DOC_ROUTES = [
  "docs/admin-guides",
  "docs/admin-guides/overview",
  "docs/admin-guides/integrations/github",
  "docs/admin-guides/integrations/confluence",
  "docs/admin-guides/integrations/jira",
  "docs/admin-guides/integrations/notion",
  "docs/admin-guides/integrations/slack",
  "docs/admin-guides/integrations/microsoft-teams",
  "docs/admin-guides/integrations/google-drive",
  "docs/admin-guides/integrations/trello",
  "docs/admin-guides/integrations/linear",
  "docs/admin-guides/integrations/asana",
  "docs/admin-guides/integrations/sharepoint",
  "docs/admin-guides/integrations/custom-integration",
  "docs/admin-guides/sso-providers/microsoft-entra-id",
  "docs/admin-guides/sso-providers/okta",
  "docs/admin-guides/sso-providers/google-workspace",
  "docs/admin-guides/sso-providers/onelogin",
  "docs/admin-guides/sso-providers/ping-identity",
  "docs/admin-guides/sso-providers/jumpcloud",
  "docs/admin-guides/sso-providers/auth0",
  "docs/admin-guides/sso-providers/generic-oidc",
  "docs/admin-guides/sso-providers/generic-saml",
  "docs/admin-guides/soc-destinations/webhook",
  "docs/admin-guides/soc-destinations/splunk-hec",
  "docs/admin-guides/soc-destinations/azure-sentinel",
  "docs/admin-guides/soc-destinations/elasticsearch",
  "docs/admin-guides/soc-destinations/ibm-qradar",
  "docs/admin-guides/soc-destinations/aws-s3",
  "docs/admin-guides/mdm-providers/microsoft-intune",
  "docs/admin-guides/mdm-providers/jamf",
  "docs/admin-guides/mdm-providers/vmware-workspace-one",
  "docs/admin-guides/mdm-providers/kandji",
  "docs/admin-guides/mdm-providers/mosyle",
];

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
  const urls = ROUTES.filter((r) => r.path !== "/skills/success")
    .map(
      (r) => `  <url>\n    <loc>${ORIGIN}${r.path === "/" ? "/" : r.path}</loc>\n  </url>`
    )
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
