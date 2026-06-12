import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Crosshair, ShieldCheck } from "lucide-react";

type Outcome = "critical" | "high" | "removed";
type StepPhase = "discover" | "exploit" | "validate" | "report";
type Phase = StepPhase | "hold";
type Tone = "dim" | "warn" | "crit" | "ok";

interface Line {
  phase: StepPhase;
  text: string;
  tone: Tone;
}

interface Scenario {
  source: string;
  outcome: Outcome;
  lines: Line[];
  result: string;
}

const SCENARIOS: Scenario[] = [
  {
    source: "Web App Agent · api.acme-corp.com",
    outcome: "critical",
    lines: [
      { phase: "discover", text: "surface: POST /api/login — user input reaches SQL sink", tone: "dim" },
      { phase: "exploit", text: "payload ' OR 1=1-- → authentication bypassed", tone: "warn" },
      { phase: "exploit", text: "3 sample rows extracted — impact proven, run halted", tone: "warn" },
      { phase: "validate", text: "severity recalibrated CVSS 7.3 → 9.8 — exploited", tone: "crit" },
      { phase: "report", text: "evidence + reproduction steps written to report", tone: "ok" },
    ],
    result: "Validated — proof of impact, not a scanner guess",
  },
  {
    source: "Cloud Exploit Agent · AWS prod account",
    outcome: "high",
    lines: [
      { phase: "discover", text: "role build-ci grants iam:PassRole + lambda:CreateFunction", tone: "dim" },
      { phase: "exploit", text: "PassRole → Lambda chain executed under read-only proof", tone: "warn" },
      { phase: "exploit", text: "admin-scoped credentials reachable — chain complete", tone: "warn" },
      { phase: "validate", text: "escalation path validated end-to-end — CVSS 8.8", tone: "warn" },
      { phase: "report", text: "attack graph rendered into the cloud companion report", tone: "ok" },
    ],
    result: "Validated — a real path to admin, not a posture warning",
  },
  {
    source: "Identity Exploit Agent · corp.local (Active Directory)",
    outcome: "high",
    lines: [
      { phase: "discover", text: "BloodHound: SPN svc-backup is a Kerberoast candidate", tone: "dim" },
      { phase: "exploit", text: "TGS ticket captured — cracked offline in 4m 12s", tone: "warn" },
      { phase: "exploit", text: "creds valid · 2 hops from Domain Admin — 0 lockouts", tone: "warn" },
      { phase: "validate", text: "privilege-escalation path confirmed — CVSS 8.6", tone: "warn" },
      { phase: "report", text: "identity graph + path evidence attached to report", tone: "ok" },
    ],
    result: "Validated — Domain Admin path proven without a single lockout",
  },
  {
    source: "AI Red Team Agent · support-bot · RAG pipeline",
    outcome: "high",
    lines: [
      { phase: "discover", text: "untrusted surface: ticket body flows into model context", tone: "dim" },
      { phase: "exploit", text: "indirect prompt injection planted via support ticket", tone: "warn" },
      { phase: "exploit", text: "system prompt extracted · delete_user call captured — never executed", tone: "warn" },
      { phase: "validate", text: "mapped to OWASP LLM01 + MITRE ATLAS — CVSS 8.1", tone: "warn" },
      { phase: "report", text: "AI security assessment updated with captured evidence", tone: "ok" },
    ],
    result: "Validated — excessive agency proven, tool calls never executed",
  },
  {
    source: "Cross-Validation Agent · SAST finding #214",
    outcome: "removed",
    lines: [
      { phase: "discover", text: "SAST flag: reflected XSS in /search?q= (Semgrep)", tone: "dim" },
      { phase: "exploit", text: "replaying 12 payload variants against the live endpoint", tone: "warn" },
      { phase: "exploit", text: "0 of 12 reflected — output encoding verified at render", tone: "dim" },
      { phase: "validate", text: "not reproducible — confidence 0.08, below threshold", tone: "dim" },
      { phase: "report", text: "eliminated — this never reaches your report", tone: "ok" },
    ],
    result: "Eliminated — you only read findings that are real",
  },
];

const NEXT_PHASE: Record<Phase, Phase> = {
  discover: "exploit",
  exploit: "validate",
  validate: "report",
  report: "hold",
  hold: "discover",
};

const PHASE_MS: Record<Phase, number> = {
  discover: 1500,
  exploit: 3000,
  validate: 1900,
  report: 1500,
  hold: 1900,
};

const PHASE_RANK: Record<StepPhase, number> = {
  discover: 0,
  exploit: 1,
  validate: 2,
  report: 3,
};

const PHASE_TAG: Record<StepPhase, string> = {
  discover: "recon",
  exploit: "exploit",
  validate: "verify",
  report: "report",
};

const TONE_CLASS: Record<Tone, string> = {
  dim: "text-slate-400",
  warn: "text-orange-200/90",
  crit: "text-red-300",
  ok: "text-emerald-300/90",
};

const OUTCOME_STYLE: Record<
  Outcome,
  { label: string; icon: typeof Crosshair; badge: string; text: string }
> = {
  critical: {
    label: "Exploited · Critical",
    icon: Crosshair,
    badge: "border-red-400/40 bg-red-500/15 text-red-300",
    text: "text-red-300",
  },
  high: {
    label: "Exploited · High",
    icon: Crosshair,
    badge: "border-orange-400/40 bg-orange-500/15 text-orange-300",
    text: "text-orange-300",
  },
  removed: {
    label: "False Positive",
    icon: ShieldCheck,
    badge: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
    text: "text-emerald-300",
  },
};

const STEPS = ["Discover", "Exploit", "Validate", "Report"] as const;

function phaseRank(phase: Phase): number {
  return phase === "hold" ? PHASE_RANK.report : PHASE_RANK[phase];
}

function statusFor(phase: Phase, scenario: Scenario): {
  text: string;
  className: string;
} {
  const outcomeStyle = OUTCOME_STYLE[scenario.outcome];
  switch (phase) {
    case "discover":
      return { text: "Mapping the attack surface…", className: "text-slate-400" };
    case "exploit":
      return { text: "Controlled exploitation in progress…", className: "text-orange-300" };
    case "validate":
      return { text: "Validating impact — recalibrating severity…", className: "text-slate-300" };
    default:
      return { text: scenario.result, className: outcomeStyle.text };
  }
}

export function MaestroAssessmentDemo() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.3 });

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [livePhase, setLivePhase] = useState<Phase>("discover");
  const [validated, setValidated] = useState(0);

  // Static frame for users who opt out of motion: held at validation, badge shown.
  const phase: Phase = reducedMotion ? "validate" : livePhase;
  const scenario = SCENARIOS[scenarioIndex];

  useEffect(() => {
    if (reducedMotion || !inView) return;
    const timer = setTimeout(() => {
      if (livePhase === "report" && SCENARIOS[scenarioIndex].outcome !== "removed") {
        setValidated((n) => n + 1);
      }
      if (livePhase === "hold") {
        setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
      }
      setLivePhase(NEXT_PHASE[livePhase]);
    }, PHASE_MS[livePhase]);
    return () => clearTimeout(timer);
  }, [livePhase, inView, reducedMotion, scenarioIndex]);

  const rank = phaseRank(phase);
  const visibleLines = scenario.lines.filter((l) => PHASE_RANK[l.phase] <= rank);
  const badgeVisible = rank >= PHASE_RANK.validate;
  const outcomeStyle = OUTCOME_STYLE[scenario.outcome];
  const OutcomeIcon = outcomeStyle.icon;
  const status = statusFor(phase, scenario);

  return (
    <div
      ref={containerRef}
      className="max-w-4xl mx-auto h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-4 sm:p-6"
      role="img"
      aria-label="Animated diagram: Maestro's AI agents discover a vulnerability, exploit it under controlled safety rules, validate real impact with recalibrated severity, and write evidence-backed findings to the report — eliminating false positives along the way."
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
          </span>
          Maestro · Autonomous pentest in progress
        </div>
        <div className="text-xs text-slate-500">
          Report ·{" "}
          <motion.span
            key={validated}
            initial={{ scale: 1.4, color: "#fb923c" }}
            animate={{ scale: 1, color: "#94a3b8" }}
            transition={{ duration: 0.5 }}
            className="inline-block font-medium tabular-nums"
          >
            {validated}
          </motion.span>{" "}
          validated {validated === 1 ? "finding" : "findings"}
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
        {STEPS.map((step, i) => {
          const active = i === rank;
          const stepColor =
            active && i === STEPS.length - 1
              ? outcomeStyle.text
              : active
                ? "text-orange-300"
                : "text-slate-600";
          return (
            <div key={step} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && (
                <div className="w-4 sm:w-8 border-t border-dashed border-white/10" />
              )}
              <div className={`flex items-center gap-1.5 ${stepColor}`}>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${
                    active ? "border-current bg-current/10" : "border-slate-700"
                  }`}
                >
                  {i + 1}
                </span>
                {/* Four steps overflow a phone viewport; collapse inactive labels there */}
                <span
                  className={`text-[10px] uppercase tracking-widest ${
                    active ? "" : "hidden sm:inline"
                  }`}
                >
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent terminal — grows to absorb extra height when displayed
          beside the (taller) Whiteout demo */}
      <div className="relative flex-1 flex flex-col">
        <div
          className={`relative flex-1 flex flex-col rounded-xl border bg-slate-900/90 backdrop-blur-md transition-colors duration-500 ${
            phase === "exploit" || phase === "validate"
              ? "border-orange-400/40"
              : "border-white/10"
          }`}
        >
          {/* Window title bar */}
          <div className="flex items-center gap-1.5 rounded-t-xl border-b border-white/5 bg-white/[0.03] px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/40" />
            <span className="ml-1.5 text-[10px] text-slate-500 truncate">
              {scenario.source}
            </span>
          </div>

          {/* Log body */}
          <div className="flex-1 min-h-[124px] p-3 font-mono text-left text-[10px] sm:text-[11px] leading-relaxed">
            {visibleLines.map((line, i) => {
              const phaseStart = scenario.lines.findIndex(
                (l) => l.phase === line.phase
              );
              const delayInPhase =
                line.phase === phase ? (i - phaseStart) * 0.55 : 0;
              return (
                <motion.div
                  key={`${scenarioIndex}-${i}`}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: delayInPhase }}
                  className="flex gap-2"
                >
                  <span className="shrink-0 text-slate-600">
                    [{PHASE_TAG[line.phase]}]
                  </span>
                  <span className={TONE_CLASS[line.tone]}>{line.text}</span>
                </motion.div>
              );
            })}
            {!reducedMotion && phase !== "hold" && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-3 bg-orange-400/70 align-middle"
              />
            )}
          </div>

          {/* Outcome badge */}
          <AnimatePresence>
            {badgeVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute -top-2.5 right-2.5 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-md ${outcomeStyle.badge}`}
              >
                <OutcomeIcon className="w-3 h-3" />
                {outcomeStyle.label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Status line */}
      <div className="mt-3 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={status.text}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className={`text-xs ${status.className}`}
          >
            {status.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Stats footer */}
      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
        {[
          { value: "21", label: "AI Agents" },
          { value: "213", label: "MCP Tools" },
          { value: "232", label: "Test Matrix" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-lg font-bold font-mono text-white">{stat.value}</div>
            <div className="text-[10px] text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
