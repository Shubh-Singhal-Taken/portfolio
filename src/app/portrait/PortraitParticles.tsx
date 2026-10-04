import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { samplePortrait } from "./sampleImage";

/* The star portrait, as particles.

   Stars drift in from across the viewport and settle into the portrait
   inside the element marked [data-portrait-hero]. Scrolling toward the
   element marked [data-portrait-head] carries them across into a
   sculpted 3D head that turns slowly and leans toward the cursor;
   scrolling past it scatters them back into the star field.

   Both targets are measured from the live layout every frame, so the
   effect follows the page at any width instead of assuming where the
   hero sits. The canvas is portalled to <body> and painted beneath the
   page content, so particles never sit on top of text. */

type Props = { ready: boolean };

const PORTRAIT_SRC = "/portrait.png";
const BUCKETS = 10;
const FILLS = Array.from(
  { length: BUCKETS },
  (_, i) => `rgba(255, 255, 255, ${((i + 1) / BUCKETS).toFixed(2)})`
);

/* Bust extents from headSculpt.ts */
const BUST_TOP = 1.06;
const BUST_BOTTOM = -1.5;
const BUST_MID = (BUST_TOP + BUST_BOTTOM) / 2;
const BUST_HALF_WIDTH = 0.85;
const CAMERA_DISTANCE = 6;

/* The formation plays once per visit; later mounts start fully formed. */
let formedThisVisit = false;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Head = {
  positions: Float32Array;
  normals: Float32Array;
  shade: Float32Array;
  count: number;
};

export default function PortraitParticles({ ready }: Props) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useEffect(() => setHost(document.body), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const heroEl = document.querySelector<HTMLElement>("[data-portrait-hero]");
    const headEl = document.querySelector<HTMLElement>("[data-portrait-head]");
    if (!heroEl) return;

    let disposed = false;
    let frame = 0;
    let running = false;
    let worker: Worker | null = null;
    let workerTimer = 0;

    /* ---------------- canvas size ---------------- */

    let vw = 0;
    let vh = 0;
    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, vw < 768 ? 1.5 : 2);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* ---------------- pointer ---------------- */

    const pointer = { x: 0, y: 0, ex: 0, ey: 0, active: false };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX / vw - 0.5;
      pointer.y = e.clientY / vh - 0.5;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    /* ---------------- particle state ---------------- */

    let count = 0;
    let tx = new Float32Array(0);
    let ty = new Float32Array(0);
    let startX = new Float32Array(0);
    let startY = new Float32Array(0);
    let delay = new Float32Array(0);
    let duration = new Float32Array(0);
    let curveAmp = new Float32Array(0);
    let curveAngle = new Float32Array(0);
    let size = new Float32Array(0);
    let baseAlpha = new Float32Array(0);
    let twinkleSpeed = new Float32Array(0);
    let twinklePhase = new Float32Array(0);
    let scatter = new Float32Array(0);

    // Per-frame scratch, reused
    let outX = new Float32Array(0);
    let outY = new Float32Array(0);
    let outR = new Float32Array(0);
    let outBucket = new Int8Array(0);
    let order = new Int32Array(0);
    const bucketStart = new Int32Array(BUCKETS + 1);

    let head: Head | null = null;
    let headIndex = new Int32Array(0);
    let headX = new Float32Array(0);
    let headY = new Float32Array(0);
    let headA = new Float32Array(0);

    let startTime: number | null = null;
    let cleared = true;

    const pairWithHead = (h: Head) => {
      // Match portrait particles to head points top-to-bottom, so the
      // crown of the portrait becomes the crown of the bust rather than
      // every star crossing the screen.
      const byPortraitY = Array.from({ length: count }, (_, i) => i).sort((a, b) => ty[a] - ty[b]);
      const byHeadY = Array.from({ length: h.count }, (_, i) => i).sort(
        (a, b) => h.positions[b * 3 + 1] - h.positions[a * 3 + 1]
      );

      headIndex = new Int32Array(count);
      for (let k = 0; k < count; k++) {
        const j = Math.floor((k / count) * h.count);
        headIndex[byPortraitY[k]] = byHeadY[Math.min(h.count - 1, j)];
      }

      headX = new Float32Array(h.count);
      headY = new Float32Array(h.count);
      headA = new Float32Array(h.count);
      head = h;
    };

    const startWorker = () => {
      if (!headEl || disposed) return;
      worker = new Worker(new URL("./head.worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (e: MessageEvent<Head>) => {
        if (!disposed && e.data.count > 0) pairWithHead(e.data);
        worker?.terminate();
        worker = null;
      };
      worker.postMessage({ count });
    };

    samplePortrait(PORTRAIT_SRC, vw < 768 ? 3800 : 9500)
      .then((targets) => {
        if (disposed) return;

        count = targets.count;
        tx = targets.x;
        ty = targets.y;
        startX = new Float32Array(count);
        startY = new Float32Array(count);
        delay = new Float32Array(count);
        duration = new Float32Array(count);
        curveAmp = new Float32Array(count);
        curveAngle = new Float32Array(count);
        size = new Float32Array(count);
        baseAlpha = new Float32Array(count);
        twinkleSpeed = new Float32Array(count);
        twinklePhase = new Float32Array(count);
        scatter = new Float32Array(count);
        outX = new Float32Array(count);
        outY = new Float32Array(count);
        outR = new Float32Array(count);
        outBucket = new Int8Array(count);
        order = new Int32Array(count);

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 0.4 + Math.random() * 0.9;
          startX[i] = 0.5 + Math.cos(angle) * dist;
          startY[i] = 0.5 + Math.sin(angle) * dist;
          delay[i] = Math.random() * 1.1;
          duration[i] = 1.2 + Math.random() * 0.95;
          curveAmp[i] = (Math.random() - 0.5) * 0.35;
          curveAngle[i] = Math.random() * Math.PI * 2;
          twinkleSpeed[i] = 1.5 + Math.random() * 3.5;
          twinklePhase[i] = Math.random() * Math.PI * 2;
          scatter[i] = 0.6 + Math.random() * 0.4;

          const feature = targets.feature[i] === 1;
          const flare = !feature && Math.random() < 0.03;
          size[i] = flare ? 1.5 : feature ? 0.55 + Math.random() * 0.35 : 0.65 + Math.random() * 0.45;
          baseAlpha[i] = feature
            ? Math.max(0.6, 0.55 + targets.brightness[i] * 0.4)
            : Math.max(0.35, 0.4 + targets.brightness[i] * 0.5);
        }

        // Sculpting runs off-thread; give the formation a head start
        workerTimer = window.setTimeout(startWorker, 1200);
        if (running) schedule();
      })
      .catch(() => {
        // No portrait, no effect; the rest of the page is unaffected.
      });

    /* ---------------- frame ---------------- */

    const draw = (now: number) => {
      frame = 0;
      if (!count) return;

      if (startTime === null && readyRef.current) {
        startTime = formedThisVisit || reduced ? now - 60_000 : now;
      }
      const elapsed = startTime === null ? 0 : (now - startTime) / 1000;

      pointer.ex += ((pointer.active ? pointer.x : 0) - pointer.ex) * 0.05;
      pointer.ey += ((pointer.active ? pointer.y : 0) - pointer.ey) * 0.05;

      // Hero square, centred in its box
      const hr = heroEl.getBoundingClientRect();
      const side = Math.min(hr.width, hr.height);
      const heroLeft = hr.left + (hr.width - side) / 2;
      const heroTop = hr.top + (hr.height - side) / 2;
      const heroCenter = hr.top + hr.height / 2;

      // Morph progress: 0 with the hero centred in the viewport, 1 with
      // the head slot centred.
      let morph = 0;
      let hd: DOMRect | null = null;
      if (head && headEl) {
        hd = headEl.getBoundingClientRect();
        const headCenter = hd.top + hd.height / 2;
        const span = headCenter - heroCenter;
        if (span > 1) morph = smoothstep(0.12, 0.88, (vh / 2 - heroCenter) / span);
      }

      // Scatter once the last target scrolls up out of view
      const anchorBottom = hd ? hd.bottom : hr.bottom;
      const disperse = clamp01((vh * 0.3 - anchorBottom) / (vh * 0.45));

      if (disperse >= 1 || hr.top > vh) {
        if (!cleared) {
          ctx.clearRect(0, 0, vw, vh);
          cleared = true;
        }
        // Keep polling cheaply: scrolling back up must bring them back
        if (running) schedule();
        return;
      }

      // Project the bust for this frame
      if (head && hd && morph > 0.001) {
        // Turned toward the About panel, swaying either side of that
        const sway = 0.32 + (reduced ? 0 : Math.sin(elapsed * 0.28) * 0.3);
        const yaw = sway + (coarse ? 0 : pointer.ex * 0.56);
        const pitch = -0.05 + (coarse ? 0 : pointer.ey * 0.28);
        const cyaw = Math.cos(yaw);
        const syaw = Math.sin(yaw);
        const cp = Math.cos(pitch);
        const sp = Math.sin(pitch);
        const scale = Math.min(
          (hd.height * 0.94) / (BUST_TOP - BUST_BOTTOM),
          (hd.width * 0.94) / (2 * BUST_HALF_WIDTH)
        );
        const cx = hd.left + hd.width / 2;
        const cy = hd.top + hd.height / 2;
        const { positions, normals, shade } = head;

        for (let j = 0; j < head.count; j++) {
          const x = positions[j * 3];
          const y = positions[j * 3 + 1];
          const z = positions[j * 3 + 2];

          const x1 = x * cyaw + z * syaw;
          const z1 = -x * syaw + z * cyaw;
          const y2 = y * cp - z1 * sp;
          const z2 = y * sp + z1 * cp;

          const nz1 = -normals[j * 3] * syaw + normals[j * 3 + 2] * cyaw;
          const facing = normals[j * 3 + 1] * sp + nz1 * cp;

          const f = CAMERA_DISTANCE / (CAMERA_DISTANCE - z2);
          headX[j] = cx + x1 * scale * f;
          headY[j] = cy - (y2 - BUST_MID) * scale * f;
          headA[j] = (0.3 + 0.7 * shade[j]) * smoothstep(-0.05, 0.35, facing);
        }
      }

      const parallaxX = coarse ? 0 : pointer.ex * 18;
      const parallaxY = coarse ? 0 : pointer.ey * 18;
      const swirl = Math.sin(morph * Math.PI) * Math.min(vw, vh) * 0.35;
      const push = disperse * Math.max(vw, vh) * 0.55;
      const fade = 1 - disperse;
      const useHead = head !== null && morph > 0.001;
      const crossfade = reduced && useHead;

      let formedAll = true;

      for (let i = 0; i < count; i++) {
        const progress =
          startTime === null ? 0 : clamp01((elapsed - delay[i]) / duration[i]);
        if (progress < 1) formedAll = false;

        const hx = heroLeft + tx[i] * side + parallaxX * (0.5 + ty[i] * 0.5);
        const hy = heroTop + ty[i] * side + parallaxY * (0.5 + ty[i] * 0.5);

        let x: number;
        let y: number;
        let a: number;

        if (progress < 1) {
          const ease = 1 - Math.pow(1 - progress, 3);
          const bend = Math.sin(progress * Math.PI) * curveAmp[i];
          x = (startX[i] + (hx / vw - startX[i]) * ease + Math.cos(curveAngle[i]) * bend) * vw;
          y = (startY[i] + (hy / vh - startY[i]) * ease + Math.sin(curveAngle[i]) * bend) * vh;
          a = baseAlpha[i] * Math.max(0.2, progress);
        } else {
          const twinkle = reduced ? 0 : Math.sin(elapsed * twinkleSpeed[i] + twinklePhase[i]) * 0.18;
          a = Math.min(1, Math.max(0.15, baseAlpha[i] + twinkle));
          x = hx;
          y = hy;

          if (useHead && !crossfade) {
            const j = headIndex[i];
            const s = swirl * curveAmp[i];
            x = hx + (headX[j] - hx) * morph + Math.sin(twinklePhase[i]) * s;
            y = hy + (headY[j] - hy) * morph + Math.cos(twinklePhase[i]) * s;
            a = a + (headA[j] - a) * morph;
          }
        }

        if (disperse > 0) {
          const angle = (i / count) * Math.PI * 2 + twinklePhase[i];
          x += Math.cos(angle) * push * scatter[i];
          y += Math.sin(angle) * push * scatter[i];
        }

        // Reduced motion: no flight between targets, just a crossfade.
        if (crossfade) a *= 1 - morph;

        a *= fade;
        outX[i] = x;
        outY[i] = y;
        outR[i] = useHead && !crossfade ? size[i] + (0.75 - size[i]) * morph : size[i];
        outBucket[i] = a <= 0.01 ? -1 : Math.min(BUCKETS - 1, Math.floor(a * BUCKETS));
      }

      if (formedAll && startTime !== null) formedThisVisit = true;

      ctx.clearRect(0, 0, vw, vh);
      cleared = false;

      // Counting sort by alpha bucket, so each bucket is one path and one
      // fill without rescanning every particle ten times.
      bucketStart.fill(0);
      for (let i = 0; i < count; i++) {
        if (outBucket[i] >= 0) bucketStart[outBucket[i] + 1]++;
      }
      for (let b = 0; b < BUCKETS; b++) bucketStart[b + 1] += bucketStart[b];
      const cursor = bucketStart.slice(0, BUCKETS);
      for (let i = 0; i < count; i++) {
        if (outBucket[i] >= 0) order[cursor[outBucket[i]]++] = i;
      }

      for (let b = 0; b < BUCKETS; b++) {
        ctx.beginPath();
        let any = false;

        for (let k = bucketStart[b]; k < bucketStart[b + 1]; k++) {
          const i = order[k];
          any = true;
          const r = outR[i];
          if (r > 1.1) {
            ctx.moveTo(outX[i] + r, outY[i]);
            ctx.arc(outX[i], outY[i], r, 0, Math.PI * 2);
          } else {
            // A one-to-two pixel dot is indistinguishable from a square
            // and an order of magnitude cheaper to rasterise than an arc.
            ctx.rect(outX[i] - r, outY[i] - r, r * 2, r * 2);
          }
        }

        // Reduced-motion crossfade: the bust fades in where it stands
        if (crossfade && head) {
          for (let i = 0; i < count; i++) {
            const j = headIndex[i];
            const ha = headA[j] * morph * fade;
            if (ha <= 0.01 || Math.min(BUCKETS - 1, Math.floor(ha * BUCKETS)) !== b) continue;
            any = true;
            ctx.rect(headX[j] - 0.75, headY[j] - 0.75, 1.5, 1.5);
          }
        }

        if (any) {
          ctx.fillStyle = FILLS[b];
          ctx.fill();
        }
      }

      if (running) schedule();
    };

    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(draw);
    };

    /* ---------------- run only while a target is on screen ---------------- */

    const onScreen = new Set<Element>();
    const setRunning = () => {
      const next = onScreen.size > 0 && document.visibilityState === "visible";
      if (next === running) return;
      running = next;
      if (running) {
        schedule();
      } else {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        ctx.clearRect(0, 0, vw, vh);
        cleared = true;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        setRunning();
      },
      { rootMargin: "25% 0px 25% 0px" }
    );
    observer.observe(heroEl);
    if (headEl) observer.observe(headEl);

    const onResize = () => {
      resize();
      schedule();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", setRunning);

    return () => {
      disposed = true;
      running = false;
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(workerTimer);
      worker?.terminate();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", setRunning);
    };
  }, [host]);

  if (!host) return null;

  return createPortal(
    <canvas ref={canvasRef} className="portrait-particles" aria-hidden="true" />,
    host
  );
}
