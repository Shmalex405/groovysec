import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { LeadCapture } from "@/components/lead-capture";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  PageTransition,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import { MonitorPlay, MessagesSquare, Rocket, CheckCircle } from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";

export default function Demo() {
  usePageMeta(
    "Request a Demo",
    "Schedule a personalized demo of Whiteout AI, Maestro, or Secure AI Skills — a 30-minute walkthrough tailored to your stack and compliance requirements."
  );

  const steps = [
    {
      icon: MessagesSquare,
      title: "Tell Us About Your Stack",
      description:
        "A short conversation about your AI usage, compliance requirements, and what you want to protect or test.",
    },
    {
      icon: MonitorPlay,
      title: "See It Live",
      description:
        "A 30-minute walkthrough — watch Whiteout AI intercept real prompts, or see a Maestro assessment report end to end.",
    },
    {
      icon: Rocket,
      title: "Pilot Plan",
      description:
        "Leave with a concrete deployment plan, timeline, and pricing tailored to your organization.",
    },
  ];

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen">
        <Navigation />

        {/* What to expect */}
        <section className="pt-32 pb-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-10">
                <h1 className="text-4xl lg:text-5xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  See Groovy Security in Action
                </h1>
                <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
                  Here's what to expect from your demo — no slide decks, just the
                  products working on problems like yours.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-6 mb-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <StaggerItem key={step.title}>
                    <div className="h-full p-6 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] text-center">
                      <div className="w-10 h-10 bg-[#1A5FB4]/10 border border-[#1A5FB4]/25 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-5 h-5 text-[#1A5FB4]" />
                      </div>
                      <div className="text-xs uppercase tracking-[0.18em] font-semibold text-[#6E7B8C] mb-2">STEP {index + 1}</div>
                      <h3 className="text-sm font-bold text-[#0F1B2D] mb-2">{step.title}</h3>
                      <p className="text-xs text-[#51617A] leading-relaxed">{step.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>

            <ScrollReveal>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#6E7B8C]">
                {[
                  "NVIDIA Inception member",
                  "SOC 2 Type II in progress",
                  "US & EU presence",
                ].map((item) => (
                  <span key={item} className="flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32] mr-1.5" />
                    {item}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <ScrollReveal>
          <LeadCapture />
        </ScrollReveal>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
