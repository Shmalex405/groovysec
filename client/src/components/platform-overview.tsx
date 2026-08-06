import { Shield, Network, TrendingUp, CheckCircle } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

export function PlatformOverview() {
  const features = [
    {
      icon: Shield,
      title: "Policy-First Security",
      description: "Every AI interaction is verified against your organization's policies before execution. Complete data isolation ensures sensitive information never leaves your environment.",
      benefits: [
        "Tailored policy enforcement",
        "Real-time compliance monitoring",
        "Automated audit trails"
      ],
      color: "blue" as const,
      spotlightHue: "210",
    },
    {
      icon: Network,
      title: "Seamless Integration",
      description: "Deploy to give access to your existing technology stack to internally query information. Native integrations with popular enterprise tools and platforms.",
      benefits: [
        "Jira, Confluence, GitHub",
        "SharePoint, Google Drive, and more",
        "Enterprise SSO support"
      ],
      color: "emerald" as const,
      spotlightHue: "150",
    },
    {
      icon: TrendingUp,
      title: "Complete Visibility",
      description: "Comprehensive monitoring and analytics across your entire AI usage. Track compliance, identify risks, and optimize performance.",
      benefits: [
        "Real-time usage analytics",
        "Compliance reporting",
        "Risk assessment tools"
      ],
      color: "orange" as const,
      spotlightHue: "35",
    }
  ];

  const colorMap = {
    blue: { icon: "text-[#1A5FB4]", bg: "bg-[#1A5FB4]/10", border: "border-[#1A5FB4]/25" },
    emerald: { icon: "text-[#2E7D32]", bg: "bg-[#2E7D32]/10", border: "border-[#2E7D32]/25" },
    orange: { icon: "text-[#A05F00]", bg: "bg-[#A05F00]/10", border: "border-[#A05F00]/25" },
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
              Why Enterprises Choose Whiteout AI
            </h2>
            <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
              Complete AI governance solution designed for enterprise security, compliance, and operational excellence.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color];

            return (
              <StaggerItem key={index}>
                <SpotlightCard className="p-8 h-full" spotlightColor={feature.spotlightHue}>
                  <h3 className="text-2xl font-bold text-[#0F1B2D] mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-[#51617A] mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-base text-[#51617A]">
                        <CheckCircle className="w-4 h-4 text-[#2E7D32] mr-2.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
