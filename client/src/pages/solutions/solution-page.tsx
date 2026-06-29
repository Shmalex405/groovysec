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
    <AuroraBackground variant="bluegreen" className="min-h-screen bg-slate-950">
      <Navigation />

      <PageTransition>
        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/20 text-sm mb-6">
                  <span className="font-semibold text-white">Whiteout AI</span>
                  <span className="w-px h-3.5 bg-blue-400/30" />
                  <span className="text-blue-400 text-xs font-medium uppercase tracking-[0.16em]">
                    {solution.eyebrow.replace(/^Solutions —\s*/, "")}
                  </span>
                </div>

                <HeroTextReveal>
                  <HeroLine>
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                      {solution.headline.lead}
                      <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                        {solution.headline.gradient}
                      </span>
                      {solution.headline.tail}
                    </h1>
                  </HeroLine>

                  <HeroLine>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed">
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

                  <div className="text-sm text-slate-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    SOC 2 Type II in progress • NVIDIA Inception member
                  </div>
                </ScrollReveal>
              </div>

              {/* Stat cards */}
              <StaggerChildren className="grid grid-cols-2 gap-4">
                {solution.stats.map((stat) => (
                  <StaggerItem key={stat.label}>
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] text-center hover:border-blue-500/50 transition-all duration-300">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
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
              <p className="mt-5 text-sm text-slate-500 max-w-xl mx-auto">
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
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                  {solution.valuePropsHeading}
                </h2>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                  {solution.valuePropsSubheading}
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8">
              {solution.valueProps.map((prop) => (
                <StaggerItem key={prop.title}>
                  <div className="p-8 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 h-full">
                    <h3 className="text-xl font-bold text-white mb-4">{prop.title}</h3>
                    <ul className="space-y-3">
                      {prop.items.map((item) => (
                        <li key={item} className="flex items-start text-sm text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
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
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                Ready to Govern AI with Confidence?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
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
                  <GradientButton variant="default">Read the Whitepaper</GradientButton>
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
