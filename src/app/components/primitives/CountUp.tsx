import { useEffect, useRef, useState } from "react";

type Props = {
  target: number;
  prefix?: string;
  suffix?: string;
  /** Render the number as-is (years, versions) instead of counting. */
  noCount?: boolean;
  duration?: number;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CountUp({
  target,
  prefix = "",
  suffix = "",
  noCount = false,
  duration = 1600,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(noCount ? target : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || noCount) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let frame = 0;
    let started = false;

    const run = (start: number) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setValue(Math.round(easeOutCubic(t) * target));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue;
          started = true;
          observer.disconnect();
          run(performance.now());
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, noCount, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
