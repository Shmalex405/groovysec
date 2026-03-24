import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export function HoloCard({
  children,
  className,
  glowColor = "rgba(255, 255, 255, 0.1)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const rotateX = (y - 0.5) * -20;
    const rotateY = (x - 0.5) * 20;

    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    cardRef.current.style.setProperty("--glow-x", `${x * 100}%`);
    cardRef.current.style.setProperty("--glow-y", `${y * 100}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-transform duration-300 ease-out group",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glow that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 50%)`,
        }}
      />
      {/* Holographic shimmer border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(250px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor.replace(/[\d.]+\)$/, "0.8)")}, transparent 50%)`,
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
