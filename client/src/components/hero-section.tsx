import { Link } from "wouter";
import { GradientButton } from "@/components/ui/gradient-button";
import { GradientText } from "@/components/ui/gradient-text";
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { Shield, Calendar, Globe, Monitor, Code, Cloud, Smartphone } from "lucide-react";
import {
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
} from "@/components/motion";

const interceptorData: TimelineItem[] = [
  {
    id: 1,
    icon: Globe,
    title: "Browser",
    content: "Intercept prompts and file uploads across 23+ AI platforms before they leave the browser.",
    category: "ENDPOINT",
    relatedIds: [2, 3],
    status: "completed",
    energy: 95,
    tags: ["Chrome", "Firefox", "Edge", "Safari"],
  },
  {
    id: 2,
    icon: Monitor,
    title: "Desktop",
    content: "Native keyboard and file-drop interception for desktop AI applications.",
    category: "ENDPOINT",
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
    tags: ["macOS", "Windows", "Linux"],
  },
  {
    id: 3,
    icon: Code,
    title: "IDE",
    content: "Multi-IDE orchestration monitoring Claude Code, GitHub Copilot, and Cursor.",
    category: "DEV TOOLS",
    relatedIds: [1, 4],
    status: "completed",
    energy: 85,
    tags: ["VS Code", "Cursor", "Windsurf"],
  },
  {
    id: 4,
    icon: Cloud,
    title: "Cloud & Internal",
    content: "Secure internal AI with dual LLM architecture and MCP tool access control.",
    category: "CLOUD",
    relatedIds: [3, 5],
    status: "completed",
    energy: 88,
    tags: ["Electron", "MCP", "API"],
  },
  {
    id: 5,
    icon: Smartphone,
    title: "Mobile",
    content: "Mobile-first AI governance with multi-tier approval and on-device LLM inference.",
    category: "MOBILE",
    relatedIds: [1, 4],
    status: "in-progress",
    energy: 70,
    tags: ["iOS", "Android"],
  },
];

export function HeroSection() {
  return (
    <section className="pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <HeroTextReveal>
              <HeroLine>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/20 text-blue-400 text-sm mb-8">
                  Whiteout AI
                </div>
              </HeroLine>

              <HeroLine>
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                  AI Is Already in
                  <span className="block">Your Organization.</span>
                  <span className="block">
                    <span
                      className="bg-clip-text text-transparent animate-gradient-flow-fast"
                      style={{
                        backgroundImage: "linear-gradient(90deg, #1a5fb4, #2e7d32, #c77800, #2e7d32, #1a5fb4)",
                        backgroundSize: "300% 100%",
                      }}
                    >
                      Now Secure It.
                    </span>
                  </span>
                </h1>
              </HeroLine>

              <HeroLine>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
                  Your employees are already using ChatGPT, Copilot, and Claude Code. Whiteout AI gives you full visibility and control — scanning every prompt, enforcing your policies, and preventing sensitive data from ever leaving your organization.
                </p>
              </HeroLine>
            </HeroTextReveal>

            <ScrollReveal delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link href="/demo">
                  <GradientButton variant="blue">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </GradientButton>
                </Link>
              </div>

              <div className="text-sm text-slate-500 flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                Security certifications in progress · SOC 2 Type II pending
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right" delay={0.3}>
            <RadialOrbitalTimeline
              timelineData={interceptorData}
              centerImage="/icononly_transparent_nobuffer.png"
              centerLabel="Whiteout AI"
              variant="blue"
              className="scale-[0.85] lg:scale-100 -my-8"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
