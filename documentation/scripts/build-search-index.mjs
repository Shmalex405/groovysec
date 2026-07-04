#!/usr/bin/env node
/**
 * Generates public/search-index.json from the markdown under public/content.
 * Runs as part of `npm run build` — the docs app's ⌘K search fetches
 * this index at runtime.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");
const OUT = path.join(ROOT, "public", "search-index.json");

// Human section labels per content directory (keep in sync with src/lib/navigation.ts).
const SECTIONS = {
  "": "Getting Started",
  deployment: "Deployment",
  "whiteout-ai-connector": "Whiteout AI Connector",
  integrations: "Data Integrations",
  "sso-providers": "SSO & Identity",
  "soc-destinations": "SOC/SIEM Destinations",
  "mdm-providers": "MDM Providers",
  security: "Security & Encryption",
  developers: "Developers",
};

function plainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/^#{1,6}\s+/gm, "") // heading markers
    .replace(/^[-*+]\s+/gm, "") // list markers
    .replace(/[|*_>#]/g, " ") // table pipes, emphasis, quotes
    .replace(/\s+/g, " ")
    .trim();
}

function indexFile(category, file) {
  const raw = fs.readFileSync(file, "utf8");
  const slug = path.basename(file, ".md");
  const title = (/^#\s+(.+)$/m.exec(raw)?.[1] ?? slug).replace(/[*_`]/g, "").trim();
  const headings = [...raw.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) =>
    m[1].replace(/[*_`]/g, "").trim()
  );
  const href = category ? `/admin-guides/${category}/${slug}` : `/admin-guides/${slug}`;
  return {
    title,
    section: SECTIONS[category] ?? category,
    href,
    headings,
    body: plainText(raw).slice(0, 6000),
  };
}

const docs = [];
for (const entry of fs.readdirSync(CONTENT, { withFileTypes: true })) {
  const full = path.join(CONTENT, entry.name);
  if (entry.isFile() && entry.name.endsWith(".md")) {
    docs.push(indexFile("", full));
  } else if (entry.isDirectory()) {
    for (const file of fs.readdirSync(full)) {
      if (file.endsWith(".md")) docs.push(indexFile(entry.name, path.join(full, file)));
    }
  }
}

fs.writeFileSync(OUT, JSON.stringify(docs));
console.log(`search-index.json: ${docs.length} docs indexed`);
