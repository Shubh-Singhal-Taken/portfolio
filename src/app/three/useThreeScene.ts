import { useEffect, useRef } from "react";
import { PortfolioScene } from "./scene";
import { onScrollChange } from "../lib/scroll";
import { cursorHot } from "../lib/signal";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Options = {
  /** 0 → 1 while the scene builds; drives the loader counter. */
  onProgress?: (fraction: number) => void;
  /** Fired once the first frame has actually been painted. */
  onReady?: () => void;
};

export function useThreeScene({ onProgress, onReady }: Options) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep the callbacks in refs so changing them never rebuilds the scene.
  const progressRef = useRef(onProgress);
  const readyRef = useRef(onReady);
  progressRef.current = onProgress;
  readyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: PortfolioScene;
    try {
      scene = new PortfolioScene(canvas, (n) => progressRef.current?.(n));
    } catch {
      // No WebGL (old browser, blocked context, headless). The site is
      // fully readable without it — hide the canvas and move on.
      canvas.style.display = "none";
      progressRef.current?.(1);
      readyRef.current?.();
      return;
    }

    const reduced = prefersReducedMotion();
    let frame = 0;
    let paused = false;
    let announced = false;

    const loop = () => {
      scene.render(true);

      if (!announced) {
        announced = true;
        readyRef.current?.();
      }

      // Hit-testing every frame is cheap here (4 objects) and keeps the
      // cursor in lockstep with the camera rather than the pointer alone.
      cursorHot.set(scene.hitTest());

      if (!paused) frame = requestAnimationFrame(loop);
    };

    if (reduced) {
      scene.render(false);
      readyRef.current?.();
    } else {
      frame = requestAnimationFrame(loop);
    }

    const unsubscribe = onScrollChange(({ progress }) => {
      scene.setProgress(progress);
      if (reduced) scene.render(false);
    });

    const onResize = () => {
      scene.resize();
      if (reduced) scene.render(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      scene.setPointer(e.clientX, e.clientY);
    };

    const onPointerLeave = () => {
      scene.clearPointer();
      cursorHot.set(false);
    };

    const onVisibility = () => {
      if (reduced) return;

      if (document.visibilityState === "hidden") {
        paused = true;
        cancelAnimationFrame(frame);
      } else if (paused) {
        paused = false;
        frame = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      paused = true;
      cancelAnimationFrame(frame);
      unsubscribe();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      cursorHot.set(false);
      scene.dispose();
    };
  }, []);

  return canvasRef;
}
