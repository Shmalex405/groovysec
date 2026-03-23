import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  glowColor,
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08]",
        hover &&
          "transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-2xl hover:-translate-y-1",
        className
      )}
      style={
        glowColor
          ? {
              boxShadow: `0 0 40px -12px ${glowColor}`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
