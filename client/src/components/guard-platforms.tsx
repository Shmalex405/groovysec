import {
  Globe,
  Monitor,
  Code,
  Cloud,
  Smartphone,
  Shield,
  CheckCircle,
} from "lucide-react";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

export function InterceptorPlatforms() {
  const guards = [
    {
      icon: Globe,
      title: "Browser Interceptor",
      description:
        "Intercept prompts and file uploads across 23+ AI platforms before they leave the browser. Real-time policy enforcement with block overlays and device heartbeat tracking.",
      platforms: ["Chrome", "Firefox", "Edge", "Safari"],
      color: "blue",
    },
    {
      icon: Monitor,
      title: "Desktop Interceptor",
      description:
        "Native keyboard and file-drop interception for desktop AI applications. Coverage banners, password-protected quit, and auto-startup for persistent compliance.",
      platforms: ["macOS", "Windows"],
      color: "green",
    },
    {
      icon: Code,
      title: "IDE Interceptor",
      description:
        "Multi-IDE orchestration monitoring Claude Code, GitHub Copilot, and Cursor with 4-layer defender hooks. Unified audit pipeline with offline queue and auto-replay.",
      platforms: ["VS Code", "Cursor", "Windsurf"],
      color: "orange",
    },
    {
      icon: Cloud,
      title: "Cloud & Internal AI",
      description:
        "Secure internal AI interface with dual LLM architecture, real-time compliance streaming, and context management. MCP tool access control for safe external integrations.",
      platforms: ["Electron App", "MCP Server", "API Gateway"],
      color: "purple",
    },
    {
      icon: Smartphone,
      title: "Groovy Mobile",
      description:
        "Mobile-first AI content management with enterprise governance. Multi-tier approval workflows, KMS encryption, and local LLM inference for on-device privacy.",
      platforms: ["iOS", "Android"],
      color: "teal",
    },
  ];

  const aiApps = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Copilot",
    "Perplexity",
    "Grok",
    "DeepSeek",
    "Mistral",
    "Poe",
    "M365 Copilot",
    "Google Workspace Gemini",
  ];

  const colorClasses: Record<string, { bg: string; icon: string; border: string; tag: string }> = {
    blue: {
      bg: "bg-blue-600/10",
      icon: "text-blue-600",
      border: "border-blue-500/30",
      tag: "bg-blue-100 text-blue-700",
    },
    green: {
      bg: "bg-green-600/10",
      icon: "text-green-600",
      border: "border-green-500/30",
      tag: "bg-green-100 text-green-700",
    },
    orange: {
      bg: "bg-orange-600/10",
      icon: "text-orange-600",
      border: "border-orange-500/30",
      tag: "bg-orange-100 text-orange-700",
    },
    purple: {
      bg: "bg-purple-600/10",
      icon: "text-purple-600",
      border: "border-purple-500/30",
      tag: "bg-purple-100 text-purple-700",
    },
    teal: {
      bg: "bg-teal-600/10",
      icon: "text-teal-600",
      border: "border-teal-500/30",
      tag: "bg-teal-100 text-teal-700",
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-500/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-6">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Multi-Surface Protection</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Whiteout AI Interceptor
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Policy enforcement everywhere your workforce uses AI — browser,
              desktop, IDE, cloud, and mobile. One platform, unified compliance.
            </p>
          </div>
        </ScrollReveal>

        {/* Top row: 3 cards */}
        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {guards.slice(0, 3).map((guard, index) => {
            const Icon = guard.icon;
            const colors = colorClasses[guard.color];
            return (
              <StaggerItem key={index}>
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mr-4`}
                    >
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {guard.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4 flex-grow">
                    {guard.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guard.platforms.map((platform) => (
                      <span
                        key={platform}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors.tag}`}
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* Bottom row: 2 cards centered */}
        <StaggerChildren className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {guards.slice(3).map((guard, index) => {
            const Icon = guard.icon;
            const colors = colorClasses[guard.color];
            return (
              <StaggerItem key={index}>
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mr-4`}
                    >
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {guard.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4 flex-grow">
                    {guard.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guard.platforms.map((platform) => (
                      <span
                        key={platform}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors.tag}`}
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <ScrollReveal>
          <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-8 border border-slate-700">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                23+ AI Platforms Covered
              </h3>
              <p className="text-sm text-slate-400">
                Standalone AI, Microsoft 365 Copilot, Google Workspace Gemini,
                and desktop applications — all governed by one policy engine.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {aiApps.map((app) => (
                <div
                  key={app}
                  className="flex items-center px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600 text-sm text-slate-300"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 mr-2" />
                  {app}
                </div>
              ))}
              <div className="flex items-center px-4 py-2 bg-blue-600/20 rounded-lg border border-blue-500/30 text-sm text-blue-400 font-medium">
                + 12 more platforms
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
