"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpinningMark } from "@/components/ui/spinning-mark";

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
  /** Render the spinning Groovy mark at the hub. */
  centerMark?: boolean;
  centerMarkClass?: string;
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
  centerMark,
  centerMarkClass,
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
      centerGlow: "shadow-blue-500/20",
      nodeActive: "bg-gradient-to-br from-blue-500 to-cyan-400 text-white border-blue-600 shadow-lg shadow-blue-500/20",
      nodeHover: "bg-gradient-to-br from-blue-500 to-cyan-400 text-white border-blue-500 shadow-md shadow-blue-500/20",
      nodeRelated: "bg-[#1A5FB4]/10 text-[#1A5FB4] border-[#1A5FB4]/40",
      nodeDefault: "bg-white text-[#1A5FB4] border-[#1A5FB4]/30 hover:border-[#1A5FB4]/50 shadow-md shadow-blue-500/10",
      card: "border-[#0F1B2D]/10",
      ring: "border-[#0F1B2D]/15",
      ring2: "border-[#0F1B2D]/10",
      tagBg: "bg-[#1A5FB4]/10 text-[#1A5FB4] border-[#1A5FB4]/25",
      particle: "bg-[#1A5FB4]",
      label: "text-[#0F1B2D]",
      labelHover: "text-[#1A5FB4]",
    },
    orange: {
      center: "from-orange-500 via-red-400 to-amber-400",
      centerGlow: "shadow-orange-500/20",
      nodeActive: "bg-gradient-to-br from-orange-500 to-red-400 text-white border-orange-600 shadow-lg shadow-orange-500/20",
      nodeHover: "bg-gradient-to-br from-orange-500 to-red-400 text-white border-orange-500 shadow-md shadow-orange-500/20",
      nodeRelated: "bg-[#A05F00]/10 text-[#A05F00] border-[#A05F00]/40",
      nodeDefault: "bg-white text-[#A05F00] border-[#A05F00]/30 hover:border-[#A05F00]/50 shadow-md shadow-orange-500/10",
      card: "border-[#0F1B2D]/10",
      ring: "border-[#0F1B2D]/15",
      ring2: "border-[#0F1B2D]/10",
      tagBg: "bg-[#A05F00]/10 text-[#A05F00] border-[#A05F00]/25",
      particle: "bg-[#A05F00]",
      label: "text-[#0F1B2D]",
      labelHover: "text-[#A05F00]",
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
      case "completed": return "text-[#2E7D32] bg-[#2E7D32]/10 border-[#2E7D32]/25";
      case "in-progress": return "text-[#A05F00] bg-[#A05F00]/10 border-[#A05F00]/25";
      case "pending": return "text-[#51617A] bg-[#0F1B2D]/[0.04] border-[#0F1B2D]/15";
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
            {centerMark ? (
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute rounded-full bg-white border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]"
                  style={{ width: 88, height: 88 }}
                />
                <div className={`absolute rounded-full border ${c.ring} animate-ping opacity-50`} style={{ width: 96, height: 96 }} />
                <div className={`absolute rounded-full border ${c.ring2} animate-ping opacity-30`} style={{ width: 116, height: 116, animationDelay: "0.5s" }} />
                <SpinningMark className={cn("w-20 h-20 drop-shadow-2xl", centerMarkClass)} />
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
              <div className="w-7 h-7 rounded-full bg-white border border-[#0F1B2D]/15 shadow-sm" />
            )}
          </div>
          {centerLabel && (
            <div className="absolute z-10 mt-24 text-sm font-semibold text-[#6E7B8C] tracking-[0.18em] uppercase">
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
                      background: `radial-gradient(circle, ${variant === "blue" ? "rgba(26,95,180,0.22)" : "rgba(160,95,0,0.20)"} 0%, transparent 70%)`,
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

                {/* Label — solid ink, brand hue on focus */}
                <div className={cn(
                  "absolute top-[4.25rem] left-1/2 -translate-x-1/2 text-base font-bold tracking-wide transition-all duration-300 max-w-[240px] text-center leading-tight",
                  isExpanded && "scale-110",
                  isExpanded || isHovered ? c.labelHover : c.label,
                )}>
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <div className={cn(
                    "absolute top-24 left-1/2 -translate-x-1/2 w-80 bg-white rounded-xl border shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] overflow-visible",
                    c.card
                  )}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#0F1B2D]/25" />

                    <div className="p-5 pb-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className={cn("px-2.5 py-1 rounded-md text-[11px] font-bold border", getStatusStyle(item.status))}>
                          {getStatusLabel(item.status)}
                        </span>
                        <span className="text-[11px] font-mono text-[#6E7B8C] tracking-wider">{item.category}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#0F1B2D]">{item.title}</h4>
                    </div>

                    <div className="px-5 pb-5 text-sm text-[#51617A] leading-relaxed">
                      <p>{item.content}</p>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {item.tags.map((tag) => (
                            <span key={tag} className={cn("text-[11px] px-2 py-0.5 rounded-md border font-semibold", c.tagBg)}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Related nodes */}
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#0F1B2D]/10">
                          <h5 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#6E7B8C] mb-2">Connected Nodes</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relId) => {
                              const related = timelineData.find((i) => i.id === relId);
                              return (
                                <button
                                  key={relId}
                                  className={cn(
                                    "flex items-center h-6 px-2 text-[11px] font-medium rounded-md border transition-all duration-200",
                                    "border-[#0F1B2D]/15 bg-[#0F1B2D]/[0.03] hover:bg-[#0F1B2D]/[0.06] text-[#51617A] hover:text-[#0F1B2D]"
                                  )}
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relId); }}
                                >
                                  {related?.title}
                                  <ArrowRight size={10} className="ml-1 text-[#6E7B8C]" />
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
