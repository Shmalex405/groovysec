import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
  AnimatedCounter,
} from "@/components/motion";
import {
  Brain,
  ShieldCheck,
  HeartPulse,
  Lock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface Framework {
  name: string;
  description: string;
  enforcement: string;
}

interface ComplianceCategory {
  id: string;
  title: string;
  icon: typeof Brain;
  color: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  frameworks: Framework[];
}

const complianceCategories: ComplianceCategory[] = [
  {
    id: "ai-governance",
    title: "AI-Specific Governance",
    icon: Brain,
    color: "blue",
    colorBg: "bg-blue-600/10",
    colorBorder: "border-blue-500/30",
    colorText: "text-blue-600",
    frameworks: [
      {
        name: "EU AI Act",
        description:
          "Risk classification and transparency requirements for general-purpose AI systems.",
        enforcement:
          "Whiteout AI enforces data governance, risk management, and human oversight controls — proving you have technical safeguards over what data feeds into LLMs.",
      },
      {
        name: "NIST AI RMF",
        description:
          "AI Risk Management Framework core functions: Govern, Map, Measure, and Manage.",
        enforcement:
          "Maps directly to the Govern, Map, and Measure functions by providing absolute visibility and interception of Shadow AI usage across the enterprise.",
      },
      {
        name: "ISO/IEC 42001",
        description:
          "International standard for AI Management Systems (AIMS) certification.",
        enforcement:
          "Provides the foundational endpoint control layer required to achieve AIMS certification — continuous monitoring, policy enforcement, and audit-ready logs.",
      },
    ],
  },
  {
    id: "defense-government",
    title: "Defense & Government",
    icon: ShieldCheck,
    color: "green",
    colorBg: "bg-green-600/10",
    colorBorder: "border-green-500/30",
    colorText: "text-green-600",
    frameworks: [
      {
        name: "CMMC",
        description:
          "Cybersecurity Maturity Model Certification for the Defense Industrial Base.",
        enforcement:
          "Intercepts and blocks Controlled Unclassified Information (CUI) and ITAR data from being pasted into unauthorized, commercial GenAI tools by defense contractors.",
      },
      {
        name: "NIST SP 800-171",
        description:
          "Endpoint data protection and continuous monitoring for DoD supply chain.",
        enforcement:
          "Fulfills critical endpoint data protection and continuous monitoring controls required for DoD supply chain contractors.",
      },
      {
        name: "FedRAMP",
        description:
          "Federal risk authorization for cloud services used by government agencies.",
        enforcement:
          "Acts as a compensating control ensuring government data does not bleed into non-FedRAMP authorized SaaS applications like consumer ChatGPT.",
      },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare & Medical Privacy",
    icon: HeartPulse,
    color: "orange",
    colorBg: "bg-orange-600/10",
    colorBorder: "border-orange-500/30",
    colorText: "text-orange-600",
    frameworks: [
      {
        name: "HIPAA",
        description:
          "Health Insurance Portability and Accountability Act — PHI protection.",
        enforcement:
          "Prevents Protected Health Information (PHI) from being exposed to LLMs that are not covered by a Business Associate Agreement (BAA) — proven in live clinical pilots.",
      },
      {
        name: "HITRUST CSF",
        description:
          "Common Security Framework for healthcare cloud environments.",
        enforcement:
          "Fulfills strict endpoint Data Loss Prevention (DLP) and unauthorized transmission controls — a massive pain point for healthcare cloud environments.",
      },
    ],
  },
  {
    id: "enterprise-security",
    title: "Enterprise Security & Privacy",
    icon: Lock,
    color: "purple",
    colorBg: "bg-purple-600/10",
    colorBorder: "border-purple-500/30",
    colorText: "text-purple-600",
    frameworks: [
      {
        name: "SOC 2 (Type I & II)",
        description:
          "Confidentiality and Privacy Trust Services Criteria for service organizations.",
        enforcement:
          "Provides literal audit logs proving to SOC 2 auditors that proprietary company data is not being leaked to third-party AI models.",
      },
      {
        name: "ISO 27001",
        description:
          "Information Security Management System (ISMS) international standard.",
        enforcement:
          "Satisfies ISMS requirements for endpoint data leakage and third-party vendor risk management with continuous policy enforcement.",
      },
      {
        name: "GDPR",
        description:
          "European regulation governing personal data processing and cross-border transfers.",
        enforcement:
          "Prevents unauthorized processing or cross-border transfer of PII by ensuring employees cannot dump customer data into ungoverned external AI systems.",
      },
      {
        name: "CCPA / CPRA",
        description:
          "California Consumer Privacy Act and California Privacy Rights Act.",
        enforcement:
          "Enforces consumer data protection by intercepting and blocking personal information from being submitted to third-party AI platforms.",
      },
    ],
  },
];

const totalFrameworks = complianceCategories.reduce(
  (acc, cat) => acc + cat.frameworks.length,
  0
);

export function ComplianceFrameworks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 border border-blue-500/20 text-sm font-medium mb-6">
              {totalFrameworks} Frameworks Across {complianceCategories.length}{" "}
              Domains
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Compliance Enforcement, Not Just Checkboxes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whiteout AI doesn't just claim compliance — it actively enforces
              AI policies at the endpoint level, giving you
              audit-ready proof of every AI control.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left column — Stats summary */}
          <ScrollReveal className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">
                Compliance Command Center
              </h3>
              <p className="text-slate-400 text-sm mb-8">
                Real-time endpoint enforcement across every major regulatory
                framework.
              </p>

              <div className="text-center mb-8">
                <AnimatedCounter
                  value={`${totalFrameworks}`}
                  className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
                />
                <p className="text-slate-400 mt-2">Frameworks Enforced</p>
              </div>

              <div className="space-y-4 mb-8">
                {complianceCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 text-slate-300 mr-3" />
                        <span className="text-sm font-medium text-slate-200">
                          {cat.title}
                        </span>
                      </div>
                      <AnimatedCounter
                        value={`${cat.frameworks.length}`}
                        className="text-lg font-bold text-white"
                      />
                    </div>
                  );
                })}
              </div>

              <Link href="/demo">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                  Request Compliance Mapping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Right column — Accordion */}
          <ScrollReveal className="lg:col-span-3" direction="right">
            <Accordion
              type="multiple"
              defaultValue={[]}
              className="space-y-4"
            >
              {complianceCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <AccordionItem
                    key={category.id}
                    value={category.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden px-0 data-[state=open]:shadow-lg transition-shadow duration-300"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-slate-50 transition-colors">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 ${category.colorBg} rounded-full flex items-center justify-center mr-4`}
                        >
                          <Icon
                            className={`w-5 h-5 ${category.colorText}`}
                          />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-slate-900">
                            {category.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {category.frameworks.length} framework
                            {category.frameworks.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4 pt-2">
                        {category.frameworks.map((framework, idx) => (
                          <div
                            key={framework.name}
                            className={`p-4 rounded-xl ${
                              idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                            } border border-slate-100`}
                          >
                            <div className="flex items-start mb-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${category.colorBg} ${category.colorText} border ${category.colorBorder} mr-3 flex-shrink-0`}
                              >
                                {framework.name}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">
                              {framework.description}
                            </p>
                            <div className="flex items-start bg-green-50 border border-green-200 rounded-lg p-3">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-green-800 font-medium">
                                {framework.enforcement}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Compact version for the home page — horizontal stat bar teaser
 */
export function ComplianceFrameworksCompact() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-500/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built for Compliance
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Whiteout AI actively enforces{" "}
              <span className="text-white font-semibold">
                {totalFrameworks} regulatory frameworks
              </span>{" "}
              at the endpoint level — not just policy documents, but real
              technical controls.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {complianceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <StaggerItem key={category.id}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors duration-300">
                  <div
                    className={`w-12 h-12 ${category.colorBg} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${category.colorText}`} />
                  </div>
                  <AnimatedCounter
                    value={`${category.frameworks.length}`}
                    className="text-3xl font-bold text-white block mb-1"
                  />
                  <h3 className="text-sm font-semibold text-slate-200 mb-3">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {category.frameworks.map((fw) => (
                      <span
                        key={fw.name}
                        className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10"
                      >
                        {fw.name}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <ScrollReveal>
          <div className="text-center">
            <Link href="/whiteout-ai">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
              >
                See Full Compliance Coverage
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
