import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
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
  ClipboardList,
  RefreshCw,
  Server,
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
    { value: "7", label: "AI Agents" },
    { value: "Kali", label: "Linux Powered" },
    { value: "Auto", label: "Report Generation" },
    { value: "Local", label: "Deployment" },
  ];

  const agents = [
    {
      icon: Search,
      title: "Recon Agent",
      description: "Automated reconnaissance and asset discovery across target surfaces, identifying domains, subdomains, open ports, and exposed services.",
      color: "blue",
    },
    {
      icon: Scan,
      title: "Vulnerability Scanner",
      description: "Systematic vulnerability identification using industry-standard tools and AI-enhanced detection for known CVEs and misconfigurations.",
      color: "green",
    },
    {
      icon: Globe,
      title: "Web App Agent",
      description: "Deep web application testing including OWASP Top 10 coverage, authentication bypass, injection flaws, and business logic vulnerabilities.",
      color: "orange",
    },
    {
      icon: Bug,
      title: "Exploit Agent",
      description: "Red team-style exploitation that goes beyond detection — actively testing and validating findings through controlled, real-world attack paths to prove actual impact and exploitability.",
      color: "blue",
    },
    {
      icon: CheckCircle,
      title: "QA Agent",
      description: "Quality assurance validation that verifies findings, eliminates false positives, and ensures every reported vulnerability is reproducible.",
      color: "green",
    },
    {
      icon: FileText,
      title: "Report Agent",
      description: "Professional report generation with executive summaries, technical details, risk ratings, and remediation guidance for every finding.",
      color: "orange",
    },
    {
      icon: Shield,
      title: "Security Scan Agent",
      description: "Continuous security scanning and compliance checks that monitor for new exposures and configuration drift over time.",
      color: "blue",
    },
  ];

  const features = [
    {
      icon: Bug,
      title: "Red Team Exploitation",
      description: "Most tools stop at detection. Maestro goes further — testing and validating every finding through controlled exploitation to prove real-world impact. You get confirmed, exploitable vulnerabilities, not a list of theoretical risks.",
    },
    {
      icon: Zap,
      title: "Autonomous Testing",
      description: "Deploy agents and let them work autonomously — Maestro coordinates the full pentest lifecycle from reconnaissance through exploitation to reporting.",
    },
    {
      icon: ClipboardList,
      title: "Findings Management",
      description: "Centralized findings dashboard with severity ratings, exploitation evidence, and remediation tracking across all assessments.",
    },
    {
      icon: FileText,
      title: "Report Generation",
      description: "Automated professional reports with executive summaries, technical breakdowns, exploitation proof, and prioritized remediation steps — ready for stakeholders.",
    },
    {
      icon: RefreshCw,
      title: "Continuous Assessment",
      description: "Schedule recurring assessments to catch new vulnerabilities as your infrastructure evolves — not just point-in-time snapshots.",
    },
  ];

  const integrations = [
    { name: "Jira", description: "Create tickets for findings automatically" },
    { name: "SharePoint", description: "Publish reports to document libraries" },
    { name: "Email", description: "Stakeholder notifications and summaries" },
  ];

  const colorClasses: Record<string, { bg: string; icon: string }> = {
    blue: { bg: "bg-blue-600/10", icon: "text-blue-600" },
    green: { bg: "bg-green-600/10", icon: "text-green-600" },
    orange: { bg: "bg-orange-600/10", icon: "text-orange-600" },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-500/10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <HeroTextReveal>
                  <HeroLine>
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 mb-6">
                      <Target className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">AI-Driven Penetration Testing</span>
                    </div>
                  </HeroLine>

                  <HeroLine>
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                      Automated
                      <span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        Penetration Testing
                      </span>
                      Powered by AI
                    </h1>
                  </HeroLine>

                  <HeroLine>
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                      Maestro deploys 7 specialized AI agents to autonomously discover
                      vulnerabilities and validate them through real red team-style
                      exploitation — proving impact with actual attack paths, not just
                      scanner output. Continuous assessments at a fraction of the time
                      and cost of traditional pentesting.
                    </p>
                  </HeroLine>
                </HeroTextReveal>

                <ScrollReveal delay={0.5}>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link href="/demo">
                      <Button
                        size="lg"
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold"
                      >
                        Request Demo
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  <div className="text-sm text-slate-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Built on Kali Linux · Enterprise-ready · SOC 2 in progress
                  </div>
                </ScrollReveal>
              </div>

              {/* Stats Cards */}
              <StaggerChildren className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <StaggerItem key={index}>
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 text-center hover:border-orange-500/50 transition-all duration-300">
                      <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-300 bg-clip-text text-transparent mb-2">
                        <AnimatedCounter value={stat.value} />
                      </div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* Agent Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  7 Specialized AI Agents
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Each agent is purpose-built for a specific phase of the penetration
                  testing lifecycle — from initial discovery through red team exploitation
                  and validated reporting.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent, index) => {
                const Icon = agent.icon;
                const colors = colorClasses[agent.color];
                return (
                  <StaggerItem key={index}>
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{agent.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{agent.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-500/5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Everything you need to run professional-grade penetration tests — automated.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const colorList = [
                  "text-red-400",
                  "text-orange-400",
                  "text-blue-400",
                  "text-green-400",
                  "text-orange-400",
                ];
                return (
                  <StaggerItem key={index}>
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700">
                      <div className="flex items-center mb-4">
                        <Icon className={`w-7 h-7 ${colorList[index]} mr-3`} />
                        <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Integration Points */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Integration Points
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Maestro fits into your existing workflow — pushing findings and reports
                  where your team already works.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-6">
              {integrations.map((integration, index) => (
                <StaggerItem key={index}>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 text-center">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{integration.name}</h3>
                    <p className="text-sm text-slate-600">{integration.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Local Deployment */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                <div className="p-10 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center">
                        <Server className="w-10 h-10 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Locally Deployed. Fully Secure.
                      </h2>
                      <p className="text-lg text-slate-600 leading-relaxed mb-4">
                        Maestro runs entirely on your own infrastructure — no data, vulnerability findings, or
                        exploitation results ever leave your network. All 7 agents operate locally, giving you
                        full control over sensitive security data and meeting the strictest data residency requirements.
                      </p>
                      <ul className="space-y-2">
                        {[
                          "All pentest data stays on your network — nothing leaves your perimeter",
                          "Full control over vulnerability and exploitation findings",
                          "Meets strict data residency and compliance requirements",
                        ].map((item) => (
                          <li key={item} className="flex items-start text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
