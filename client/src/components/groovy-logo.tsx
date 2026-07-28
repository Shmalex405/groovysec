import { Link } from "wouter";
import { SpinningMark } from "@/components/ui/spinning-mark";

interface GroovyLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  /**
   * Marks this lockup as where the homepage splash intro lands. Set on the
   * nav logo only — the splash looks for a single dock target.
   */
  splashDock?: boolean;
}

export function GroovyLogo({ showText = true, size = "md", splashDock }: GroovyLogoProps) {
  const sizes = {
    sm: { icon: "w-7 h-7", text: "text-lg", gap: "gap-2.5", tracking: "tracking-[0.2em]" },
    md: { icon: "w-9 h-9", text: "text-xl", gap: "gap-3", tracking: "tracking-[0.25em]" },
    lg: { icon: "w-12 h-12", text: "text-3xl", gap: "gap-4", tracking: "tracking-[0.3em]" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center ${s.gap} group`} aria-label="Groovy Security — home">
      <SpinningMark
        splashDock={splashDock}
        className={`${s.icon} group-hover:scale-105 transition-transform duration-500`}
      />

      {showText && (
        <span
          data-splash-word={splashDock ? "" : undefined}
          className={`font-cinzel font-semibold ${s.text} ${s.tracking} uppercase leading-none text-white group-hover:text-blue-300 transition-colors duration-300`}
        >
          Groovy Security
        </span>
      )}
    </Link>
  );
}
