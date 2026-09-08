import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import { ExternalLink, ArrowRight, Calendar, MapPin, FileText, Presentation, Mail } from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";

/**
 * /talks — public companion page for Alex's conference talks: the slides,
 * the sources cited on stage, and the 30-day checklist attendees are told
 * to take home. Vendor-neutral by design (the talks are not product talks);
 * the only product mention is the single line under the speaker.
 *
 * Adding a talk: append to TALKS. Slides PDF goes in client/public/talks/.
 */

type Talk = {
  slug: string;
  title: string;
  subtitle: string;
  events: { name: string; date: string; where: string; href: string }[];
  abstract: string[];
  takeaways: string[];
  slides?: { label: string; href: string };
};

const TALKS: Talk[] = [
  {
    slug: "inside-the-house",
    title: "The Call Is Coming From Inside the House",
    subtitle: "Shadow AI and the data you're already losing",
    events: [
      {
        name: "Containerkonferansen 2026",
        date: "14–15 October 2026",
        where: "Scandic Lerkendal, Trondheim",
        href: "https://sessionize.com/containerkonferansen-2026",
      },
      {
        name: "BSides København 2026",
        date: "14 November 2026",
        where: "Bella Center, Copenhagen",
        href: "https://bsideskbh.dk/",
      },
    ],
    abstract: [
      "Your employees adopted generative AI before your security team had a policy for it. ChatGPT, Microsoft Copilot, Claude, Cursor and a thousand browser-based AI tools are already in daily use — pasted into by developers, analysts, lawyers and HR. Each prompt is a potential egress channel for source code, customer records, credentials and regulated data, and most of it is invisible to the controls you already paid for.",
      "The talk walks the real leakage surface of enterprise AI adoption — browser, desktop, IDE and coding agents, workloads, and MCP tool access — and shows concretely why each one defeats conventional egress controls, why regex and keyword matching break down against natural-language prompts, and where the regulated and air-gapped edge cases live. It closes with a discover → enforce → audit model you can start on Monday, and the two failure modes — “ban everything” and “ignore it” — that both end in data loss.",
    ],
    takeaways: [
      "Map your organisation's real AI data-egress surface across browser, desktop, IDE and cloud.",
      "Explain to leadership why existing DLP / CASB stacks have a blind spot for generative AI.",
      "Apply a discover → enforce → audit framework for AI governance starting Monday.",
      "Avoid the two failure modes — “ban everything” and “ignore it” — that both end in data loss.",
    ],
    slides: {
      label: "Download the slides (PDF)",
      href: "/talks/The_Call_Is_Coming_From_Inside_the_House.pdf",
    },
  },
];

/** The four moves from the closing section of the talk, verbatim. */
const CHECKLIST = [
  {
    week: "Week 1",
    title: "Discover",
    body: "Pull IdP consent logs (Entra “Enterprise applications” / Google “third-party app access”), DNS and proxy hits against a list of AI and model-API hosts, expense lines for AI subscriptions, MDM app and browser-extension inventory, and cluster egress to model endpoints. Run an amnesty survey and mean it. Write the footprint table: tool × surface × who × governed / ungoverned.",
  },
  {
    week: "Week 2",
    title: "Decide",
    body: "Publish a one-page AI-use policy that names the sanctioned tools and the data classes that never leave. Fix user self-consent settings in your identity provider so a green OAuth button stops being a permanent data grant.",
  },
  {
    week: "Week 3",
    title: "Nudge",
    body: "Turn on warn-mode at one surface — the browser is cheapest. No blocks yet. Watch what changes in behaviour when people see a warning at the moment of send.",
  },
  {
    week: "Week 4",
    title: "Audit",
    body: "Get one AI-usage event — who, which tool, which data class, what verdict — into the SIEM you already have. Show it to your DPO. Then review the footprint monthly, watch for new tools weekly, and revisit the policy every quarter.",
  },
];

/** Third-party sources cited on stage. */
const SOURCES = [
  {
    label: "Microsoft & LinkedIn — 2024 Work Trend Index: “AI at work is here. Now comes the hard part.”",
    href: "https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part",
  },
  {
    label: "IBM — Cost of a Data Breach Report 2025",
    href: "https://www.ibm.com/reports/data-breach",
  },
  {
    label: "Garante per la protezione dei dati personali — provisional measure on ChatGPT, 31 March 2023",
    href: "https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9870847",
  },
  {
    label: "OWASP Top 10 for LLM Applications — LLM01: Prompt Injection",
    href: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
  },
  {
    label: "Regulation (EU) 2024/1689 — the EU Artificial Intelligence Act",
    href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  },
  {
    label: "Regulation (EU) 2016/679 — GDPR (Art. 9, 28, 30, 32; Chapter V)",
    href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
  },
  {
    label: "Directive (EU) 2022/2555 — NIS2",
    href: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
  },
  {
    label: "ISO/IEC 42001:2023 — Artificial intelligence management system",
    href: "https://www.iso.org/standard/42001",
  },
  {
    label: "Model Context Protocol — specification",
    href: "https://modelcontextprotocol.io/",
  },
];

export default function Talks() {
  usePageMeta(
    "Talks",
    "Conference talks from Groovy Security: slides, sources and the take-home checklist from “The Call Is Coming From Inside the House” on shadow AI and enterprise data egress, at Containerkonferansen 2026 and BSides København 2026."
  );

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-[#0F1B2D]">
                  Talks
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg text-[#51617A] max-w-2xl mx-auto leading-relaxed">
                  Slides, sources and the take-home checklist from our conference
                  talks. Vendor-neutral by design — bring the framework home even if
                  you never bring the product.
                </p>
              </HeroLine>
            </HeroTextReveal>
          </div>
        </section>

        {/* Talk cards */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerChildren className="space-y-6">
              {TALKS.map((talk) => (
                <StaggerItem key={talk.slug}>
                  <article
                    id={talk.slug}
                    className="p-8 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 bg-[#0F1B2D]/[0.03] border border-[#0F1B2D]/10 rounded-lg flex items-center justify-center">
                        <Presentation className="w-4 h-4 text-[#51617A]" />
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold border rounded bg-[#1A5FB4]/10 text-[#1A5FB4] border-[#1A5FB4]/25">
                        CONFERENCE TALK · 35 MIN
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0F1B2D] mb-1 tracking-tight">{talk.title}</h2>
                    <p className="text-base text-[#1A5FB4] font-medium mb-6">{talk.subtitle}</p>

                    <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                      {talk.events.map((ev) => (
                        <li
                          key={ev.name}
                          className="rounded-lg border border-[#0F1B2D]/10 bg-[#0F1B2D]/[0.02] p-4"
                        >
                          <a
                            href={ev.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-[#0F1B2D] hover:text-[#1A5FB4] transition-colors inline-flex items-center"
                          >
                            {ev.name}
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-[#6E7B8C]" />
                          </a>
                          <div className="mt-2 space-y-1 text-sm text-[#51617A]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-[#6E7B8C]" />
                              {ev.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#6E7B8C]" />
                              {ev.where}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {talk.abstract.map((para) => (
                      <p key={para.slice(0, 40)} className="text-sm text-[#51617A] leading-relaxed mb-4">
                        {para}
                      </p>
                    ))}

                    <h3 className="microlabel-muted mt-6 mb-3">You'll leave able to</h3>
                    <ul className="space-y-2 mb-6">
                      {talk.takeaways.map((t) => (
                        <li key={t} className="flex gap-3 text-sm text-[#0F1B2D] leading-relaxed">
                          <span className="mt-[7px] w-2 h-2 rounded-full bg-[#1A5FB4] shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>

                    {talk.slides && (
                      <a
                        href={talk.slides.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-[#1A5FB4] hover:text-[#164F96] transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-1.5" />
                        {talk.slides.label}
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </a>
                    )}
                  </article>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* 30-day checklist */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <p className="microlabel-muted mb-3">Starting Monday</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-3 tracking-tight">
                Thirty days, four moves
              </h2>
              <p className="text-base text-[#51617A] mb-8 max-w-2xl">
                The checklist from the end of the talk. Week one is entirely reading logs you
                already have; week three is the only week that touches users, and it is a
                warning, not a block.
              </p>
            </ScrollReveal>
            <StaggerChildren className="grid sm:grid-cols-2 gap-5">
              {CHECKLIST.map((step) => (
                <StaggerItem key={step.week}>
                  <div className="h-full p-6 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]">
                    <p className="microlabel-muted mb-1">{step.week}</p>
                    <h3 className="text-xl font-bold text-[#0F1B2D] mb-3">{step.title}</h3>
                    <p className="text-sm text-[#51617A] leading-relaxed">{step.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Sources */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <p className="microlabel-muted mb-3">Cited on stage</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-6 tracking-tight">Sources</h2>
              <ul className="divide-y divide-[#0F1B2D]/10 rounded-xl border border-[#0F1B2D]/10 bg-white">
                {SOURCES.map((src) => (
                  <li key={src.href}>
                    <a
                      href={src.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-4 px-5 py-3.5 text-sm text-[#0F1B2D] hover:bg-[#0F1B2D]/[0.02] transition-colors"
                    >
                      <span className="leading-relaxed">{src.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 mt-1 shrink-0 text-[#6E7B8C]" />
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        {/* Speaker */}
        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <img
                src="/alex-flowers.jpeg"
                alt="Alex Flowers"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-5 border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]"
              />
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-3 tracking-tight">
                Want to talk it through?
              </h2>
              <p className="text-lg text-[#51617A] mb-2 max-w-xl mx-auto">
                Alex Flowers founded Groovy Security on this problem. If any of it matched your
                Tuesday, he is happy to walk through your AI footprint one-to-one — no pitch
                required.
              </p>
              <p className="text-sm text-[#6E7B8C] mb-8">Whiteout AI · U.S. patent pending</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="mailto:alex@groovysec.com">
                  <GradientButton variant="blue">
                    <Mail className="w-4 h-4 mr-2" />
                    alex@groovysec.com
                  </GradientButton>
                </a>
                <a
                  href="https://www.linkedin.com/in/alexander-flowers-a233ba207/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-sm text-[#1A5FB4] hover:text-[#164F96] transition-colors px-4 py-2"
                >
                  Connect on LinkedIn
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
                <Link
                  href="/whiteout-ai/security-whitepaper"
                  className="inline-flex items-center justify-center text-sm text-[#1A5FB4] hover:text-[#164F96] transition-colors px-4 py-2"
                >
                  Read the security whitepaper
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
