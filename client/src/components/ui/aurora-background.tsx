import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "blue" | "orange" | "mixed" | "bluegreen";
}

export function AuroraBackground({
  children,
  className,
  variant = "blue",
}: AuroraBackgroundProps) {
  const gradients = {
    blue: [
      "from-[#1a5fb4]/40 via-[#0d4a8a]/25 to-transparent",
      "from-[#2e7d32]/30 via-[#1b5e20]/20 to-transparent",
      "from-[#1565c0]/25 via-[#0d47a1]/15 to-transparent",
      "from-[#c77800]/20 via-[#a86200]/10 to-transparent",
    ],
    orange: [
      "from-[#c77800]/40 via-[#a86200]/25 to-transparent",
      "from-[#bf360c]/30 via-[#a84400]/20 to-transparent",
      "from-[#1a5fb4]/20 via-[#0d4a8a]/10 to-transparent",
      "from-[#c77800]/25 via-[#a86200]/15 to-transparent",
    ],
    mixed: [
      "from-[#1a5fb4]/35 via-[#0d4a8a]/25 to-transparent",
      "from-[#2e7d32]/30 via-[#1b5e20]/20 to-transparent",
      "from-[#c77800]/25 via-[#a86200]/15 to-transparent",
      "from-[#1565c0]/20 via-[#2e7d32]/10 to-transparent",
    ],
    bluegreen: [
      "from-[#1a5fb4]/40 via-[#0d4a8a]/25 to-transparent",
      "from-[#2e7d32]/35 via-[#1b5e20]/20 to-transparent",
      "from-[#1565c0]/30 via-[#2e7d32]/15 to-transparent",
      "from-[#0d4a8a]/25 via-[#1b5e20]/15 to-transparent",
    ],
  };

  const colors = gradients[variant];

  return (
    <div className={cn("relative overflow-clip", className)}>
      <div className="absolute inset-0">
        <div
          className={cn(
            "absolute -top-1/3 -left-1/3 w-2/3 h-2/3 bg-gradient-to-br rounded-full blur-[100px] animate-aurora-1",
            colors[0]
          )}
        />
        <div
          className={cn(
            "absolute -bottom-1/3 -right-1/3 w-2/3 h-2/3 bg-gradient-to-tl rounded-full blur-[100px] animate-aurora-2",
            colors[1]
          )}
        />
        <div
          className={cn(
            "absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-r rounded-full blur-[80px] animate-aurora-3",
            colors[2]
          )}
        />
        <div
          className={cn(
            "absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-gradient-to-bl rounded-full blur-[120px] animate-aurora-1",
            colors[3]
          )}
          style={{ animationDelay: "3s", animationDuration: "18s" }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
