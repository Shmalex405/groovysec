import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  sparkleCount?: number;
  colors?: string[];
}

function generateSparkle(colors: string[]): Sparkle {
  return {
    id: Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 1.5,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

export function SparklesText({
  children,
  className,
  sparkleCount = 20,
  colors = ["#60a5fa", "#34d399", "#22d3ee", "#a78bfa", "#ffffff"],
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const initSparkles = useCallback(() => {
    setSparkles(
      Array.from({ length: sparkleCount }, () => generateSparkle(colors))
    );
  }, [sparkleCount, colors]);

  useEffect(() => {
    initSparkles();

    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((s) =>
          Math.random() > 0.7 ? generateSparkle(colors) : s
        )
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [initSparkles, colors]);

  return (
    <span className={cn("relative inline-block", className)}>
      {/* Sparkle particles */}
      <span className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden>
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute rounded-full animate-sparkle-float"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
              backgroundColor: sparkle.color,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
              boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
            }}
          />
        ))}
      </span>
      {children}
    </span>
  );
}
