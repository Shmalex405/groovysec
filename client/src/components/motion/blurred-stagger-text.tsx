import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface BlurredStaggerTextProps {
  text: string;
  className?: string;
  staggerDelay?: number;
}

export function BlurredStaggerText({
  text,
  className,
  staggerDelay = 0.04,
}: BlurredStaggerTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  // Reveal word-by-word once the paragraph scrolls into view, so the copy is
  // readable without a hover — and on touch devices, which never hover.
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reducedMotion = useReducedMotion();
  const revealed = inView || reducedMotion;
  const words = text.split(" ");

  return (
    <motion.p ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={false}
          animate={{
            filter: revealed ? "blur(0px)" : "blur(5px)",
            opacity: revealed ? 1 : 0.5,
          }}
          transition={{
            duration: reducedMotion ? 0 : 0.35,
            delay: reducedMotion ? 0 : i * staggerDelay,
            ease: "easeOut",
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}
