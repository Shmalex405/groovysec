// Data-driven copy for the Solutions scope pages. Each entry is rendered by the
// shared <SolutionPage /> template (solution-page.tsx). Metrics intentionally
// mirror the vetted figures used elsewhere on the site (60+ policies / 9 domains /
// >99% benchmark accuracy) — no new product claims are introduced here.

export type SolutionStat = { value: string; label: string };

export type SolutionValueProp = {
  title: string;
  items: string[];
};

export type SolutionData = {
  slug: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  headline: { lead: string; gradient: string; tail: string };
  intro: string;
  ctaLabel: string;
  stats: SolutionStat[];
  valuePropsHeading: string;
  valuePropsSubheading: string;
  valueProps: SolutionValueProp[];
};

// Shared by every Whiteout AI solution scope — already vetted on the Government page.
const WHITEOUT_STATS: SolutionStat[] = [
  { value: "60+", label: "Pre-Built Policies" },
  { value: ">99%", label: "Benchmark Accuracy" },
  { value: "9", label: "Policy Domains" },
  { value: "<320ms", label: "Evaluation Latency (P95)" },
];

export const SOLUTIONS: Record<string, SolutionData> = {
  "data-loss-prevention": {
    slug: "data-loss-prevention",
    eyebrow: "Solutions — Data Loss Prevention",
    metaTitle: "AI Data Loss Prevention — Whiteout AI",
    metaDescription:
      "Stop source code, customer records, and confidential data from reaching public AI tools. Whiteout AI inspects every AI interaction in real time and blocks sensitive data before it leaves your network.",
    headline: {
      lead: "Stop Sensitive Data",
      gradient: "Before It Reaches",
      tail: "Public AI",
    },
    intro:
      "Your employees paste source code, customer records, and confidential documents into ChatGPT, Copilot, and Claude every day. Whiteout AI inspects every AI interaction in real time — blocking sensitive data before it ever leaves your network, without slowing legitimate work down.",
    ctaLabel: "See It Intercept Live",
    stats: WHITEOUT_STATS,
    valuePropsHeading: "Data Loss Prevention for the AI Era",
    valuePropsSubheading:
      "Traditional DLP never sees the prompt box. Whiteout AI inspects the AI interaction itself — across every surface your team uses.",
    valueProps: [
      {
        title: "Real-Time Interception",
        items: [
          "Inspects prompts, pastes, and file uploads before they reach any AI provider",
          "Blocks, redacts, or warns based on your policy — never fails open",
          "Catches drag-drop, paste, and attachment uploads at the moment of action",
          "Generates compliant, redacted alternatives so work keeps moving",
        ],
      },
      {
        title: "Contextual Detection",
        items: [
          "Full-LLM evaluation understands context, not just keyword patterns",
          'Distinguishes "aggregate statistics" from actual customer or patient data',
          "60+ pre-built policies across 9 domains (PHI, PII, GDPR, code/IP, finance)",
          "Calibrated for low false positives so legitimate prompts pass through",
        ],
      },
      {
        title: "Coverage Everywhere",
        items: [
          "Browser extension for Chrome, Firefox, Edge, and Safari",
          "Desktop guard for macOS and Windows native AI apps",
          "IDE coverage for Claude Code, GitHub Copilot, and Cursor",
          "Cloud, MCP tool access control, and isolated internal AI workspace",
        ],
      },
      {
        title: "Audit & Proof",
        items: [
          "Immutable audit trail of every AI interaction across the organization",
          "SIEM/SOC integration — Splunk, Sentinel, Elastic, QRadar, S3",
          "Exportable reports (PDF/CSV) for security and compliance review",
          "Per-user and per-department risk scoring and usage analytics",
        ],
      },
    ],
  },

  compliance: {
    slug: "compliance",
    eyebrow: "Solutions — Regulated Industries & Compliance",
    metaTitle: "AI Compliance for Regulated Industries — Whiteout AI",
    metaDescription:
      "HIPAA, GDPR, FERPA, SOX, PCI-DSS — adopt AI in regulated industries with proof of control. Whiteout AI enforces 60+ pre-built policies across 9 domains and produces an audit-ready record of every AI interaction.",
    headline: {
      lead: "Prove AI Compliance",
      gradient: "in Regulated",
      tail: "Industries",
    },
    intro:
      "HIPAA, GDPR, FERPA, SOX, PCI-DSS — regulated organizations can't adopt AI without proof of control. Whiteout AI enforces 60+ pre-built policies across 9 domains and produces an audit-ready record of every AI interaction, so you can move fast on AI while staying inside the lines.",
    ctaLabel: "Schedule a Compliance Briefing",
    stats: WHITEOUT_STATS,
    valuePropsHeading: "Compliance That Keeps Pace with AI Adoption",
    valuePropsSubheading:
      "Proof of control, not just a policy document. Whiteout AI enforces your obligations at the moment of every AI interaction — and records it.",
    valueProps: [
      {
        title: "Regulatory Coverage",
        items: [
          "HIPAA, GDPR, FERPA, SOX, and PCI-DSS policy enforcement out of the box",
          "60+ pre-built policies across 9 domains, extensible to your requirements",
          "Request custom policies tailored to organization-specific obligations",
          "Group-based policy assignment for department-level control",
        ],
      },
      {
        title: "Audit-Ready Evidence",
        items: [
          "Immutable audit trail for every AI interaction",
          "Exportable compliance reports (PDF/CSV) for auditors and regulators",
          "Proof-of-control documentation for regulatory review",
          "Complete searchable audit log with filtering and export",
        ],
      },
      {
        title: "Data Sovereignty",
        items: [
          "Real-time DLP blocks sensitive data before it reaches AI providers",
          "Cloud, self-hosted, or hybrid deployment options",
          "Self-hosted inference keeps sensitive prompts inside your network boundary",
          "Fail-safe design — never blocks due to a technical failure",
        ],
      },
      {
        title: "Enterprise Administration",
        items: [
          "SSO/SAML 2.0 — Okta, Azure AD, OneLogin, Ping Identity",
          "MDM integration — Intune, Jamf, Workspace ONE",
          "SIEM/SOC integration — Splunk, Sentinel, Elastic, QRadar, S3",
          "Role-based access control with department-level scoping",
        ],
      },
    ],
  },
};

export function getSolution(slug: string | undefined): SolutionData | undefined {
  if (!slug) return undefined;
  return SOLUTIONS[slug];
}
