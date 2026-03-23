import {
  Globe,
  Monitor,
  Code,
  Cloud,
  Smartphone,
  Shield,
  CheckCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline";
import {
  ScrollReveal,
} from "@/components/motion";

export function InterceptorPlatforms() {
  const timelineData: TimelineItem[] = [
    {
      id: 1,
      icon: Globe,
      title: "Browser Interceptor",
      content: "Intercept prompts and file uploads across 23+ AI platforms before they leave the browser. Real-time policy enforcement with block overlays and device heartbeat tracking.",
      category: "ENDPOINT",
      relatedIds: [2, 3],
      status: "completed",
      energy: 95,
      tags: ["Chrome", "Firefox", "Edge", "Safari"],
    },
    {
      id: 2,
      icon: Monitor,
      title: "Desktop Interceptor",
      content: "Native keyboard and file-drop interception for desktop AI applications. Coverage banners, password-protected quit, and auto-startup for persistent compliance.",
      category: "ENDPOINT",
      relatedIds: [1, 3],
      status: "completed",
      energy: 90,
      tags: ["macOS", "Windows"],
    },
    {
      id: 3,
      icon: Code,
      title: "IDE Interceptor",
      content: "Multi-IDE orchestration monitoring Claude Code, GitHub Copilot, and Cursor with 4-layer defender hooks. Unified audit pipeline with offline queue and auto-replay.",
      category: "DEV TOOLS",
      relatedIds: [1, 4],
      status: "completed",
      energy: 85,
      tags: ["VS Code", "Cursor", "Windsurf"],
    },
    {
      id: 4,
      icon: Cloud,
      title: "Cloud & Internal AI",
      content: "Secure internal AI interface with dual LLM architecture, real-time compliance streaming, and context management. MCP tool access control for safe external integrations.",
      category: "CLOUD",
      relatedIds: [3, 5],
      status: "completed",
      energy: 88,
      tags: ["Electron App", "MCP Server", "API Gateway"],
    },
    {
      id: 5,
      icon: Smartphone,
      title: "Groovy Mobile",
      content: "Mobile-first AI content management with enterprise governance. Multi-tier approval workflows, KMS encryption, and local LLM inference for on-device privacy.",
      category: "MOBILE",
      relatedIds: [1, 4],
      status: "in-progress",
      energy: 70,
      tags: ["iOS", "Android"],
    },
  ];

  const aiApps = [
    "ChatGPT", "Claude", "Gemini", "Copilot", "Perplexity", "Grok",
    "DeepSeek", "Mistral", "Poe", "M365 Copilot", "Google Workspace Gemini",
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/20 text-blue-400 text-sm mb-6">
              <Shield className="w-3.5 h-3.5 mr-2" />
              Multi-Surface Protection
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Whiteout AI Interceptor
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Policy enforcement everywhere your workforce uses AI — browser,
              desktop, IDE, cloud, and mobile. Click any node to explore.
            </p>
          </div>
        </ScrollReveal>

        <RadialOrbitalTimeline
          timelineData={timelineData}
          centerImage="/icononly_transparent_nobuffer.png"
          centerLabel="Policy Engine"
          variant="blue"
        />

        <ScrollReveal>
          <GlassCard className="p-8 mt-4" hover={false}>
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-white mb-1">23+ AI Platforms Covered</h3>
              <p className="text-xs text-slate-500">
                Standalone AI, Microsoft 365 Copilot, Google Workspace Gemini,
                and desktop applications — all governed by one policy engine.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {aiApps.map((app) => (
                <div key={app} className="flex items-center px-3 py-1.5 bg-white/[0.03] rounded-lg border border-white/[0.06] text-xs text-slate-400">
                  <CheckCircle className="w-3 h-3 text-emerald-400 mr-1.5" />
                  {app}
                </div>
              ))}
              <div className="flex items-center px-3 py-1.5 bg-blue-500/[0.06] rounded-lg border border-blue-500/[0.12] text-xs text-blue-400 font-medium">
                + 12 more platforms
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
