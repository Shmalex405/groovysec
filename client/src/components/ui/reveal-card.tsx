import { useState } from "react";
import { cn } from "@/lib/utils";

interface RevealCardProps {
  children: React.ReactNode;
  overlay: React.ReactNode;
  accentColor?: string;
  /** Kept for call-site compatibility; the flat overlay no longer uses it. */
  accentDark?: string;
  className?: string;
}

/**
 * Quiet reveal: the old full-card clip-path wipe to a radial gradient is
 * retired. The overlay now crossfades in over a flat accent plate, the
 * border takes the accent, and the hidden layer is aria-hidden so screen
 * readers no longer announce the card's content twice.
 */
export function RevealCard({
  children,
  overlay,
  accentColor = "#1a5fb4",
  className,
}: RevealCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      className={cn(
        "relative rounded-xl border bg-white transition-all duration-300 isolate overflow-hidden",
        "shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]",
        isRevealed && "shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)]",
        className
      )}
      style={{
        borderColor: isRevealed ? accentColor : "rgba(15,27,45,0.10)",
      }}
    >
      {/* Base card */}
      <div className="relative" aria-hidden={isRevealed}>
        {children}
      </div>

      {/* Overlay — flat accent plate, crossfades over the base */}
      <div
        className={cn(
          "absolute inset-0 z-20 transition-opacity duration-300 ease-out",
          isRevealed ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ background: accentColor }}
        aria-hidden={!isRevealed}
      >
        {overlay}
      </div>
    </div>
  );
}
