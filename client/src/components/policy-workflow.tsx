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
      description: "Request analyzed against your organization's security policies",
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
    blue: { icon: "text-[#1A5FB4]", bg: "bg-[#1A5FB4]/10", border: "border-[#1A5FB4]/20" },
    orange: { icon: "text-[#A05F00]", bg: "bg-[#A05F00]/10", border: "border-[#A05F00]/20" },
    emerald: { icon: "text-[#2E7D32]", bg: "bg-[#2E7D32]/10", border: "border-[#2E7D32]/20" },
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
              Policy Verification Workflow
            </h2>
            <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
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
                  <div className={`w-12 h-12 ${colors.bg} ${colors.border} border rounded-md flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h3 className="font-bold text-[#0F1B2D] text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-[#6E7B8C] leading-relaxed">{step.description}</p>

                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-[#0F1B2D]/15 to-transparent" />
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
