import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { RevealCard } from "@/components/ui/reveal-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  ArrowRight,
  CheckCircle,
  Calendar,
  Award,
  MapPin,
  Shield,
  Target,
} from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import { ComplianceFrameworksCompact } from "@/components/compliance-frameworks";

export default function CompanyHome() {
  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero Section */}
        <section className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-400 text-sm mb-8">
                  Enterprise Cybersecurity for the AI Era
                </div>
              </HeroLine>
              <HeroLine>
                <h1
                  className="text-5xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight bg-clip-text text-transparent animate-gradient-flow"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #ffffff, #e2e8f0, #1a5fb4, #2e7d32, #c77800, #e2e8f0, #ffffff)",
                    backgroundSize: "300% 100%",
                  }}
                >
                  The AI Era Demands
                  <br />
                  a New Kind of Security
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Groovy Security gives enterprises the tools to govern AI usage, prevent data leakage, and automate security testing — purpose-built for a world where AI is both the innovator and the risk.
                </p>
              </HeroLine>
            </HeroTextReveal>

            <ScrollReveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/whiteout-ai">
                  <GradientButton variant="blue">
                    Explore Products
                  </GradientButton>
                </Link>
                <Link href="/demo">
                  <GradientButton variant="default">
                    Request Demo
                  </GradientButton>
                </Link>
              </div>
            </ScrollReveal>

            {/* Floating stats */}
            <ScrollReveal delay={0.6}>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                {[
                  { value: "65+", label: "AI Policies" },
                  { value: "12", label: "Regulatory Frameworks" },
                  { value: "23+", label: "AI Platforms" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Product Cards */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  Our Products
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Two platforms, one mission — giving organizations complete control over
                  AI security and automated defense.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-6">
              {/* Whiteout AI Card */}
              <StaggerItem>
                <RevealCard
                  accentColor="#1a5fb4"
                  accentDark="#060e1f"
                  className=""
                  overlay={
                    <div className="p-8 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                        <img src="/icononly_transparent_nobuffer.png" alt="Whiteout AI" className="w-10 h-10 object-contain" />
                        <h3 className="text-2xl font-bold text-white">Whiteout AI</h3>
                      </div>
                      <p className="text-blue-100/80 mb-6 leading-relaxed">
                        Enterprise AI governance platform that intercepts, evaluates, and enforces
                        compliance policies on every AI interaction — before sensitive data ever
                        leaves your network.
                      </p>
                      <ul className="space-y-2.5 mb-8">
                        {[
                          "Real-time prompt interception across browser, desktop, IDE, mobile & cloud",
                          "65+ pre-built compliance policies (HIPAA, GDPR, FERPA, SOX)",
                          "LLM-powered contextual evaluation — not keyword matching",
                          "Complete audit trail with SIEM/SOC integration",
                          "Complete isolated internal chat models for data sensitive prompts",
                        ].map((item) => (
                          <li key={item} className="flex items-start text-sm text-blue-100/70">
                            <CheckCircle className="w-4 h-4 text-emerald-300 mr-2.5 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto">
                        <Link href="/whiteout-ai">
                          <GradientButton variant="blue" className="min-w-0 px-6 py-3 text-sm">
                            Learn More <ArrowRight className="w-4 h-4 ml-2" />
                          </GradientButton>
                        </Link>
                      </div>
                    </div>
                  }
                >
                  <div className="p-8 bg-white/[0.03] backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <img src="/icononly_transparent_nobuffer.png" alt="Whiteout AI" className="w-10 h-10 object-contain" />
                      <h3 className="text-2xl font-bold text-white">Whiteout AI</h3>
                    </div>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      Enterprise AI governance platform that intercepts, evaluates, and enforces
                      compliance policies on every AI interaction — before sensitive data ever
                      leaves your network.
                    </p>
                    <ul className="space-y-2.5 mb-8">
                      {[
                        "Real-time prompt interception across browser, desktop, IDE, mobile & cloud",
                        "65+ pre-built compliance policies (HIPAA, GDPR, FERPA, SOX)",
                        "LLM-powered contextual evaluation — not keyword matching",
                        "Complete audit trail with SIEM/SOC integration",
                        "Complete isolated internal chat models for data sensitive prompts",
                      ].map((item) => (
                        <li key={item} className="flex items-start text-sm text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/whiteout-ai">
                      <GradientButton variant="blue" className="min-w-0 px-6 py-3 text-sm">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                      </GradientButton>
                    </Link>
                  </div>
                </RevealCard>
              </StaggerItem>

              {/* Maestro Card */}
              <StaggerItem>
                <RevealCard
                  accentColor="#8a3a1e"
                  accentDark="#0a0500"
                  className=""
                  overlay={
                    <div className="p-8 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                        <img src="/icononly_transparent_nobuffer.png" alt="Maestro" className="w-10 h-10 object-contain grayscale brightness-200" />
                        <h3 className="text-2xl font-bold text-white">Maestro</h3>
                      </div>
                      <p className="text-orange-100/80 mb-6 leading-relaxed">
                        AI-driven automated penetration testing platform that deploys 13 specialized
                        agents to find vulnerabilities and validate them through real red team-style
                        exploitation — proving actual impact, not just scanner output.
                      </p>
                      <ul className="space-y-2.5 mb-8">
                        {[
                          "Red team exploitation that tests and validates every finding",
                          "13 AI agents with 112 MCP tools covering the full pentest lifecycle",
                          "116-test assessment matrix for consistent, deterministic coverage",
                          "Locally deployed — all data and vulnerability info stays on your network",
                          "Assess vulnerability findings from other ASPM tools already implemented",
                        ].map((item) => (
                          <li key={item} className="flex items-start text-sm text-orange-100/70">
                            <CheckCircle className="w-4 h-4 text-emerald-300 mr-2.5 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto">
                        <Link href="/maestro">
                          <GradientButton variant="orange" className="min-w-0 px-6 py-3 text-sm">
                            Learn More <ArrowRight className="w-4 h-4 ml-2" />
                          </GradientButton>
                        </Link>
                      </div>
                    </div>
                  }
                >
                  <div className="p-8 bg-white/[0.03] backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <img src="/icononly_transparent_nobuffer.png" alt="Maestro" className="w-10 h-10 object-contain grayscale" />
                      <h3 className="text-2xl font-bold text-white">Maestro</h3>
                    </div>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      AI-driven automated penetration testing platform that deploys 13 specialized
                      agents to find vulnerabilities and validate them through real red team-style
                      exploitation — proving actual impact, not just scanner output.
                    </p>
                    <ul className="space-y-2.5 mb-8">
                      {[
                        "Red team exploitation that tests and validates every finding",
                        "13 AI agents with 112 MCP tools covering the full pentest lifecycle",
                        "116-test assessment matrix for consistent, deterministic coverage",
                        "Locally deployed — all data and vulnerability info stays on your network",
                        "Assess vulnerability findings from other ASPM tools already implemented",
                      ].map((item) => (
                        <li key={item} className="flex items-start text-sm text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/maestro">
                      <GradientButton variant="orange" className="min-w-0 px-6 py-3 text-sm">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                      </GradientButton>
                    </Link>
                  </div>
                </RevealCard>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        <ComplianceFrameworksCompact />

        {/* Company Overview */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  Built by Security Professionals
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Based in Utah, Groovy Security was founded by cybersecurity professionals
                  who saw the critical gaps in AI governance and opportunities in security testing firsthand
                  — and built the products to close them.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Calendar,
                  title: "Founded 2025",
                  description: "Purpose-built from day one to solve AI-era security challenges.",
                  color: "blue",
                },
                {
                  icon: MapPin,
                  title: "US & EU Presence",
                  description: "With offices in Utah and Ireland.",
                  color: "orange",
                },
                {
                  icon: Award,
                  title: "Enterprise-Grade",
                  description: "Built for organizations that require the highest security and compliance standards.",
                  color: "emerald",
                },
              ].map((item) => {
                const glowColorMap: Record<string, string> = {
                  blue: "#1a5fb4",
                  orange: "#c77800",
                  emerald: "#2e7d32",
                };
                const glowColor = glowColorMap[item.color];
                return (
                  <StaggerItem key={item.title}>
                    <div className="relative group">
                      {/* Glow behind card */}
                      <div
                        className="absolute -inset-1 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-pulse"
                        style={{
                          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                        }}
                      />
                      <GlassCard className="relative p-6 text-center">
                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </GlassCard>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                See how Groovy Security's products can help your organization secure AI
                usage and automate security testing.
              </p>
              <Link href="/demo">
                <GradientButton variant="blue">
                  Request a Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </GradientButton>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
