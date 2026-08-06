import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { GradientText } from "@/components/ui/gradient-text";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  CheckCircle,
  Monitor,
  Globe,
  Server,
  Lock,
  Eye,
  Users,
  ArrowRight,
  Layers,
  GraduationCap,
  BookOpen,
  PenTool,
  FileSearch,
  Brain,
  Scale,
} from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import { usePageMeta } from "@/lib/use-page-meta";

export default function AcademicIntegrity() {
  usePageMeta(
    "Whiteout AI for Academic Integrity",
    "AI governance for education — intercept academic integrity violations in real time while preserving AI as a learning resource. 99.21% accuracy on 1,007 education benchmark prompts, built for FERPA."
  );
  const demoHref = "/demo";

  const stats = [
    { value: "99.21%", label: "Education Benchmark Accuracy" },
    { value: "60+", label: "Pre-Built Policies" },
    { value: "<320ms", label: "Evaluation Latency (P95)" },
    { value: "24/7", label: "Continuous Monitoring" },
  ];

  const coverageSurfaces = [
    {
      icon: Globe,
      title: "Browser Extension",
      description:
        "Monitors ChatGPT, Claude, Gemini, and other AI tools in Chrome, Firefox, Edge, and Safari",
      color: "blue",
    },
    {
      icon: Monitor,
      title: "Desktop Guard",
      description:
        "Catches native AI app usage on school-issued macOS and Windows devices",
      color: "green",
    },
    {
      icon: Server,
      title: "Institutional Secure AI",
      description:
        "Provide a governed AI workspace for legitimate academic use",
      color: "orange",
    },
    {
      icon: Layers,
      title: "LMS & Tool Integration",
      description:
        "Works alongside existing learning management systems and campus infrastructure",
      color: "blue",
    },
  ];

  const academicFeatures = [
    {
      icon: PenTool,
      title: "Academic Integrity Enforcement",
      items: [
        "Block \"write my essay,\" \"do my homework,\" and assignment completion requests",
        "Detect exam cheating attempts including question-and-answer extraction",
        "Prevent unauthorized AI-generated content for graded submissions",
        "Institution-specific honor code policy enforcement",
      ],
    },
    {
      icon: Eye,
      title: "Complete Visibility & Audit Trail",
      items: [
        "Every student and faculty AI interaction logged with full metadata",
        "Searchable audit trail for academic misconduct investigations",
        "Per-student and per-department compliance dashboards",
        "Exportable reports (PDF/CSV) for academic review boards",
      ],
    },
    {
      icon: FileSearch,
      title: "Image & File Analysis",
      items: [
        "OCR scanning catches photos of exam questions uploaded to AI tools",
        "PDF and DOCX parsing detects assignment sheets submitted for AI completion",
        "File upload interception for drag-drop, paste, and attachment attempts",
        "Identifies handwritten exam content converted to digital format",
      ],
    },
    {
      icon: Scale,
      title: "Balanced AI Enablement",
      items: [
        "Allow legitimate AI tutoring, brainstorming, and learning assistance",
        "Differentiate between \"do it for me\" and \"help me understand\"",
        "Faculty-controlled exceptions for AI-permitted assignments",
        "Soft-allow philosophy — never blocks if the system fails, preserving access",
      ],
    },
  ];

  const differentiators = [
    {
      icon: Brain,
      title: "Semantic Understanding",
      description:
        "LLM-based evaluation understands academic intent, not just keywords. It distinguishes between \"write my essay\" and \"explain essay structure\" — catching true integrity violations while enabling genuine learning. 99.21% accuracy across 1,007 education benchmark prompts.",
    },
    {
      icon: Users,
      title: "Institution-Wide Coverage",
      description:
        "From K-12 Chromebooks to university research labs. Policy groups let you apply different rules to different departments, grade levels, or courses — one platform governing every AI interaction across your entire institution.",
    },
    {
      icon: Lock,
      title: "FERPA-Ready Compliance",
      description:
        "Student data never reaches AI providers. Real-time DLP blocks student records, grades, and personally identifiable information before submission. Complete audit trail satisfies FERPA and institutional compliance requirements.",
    },
  ];

  const monitoredPlatforms = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Copilot",
    "Perplexity",
    "Mistral",
    "Grok",
    "DeepSeek",
    "10+ more",
  ];

  const colorClasses: Record<string, { bg: string; icon: string }> = {
    blue: { bg: "bg-[#1A5FB4]/10", icon: "text-[#1A5FB4]" },
    green: { bg: "bg-[#2E7D32]/10", icon: "text-[#2E7D32]" },
    orange: { bg: "bg-[#A05F00]/10", icon: "text-[#A05F00]" },
  };

  return (
    <AuroraBackground variant="bluegreen" className="min-h-screen">
      <PageTransition>
        <Navigation />

        {/* Hero Section */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-[#0F1B2D]">
                <div className="inline-flex items-center px-4 py-2 rounded-md bg-[#1A5FB4]/10 text-[#1A5FB4] border border-[#1A5FB4]/25 mb-6">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    Academic Integrity & Education
                  </span>
                </div>

                <HeroTextReveal>
                  <HeroLine>
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                      AI Governance
                      <span className="block text-[#1A5FB4]">
                        Built for
                      </span>
                      Academic Integrity
                    </h1>
                  </HeroLine>

                  <HeroLine>
                    <p className="text-lg text-[#51617A] mb-8 leading-relaxed">
                      As students and faculty rapidly adopt generative AI, Whiteout AI
                      gives institutions the tools to uphold academic integrity —
                      intercepting policy violations before they happen while
                      preserving AI as a legitimate learning resource.
                    </p>
                  </HeroLine>
                </HeroTextReveal>

                <ScrollReveal delay={0.5}>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link href={demoHref}>
                      <GradientButton variant="blue">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Schedule a Demo
                      </GradientButton>
                    </Link>
                  </div>

                  <div className="text-sm text-[#51617A] flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Built for FERPA · SOC 2 Type II in progress · NVIDIA Inception
                    member
                  </div>
                </ScrollReveal>
              </div>

              {/* Stats Cards */}
              <StaggerChildren className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <StaggerItem key={index}>
                    <div
                      className="bg-white rounded-xl p-6 border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] text-center hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300"
                    >
                      <div className="text-3xl font-bold text-[#1A5FB4] mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-[#51617A]">{stat.label}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  How Whiteout AI Works
                </h2>
                <p className="text-lg text-[#51617A] max-w-3xl mx-auto">
                  Whiteout AI intercepts AI interactions across every surface —
                  evaluating each prompt against your institution's academic
                  integrity policies in real time before any content is generated.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coverageSurfaces.map((surface, index) => {
                const Icon = surface.icon;
                const colors = colorClasses[surface.color];

                return (
                  <StaggerItem key={index}>
                    <div
                      className="p-6 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300 hover:-translate-y-1 text-center"
                    >
                      <h3 className="text-lg font-bold text-[#0F1B2D] mb-2">
                        {surface.title}
                      </h3>
                      <p className="text-sm text-[#51617A]">
                        {surface.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>

            {/* Monitored Platforms */}
            <div className="mt-12 text-center">
              <p className="text-sm font-medium text-[#6E7B8C] mb-4">
                AI Platforms Monitored
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {monitoredPlatforms.map((platform, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white text-[#51617A] rounded-md text-sm font-medium border border-[#0F1B2D]/10"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Context-Aware Academic Integrity */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <ScrollReveal>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-6 tracking-tight">
                    Context-Aware Academic Integrity
                  </h2>
                </ScrollReveal>
                <p className="text-lg text-[#51617A] mb-6 leading-relaxed">
                  Unlike keyword-based filters, Whiteout AI uses LLM-based
                  contextual evaluation. It distinguishes between a student asking
                  "write my essay on climate change" and "help me understand the
                  arguments in the climate change debate" — blocking dishonest use
                  while allowing legitimate learning.
                </p>

                <div className="space-y-4">
                  {[
                    "Pre-built education policies: block essay writing, exam content, and assignment completion requests",
                    "Request custom policies tailored to institution-specific honor codes and academic standards",
                    "Department-level policy groups — different rules for CS labs vs. English composition",
                    "Automatic redaction generates compliant alternatives that guide learning instead of giving answers",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[#2E7D32] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-[#51617A]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]">
                <h3 className="text-xl font-semibold text-[#0F1B2D] mb-6 text-center">
                  Academic Integrity Policies
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "Essay Writing",
                    "Exam Content",
                    "Assignments",
                    "Research Data",
                    "Student Records",
                    "Honor Code",
                    "Citations",
                    "Lab Reports",
                    "Dissertations",
                  ].map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center p-3 bg-[#1A5FB4]/10 rounded-md border border-[#1A5FB4]/25 text-[#1A5FB4] text-sm font-medium"
                    >
                      {category}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <div className="text-[#2E7D32] font-semibold text-sm flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    99.21% Accuracy on 1,007 Education Benchmark Prompts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Built for Education Institutions */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  Built for Education Institutions
                </h2>
                <p className="text-lg text-[#51617A] max-w-3xl mx-auto">
                  Comprehensive AI governance designed to maintain academic standards
                  while embracing the educational benefits of AI technology.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-2 gap-8">
              {academicFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const colorList = [
                  "bg-[#1A5FB4]/10 text-[#1A5FB4]",
                  "bg-[#2E7D32]/10 text-[#2E7D32]",
                  "bg-[#A05F00]/10 text-[#A05F00]",
                  "bg-[#1A5FB4]/10 text-[#1A5FB4]",
                ];

                return (
                  <StaggerItem key={index}>
                    <div
                      className="p-8 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300"
                    >
                      <div className="flex items-center mb-4">
                        <h3 className="text-xl font-bold text-[#0F1B2D]">
                          {feature.title}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {feature.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start text-sm text-[#51617A]"
                          >
                            <CheckCircle className="w-4 h-4 text-[#2E7D32] mr-2 flex-shrink-0 mt-0.5" />
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

        {/* Differentiators */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  Why Whiteout AI for Education
                </h2>
                <p className="text-lg text-[#51617A] max-w-3xl mx-auto">
                  Purpose-built for institutions that want to embrace AI responsibly
                  while maintaining the academic standards that define educational
                  excellence.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-8">
              {differentiators.map((diff, index) => {
                const Icon = diff.icon;
                const colorList = [
                  { bg: "bg-[#1A5FB4]/10", text: "text-[#1A5FB4]" },
                  { bg: "bg-[#2E7D32]/10", text: "text-[#2E7D32]" },
                  { bg: "bg-[#A05F00]/10", text: "text-[#A05F00]" },
                ];
                const colors = colorList[index];

                return (
                  <StaggerItem key={index}>
                    <div
                      className="p-8 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300 hover:-translate-y-1"
                    >
                      <h3 className="text-2xl font-bold text-[#0F1B2D] mb-4">
                        {diff.title}
                      </h3>
                      <p className="text-[#51617A] leading-relaxed">
                        {diff.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* CTA Section */}
        <ScrollReveal>
          <section className="py-24 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-6 tracking-tight">
                Ready to Protect Academic Integrity?
              </h2>
              <p className="text-lg text-[#51617A] mb-8 max-w-2xl mx-auto">
                See how Whiteout AI can help your institution embrace AI responsibly
                while maintaining the academic standards your students, faculty, and
                community expect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={demoHref}>
                  <GradientButton variant="blue">
                    Schedule a Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GradientButton>
                </Link>
              </div>
              <p className="text-sm text-[#6E7B8C] mt-6">
                Whiteout AI by Groovy Security — Enterprise AI Governance
              </p>
            </div>
          </section>
        </ScrollReveal>

        <Footer />
      </PageTransition>
    </AuroraBackground>
  );
}
