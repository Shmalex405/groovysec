import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { PageTransition, ScrollReveal } from "@/components/motion";
import {
  CheckCircle,
  Mail,
  BookOpen,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePageMeta } from "@/lib/use-page-meta";

export default function SkillsSuccess() {
  usePageMeta(
    "Request Received — Secure AI Skills",
    "Your Secure AI Skills access request has been received. We'll email you payment and repository access instructions shortly."
  );

  return (
    <PageTransition>
      <AuroraBackground variant="green" className="min-h-screen bg-slate-950">
        <Navigation />

        <section className="pt-32 pb-20 min-h-[80vh] flex items-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <ScrollReveal>
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </motion.div>

                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                  Request{" "}
                  <GradientText from="from-emerald-400" to="to-teal-300">
                    Received
                  </GradientText>
                </h1>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  Thanks for your interest in Groovy Security Skills. We'll review
                  your request and email you payment and repository access
                  instructions shortly.
                </p>
              </div>
            </ScrollReveal>

            {/* What happens next */}
            <ScrollReveal delay={0.3}>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-white mb-6 text-center">What Happens Next</h3>
                <div className="grid gap-4">
                  {[
                    {
                      step: "1",
                      icon: Mail,
                      title: "Check Your Email",
                      description:
                        "We'll reach out from alex@groovysec.com with payment details and your private repository invite.",
                    },
                    {
                      step: "2",
                      icon: Terminal,
                      title: "Clone the Repository",
                      description:
                        "Accept the invite, then clone the repository for global access or add it to your project's skills directory.",
                    },
                    {
                      step: "3",
                      icon: BookOpen,
                      title: "Configure & Deploy",
                      description:
                        "Add groovy-policy.yaml to customize rules, then start using all 111 skills in your AI agents.",
                    },
                  ].map((item, i) => (
                    <GlassCard key={i} className="p-5" hover={false}>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold text-emerald-400">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="text-center mt-10">
                <p className="text-sm text-slate-500 mb-6">
                  Questions? Reach out to{" "}
                  <a
                    href="mailto:support@groovysec.com"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    support@groovysec.com
                  </a>
                </p>
                <Link href="/skills">
                  <GradientButton variant="default" className="rounded-xl">
                    Back to Skills
                    <ArrowRight className="w-4 h-4 ml-2" />
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
