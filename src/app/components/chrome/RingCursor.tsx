import { useEffect, useRef, useState } from "react";
import { cursorHot, useSignal } from "../../lib/signal";
import { audioAvailable } from "../../lib/audio";
import { useI18n } from "../../lib/i18n";

/* The reference's cursor: a thin ring, a pulsing inner dot, and a label
   inviting the first click. The label and dot retire after that click;
   the ring stays and swells over 3D objects. */

type Props = { showLabel: boolean };

export default function RingCursor({ showLabel }: Props) {
  const { t } = useI18n();
  const ringRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const paintRef = useRef<(() => void) | null>(null);
  const [enabled, setEnabled] = useState(false);
  const hot = useSignal(cursorHot);
  // No track supplied means no sound to enable — do not invite the click.
  const canPlayAudio = useSignal(audioAvailable);
  const label = showLabel && canPlayAudio;

  // The label mounts later than the ring, so it needs a paint of its own
  // or it renders stuck at the top-left corner until the pointer moves.
  useEffect(() => {
    paintRef.current?.();
  }, [label, enabled]);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (coarse || reduced) return;

    setEnabled(true);

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 4;

    const paint = () => {
      frame = 0;
      const ring = ringRef.current;
      const dot = dotRef.current;
      const labelEl = labelRef.current;

      // Position by the element's own box so the ring stays centred at
      // any viewport width (its size is in vw).
      if (ring) {
        ring.style.left = `${x - ring.offsetWidth / 2}px`;
        ring.style.top = `${y - ring.offsetHeight / 2}px`;
      }
      if (dot) {
        dot.style.left = `${x - dot.offsetWidth / 2}px`;
        dot.style.top = `${y - dot.offsetHeight / 2}px`;
      }
      if (labelEl) {
        labelEl.style.left = `${x}px`;
        labelEl.style.top = `${y}px`;
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paintRef.current = paint;
    window.addEventListener("pointermove", onMove, { passive: true });
    paint();

    return () => {
      paintRef.current = null;
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <span
        ref={ringRef}
        className={`circle${hot ? " is-hot" : ""}`}
        aria-hidden="true"
      />
      <span
        ref={dotRef}
        className={`circle-inner${label ? "" : " is-hidden"}`}
        aria-hidden="true"
      />
      <span
        ref={labelRef}
        className={`circle-label${label ? "" : " is-hidden"}`}
        aria-hidden="true"
      >
        {t("CIRCLE-LABEL")}
      </span>
    </>
  );
}
