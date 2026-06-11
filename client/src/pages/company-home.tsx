import type { ReactNode } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { RevealCard } from "@/components/ui/reveal-card";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { usePageMeta } from "@/lib/use-page-meta";
import {
  ArrowRight,
  CheckCircle,
  Calendar,
  Award,
  MapPin,
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

// Single source for product card copy — rendered on both the card front and
// its reveal overlay so the two can never drift apart.
const PRODUCTS = {
  whiteout: {
    name: "Whiteout AI",
    href: "/whiteout-ai",
    description:
      "Enterprise AI governance platform that intercepts, evaluates, and enforces compliance policies on every AI interaction — before sensitive data ever leaves your network.",
    bullets: [
      "Real-time prompt interception across browser, desktop, IDE, mobile & cloud",
      "60+ pre-built compliance policies across 9 domains (HIPAA, GDPR, FERPA, SOX)",
      "Full-LLM contextual evaluation — not keyword matching",
      "Complete audit trail with SIEM/SOC integration",
      "Isolated internal chat models for data-sensitive prompts",
    ],
  },
  maestro: {
    name: "Maestro",
    href: "/maestro",
    description:
      "AI-driven automated penetration testing platform that deploys 18 specialized agents to find vulnerabilities and validate them through real red team-style exploitation — proving actual impact, not just scanner output.",
    bullets: [
      "Red team exploitation that tests and validates every finding",
      "18 AI agents with 203 MCP tools covering the full pentest lifecycle",
      "209-test assessment matrix for consistent, deterministic coverage",
      "Locally deployed — all data and vulnerability info stays on your network",
      "Assess vulnerability findings from other ASPM tools already implemented",
    ],
  },
};

function ProductCardBody({
  product,
  logo,
  buttonVariant,
  tone,
}: {
  product: (typeof PRODUCTS)[keyof typeof PRODUCTS];
  logo: ReactNode;
  buttonVariant: "blue" | "orange";
  tone: "front" | "overlay-blue" | "overlay-orange";
}) {
  const textClass =
    tone === "front"
      ? "text-slate-400"
      : tone === "overlay-blue"
        ? "text-blue-100/80"
        : "text-orange-100/80";
  const listClass =
    tone === "front"
      ? "text-slate-400"
      : tone === "overlay-blue"
        ? "text-blue-100/70"
        : "text-orange-100/70";
  const checkClass = tone === "front" ? "text-emerald-400" : "text-emerald-300";

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        {logo}
        <h3 className="text-2xl font-bold text-white">{product.name}</h3>
      </div>
      <p className={`${textClass} mb-6 leading-relaxed`}>{product.description}</p>
      <ul className="space-y-2.5 mb-8">
        {product.bullets.map((item) => (
          <li key={item} className={`flex items-start text-sm ${listClass}`}>
            <CheckCircle className={`w-4 h-4 ${checkClass} mr-2.5 flex-shrink-0 mt-0.5`} />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Link href={product.href}>
          <GradientButton variant={buttonVariant} className="min-w-0 px-6 py-3 text-sm">
            Learn More <ArrowRight className="w-4 h-4 ml-2" />
          </GradientButton>
        </Link>
      </div>
    </>
  );
}

export default function CompanyHome() {
  usePageMeta(
    undefined,
    "Groovy Security builds Whiteout AI (enterprise AI governance), Maestro (AI-driven penetration testing), and Secure AI Skills. Govern AI usage, prove compliance, and validate your defenses."
  );

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero Section */}
        <section className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-5xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight text-gradient-hero animate-gradient-flow">
                  The AI Era Demands
                  <br />
                  a New Kind of Security
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Groovy Security gives enterprises the tools to govern AI usage, prevent data leakage, and automate security testing
                  <br />
                  purpose-built for a world where AI is both the innovator and the risk.
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
                  { value: "60+", label: "AI Policies" },
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
                  Two flagship platforms, one mission — giving organizations complete
                  control over AI security and automated defense.
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
                      <ProductCardBody
                        product={PRODUCTS.whiteout}
                        logo={
                          <img
                            src="/icononly_transparent_nobuffer.png"
                            alt="Whiteout AI"
                            className="w-10 h-10 object-contain"
                          />
                        }
                        buttonVariant="blue"
                        tone="overlay-blue"
                      />
                    </div>
                  }
                >
                  <div className="p-8 bg-white/[0.03] backdrop-blur-xl flex flex-col">
                    <ProductCardBody
                      product={PRODUCTS.whiteout}
                      logo={
                        <img
                          src="/icononly_transparent_nobuffer.png"
                          alt="Whiteout AI"
                          className="w-10 h-10 object-contain"
                        />
                      }
                      buttonVariant="blue"
                      tone="front"
                    />
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
                      <ProductCardBody
                        product={PRODUCTS.maestro}
                        logo={
                          <img
                            src="/icononly_transparent_nobuffer.png"
                            alt="Maestro"
                            className="w-10 h-10 object-contain grayscale brightness-200"
                          />
                        }
                        buttonVariant="orange"
                        tone="overlay-orange"
                      />
                    </div>
                  }
                >
                  <div className="p-8 bg-white/[0.03] backdrop-blur-xl flex flex-col">
                    <ProductCardBody
                      product={PRODUCTS.maestro}
                      logo={
                        <img
                          src="/icononly_transparent_nobuffer.png"
                          alt="Maestro"
                          className="w-10 h-10 object-contain grayscale"
                        />
                      }
                      buttonVariant="orange"
                      tone="front"
                    />
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
