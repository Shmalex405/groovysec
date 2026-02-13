import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, motion, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  className,
}: AnimatedCounterProps) {
  // Extract leading number from the value (e.g. "7" from "7", "65+" from "65+", "99.5%" from "99.5%")
  const match = value.match(/^(\d+\.?\d*)(.*)/);

  if (!match) {
    // Non-numeric values like "Kali", "Auto", "Sub-second" — just fade in
    return (
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={className}
      >
        {value}
      </motion.span>
    );
  }

  const numericPart = parseFloat(match[1]);
  const suffix = match[2]; // e.g. "+", "%", "ms"
  const hasDecimal = match[1].includes(".");

  return (
    <CounterSpan
      target={numericPart}
      suffix={suffix}
      hasDecimal={hasDecimal}
      duration={duration}
      className={className}
    />
  );
}

function CounterSpan({
  target,
  suffix,
  hasDecimal,
  duration,
  className,
}: {
  target: number;
  suffix: string;
  hasDecimal: boolean;
  duration: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => {
    const formatted = hasDecimal ? v.toFixed(1) : Math.round(v).toString();
    return formatted + suffix;
  });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, target, { duration, ease: "easeOut" });
    }
  }, [isInView, motionValue, target, duration]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
