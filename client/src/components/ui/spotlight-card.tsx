import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

/* ── Spotlight Card (cursor-following glow) ── */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "210",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--spot-x", `${e.clientX - left}px`);
    cardRef.current.style.setProperty("--spot-y", `${e.clientY - top}px`);
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => el.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20",
        className
      )}
    >
      {/* Spotlight glow that follows cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(250px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(${spotlightColor} 80% 65% / 0.15), transparent 70%)`,
        }}
      />
      {/* Spotlight border */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(300px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(${spotlightColor} 80% 65% / 0.4), transparent 70%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
