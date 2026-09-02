import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Node = { x: number; y: number; vx: number; vy: number };

/**
 * Lightweight neural-network background: drifting nodes connected by
 * proximity edges, with a subtle pointer-reactive cluster. Caps node
 * count by viewport area, scales for DPR, pauses on hidden tabs, and
 * renders a single static frame when reduced motion is requested.
 */
export default function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const CONNECT = 132;
    const CONNECT2 = CONNECT * CONNECT;
    const MOUSE_R = 160;
    const MOUSE_R2 = MOUSE_R * MOUSE_R;

    let w = 0;
    let h = 0;
    let raf = 0;
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(72, Math.floor((w * h) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22
      }));
    };

    const edges = (alpha: number) => {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECT2) {
            const t = 1 - d2 / CONNECT2;
            ctx.strokeStyle = `rgba(110, 231, 255, ${t * alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x <= 0 || n.x >= w) n.vx *= -1;
        if (n.y <= 0 || n.y >= h) n.vy *= -1;
        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < MOUSE_R2) {
          const push = (1 - md2 / MOUSE_R2) * 0.5;
          const dist = Math.sqrt(md2) || 1;
          n.x += (mdx / dist) * push;
          n.y += (mdy / dist) * push;
        }
      }
      edges(0.16);
      for (const n of nodes) {
        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        const near = mdx * mdx + mdy * mdy < MOUSE_R2;
        ctx.fillStyle = near ? "rgba(139, 92, 246, 0.85)" : "rgba(110, 231, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 2.3 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const still = () => {
      ctx.clearRect(0, 0, w, h);
      edges(0.13);
      ctx.fillStyle = "rgba(110, 231, 255, 0.4)";
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(frame);
    };

    build();
    const ro = new ResizeObserver(() => {
      build();
      if (reduce) still();
    });
    ro.observe(canvas);

    if (reduce) {
      still();
    } else {
      raf = requestAnimationFrame(frame);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerout", onLeave, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return <canvas ref={ref} className="neural-canvas" aria-hidden="true" />;
}
