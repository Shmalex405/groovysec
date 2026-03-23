import { useState } from "react";
import { cn } from "@/lib/utils";

interface RevealCardProps {
  children: React.ReactNode;
  overlay: React.ReactNode;
  accentColor?: string;
  accentDark?: string;
  className?: string;
}

export function RevealCard({
  children,
  overlay,
  accentColor = "#1a5fb4",
  accentDark = "#070d18",
  className,
}: RevealCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      className={cn(
        "relative rounded-2xl border-2 transition-colors duration-500 isolate overflow-hidden",
        className
      )}
      style={{
        borderColor: isRevealed ? accentColor : "rgba(255,255,255,0.08)",
      }}
    >
      {/* Base card */}
      <div className="relative">{children}</div>

      {/* Overlay — clips from top-left, covers entire card */}
      <div
        className="absolute inset-0 z-20 transition-[clip-path] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          clipPath: isRevealed
            ? "circle(150% at 40px 48px)"
            : "circle(0px at 40px 48px)",
          background: `radial-gradient(ellipse at 10% 10%, ${accentColor} 0%, ${accentDark} 70%), ${accentDark}`,
        }}
      >
        {overlay}
      </div>
    </div>
  );
}
