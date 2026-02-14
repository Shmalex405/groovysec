import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Calendar,
  Award,
} from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

export default function CompanyHome() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Hero Section */}
        <section className="pt-24 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    Securing AI.
                  </span>
                  <br />
                  Automating Security.
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Groovy Security builds enterprise-grade cybersecurity products that protect
                  organizations in the AI era — from governing how your teams use AI to
                  automating how you test your defenses.
                </p>
              </HeroLine>
            </HeroTextReveal>
            <ScrollReveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/whiteout-ai">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                  >
                    Explore Products
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-[#F08C00] hover:bg-white/10 hover:text-white px-8 py-4 text-lg font-semibold"
                  >
                    Request Demo
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Product Cards */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Products</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Two platforms, one mission — giving organizations complete control over
                  AI security and automated defense.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8">
              {/* Whiteout AI Card */}
              <StaggerItem>
                <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <img src="/transparent_logo.png" alt="Whiteout AI" className="w-14 h-14 mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Whiteout AI</h3>
                  <p className="text-slate-600 mb-6">
                    Enterprise AI governance platform that intercepts, evaluates, and enforces
                    compliance policies on every AI interaction — before sensitive data ever
                    leaves your network.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {[
                      "Real-time prompt interception across browser & desktop",
                      "65+ pre-built compliance policies (HIPAA, GDPR, FERPA, SOX)",
                      "LLM-powered contextual evaluation — not keyword matching",
                      "Complete audit trail with SIEM/SOC integration",
                      "Complete isolated internal chat models for data sensitive prompts",
                    ].map((item) => (
                      <li key={item} className="flex items-start text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/whiteout-ai">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </StaggerItem>

              {/* Maestro Card */}
              <StaggerItem>
                <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <img src="/transparent_logo.png" alt="Maestro" className="w-14 h-14 mb-4 grayscale opacity-70" />
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Maestro</h3>
                  <p className="text-slate-600 mb-6">
                    AI-driven automated penetration testing platform that deploys 7 specialized
                    agents to find vulnerabilities and validate them through real red team-style
                    exploitation — proving actual impact, not just scanner output.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {[
                      "Red team exploitation that tests and validates every finding",
                      "7 AI agents covering the full pentest lifecycle end-to-end",
                      "Locally deployed — all data and vulnerability info stays on your network",
                      "Integrates with Jira, SharePoint & email",
                    ].map((item) => (
                      <li key={item} className="flex items-start text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/maestro">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Built by Security Professionals
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Groovy Security was founded by cybersecurity professionals who saw the
                  critical gaps in AI governance and security testing firsthand — and built
                  the products to close them.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <StaggerItem>
                <div className="text-center p-8 bg-white rounded-2xl border border-slate-200">
                  <div className="w-14 h-14 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Founded 2025</h3>
                  <p className="text-sm text-slate-600">
                    Purpose-built from day one to solve AI-era security challenges.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center p-8 bg-white rounded-2xl border border-slate-200">
                  <div className="w-14 h-14 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Enterprise-Grade</h3>
                  <p className="text-sm text-slate-600">
                    Built for organizations that require the highest security and compliance standards.
                  </p>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                See how Groovy Security's products can help your organization secure AI
                usage and automate security testing.
              </p>
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  Request a Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
