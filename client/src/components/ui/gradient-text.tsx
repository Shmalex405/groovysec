import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
  via?: string;
}

/** Solid accessible text colors for each hue family the old gradient
 *  props used. Emphasis now comes from color + weight, not a sweep. */
const HUE_TO_SOLID: Array<[RegExp, string]> = [
  [/red|rose/, "text-[#B3261E]"],
  [/amber|orange|yellow/, "text-[#A05F00]"],
  [/emerald|green|teal|lime/, "text-[#2E7D32]"],
  [/purple|violet|fuchsia/, "text-[#6D28D9]"],
  [/blue|cyan|sky|indigo/, "text-[#1A5FB4]"],
];

/**
 * Formerly rendered gradient-clipped text — retired in the light restyle.
 * The component keeps its API and now resolves the `from` hue to one solid
 * brand-grade color that holds ≥4.5:1 on the paper ground.
 */
export function GradientText({
  children,
  className,
  from = "from-blue-400",
}: GradientTextProps) {
  const solid =
    HUE_TO_SOLID.find(([hue]) => hue.test(from))?.[1] ?? "text-[#1A5FB4]";

  return <span className={cn(solid, className)}>{children}</span>;
}
