import { Link } from "wouter";
import {
  Download,
  Container,
  KeyRound,
  ShieldAlert,
  Terminal,
  Code,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Apple,
  MonitorSmartphone,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/motion/page-transition";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { GradientButton } from "@/components/ui/gradient-button";
import { usePageMeta } from "@/lib/use-page-meta";

// ── Release pinning ─────────────────────────────────────────────────────────
// Nothing to bump by hand: version, download URLs, toolkit tag and the three
// headline counts all come from @/lib/maestro-release, which the Maestro release
// workflow regenerates. The rationale for pinning the toolkit tag to the app
// version, and for never linking the `latest` channel here, lives in that module.
import {
  MAESTRO_VERSION as VERSION,
  MAESTRO_REPO as REPO,
  MAESTRO_PLATFORMS,
  MAESTRO_AGENTS,
  MAESTRO_TOOLS,
  MAESTRO_TESTS,
  MAESTRO_TOOLKIT_IMAGE,
} from "@/lib/maestro-release";

// Icons are the only presentational bit, so they stay here; URLs and labels come
// from the shared module and update themselves on release.
const PLATFORM_ICONS = {
  macos: Apple,
  windows: MonitorSmartphone,
  linux: Terminal,
} as const;
const platforms = MAESTRO_PLATFORMS.map((p) => ({ ...p, icon: PLATFORM_ICONS[p.id] }));

export default function MaestroInstall() {
  usePageMeta(
    "Install Maestro — Free Autonomous Penetration Testing",
    `Install Maestro ${VERSION} free on macOS, Windows or Linux. Signed builds, no account and no licence key — it runs entirely on your machine. Source is public and auditable.`,
  );

  return (
    <PageTransition>
      <AuroraBackground variant="orange" className="min-h-screen">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="inline-flex items-center px-4 py-1.5 rounded-md bg-[#A05F00]/10 border border-[#A05F00]/25 text-[#A05F00] text-sm mb-6 font-mono">
                Maestro {VERSION} · Free
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#0F1B2D] mb-6 leading-tight tracking-tight">
                Install Maestro
              </h1>
              <p className="text-lg text-[#51617A] leading-relaxed mb-8">
                Four steps, and the long one is a download you can leave running. No
                account, no licence key, and nothing to provision — Maestro runs
                entirely on your machine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#step-1">
                  <GradientButton variant="orange">
                    Start
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </GradientButton>
                </a>
                <a href={REPO} target="_blank" rel="noopener noreferrer">
                  <GradientButton variant="white">
                    <Code className="w-4 h-4 mr-2" />
                    Read the source first
                  </GradientButton>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Step 1 — download */}
        <section id="step-1" className="py-16 bg-white/40 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#A05F00] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F1B2D] mb-2">
                    Download the app
                  </h2>
                  <p className="text-[#51617A]">
                    Code-signed builds — Apple Developer ID on macOS, Azure Trusted
                    Signing on Windows — so your OS will not warn you about an
                    unidentified developer.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  return (
                    <a
                      key={p.name}
                      href={p.url}
                      data-testid={p.testid}
                      className="flex flex-col items-center p-6 rounded-xl bg-white border border-[#E4E9F0] hover:border-[#A05F00]/40 transition-colors"
                    >
                      <Icon className="w-7 h-7 text-[#A05F00] mb-3" />
                      <span className="font-semibold text-[#0F1B2D]">{p.name}</span>
                      <span className="text-xs text-[#6E7B8C] font-mono mt-1">
                        {p.detail}
                      </span>
                      <span className="text-xs text-[#A05F00] font-mono mt-2">
                        {p.ext}
                      </span>
                    </a>
                  );
                })}
              </div>

              <p className="text-sm text-[#6E7B8C] mt-6">
                macOS is Apple Silicon only. Prefer to build it yourself? Everything you
                need is in{" "}
                <a
                  href={REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A05F00] hover:underline"
                >
                  the repository
                </a>
                .
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Step 2 — Docker + toolkit */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#A05F00] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F1B2D] mb-2">
                    Install Docker, then pull the toolkit
                  </h2>
                  <p className="text-[#51617A]">
                    Every scanner runs inside a Kali Linux container on your machine.
                    Maestro needs Docker running, and it needs the toolkit image.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#E4E9F0] mb-4">
                <p className="text-sm text-[#51617A] mb-3">
                  Install{" "}
                  <a
                    href="https://www.docker.com/products/docker-desktop/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A05F00] hover:underline"
                  >
                    Docker Desktop
                  </a>
                  , start it, then run:
                </p>
                <pre className="overflow-x-auto rounded-lg bg-[#0F1B2D] text-[#E4E9F0] px-4 py-3 text-sm font-mono">
                  docker pull {MAESTRO_TOOLKIT_IMAGE}
                </pre>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-[#A05F00]/5 border border-[#A05F00]/20">
                <Container className="w-5 h-5 flex-shrink-0 text-[#A05F00] mt-0.5" />
                <p className="text-sm text-[#51617A]">
                  <span className="font-semibold text-[#0F1B2D]">
                    Roughly 15 GB, so give it a few minutes.
                  </span>{" "}
                  The tag has to match your app version — Maestro looks its image up by
                  tag, so pulling <span className="font-mono">:latest</span> gives you a
                  byte-identical image under a name it never checks, and it will report
                  the toolkit missing.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Step 3 — LLM */}
        <section className="py-16 bg-white/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#A05F00] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F1B2D] mb-2">
                    Connect your own LLM account
                  </h2>
                  <p className="text-[#51617A]">
                    Maestro does not ship a model. It drives one you already pay for, and
                    your credentials never leave your machine.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-xl bg-white border border-[#E4E9F0]">
                  <KeyRound className="w-6 h-6 text-[#A05F00] mb-3" />
                  <h3 className="font-bold text-[#0F1B2D] mb-2">
                    Sign in with your account
                  </h3>
                  <p className="text-sm text-[#51617A] leading-relaxed">
                    Use an existing Claude Pro/Max or ChatGPT Plus subscription. Nothing
                    metered — running Maestro costs you nothing beyond the subscription
                    you already have. This is what most people want.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-white border border-[#E4E9F0]">
                  <Terminal className="w-6 h-6 text-[#A05F00] mb-3" />
                  <h3 className="font-bold text-[#0F1B2D] mb-2">Or use an API key</h3>
                  <p className="text-sm text-[#51617A] leading-relaxed">
                    Paste an Anthropic or OpenAI API key instead. Billed per token, and
                    assessments are token-heavy — a full multi-surface run can reach
                    hundreds of dollars of usage. Best for CI and automation.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-[#B3261E]/5 border border-[#B3261E]/20">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#B3261E] mt-0.5" />
                <p className="text-sm text-[#51617A]">
                  <span className="font-semibold text-[#0F1B2D]">
                    Request Anthropic Cyber Verification before your first run.
                  </span>{" "}
                  Anthropic applies safeguards to cyber-offensive use of Claude, and
                  sustained exploitation is exactly what they look for. On an unenrolled
                  account the exploitation agents will decline partway through —{" "}
                  <em>quietly</em>, so you get a thinner report rather than an error.
                  Enrollment is per-organization and takes time, so start it early.
                  Recon, code scanning, compliance mapping and reporting are unaffected
                  meanwhile.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Step 4 — scope */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#A05F00] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F1B2D] mb-2">
                    Define what you are allowed to test
                  </h2>
                  <p className="text-[#51617A]">
                    Then run an assessment. Nothing executes against a target that is not
                    in scope.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#B3261E]/5 border border-[#B3261E]/25">
                <div className="flex gap-3">
                  <ShieldAlert className="w-6 h-6 flex-shrink-0 text-[#B3261E] mt-0.5" />
                  <div className="text-sm text-[#51617A] space-y-3">
                    <p className="font-semibold text-[#0F1B2D] text-base">
                      Authorized targets only.
                    </p>
                    <p>
                      Maestro performs real exploitation. It sends live payloads, forges
                      tokens, escalates privileges and reads data in order to prove
                      impact. That is the product — and it is why you must hold
                      documented authorization for every system you point it at.
                    </p>
                    <p>
                      Every tool call is validated against your scope configuration
                      before it executes, with exclusions that fail closed. That is a
                      guardrail, not a substitute for permission.
                    </p>
                    <p>
                      Need somewhere to practise? The repository stands up OWASP Juice
                      Shop and NodeGoat locally, both built to be attacked.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* What you get */}
        <section className="py-16 bg-white/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-[#0F1B2D] mb-8">
                What the free build includes
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  `All ${MAESTRO_AGENTS} agents, across every surface`,
                  `${MAESTRO_TOOLS} security tools in the Kali container`,
                  `The full ${MAESTRO_TESTS}-test assessment matrix`,
                  "Oracle verification on every exploitable finding",
                  "Severity calibration from real outcomes",
                  "Reports with evidence, in Markdown and PDF",
                  "Web, API, cloud, identity and AI/LLM surfaces",
                  "Findings stored locally — nothing leaves your machine",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-[#A05F00] mt-1" />
                    <span className="text-[#51617A]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 rounded-lg bg-white border border-[#E4E9F0]">
                <p className="text-sm text-[#51617A]">
                  <span className="font-semibold text-[#0F1B2D]">
                    Needs a shared backend?
                  </span>{" "}
                  A few capabilities depend on Postgres — the attack-graph explorer,
                  post-exploitation footholds, scheduled scanning and team roles. The
                  deployment terraform is in the repository, so you can stand your own up
                  in your own AWS account. Where something is unavailable locally, the
                  app tells you which and why rather than showing you an empty screen.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Close */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#0F1B2D] mb-4">
                Stuck, or think something is wrong?
              </h2>
              <p className="text-[#51617A] mb-8 max-w-2xl mx-auto">
                Feedback shapes what gets built next, and a report that a finding is
                wrong is more useful to us than a compliment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`${REPO}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GradientButton variant="orange">
                    Ask or suggest
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </GradientButton>
                </a>
                <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
                  <GradientButton variant="white">Report a bug</GradientButton>
                </a>
                <Link href="/maestro">
                  <GradientButton variant="white">
                    <Download className="w-4 h-4 mr-2" />
                    About Maestro
                  </GradientButton>
                </Link>
              </div>
              <p className="text-sm text-[#6E7B8C] mt-8">
                Found a vulnerability in Maestro itself? Please report it privately to{" "}
                <a
                  href="mailto:security@groovysec.com"
                  className="text-[#A05F00] hover:underline"
                >
                  security@groovysec.com
                </a>{" "}
                rather than opening a public issue.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
