import { cn } from "@/lib/utils";

/**
 * The Groovy mark, split into its three colour plates so each can turn on its
 * own. Use this anywhere the flat icon used to sit — the drift is driven by CSS
 * (see `gs-plate-*` in index.css), so any number of instances cost nothing and
 * all stay in step with the brand.
 */

/** Seconds per revolution and direction per plate. Shared with the splash intro. */
export const PLATE_DRIFT = [
  { color: "blue", secs: 110, dir: 1 },
  { color: "green", secs: 85, dir: -1 },
  { color: "orange", secs: 45, dir: 1 },
] as const;

interface SpinningMarkProps {
  /** Sizing and any filters for the whole mark, e.g. "w-16 h-16 grayscale". */
  className?: string;
  /** Accessible name; omit for decorative marks that sit beside a text label. */
  alt?: string;
  /** Tags this mark as the homepage splash's landing target. Nav only. */
  splashDock?: boolean;
}

export function SpinningMark({ className, alt, splashDock }: SpinningMarkProps) {
  return (
    <div
      data-splash-dock={splashDock ? "" : undefined}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      className={cn("relative flex-shrink-0", className)}
    >
      {PLATE_DRIFT.map(({ color }) => (
        <img
          key={color}
          data-plate={color}
          src={`/plate-icon-${color}.png`}
          alt=""
          className={`absolute inset-0 w-full h-full object-contain gs-plate-${color}`}
        />
      ))}
    </div>
  );
}

/**
 * Plate stack for use inside an <svg>, where the mark is positioned in user
 * space rather than by layout. Renders three <image> elements — drop it where
 * a single <image href="…icon.png"> used to be.
 */
export function SpinningMarkSvg({
  x,
  y,
  size,
}: {
  x: number;
  y: number;
  size: number;
}) {
  return (
    <>
      {PLATE_DRIFT.map(({ color }) => (
        <image
          key={color}
          href={`/plate-icon-${color}.png`}
          x={x}
          y={y}
          width={size}
          height={size}
          className={`gs-plate-svg gs-plate-${color}`}
        />
      ))}
    </>
  );
}
