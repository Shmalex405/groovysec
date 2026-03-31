"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: number;
  title: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  tags?: string[];
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  centerIcon?: React.ElementType;
  centerImage?: string;
  centerImageClass?: string;
  centerLabel?: string;
  variant?: "blue" | "orange";
  className?: string;
}

/* ── Magnetic particle field for each node ── */
function MagneticParticles({
  count,
  color,
  isHovered,
}: {
  count: number;
  color: string;
  isHovered: boolean;
}) {
  const controls = useAnimation();
  const positions = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * 120 - 60,
        y: Math.random() * 120 - 60,
      })),
    [count]
  );

  useEffect(() => {
    if (isHovered) {
      controls.start({
        x: 0,
        y: 0,
        transition: { type: "spring", stiffness: 60, damping: 12 },
      });
    } else {
      controls.start((i: number) => ({
        x: positions[i]?.x ?? 0,
        y: positions[i]?.y ?? 0,
        transition: { type: "spring", stiffness: 80, damping: 14 },
      }));
    }
  }, [isHovered, controls, positions]);

  return (
    <>
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          custom={i}
          initial={{ x: pos.x, y: pos.y }}
          animate={controls}
          className={cn(
            "absolute rounded-full pointer-events-none transition-opacity duration-300",
            color,
            isHovered ? "opacity-100" : "opacity-50"
          )}
          style={{ width: Math.random() * 4 + 2, height: Math.random() * 4 + 2 }}
        />
      ))}
    </>
  );
}

export default function RadialOrbitalTimeline({
  timelineData,
  centerIcon: CenterIcon,
  centerImage,
  centerImageClass,
  centerLabel,
  variant = "blue",
  className,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [autoShowcase, setAutoShowcase] = useState(true);
  const showcaseTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const colors = {
    blue: {
      center: "from-blue-500 via-cyan-400 to-emerald-400",
      centerGlow: "shadow-blue-500/40",
      nodeActive: "bg-gradient-to-br from-blue-500 to-cyan-400 text-white border-blue-300 shadow-lg shadow-blue-500/40",
      nodeHover: "bg-gradient-to-br from-blue-500/80 to-cyan-400/60 text-white border-blue-400/60 shadow-md shadow-blue-500/30",
      nodeRelated: "bg-blue-500/30 text-white border-blue-400/50",
      nodeDefault: "bg-white/[0.08] text-blue-200 border-blue-400/30 hover:border-blue-400/50 shadow-md shadow-blue-500/10",
      card: "border-blue-500/30",
      ring: "border-blue-400/15",
      ring2: "border-blue-400/8",
      tagBg: "bg-blue-500/15 text-blue-200 border-blue-400/25",
      particle: "bg-blue-300",
      labelGradient: "bg-gradient-to-r from-blue-200 to-emerald-200",
      labelGradientHover: "bg-gradient-to-r from-blue-300 to-emerald-300",
    },
    orange: {
      center: "from-orange-500 via-red-400 to-amber-400",
      centerGlow: "shadow-orange-500/40",
      nodeActive: "bg-gradient-to-br from-orange-500 to-red-400 text-white border-orange-300 shadow-lg shadow-orange-500/40",
      nodeHover: "bg-gradient-to-br from-orange-500/80 to-red-400/60 text-white border-orange-400/60 shadow-md shadow-orange-500/30",
      nodeRelated: "bg-orange-500/30 text-white border-orange-400/50",
      nodeDefault: "bg-white/[0.08] text-orange-200 border-orange-400/30 hover:border-orange-400/50 shadow-md shadow-orange-500/10",
      card: "border-orange-500/30",
      ring: "border-orange-400/15",
      ring2: "border-orange-400/8",
      tagBg: "bg-orange-500/15 text-orange-200 border-orange-400/25",
      particle: "bg-orange-300",
      labelGradient: "bg-gradient-to-r from-orange-200 to-red-200",
      labelGradientHover: "bg-gradient-to-r from-orange-300 to-red-300",
    },
  };

  const c = colors[variant];

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    // Stop auto-showcase on manual interaction
    setAutoShowcase(false);
    if (showcaseTimerRef.current) clearTimeout(showcaseTimerRef.current);

    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulse: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (autoRotate) {
      timer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
      }, 50);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [autoRotate]);

  // Auto-showcase: slowly cycle through nodes with long pauses
  useEffect(() => {
    if (!autoShowcase) return;

    const ids = [...timelineData.map((d) => d.id)].reverse();
    let idx = -1;
    let phase: "idle" | "showing" = "idle";

    const cycle = () => {
      if (phase === "idle") {
        // Open next node (right to left)
        idx = (idx + 1) % ids.length;
        const id = ids[idx];

        setExpandedItems({ [id]: true });
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = timelineData.find((i) => i.id === id)?.relatedIds || [];
        const newPulse: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);

        phase = "showing";
        showcaseTimerRef.current = setTimeout(cycle, 7000); // Show card for 7s
      } else {
        // Close and let spinner rotate freely
        setExpandedItems({});
        setActiveNodeId(null);
        setPulseEffect({});
        setAutoRotate(true);

        phase = "idle";
        showcaseTimerRef.current = setTimeout(cycle, 8000); // Spin freely for 8s
      }
    };

    showcaseTimerRef.current = setTimeout(cycle, 3000); // Initial delay

    return () => {
      if (showcaseTimerRef.current) clearTimeout(showcaseTimerRef.current);
    };
  }, [autoShowcase, timelineData]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 210;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusLabel = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed": return "ACTIVE";
      case "in-progress": return "IN PROGRESS";
      case "pending": return "PLANNED";
    }
  };

  const getStatusStyle = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed": return "text-emerald-300 bg-emerald-500/15 border-emerald-400/25";
      case "in-progress": return "text-amber-300 bg-amber-500/15 border-amber-400/25";
      case "pending": return "text-slate-400 bg-white/[0.05] border-white/10";
    }
  };

  return (
    <div
      className={cn("w-full flex flex-col items-center justify-center overflow-visible", className)}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl flex items-center justify-center" style={{ height: 560 }}>
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Center node */}
          <div className="absolute flex items-center justify-center z-10">
            {centerImage ? (
              <div className="relative flex items-center justify-center">
                <div className={`absolute rounded-full border ${c.ring} animate-ping opacity-50`} style={{ width: 96, height: 96 }} />
                <div className={`absolute rounded-full border ${c.ring2} animate-ping opacity-30`} style={{ width: 116, height: 116, animationDelay: "0.5s" }} />
                <img src={centerImage} alt="" className={cn("w-20 h-20 object-contain drop-shadow-2xl animate-pulse", centerImageClass)} />
              </div>
            ) : CenterIcon ? (
              <div className={cn(
                "w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-2xl",
                c.center,
                c.centerGlow
              )}>
                <CenterIcon className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-md" />
            )}
          </div>
          {centerLabel && (
            <div className="absolute z-10 mt-24 text-sm font-bold text-white/70 tracking-widest uppercase">
              {centerLabel}
            </div>
          )}

          {/* No visible orbit ring — nodes float freely */}

          {/* Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const isHovered = hoveredId === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : isHovered ? 150 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Magnetic particles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <MagneticParticles
                    count={10}
                    color={c.particle}
                    isHovered={isHovered || isExpanded}
                  />
                </div>

                {/* Glow aura */}
                {(isHovered || isExpanded || isPulsing) && (
                  <div
                    className="absolute rounded-full animate-pulse pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${variant === "blue" ? "rgba(96,165,250,0.4)" : "rgba(251,146,60,0.4)"} 0%, transparent 70%)`,
                      width: 90,
                      height: 90,
                      left: -19,
                      top: -19,
                    }}
                  />
                )}

                {/* Node circle — big, bright, bold */}
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isExpanded ? `${c.nodeActive} scale-[1.5]` :
                  isHovered ? c.nodeHover :
                  isRelated ? `${c.nodeRelated} animate-pulse` :
                  c.nodeDefault
                )}>
                  <Icon size={24} className="drop-shadow-lg" />
                </div>

                {/* Label — gradient colored */}
                <div className={cn(
                  "absolute top-[4.25rem] left-1/2 -translate-x-1/2 text-base font-bold tracking-wide transition-all duration-300 bg-clip-text text-transparent max-w-[240px] text-center leading-tight",
                  isExpanded && "scale-110",
                  isExpanded || isHovered ? c.labelGradientHover : c.labelGradient,
                )}>
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <div className={cn(
                    "absolute top-24 left-1/2 -translate-x-1/2 w-80 bg-slate-950/95 backdrop-blur-xl rounded-xl border shadow-2xl shadow-black/50 overflow-visible",
                    c.card
                  )}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/30" />

                    <div className="p-5 pb-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold border", getStatusStyle(item.status))}>
                          {getStatusLabel(item.status)}
                        </span>
                        <span className="text-[11px] font-mono text-white/40 tracking-wider">{item.category}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{item.title}</h4>
                    </div>

                    <div className="px-5 pb-5 text-sm text-white/70 leading-relaxed">
                      <p>{item.content}</p>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {item.tags.map((tag) => (
                            <span key={tag} className={cn("text-[11px] px-2 py-0.5 rounded-full border font-semibold", c.tagBg)}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Related nodes */}
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/[0.08]">
                          <h5 className="text-[11px] uppercase tracking-wider font-bold text-white/50 mb-2">Connected Nodes</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relId) => {
                              const related = timelineData.find((i) => i.id === relId);
                              return (
                                <button
                                  key={relId}
                                  className={cn(
                                    "flex items-center h-6 px-2 text-[11px] font-medium rounded-lg border transition-all duration-200",
                                    "border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-white/70 hover:text-white"
                                  )}
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relId); }}
                                >
                                  {related?.title}
                                  <ArrowRight size={10} className="ml-1 text-white/40" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
