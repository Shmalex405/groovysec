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
  ShieldCheck,
  Lock,
  Server,
  Database,
  Timer,
  Mail,
  ArrowRight,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";

export default function Security() {
  usePageMeta(
    "Trust & Security",
    "How Groovy Security secures its own products — SOC 2 Type II in progress, encryption in transit and at rest, isolated per-customer deployments, audit logging, and a 48-hour critical patch commitment."
  );

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Compliance Program",
      items: [
        "SOC 2 Type II certification in progress",
        "Security-first development lifecycle",
        "NVIDIA Inception program member",
        "Documented threat models for our products",
      ],
    },
    {
      icon: Lock,
      title: "Encryption Everywhere",
      items: [
        "TLS for all data in transit",
        "Encryption at rest for databases and storage",
        "Managed key services (KMS) for key material",
        "Platform-native credential storage on endpoints",
      ],
    },
    {
      icon: Server,
      title: "Isolated Deployments",
      items: [
        "Per-organization isolated infrastructure stacks",
        "Self-hosted option runs in your own cloud account",
        "Maestro findings stay in the customer's data plane",
        "Private networking for inference workloads",
      ],
    },
    {
      icon: Database,
      title: "Data Ownership & Audit",
      items: [
        "Your data stays yours — exportable on request",
        "Complete audit trails across all products",
        "SIEM/SOC delivery of security events",
        "Sensitive content excluded from system logs",
      ],
    },
    {
      icon: Timer,
      title: "Vulnerability Management",
      items: [
        "Critical Secure AI Skills patches within 48 hours",
        "Continuous dependency and supply-chain scanning",
        "Our own products are tested with Maestro",
        "Coordinated disclosure welcomed",
      ],
    },
    {
      icon: Mail,
      title: "Report a Concern",
      items: [
        "Security reports: support@groovysec.com",
        "Acknowledgement target: 2 business days",
        "Good-faith research will never be penalized",
        "Encrypted channels available on request",
      ],
    },
  ];

  return (
    <PageTransition>
      <AuroraBackground variant="bluegreen" className="min-h-screen bg-slate-950">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-gradient-hero animate-gradient-flow">
                  Trust & Security
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  We're a security company — so we hold our own products to the
                  standard we'd demand from any vendor. Here's how Groovy
                  Security protects your data across Whiteout AI, Maestro, and
                  Secure AI Skills.
                </p>
              </HeroLine>
            </HeroTextReveal>

            <ScrollReveal delay={0.4}>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-slate-500">
                {[
                  "SOC 2 Type II in progress",
                  "Encryption in transit & at rest",
                  "48-hour critical patch commitment",
                ].map((item) => (
                  <span key={item} className="flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                    {item}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Pillars */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <StaggerItem key={pillar.title}>
                    <div className="h-full p-8 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:shadow-2xl hover:shadow-black/20 transition-all duration-300">
                      <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-4">{pillar.title}</h3>
                      <ul className="space-y-2.5">
                        {pillar.items.map((item) => (
                          <li key={item} className="flex items-start text-sm text-slate-400">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                Questions for Our Security Team?
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                Security questionnaires, architecture reviews, or compliance
                mapping requests — we're happy to walk through any of it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <GradientButton variant="blue">
                    Schedule a Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </GradientButton>
                </Link>
                <Link href="/whiteout-ai/security-whitepaper">
                  <GradientButton variant="default">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Product Whitepaper
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
