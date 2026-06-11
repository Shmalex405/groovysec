interface MaestroMarkProps {
  className?: string;
}

/**
 * Maestro product mark — an "M" inside a partial targeting ring,
 * in the product's orange/red/amber accent family.
 */
export function MaestroMark({ className = "w-10 h-10" }: MaestroMarkProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="maestro-mark-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="55%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" stroke="url(#maestro-mark-grad)" strokeWidth="2" opacity="0.3" />
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="url(#maestro-mark-grad)"
        strokeWidth="2.5"
        strokeDasharray="34 98"
        strokeDashoffset="-8"
        strokeLinecap="round"
      />
      <path
        d="M14 32V17l10 11 10-11v15"
        stroke="url(#maestro-mark-grad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
