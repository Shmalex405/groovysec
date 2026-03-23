import { useRef, useEffect, useCallback } from "react";
import { Shield, Network, TrendingUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

/* ── Spotlight Card ── */
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
      {/* Spotlight glow that follows cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(250px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(${spotlightColor} 80% 65% / 0.15), transparent 70%)`,
        }}
      />
      {/* Spotlight border */}
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

export function PlatformOverview() {
  const features = [
    {
      icon: Shield,
      title: "Policy-First Security",
      description: "Every AI interaction is verified against your organization's policies before execution. Complete data isolation ensures sensitive information never leaves your environment.",
      benefits: [
        "Tailored policy enforcement",
        "Real-time compliance monitoring",
        "Automated audit trails"
      ],
      color: "blue" as const,
      spotlightHue: "210",
    },
    {
      icon: Network,
      title: "Seamless Integration",
      description: "Deploy to give access to your existing technology stack to internally query information. Native integrations with popular enterprise tools and platforms.",
      benefits: [
        "Jira, Confluence, GitHub",
        "Sharepoint, Googledrive, and more",
        "Enterprise SSO support"
      ],
      color: "emerald" as const,
      spotlightHue: "150",
    },
    {
      icon: TrendingUp,
      title: "Complete Visibility",
      description: "Comprehensive monitoring and analytics across your entire AI usage. Track compliance, identify risks, and optimize performance.",
      benefits: [
        "Real-time usage analytics",
        "Compliance reporting",
        "Risk assessment tools"
      ],
      color: "orange" as const,
      spotlightHue: "35",
    }
  ];

  const colorMap = {
    blue: { icon: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    orange: { icon: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Why Enterprises Choose Whiteout AI
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Complete AI governance solution designed for enterprise security, compliance, and operational excellence.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color];

            return (
              <StaggerItem key={index}>
                <SpotlightCard className="p-8 h-full" spotlightColor={feature.spotlightHue}>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-base text-slate-400">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0" />
                        {benefit}
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
  );
}
