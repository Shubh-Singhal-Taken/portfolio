/* Single shared scroll source.
   The DOM sections, the dot-nav and the 3D camera all read the same
   number in the same frame, so nothing can drift out of sync. */

export type ScrollState = {
  /** Pixels scrolled from the top. Always >= 0. */
  y: number;
  /** 0 → 1 across the whole scrollable height. */
  progress: number;
  /** Total scrollable distance in pixels. */
  max: number;
};

const state: ScrollState = { y: 0, progress: 0, max: 1 };
const listeners = new Set<(s: ScrollState) => void>();
let ticking = false;
let started = false;

function measure() {
  // The reference reads getBoundingClientRect().top on <body>; this is the
  // same number, positive, and does not force a second layout pass.
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  const max = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );

  state.y = y;
  state.max = max;
  state.progress = Math.min(1, Math.max(0, y / max));
}

function flush() {
  ticking = false;
  measure();
  for (const fn of listeners) fn(state);
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
}

/** Subscribe to scroll. Returns an unsubscribe function. */
export function onScrollChange(fn: (s: ScrollState) => void): () => void {
  if (!started) {
    started = true;
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  listeners.add(fn);
  fn(state);

  return () => {
    listeners.delete(fn);
  };
}

/** Current scroll state without subscribing. */
export function getScroll(): Readonly<ScrollState> {
  return state;
}

/** Force a re-measure — call after the loader clears or layout changes. */
export function refreshScroll() {
  measure();
  for (const fn of listeners) fn(state);
}

/** Smooth-scroll to a hash target, honouring reduced motion. */
export function scrollToSection(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
}
