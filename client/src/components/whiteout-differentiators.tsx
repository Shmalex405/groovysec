import {
  Brain,
  Cpu,
  BarChart3,
  ExternalLink,
  Globe,
  Monitor,
  Code,
  Server,
  Workflow,
  KeyRound,
  Fingerprint,
  Smartphone,
  Link2,
  Eye,
  Webhook,
} from "lucide-react";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

const BENCHMARK_URL =
  "https://huggingface.co/datasets/ShmalexFlow/whiteout-compliance-benchmark";

/* ── Full-LLM compliance engine ─────────────────────────────────────── */

export function FullLlmEngine() {
  const pillars = [
    {
      icon: Brain,
      title: "Pure Semantic Evaluation",
      description:
        "No regex. No keyword lists. The engine reads meaning and intent the way a compliance officer would — distinguishing real patient data from a generic template request.",
    },
    {
      icon: Cpu,
      title: "Dedicated GPU Inference",
      description:
        "Compliance evaluation runs on dedicated GPU infrastructure inside the deployment boundary. Your prompts are never sent to a third-party model provider to be judged.",
    },
    {
      icon: BarChart3,
      title: "Benchmarked in Public",
      description:
        "Greater than 99% accuracy across a 15,915-prompt benchmark spanning all nine policy domains — and calibrated to flag genuine violations without interrupting legitimate work. Published openly so you can verify it yourself, not take our word for it.",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              A Full 27B-Parameter LLM.
              <span className="block text-blue-400">Not a Lightweight Classifier.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Most AI data-protection tools rely on small classifier models or
              pattern matching that miss context. Whiteout AI evaluates every
              prompt with a full 27-billion-parameter LLM — accurate enough to
              catch real violations on a public benchmark, calibrated enough to
              wave legitimate work straight through.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid md:grid-cols-3 gap-6 mb-12">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div className="h-full p-8 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-blue-500/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* Benchmark strip */}
        <ScrollReveal>
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8">
            <div className="grid sm:grid-cols-3 gap-8 text-center mb-6">
              {[
                { value: ">99%", label: "Overall Accuracy" },
                { value: "15,915", label: "Benchmark Prompts" },
                { value: "9", label: "Policy Domains Covered" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <a
                href={BENCHMARK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Explore the public benchmark dataset
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ── Seven enforcement surfaces ─────────────────────────────────────── */

const MODE_STYLES: Record<string, string> = {
  Enforce: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  Audit: "bg-blue-500/10 text-blue-400 border-blue-500/25",
  Visibility: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  "In-Process": "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
};

export function EnforcementSurfaces() {
  const surfaces = [
    {
      icon: Globe,
      title: "Browser Extension",
      mode: "Enforce",
      description: "Chrome, Firefox, Edge & Safari — prompts, pastes, and file uploads intercepted across 23+ AI platforms.",
    },
    {
      icon: Monitor,
      title: "Desktop Guard",
      mode: "Enforce",
      description: "Native macOS and Windows interception for ChatGPT, Claude, and Copilot desktop apps.",
    },
    {
      icon: Code,
      title: "IDE Extension",
      mode: "Enforce",
      description: "Pre-send gates for AI coding assistants — Claude Code, Cursor, and GitHub Copilot — right inside the editor.",
    },
    {
      icon: Server,
      title: "Infrastructure Agent",
      mode: "Enforce",
      description: "Monitor or enforce AI API calls from Kubernetes, EC2, ECS, and Lambda workloads — with a Python SDK and Lambda layer for in-process blocking in your own applications.",
    },
    {
      icon: Workflow,
      title: "MCP Gateway",
      mode: "Enforce",
      description: "Governs which MCP tools AI agents can reach, with policy checks on tool traffic.",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/20 text-blue-400 text-sm mb-6">
              Whiteout AI Interceptor
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              One Policy Engine. Five Enforcement Surfaces.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Policy enforcement everywhere your workforce uses AI — browser,
              desktop, IDE, and cloud — from a single policy engine.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="flex flex-wrap justify-center gap-4">
          {surfaces.map((surface) => {
            const Icon = surface.icon;
            return (
              <StaggerItem
                key={surface.title}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
              >
                <div className="h-full p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border rounded ${MODE_STYLES[surface.mode]}`}>
                      {surface.mode.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{surface.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{surface.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}

/* ── Enterprise identity & audit stack ──────────────────────────────── */

export function EnterpriseIdentity() {
  const items = [
    {
      icon: Fingerprint,
      title: "SCIM 2.0 Provisioning",
      description: "Automated user and group lifecycle straight from your identity provider — joiners, movers, and leavers handled without manual admin.",
    },
    {
      icon: KeyRound,
      title: "SSO Across 9 Providers",
      description: "Okta, Microsoft Entra, Google Workspace, Auth0, Ping, OneLogin, JumpCloud, and generic OIDC/SAML — with user and group sync.",
    },
    {
      icon: Smartphone,
      title: "Zero-Touch MDM Deployment",
      description: "Roll out every enforcement surface fleet-wide through Microsoft Intune and Jamf — no end-user action required.",
    },
    {
      icon: Link2,
      title: "Hash-Chained Audit Log",
      description: "Tamper-evident, cryptographically chained audit records — the kind of evidence compliance officers can take to an auditor.",
    },
    {
      icon: Eye,
      title: "Human-in-the-Loop Approvals",
      description: "Route sensitive AI requests to reviewers with accountable-override workflows instead of blunt blocking.",
    },
    {
      icon: Webhook,
      title: "SIEM / SOC Delivery",
      description: "Signed, batched webhook delivery of events to Splunk, Sentinel, Elastic, QRadar, or S3 — your SOC sees everything in real time.",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Built for Your Identity Stack — and Your Auditors
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The enterprise plumbing is already done: provisioning, single
              sign-on, fleet deployment, and audit evidence that holds up.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div className="h-full p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-blue-500/30 transition-all duration-300">
                  <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
