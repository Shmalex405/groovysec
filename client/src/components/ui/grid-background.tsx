import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "dots" | "lines" | "grid";
}

export function GridBackground({
  children,
  className,
  variant = "grid",
}: GridBackgroundProps) {
  const patterns = {
    dots: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
    lines:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
    grid: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  };

  const sizes = {
    dots: "24px 24px",
    lines: "100% 40px",
    grid: "40px 40px, 40px 40px",
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: patterns[variant],
          backgroundSize: sizes[variant],
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
