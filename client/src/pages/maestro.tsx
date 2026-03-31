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
  Shield,
  Globe,
  Bug,
  CheckCircle,
  FileText,
  Scan,
  ArrowRight,
  Zap,
  Server,
  Network,
  Scale,
  Code,
  KeyRound,
  Layers,
  SplitSquareVertical,
  Cloud,
  CloudCog,
  Container,
  Database,
  Lock,
  Cpu,
  ChevronRight,
} from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
  AnimatedCounter,
  BlurredStaggerText,
} from "@/components/motion";

export default function Maestro() {
  const [expandedDomain, setExpandedDomain] = useState<number | null>(null);
  const stats = [
    { value: "15", label: "AI AGENTS", code: "001" },
    { value: "142", label: "MCP TOOLS", code: "002" },
    { value: "147", label: "TEST MATRIX", code: "003" },
    { value: "Kali", label: "LINUX POWERED", code: "004" },
  ];

  const agents = [
    { icon: Search, title: "Recon Agent", description: "Automated reconnaissance and asset discovery across target surfaces, identifying domains, subdomains, open ports, and exposed services.", color: "orange" as const },
    { icon: Scan, title: "Vulnerability Scanner", description: "Systematic vulnerability identification using industry-standard tools and AI-enhanced detection for known CVEs and misconfigurations.", color: "red" as const },
    { icon: Globe, title: "Web App Agent", description: "Deep web application testing including OWASP Top 10 coverage, authentication bypass, injection flaws, and business logic vulnerabilities.", color: "amber" as const },
    { icon: Bug, title: "Exploit Agent", description: "Red team-style exploitation that goes beyond detection — actively testing and validating findings through controlled, real-world attack paths to prove actual impact and exploitability.", color: "orange" as const },
    { icon: CheckCircle, title: "QA Agent", description: "Quality assurance validation that verifies findings, eliminates false positives, and ensures every reported vulnerability is reproducible.", color: "red" as const },
    { icon: FileText, title: "Report Agent", description: "Professional report generation with executive summaries, technical details, risk ratings, and remediation guidance for every finding.", color: "amber" as const },
    { icon: Shield, title: "Security Scan Agent", description: "Continuous security scanning and compliance checks that monitor for new exposures and configuration drift over time.", color: "orange" as const },
    { icon: Network, title: "API Security Agent", description: "GraphQL introspection, REST API fuzzing, JWT analysis, IDOR testing, WebSocket security, and rate-limit validation.", color: "red" as const },
    { icon: Server, title: "Infra Security Agent", description: "SSL/TLS analysis, DNS security and DNSSEC validation, subdomain takeover detection, cloud metadata testing, and S3 bucket security checks.", color: "amber" as const },
    { icon: Scale, title: "Compliance Agent", description: "Automated mapping to OWASP Top 10, NIST 800-53, PCI-DSS, and CWE standards with CVSS v3.1 scoring for every finding.", color: "orange" as const },
    { icon: Code, title: "Code-Intel Agent", description: "Source code analysis that maps entry points, traces data flows, analyzes defenses, and generates attack surfaces from your codebase.", color: "red" as const },
    { icon: KeyRound, title: "Auth Agent", description: "Session establishment, OTP handling, token extraction, and multi-auth-type support including OAuth2, bearer, API key, and basic auth.", color: "amber" as const },
    { icon: Layers, title: "Chain Analysis Agent", description: "Multi-step attack chain hypothesis and validation — linking individual findings into compound exploit paths with severity recalculation and defense-in-depth analysis.", color: "orange" as const },
    { icon: Cloud, title: "Cloud Recon Agent", description: "Multi-cloud infrastructure discovery across AWS, Azure, and GCP — resource enumeration, IAM analysis, posture auditing, and misconfiguration detection for cloud-native environments.", color: "red" as const },
    { icon: CloudCog, title: "Cloud Exploit Agent", description: "Cloud-native red team exploitation — IAM privilege escalation chains, storage abuse, Kubernetes attacks, container escapes, serverless exploitation, and secrets extraction with validated proof of impact.", color: "amber" as const },
  ];

  const features = [
    { icon: Bug, title: "Full-Spectrum Red Team", description: "Controlled exploitation across web applications, APIs, cloud infrastructure, and Kubernetes — from OWASP Top 10 through IAM privilege escalation and container escapes. Proven impact, not theoretical risk." },
    { icon: Layers, title: "147-Test Assessment Matrix", description: "Structured assessment framework with 73 DAST tests, 29 cloud security tests, 24 SAST tests, 11 cross-validation tests, and 8 chain analysis tests — ensuring consistent, deterministic coverage across every engagement." },
    { icon: SplitSquareVertical, title: "Tri-Track Analysis", description: "Parallel dynamic, static, and cloud infrastructure analysis with cross-validation. Findings enriched with source code context, cloud posture data, and validated against live endpoints." },
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
      <AuroraBackground variant="orange" className="min-h-screen bg-[#0a0a0a]">
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
                      Maestro deploys 15 specialized AI agents to autonomously discover
                      vulnerabilities across web apps, APIs, cloud infrastructure, and
                      Kubernetes — then validates them through real red team-style
                      exploitation. Every finding comes with proof of impact, not just
                      scanner output.
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

            {/* Stats — Single horizontal row */}
            <StaggerChildren className="grid grid-cols-4 gap-3 mt-12 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <div className="bg-white/[0.02] backdrop-blur-xl rounded-xl p-4 border border-orange-500/[0.08] hover:border-orange-500/20 transition-all duration-500 text-center">
                    <div className="text-[10px] font-mono text-slate-600 mb-1 tracking-widest">
                      {stat.code} // {stat.label}
                    </div>
                    <div className="text-2xl font-bold font-mono">
                      <GradientText from="from-orange-400" via="via-red-400" to="to-amber-300">
                        <AnimatedCounter value={stat.value} />
                      </GradientText>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Agent Overview — Dual Marquee */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  15 Specialized AI Agents
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Each agent is purpose-built for a specific phase of the penetration
                  testing lifecycle — from reconnaissance and code intelligence through
                  web exploitation, cloud red teaming, attack chain analysis, compliance
                  mapping, and validated reporting.
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

          {/* Top row — scrolls right */}
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_100%)] mb-4">
            <div
              className="flex gap-4 w-max"
              style={{ animation: "marquee-right 30s linear infinite" }}
            >
              {[...agents.slice(0, 8), ...agents.slice(0, 8)].map((agent, index) => {
                const Icon = agent.icon;
                const colors = colorMap[agent.color];
                return (
                  <div
                    key={`top-${index}`}
                    className="flex-shrink-0 w-80 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.06] hover:border-orange-500/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 ${colors.bg} ${colors.border} border rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${colors.icon}`} />
                      </div>
                      <h3 className="text-sm font-bold text-white">{agent.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{agent.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom row — scrolls left */}
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_100%)]">
            <div
              className="flex gap-4 w-max"
              style={{ animation: "marquee-left 35s linear infinite" }}
            >
              {[...agents.slice(8), ...agents.slice(8)].map((agent, index) => {
                const Icon = agent.icon;
                const colors = colorMap[agent.color];
                return (
                  <div
                    key={`bottom-${index}`}
                    className="flex-shrink-0 w-80 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 hover:bg-white/[0.06] hover:border-orange-500/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 ${colors.bg} ${colors.border} border rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${colors.icon}`} />
                      </div>
                      <h3 className="text-sm font-bold text-white">{agent.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{agent.description}</p>
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
                    <span className="text-orange-400 font-bold">142</span>{" "}
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
                    <span className="text-orange-400 font-bold">147</span>{" "}
                    <span className="text-orange-300/70">TEST MATRIX</span>
                  </h3>
                </ScrollReveal>
                <GlassCard className="p-8">
                  <BlurredStaggerText
                    text="Maestro's structured assessment framework — a deterministic checklist ensuring every engagement covers the same 147 tests across DAST, SAST, cloud security, cross-validation, and chain analysis. No tester variance, no missed coverage. Every run produces consistent, comparable results."
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
                  {["AWS", "Azure", "GCP", "Kubernetes", "OWASP", "NIST"].map((badge) => (
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
              <div className="text-center mt-12">
                <Link href="/demo">
                  <GradientButton variant="orange">
                    Request a Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </GradientButton>
                </Link>
              </div>
            </ScrollReveal>
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
