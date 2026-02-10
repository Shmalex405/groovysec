import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
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

export default function Government() {
  const scrollToDemo = () => {
    window.location.href = "/#demo";
  };

  const stats = [
    { value: "65+", label: "Pre-Built Policies" },
    { value: "99.5%", label: "Compliance Accuracy" },
    { value: "9", label: "Regulatory Categories" },
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
        'LLM-based evaluation understands context, not just keywords. It distinguishes between "aggregate hospital statistics" and actual patient data\u2014zero false negatives across 195 policy test scenarios.',
    },
    {
      icon: Server,
      title: "Deployment Flexibility",
      description:
        "Cloud, on-premise, or hybrid. Local Ollama support keeps sensitive prompts entirely within your network boundary\u2014ensuring full data sovereignty.",
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
    blue: { bg: "bg-blue-600/10", icon: "text-blue-600" },
    green: { bg: "bg-green-600/10", icon: "text-green-600" },
    orange: { bg: "bg-orange-600/10", icon: "text-orange-600" },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  Government & Public Sector
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                AI Governance
                <span className="block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                  Built for the
                </span>
                Public Sector
              </h1>

              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                As agencies rapidly adopt generative AI, Whiteout AI ensures
                every interaction complies with established policies — protecting
                sensitive data, enforcing regulatory requirements, and providing
                the transparency that public trust demands.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                  onClick={scrollToDemo}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Schedule a Briefing
                </Button>
              </div>

              <div className="text-sm text-slate-400 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Trusted by enterprise organizations • SOC 2 Type II in progress
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 text-center hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How Whiteout AI Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whiteout AI intercepts AI interactions across every surface —
              evaluating each prompt against organizational policies in real time
              before any data leaves the network.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coverageSurfaces.map((surface, index) => {
              const Icon = surface.icon;
              const colors = colorClasses[surface.color];

              return (
                <div
                  key={index}
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
              );
            })}
          </div>

          {/* Monitored Platforms */}
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

      {/* Intelligent Policy Engine */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-500/5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Intelligent Policy Engine
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                Unlike pattern-matching tools, Whiteout AI uses LLM-based
                contextual evaluation. It distinguishes between "aggregate
                hospital statistics" and actual patient data — dramatically
                reducing false positives while catching true violations.
              </p>

              <div className="space-y-4">
                {[
                  "65 pre-built policies across PHI, PII, GDPR, FERPA, SOX, PCI-DSS",
                  "Request custom policies tailored to agency-specific requirements",
                  "Group-based policy assignment for department-level control",
                  "Automatic redaction service generates compliant alternatives",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Policy Categories
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  "PHI",
                  "PII",
                  "GDPR",
                  "FERPA",
                  "Legal",
                  "Finance",
                  "Code/IP",
                  "Security",
                  "Confidential",
                ].map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-3 bg-blue-600/20 rounded-lg border border-blue-500/30 text-blue-300 text-sm font-medium"
                  >
                    {category}
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <div className="text-green-400 font-semibold text-sm flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  99.5% Accuracy — Zero False Negatives in Testing
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Government Value Proposition */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Built for Government & Public Sector
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Enterprise-grade security, compliance, and accountability designed
              to meet the demands of public sector AI governance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {complianceFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const colorList = [
                "bg-blue-600/10 text-blue-600",
                "bg-green-600/10 text-green-600",
                "bg-orange-600/10 text-orange-600",
                "bg-blue-600/10 text-blue-600",
              ];

              return (
                <div
                  key={index}
                  className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 ${colorList[index]} rounded-full flex items-center justify-center mr-4`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {feature.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start text-sm text-slate-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Whiteout AI
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Purpose-built for organizations that need to move fast with AI
              while maintaining complete control and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map((diff, index) => {
              const Icon = diff.icon;
              const colorList = [
                { bg: "bg-blue-600/10", text: "text-blue-600" },
                { bg: "bg-green-600/10", text: "text-green-600" },
                { bg: "bg-orange-600/10", text: "text-orange-600" },
              ];
              const colors = colorList[index];

              return (
                <div
                  key={index}
                  className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-6`}
                  >
                    <Icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {diff.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {diff.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Govern AI with Confidence?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            See how Whiteout AI can help your agency adopt AI safely while
            maintaining full compliance and public trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
              onClick={scrollToDemo}
            >
              Schedule a Briefing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-6">
            Whiteout AI by Groovy Security — Enterprise AI Governance
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
