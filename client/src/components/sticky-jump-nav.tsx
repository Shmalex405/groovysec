import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface JumpItem {
  id: string;
  label: string;
}

/**
 * Slim pill nav pinned under the main <Navigation>, for long single-page
 * layouts. Visible from load; tracks which target section is active via
 * IntersectionObserver and highlights its pill.
 */
export function StickyJumpNav({ items }: { items: JumpItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const clickScrollRef = useRef(false);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickScrollRef.current) return;
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visibleEntry) setActiveId(visibleEntry.target.id);
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    clickScrollRef.current = true;
    setActiveId(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      clickScrollRef.current = false;
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
      className="fixed top-16 left-0 w-full z-40 bg-white border-b border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.06)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 py-2.5 overflow-x-auto">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item.id)}
                className={cn(
                  "flex-shrink-0 px-3.5 py-1.5 rounded-md text-sm font-medium border transition-colors cursor-pointer",
                  isActive
                    ? "bg-[#1A5FB4] text-white border-[#1A5FB4]"
                    : "bg-transparent text-[#51617A] border-transparent hover:bg-[#0F1B2D]/[0.04] hover:text-[#0F1B2D]"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}
