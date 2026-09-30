import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SpinningMarkSvg } from "@/components/ui/spinning-mark";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/* The AI security stack drawn as a globe. The User layer is the outer shell
   Whiteout AI holds; each deeper layer of the stack nests beneath it, with
   your data at the core. Requests from any layer are checked at the shell on
   their way to an external AI service. */

type LayerId = "user" | "agent" | "infrastructure" | "access" | "data";

interface Layer {
  id: LayerId;
  label: string;
  tagline: string;
  examples: string;
  risk?: string;
  control: string;
}

const LAYERS: Layer[] = [
  {
    id: "user",
    label: "User",
    tagline: "People and the AI tools they reach for",
    examples: "ChatGPT · Copilot · Gemini · Claude Code · and more",
    risk: "A signed NDA pasted in for a summary. A live credential dropped into a coding assistant.",
    control:
      "Every prompt, paste, and file upload is intercepted at the browser, desktop, and IDE, evaluated before it leaves, and tied to the person who sent it.",
  },
  {
    id: "agent",
    label: "Agent",
    tagline: "Software acting on someone's behalf",
    examples: "Coding agents · MCP tools · autonomous workflows",
    risk: "An agent reads a file it was never meant to see and passes it to a model nobody reviewed.",
    control:
      "Held to the same 54 policies as the person who launched it. The MCP Gateway governs which tools an agent can reach, with policy checks on the traffic that flows through them.",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    tagline: "AI running inside your own cloud",
    examples: "Bedrock · EKS · EC2 · ECS · Lambda",
    risk: "A workload calls a model endpoint nobody registered, from inside your own VPC.",
    control:
      "An eBPF egress classifier sees AI-bound traffic with no code changes, and every Bedrock invocation is evaluated against the same policies as human traffic.",
  },
  {
    id: "access",
    label: "Access",
    tagline: "Standing permissions AI already holds",
    examples: "OAuth grants · Microsoft 365 · Google Workspace",
    risk: "One tenant-wide consent grant quietly hands an AI vendor every mailbox in the company.",
    control:
      "AI Connector finds per-user and tenant-wide grants in your identity layer, and revokes them from the same console where you found them.",
  },
  {
    id: "data",
    label: "Your Data",
    tagline: "What every layer above protects",
    examples: "PHI · PII · GDPR · Legal · Finance · Security · Confidential · Code",
    control:
      "54 policies across 8 domains define what counts as sensitive. One engine enforces them at every layer, so nothing reaches the core by a route with a quieter ruleset.",
  },
];

/* Geometry, in viewBox units */

const C = 320;
const OUTER: Record<LayerId, number> = {
  user: 234,
  agent: 190,
  infrastructure: 146,
  access: 102,
  data: 58,
};
const SHELL = OUTER.user;
const ORBIT = 284;
/* Unnamed services along the orbit, so the four named ones read as examples
   rather than the full list. Kept clear of the orbit's label arc (top). */
const MORE_SERVICES = [22, 38, 76, 90, 104, 124, 166, 178];

const RING_FILL: Record<LayerId, string> = {
  user: "#EEF3F9",
  agent: "#E3EAF3",
  infrastructure: "#D8E2EE",
  access: "#CCD8E7",
  data: "#0F1B2D",
};
const RING_FILL_ACTIVE = "#D3E2F5";
const CORE_FILL_ACTIVE = "#164F96";

const BLUE = "#1A5FB4";
const ORANGE = "#C77800";
const GREEN = "#2E7D32";
const RED = "#B3261E";

function pt(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
}

/* The inner edge of each band is the outer edge of the next layer in */
function innerRadius(id: LayerId): number {
  const i = LAYERS.findIndex((l) => l.id === id);
  const next = LAYERS[i + 1];
  return next ? OUTER[next.id] : 0;
}

/* Label arcs run clockwise across the top 120° of each band, so the text
   reads left to right with its baseline curving along the band */
function topArc(r: number): string {
  const [x1, y1] = pt(r, -150);
  const [x2, y2] = pt(r, -30);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
}

/* Wireframe meridians: rx follows R·|sin(longitude)| as the globe turns */
const MERIDIAN_STEPS = Array.from({ length: 13 }, (_, i) => i * 15);
function meridianValues(offsetDeg: number): string {
  return MERIDIAN_STEPS.map((t) =>
    (SHELL * Math.abs(Math.sin(((offsetDeg + t) * Math.PI) / 180))).toFixed(1)
  ).join(";");
}

interface Packet {
  from: "user" | "agent" | "infrastructure";
  angle: number;
  verdict: "allowed" | "blocked";
  begin: number;
  /* Where an allowed packet lands on the orbit */
  service?: string;
}

/* Kept clear of the label arcs (top) and the Whiteout AI badge (bottom) */
const PACKETS: Packet[] = [
  { from: "user", angle: -8, verdict: "allowed", begin: 0, service: "ChatGPT" },
  { from: "agent", angle: 32, verdict: "blocked", begin: 0.7 },
  { from: "infrastructure", angle: 148, verdict: "allowed", begin: 1.4, service: "Bedrock" },
  { from: "user", angle: 172, verdict: "blocked", begin: 2.1 },
  { from: "agent", angle: 196, verdict: "allowed", begin: 2.8, service: "Claude" },
  { from: "infrastructure", angle: 56, verdict: "allowed", begin: 3.5, service: "Gemini" },
];
const PACKET_DUR = "4.2s";
const PACKET_START: Record<Packet["from"], number> = {
  user: 198,
  agent: 168,
  infrastructure: 124,
};

function PacketTrail({ packet }: { packet: Packet }) {
  const r0 = PACKET_START[packet.from];
  const color = packet.from === "user" ? BLUE : ORANGE;
  const verdictColor = packet.verdict === "allowed" ? GREEN : RED;
  const [x0, y0] = pt(r0, packet.angle);
  const [xs, ys] = pt(SHELL, packet.angle);
  const begin = `${packet.begin}s`;

  // Allowed packets cross the shell and carry on to the orbit; blocked ones
  // stop dead at the shell. Either way the verdict lands at the halfway mark.
  const allowed = packet.verdict === "allowed";
  const [x1, y1] = allowed ? pt(ORBIT, packet.angle) : [xs, ys];
  const shellFraction = allowed ? ((SHELL - r0) / (ORBIT - r0)).toFixed(3) : "1";

  return (
    <>
      <g opacity={0} fill={color}>
        <animateMotion
          dur={PACKET_DUR}
          begin={begin}
          repeatCount="indefinite"
          path={`M ${x0} ${y0} L ${x1} ${y1}`}
          keyPoints={allowed ? `0;${shellFraction};1;1` : "0;1;1"}
          keyTimes={allowed ? "0;0.5;0.8;1" : "0;0.5;1"}
          calcMode="linear"
        />
        <animate
          attributeName="fill"
          dur={PACKET_DUR}
          begin={begin}
          repeatCount="indefinite"
          values={`${color};${color};${verdictColor};${verdictColor}`}
          keyTimes="0;0.48;0.52;1"
        />
        <animate
          attributeName="opacity"
          dur={PACKET_DUR}
          begin={begin}
          repeatCount="indefinite"
          values={allowed ? "0;1;1;0;0" : "0;1;1;0;0"}
          keyTimes={allowed ? "0;0.08;0.74;0.84;1" : "0;0.08;0.56;0.7;1"}
        />
        <circle r="9" fillOpacity="0.18" />
        <circle r="3.2" />
      </g>

      {/* Verdict ripple where the packet meets the shell */}
      <circle cx={xs} cy={ys} r={0} fill="none" stroke={verdictColor} strokeWidth="1.5" opacity={0}>
        <animate
          attributeName="r"
          dur={PACKET_DUR}
          begin={begin}
          repeatCount="indefinite"
          values="0;0;4;15;15"
          keyTimes="0;0.49;0.5;0.72;1"
        />
        <animate
          attributeName="opacity"
          dur={PACKET_DUR}
          begin={begin}
          repeatCount="indefinite"
          values="0;0;0.9;0;0"
          keyTimes="0;0.49;0.5;0.72;1"
        />
      </circle>
    </>
  );
}

export function AiSecurityGlobe() {
  const [active, setActive] = useState<LayerId>("user");
  const [hovered, setHovered] = useState<LayerId | null>(null);
  const reducedMotion = useReducedMotion();
  // On phones the orbit would shrink the band labels past legibility, so the
  // view crops to the globe itself and the service names drop out.
  const compact = useIsMobile();

  const rings = LAYERS.filter((l) => l.id !== "data");
  const activeInner = innerRadius(active);

  return (
    <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
      <div>
        <svg
          viewBox={compact ? "72 72 496 496" : "-20 16 700 626"}
          className="w-full h-auto max-w-[600px] mx-auto select-none"
          role="img"
          aria-label="The AI security stack as a globe. Whiteout AI holds the outer User layer; beneath it sit the Agent, Infrastructure, and Access layers, with your data at the core."
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <clipPath id="globe-clip">
              <circle cx={C} cy={C} r={SHELL} />
            </clipPath>
            {rings.map((l) => (
              <path key={l.id} id={`globe-arc-${l.id}`} d={topArc((OUTER[l.id] + innerRadius(l.id)) / 2 - 4)} />
            ))}
            <path id="globe-arc-orbit" d={topArc(ORBIT + 8)} />
            <radialGradient id="globe-shade" cx="36%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#0F1B2D" stopOpacity="0.14" />
            </radialGradient>
          </defs>

          {/* Orbit of external AI services */}
          {!compact && (
            <>
              <circle cx={C} cy={C} r={ORBIT} fill="none" stroke="#51617A" strokeWidth="0.8" strokeDasharray="2 5" opacity="0.45" />
              <text fontSize="10" fontWeight="600" letterSpacing="0.18em" fill="#6E7B8C">
                <textPath href="#globe-arc-orbit" startOffset="50%" textAnchor="middle">
                  EXTERNAL AI SERVICES
                </textPath>
              </text>
              {PACKETS.filter((p) => p.service).map((p) => {
                const [x, y] = pt(ORBIT, p.angle);
                const [lx, ly] = pt(ORBIT + 12, p.angle);
                const onLeft = Math.cos((p.angle * Math.PI) / 180) < 0;
                return (
                  <g key={p.service}>
                    <circle cx={x} cy={y} r="5" fill="#FFFFFF" stroke="#51617A" strokeWidth="1" />
                    <text
                      x={lx}
                      y={ly + 4}
                      fontSize="11"
                      fontWeight="600"
                      fill="#51617A"
                      textAnchor={onLeft ? "end" : "start"}
                    >
                      {p.service}
                    </text>
                  </g>
                );
              })}
              {MORE_SERVICES.map((angle) => {
                const [x, y] = pt(ORBIT, angle);
                return <circle key={angle} cx={x} cy={y} r="3.5" fill="#FFFFFF" stroke="#51617A" strokeWidth="1" opacity="0.7" />;
              })}
              <text x={C} y={C + ORBIT + 20} fontSize="11" fontWeight="600" fill="#51617A" textAnchor="middle">
                + many more
              </text>
            </>
          )}

          {/* Layer bands, outermost first so each inner disc sits on top */}
          {rings.map((l) => (
            <circle
              key={l.id}
              cx={C}
              cy={C}
              r={OUTER[l.id]}
              style={{
                fill: active === l.id || hovered === l.id ? RING_FILL_ACTIVE : RING_FILL[l.id],
                transition: "fill 200ms ease-out",
              }}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              className="cursor-pointer"
              onMouseEnter={() => setHovered(l.id)}
              onClick={() => setActive(l.id)}
            />
          ))}

          {/* Globe wireframe, turning slowly under the shell */}
          <g clipPath="url(#globe-clip)" fill="none" stroke={BLUE} strokeWidth="0.8" opacity="0.13" pointerEvents="none">
            {[-60, -30, 0, 30, 60].map((lat) => {
              const y = C + SHELL * Math.sin((lat * Math.PI) / 180);
              const half = SHELL * Math.cos((lat * Math.PI) / 180);
              return <line key={lat} x1={C - half} y1={y} x2={C + half} y2={y} />;
            })}
            {[0, 30, 60, 90, 120, 150].map((lon) => {
              const values = meridianValues(lon);
              return (
                <ellipse key={lon} cx={C} cy={C} rx={values.split(";")[0]} ry={SHELL}>
                  {!reducedMotion && (
                    <animate attributeName="rx" dur="36s" repeatCount="indefinite" values={values} />
                  )}
                </ellipse>
              );
            })}
          </g>

          {/* Sphere shading, lit from the upper left */}
          <circle cx={C} cy={C} r={SHELL} fill="url(#globe-shade)" pointerEvents="none" />

          {/* Core */}
          <circle
            cx={C}
            cy={C}
            r={OUTER.data}
            style={{
              fill: active === "data" || hovered === "data" ? CORE_FILL_ACTIVE : RING_FILL.data,
              transition: "fill 200ms ease-out",
            }}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            className="cursor-pointer"
            onMouseEnter={() => setHovered("data")}
            onClick={() => setActive("data")}
          />
          <g pointerEvents="none" textAnchor="middle">
            <text x={C} y={C + 1} fontSize="13" fontWeight="700" letterSpacing="0.14em" fill="#FFFFFF">
              YOUR DATA
            </text>
            <text x={C} y={C + 18} fontSize="10" fill="#C9D6E8">
              54 policies
            </text>
          </g>

          {/* Band labels */}
          <g pointerEvents="none">
            {rings.map((l) => (
              <text
                key={l.id}
                fontSize="12.5"
                fontWeight={active === l.id ? 700 : 600}
                letterSpacing="0.18em"
                fill={active === l.id ? BLUE : "#3D4B5F"}
              >
                <textPath href={`#globe-arc-${l.id}`} startOffset="50%" textAnchor="middle">
                  {l.label.toUpperCase()}
                </textPath>
              </text>
            ))}
          </g>

          {/* Active layer outline */}
          <g fill="none" stroke={BLUE} strokeWidth="1.5" pointerEvents="none">
            <circle cx={C} cy={C} r={OUTER[active]} />
            {activeInner > 0 && <circle cx={C} cy={C} r={activeInner} />}
          </g>

          {/* Whiteout AI's shell */}
          <circle cx={C} cy={C} r={SHELL} fill="none" stroke={BLUE} strokeWidth="2.5" pointerEvents="none" />
          <circle cx={C} cy={C} r={SHELL + 7} fill="none" stroke={BLUE} strokeWidth="0.8" opacity="0.3" pointerEvents="none" />

          {!reducedMotion && PACKETS.map((p) => <PacketTrail key={`${p.from}-${p.angle}`} packet={p} />)}

          {/* Badge naming who holds the shell */}
          <g pointerEvents="none">
            <rect x={C - 60} y={C + 212 - 14} width="120" height="28" rx="14" fill="#FFFFFF" stroke={BLUE} strokeWidth="1" />
            <SpinningMarkSvg x={C - 52} y={C + 212 - 10} size={20} />
            <text x={C - 27} y={C + 216} fontSize="11.5" fontWeight="700" fill="#0F1B2D">
              Whiteout AI
            </text>
          </g>
        </svg>

        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#51617A]">
          {[
            { color: BLUE, label: "Person" },
            { color: ORANGE, label: "Agent or workload" },
            { color: GREEN, label: "Allowed out" },
            { color: RED, label: "Blocked at the shell" },
          ].map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        {LAYERS.map((layer, i) => {
          const isActive = active === layer.id;
          return (
            <button
              type="button"
              key={layer.id}
              onClick={() => setActive(layer.id)}
              onMouseEnter={() => setHovered(layer.id)}
              onMouseLeave={() => setHovered(null)}
              aria-expanded={isActive}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer",
                isActive
                  ? "bg-white border-[#1A5FB4]/35 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]"
                  : "border-transparent hover:bg-[#0F1B2D]/[0.025]"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn("text-[11px] font-mono tabular-nums", isActive ? "text-[#1A5FB4]" : "text-[#6E7B8C]")}>
                  0{i + 1}
                </span>
                <span className="text-sm font-bold text-[#0F1B2D]">{layer.label}</span>
                {layer.id === "user" && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-[#1A5FB4]/10 text-[#1A5FB4]">
                    Outer shell
                  </span>
                )}
                <span className="hidden sm:inline text-xs text-[#51617A] truncate">{layer.tagline}</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 ml-auto flex-shrink-0 transition-transform",
                    isActive ? "rotate-180 text-[#1A5FB4]" : "text-[#0F1B2D]/30"
                  )}
                />
              </div>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 pl-8 space-y-2.5">
                      <p className="text-[11px] font-mono text-[#51617A]">{layer.examples}</p>
                      {layer.risk && (
                        <p className="text-sm text-[#51617A] leading-relaxed">
                          <span className="font-semibold text-[#B3261E]">The risk. </span>
                          {layer.risk}
                        </p>
                      )}
                      <p className="text-sm text-[#51617A] leading-relaxed">
                        <span className="font-semibold text-[#1A5FB4]">Whiteout AI. </span>
                        {layer.control}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
}
