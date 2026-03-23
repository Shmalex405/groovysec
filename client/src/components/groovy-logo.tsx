import { Link } from "wouter";

interface GroovyLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function GroovyLogo({ showText = true, size = "md" }: GroovyLogoProps) {
  const sizes = {
    sm: { icon: "w-7 h-7", text: "text-lg", gap: "gap-2.5", tracking: "tracking-[0.2em]" },
    md: { icon: "w-9 h-9", text: "text-xl", gap: "gap-3", tracking: "tracking-[0.25em]" },
    lg: { icon: "w-12 h-12", text: "text-3xl", gap: "gap-4", tracking: "tracking-[0.3em]" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center ${s.gap} group`}>
      <img
        src="/icononly_transparent_nobuffer.png"
        alt="Groovy Security"
        className={`${s.icon} object-contain group-hover:scale-105 transition-transform duration-500`}
      />

      {showText && (
        <span className={`font-cinzel font-semibold ${s.text} ${s.tracking} uppercase leading-none text-white group-hover:text-blue-300 transition-colors duration-300`}>
          Groovy Security
        </span>
      )}
    </Link>
  );
}
