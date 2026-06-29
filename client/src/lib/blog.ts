/**
 * Blog content loader.
 *
 * Posts are authored as Markdown files with YAML-ish frontmatter in
 * client/src/content/blog/*.md and bundled at build time via import.meta.glob.
 * Crawler-visible per-post meta + sitemap entries are generated separately by
 * scripts/build-docs.mjs, which parses the SAME frontmatter — keep the two
 * parsers in sync if the frontmatter format ever changes.
 */

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  role?: string;
  excerpt: string;
  tags: string[];
  category: string;
  readingTime: string;
  content: string; // markdown body
};

const rawModules = import.meta.glob("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

/** Minimal frontmatter parser: scalars, quoted strings, and inline [a, b] arrays. */
function parseFrontmatter(raw: string): { data: Record<string, string | string[]>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const [, fm, body] = match;
  const data: Record<string, string | string[]> = {};
  for (const line of fm.split(/\r?\n/)) {
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1];
    const rawValue = m[2].trim();
    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      data[key] = rawValue
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }
  return { data, body };
}

function estimateReadingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const posts: BlogPost[] = Object.entries(rawModules)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    const fileSlug = path.split("/").pop()!.replace(/\.md$/, "");
    return {
      slug: (data.slug as string) || fileSlug,
      title: (data.title as string) || fileSlug,
      date: (data.date as string) || "",
      author: (data.author as string) || "Groovy Security",
      role: data.role as string | undefined,
      excerpt: (data.excerpt as string) || "",
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags as string] : [],
      category: (data.category as string) || "News",
      readingTime: (data.readingTime as string) || estimateReadingTime(body),
      content: body.trim(),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllTags(): string[] {
  return Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
}

/** Format an ISO date as e.g. "June 29, 2026". */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}
