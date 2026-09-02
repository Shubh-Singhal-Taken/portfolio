import { useReducedMotion, type Variants } from "motion/react";

/* Shared easing: a calm, premium ease-out-quart-ish curve. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Motion presets that automatically collapse to instant when the
 * user prefers reduced motion. Every animated component pulls from
 * here so timing and easing stay consistent site-wide.
 */
export function useMotionPrefs() {
  const reduce = useReducedMotion() ?? false;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease: EASE }
    }
  };

  const fade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduce ? 0 : 0.6, ease: EASE } }
  };

  /* Blur-up: a heavier, more cinematic entrance for headline moments
     and feature cards. Blur collapses to 0 under reduced motion. */
  const blurUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28, filter: reduce ? "blur(0px)" : "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0 : 0.8, ease: EASE }
    }
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 18 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: EASE }
    }
  };

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.05
      }
    }
  };

  const child: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: EASE } }
  };

  return { reduce, fadeUp, fade, blurUp, scaleIn, container, child, ease: EASE };
}

/** Standard scroll-reveal viewport config. */
export const viewportOnce = { once: true, margin: "-90px" } as const;
