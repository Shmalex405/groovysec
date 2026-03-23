import { User, Search, Shield, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

export function PolicyWorkflow() {
  const steps = [
    {
      icon: User,
      title: "1. User Request",
      description: "User submits AI prompt",
      color: "blue" as const,
    },
    {
      icon: Search,
      title: "2. Policy Check",
      description: "Request analyzed against organizations security policies",
      color: "orange" as const,
    },
    {
      icon: Shield,
      title: "3. Data Protection",
      description: "Sensitive data filtered and secured before processing",
      color: "emerald" as const,
    },
    {
      icon: CheckCircle,
      title: "4. Secure Response",
      description: "If no policy violation, AI prompt sent with full audit trail",
      color: "blue" as const,
    }
  ];

  const colorMap = {
    blue: { icon: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    orange: { icon: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Policy Verification Workflow
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              See how Whiteout AI ensures every AI interaction meets your security and compliance requirements.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid md:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colors = colorMap[step.color];

            return (
              <StaggerItem key={index}>
                <GlassCard className="p-6 text-center h-full">
                  <div className={`w-12 h-12 ${colors.bg} ${colors.border} border rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>

                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-white/10 to-transparent" />
                  )}
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
