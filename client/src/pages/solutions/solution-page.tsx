import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ComplianceFrameworks } from "@/components/compliance-frameworks";
import { PlatformIntegrations } from "@/components/platform-integrations";
import { EnforcementSurfaces } from "@/components/whiteout-differentiators";
import { PromptInterceptionDemo } from "@/components/prompt-interception-demo";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import { usePageMeta } from "@/lib/use-page-meta";
import { ArrowRight, CheckCircle, Calendar } from "lucide-react";
import NotFound from "@/pages/not-found";
import { getSolution } from "./data";

export default function SolutionPage({ slug }: { slug: string }) {
  const solution = getSolution(slug);
  if (!solution) return <NotFound />;
  return <SolutionContent key={solution.slug} solution={solution} />;
}

function SolutionContent({
  solution,
}: {
  solution: NonNullable<ReturnType<typeof getSolution>>;
}) {
  usePageMeta(solution.metaTitle, solution.metaDescription);

  return (
    <AuroraBackground variant="bluegreen" className="min-h-screen">
      <Navigation />

      <PageTransition>
        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-[#0F1B2D]">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-md bg-[#1A5FB4]/10 border border-[#1A5FB4]/25 text-sm mb-6">
                  <span className="font-semibold text-[#0F1B2D]">Whiteout AI</span>
                  <span className="w-px h-3.5 bg-[#1A5FB4]/30" />
                  <span className="text-[#1A5FB4] text-xs font-semibold uppercase tracking-[0.18em]">
                    {solution.eyebrow.replace(/^Solutions —\s*/, "")}
                  </span>
                </div>

                <HeroTextReveal>
                  <HeroLine>
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                      {solution.headline.lead}
                      <span className="block text-[#1A5FB4]">
                        {solution.headline.gradient}
                      </span>
                      {solution.headline.tail}
                    </h1>
                  </HeroLine>

                  <HeroLine>
                    <p className="text-lg text-[#51617A] mb-8 leading-relaxed">
                      {solution.intro}
                    </p>
                  </HeroLine>
                </HeroTextReveal>

                <ScrollReveal delay={0.5}>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link href="/demo">
                      <GradientButton variant="blue">
                        <Calendar className="w-5 h-5 mr-2" />
                        {solution.ctaLabel}
                      </GradientButton>
                    </Link>
                  </div>

                  <div className="text-sm text-[#51617A] flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    SOC 2 Type II in progress • NVIDIA Inception member
                  </div>
                </ScrollReveal>
              </div>

              {/* Stat cards */}
              <StaggerChildren className="grid grid-cols-2 gap-4">
                {solution.stats.map((stat) => (
                  <StaggerItem key={stat.label}>
                    <div className="bg-white rounded-xl p-6 border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] text-center hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300">
                      <div className="text-3xl font-bold text-[#1A5FB4] mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-[#51617A]">{stat.label}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* Live interception demo */}
        <section className="pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <PromptInterceptionDemo />
              <p className="mt-5 text-sm text-[#6E7B8C] max-w-xl mx-auto">
                Every prompt intercepted, evaluated against 60+ policies, and
                enforced in real time — before sensitive data ever leaves your network.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Value props */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  {solution.valuePropsHeading}
                </h2>
                <p className="text-lg text-[#51617A] max-w-3xl mx-auto">
                  {solution.valuePropsSubheading}
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8">
              {solution.valueProps.map((prop) => (
                <StaggerItem key={prop.title}>
                  <div className="p-8 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300 h-full">
                    <h3 className="text-xl font-bold text-[#0F1B2D] mb-4">{prop.title}</h3>
                    <ul className="space-y-3">
                      {prop.items.map((item) => (
                        <li key={item} className="flex items-start text-sm text-[#51617A]">
                          <CheckCircle className="w-4 h-4 text-[#2E7D32] mr-2 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Shared, already-vetted sections */}
        <EnforcementSurfaces />
        <ComplianceFrameworks />
        <PlatformIntegrations />

        {/* CTA */}
        <ScrollReveal>
          <section className="py-24 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-6 tracking-tight">
                Ready to Govern AI with Confidence?
              </h2>
              <p className="text-lg text-[#51617A] mb-8 max-w-2xl mx-auto">
                See Whiteout AI inspect, evaluate, and enforce policy on real AI
                traffic in a live walkthrough tailored to your requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <GradientButton variant="blue">
                    {solution.ctaLabel}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GradientButton>
                </Link>
                <Link href="/whiteout-ai/security-whitepaper">
                  <GradientButton variant="white">Read the Whitepaper</GradientButton>
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </PageTransition>

      <Footer />
    </AuroraBackground>
  );
}
