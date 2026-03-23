import { useState, useRef, useCallback, useEffect, memo } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassCard } from "@/components/ui/glass-card";
import { RevealCard } from "@/components/ui/reveal-card";
import { cn } from "@/lib/utils";
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
    colorBg: "bg-blue-500/10",
    colorBorder: "border-blue-500/20",
    colorText: "text-blue-400",
    frameworks: [
      {
        name: "EU AI Act",
        description: "Risk classification and transparency requirements for general-purpose AI systems.",
        enforcement: "Whiteout AI enforces data governance, risk management, and human oversight controls — proving you have technical safeguards over what data feeds into LLMs.",
      },
      {
        name: "NIST AI RMF",
        description: "AI Risk Management Framework core functions: Govern, Map, Measure, and Manage.",
        enforcement: "Maps directly to the Govern, Map, and Measure functions by providing absolute visibility and interception of Shadow AI usage across the enterprise.",
      },
      {
        name: "ISO/IEC 42001",
        description: "International standard for AI Management Systems (AIMS) certification.",
        enforcement: "Provides the foundational endpoint control layer required to achieve AIMS certification — continuous monitoring, policy enforcement, and audit-ready logs.",
      },
    ],
  },
  {
    id: "defense-government",
    title: "Defense & Government",
    icon: ShieldCheck,
    color: "green",
    colorBg: "bg-emerald-500/10",
    colorBorder: "border-emerald-500/20",
    colorText: "text-emerald-400",
    frameworks: [
      {
        name: "CMMC",
        description: "Cybersecurity Maturity Model Certification for the Defense Industrial Base.",
        enforcement: "Intercepts and blocks Controlled Unclassified Information (CUI) and ITAR data from being pasted into unauthorized, commercial GenAI tools by defense contractors.",
      },
      {
        name: "NIST SP 800-171",
        description: "Endpoint data protection and continuous monitoring for DoD supply chain.",
        enforcement: "Fulfills critical endpoint data protection and continuous monitoring controls required for DoD supply chain contractors.",
      },
      {
        name: "FedRAMP",
        description: "Federal risk authorization for cloud services used by government agencies.",
        enforcement: "Acts as a compensating control ensuring government data does not bleed into non-FedRAMP authorized SaaS applications like consumer ChatGPT.",
      },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare & Medical Privacy",
    icon: HeartPulse,
    color: "orange",
    colorBg: "bg-orange-500/10",
    colorBorder: "border-orange-500/20",
    colorText: "text-orange-400",
    frameworks: [
      {
        name: "HIPAA",
        description: "Health Insurance Portability and Accountability Act — PHI protection.",
        enforcement: "Prevents Protected Health Information (PHI) from being exposed to LLMs that are not covered by a Business Associate Agreement (BAA) — proven in live clinical pilots.",
      },
      {
        name: "HITRUST CSF",
        description: "Common Security Framework for healthcare cloud environments.",
        enforcement: "Fulfills strict endpoint Data Loss Prevention (DLP) and unauthorized transmission controls — a massive pain point for healthcare cloud environments.",
      },
    ],
  },
  {
    id: "enterprise-security",
    title: "Enterprise Security & Privacy",
    icon: Lock,
    color: "purple",
    colorBg: "bg-purple-500/10",
    colorBorder: "border-purple-500/20",
    colorText: "text-purple-400",
    frameworks: [
      {
        name: "SOC 2 (Type I & II)",
        description: "Confidentiality and Privacy Trust Services Criteria for service organizations.",
        enforcement: "Provides literal audit logs proving to SOC 2 auditors that proprietary company data is not being leaked to third-party AI models.",
      },
      {
        name: "ISO 27001",
        description: "Information Security Management System (ISMS) international standard.",
        enforcement: "Satisfies ISMS requirements for endpoint data leakage and third-party vendor risk management with continuous policy enforcement.",
      },
      {
        name: "GDPR",
        description: "European regulation governing personal data processing and cross-border transfers.",
        enforcement: "Prevents unauthorized processing or cross-border transfer of PII by ensuring employees cannot dump customer data into ungoverned external AI systems.",
      },
      {
        name: "CCPA / CPRA",
        description: "California Consumer Privacy Act and California Privacy Rights Act.",
        enforcement: "Enforces consumer data protection by intercepting and blocking personal information from being submitted to third-party AI platforms.",
      },
    ],
  },
];

const totalFrameworks = complianceCategories.reduce(
  (acc, cat) => acc + cat.frameworks.length,
  0
);


/* ── Glow card with cursor-tracking border ── */
function GlowCard({
  children,
  className,
  glowColor,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      ref.current.style.setProperty("--glow-x", `${x}%`);
      ref.current.style.setProperty("--glow-y", `${y}%`);
    },
    []
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl cursor-pointer overflow-hidden transition-all duration-300",
        isActive
          ? "bg-white/[0.06] border-2"
          : "bg-white/[0.03] border border-white/[0.06] hover:border-transparent",
        className
      )}
      style={isActive ? { borderColor: glowColor } : undefined}
    >
      {/* Glow border that follows cursor */}
      {!isActive && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 80px at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 70%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "2px",
          }}
        />
      )}
      {children}
    </div>
  );
}

/* ── Compact framework pill — click to expand ── */
function FrameworkPill({
  framework,
  category,
  delay,
  onExpand,
}: {
  framework: Framework;
  category: ComplianceCategory;
  delay: number;
  onExpand?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && onExpand) onExpand();
        }}
        className={cn(
          "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left",
          open
            ? "bg-white/[0.05] border-white/[0.12]"
            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${category.colorBg} ${category.colorText} border ${category.colorBorder}`}>
            {framework.name}
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">{framework.description}</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-600 flex-shrink-0 ml-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-2 pl-4">
              <div className="flex items-start bg-emerald-500/[0.05] border border-emerald-500/[0.1] rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-300 font-medium leading-relaxed">
                  {framework.enforcement}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── 2x2 Grid with expandable detail panel ── */
function ComplianceGrid() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const activeCategory = complianceCategories.find((c) => c.id === activeId);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const glowColors: Record<string, string> = {
    "ai-governance": "#1a5fb4",
    "defense-government": "#2e7d32",
    "healthcare": "#c77800",
    "enterprise-security": "#7c3aed",
  };

  // Auto-rotate through categories
  useEffect(() => {
    if (!autoRotate) return;

    const ids = complianceCategories.map((c) => c.id);
    let currentIdx = -1;

    const rotate = () => {
      currentIdx = (currentIdx + 1) % ids.length;
      setActiveId(ids[currentIdx]);
      timerRef.current = setTimeout(rotate, 4000);
    };

    // Start first one quickly
    timerRef.current = setTimeout(rotate, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoRotate]);

  const handleManualClick = (id: string) => {
    setAutoRotate(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div>
      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {complianceCategories.map((category) => {
          const Icon = category.icon;
          const isActive = activeId === category.id;

          return (
            <GlowCard
              key={category.id}
              glowColor={glowColors[category.id]}
              isActive={isActive}
              onClick={() => handleManualClick(category.id)}
            >
              <div className="p-5">
                <div className="flex items-center mb-2">
                  <div className={`w-9 h-9 ${category.colorBg} rounded-xl flex items-center justify-center mr-3 border ${category.colorBorder}`}>
                    <Icon className={`w-4 h-4 ${category.colorText}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{category.title}</h3>
                    <p className="text-[11px] text-slate-500">
                      {category.frameworks.length} framework{category.frameworks.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {category.frameworks.map((fw) => (
                    <span
                      key={fw.name}
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${category.colorBg} ${category.colorText} ${category.colorBorder}`}
                    >
                      {fw.name}
                    </span>
                  ))}
                </div>
              </div>
            </GlowCard>
          );
        })}
      </div>

      {/* Framework pills — compact, click to expand */}
      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-4 space-y-2"
          >
            {activeCategory.frameworks.map((framework, idx) => (
              <FrameworkPill
                key={framework.name}
                framework={framework}
                category={activeCategory}
                delay={idx * 0.08}
                onExpand={() => {
                  setAutoRotate(false);
                  if (timerRef.current) clearTimeout(timerRef.current);
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ComplianceFrameworks() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-400 text-sm mb-6">
              {totalFrameworks} Frameworks Across {complianceCategories.length} Domains
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Compliance Enforcement, Not Just Checkboxes
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Whiteout AI doesn't just claim compliance — it actively enforces
              AI policies at the endpoint level, giving you audit-ready proof of every AI control.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left column — Stats summary */}
          <ScrollReveal className="lg:col-span-2">
            <GlassCard className="lg:sticky lg:top-24 p-8" hover={false} glowColor="rgba(59,130,246,0.04)">
              <h3 className="text-xl font-bold text-white mb-2">
                Compliance Command Center
              </h3>
              <p className="text-slate-500 text-sm mb-8">
                Real-time endpoint enforcement across every major regulatory framework.
              </p>

              <div className="text-center mb-8">
                <AnimatedCounter
                  value={`${totalFrameworks}`}
                  className="text-5xl font-bold bg-clip-text text-transparent animate-gradient-flow-fast"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #1a5fb4, #2e7d32, #c77800, #2e7d32, #1a5fb4)",
                    backgroundSize: "300% 100%",
                  }}
                />
                <p className="text-slate-500 mt-2 text-sm">Frameworks Enforced</p>
              </div>

              <div className="space-y-3 mb-8">
                {complianceCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]"
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 text-slate-400 mr-3" />
                        <span className="text-xs font-medium text-slate-300">{cat.title}</span>
                      </div>
                      <AnimatedCounter
                        value={`${cat.frameworks.length}`}
                        className="text-sm font-bold text-white"
                      />
                    </div>
                  );
                })}
              </div>

              <Link href="/demo">
                <GradientButton variant="blue" className="w-full">
                  Request Compliance Mapping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </GradientButton>
              </Link>
            </GlassCard>
          </ScrollReveal>

          {/* Right column — 2x2 Glow Cards */}
          <ScrollReveal className="lg:col-span-3" direction="right">
            <ComplianceGrid />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Compact version for the home page
 */
export function ComplianceFrameworksCompact() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Built for Compliance
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Whiteout AI actively enforces{" "}
              <span className="text-white font-semibold">{totalFrameworks} regulatory frameworks</span>{" "}
              at the endpoint level — not just policy documents, but real technical controls.
            </p>
          </div>
        </ScrollReveal>

        {/* Infinite slider */}
        <div className="relative mb-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <style>{`
            @keyframes infinite-slide {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
          `}</style>
          <div
            className="flex gap-4 w-max"
            style={{ animation: "infinite-slide 20s linear infinite" }}
          >
            {/* Double the items for seamless loop */}
            {[...complianceCategories, ...complianceCategories].map((category, i) => {
              const Icon = category.icon;
              const hoverColors: Record<string, { accent: string; dark: string }> = {
                "ai-governance": { accent: "#1a5fb4", dark: "#060e1f" },
                "defense-government": { accent: "#2e7d32", dark: "#061206" },
                "healthcare": { accent: "#8a3a1e", dark: "#0a0500" },
                "enterprise-security": { accent: "#7c3aed", dark: "#0d0620" },
              };
              const hc = hoverColors[category.id];
              return (
                <RevealCard
                  key={`${category.id}-${i}`}
                  accentColor={hc.accent}
                  accentDark={hc.dark}
                  className="flex-shrink-0 w-72"
                  overlay={
                    <div className="p-6 text-center h-full">
                      <div className="text-4xl font-bold text-white mb-2">
                        {category.frameworks.length}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-3">{category.title}</h3>
                      <div className={`flex justify-center gap-1.5 ${category.id === "healthcare" ? "flex-col items-center" : "flex-wrap"}`}>
                        {category.frameworks.map((fw) => (
                          <span
                            key={fw.name}
                            className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                          >
                            {fw.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <div className="p-6 text-center bg-white/[0.03] backdrop-blur-xl">
                    <div className="text-4xl font-bold text-white mb-2">
                      {category.frameworks.length}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">{category.title}</h3>
                    <div className={`flex justify-center gap-1.5 ${category.id === "healthcare" ? "flex-col items-center" : "flex-wrap"}`}>
                      {category.frameworks.map((fw) => (
                        <span
                          key={fw.name}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                        >
                          {fw.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </RevealCard>
              );
            })}
          </div>
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Link href="/whiteout-ai">
              <GradientButton variant="blue">
                See Full Compliance Coverage
                <ArrowRight className="w-4 h-4 ml-2" />
              </GradientButton>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
