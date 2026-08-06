import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import {
  Shield,
  CheckCircle,
  Monitor,
  Globe,
  Server,
  FileText,
  Lock,
  Eye,
  Users,
  ArrowRight,
  Zap,
  Layers,
  Building2,
} from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";

export default function Government() {
  usePageMeta(
    "Whiteout AI for Government & Public Sector",
    "AI governance built for the public sector — 60+ pre-built policies across 9 domains, greater than 99% benchmark accuracy, SSO/MDM/SIEM integration, and audit-ready proof of every AI control."
  );
  const demoHref = "/demo";

  const stats = [
    { value: "60+", label: "Pre-Built Policies" },
    { value: ">99%", label: "Benchmark Accuracy" },
    { value: "9", label: "Policy Domains" },
    { value: "<320ms", label: "Evaluation Latency (P95)" },
  ];

  const coverageSurfaces = [
    {
      icon: Globe,
      title: "Browser Extension",
      description: "Chrome, Firefox, Edge, and Safari",
      color: "blue",
    },
    {
      icon: Monitor,
      title: "Desktop Guard",
      description: "macOS & Windows native apps",
      color: "green",
    },
    {
      icon: Server,
      title: "Internal Secure AI",
      description: "Isolated, compliant AI workspace",
      color: "orange",
    },
    {
      icon: Layers,
      title: "MCP Protocol",
      description: "Developer tool integration",
      color: "blue",
    },
  ];

  const complianceFeatures = [
    {
      icon: Shield,
      title: "Regulatory Compliance",
      items: [
        "HIPAA, GDPR, FERPA, SOX, PCI-DSS policy enforcement",
        "Immutable audit trail for every AI interaction",
        "Exportable compliance reports (PDF/CSV) for auditors",
        "Proof-of-control documentation for regulatory review",
      ],
    },
    {
      icon: Lock,
      title: "Security & Data Protection",
      items: [
        "Real-time DLP \u2014 blocks sensitive data before it reaches AI providers",
        "File upload scanning \u2014 intercepts drag-drop, paste, and attachments",
        "Fail-safe design \u2014 never blocks due to technical failure",
        "Hybrid deployment \u2014 local LLM option keeps data on-premise",
      ],
    },
    {
      icon: Users,
      title: "Enterprise Administration",
      items: [
        "SSO/SAML 2.0 \u2014 Okta, Azure AD, OneLogin, Ping Identity",
        "MDM integration \u2014 Intune, Jamf, Workspace ONE",
        "SIEM/SOC integration \u2014 Splunk, Sentinel, Elastic, QRadar, S3",
        "Role-based access control with department-level scoping",
      ],
    },
    {
      icon: Eye,
      title: "Visibility & Accountability",
      items: [
        "Centralized dashboard with usage analytics and risk scoring",
        "Per-user and per-department compliance metrics",
        "Mobile device monitoring with AI app detection",
        "Complete searchable audit log with filtering and export",
      ],
    },
  ];

  const differentiators = [
    {
      icon: Zap,
      title: "Contextual Intelligence",
      description:
        'LLM-based evaluation understands context, not just keywords. It distinguishes between "aggregate hospital statistics" and actual patient data\u2014greater than 99% accuracy across a 15,915-prompt public benchmark, calibrated to allow legitimate work through.',
    },
    {
      icon: Server,
      title: "Deployment Flexibility",
      description:
        "Cloud, self-hosted, or hybrid. A self-hosted inference option keeps sensitive prompts entirely within your network boundary\u2014ensuring full data sovereignty.",
    },
    {
      icon: Layers,
      title: "Complete Coverage",
      description:
        "Browser, desktop, mobile, and developer tools. One platform governs every AI interaction across your entire organization from a single pane of glass.",
    },
  ];

  const monitoredPlatforms = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Copilot",
    "Perplexity",
    "Mistral",
    "Grok",
    "DeepSeek",
    "10+ more",
  ];

  const colorClasses: Record<string, { bg: string; icon: string }> = {
    blue: { bg: "bg-[#1A5FB4]/10", icon: "text-[#1A5FB4]" },
    green: { bg: "bg-[#2E7D32]/10", icon: "text-[#2E7D32]" },
    orange: { bg: "bg-[#A05F00]/10", icon: "text-[#A05F00]" },
  };

  return (
    <AuroraBackground variant="bluegreen" className="min-h-screen">
      <Navigation />

      <PageTransition>
        {/* Hero Section */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-[#0F1B2D]">
                <div className="inline-flex items-center px-4 py-2 rounded-md bg-[#1A5FB4]/10 text-[#1A5FB4] border border-[#1A5FB4]/25 mb-6">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    Government & Public Sector
                  </span>
                </div>

                <HeroTextReveal>
                  <HeroLine>
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                      AI Governance
                      <span className="block text-[#1A5FB4]">
                        Built for the
                      </span>
                      Public Sector
                    </h1>
                  </HeroLine>

                  <HeroLine>
                    <p className="text-lg text-[#51617A] mb-8 leading-relaxed">
                      As agencies rapidly adopt generative AI, Whiteout AI ensures
                      every interaction complies with established policies — protecting
                      sensitive data, enforcing regulatory requirements, and providing
                      the transparency that public trust demands.
                    </p>
                  </HeroLine>
                </HeroTextReveal>

                <ScrollReveal delay={0.5}>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link href={demoHref}>
                      <GradientButton variant="blue">
                        <FileText className="w-5 h-5 mr-2" />
                        Schedule a Briefing
                      </GradientButton>
                    </Link>
                  </div>

                  <div className="text-sm text-[#51617A] flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    SOC 2 Type II in progress • NVIDIA Inception member
                  </div>
                </ScrollReveal>
              </div>

              {/* Stats Cards */}
              <StaggerChildren className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <StaggerItem key={index}>
                    <div
                      className="bg-white rounded-xl p-6 border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] text-center hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300"
                    >
                      <div className="text-3xl font-bold text-[#1A5FB4] mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-[#51617A]">{stat.label}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  How Whiteout AI Works
                </h2>
                <p className="text-lg text-[#51617A] max-w-3xl mx-auto">
                  Whiteout AI intercepts AI interactions across every surface —
                  evaluating each prompt against organizational policies in real time
                  before any data leaves the network.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coverageSurfaces.map((surface, index) => {
                const Icon = surface.icon;
                const colors = colorClasses[surface.color];

                return (
                  <StaggerItem key={index}>
                    <div
                      className="p-6 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300 hover:-translate-y-1 text-center"
                    >
                      <h3 className="text-lg font-bold text-[#0F1B2D] mb-2">
                        {surface.title}
                      </h3>
                      <p className="text-sm text-[#51617A]">
                        {surface.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>

            {/* Monitored Platforms */}
            <div className="mt-12 text-center">
              <p className="text-sm font-medium text-[#6E7B8C] mb-4">
                AI Platforms Monitored
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {monitoredPlatforms.map((platform, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white text-[#51617A] rounded-md text-sm font-medium border border-[#0F1B2D]/10"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Intelligent Policy Engine */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <ScrollReveal>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-6 tracking-tight">
                    Intelligent Policy Engine
                  </h2>
                </ScrollReveal>
                <p className="text-lg text-[#51617A] mb-6 leading-relaxed">
                  Unlike pattern-matching tools, Whiteout AI uses LLM-based
                  contextual evaluation. It distinguishes between "aggregate
                  hospital statistics" and actual patient data — dramatically
                  reducing false positives while catching true violations.
                </p>

                <div className="space-y-4">
                  {[
                    "60+ pre-built policies across 9 domains covering PHI, PII, GDPR, FERPA, SOX, and PCI-DSS",
                    "Request custom policies tailored to agency-specific requirements",
                    "Group-based policy assignment for department-level control",
                    "Automatic redaction service generates compliant alternatives",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[#2E7D32] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-[#51617A]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]">
                <h3 className="text-xl font-semibold text-[#0F1B2D] mb-6 text-center">
                  Policy Categories
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "PHI",
                    "PII",
                    "GDPR",
                    "Education",
                    "Legal",
                    "Finance",
                    "Code/IP",
                    "Security",
                    "Confidential",
                  ].map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center p-3 bg-[#1A5FB4]/10 rounded-md border border-[#1A5FB4]/25 text-[#1A5FB4] text-sm font-medium"
                    >
                      {category}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <div className="text-[#2E7D32] font-semibold text-sm flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Greater Than 99% Accuracy on a 15,915-Prompt Public Benchmark
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Government Value Proposition */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  Built for Government & Public Sector
                </h2>
                <p className="text-lg text-[#51617A] max-w-3xl mx-auto">
                  Enterprise-grade security, compliance, and accountability designed
                  to meet the demands of public sector AI governance.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8">
              {complianceFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const colorList = [
                  "bg-[#1A5FB4]/10 text-[#1A5FB4]",
                  "bg-[#2E7D32]/10 text-[#2E7D32]",
                  "bg-[#A05F00]/10 text-[#A05F00]",
                  "bg-[#1A5FB4]/10 text-[#1A5FB4]",
                ];

                return (
                  <StaggerItem key={index}>
                    <div
                      className="p-8 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300"
                    >
                      <div className="flex items-center mb-4">
                        <h3 className="text-xl font-bold text-[#0F1B2D]">
                          {feature.title}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {feature.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start text-sm text-[#51617A]"
                          >
                            <CheckCircle className="w-4 h-4 text-[#2E7D32] mr-2 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Differentiators */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  Why Whiteout AI
                </h2>
                <p className="text-lg text-[#51617A] max-w-3xl mx-auto">
                  Purpose-built for organizations that need to move fast with AI
                  while maintaining complete control and compliance.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-8">
              {differentiators.map((diff, index) => {
                const Icon = diff.icon;
                const colorList = [
                  { bg: "bg-[#1A5FB4]/10", text: "text-[#1A5FB4]" },
                  { bg: "bg-[#2E7D32]/10", text: "text-[#2E7D32]" },
                  { bg: "bg-[#A05F00]/10", text: "text-[#A05F00]" },
                ];
                const colors = colorList[index];

                return (
                  <StaggerItem key={index}>
                    <div
                      className="p-8 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300 hover:-translate-y-1"
                    >
                      <h3 className="text-2xl font-bold text-[#0F1B2D] mb-4">
                        {diff.title}
                      </h3>
                      <p className="text-[#51617A] leading-relaxed">
                        {diff.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA Section */}
        <ScrollReveal>
          <section className="py-24 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-6 tracking-tight">
                Ready to Govern AI with Confidence?
              </h2>
              <p className="text-lg text-[#51617A] mb-8 max-w-2xl mx-auto">
                See how Whiteout AI can help your agency adopt AI safely while
                maintaining full compliance and public trust.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={demoHref}>
                  <GradientButton variant="blue">
                    Schedule a Briefing
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GradientButton>
                </Link>
              </div>
              <p className="text-sm text-[#6E7B8C] mt-6">
                Whiteout AI by Groovy Security — Enterprise AI Governance
              </p>
            </div>
          </section>
        </ScrollReveal>
      </PageTransition>

      <Footer />
    </AuroraBackground>
  );
}
