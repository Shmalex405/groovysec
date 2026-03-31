import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isHovered, setIsHovered] = useState(false);
  const words = text.split(" ");

  return (
    <motion.p
      className={`cursor-default ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          animate={{
            filter: isHovered ? "blur(0px)" : "blur(5px)",
            opacity: isHovered ? 1 : 0.5,
          }}
          transition={{
            duration: 0.35,
            delay: isHovered ? i * staggerDelay : (words.length - 1 - i) * staggerDelay * 0.5,
            ease: "easeOut",
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}
