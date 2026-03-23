import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
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
} from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
  AnimatedCounter,
} from "@/components/motion";

export default function Maestro() {
  const stats = [
    { value: "13", label: "AI AGENTS", code: "001" },
    { value: "112", label: "MCP TOOLS", code: "002" },
    { value: "116", label: "TEST MATRIX", code: "003" },
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
  ];

  const features = [
    { icon: Bug, title: "Red Team Exploitation", description: "Most tools stop at detection. Maestro goes further — testing and validating every finding through controlled exploitation to prove real-world impact. You get confirmed, exploitable vulnerabilities, not a list of theoretical risks." },
    { icon: Layers, title: "116-Test Assessment Matrix", description: "Structured assessment framework with 73 DAST tests, 24 SAST tests, 11 cross-validation tests, and 8 chain analysis tests — ensuring consistent, deterministic coverage across every engagement." },
    { icon: SplitSquareVertical, title: "Dual-Track DAST + SAST", description: "Parallel dynamic and static analysis with cross-validation. Static findings enriched with source code context and validated against live endpoints." },
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
                      Powered by AI
                    </h1>
                  </HeroLine>

                  <HeroLine>
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                      Maestro deploys 13 specialized AI agents to autonomously discover
                      vulnerabilities and validate them through real red team-style
                      exploitation — proving impact with actual attack paths, not just
                      scanner output. Continuous assessments at a fraction of the time
                      and cost of traditional pentesting.
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
                    Built on Kali Linux · Enterprise-ready · SOC 2 in progress
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
                  13 Specialized AI Agents
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Each agent is purpose-built for a specific phase of the penetration
                  testing lifecycle — from reconnaissance and code intelligence through
                  red team exploitation, attack chain analysis, compliance mapping, and validated reporting.
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
              {[...agents.slice(0, 7), ...agents.slice(0, 7)].map((agent, index) => {
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
              {[...agents.slice(7), ...agents.slice(7)].map((agent, index) => {
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
                  <GlassCard className="p-5 text-center">
                    <h3 className="text-sm font-bold text-white mb-1">{integration.name}</h3>
                    <p className="text-xs text-slate-500">{integration.description}</p>
                  </GlassCard>
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
