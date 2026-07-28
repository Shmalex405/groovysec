/**
 * When the homepage arrival sequence plays.
 *
 * Kept separate from the animation itself so the rule is readable in one
 * place: the sequence belongs to *arriving at the site*, so it keys off the
 * URL this page load started on, not wherever the visitor has navigated to
 * since. Every visit to the root gets it; moving around inside the app
 * never does.
 */

export interface SplashContext {
  /** Pathname the page load started on, before any client-side navigation. */
  entryPath: string;
  /** `?splash` present — force the sequence from any URL, for demos. */
  forced: boolean;
  /** Visitor asked their OS for reduced motion. */
  reducedMotion: boolean;
  /** Tab is actually being looked at right now. */
  visible: boolean;
}

export function isRootEntry(entryPath: string): boolean {
  return entryPath === "/" || entryPath === "/index.html";
}

/**
 * Whether this visitor should see the sequence. `armed` is false once the
 * sequence has been spent for this page load.
 */
export function shouldPlaySplash(ctx: SplashContext, armed: boolean): boolean {
  if (!armed) return false;
  // A visitor who opted out of motion, or a tab nobody is looking at
  // (background tab, prerender, crawler), gets the page itself.
  if (ctx.reducedMotion || !ctx.visible) return false;
  return ctx.forced || isRootEntry(ctx.entryPath);
}

export function readSplashContext(): SplashContext {
  return {
    entryPath: window.location.pathname,
    forced: new URLSearchParams(window.location.search).has("splash"),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    visible: document.visibilityState === "visible",
  };
}
