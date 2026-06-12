import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUp,
  FileText,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Users,
} from "lucide-react";

type Verdict = "redact" | "block" | "allow";

interface Scenario {
  source: string;
  before: string;
  sensitive?: string;
  after?: string;
  redacted?: string;
  attachment?: { name: string; meta: string };
  policy: string;
  verdict: Verdict;
  result: string;
}

const SCENARIOS: Scenario[] = [
  {
    source: "chatgpt.com · Clinical staff",
    before: "Summarize the discharge notes for ",
    sensitive: "Jane Mills, MRN 4471-09",
    after: " and draft a referral letter.",
    redacted: "[PATIENT-01]",
    policy: "HIPAA §164.502 · PHI detected",
    verdict: "redact",
    result: "PHI redacted — sanitized prompt delivered",
  },
  {
    source: "Copilot Chat · IDE",
    before: "Auth keeps failing — here's our key: ",
    sensitive: "AWS_SECRET_KEY=wJalrXUtnFEMI…",
    policy: "Credential Exposure · live secret",
    verdict: "block",
    result: "Blocked — the secret never left your network",
  },
  {
    source: "claude.ai · Marketing",
    before: "Draft a follow-up email to our Q3 webinar attendees.",
    policy: "60+ policies evaluated · no violation",
    verdict: "allow",
    result: "Compliant — delivered unchanged",
  },
  {
    source: "gemini.google.com · Finance",
    before: "Summarize the key risks in this deck.",
    attachment: { name: "Q3-Board-Deck.pdf", meta: "12 pages" },
    policy: "Internal Use Only · confidential document",
    verdict: "block",
    result: "Blocked — 12 pages of board material never left your network",
  },
];

type Phase = "enter" | "travel" | "scan" | "verdict" | "deliver" | "hold";

const NEXT_PHASE: Record<Phase, Phase> = {
  enter: "travel",
  travel: "scan",
  scan: "verdict",
  verdict: "deliver",
  deliver: "hold",
  hold: "enter",
};

const PHASE_MS: Record<Phase, number> = {
  enter: 700,
  travel: 1000,
  scan: 1700,
  verdict: 1100,
  deliver: 1100,
  hold: 1800,
};

const VERDICT_STYLE: Record<
  Verdict,
  {
    label: string;
    icon: typeof ShieldCheck;
    badge: string;
    text: string;
    enforcing: string;
  }
> = {
  redact: {
    label: "Redacted",
    icon: ShieldAlert,
    badge: "border-amber-400/40 bg-amber-500/15 text-amber-300",
    text: "text-amber-300",
    enforcing: "Policy matched — redacting sensitive data…",
  },
  block: {
    label: "Blocked",
    icon: ShieldX,
    badge: "border-red-400/40 bg-red-500/15 text-red-300",
    text: "text-red-300",
    enforcing: "Policy matched — blocking transmission…",
  },
  allow: {
    label: "Allowed",
    icon: ShieldCheck,
    badge: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
    text: "text-emerald-300",
    enforcing: "No violation found — releasing prompt…",
  },
};

const STEPS = ["Intercept", "Evaluate", "Enforce"] as const;

function stepFor(phase: Phase): number {
  if (phase === "enter" || phase === "travel") return 0;
  if (phase === "scan" || phase === "verdict") return 1;
  return 2;
}

function statusFor(phase: Phase, scenario: Scenario): {
  text: string;
  className: string;
} {
  const verdictStyle = VERDICT_STYLE[scenario.verdict];
  switch (phase) {
    case "enter":
    case "travel":
      return { text: "Intercepting prompt in transit…", className: "text-slate-400" };
    case "scan":
      return { text: "Evaluating against 60+ compliance policies…", className: "text-blue-300" };
    case "verdict":
      return { text: verdictStyle.enforcing, className: "text-slate-300" };
    default:
      return { text: scenario.result, className: verdictStyle.text };
  }
}

export function PromptInterceptionDemo() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.3 });

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [livePhase, setLivePhase] = useState<Phase>("enter");
  const [audited, setAudited] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  // Static frame for users who opt out of motion: held at the gate, verdict shown.
  const phase: Phase = reducedMotion ? "verdict" : livePhase;
  const scenario = SCENARIOS[scenarioIndex];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => setTrackWidth(track.offsetWidth));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView) return;
    const timer = setTimeout(() => {
      if (livePhase === "deliver") setAudited((n) => n + 1);
      if (livePhase === "hold") {
        setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
      }
      setLivePhase(NEXT_PHASE[livePhase]);
    }, PHASE_MS[livePhase]);
    return () => clearTimeout(timer);
  }, [livePhase, inView, reducedMotion]);

  // On wide tracks the card queues up just left of the gate and stops short
  // of the platform node; on narrow tracks there isn't room, so it overlaps.
  const cardWidth = cardRef.current?.offsetWidth ?? 280;
  const nodeClearance = 92;
  const wide = trackWidth / 2 - cardWidth - 12 >= nodeClearance;
  const startX = wide ? nodeClearance : 4;
  const midX = wide
    ? trackWidth / 2 - cardWidth - 12
    : Math.max(4, (trackWidth - cardWidth) / 2);
  const endX = Math.max(midX, trackWidth - cardWidth - (wide ? nodeClearance : 4));

  const atGate = phase === "scan" || phase === "verdict";
  const delivered = phase === "deliver" || phase === "hold";
  const blocked = scenario.verdict === "block";
  const showRedacted = scenario.verdict === "redact" && delivered;
  const activeStep = stepFor(phase);

  // Vertical centering lives in the motion value (y: -50%) because framer
  // overwrites the transform property, killing any Tailwind translate class.
  const centerY = { y: "-50%" as const };
  const cardTarget = delivered
    ? blocked
      ? { x: midX, ...centerY, opacity: 0, scale: 0.9 }
      : { x: endX, ...centerY, opacity: 1, scale: 1 }
    : phase === "enter"
      ? { x: startX, ...centerY, opacity: 1, scale: 1 }
      : { x: midX, ...centerY, opacity: 1, scale: 1 };

  const status = statusFor(phase, scenario);
  const verdictStyle = VERDICT_STYLE[scenario.verdict];
  const VerdictIcon = verdictStyle.icon;

  return (
    <div
      ref={containerRef}
      className="max-w-4xl mx-auto h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-4 sm:p-6"
      role="img"
      aria-label="Animated diagram: Whiteout AI intercepts each prompt between your workforce and AI platforms, evaluates it against compliance policies, then redacts, blocks, or allows it — and logs every decision to the audit trail."
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Whiteout AI · Live policy enforcement
        </div>
        <div className="text-xs text-slate-500">
          Audit trail ·{" "}
          <motion.span
            key={audited}
            initial={{ scale: 1.4, color: "#34d399" }}
            animate={{ scale: 1, color: "#94a3b8" }}
            transition={{ duration: 0.5 }}
            className="inline-block font-medium tabular-nums"
          >
            {audited}
          </motion.span>{" "}
          {audited === 1 ? "event" : "events"}
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
        {STEPS.map((step, i) => {
          const active = i === activeStep;
          const stepColor =
            active && i === 2
              ? verdictStyle.text
              : active
                ? "text-blue-300"
                : "text-slate-600";
          return (
            <div key={step} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && (
                <div className="w-5 sm:w-10 border-t border-dashed border-white/10" />
              )}
              <div className={`flex items-center gap-1.5 ${stepColor}`}>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${
                    active ? "border-current bg-current/10" : "border-slate-700"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[10px] uppercase tracking-widest">
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Track — flex-1 keeps the stats footer bottom-aligned with the
          Maestro demo when the two render side by side */}
      <div ref={trackRef} className="relative flex-1 min-h-[12rem] sm:min-h-[11rem]">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/10" />

        {/* Endpoint nodes */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 w-20">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-[10px] text-slate-400 text-center leading-tight">
            Your workforce
            <span className="hidden sm:block text-slate-600">
              Browser · IDE · Desktop
            </span>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 w-20">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-white/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-slate-300" />
          </div>
          <div className="text-[10px] text-slate-400 text-center leading-tight">
            AI platforms
            <span className="hidden sm:block text-slate-600">
              ChatGPT · Claude · Gemini
            </span>
          </div>
        </div>

        {/* Whiteout gate */}
        <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 flex flex-col items-center justify-center">
          <div className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-blue-400/50 to-transparent" />
          <div className="relative w-12 h-12 rounded-full bg-slate-900/90 border border-blue-400/40 flex items-center justify-center">
            {atGate && (
              <motion.div
                className="absolute inset-0 rounded-full border border-blue-400/60"
                animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <img
              src="/icononly_transparent_nobuffer.png"
              alt=""
              className="w-7 h-7 object-contain"
            />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-950/80 px-1.5 py-0.5 text-center leading-tight">
            <span className="block text-[10px] font-medium text-slate-300">
              Whiteout AI
            </span>
            <span className="hidden sm:block text-[9px] text-slate-600">
              Policy engine
            </span>
          </div>

          {/* Policy chip */}
          <AnimatePresence>
            {atGate && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="absolute top-0 whitespace-nowrap rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] text-blue-200"
              >
                {phase === "scan" ? "Scanning…" : scenario.policy}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prompt card, styled as a chat composer */}
        <motion.div
          ref={cardRef}
          key={scenarioIndex}
          initial={{ x: startX, y: "-50%", opacity: 0, scale: 0.96 }}
          animate={cardTarget}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          className="absolute top-1/2 z-10 w-56 sm:w-72"
        >
          <div
            className={`relative rounded-xl border bg-slate-900/90 backdrop-blur-md overflow-visible transition-colors duration-500 ${
              atGate ? "border-blue-400/40" : "border-white/10"
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

            {/* Composer body */}
            <div className="flex items-end gap-2 p-3">
              <div className="flex-1">
                {scenario.attachment && (
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-400/5 px-2 py-1">
                    <FileText className="w-3.5 h-3.5 text-amber-300/80" />
                    <span className="text-[10px] text-slate-300">
                      {scenario.attachment.name}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {scenario.attachment.meta}
                    </span>
                  </div>
                )}
                <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
                {scenario.before}
                {scenario.sensitive &&
                  (showRedacted ? (
                    <span className="rounded bg-emerald-400/15 px-1 font-mono text-emerald-300">
                      {scenario.redacted}
                    </span>
                  ) : (
                    <span className="rounded bg-amber-400/15 px-1 text-amber-200">
                      {scenario.sensitive}
                    </span>
                  ))}
                  {scenario.after}
                </p>
              </div>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <ArrowUp className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>

            {/* Verdict badge */}
            <AnimatePresence>
              {(phase === "verdict" || delivered) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute -top-2.5 right-2.5 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-md ${verdictStyle.badge}`}
                >
                  <VerdictIcon className="w-3 h-3" />
                  {verdictStyle.label}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
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
          { value: "60+", label: "AI Policies" },
          { value: "12", label: "Regulatory Frameworks" },
          { value: "23+", label: "AI Platforms" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
