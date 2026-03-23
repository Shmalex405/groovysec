import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { PlatformOverview } from "@/components/platform-overview";
import { ArchitectureFlow } from "@/components/architecture-flow";
import { PolicyWorkflow } from "@/components/policy-workflow";
import { InterceptorPlatforms } from "@/components/guard-platforms";
import { PlatformIntegrations } from "@/components/platform-integrations";
import { SecurityCompliance } from "@/components/security-compliance";
import { ComplianceFrameworks } from "@/components/compliance-frameworks";
import { Footer } from "@/components/footer";
import { VideoSection } from "@/components/video-section";
import { GlassCard } from "@/components/ui/glass-card";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ArrowRight, Building2, GraduationCap, BookOpen } from "lucide-react";
import {
  PageTransition,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

export default function WhiteoutAI() {
  return (
    <PageTransition>
      <AuroraBackground variant="bluegreen" className="min-h-screen bg-slate-950">
        <Navigation />
        <HeroSection />
        <ArchitectureFlow />
        <PlatformIntegrations />
        <ComplianceFrameworks />
        <PlatformOverview />
        <SecurityCompliance />

        {/* Learn More Links */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Learn More</h2>
                <p className="text-base text-slate-400">
                  Explore how Whiteout AI serves specific industries and use cases.
                </p>
              </div>
            </ScrollReveal>
            <StaggerChildren className="grid md:grid-cols-3 gap-4">
              {[
                {
                  href: "/whiteout-ai/government",
                  icon: Building2,
                  title: "Government & Public Sector",
                  description: "AI governance built for the compliance and transparency demands of the public sector.",
                  color: "blue" as const,
                },
                {
                  href: "/whiteout-ai/academic-integrity",
                  icon: GraduationCap,
                  title: "Academic Integrity",
                  description: "Uphold academic standards while enabling AI as a legitimate learning resource.",
                  color: "emerald" as const,
                },
                {
                  href: "/whiteout-ai/security-whitepaper",
                  icon: BookOpen,
                  title: "Security Whitepaper",
                  description: "A deep dive into Whiteout AI's architecture, compliance, and security design.",
                  color: "orange" as const,
                },
              ].map((item) => {
                const Icon = item.icon;
                const colorMap = {
                  blue: { icon: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", link: "text-blue-400" },
                  emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", link: "text-emerald-400" },
                  orange: { icon: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", link: "text-orange-400" },
                };
                const colors = colorMap[item.color];
                return (
                  <StaggerItem key={item.href}>
                    <Link href={item.href}>
                      <GlassCard className="p-6 cursor-pointer h-full">
                        <div className={`w-10 h-10 ${colors.bg} ${colors.border} border rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className={`w-5 h-5 ${colors.icon}`} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-400 mb-4">{item.description}</p>
                        <span className={`${colors.link} font-medium text-sm flex items-center`}>
                          Read More <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </span>
                      </GlassCard>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
