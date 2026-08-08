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
import { PromptInterceptionDemo } from "@/components/prompt-interception-demo";
import { MaestroAssessmentDemo } from "@/components/maestro-assessment-demo";
import { SpinningMark } from "@/components/ui/spinning-mark";

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
      "Free autonomous penetration testing platform that deploys 24 specialized agents to find vulnerabilities and validate them through real red team-style exploitation — proving actual impact, not just scanner output.",
    bullets: [
      "Free to use, with the source public and auditable",
      "Red team exploitation that tests and validates every finding",
      "24 AI agents with 227 MCP tools covering the full pentest lifecycle",
      "234-test assessment matrix for consistent, deterministic coverage",
      "Runs on your machine — findings and target data never leave it",
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
      ? "text-[#51617A]"
      : tone === "overlay-blue"
        ? "text-blue-100/80"
        : "text-orange-100/80";
  const listClass =
    tone === "front"
      ? "text-[#51617A]"
      : tone === "overlay-blue"
        ? "text-blue-100/70"
        : "text-orange-100/70";
  const checkClass = tone === "front" ? "text-[#2E7D32]" : "text-emerald-300";
  const titleClass = tone === "front" ? "text-[#0F1B2D]" : "text-white";

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        {logo}
        <h3 className={`text-2xl font-bold ${titleClass}`}>{product.name}</h3>
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
      <AuroraBackground variant="mixed" className="min-h-screen">
        <Navigation />

        {/* Hero Section */}
        <section className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-5xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight text-[#0F1B2D]">
                  The AI Era Demands
                  <br />
                  a New Kind of Security
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg text-[#51617A] max-w-2xl mx-auto mb-10 leading-relaxed">
                  Groovy Security gives enterprises the tools to govern AI usage, prevent
                  data leakage, and automate security testing — purpose-built for a world
                  where AI is both the innovator and the risk.
                </p>
              </HeroLine>
            </HeroTextReveal>

            <ScrollReveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#products">
                  <GradientButton variant="blue">
                    Explore Products
                  </GradientButton>
                </a>
                <Link href="/demo">
                  <GradientButton variant="white">
                    Request Demo
                  </GradientButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Product Cards */}
        <section id="products" className="py-24 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  Our Products
                </h2>
                <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
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
                        logo={<SpinningMark alt="Whiteout AI" className="w-10 h-10" />}
                        buttonVariant="blue"
                        tone="overlay-blue"
                      />
                    </div>
                  }
                >
                  <div className="p-8 flex flex-col">
                    <ProductCardBody
                      product={PRODUCTS.whiteout}
                      logo={<SpinningMark alt="Whiteout AI" className="w-10 h-10" />}
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
                        logo={<SpinningMark alt="Maestro" className="w-10 h-10 grayscale brightness-200" />}
                        buttonVariant="orange"
                        tone="overlay-orange"
                      />
                    </div>
                  }
                >
                  <div className="p-8 flex flex-col">
                    <ProductCardBody
                      product={PRODUCTS.maestro}
                      logo={<SpinningMark alt="Maestro" className="w-10 h-10 grayscale" />}
                      buttonVariant="orange"
                      tone="front"
                    />
                  </div>
                </RevealCard>
              </StaggerItem>
            </StaggerChildren>

            {/* Both products running live — stacked full width so each demo
                keeps its natural scale (text-center matches the hero context
                the Whiteout demo was designed in) */}
            <ScrollReveal>
              <div className="mt-16 space-y-8 text-center">
                <PromptInterceptionDemo />
                <MaestroAssessmentDemo />
                <p className="text-sm text-[#51617A] max-w-2xl mx-auto">
                  The idea is simple. Whiteout AI governs every prompt before it
                  leaves your network. Maestro proves every vulnerability with
                  real exploitation. Defense and offense for the AI era.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <ComplianceFrameworksCompact />

        {/* Company Overview */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  Built by Security Professionals
                </h2>
                <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
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
                return (
                  <StaggerItem key={item.title}>
                    <GlassCard className="relative p-6 text-center">
                      <h3 className="text-lg font-bold text-[#0F1B2D] mb-2">{item.title}</h3>
                      <p className="text-sm text-[#51617A]">{item.description}</p>
                    </GlassCard>
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
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-6 tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-[#51617A] mb-10 max-w-xl mx-auto">
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
