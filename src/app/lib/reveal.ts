import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* One entrance treatment for the whole site: anything marked
   [data-reveal] rises and fades as it enters. Every trigger created
   here is killed on unmount so a StrictMode double-mount cannot stack
   two sets of them. */

export function useRevealAnimations(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const context = gsap.context(() => {
      for (const target of targets) {
        gsap.from(target, {
          opacity: 0,
          y: 34,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    // Layout settles after the loader clears and fonts land.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      window.clearTimeout(refresh);
      context.revert();
    };
  }, [enabled]);
}
