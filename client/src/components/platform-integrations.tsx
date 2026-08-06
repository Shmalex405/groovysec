import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Brain, Sparkles, Globe, Cpu, Bot, Server, Search, Boxes,
  MessageCircle, Code, Eye, Zap, Monitor, Cloud, Pencil, FileSearch,
} from "lucide-react";
import { ScrollReveal } from "@/components/motion";
import { SpinningMark } from "@/components/ui/spinning-mark";

/* ── Radar ── */
function Radar({ className }: { className?: string }) {
  const circles = new Array(8).fill(1);
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <style>{`
        @keyframes radar-spin {
          from { transform: rotate(20deg); }
          to   { transform: rotate(380deg); }
        }
        .animate-radar-spin {
          animation: radar-spin 10s linear infinite;
        }
      `}</style>
      {/* Sweep line — anchored at center */}
      <div
        style={{ transformOrigin: "left center" }}
        className="animate-radar-spin absolute left-1/2 top-1/2 -translate-y-[2.5px] z-40 flex h-[5px] w-[460px] items-end justify-center overflow-hidden bg-transparent"
      >
        <div className="relative z-40 h-[1px] w-full bg-gradient-to-r from-[#1a5fb4] via-[#1a5fb4]/50 to-transparent" />
      </div>
      {/* Concentric rings — centered with margin offset */}
      {circles.map((_, idx) => {
        const size = (idx + 1) * 6;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.2 }}
            className="absolute rounded-full"
            style={{
              height: `${size}rem`,
              width: `${size}rem`,
              left: `calc(50% - ${size / 2}rem)`,
              top: `calc(50% - ${size / 2}rem)`,
              border: `1px solid rgba(15, 27, 45, ${0.2 - idx * 0.02})`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Icon on the radar ── */
function RadarIcon({
  icon: Icon,
  label,
  sublabel,
  x,
  y,
  delay,
  color = "text-[#51617A]",
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  x: string;
  y: string;
  delay: number;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="absolute z-50 flex flex-col items-center gap-1.5"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#0F1B2D]/10 bg-white shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] hover:border-[#0F1B2D]/20 transition-all duration-300">
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <div className="hidden md:block text-center">
        <div className="text-[11px] font-semibold text-[#0F1B2D]">{label}</div>
        {sublabel && <div className="text-[9px] text-[#6E7B8C]">{sublabel}</div>}
      </div>
    </motion.div>
  );
}

export function PlatformIntegrations() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-md bg-[#0F1B2D]/[0.02] border border-[#0F1B2D]/10 text-[#51617A] text-sm mb-6">
              Complete AI Visibility
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
              Every AI Tool. One View.
            </h2>
            <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
              Whiteout AI gives you visibility into every AI application your organization is using — no proxies, no network configurations, just direct endpoint evaluation on the user level.
            </p>
          </div>
        </ScrollReveal>

        {/* Radar with AI platforms */}
        <div className="relative flex items-center justify-center mx-auto" style={{ height: 700 }}>
          <Radar className="h-full w-full" />

          {/* Inner ring — Standalone AI */}
          <RadarIcon icon={Brain} label="ChatGPT" sublabel="OpenAI" x="50%" y="24%" delay={0.2} color="text-[#2E7D32]" />
          <RadarIcon icon={Sparkles} label="Claude" sublabel="Anthropic" x="68%" y="30%" delay={0.3} color="text-[#A05F00]" />
          <RadarIcon icon={Globe} label="Gemini" sublabel="Google" x="75%" y="50%" delay={0.4} color="text-[#1A5FB4]" />
          <RadarIcon icon={Bot} label="Grok" sublabel="xAI" x="68%" y="70%" delay={0.5} color="text-[#51617A]" />
          <RadarIcon icon={Search} label="Perplexity" sublabel="AI Search" x="50%" y="76%" delay={0.6} color="text-[#6D28D9]" />
          <RadarIcon icon={Boxes} label="DeepSeek" sublabel="Chat" x="32%" y="70%" delay={0.7} color="text-[#1A5FB4]" />
          <RadarIcon icon={MessageCircle} label="Poe" sublabel="Multi-model" x="25%" y="50%" delay={0.8} color="text-[#1A5FB4]" />
          <RadarIcon icon={Zap} label="Mistral" sublabel="Le Chat" x="32%" y="30%" delay={0.9} color="text-[#A05F00]" />

          {/* Outer ring — Enterprise & Embedded AI */}
          <RadarIcon icon={Cpu} label="M365 Copilot" sublabel="Word, Excel, Teams" x="50%" y="8%" delay={1.0} color="text-[#1A5FB4]" />
          <RadarIcon icon={Globe} label="Workspace Gemini" sublabel="Gmail, Docs, Sheets" x="76%" y="14%" delay={1.05} color="text-[#2E7D32]" />
          <RadarIcon icon={Code} label="Claude Code" sublabel="CLI Agent" x="90%" y="30%" delay={1.1} color="text-[#A05F00]" />
          <RadarIcon icon={Code} label="GitHub Copilot" sublabel="IDE Assistant" x="93%" y="50%" delay={1.15} color="text-[#51617A]" />
          <RadarIcon icon={Pencil} label="Cursor" sublabel="AI Editor" x="90%" y="70%" delay={1.2} color="text-[#6D28D9]" />
          <RadarIcon icon={FileSearch} label="Google AI Studio" sublabel="Vertex AI" x="76%" y="86%" delay={1.25} color="text-[#1A5FB4]" />
          <RadarIcon icon={Monitor} label="Microsoft Copilot" sublabel="Browser, Windows" x="50%" y="92%" delay={1.3} color="text-[#1A5FB4]" />
          <RadarIcon icon={Brain} label="ChatGPT Codex" sublabel="OpenAI" x="24%" y="86%" delay={1.35} color="text-[#2E7D32]" />
          <RadarIcon icon={Monitor} label="Windsurf" sublabel="AI IDE" x="10%" y="70%" delay={1.4} color="text-[#2E7D32]" />
          <RadarIcon icon={Brain} label="NotebookLM" sublabel="Google" x="10%" y="30%" delay={1.5} color="text-[#1A5FB4]" />
          <RadarIcon icon={Sparkles} label="Copilot Studio" sublabel="Power Platform" x="24%" y="14%" delay={1.55} color="text-[#6D28D9]" />

          {/* Center — Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <SpinningMark alt="Whiteout AI" className="w-16 h-16" />
          </div>
        </div>
      </div>
    </section>
  );
}
