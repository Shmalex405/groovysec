import { useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { cn } from "@/lib/utils";
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

/* ── Spotlight Card (cursor-following glow) ── */
function SpotlightCard({
  children,
  className,
  spotlightColor = "210",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--spot-x", `${e.clientX - left}px`);
    cardRef.current.style.setProperty("--spot-y", `${e.clientY - top}px`);
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => el.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(250px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(${spotlightColor} 80% 65% / 0.15), transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(300px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(${spotlightColor} 80% 65% / 0.4), transparent 70%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

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
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: "text-blue-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    icon: "text-emerald-400",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    icon: "text-orange-400",
  },
};

export default function Partners() {
  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero */}
        <section className="pt-36 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-400 text-sm mb-8">
                  <Handshake className="w-4 h-4 mr-2" />
                  Channel Partner Program
                </div>
              </HeroLine>
              <HeroLine>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                  Grow With{" "}
                  <span
                    className="bg-clip-text text-transparent animate-gradient-flow"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #1a5fb4, #2e7d32, #c77800, #1a5fb4)",
                      backgroundSize: "300% 100%",
                    }}
                  >
                    Groovy Security
                  </span>
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
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
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-4">
                  Coming Q2 2026
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Partner Portal Launching Soon
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
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
                <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                  Partnership Tracks
                </h2>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                  Choose the engagement model that fits your business.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-6">
              {partnerTracks.map((track) => {
                const colors = colorMap[track.accentColor];
                return (
                  <StaggerItem key={track.name}>
                    <SpotlightCard className="p-8 h-full flex flex-col" spotlightColor={track.spotlightHue}>
                      <div
                        className={`inline-flex self-start items-center px-3 py-1 rounded-full ${colors.bg} border ${colors.border} ${colors.text} text-xs font-medium uppercase tracking-wider mb-5`}
                      >
                        {track.name}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {track.name} Partner
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {track.description}
                      </p>
                      <ul className="space-y-3 mt-auto">
                        {track.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center text-sm text-slate-400"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </SpotlightCard>
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
                <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                  Why Partner With Us
                </h2>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                  Everything you need to succeed — from enablement to execution.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerBenefits.map((benefit) => (
                <StaggerItem key={benefit.title}>
                  <SpotlightCard className="p-6 h-full" spotlightColor={benefit.spotlightHue}>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </SpotlightCard>
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
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
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
                    <GradientButton variant="orange" className="text-base px-8 py-3">
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
