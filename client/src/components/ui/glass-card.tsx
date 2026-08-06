import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** Kept for call-site compatibility; the light system uses one neutral
   *  ink-tinted shadow instead of per-card colored glows. */
  glowColor?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-xl border border-[#0F1B2D]/10",
        "shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]",
        hover &&
          "transition-all duration-300 hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
