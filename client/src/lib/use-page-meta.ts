import { useEffect } from "react";

const SITE_NAME = "Groovy Security";
const DEFAULT_TITLE = "Groovy Security - Securing AI, Automating Security";
const DEFAULT_DESCRIPTION =
  "Groovy Security builds Whiteout AI (enterprise AI governance), Maestro (AI-driven penetration testing), and Secure AI Skills. Govern AI usage, prove compliance, and validate your defenses.";

function setMeta(selector: string, attribute: string, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.setAttribute(attribute, content);
}

/**
 * Updates document.title and description/OG/Twitter meta on client-side
 * navigation. Crawler-visible meta is injected per-route at build time by
 * scripts/build-docs.mjs — keep titles/descriptions in sync with its
 * route manifest.
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", `https://groovysec.com${window.location.pathname}`);

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://groovysec.com${window.location.pathname}`;
  }, [title, description]);
}
