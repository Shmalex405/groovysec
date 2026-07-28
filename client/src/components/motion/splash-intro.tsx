import { useLayoutEffect, useRef } from "react";
import { PLATE_DRIFT } from "@/components/ui/spinning-mark";

/**
 * First-visit splash for the homepage: the stacked lockup dials in like a
 * vault (three colour plates counter-rotating into place), the wordmark pops
 * in, and after one breath the mark flies into its nav slot on its own while
 * the page rises in underneath. Clicking anywhere (or Enter/Escape) skips
 * straight to the handoff.
 *
 * Shown once per session; skipped for reduced-motion users.
 */

const SEEN_KEY = "gs-splash-seen";
// Dial settles ~1.4s, wordmark lands ~1.73s, pulse fades ~2.1s — then release.
const HOLD_MS = 2600;
const EXPO_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const SETTLE = "cubic-bezier(0.25, 1, 0.5, 1)";
const POP = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// Vault-dial choreography per plate. Blue and orange turn the same
// direction, so their sweeps (170 vs 320 deg) and in-flight spins
// (360 vs 720 deg) are kept far apart.
const DIAL = [
  { color: "blue", angles: [-170, 38, -14], dur: 1100, spin: 360 },
  { color: "green", angles: [150, -34, 12], dur: 1250, spin: -360 },
  { color: "orange", angles: [-320, 60, -20], dur: 1400, spin: 720 },
] as const;

/** `?splash` in the URL forces a replay — for previewing the first-visit experience. */
function splashForced(): boolean {
  return new URLSearchParams(window.location.search).has("splash");
}

export function shouldShowSplash(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  // A tab that starts hidden — opened in the background, restored with a
  // session, prerendered, or rendered by a crawler — must get the page
  // itself, not an intro it cannot see. Consume the flag so the sequence
  // can't ambush the visitor later in the session either.
  if (document.visibilityState !== "visible") {
    markSeen();
    return false;
  }

  if (splashForced()) return true;
  try {
    return !window.sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable — the splash simply plays again next visit */
  }
}

interface SplashIntroProps {
  /** Fired when the handoff begins — mount the page underneath now. */
  onEnterStart: () => void;
  /** Fired when the mark has docked into the nav — unmount the splash now. */
  onDone: () => void;
}

export function SplashIntro({ onEnterStart, onDone }: SplashIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const enteredRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const externalRef = useRef<{ dock: HTMLElement | null; word: HTMLElement | null }>({
    dock: null,
    word: null,
  });
  const cbRef = useRef({ onEnterStart, onDone });
  cbRef.current = { onEnterStart, onDone };

  const plateEl = (color: string) =>
    stackRef.current!.querySelector<HTMLImageElement>(`[data-splash-plate="${color}"]`)!;

  function enter() {
    if (enteredRef.current) return;
    enteredRef.current = true;
    markSeen();
    cbRef.current.onEnterStart();
    const root = rootRef.current!;
    root.style.pointerEvents = "none";

    // Let the page mount and lay out beneath us before measuring the dock.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const stack = stackRef.current;
        if (!stack) return;
        const dock = document.querySelector<HTMLElement>("[data-splash-dock]");
        const navWord = document.querySelector<HTMLElement>("[data-splash-word]");

        bgRef.current!.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 700,
          delay: 150,
          easing: "ease-out",
          fill: "forwards",
        });
        wordRef.current!.animate(
          [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(10px)" },
          ],
          { duration: 340, easing: "ease-in", fill: "forwards" }
        );

        if (!dock) {
          // No nav on screen (shouldn't happen) — fade out gracefully.
          stack.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 400,
            easing: "ease-out",
            fill: "forwards",
          });
          timersRef.current.push(window.setTimeout(() => cbRef.current.onDone(), 650));
          return;
        }

        externalRef.current = { dock, word: navWord };
        dock.style.opacity = "0";
        if (navWord) navWord.style.opacity = "0";

        // The flight: shrink into the dock, plates spinning at their own rates.
        const d = dock.getBoundingClientRect();
        const s0 = stack.getBoundingClientRect();
        const scale = d.width / s0.width;
        stack.animate(
          [
            { transform: "translate(0, 0) scale(1)" },
            { transform: `translate(${d.left - s0.left}px, ${d.top - s0.top}px) scale(${scale})` },
          ],
          { duration: 1100, delay: 60, easing: EXPO_OUT, fill: "forwards" }
        );
        for (const { color, spin } of DIAL) {
          plateEl(color).animate(
            [{ transform: "rotate(0deg)" }, { transform: `rotate(${spin}deg)` }],
            { duration: 1100, delay: 60, easing: EXPO_OUT, fill: "forwards" }
          );
        }
        ringRef.current!.animate(
          [
            { transform: "scale(0.55)", opacity: 0.4 },
            { transform: "scale(1.55)", opacity: 0 },
          ],
          { duration: 550, delay: 1180, easing: SETTLE, fill: "forwards" }
        );

        // Crossfade the flown mark into the real nav logo as it docks.
        stack.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 300,
          delay: 1120,
          easing: "ease-out",
          fill: "forwards",
        });
        const dockAnim = dock.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 300,
          delay: 1120,
          easing: "ease-out",
          fill: "both",
        });
        const wordAnim = navWord?.animate(
          [
            { opacity: 0, transform: "translateX(-14px)" },
            { opacity: 1, transform: "translateX(0)" },
          ],
          { duration: 500, delay: 1120, easing: SETTLE, fill: "both" }
        );

        timersRef.current.push(
          window.setTimeout(() => {
            dock.style.opacity = "";
            if (navWord) navWord.style.opacity = "";
            dockAnim.cancel();
            wordAnim?.cancel();
            externalRef.current = { dock: null, word: null };
            cbRef.current.onDone();
          }, 1800)
        );
      })
    );
  }

  useLayoutEffect(() => {
    const stack = stackRef.current!;

    // Dial in: container settles while the plates counter-rotate into place.
    stack.animate(
      [
        { transform: "scale(0.8)", opacity: 0 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 500, easing: EXPO_OUT, fill: "both" }
    );
    for (const { color, angles, dur } of DIAL) {
      plateEl(color).animate(
        [
          { transform: `rotate(${angles[0]}deg)`, easing: "cubic-bezier(0.3, 0, 0.2, 1)" },
          { transform: `rotate(${angles[1]}deg)`, offset: 0.48, easing: "cubic-bezier(0.45, 0, 0.25, 1)" },
          { transform: `rotate(${angles[2]}deg)`, offset: 0.76, easing: "cubic-bezier(0.45, 0, 0.3, 1)" },
          { transform: "rotate(0deg)" },
        ],
        { duration: dur, fill: "both" }
      );
    }
    ringRef.current!.animate(
      [
        { transform: "scale(0.55)", opacity: 0.5 },
        { transform: "scale(1.55)", opacity: 0 },
      ],
      { duration: 620, delay: 1450, easing: SETTLE, fill: "forwards" }
    );
    wordRef.current!.animate(
      [
        { opacity: 0, transform: "scale(0.9)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: 380, delay: 1350, easing: POP, fill: "both" }
    );
    // Idle counter-drift once the dial settles, until the handoff interrupts it.
    timersRef.current.push(
      window.setTimeout(() => {
        for (const { color, secs, dir } of PLATE_DRIFT) {
          plateEl(color).animate(
            [{ transform: "rotate(0deg)" }, { transform: `rotate(${dir * 360}deg)` }],
            { duration: secs * 1000, iterations: Infinity }
          );
        }
      }, 1550)
    );

    timersRef.current.push(window.setTimeout(enter, HOLD_MS));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") enter();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      timersRef.current.forEach(clearTimeout);
      // If we unmount mid-flight (e.g. route change), never leave the real
      // nav logo hidden behind our inline styles.
      const { dock, word } = externalRef.current;
      if (dock) dock.style.opacity = "";
      if (word) word.style.opacity = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      aria-label="Groovy Security"
      onClick={enter}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-9"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-slate-950 bg-[radial-gradient(circle_at_50%_42%,#0d1e38_0%,#020617_72%)]"
      />

      <div ref={stackRef} className="relative w-[200px] h-[200px] origin-top-left opacity-0">
        {DIAL.map(({ color }) => (
          <img
            key={color}
            data-splash-plate={color}
            src={`/plate-mark-${color}.png`}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />
        ))}
        <span
          ref={ringRef}
          className="absolute -inset-5 rounded-full border-2 border-[#2E9BE0] opacity-0"
          aria-hidden="true"
        />
      </div>

      <span
        ref={wordRef}
        className="relative font-cinzel font-semibold text-xl sm:text-2xl tracking-[0.32em] indent-[0.32em] uppercase text-[#0199D2] text-center opacity-0"
      >
        Groovy Security
      </span>
    </div>
  );
}
