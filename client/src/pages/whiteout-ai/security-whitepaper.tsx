import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CheckCircle,
  Monitor,
  Globe,
  Server,
  Lock,
  Eye,
  ArrowRight,
  Download,
  Zap,
  Layers,
  BookOpen,
  AlertTriangle,
  Scale,
  Cloud,
  Building2,
  Brain,
  BarChart3,
} from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

export default function SecurityWhitepaper() {
  const demoHref = "/demo";

  const stats = [
    { value: "65+", label: "Pre-Built Policies" },
    { value: "99.5%", label: "Compliance Accuracy" },
    { value: "9", label: "Regulatory Categories" },
    { value: "Sub-second", label: "Policy Evaluation" },
  ];

  const challenges = [
    {
      icon: AlertTriangle,
      title: "Data Breach Liability",
      description:
        "Information shared with external AI services may be stored, used for training, or inadvertently exposed.",
      color: "blue",
    },
    {
      icon: Scale,
      title: "Regulatory Violations",
      description:
        "HIPAA, GDPR, and industry-specific regulations prohibit sharing certain data categories with unauthorized third parties.",
      color: "green",
    },
    {
      icon: Lock,
      title: "Intellectual Property Loss",
      description:
        "Source code, algorithms, and trade secrets shared with AI services may lose legal protection.",
      color: "orange",
    },
    {
      icon: Eye,
      title: "Competitive Exposure",
      description:
        "Strategic plans, M&A details, and unreleased product information could reach competitors.",
      color: "blue",
    },
  ];

  const capabilities = [
    "Preventive Control \u2014 Sensitive data is blocked before it reaches external AI services",
    "Contextual Understanding \u2014 AI-powered analysis understands natural language context",
    "User Education \u2014 Clear feedback on policy violations creates a learning loop",
    "Zero Productivity Impact \u2014 Compliant prompts proceed with imperceptible latency",
  ];

  const howItWorks = [
    "Interface Detection",
    "Event Interception",
    "Content Extraction",
    "Compliance Evaluation",
    "Conditional Submission",
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
      title: "Developer Tools",
      description: "MCP protocol integration",
      color: "blue",
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

  const policyCategories = [
    { name: "PHI", count: 10, desc: "Protected Health Information" },
    { name: "PII", count: 12, desc: "Personally Identifiable Info" },
    { name: "Code/IP", count: 8, desc: "Source Code & Trade Secrets" },
    { name: "Legal", count: 6, desc: "Attorney-Client Privilege" },
    { name: "Confidential", count: 8, desc: "Business-Sensitive Data" },
    { name: "Finance", count: 4, desc: "Financial Data & Earnings" },
    { name: "GDPR", count: 7, desc: "EU Data Protection" },
    { name: "Security", count: 7, desc: "Infrastructure & Credentials" },
    { name: "Education", count: 3, desc: "FERPA & Research Data" },
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Authentication & Access Control",
      items: [
        "Industry-standard token-based auth with rotation",
        "SSO/SAML 2.0 \u2014 Okta, Azure AD, OneLogin, Ping Identity",
        "Device binding for enhanced session security",
        "Role-based access control with organization scoping",
      ],
    },
    {
      icon: Lock,
      title: "Data Protection",
      items: [
        "All credentials encrypted at rest with mandatory key management",
        "Platform-native secure storage (Keychain, Credential Manager)",
        "TLS encryption for all data in transit",
        "Intelligent rate limiting on all endpoints",
      ],
    },
    {
      icon: Eye,
      title: "Audit & Compliance",
      items: [
        "Immutable audit trail for every AI interaction",
        "Structured event logging \u2014 sensitive data never logged",
        "Real-time SIEM webhook delivery (Splunk, Sentinel, Elastic)",
        "Exportable compliance reports (PDF/CSV)",
      ],
    },
    {
      icon: Zap,
      title: "Fail-Safe Design",
      items: [
        "System never blocks productivity due to technical issues",
        "Distinct visual indicators for approved, blocked, and degraded states",
        "Graceful degradation with user notification",
        "Soft-allow ensures zero downtime impact",
      ],
    },
  ];

  const deploymentModels = [
    {
      icon: Cloud,
      title: "Cloud",
      description:
        "Standard deployment with cloud-hosted backend and managed infrastructure. Desktop apps distributed as native installers, extension published to browser stores.",
    },
    {
      icon: Server,
      title: "On-Premise",
      description:
        "Full on-premise deployment for highly regulated industries. All components run within your infrastructure using standard container orchestration.",
    },
    {
      icon: Layers,
      title: "Hybrid",
      description:
        "Backend in the cloud, compliance evaluation on-premise. Prompts are evaluated locally \u2014 only metadata is sent to the cloud for management.",
    },
  ];

  const useCases = [
    {
      icon: Building2,
      title: "Healthcare: HIPAA Compliance",
      description:
        "Healthcare organizations need AI productivity while preventing PHI disclosure.",
      items: [
        "10 PHI-specific policies covering all HIPAA identifiers",
        "Real-time blocking of patient names, MRNs, and diagnoses",
        "Aggregate statistics and operational queries remain allowed",
        "Complete audit trail for compliance audits",
      ],
    },
    {
      icon: BarChart3,
      title: "Financial Services: Insider Trading Prevention",
      description:
        "Prevent accidental disclosure of material non-public information (MNPI).",
      items: [
        "Block unreleased earnings data and financial forecasts",
        "Block M&A details before public announcement",
        "Allow public financial analysis and general queries",
      ],
    },
    {
      icon: Layers,
      title: "Technology: Source Code Protection",
      description:
        "Developers want AI assistance without exposing proprietary code.",
      items: [
        "Block API keys, database credentials, and encryption keys",
        "Block proprietary algorithms and trade secrets",
        "Allow general coding questions and open-source discussion",
      ],
    },
    {
      icon: Scale,
      title: "Legal: Privilege Protection",
      description:
        "Law firms need AI for document drafting without waiving privilege.",
      items: [
        "Block attorney-client communications",
        "Block case numbers and litigation strategy",
        "Allow general legal research queries",
      ],
    },
  ];

  const regulations = [
    {
      name: "HIPAA",
      full: "Health Insurance Portability and Accountability Act",
      items: [
        "Access controls for authorized personnel",
        "Complete audit trail of health data interactions",
        "Transmission security for PHI",
        "Minimum necessary enforcement",
      ],
    },
    {
      name: "GDPR",
      full: "General Data Protection Regulation",
      items: [
        "Data minimization \u2014 block personal data from external processing",
        "Purpose limitation with logged justification",
        "Accountability through audit trails",
        "Data subject rights support",
      ],
    },
    {
      name: "SOX",
      full: "Sarbanes-Oxley Act",
      items: [
        "Internal controls over financial data",
        "Immutable audit trail for all access",
        "Role-based access restrictions",
      ],
    },
    {
      name: "PCI-DSS",
      full: "Payment Card Industry Data Security Standard",
      items: [
        "Block cardholder data from external AI",
        "Access control for payment data",
        "Complete tracking and monitoring",
      ],
    },
  ];

  const integrations = [
    "GitHub",
    "Jira",
    "Confluence",
    "Slack",
    "Google Drive",
    "SharePoint",
    "and more",
  ];

  const colorClasses: Record<string, { bg: string; icon: string }> = {
    blue: { bg: "bg-blue-600/10", icon: "text-blue-600" },
    green: { bg: "bg-green-600/10", icon: "text-green-600" },
    orange: { bg: "bg-orange-600/10", icon: "text-orange-600" },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <PageTransition>
        {/* === HERO === */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <HeroTextReveal>
                  <HeroLine>
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-6">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        Security Whitepaper
                      </span>
                    </div>
                  </HeroLine>

                  <HeroLine>
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                      Enterprise AI
                      <span className="block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                        Security &amp; Compliance
                      </span>
                      Whitepaper
                    </h1>
                  </HeroLine>

                  <HeroLine>
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                      A comprehensive overview of how Whiteout AI enables
                      organizations to safely adopt generative AI tools while
                      enforcing compliance, data security, and auditability.
                    </p>
                  </HeroLine>
                </HeroTextReveal>

                <ScrollReveal delay={0.5}>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link href={demoHref}>
                      <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                      >
                        Schedule a Consultation
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <a
                      href="/WHITEOUT_AI_WHITEPAPER.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-white/30 text-[#F08C00] hover:bg-white/10 hover:text-white px-8 py-4 text-lg font-semibold w-full"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download PDF
                      </Button>
                    </a>
                  </div>

                  <div className="text-sm text-slate-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Whiteout AI by Groovy Security — Version 2.0 | February 2026
                  </div>
                </ScrollReveal>
              </div>

              <StaggerChildren className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <StaggerItem key={index}>
                    <div
                      className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 text-center hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* === THE CHALLENGE === */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  The Enterprise AI Governance Challenge
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Generative AI creates a new category of risk: conversational data
                  exfiltration. Employees share sensitive context in natural language
                  that traditional security tools cannot detect.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-6 mb-12">
              {challenges.map((challenge, index) => {
                const Icon = challenge.icon;
                const colors = colorClasses[challenge.color];
                return (
                  <StaggerItem key={index}>
                    <div
                      className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center mb-3">
                        <div
                          className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mr-4`}
                        >
                          <Icon className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {challenge.title}
                        </h3>
                      </div>
                      <p className="text-slate-600">{challenge.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>

            {/* Governance Gap callout */}
            <ScrollReveal>
              <div className="bg-slate-900 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  The Governance Gap
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      DLP Falls Short
                    </h4>
                    <p className="text-slate-300">
                      Data Loss Prevention systems designed for file transfers cannot
                      effectively analyze unstructured conversational AI
                      interactions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">
                      CASB Creates Crisis
                    </h4>
                    <p className="text-slate-300">
                      Blocking AI services entirely pushes usage to personal devices,
                      creating zero visibility into AI usage.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-400 mb-2">
                      Training Isn't Enough
                    </h4>
                    <p className="text-slate-300">
                      Employees have good intentions but lack expertise to identify
                      every category of sensitive data in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* === THE WHITEOUT AI APPROACH === */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-500/5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <ScrollReveal>
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Intelligent Interception with Contextual Compliance
                  </h2>
                  <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                    Rather than blocking AI tools or relying on post-hoc detection,
                    Whiteout AI evaluates every prompt and file upload against
                    organizational policies in real time — before any data reaches
                    external AI services.
                  </p>
                </ScrollReveal>
                <div className="space-y-4">
                  {capabilities.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <ScrollReveal>
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6 text-center">
                    How It Works
                  </h3>
                  <div className="space-y-3">
                    {howItWorks.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-blue-600/10 rounded-lg border border-blue-500/20"
                      >
                        <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-blue-300 font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-slate-200 font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-green-400 font-semibold text-sm flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Original submission proceeds only if compliant
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* === MULTI-SURFACE COVERAGE === */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Multi-Surface Coverage
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Unified policy enforcement across every AI touchpoint in your
                  organization.
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
                      className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
                    >
                      <div
                        className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className={`w-7 h-7 ${colors.icon}`} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {surface.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {surface.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>

            <div className="mt-12 text-center">
              <p className="text-sm font-medium text-slate-500 mb-4">
                AI Platforms Monitored
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {monitoredPlatforms.map((platform, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === INTELLIGENT POLICY ENGINE === */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <ScrollReveal>
                  <h2 className="text-4xl font-bold text-slate-900 mb-6">
                    Intelligent Policy Engine
                  </h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Unlike traditional DLP that relies on pattern matching, the
                    Compliance Engine uses AI-powered analysis to understand the
                    semantic meaning and context of every prompt.
                  </p>
                </ScrollReveal>

                <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Context Matters
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                        BLOCKED
                      </span>
                      <p className="text-slate-600 italic">
                        "Summarize the treatment plan for patient John A. Murphy,
                        DOB 03/12/1974, MRN 4583921. He was diagnosed with Type 2
                        Diabetes last month, his most recent HbA1c was 8.9%, and
                        he has been prescribed Metformin 1000mg twice daily. His
                        follow-up appointment is scheduled for March 3rd at St.
                        Vincent's Hospital."
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                        ALLOWED
                      </span>
                      <p className="text-slate-600 italic">
                        "Will you please give me a template for a discharge
                        summary that I could reuse for multiple patients?"
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Pattern matching flags both. Whiteout AI understands the first
                    contains real patient identifiers and protected health
                    information while the second is a generic template request
                    with no sensitive data.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "65 pre-built policies across 9 regulatory categories",
                    "Request custom policies tailored to your organization\u2019s specific rules",
                    "Group-based assignment for departmental compliance",
                    "Supports both cloud and on-premise LLM evaluation",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <ScrollReveal>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Policy Categories
                  </h3>
                </ScrollReveal>
                <div className="grid grid-cols-3 gap-3">
                  {policyCategories.map((cat, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300 text-center"
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {cat.count}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 mt-1">
                        {cat.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {cat.desc}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">65</span> total
                  policies across all categories
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === ENTERPRISE SECURITY === */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-500/5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Enterprise-Grade Security Architecture
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Built with security-first architecture to meet the strictest
                  enterprise and regulatory requirements.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const colorList = [
                  "text-blue-400",
                  "text-green-400",
                  "text-orange-400",
                  "text-blue-400",
                ];
                return (
                  <StaggerItem key={index}>
                    <div
                      className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700"
                    >
                      <div className="flex items-center mb-4">
                        <Icon
                          className={`w-6 h-6 ${colorList[index]} mr-3`}
                        />
                        <h3 className="text-lg font-bold text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {feature.items.map((item, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300">{item}</span>
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

        {/* === DEPLOYMENT FLEXIBILITY === */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Deployment Flexibility
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Deploy Whiteout AI in the model that matches your organization's
                  security requirements.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-8">
              {deploymentModels.map((model, index) => {
                const Icon = model.icon;
                const colorList = [
                  { bg: "bg-blue-600/10", text: "text-blue-600" },
                  { bg: "bg-green-600/10", text: "text-green-600" },
                  { bg: "bg-orange-600/10", text: "text-orange-600" },
                ];
                const colors = colorList[index];
                return (
                  <StaggerItem key={index}>
                    <div
                      className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div
                        className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-6`}
                      >
                        <Icon className={`w-8 h-8 ${colors.text}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">
                        {model.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {model.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* === ENTERPRISE USE CASES === */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Enterprise Use Cases
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Whiteout AI adapts to the specific compliance requirements of any
                  industry.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => {
                const Icon = useCase.icon;
                const colorList = [
                  "bg-blue-600/10 text-blue-600",
                  "bg-green-600/10 text-green-600",
                  "bg-orange-600/10 text-orange-600",
                  "bg-blue-600/10 text-blue-600",
                ];
                return (
                  <StaggerItem key={index}>
                    <div
                      className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center mb-3">
                        <div
                          className={`w-12 h-12 ${colorList[index]} rounded-full flex items-center justify-center mr-4`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {useCase.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        {useCase.description}
                      </p>
                      <ul className="space-y-2">
                        {useCase.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start text-sm text-slate-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
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

        {/* === REGULATORY COMPLIANCE === */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-500/5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Regulatory Compliance
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Purpose-built policy enforcement for major regulatory frameworks.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regulations.map((reg, index) => (
                <StaggerItem key={index}>
                  <div
                    className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700"
                  >
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {reg.name}
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{reg.full}</p>
                    <ul className="space-y-2">
                      {reg.items.map((item, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0 mt-1" />
                          <span className="text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* === INTEGRATION ECOSYSTEM === */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Integration Ecosystem
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Whiteout AI connects to your existing productivity tools, enabling
                  AI assistants to safely access organizational data through
                  authenticated, audited channels.
                </p>
              </div>
            </ScrollReveal>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {integrations.map((name, index) => (
                <span
                  key={index}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200"
                >
                  {name}
                </span>
              ))}
            </div>

            <p className="text-center text-sm text-slate-500 max-w-2xl mx-auto">
              Each integration has configurable access controls. Through the Model
              Context Protocol (MCP), external AI development tools can securely
              access organizational data with full authentication and audit
              logging.
            </p>
          </div>
        </section>

        {/* === CTA === */}
        <ScrollReveal>
          <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10"></div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Govern AI with Confidence?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                See how Whiteout AI can help your organization adopt AI safely while
                maintaining full compliance and data protection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={demoHref}>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                  >
                    Schedule a Consultation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-slate-400 mt-6">
                Whiteout AI by Groovy Security — Enterprise AI Governance
              </p>
            </div>
          </section>
        </ScrollReveal>
      </PageTransition>

      <Footer />
    </div>
  );
}
