import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
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
  Award,
  BarChart3,
  ShieldAlert,
  ExternalLink,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";

type Resource = {
  icon: typeof Award;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  link: { label: string; href: string; external: boolean };
};

export default function Resources() {
  usePageMeta(
    "News & Research",
    "News and research from Groovy Security — NVIDIA Inception membership, the public 15,915-prompt Whiteout AI compliance benchmark, and our audit of community AI skill security."
  );

  const resources: Resource[] = [
    {
      icon: BarChart3,
      tag: "RESEARCH",
      tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
      title: "Whiteout AI Compliance Benchmark — Published Openly",
      description:
        "We published the full 15,915-prompt benchmark used to evaluate Whiteout AI's compliance engine — spanning all nine policy domains, from short prompts to long-form documents, with safe, violation, and edge-case scenarios. The engine scores 99.19% overall. The dataset is open so customers and researchers can verify the results themselves.",
      link: {
        label: "Explore the dataset on Hugging Face",
        href: "https://huggingface.co/datasets/ShmalexFlow/whiteout-compliance-benchmark",
        external: true,
      },
    },
    {
      icon: ShieldAlert,
      tag: "RESEARCH",
      tagColor: "bg-red-500/15 text-red-400 border-red-500/25",
      title: "The State of Community AI Skill Security",
      description:
        "Groovy Security audited community skill repositories used by AI agents and found that 41% contain vulnerabilities, 99.3% lack permission manifests, and 12% contain malware. These findings drove the design of Secure AI Skills — 111 production-grade, OWASP ASI Top 10-audited skills with zero external dependencies.",
      link: {
        label: "See Secure AI Skills",
        href: "/skills",
        external: false,
      },
    },
    {
      icon: Award,
      tag: "NEWS",
      tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
      title: "Groovy Security Joins NVIDIA Inception",
      description:
        "Groovy Security is a member of NVIDIA Inception, the program that supports startups building with accelerated computing and AI. The membership supports the GPU-accelerated inference behind Whiteout AI's full-LLM compliance engine.",
      link: {
        label: "About NVIDIA Inception",
        href: "https://www.nvidia.com/en-us/startups/",
        external: true,
      },
    },
  ];

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-gradient-hero animate-gradient-flow">
                  News & Research
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  What we're building, publishing, and discovering about security
                  in the AI era.
                </p>
              </HeroLine>
            </HeroTextReveal>
          </div>
        </section>

        {/* Resource cards */}
        <section className="pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerChildren className="space-y-6">
              {resources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <StaggerItem key={resource.title}>
                    <article className="p-8 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:shadow-2xl hover:shadow-black/20 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-slate-300" />
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border rounded ${resource.tagColor}`}>
                          {resource.tag}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-3">{resource.title}</h2>
                      <p className="text-sm text-slate-400 leading-relaxed mb-5">
                        {resource.description}
                      </p>
                      {resource.link.external ? (
                        <a
                          href={resource.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {resource.link.label}
                          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </a>
                      ) : (
                        <Link
                          href={resource.link.href}
                          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {resource.link.label}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      )}
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Whitepaper CTA */}
        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                Want the Deep Dive?
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                The Whiteout AI security whitepaper covers architecture, policy
                domains, and compliance design in detail.
              </p>
              <Link href="/whiteout-ai/security-whitepaper">
                <GradientButton variant="blue">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read the Whitepaper
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
