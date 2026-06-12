import { useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { HoloCard } from "@/components/ui/holo-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AuroraBackground } from "@/components/ui/aurora-background";
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline";
import {
  Target,
  Search,
  ShieldCheck,
  Globe,
  Bug,
  CheckCircle,
  FileText,
  Scan,
  ArrowRight,
  Zap,
  Network,
  Scale,
  Code,
  Layers,
  SplitSquareVertical,
  Cloud,
  CloudCog,
  Container,
  Database,
  Lock,
  KeyRound,
  CalendarClock,
  Cpu,
  Bot,
  BrainCircuit,
  Gauge,
  Share2,
  FileCheck,
  Printer,
  ChevronRight,
} from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
  BlurredStaggerText,
} from "@/components/motion";
import { MaestroAssessmentDemo } from "@/components/maestro-assessment-demo";
import { usePageMeta } from "@/lib/use-page-meta";

export default function Maestro() {
  usePageMeta(
    "Maestro — AI-Driven Penetration Testing",
    "Maestro deploys 21 specialized AI agents with 213 MCP tools through a 232-test assessment matrix — autonomous red team exploitation across web, API, cloud, Kubernetes, identity providers, and AI/LLM systems with proof of impact."
  );
  const [expandedDomain, setExpandedDomain] = useState<number | null>(null);

  // Each card maps 1:1 to a real worker agent in the Maestro engine
  // (config/team-assessment.yml), ordered by the penetration testing lifecycle:
  // discovery → analysis → exploitation → validation → reporting.
  const agents = [
    { num: "01", icon: Search, title: "Recon & Infra Agent", description: "Reconnaissance and infrastructure security in one pass — asset discovery, port scanning, and subdomain enumeration alongside SSL/TLS, DNS/DNSSEC, certificate, and zone-transfer analysis.", color: "orange" as const },
    { num: "02", icon: Cloud, title: "Cloud Recon Agent", description: "Multi-cloud discovery across AWS, Azure, GCP, and Kubernetes — resource enumeration, IAM analysis, storage discovery, and network mapping for cloud-native environments.", color: "red" as const },
    { num: "03", icon: KeyRound, title: "Identity Recon Agent", description: "Identity provider enumeration across Active Directory, Entra ID, M365, Okta, Google Workspace, and Ping — BloodHound graph collection, Kerberoast/AS-REP candidate discovery, and ADCS vulnerable-template enumeration.", color: "amber" as const },
    { num: "04", icon: Bot, title: "AI Recon Agent", description: "AI/LLM system reconnaissance — model, provider, and framework fingerprinting, exposed tool and function enumeration, untrusted-input surface mapping, and guardrail detection before red teaming begins.", color: "orange" as const },
    { num: "05", icon: Scan, title: "Code Scanning Agent", description: "Static application security testing with Semgrep, Bandit, and njsscan — secrets detection, dependency and supply-chain scanning, and infrastructure-as-code analysis.", color: "red" as const },
    { num: "06", icon: Code, title: "Code Intelligence Agent", description: "Source code intelligence that maps entry points, traces data flows with taint analysis, verifies existing defenses, and builds the attack surface from your codebase.", color: "amber" as const },
    { num: "07", icon: Globe, title: "Web App Agent", description: "Deep web application exploitation — OWASP Top 10, authorization and session testing, injection (SQLi/XSS/SSTI), SSRF, cache poisoning, HTTP smuggling, and race conditions.", color: "orange" as const },
    { num: "08", icon: Network, title: "API & GraphQL Agent", description: "GraphQL introspection and abuse, REST API fuzzing, JWT analysis, IDOR testing, WebSocket security, file-upload checks, and Nuclei/Nikto vulnerability scanning.", color: "red" as const },
    { num: "09", icon: CloudCog, title: "Cloud Exploit Agent", description: "Cloud-native red team exploitation — IAM privilege escalation chains, storage abuse, Kubernetes attacks, serverless exploitation, and metadata probing with validated proof of impact.", color: "amber" as const },
    { num: "10", icon: Lock, title: "Identity Exploit Agent", description: "Lockout-governed identity exploitation — Kerberoasting, password spraying, token replay, and ADCS ESC abuse across Active Directory, Entra ID, M365, Okta, Google Workspace, and Ping, with validated privilege escalation.", color: "orange" as const },
    { num: "11", icon: BrainCircuit, title: "AI Red Team Agent", description: "AI/LLM exploitation against the OWASP Top 10 for LLM Applications (2025) — prompt injection, jailbreak, system-prompt extraction, sensitive disclosure, excessive agency, and RAG isolation, with capture-not-execute safety controls.", color: "red" as const },
    { num: "12", icon: Layers, title: "Chain Analysis Agent", description: "Two-pass attack-chain analysis — hypothesizes multi-step exploit paths, then validates them against real exploitation results with severity recalculation and defense-in-depth analysis.", color: "amber" as const },
    { num: "13", icon: CheckCircle, title: "Cross-Validation & QA Agent", description: "Cross-validates static findings against live endpoints, scores confidence, eliminates false positives, and flags coverage gaps so every reported finding is reproducible.", color: "orange" as const },
    { num: "14", icon: Gauge, title: "Severity Calibration Agent", description: "Re-rates every finding's severity from actual exploitation outcomes — exploited, partial, or not exploitable — using reachability evidence and attack-chain context.", color: "red" as const },
    { num: "15", icon: Share2, title: "Cloud Analysis Agent", description: "Synthesizes the cloud companion report and builds an escalation graph, rendering validated cloud attack chains from posture and IAM data.", color: "amber" as const },
    { num: "16", icon: Share2, title: "Identity Analysis Agent", description: "Synthesizes the Identity Companion Report and builds the privilege-escalation graph, rendering validated identity attack chains across on-prem Active Directory and cloud identity providers.", color: "orange" as const },
    { num: "17", icon: Share2, title: "AI Analysis Agent", description: "Synthesizes the AI Security Assessment Report — builds the excessive-agency graph from injection to tool to system, mapped to the OWASP LLM Top 10 and MITRE ATLAS.", color: "red" as const },
    { num: "18", icon: Scale, title: "Compliance Agent", description: "Automated mapping to OWASP Top 10, OWASP API Top 10, OWASP LLM Top 10, NIST 800-53, PCI-DSS, MITRE ATLAS, and CWE standards, with CVSS v3.1 scoring for every finding.", color: "amber" as const },
    { num: "19", icon: FileText, title: "Report Agent", description: "Professional report generation with executive summaries, technical detail, original and calibrated severity, full test-coverage checklists, and prioritized remediation guidance.", color: "orange" as const },
    { num: "20", icon: FileCheck, title: "Report Enrichment Agent", description: "Validates each report against rigorous quality checks, re-runs tools to fill any gaps, and enforces complete coverage before the report is finalized.", color: "red" as const },
    { num: "21", icon: Printer, title: "PDF Rendering Agent", description: "Converts the finished assessment into a polished, styled PDF and registers it for delivery to stakeholders — the final step of every engagement.", color: "amber" as const },
  ];

  const features = [
    { icon: Bug, title: "Full-Spectrum Red Team", description: "Controlled exploitation across web applications, APIs, cloud infrastructure, Kubernetes, and identity providers — from OWASP Top 10 through IAM privilege escalation, container escapes, and Active Directory / Entra ID attack paths. Proven impact, not theoretical risk." },
    { icon: Layers, title: "232-Test Assessment Matrix", description: "Structured assessment framework with 73 DAST tests, 60 identity tests, 29 cloud security tests, 24 SAST tests, 23 AI/LLM tests, 15 cross-validation tests, and 8 chain analysis tests — ensuring consistent, deterministic coverage across every engagement." },
    { icon: SplitSquareVertical, title: "Multi-Track Analysis", description: "Parallel dynamic, static, cloud, and identity analysis with cross-validation. Findings enriched with source code context, cloud posture, and identity graph data, then validated against live endpoints." },
    { icon: Zap, title: "Autonomous Testing", description: "Deploy agents and let them work autonomously — Maestro coordinates the full pentest lifecycle from reconnaissance through exploitation to reporting." },
    { icon: FileText, title: "Report Generation", description: "Evidence-based reporting in HTML, PDF, and Markdown with executive summaries, technical breakdowns, complete reproduction steps, and prioritized remediation guidance — ready for stakeholders." },
    { icon: Code, title: "Code Intelligence", description: "Entry point mapping, data flow tracing, and attack surface generation from source code. SAST findings enriched with git history, file paths, and commit context." },
  ];

  const integrations = [
    { name: "Jira", description: "Create tickets for findings automatically" },
    { name: "SharePoint", description: "Publish reports to document libraries" },
    { name: "Email", description: "Stakeholder notifications and summaries" },
    { name: "ASPM", description: "Import static analysis findings for dynamic validation" },
    { name: "N8N", description: "Workflow automation and orchestration" },
  ];

  const colorMap = {
    orange: { icon: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    red: { icon: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    amber: { icon: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  };

  const featureColors = [
    "text-red-400", "text-orange-400", "text-amber-400",
    "text-red-400", "text-orange-400", "text-amber-400",
  ];

  return (
    <PageTransition>
      <AuroraBackground variant="orange" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.02] via-transparent to-transparent" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,60,0,0.015) 2px, rgba(255,60,0,0.015) 4px)",
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <HeroTextReveal>
                  <HeroLine>
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-500/[0.08] border border-orange-500/20 text-orange-400 text-sm mb-8 font-mono">
                      Maestro
                    </div>
                  </HeroLine>

                  <HeroLine>
                    <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                      Automated
                      <span
                        className="block bg-clip-text text-transparent animate-gradient-flow"
                        style={{
                          backgroundImage: "linear-gradient(90deg, #fb923c, #ef4444, #f59e0b, #ef4444, #fb923c)",
                          backgroundSize: "300% 100%",
                        }}
                      >
                        Penetration Testing
                      </span>
                      From Code to Cloud
                    </h1>
                  </HeroLine>

                  <HeroLine>
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                      Maestro deploys 21 specialized AI agents to autonomously discover
                      vulnerabilities across web apps, APIs, cloud, identity
                      providers, and AI/LLM systems — then validates them through real
                      red team-style exploitation. Every finding comes with proof of
                      impact, not just scanner output.
                    </p>
                  </HeroLine>
                </HeroTextReveal>

                <ScrollReveal delay={0.5}>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Link href="/demo">
                      <GradientButton variant="orange">
                        Request Demo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </GradientButton>
                    </Link>
                  </div>

                  <div className="text-sm text-slate-500 flex items-center font-mono">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2 animate-pulse" />
                    Built on Kali Linux · AWS / Azure / GCP · Enterprise-ready
                  </div>
                </ScrollReveal>
              </div>

              {/* Key Features — Orbital */}
              <ScrollReveal direction="right" delay={0.3}>
                <RadialOrbitalTimeline
                  timelineData={features.map((f, i) => ({
                    id: i + 1,
                    title: f.title,
                    content: f.description,
                    category: "FEATURE",
                    icon: f.icon,
                    relatedIds: i === 0 ? [2, 4] : i === 1 ? [1, 3] : i === 2 ? [2, 6] : i === 3 ? [1, 5] : i === 4 ? [4, 6] : [3, 5],
                    status: "completed" as const,
                    energy: [95, 90, 88, 92, 85, 87][i],
                  }))}
                  centerImage="/icononly_transparent_nobuffer.png"
                  centerImageClass="grayscale"
                  centerLabel="Maestro"
                  variant="orange"
                  className="scale-[0.85] lg:scale-100 -my-8"
                />
              </ScrollReveal>
            </div>

            {/* Live assessment visualization (stats live in its footer) */}
            <ScrollReveal delay={0.6}>
              <div className="mt-12">
                <MaestroAssessmentDemo />
                <p className="mt-5 text-sm text-slate-500 max-w-xl mx-auto text-center">
                  Discover, exploit, validate, report — every one of the 232 tests
                  runs the same evidence pipeline.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Agent Overview — Dual Marquee */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  21 Specialized AI Agents
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Each agent is purpose-built for a specific phase of the penetration
                  testing lifecycle — from reconnaissance and code intelligence through
                  web exploitation, cloud, identity, and AI/LLM red teaming, attack
                  chain analysis, compliance mapping, and validated reporting.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <style>{`
            @keyframes marquee-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marquee-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
          `}</style>

          {/* Top row — scrolls right. Hovering the row pauses it; the focused
              card lifts to the front so it can be read in full. */}
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_100%)] mb-4">
            <div
              className="flex gap-4 w-max [&:hover]:[animation-play-state:paused]"
              style={{ animation: "marquee-right 70s linear infinite" }}
            >
              {[...agents.slice(0, 8), ...agents.slice(0, 8)].map((agent, index) => {
                const Icon = agent.icon;
                const colors = colorMap[agent.color];
                return (
                  <div
                    key={`top-${index}`}
                    tabIndex={0}
                    className="group relative flex-shrink-0 w-80 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 transition-all duration-300 cursor-pointer hover:z-20 focus:z-20 hover:scale-[1.04] focus:scale-[1.04] hover:bg-slate-900 focus:bg-slate-900 hover:border-orange-500/40 focus:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10 focus:outline-none"
                  >
                    <span className="absolute top-4 right-5 text-[11px] font-mono font-bold text-slate-600 group-hover:text-orange-400/70 transition-colors">{agent.num}</span>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 ${colors.bg} ${colors.border} border rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${colors.icon}`} />
                      </div>
                      <h3 className="text-sm font-bold text-white pr-6">{agent.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors leading-relaxed">{agent.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom row — scrolls left */}
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_100%)]">
            <div
              className="flex gap-4 w-max [&:hover]:[animation-play-state:paused]"
              style={{ animation: "marquee-left 80s linear infinite" }}
            >
              {[...agents.slice(8), ...agents.slice(8)].map((agent, index) => {
                const Icon = agent.icon;
                const colors = colorMap[agent.color];
                return (
                  <div
                    key={`bottom-${index}`}
                    tabIndex={0}
                    className="group relative flex-shrink-0 w-80 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 transition-all duration-300 cursor-pointer hover:z-20 focus:z-20 hover:scale-[1.04] focus:scale-[1.04] hover:bg-slate-900 focus:bg-slate-900 hover:border-orange-500/40 focus:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10 focus:outline-none"
                  >
                    <span className="absolute top-4 right-5 text-[11px] font-mono font-bold text-slate-600 group-hover:text-orange-400/70 transition-colors">{agent.num}</span>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 ${colors.bg} ${colors.border} border rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${colors.icon}`} />
                      </div>
                      <h3 className="text-sm font-bold text-white pr-6">{agent.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors leading-relaxed">{agent.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MCP Tools & Test Matrix */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div>
                <ScrollReveal>
                  <h3 className="text-lg font-mono tracking-wider mb-4 px-1">
                    <span className="text-orange-400 font-bold">213</span>{" "}
                    <span className="text-orange-300/70">MCP TOOLS</span>
                  </h3>
                </ScrollReveal>
                <GlassCard className="p-8">
                  <BlurredStaggerText
                    text="Each agent is equipped with specialized MCP tools — purpose-built security instruments that interact directly with targets, APIs, cloud environments, and infrastructure. Scanners, fuzzers, exploit modules, and evidence collectors that turn AI reasoning into real security testing."
                    className="text-lg text-orange-200/60 leading-relaxed"

                  />
                </GlassCard>
              </div>
              <div>
                <ScrollReveal>
                  <h3 className="text-lg font-mono tracking-wider mb-4 px-1">
                    <span className="text-orange-400 font-bold">232</span>{" "}
                    <span className="text-orange-300/70">TEST MATRIX</span>
                  </h3>
                </ScrollReveal>
                <GlassCard className="p-8">
                  <BlurredStaggerText
                    text="Maestro's structured assessment framework — a deterministic checklist ensuring every engagement covers the same 232 tests across DAST, SAST, cloud security, identity, AI/LLM, cross-validation, and chain analysis. No tester variance, no missed coverage. Every run produces consistent, comparable results."
                    className="text-lg text-orange-200/60 leading-relaxed"

                  />
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* Assessment Capabilities */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  Full-Spectrum Security Assessment
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Covers your entire attack surface — from application code to cloud
                  infrastructure. Every domain is tested, validated, and reported with
                  real evidence.
                </p>
              </div>
            </ScrollReveal>

            {/* Floating accordion menu */}
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
                  {[
                    {
                      icon: Globe,
                      title: "Web Application Security",
                      isNew: false,
                      summary: "OWASP Top 10, auth testing, business logic, injection flaws",
                      capabilities: [
                        "OWASP Top 10 coverage",
                        "Authentication & session testing",
                        "Business logic validation",
                        "Input injection & XSS",
                      ],
                    },
                    {
                      icon: Network,
                      title: "API & GraphQL Security",
                      isNew: false,
                      summary: "REST fuzzing, GraphQL abuse, auth bypass, access control",
                      capabilities: [
                        "REST endpoint fuzzing",
                        "GraphQL introspection & query abuse",
                        "Authentication bypass",
                        "Rate limiting & access control",
                      ],
                    },
                    {
                      icon: Code,
                      title: "Static Code Analysis",
                      isNew: false,
                      summary: "Source code vulnerabilities, dependency scanning, IaC checks",
                      capabilities: [
                        "Source code vulnerability detection",
                        "Dependency & supply chain analysis",
                        "Infrastructure-as-Code scanning",
                        "Git history & secrets detection",
                      ],
                    },
                    {
                      icon: Cloud,
                      title: "Cloud Infrastructure",
                      isNew: true,
                      summary: "AWS, Azure, GCP — IAM privesc, storage abuse, posture validation",
                      capabilities: [
                        "IAM privilege escalation testing",
                        "Storage & secrets exposure validation",
                        "Cloud posture verification with proof",
                        "Serverless & compute exploitation",
                      ],
                    },
                    {
                      icon: KeyRound,
                      title: "Identity / IDP Security",
                      isNew: true,
                      summary: "Active Directory, Entra ID, M365, Okta, Google Workspace & Ping — spray, token & privilege-escalation testing",
                      capabilities: [
                        "Active Directory: BloodHound, Kerberoasting, ADCS (ESC1–ESC13)",
                        "Tenant & user enumeration across all major IdPs",
                        "Password spray, token/session replay & MFA-bypass — Entra ID, M365, Okta, Google Workspace & Ping",
                        "Lockout-governed spraying + identity privilege-escalation graph",
                      ],
                    },
                    {
                      icon: Container,
                      title: "Kubernetes & Containers",
                      isNew: true,
                      summary: "Cluster red teaming, container escapes, RBAC exploitation",
                      capabilities: [
                        "Cluster security assessment",
                        "Container escape testing",
                        "RBAC & service account analysis",
                        "Network segmentation validation",
                      ],
                    },
                    {
                      icon: Bot,
                      title: "AI / LLM Security",
                      isNew: true,
                      summary: "Prompt injection, jailbreak, system-prompt leakage, RAG isolation & agent abuse — OWASP LLM Top 10 (2025)",
                      capabilities: [
                        "Prompt injection (direct & indirect), jailbreak & guardrail-bypass testing",
                        "System-prompt extraction & sensitive information disclosure",
                        "Excessive agency & improper output handling — tool calls captured, never executed",
                        "RAG isolation, data poisoning & MCP tool-poisoning, mapped to OWASP LLM Top 10 + MITRE ATLAS",
                      ],
                    },
                    {
                      icon: Layers,
                      title: "Attack Chain Analysis",
                      isNew: false,
                      summary: "Multi-step exploit paths, cross-domain chains, compound risk",
                      capabilities: [
                        "Multi-step exploit path discovery",
                        "Cross-domain chain validation",
                        "Severity recalculation for compound risks",
                        "Defense-in-depth analysis",
                      ],
                    },
                    {
                      icon: Scale,
                      title: "Compliance & Reporting",
                      isNew: false,
                      summary: "OWASP, NIST, PCI-DSS mapping with evidence-based reports",
                      capabilities: [
                        "OWASP, NIST 800-53, PCI-DSS mapping",
                        "CVSS v3.1 scoring for every finding",
                        "Executive & technical reports",
                        "Prioritized remediation guidance",
                      ],
                    },
                    {
                      icon: CalendarClock,
                      title: "Scheduled DAST",
                      isNew: true,
                      summary: "Recurring dynamic scans on a schedule with drift detection and alerts",
                      capabilities: [
                        "Recurring DAST scans on a cron schedule",
                        "Automated re-tests after every deploy",
                        "Continuous regression & drift detection",
                        "Trend reporting & alerts on new findings",
                      ],
                    },
                  ].map((domain, index) => {
                    const Icon = domain.icon;
                    const isExpanded = expandedDomain === index;
                    return (
                      <div key={index}>
                        {index > 0 && <div className="border-t border-white/[0.04]" />}
                        <button
                          onClick={() => setExpandedDomain(isExpanded ? null : index)}
                          className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-white/[0.03] transition-all duration-300 group"
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${isExpanded ? "bg-orange-500/20 border border-orange-500/30" : "bg-white/[0.04] border border-white/[0.06]"}`}>
                            <Icon className={`w-4 h-4 transition-colors duration-300 ${isExpanded ? "text-orange-400" : "text-slate-400 group-hover:text-orange-400"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`text-sm font-bold transition-colors duration-300 ${isExpanded ? "text-orange-300" : "text-white"}`}>
                                {domain.title}
                              </h3>
                              {domain.isNew && (
                                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/25 rounded">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{domain.summary}</p>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-slate-600 flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-90 text-orange-400" : "group-hover:text-slate-400"}`} />
                        </button>
                        <div
                          className="overflow-hidden transition-all duration-300 ease-in-out"
                          style={{
                            maxHeight: isExpanded ? "200px" : "0px",
                            opacity: isExpanded ? 1 : 0,
                          }}
                        >
                          <div className="px-6 pb-4 pl-[4.25rem]">
                            <ul className="space-y-2">
                              {domain.capabilities.map((item) => (
                                <li key={item} className="flex items-center text-xs text-slate-400">
                                  <CheckCircle className="w-3 h-3 text-orange-400/60 mr-2 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Platform badges below menu */}
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  {["AWS", "Azure", "GCP", "Kubernetes", "IDP", "OWASP", "NIST"].map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1.5 bg-white/[0.03] border border-orange-500/[0.08] rounded-lg text-xs font-mono text-orange-300/60"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Differentiator callout */}
            <ScrollReveal delay={0.3}>
              <GlassCard className="p-8 max-w-3xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 mb-4 font-mono tracking-wider">
                      TRADITIONAL SCANNERS
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Flag misconfigurations",
                        "Report compliance gaps",
                        "Identify risky policies",
                        "Alert on public exposure",
                        "Prioritize by theoretical risk",
                      ].map((item) => (
                        <li key={item} className="flex items-center text-sm text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-orange-400 mb-4 font-mono tracking-wider">
                      MAESTRO RED TEAM
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Exploit misconfigurations to prove impact",
                        "Chain weaknesses into privilege escalation",
                        "Extract secrets from storage and metadata",
                        "Escape containers and pivot across clusters",
                        "Validate with actual attack paths",
                      ].map((item) => (
                        <li key={item} className="flex items-center text-sm text-orange-200/70">
                          <CheckCircle className="w-4 h-4 text-orange-400 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
                  <p className="text-sm text-slate-400 italic">
                    "Other tools tell you what's wrong. Maestro proves what's exploitable."
                  </p>
                </div>
              </GlassCard>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <Link href="/demo">
                  <GradientButton variant="orange">
                    Request a Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </GradientButton>
                </Link>
                <Link href="/demo">
                  <GradientButton variant="default">
                    <FileText className="w-4 h-4 mr-2" />
                    Request a Sample Report
                  </GradientButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Trust Engineering — why findings can be trusted */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  No Fake Greens. No Noise.
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Maestro is engineered so you can trust every line of the report —
                  passes are proven, severities are earned, and findings are
                  double-checked before they reach you.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Tool-Provenance Gate",
                  description:
                    "Every passing test must be backed by a security tool that actually ran and completed successfully. If the tool never executed, the result is automatically downgraded to BLOCKED — a silent scanner failure can never masquerade as clean coverage.",
                },
                {
                  icon: Gauge,
                  title: "Exploitation-Calibrated Severity",
                  description:
                    "Severity isn't copied from a CVE database. Every finding is re-rated by what actually happened during exploitation — exploited, partially exploited, or not exploitable — so your team fixes what's truly dangerous first.",
                },
                {
                  icon: SplitSquareVertical,
                  title: "SAST ↔ DAST Cross-Validation",
                  description:
                    "Static code findings are confirmed against the live application before they reach the report. Findings that can't be reproduced are flagged or eliminated — cutting false positives and giving every finding a confidence score.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.title}>
                    <div className="h-full p-8 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-orange-500/30 transition-all duration-300">
                      <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-orange-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Identity Attack Suite Spotlight */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <ScrollReveal>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-500/[0.08] border border-orange-500/20 text-orange-400 text-sm mb-6 font-mono">
                    Identity / IDP Suite
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                    Identity Is the Standard Perimeter.
                    <span className="block text-orange-400">Maestro Attacks It Like One.</span>
                  </h2>
                  <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                    The deepest domain in Maestro's test matrix is identity — 60
                    dedicated tests across your directory and every major identity
                    provider, executed with lockout-governed safety controls and
                    synthesized into a privilege-escalation graph.
                  </p>
                </ScrollReveal>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Kerberoasting",
                    "AS-REP Roasting",
                    "ADCS ESC1–ESC13",
                    "BloodHound Graphing",
                    "Lockout-Governed Spraying",
                    "Token & Session Replay",
                    "Consent-Grant Abuse",
                    "Device-Code Phishing",
                    "MFA-Bypass Testing",
                  ].map((technique) => (
                    <span
                      key={technique}
                      className="px-3 py-1.5 bg-white/[0.03] border border-orange-500/[0.12] rounded-lg text-xs font-mono text-orange-200/70"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <StaggerChildren className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { value: "60", label: "Identity Tests" },
                    { value: "6", label: "Identity Providers" },
                    { value: "52", label: "Dedicated Tools" },
                  ].map((stat) => (
                    <StaggerItem key={stat.label}>
                      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] text-center">
                        <div className="text-3xl font-bold font-mono">
                          <GradientText from="from-orange-400" via="via-red-400" to="to-amber-300">
                            {stat.value}
                          </GradientText>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">{stat.label}</div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerChildren>

                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                  <p className="text-xs font-mono text-slate-500 mb-4 tracking-wider">PROVIDERS COVERED</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Active Directory",
                      "Microsoft Entra ID",
                      "Microsoft 365",
                      "Okta",
                      "Google Workspace",
                      "Ping Identity",
                    ].map((provider) => (
                      <div key={provider} className="flex items-center text-sm text-slate-300">
                        <KeyRound className="w-3.5 h-3.5 text-orange-400/70 mr-2 flex-shrink-0" />
                        {provider}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deployment & Data Residency */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  Your Findings Never Leave Your Account
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Penetration test results are some of the most sensitive data your
                  organization owns. Maestro's architecture keeps them that way.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Database,
                  title: "Customer-Owned Data Plane",
                  description:
                    "Assessment data, findings, and reports live in your AWS account — the backend, database, and storage all deploy inside your VPC. Nothing is copied to Groovy; Groovy holds only the licensing plane.",
                },
                {
                  icon: Lock,
                  title: "Read-Only Cloud Access",
                  description:
                    "Cloud assessments assume a read-only IAM role built on AWS's managed SecurityAudit policy — no write permissions, and secret values are never readable. Proof of impact without production risk.",
                },
                {
                  icon: Container,
                  title: "Isolated, Scope-Enforced Testing",
                  description:
                    "Offensive tooling runs in a dedicated Kali Linux container under your control. Every tool call is validated against your engagement scope — out-of-scope targets are refused and destructive exploits are banned.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.title}>
                    <div className="h-full p-8 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-orange-500/30 transition-all duration-300">
                      <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-orange-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Integration Points */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  Integration Points
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Maestro fits into your existing workflow — pushing findings and reports
                  where your team already works.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
              {integrations.map((integration, index) => (
                <StaggerItem key={index}>
                  <HoloCard className="p-5 text-center" glowColor="rgba(249, 115, 22, 0.3)">
                    <h3 className="text-sm font-bold text-white mb-1">{integration.name}</h3>
                    <p className="text-xs text-slate-500">{integration.description}</p>
                  </HoloCard>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
