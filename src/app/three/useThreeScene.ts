import { useEffect, useRef } from "react";
import { PortfolioScene } from "./scene";
import type { WorldId } from "./worlds";
import { onScrollChange } from "../lib/scroll";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Options = {
  /** 0 → 1 while the scene builds; drives the loader counter. */
  onProgress?: (fraction: number) => void;
  /** Fired once the first frame has actually been painted. */
  onReady?: () => void;
  /** Which profile's world the background shows. */
  world: WorldId;
};

export function useThreeScene({ onProgress, onReady, world }: Options) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<PortfolioScene | null>(null);
  const worldRef = useRef(world);
  worldRef.current = world;

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
    sceneRef.current = scene;
    // The first world appears in place; later switches morph.
    scene.setWorld(worldRef.current, true);
    let frame = 0;
    let paused = false;
    let announced = false;

    const loop = () => {
      scene.render(true);

      if (!announced) {
        announced = true;
        readyRef.current?.();
      }

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
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      paused = true;
      cancelAnimationFrame(frame);
      unsubscribe();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      sceneRef.current = null;
      scene.dispose();
    };
  }, []);

  // Lens switches morph the world; under reduced motion it changes in
  // place and one frame is redrawn.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const reduced = prefersReducedMotion();
    scene.setWorld(world, reduced);
    if (reduced) scene.render(false);
  }, [world]);

  return canvasRef;
}
