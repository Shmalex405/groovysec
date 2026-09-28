import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Code2,
  Boxes,
  Cloud,
  ShieldCheck,
  Activity,
  Link2,
  Ban,
  Zap,
  ClipboardList,
  FileCheck2,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  User,
  Bot,
  Brain,
  HeartPulse,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ScrollReveal } from "@/components/motion";
import { SpinningMarkSvg } from "@/components/ui/spinning-mark";
import { cn } from "@/lib/utils";

/* Shared expand-on-click reveal, reused across the sections below */

function ExpandDetail({ open, text, accentText }: { open: boolean; text: string; accentText: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <p className={cn("text-xs leading-relaxed pt-3", accentText)}>{text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Human visibility: every prompt, every file, fully auditable */

export function HumanVisibilityAuditTrail() {
  const rows = [
    {
      who: "Legal",
      what: "Pasted a signed NDA into ChatGPT for a summary",
      verdict: "blocked" as const,
      detail: "Client-privileged content matched. Blocked before it left the browser; the user got a redacted-safe alternative instead.",
    },
    {
      who: "Finance",
      what: "Asked Copilot to reconcile a vendor spreadsheet",
      verdict: "allowed" as const,
      detail: "No sensitive fields detected. Evaluated and passed through in under 320ms, no friction for legitimate work.",
    },
    {
      who: "Engineering",
      what: "Pasted a live database connection string into Claude Code",
      verdict: "blocked" as const,
      detail: "A real credential was detected mid-session and blocked at the IDE, before the model ever saw it.",
    },
    {
      who: "Human Resources",
      what: "Asked Gemini to draft a generic offer letter template",
      verdict: "allowed" as const,
      detail: "No PII present. Logged and passed through instantly, same as any compliant everyday prompt.",
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
              See Every Prompt. Every File. Every Verdict.
            </h2>
            <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
              Whiteout AI doesn't sample traffic or summarize usage after the
              fact. Every prompt, every paste, every file upload, allowed or
              blocked, is captured in full and tied to the person who sent it.
              Click a row to see what's actually logged.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="rounded-xl border border-[#0F1B2D]/10 bg-white shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] overflow-hidden">
            <div className="hidden sm:grid grid-cols-[140px_1fr_110px] gap-4 px-5 py-3 border-b border-[#0F1B2D]/10 text-[11px] font-semibold text-[#6E7B8C] uppercase tracking-wide">
              <span>Who</span>
              <span>What happened</span>
              <span>Verdict</span>
            </div>
            {rows.map((row, i) => {
              const isOpen = openIndex === i;
              const isBlocked = row.verdict === "blocked";
              return (
                <button
                  type="button"
                  key={row.who}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={cn(
                    "w-full text-left px-5 py-4 border-b last:border-0 border-[#0F1B2D]/5 transition-colors cursor-pointer",
                    isOpen ? "bg-[#1A5FB4]/[0.03]" : "hover:bg-[#0F1B2D]/[0.015]"
                  )}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_110px] gap-1.5 sm:gap-4 sm:items-center">
                    <span className="text-sm font-semibold text-[#0F1B2D]">{row.who}</span>
                    <span className="text-sm text-[#51617A]">{row.what}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border",
                          isBlocked
                            ? "bg-[#B3261E]/10 text-[#B3261E] border-[#B3261E]/25"
                            : "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/25"
                        )}
                      >
                        {isBlocked ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {row.verdict}
                      </span>
                      <ChevronDown className={cn("w-3.5 h-3.5 text-[#0F1B2D]/30 transition-transform ml-auto", isOpen && "rotate-180")} />
                    </div>
                  </div>
                  <ExpandDetail open={isOpen} text={row.detail} accentText="text-[#164F96]" />
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <p className="text-center text-sm text-[#6E7B8C] mt-6 max-w-2xl mx-auto">
            Every row like this is logged, timestamped, and exportable. Not a
            sample, not a summary reconstructed after the fact. When an
            auditor asks to see it, you already have it.
          </p>
          <p className="text-center text-sm text-[#51617A]/70 italic mt-3">
            That's every human in your organization, accounted for. Here's the
            part most vendors don't tell you:
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* The proof: an agent is just another user to us */

export function AgentsAreUsersProof() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0F1B2D] mb-5 tracking-tight leading-tight">
            An AI Agent Is Just Another User to Us.
          </h2>
          <p className="text-lg text-[#51617A] max-w-2xl mx-auto leading-relaxed">
            Whiteout AI sits at the top layer: the exact point where data would
            otherwise cross out of your network to an external AI service. A
            person pasting into ChatGPT and an autonomous agent invoking Bedrock
            from inside your own VPC both pass through that same layer,
            evaluated by the exact same policy engine against the exact same
            policies. No quieter ruleset for machines. If it can move your data
            externally, it's a user.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-14 relative w-full">
            <svg
              className="w-full text-[#51617A]"
              viewBox="0 0 700 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="proof-blue" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#1a5fb4" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="proof-orange" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#c77800" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="proof-green" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#2e7d32" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>

                <mask id="proof-mask-human">
                  <path d="M 180 75 Q 235 75 235 102 Q 235 130 290 130" stroke="white" strokeWidth="2" />
                </mask>
                <mask id="proof-mask-agent">
                  <path d="M 180 185 Q 235 185 235 158 Q 235 130 290 130" stroke="white" strokeWidth="2" />
                </mask>
                <mask id="proof-mask-out">
                  <path d="M 440 130 H 530" stroke="white" strokeWidth="2" />
                </mask>
              </defs>

              {/* Static paths */}
              <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.35">
                <path d="M 180 75 Q 235 75 235 102 Q 235 130 290 130" />
                <path d="M 180 185 Q 235 185 235 158 Q 235 130 290 130" />
                <path d="M 440 130 H 530" />
              </g>

              {/* Animated lights */}
              <g mask="url(#proof-mask-human)">
                <circle r="16" fill="url(#proof-blue)">
                  <animateMotion dur="2.6s" repeatCount="indefinite" path="M 180 75 Q 235 75 235 102 Q 235 130 290 130" />
                </circle>
              </g>
              <g mask="url(#proof-mask-agent)">
                <circle r="16" fill="url(#proof-orange)">
                  <animateMotion dur="2.6s" repeatCount="indefinite" begin="0.4s" path="M 180 185 Q 235 185 235 158 Q 235 130 290 130" />
                </circle>
              </g>
              <g mask="url(#proof-mask-out)">
                <circle r="16" fill="url(#proof-green)">
                  <animateMotion dur="1.8s" repeatCount="indefinite" begin="1.3s" path="M 440 130 H 530" />
                </circle>
              </g>

              {/* Human node */}
              <g>
                <rect x="30" y="40" width="150" height="70" rx="12" fill="#FFFFFF" stroke="currentColor" strokeWidth="0.8" />
                <g transform="translate(46, 55)">
                  <User width={20} height={20} stroke="#1A5FB4" strokeWidth={2} />
                </g>
                <text x="78" y="68" fill="#0F1B2D" fontSize="12" fontWeight="700">Human User</text>
                <text x="46" y="92" fill="#51617A" fontSize="8">ChatGPT · Copilot · Claude Code</text>
              </g>

              {/* Agent / workload node */}
              <g>
                <rect x="30" y="150" width="150" height="70" rx="12" fill="#FFFFFF" stroke="currentColor" strokeWidth="0.8" />
                <g transform="translate(46, 165)">
                  <Bot width={20} height={20} stroke="#A05F00" strokeWidth={2} />
                </g>
                <text x="78" y="178" fill="#0F1B2D" fontSize="12" fontWeight="700">AI Agent · Workload</text>
                <text x="46" y="202" fill="#51617A" fontSize="8">Bedrock · EKS · Lambda</text>
              </g>

              {/* Policy engine node */}
              <g>
                <rect x="285" y="95" width="150" height="70" rx="14" fill="#FFFFFF" stroke="#1a5fb4" strokeWidth="1" />
                <SpinningMarkSvg x={299} y={106} size={22} />
                <text x="330" y="126" fill="#0F1B2D" fontSize="12" fontWeight="700">Whiteout AI</text>
                <text x="299" y="148" fill="#51617A" fontSize="8">One policy engine, either source</text>
                <circle cx="360" cy="130" r="30" fill="url(#proof-orange)" opacity="0.1">
                  <animate attributeName="opacity" values="0.06;0.16;0.06" dur="3s" repeatCount="indefinite" />
                </circle>
              </g>

              {/* Enforced node */}
              <g>
                <rect x="530" y="95" width="140" height="70" rx="12" fill="#FFFFFF" stroke="#2e7d32" strokeWidth="0.8" />
                <circle cx="552" cy="120" r="4" fill="#2e7d32" opacity="0.8" />
                <text x="562" y="124" fill="#0F1B2D" fontSize="12" fontWeight="700">Enforced</text>
                <text x="546" y="148" fill="#2E7D32" fontSize="8">Same 54 policies</text>
              </g>
            </svg>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* AI Footprint: endpoint, IDE, and fleet discovery, as one flow */

export function AiFootprintDiscovery() {
  const nodes = [
    {
      icon: Globe,
      label: "Browser & Desktop",
      detail:
        "Matched against a live signature catalog covering major AI chat, coding, and image tools, plus native watchers on macOS and Windows so switching from a browser tab to a desktop app never creates a blind spot.",
    },
    {
      icon: Code2,
      label: "Developer Tools",
      detail:
        "Session-level watchers pick up Claude Code and Codex activity inside VS Code and JetBrains IDEs the moment a session starts, not after the fact.",
    },
    {
      icon: Boxes,
      label: "Fleet Inventory",
      detail:
        "Reconciled against Intune and Jamf, so the AI footprint you see lines up with the device inventory your IT team already trusts.",
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
              <span className="text-[#1A5FB4]">Your AI footprint.</span> Every
              endpoint, every tool, one picture.
            </h2>
            <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
              You can't govern AI you don't know exists. A single signature
              catalog reconciles what's running across every browser, every
              desktop, every IDE, and every managed device into one inventory,
              sanctioned or shadow. Click a stop below to see how each one works.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const isOpen = openIndex === i;
              return (
                <div key={node.label} className="flex items-center md:flex-1">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                      "shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]",
                      isOpen
                        ? "bg-[#1A5FB4]/[0.05] border-[#1A5FB4] border-2"
                        : "bg-white border-[#0F1B2D]/10 hover:border-[#1A5FB4]/40 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)]"
                    )}
                  >
                    <div className="w-10 h-10 bg-[#1A5FB4]/10 border border-[#1A5FB4]/20 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#1A5FB4]" />
                    </div>
                    <span className="text-sm font-semibold text-[#0F1B2D]">{node.label}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-[#1A5FB4]/50 transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {i < nodes.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-[#0F1B2D]/20 rotate-90 md:rotate-0 mx-2 md:mx-3 flex-shrink-0" />
                  )}
                </div>
              );
            })}
            <ArrowRight className="hidden md:block w-5 h-5 text-[#0F1B2D]/20 mx-3 flex-shrink-0 self-center" />
            <div className="flex-1 flex flex-col items-center justify-center gap-1 py-6 px-4 bg-[#1A5FB4]/[0.04] rounded-xl border border-[#1A5FB4]/25">
              <span className="text-sm font-bold text-[#1A5FB4] text-center">One Reconciled Footprint</span>
              <span className="text-xs text-[#51617A] text-center">Mapped to the fleet you already manage</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {openIndex !== null && (
              <motion.div
                key={openIndex}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-4 p-4 bg-[#1A5FB4]/[0.03] border border-[#1A5FB4]/20 rounded-md"
              >
                <p className="text-sm text-[#164F96] leading-relaxed">{nodes[openIndex].detail}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* Infrastructure: cloud and AI-agent-fleet governance */

export function InfrastructureGovernance() {
  const items = [
    {
      icon: Cloud,
      title: "Cloud Workload Discovery",
      description:
        "An eBPF-based egress classifier watches AI-bound network traffic across EKS, EC2, ECS, and Lambda. No code changes required.",
      detail:
        "The classifier reads network metadata at the kernel level, so it keeps working even when a workload calls a model endpoint nobody registered.",
    },
    {
      icon: ShieldCheck,
      title: "Bedrock Guardrails",
      description:
        "Every AWS Bedrock invocation is visible via CloudTrail, evaluated against the same policies enforced on human traffic.",
      detail:
        "CloudTrail supplies the invocation record. Whiteout AI supplies the verdict, the same verdict a human prompt would get.",
    },
    {
      icon: Activity,
      title: "Agent Fleet Health",
      description:
        "Live heartbeat and version-drift detection across every deployed agent, with policy scope tracked per resource.",
      detail:
        "An agent that goes quiet or drifts to an old version shows up immediately, before it becomes a blind spot in your coverage.",
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
              <span className="text-[#2E7D32]">Infrastructure.</span> Governance
              that follows AI all the way to production.
            </h2>
            <p className="text-lg text-[#51617A] max-w-2xl">
              The same policy engine extends into the cloud workloads running
              your AI: Kubernetes, EC2, ECS, and Lambda. Every deployed agent
              gets a live fleet health view, and every Bedrock invocation is
              held to the same policies as a person typing into ChatGPT.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[#0F1B2D]/10" aria-hidden="true" />
            <div className="space-y-3">
              {items.map((item, i) => {
                const Icon = item.icon;
                const isOpen = openIndex === i;
                return (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className={cn(
                      "relative flex gap-5 w-full text-left p-3 -m-3 rounded-lg transition-colors cursor-pointer",
                      isOpen ? "bg-[#2E7D32]/[0.04]" : "hover:bg-[#0F1B2D]/[0.02]"
                    )}
                  >
                    <div
                      className={cn(
                        "relative z-10 flex-shrink-0 w-10 h-10 bg-white border-2 rounded-full flex items-center justify-center transition-colors",
                        isOpen ? "border-[#2E7D32]" : "border-[#2E7D32]/30"
                      )}
                    >
                      <Icon className="w-4 h-4 text-[#2E7D32]" />
                    </div>
                    <div className="pt-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-[#0F1B2D] mb-1.5">{item.title}</h3>
                        <ChevronDown className={cn("w-4 h-4 text-[#2E7D32]/50 transition-transform flex-shrink-0", isOpen && "rotate-180")} />
                      </div>
                      <p className="text-sm text-[#51617A] leading-relaxed max-w-xl">{item.description}</p>
                      <ExpandDetail open={isOpen} text={item.detail} accentText="text-[#2E7D32]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* AI Connector: OAuth-grant and SaaS-identity governance */

export function AiConnectorGrantGovernance() {
  const steps = [
    {
      icon: Link2,
      title: "Discover",
      description:
        "Enumerate OAuth grants and app-role assignments across Microsoft 365 and Google Workspace to find which AI vendors already have access, and whether it's per-user or tenant-wide.",
      detail:
        "Distinguishes a single employee's personal connection from an org-wide consent grant that exposes every mailbox in the tenant.",
    },
    {
      icon: Ban,
      title: "Revoke",
      description:
        "Don't just report on risky access. Revoke it directly, from the same console where you found it.",
      detail:
        "Every revocation is scoped and logged, so you can act with confidence instead of guessing what might break.",
    },
    {
      icon: Zap,
      title: "Roll Out",
      description:
        "Provision Whiteout AI across SharePoint, OneDrive, Outlook, and Google via admin consent. Zero-click, no per-user setup.",
      detail:
        "Admin consent once, and every user in the tenant is covered without a single desktop install.",
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
              Shadow AI isn't always a prompt.
              <span className="block text-[#A05F00]">Sometimes it's a permission.</span>
            </h2>
            <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
              Employees grant AI tools access to company data long before they
              ever type a word. Whiteout AI's <span className="font-semibold text-[#0F1B2D]">AI Connector</span> finds
              those grants in your identity layer, and can act on them.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isOpen = openIndex === i;
              return (
                <div key={step.title} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[calc(100%-1rem)] w-[calc(100%-2rem)] border-t border-dashed border-[#A05F00]/25" aria-hidden="true" />
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className={cn(
                      "w-full text-left p-3 -m-3 rounded-lg transition-colors cursor-pointer",
                      isOpen ? "bg-[#A05F00]/[0.05]" : "hover:bg-[#0F1B2D]/[0.02]"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl font-bold text-[#A05F00]/30">{i + 1}</span>
                      <div className={cn("w-9 h-9 border rounded-full flex items-center justify-center", isOpen ? "bg-[#A05F00]/20 border-[#A05F00]" : "bg-[#A05F00]/10 border-[#A05F00]/25")}>
                        <Icon className="w-4 h-4 text-[#A05F00]" />
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-[#A05F00]/50 ml-auto transition-transform", isOpen && "rotate-180")} />
                    </div>
                    <h3 className="text-base font-bold text-[#0F1B2D] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#51617A] leading-relaxed">{step.description}</p>
                    <ExpandDetail open={isOpen} text={step.detail} accentText="text-[#A05F00]" />
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* GRC: New, automated compliance evidence, tied to the frameworks above */

export function GrcEvidenceNew() {
  const categories = [
    { icon: Brain, label: "AI-Specific Governance", bg: "bg-[#1A5FB4]/10", border: "border-[#1A5FB4]/25", text: "text-[#1A5FB4]" },
    { icon: ShieldCheck, label: "Defense & Government", bg: "bg-[#2E7D32]/10", border: "border-[#2E7D32]/25", text: "text-[#2E7D32]" },
    { icon: HeartPulse, label: "Healthcare & Medical Privacy", bg: "bg-[#A05F00]/10", border: "border-[#A05F00]/25", text: "text-[#A05F00]" },
    { icon: Lock, label: "Enterprise Security & Privacy", bg: "bg-[#7C3AED]/10", border: "border-[#7C3AED]/25", text: "text-[#6D28D9]" },
  ];

  const items = [
    {
      icon: ClipboardList,
      title: "AI System Register",
      description: "Every AI system in your organization, inventoried and mapped to the obligation it triggers. The register regulators now expect you to have.",
      detail: "The exact artifact ISO 42001 and the EU AI Act both ask you to produce, built automatically instead of assembled in a spreadsheet.",
    },
    {
      icon: FileCheck2,
      title: "Automated Evidence Packs",
      description: "The prompts, files, and verdicts already logged for every user become evidence automatically, tied to the exact control each one satisfies.",
      detail: "No more assembling screenshots the week before an audit. Every pack cites the control it satisfies, so your answer to an auditor's question is a link, not a scramble.",
    },
    {
      icon: RefreshCw,
      title: "Vanta / Drata Sync",
      description: "Evidence lands directly in the compliance platform your team already runs, not in a separate silo.",
      detail: "One less integration your compliance team has to babysit.",
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0F1B2D] mb-3 tracking-tight">
              <span className="text-[#2E7D32]">New:</span> built for the person who has to prove it
            </h2>
            <p className="text-base text-[#51617A] max-w-2xl mx-auto">
              An auditor doesn't accept "we're compliant." They want evidence,
              tied to a specific control. Whiteout AI now generates that
              evidence automatically, for the same 12 frameworks already
              enforced above.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.label} className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md border ${cat.bg} ${cat.border}`}>
                  <Icon className={`w-4 h-4 ${cat.text}`} />
                  <span className={`text-xs font-semibold ${cat.text}`}>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#0F1B2D]/10">
            {items.map((item, i) => {
              const Icon = item.icon;
              const isOpen = openIndex === i;
              return (
                <button
                  type="button"
                  key={item.title}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={cn(
                    "p-7 text-left transition-colors cursor-pointer",
                    isOpen ? "bg-[#2E7D32]/[0.04]" : "hover:bg-[#0F1B2D]/[0.015]"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("w-9 h-9 border rounded-md flex items-center justify-center", isOpen ? "bg-[#2E7D32]/20 border-[#2E7D32]" : "bg-[#2E7D32]/10 border-[#2E7D32]/20")}>
                      <Icon className="w-4 h-4 text-[#2E7D32]" />
                    </div>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-[#2E7D32]/50 transition-transform", isOpen && "rotate-180")} />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F1B2D] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#51617A] leading-relaxed">{item.description}</p>
                  <ExpandDetail open={isOpen} text={item.detail} accentText="text-[#2E7D32]" />
                </button>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
