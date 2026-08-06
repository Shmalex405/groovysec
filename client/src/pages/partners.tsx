import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
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
  Handshake,
  ArrowRight,
  Mail,
  CheckCircle,
} from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";

const partnerBenefits = [
  {
    title: "Revenue Growth",
    description:
      "Competitive margins and deal registration protection on every opportunity you bring to the table.",
    spotlightHue: "210",
  },
  {
    title: "Sales Enablement",
    description:
      "Dedicated partner engineers, co-branded collateral, and technical training to close deals faster.",
    spotlightHue: "150",
  },
  {
    title: "Market Expansion",
    description:
      "Tap into growing demand for AI governance and automated penetration testing across every vertical.",
    spotlightHue: "35",
  },
  {
    title: "Technical Resources",
    description:
      "NFR licenses, sandbox environments, and priority access to new product releases and betas.",
    spotlightHue: "210",
  },
  {
    title: "Joint Go-to-Market",
    description:
      "Co-marketing campaigns, event sponsorships, and featured placement in our partner directory.",
    spotlightHue: "150",
  },
  {
    title: "Dedicated Support",
    description:
      "Named partner manager, escalation paths, and quarterly business reviews to drive mutual success.",
    spotlightHue: "35",
  },
];

const partnerTracks = [
  {
    name: "Reseller",
    description:
      "Sell Whiteout AI and Maestro directly to your customers with full margin and deal protection.",
    features: [
      "Tiered discount structure",
      "Deal registration & protection",
      "Co-branded proposals",
      "Sales engineering support",
    ],
    accentColor: "blue",
    spotlightHue: "210",
  },
  {
    name: "Referral",
    description:
      "Introduce qualified opportunities and earn referral fees — no selling required.",
    features: [
      "Simple referral fee structure",
      "Lead tracking portal",
      "Minimal commitment",
      "Quick onboarding",
    ],
    accentColor: "emerald",
    spotlightHue: "150",
  },
  {
    name: "Technology",
    description:
      "Integrate your platform with Groovy Security products to deliver joint value to shared customers.",
    features: [
      "API & integration support",
      "Joint solution briefs",
      "Technical co-development",
      "Shared customer success",
    ],
    accentColor: "orange",
    spotlightHue: "35",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  blue: {
    bg: "bg-[#1A5FB4]/10",
    border: "border-[#1A5FB4]/25",
    text: "text-[#1A5FB4]",
    icon: "text-[#1A5FB4]",
  },
  emerald: {
    bg: "bg-[#2E7D32]/10",
    border: "border-[#2E7D32]/25",
    text: "text-[#2E7D32]",
    icon: "text-[#2E7D32]",
  },
  orange: {
    bg: "bg-[#A05F00]/10",
    border: "border-[#A05F00]/25",
    text: "text-[#A05F00]",
    icon: "text-[#A05F00]",
  },
};

export default function Partners() {
  usePageMeta(
    "Partners",
    "Partner with Groovy Security — reseller, referral, and technology partnerships for Whiteout AI and Maestro."
  );
  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <div className="inline-flex items-center px-4 py-1.5 rounded-md bg-white border border-[#0F1B2D]/10 text-[#51617A] text-sm mb-8">
                  <Handshake className="w-4 h-4 mr-2" />
                  Channel Partner Program
                </div>
              </HeroLine>
              <HeroLine>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F1B2D] mb-6 leading-[1.1] tracking-tight">
                  Grow With{" "}
                  <span className="text-[#1A5FB4]">
                    Groovy Security
                  </span>
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg lg:text-xl text-[#51617A] max-w-2xl mx-auto mb-10 leading-relaxed">
                  Join our partner ecosystem and bring enterprise-grade AI governance and
                  automated penetration testing to your customers.
                </p>
              </HeroLine>
              <HeroLine>
                <Link href="/demo">
                  <GradientButton variant="default" className="text-base px-8 py-3">
                    Become a Partner
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </GradientButton>
                </Link>
              </HeroLine>
            </HeroTextReveal>
          </div>
        </section>

        {/* Coming Soon Banner */}
        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <GlassCard
                className="p-8 text-center"
                hover={false}
                glowColor="rgba(46,125,50,0.06)"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-md bg-[#2E7D32]/10 border border-[#2E7D32]/25 text-[#2E7D32] text-xs font-semibold uppercase tracking-[0.18em] mb-4">
                  Coming Q2 2026
                </div>
                <h3 className="text-xl font-semibold text-[#0F1B2D] mb-2">
                  Partner Portal Launching Soon
                </h3>
                <p className="text-[#51617A] text-sm leading-relaxed max-w-lg mx-auto">
                  We're building a dedicated partner portal with deal registration,
                  lead tracking, training resources, and co-branded marketing tools.
                  In the meantime, reach out directly to get started.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
        </section>

        {/* Partner Tracks */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] tracking-tight mb-4">
                  Partnership Tracks
                </h2>
                <p className="text-[#51617A] text-lg max-w-xl mx-auto">
                  Choose the engagement model that fits your business.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-6">
              {partnerTracks.map((track) => {
                const colors = colorMap[track.accentColor];
                return (
                  <StaggerItem key={track.name}>
                    <GlassCard className="p-8 h-full flex flex-col">
                      <div
                        className={`inline-flex self-start items-center px-3 py-1 rounded-md ${colors.bg} border ${colors.border} ${colors.text} text-xs font-semibold uppercase tracking-[0.18em] mb-5`}
                      >
                        {track.name}
                      </div>
                      <h3 className="text-xl font-semibold text-[#0F1B2D] mb-3">
                        {track.name} Partner
                      </h3>
                      <p className="text-[#51617A] text-sm leading-relaxed mb-6">
                        {track.description}
                      </p>
                      <ul className="space-y-3 mt-auto">
                        {track.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center text-sm text-[#51617A]"
                          >
                            <CheckCircle className="w-4 h-4 text-[#2E7D32] mr-2.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] tracking-tight mb-4">
                  Why Partner With Us
                </h2>
                <p className="text-[#51617A] text-lg max-w-xl mx-auto">
                  Everything you need to succeed — from enablement to execution.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerBenefits.map((benefit) => (
                <StaggerItem key={benefit.title}>
                  <GlassCard className="p-6 h-full">
                    <h3 className="text-lg font-semibold text-[#0F1B2D] mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-[#51617A] leading-relaxed">
                      {benefit.description}
                    </p>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <GlassCard
                className="p-12"
                hover={false}
                glowColor="rgba(26,95,180,0.06)"
              >
                <h2 className="text-3xl font-bold text-[#0F1B2D] mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-[#51617A] mb-8 max-w-md mx-auto">
                  Whether you're a reseller, consultant, or technology vendor —
                  we'd love to explore how we can grow together.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/demo">
                    <GradientButton variant="blue" className="text-base px-8 py-3">
                      Request Partnership Info
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </GradientButton>
                  </Link>
                  <a href="mailto:partners@groovysec.com">
                    <GradientButton variant="white" className="text-base px-8 py-3">
                      Contact Us — partners@groovysec.com
                    </GradientButton>
                  </a>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
