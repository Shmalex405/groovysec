import { cn } from "@/lib/utils";

/* ── Spotlight Card — quieted to the standard paper card. The old
 *  cursor-following glow is retired; hover is a border/shadow change.
 *  `spotlightColor` is kept for call-site compatibility. ── */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-[#0F1B2D]/10 bg-white overflow-hidden",
        "shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]",
        "transition-all duration-300 hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
