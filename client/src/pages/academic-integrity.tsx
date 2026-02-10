import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
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

export default function AcademicIntegrity() {
  const scrollToDemo = () => {
    window.location.href = "/#demo";
  };

  const stats = [
    { value: "100%", label: "Education Policy Accuracy" },
    { value: "65+", label: "Pre-Built Policies" },
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
        "Soft-allow philosophy \u2014 never blocks if the system fails, preserving access",
      ],
    },
  ];

  const differentiators = [
    {
      icon: Brain,
      title: "Semantic Understanding",
      description:
        "LLM-based evaluation understands academic intent, not just keywords. It distinguishes between \"write my essay\" and \"explain essay structure\" \u2014 catching true integrity violations while enabling genuine learning. 100% accuracy on Education policy tests.",
    },
    {
      icon: Users,
      title: "Institution-Wide Coverage",
      description:
        "From K-12 Chromebooks to university research labs. Policy groups let you apply different rules to different departments, grade levels, or courses \u2014 one platform governing every AI interaction across your entire institution.",
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
    blue: { bg: "bg-blue-600/10", icon: "text-blue-600" },
    green: { bg: "bg-green-600/10", icon: "text-green-600" },
    orange: { bg: "bg-orange-600/10", icon: "text-orange-600" },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-6">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  Academic Integrity & Education
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                AI Governance
                <span className="block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                  Built for
                </span>
                Academic Integrity
              </h1>

              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                As students and faculty rapidly adopt generative AI, Whiteout AI
                gives institutions the tools to uphold academic integrity —
                intercepting policy violations before they happen while
                preserving AI as a legitimate learning resource.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                  onClick={scrollToDemo}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Schedule a Demo
                </Button>
              </div>

              <div className="text-sm text-slate-400 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                FERPA compliant · Trusted by educational institutions · SOC 2
                Type II in progress
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 text-center hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How Whiteout AI Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whiteout AI intercepts AI interactions across every surface —
              evaluating each prompt against your institution's academic
              integrity policies in real time before any content is generated.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coverageSurfaces.map((surface, index) => {
              const Icon = surface.icon;
              const colors = colorClasses[surface.color];

              return (
                <div
                  key={index}
                  className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div
                    className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-7 h-7 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {surface.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {surface.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Monitored Platforms */}
          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-slate-500 mb-4">
              AI Platforms Monitored
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {monitoredPlatforms.map((platform, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Context-Aware Academic Integrity */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-500/5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Context-Aware Academic Integrity
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
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
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
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
                    className="flex items-center justify-center p-3 bg-blue-600/20 rounded-lg border border-blue-500/30 text-blue-300 text-sm font-medium"
                  >
                    {category}
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <div className="text-green-400 font-semibold text-sm flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  100% Education Category Accuracy — Zero False Negatives
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Education Institutions */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Built for Education Institutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive AI governance designed to maintain academic standards
              while embracing the educational benefits of AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {academicFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const colorList = [
                "bg-blue-600/10 text-blue-600",
                "bg-green-600/10 text-green-600",
                "bg-orange-600/10 text-orange-600",
                "bg-blue-600/10 text-blue-600",
              ];

              return (
                <div
                  key={index}
                  className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 ${colorList[index]} rounded-full flex items-center justify-center mr-4`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {feature.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start text-sm text-slate-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Whiteout AI for Education
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Purpose-built for institutions that want to embrace AI responsibly
              while maintaining the academic standards that define educational
              excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map((diff, index) => {
              const Icon = diff.icon;
              const colorList = [
                { bg: "bg-blue-600/10", text: "text-blue-600" },
                { bg: "bg-green-600/10", text: "text-green-600" },
                { bg: "bg-orange-600/10", text: "text-orange-600" },
              ];
              const colors = colorList[index];

              return (
                <div
                  key={index}
                  className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-6`}
                  >
                    <Icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {diff.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {diff.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Protect Academic Integrity?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            See how Whiteout AI can help your institution embrace AI responsibly
            while maintaining the academic standards your students, faculty, and
            community expect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
              onClick={scrollToDemo}
            >
              Schedule a Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-6">
            Whiteout AI by Groovy Security — Enterprise AI Governance
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
