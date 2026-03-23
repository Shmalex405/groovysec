import { Link } from "wouter";
import { useRef, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { RevealCard } from "@/components/ui/reveal-card";
import { cn } from "@/lib/utils";
import { ArrowRight, Shield, Lightbulb } from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

/* ── Holographic Card ── */
function HoloCard({
  children,
  className,
  glowColor,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const rotateX = (y - 0.5) * -12;
    const rotateY = (x - 0.5) * 12;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    cardRef.current.style.setProperty("--glow-x", `${x * 100}%`);
    cardRef.current.style.setProperty("--glow-y", `${y * 100}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-transform duration-300 ease-out",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glow that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 60%)`,
        }}
      />
      {/* Holographic shimmer border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(300px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor.replace("0.15", "0.5")}, transparent 60%)`,
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

export default function About() {
  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1
                  className="text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight bg-clip-text text-transparent animate-gradient-flow"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #ffffff, #e2e8f0, #1a5fb4, #2e7d32, #c77800, #e2e8f0, #ffffff)",
                    backgroundSize: "300% 100%",
                  }}
                >
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
              <StaggerItem>
                <RevealCard
                  accentColor="#1a5fb4"
                  accentDark="#060e1f"
                  overlay={
                    <div className="p-8 h-full">
                      <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                      <p className="text-blue-100/80 leading-relaxed">
                        To give every organization the tools to adopt AI safely and test their
                        defenses continuously — without compromising on security, compliance,
                        or operational speed.
                      </p>
                    </div>
                  }
                >
                  <HoloCard className="p-8 h-full" glowColor="rgba(26, 95, 180, 0.15)">
                    <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                    <p className="text-slate-400 leading-relaxed">
                      To give every organization the tools to adopt AI safely and test their
                      defenses continuously — without compromising on security, compliance,
                      or operational speed.
                    </p>
                  </HoloCard>
                </RevealCard>
              </StaggerItem>
              <StaggerItem>
                <RevealCard
                  accentColor="#2e7d32"
                  accentDark="#061206"
                  overlay={
                    <div className="p-8 h-full">
                      <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                      <p className="text-emerald-100/80 leading-relaxed">
                        A world where organizations can fully leverage AI's potential without
                        risking data exposure, regulatory violations, or security breaches —
                        where security enables innovation instead of blocking it.
                      </p>
                    </div>
                  }
                >
                  <HoloCard className="p-8 h-full" glowColor="rgba(46, 125, 50, 0.15)">
                    <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                    <p className="text-slate-400 leading-relaxed">
                      A world where organizations can fully leverage AI's potential without
                      risking data exposure, regulatory violations, or security breaches —
                      where security enables innovation instead of blocking it.
                    </p>
                  </HoloCard>
                </RevealCard>
              </StaggerItem>
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
