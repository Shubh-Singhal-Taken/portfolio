import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/** Counts from 0 to `target` when scrolled into view (once).
 *  Renders the final value immediately for reduced motion / non-counting stats. */
export default function CountUp({
  target,
  prefix = "",
  suffix = "",
  duration = 1.6,
  noCount = false
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  noCount?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion() ?? false;
  const [val, setVal] = useState(noCount || reduce ? target : 0);

  useEffect(() => {
    if (!inView || noCount || reduce) {
      if (noCount || reduce) setVal(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, noCount, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}
