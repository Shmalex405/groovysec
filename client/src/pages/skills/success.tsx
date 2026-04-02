import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  PageTransition,
  ScrollReveal,
} from "@/components/motion";
import {
  CheckCircle,
  ExternalLink,
  Copy,
  Shield,
  BookOpen,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const INVITE_URL = "https://bufnwjyzqigmivzqy3fpu5ei5m0bfrft.lambda-url.us-west-2.on.aws/";

export default function SkillsSuccess() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INVITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                  Purchase{" "}
                  <GradientText from="from-emerald-400" to="to-teal-300">
                    Successful
                  </GradientText>
                </h1>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  Welcome to Groovy Security Skills. You now have lifetime access to all 111 enterprise-grade secure AI skills.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <GlassCard className="p-8 lg:p-10" glowColor="rgba(16,185,129,0.1)">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Access Your Skills</h2>
                    <p className="text-sm text-slate-400">Use the link below to get started</p>
                  </div>
                </div>

                {/* Invite Link */}
                <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 mb-6">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                    Your Invite Link
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-emerald-400 bg-slate-950/50 rounded-lg px-4 py-3 border border-white/[0.06] font-mono truncate">
                      {INVITE_URL}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                      title="Copy link"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <a href={INVITE_URL} target="_blank" rel="noopener noreferrer" className="block">
                  <GradientButton variant="default" className="w-full py-4 text-base rounded-xl btn-animate-colors">
                    Open Invite Portal <ExternalLink className="w-4 h-4 ml-2" />
                  </GradientButton>
                </a>
              </GlassCard>
            </ScrollReveal>

            {/* Quick Start Steps */}
            <ScrollReveal delay={0.5}>
              <div className="mt-10">
                <h3 className="text-lg font-bold text-white mb-6 text-center">Quick Start</h3>
                <div className="grid gap-4">
                  {[
                    {
                      step: "1",
                      icon: ExternalLink,
                      title: "Accept Your Invite",
                      description: "Click the link above to access the Groovy Skills repository and accept your invite.",
                    },
                    {
                      step: "2",
                      icon: Terminal,
                      title: "Clone the Repository",
                      description: "Clone the repository for global access, or add to your project's skills directory.",
                    },
                    {
                      step: "3",
                      icon: BookOpen,
                      title: "Configure & Deploy",
                      description: "Add groovy-policy.yaml to customize rules, then start using skills in your AI agents.",
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

            <ScrollReveal delay={0.6}>
              <div className="text-center mt-10">
                <p className="text-sm text-slate-500 mb-4">
                  Need help? Reach out to{" "}
                  <a href="mailto:support@groovysec.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    support@groovysec.com
                  </a>
                </p>
                <a href="/skills" className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1 rotate-180" /> Back to Skills
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
