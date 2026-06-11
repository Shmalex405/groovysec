import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { RevealCard } from "@/components/ui/reveal-card";
import { HoloCard } from "@/components/ui/holo-card";
import { ArrowRight } from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import { usePageMeta } from "@/lib/use-page-meta";

// Single source for mission/vision copy — rendered on both the card front and
// its reveal overlay so the two can never drift apart.
const MISSION_VISION = [
  {
    title: "Our Mission",
    body: "To give every organization the tools to adopt AI safely and test their defenses continuously — without compromising on security, compliance, or operational speed.",
    accentColor: "#1a5fb4",
    accentDark: "#060e1f",
    glowColor: "rgba(26, 95, 180, 0.15)",
    overlayTextClass: "text-blue-100/80",
  },
  {
    title: "Our Vision",
    body: "A world where organizations can fully leverage AI's potential without risking data exposure, regulatory violations, or security breaches — where security enables innovation instead of blocking it.",
    accentColor: "#2e7d32",
    accentDark: "#061206",
    glowColor: "rgba(46, 125, 50, 0.15)",
    overlayTextClass: "text-emerald-100/80",
  },
];

export default function About() {
  usePageMeta(
    "About",
    "Groovy Security was founded in 2025 by cybersecurity professionals to close the critical gaps in AI governance and security testing — with offices in Utah and Ireland."
  );
  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-gradient-hero animate-gradient-flow">
                  Built by Security
                  <br />
                  Professionals
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Groovy Security was founded to close the critical gaps in AI governance
                  and security testing — building enterprise-grade products that
                  organizations can trust.
                </p>
              </HeroLine>
            </HeroTextReveal>
          </div>
        </section>

        {/* Founders */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">Our Founders</h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  The leadership team behind Groovy Security's mission.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  img: "/alex-flowers.jpeg",
                  name: "Alex Flowers",
                  role: "CEO & Founder",
                  color: "blue" as const,
                  bio: "Cybersecurity professional who founded Groovy Security in March 2025, driven by firsthand experience with the industry's critical AI security gaps and a vision for Groovy Security to be a leader in AI governance and broader cybersecurity innovation.",
                },
                {
                  img: "/joel-flowers.png",
                  name: "Joel Flowers",
                  role: "COO & Co-Founder",
                  color: "emerald" as const,
                  bio: "Master's in Information Security with over 25 years of business administration and teaching experience, bringing deep operational expertise to Groovy Security's mission.",
                },
                {
                  img: "/hanna-savchuk.jpeg",
                  name: "Hanna Savchuk",
                  role: "CMO",
                  color: "orange" as const,
                  bio: "Marketing and communications professional with a strong background in brand strategy, digital marketing, and go-to-market execution. Brings a data-driven approach to building Groovy Security's market presence and driving growth across enterprise cybersecurity audiences.",
                  imgPosition: "50% 25%",
                },
              ].map((founder) => {
                const colorMap = {
                  blue: "border-blue-500/30 shadow-blue-500/5",
                  emerald: "border-emerald-500/30 shadow-emerald-500/5",
                  orange: "border-orange-500/30 shadow-orange-500/5",
                };
                const roleColorMap = {
                  blue: "text-blue-400",
                  emerald: "text-emerald-400",
                  orange: "text-orange-400",
                };
                return (
                  <StaggerItem key={founder.name}>
                    <GlassCard className="p-8 text-center">
                      <img
                        src={founder.img}
                        alt={founder.name}
                        className={`w-28 h-28 rounded-2xl object-cover mx-auto mb-6 border-2 ${colorMap[founder.color]} shadow-lg`}
                        style={founder.imgPosition ? { objectPosition: founder.imgPosition } : undefined}
                      />
                      <h3 className="text-xl font-bold text-white mb-1">{founder.name}</h3>
                      <p className={`${roleColorMap[founder.color]} font-medium text-sm mb-4`}>{founder.role}</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{founder.bio}</p>
                    </GlassCard>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Mission & Vision — Holographic Cards with Reveal */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerChildren className="grid md:grid-cols-2 gap-6">
              {MISSION_VISION.map((item) => (
                <StaggerItem key={item.title}>
                  <RevealCard
                    accentColor={item.accentColor}
                    accentDark={item.accentDark}
                    overlay={
                      <div className="p-8 h-full">
                        <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                        <p className={`${item.overlayTextClass} leading-relaxed`}>{item.body}</p>
                      </div>
                    }
                  >
                    <HoloCard className="p-8 h-full" glowColor={item.glowColor}>
                      <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{item.body}</p>
                    </HoloCard>
                  </RevealCard>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                See What We're Building
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                Explore our products and see how Groovy Security is shaping the future
                of AI governance and automated security testing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/whiteout-ai">
                  <GradientButton variant="blue">
                    Whiteout AI <ArrowRight className="w-4 h-4 ml-2" />
                  </GradientButton>
                </Link>
                <Link href="/maestro">
                  <GradientButton variant="orange">
                    Maestro <ArrowRight className="w-4 h-4 ml-2" />
                  </GradientButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
