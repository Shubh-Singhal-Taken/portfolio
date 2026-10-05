import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { samplePortrait } from "./sampleImage";
import { buildGalaxy, type Galaxy } from "./galaxy";

/* The star portrait, as particles.

   Stars drift in from across the viewport and settle into the portrait
   inside [data-portrait-hero]. Scrolling toward [data-portrait-galaxy]
   unwinds the portrait from the outside in: its stars pour out in one
   curving stream and wind into a slowly turning spiral galaxy beside and
   beneath that element, with the face arriving last as the bright core.
   Scrolling past it dissolves the galaxy back into the star field.

   Both targets are measured from the live layout every frame, so the
   effect follows the page at any width. The canvas is portalled to
   <body> and painted beneath the page content, so particles never sit on
   top of text. */

type Props = { ready: boolean };

const PORTRAIT_SRC = "/portrait.png";
const BUCKETS = 10;
const FILLS = Array.from(
  { length: BUCKETS },
  (_, i) => `rgba(255, 255, 255, ${((i + 1) / BUCKETS).toFixed(2)})`
);

/* Galaxy presentation */
const TILT = 1.08; // radians from edge-on; ~62°, an open ellipse
const ROLL = -0.32; // screen-space lean of the disc
const SPIN = 0.035; // radians per second
const PERSPECTIVE = 0.35;

/* Share of the morph spent staggering departures: outer stars of the
   portrait leave first, the face last. */
const STAGGER = 0.45;

/* The formation plays once per visit; later mounts start fully formed. */
let formedThisVisit = false;

const TAU = Math.PI * 2;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
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
    const galaxyEl = document.querySelector<HTMLElement>("[data-portrait-galaxy]");
    if (!heroEl) return;

    let disposed = false;
    let frame = 0;
    let running = false;

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
    let departure = new Float32Array(0);
    let bend = new Float32Array(0);

    let galaxy: Galaxy | null = null;
    let galaxyIndex = new Int32Array(0);
    let galaxyX = new Float32Array(0);
    let galaxyY = new Float32Array(0);

    // Per-frame scratch, reused
    let outX = new Float32Array(0);
    let outY = new Float32Array(0);
    let outR = new Float32Array(0);
    let outBucket = new Int8Array(0);
    let order = new Int32Array(0);
    const bucketStart = new Int32Array(BUCKETS + 1);

    let startTime: number | null = null;
    let cleared = true;

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
        departure = new Float32Array(count);
        bend = new Float32Array(count);
        outX = new Float32Array(count);
        outY = new Float32Array(count);
        outR = new Float32Array(count);
        outBucket = new Int8Array(count);
        order = new Int32Array(count);

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * TAU;
          const dist = 0.4 + Math.random() * 0.9;
          startX[i] = 0.5 + Math.cos(angle) * dist;
          startY[i] = 0.5 + Math.sin(angle) * dist;
          delay[i] = Math.random() * 1.1;
          duration[i] = 1.2 + Math.random() * 0.95;
          curveAmp[i] = (Math.random() - 0.5) * 0.35;
          curveAngle[i] = Math.random() * TAU;
          twinkleSpeed[i] = 1.5 + Math.random() * 3.5;
          twinklePhase[i] = Math.random() * TAU;
          scatter[i] = 0.6 + Math.random() * 0.4;
          bend[i] = 0.25 + Math.random() * 0.3;

          const feature = targets.feature[i] === 1;
          const flare = !feature && Math.random() < 0.03;
          size[i] = flare ? 1.5 : feature ? 0.55 + Math.random() * 0.35 : 0.65 + Math.random() * 0.45;
          baseAlpha[i] = feature
            ? Math.max(0.6, 0.55 + targets.brightness[i] * 0.4)
            : Math.max(0.35, 0.4 + targets.brightness[i] * 0.5);
        }

        if (galaxyEl) {
          const g = buildGalaxy(count);
          galaxyX = new Float32Array(g.count);
          galaxyY = new Float32Array(g.count);

          // Pair by distance from the centre: the outskirts of the portrait
          // become the outer arms and the face becomes the core.
          const portraitR = (i: number) => Math.hypot(tx[i] - 0.5, ty[i] - 0.42);
          const byPortrait = Array.from({ length: count }, (_, i) => i).sort(
            (a, b) => portraitR(a) - portraitR(b)
          );
          const byGalaxy = Array.from({ length: g.count }, (_, j) => j).sort(
            (a, b) => g.radius[a] - g.radius[b]
          );

          galaxyIndex = new Int32Array(count);
          for (let k = 0; k < count; k++) {
            const i = byPortrait[k];
            galaxyIndex[i] = byGalaxy[Math.floor((k / count) * g.count)];
            // Unwind from the outside in: the outermost leave first
            departure[i] = (1 - k / count) * STAGGER;
          }
          galaxy = g;
        }

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

      // Morph progress: 0 with the hero centred in the viewport, 1 once
      // the galaxy's core has come up to the middle of the screen.
      let morph = 0;
      let gr: DOMRect | null = null;
      let gcx = 0;
      let gcy = 0;
      if (galaxy && galaxyEl) {
        gr = galaxyEl.getBoundingClientRect();
        // Desktop: the core sits in the open space left of the panel and
        // the arms sweep under its glass. Narrow screens: the core sits
        // just above the panel. Either way it is anchored near the top of
        // a tall panel, so the galaxy forms while its opening is on screen.
        if (vw >= 900) {
          gcx = gr.left - Math.min(560, vw * 0.36) * 0.3;
          gcy = gr.top + Math.min(gr.height / 2, vh * 0.5);
        } else {
          gcx = gr.left + gr.width / 2;
          gcy = gr.top - Math.min(vw * 0.5, 260) * 0.12;
        }
        // The flight covers at most ~1.25 screens of scroll. Where the
        // galaxy sits far below the hero (a lens page, with Selected work
        // in between), the portrait first rides up and away with the hero
        // and its stars pour back down only as the galaxy approaches.
        const span = gcy - heroCenter;
        if (span > 1) morph = clamp01(1 - (gcy - vh / 2) / Math.min(span, vh * 1.25));
      }

      // Dissolve once the panel has mostly scrolled away
      const anchorBottom = gr ? gr.bottom : hr.bottom;
      const disperse = clamp01((vh * 0.45 - anchorBottom) / (vh * 0.5));

      if (disperse >= 1 || hr.top > vh) {
        if (!cleared) {
          ctx.clearRect(0, 0, vw, vh);
          cleared = true;
        }
        // Keep polling cheaply: scrolling back up must bring them back
        if (running) schedule();
        return;
      }

      const useGalaxy = galaxy !== null && gr !== null && morph > 0.001;

      // Project the galaxy for this frame
      if (useGalaxy && galaxy && gr) {
        const radius = vw >= 900 ? Math.min(560, vw * 0.36) : Math.min(vw * 0.5, 260);
        const spin = reduced ? 0.6 : 0.6 + elapsed * SPIN;
        const tilt = TILT + (coarse || reduced ? 0 : pointer.ey * 0.25);
        const roll = ROLL + (coarse || reduced ? 0 : pointer.ex * 0.2);
        const cs = Math.cos(spin);
        const ss = Math.sin(spin);
        const ct = Math.cos(tilt);
        const st = Math.sin(tilt);
        const cr = Math.cos(roll);
        const sr = Math.sin(roll);
        const { x, y, z } = galaxy;

        for (let j = 0; j < galaxy.count; j++) {
          // Spin in the disc plane, tilt toward the viewer, then lean
          const x1 = x[j] * cs - z[j] * ss;
          const z1 = x[j] * ss + z[j] * cs;
          const y2 = y[j] * ct - z1 * st;
          const z2 = y[j] * st + z1 * ct;
          const f = 1 / (1 - z2 * PERSPECTIVE * 0.5);
          const sx = x1 * f;
          const sy = y2 * f;
          galaxyX[j] = gcx + (sx * cr - sy * sr) * radius;
          galaxyY[j] = gcy - (sx * sr + sy * cr) * radius;
        }
      }

      const parallaxX = coarse ? 0 : pointer.ex * 18;
      const parallaxY = coarse ? 0 : pointer.ey * 18;
      const push = disperse * Math.max(vw, vh) * 0.6;
      const fade = 1 - disperse;
      const crossfade = reduced && useGalaxy;

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
        let r = size[i];

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

          if (useGalaxy && !crossfade && galaxy) {
            const j = galaxyIndex[i];
            const t = smoothstep(departure[i], departure[i] + (1 - STAGGER), morph);

            if (t > 0) {
              // A quadratic curve whose control point is pushed off to one
              // side of the straight line: every star bends the same way,
              // so the portrait pours out as one stream instead of each
              // star sliding across on its own.
              const gx = galaxyX[j];
              const gy = galaxyY[j];
              const dx = gx - hx;
              const dy = gy - hy;
              const cx = (hx + gx) / 2 - dy * bend[i];
              const cy = (hy + gy) / 2 + dx * bend[i];
              const u = 1 - t;
              x = u * u * hx + 2 * u * t * cx + t * t * gx;
              y = u * u * hy + 2 * u * t * cy + t * t * gy;
              // Galaxy alpha: the core glows, the arms and halo are fainter
              a = a + (galaxy.brightness[j] * (0.75 + twinkle) - a) * t;
              r = size[i] + (galaxy.size[j] - size[i]) * t;
            }
          }
        }

        if (disperse > 0) {
          const angle = (i / count) * TAU + twinklePhase[i];
          x += Math.cos(angle) * push * scatter[i];
          y += Math.sin(angle) * push * scatter[i];
        }

        // Reduced motion: no flight between targets, just a crossfade.
        if (crossfade) a *= 1 - morph;

        a *= fade;
        outX[i] = x;
        outY[i] = y;
        outR[i] = r;
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
            ctx.arc(outX[i], outY[i], r, 0, TAU);
          } else {
            // A one-to-two pixel dot is indistinguishable from a square
            // and an order of magnitude cheaper to rasterise than an arc.
            ctx.rect(outX[i] - r, outY[i] - r, r * 2, r * 2);
          }
        }

        // Reduced-motion crossfade: the galaxy fades in where it stands
        if (crossfade && galaxy) {
          for (let i = 0; i < count; i++) {
            const j = galaxyIndex[i];
            const ga = galaxy.brightness[j] * 0.75 * morph * fade;
            if (ga <= 0.01 || Math.min(BUCKETS - 1, Math.floor(ga * BUCKETS)) !== b) continue;
            any = true;
            const gs = galaxy.size[j];
            ctx.rect(galaxyX[j] - gs, galaxyY[j] - gs, gs * 2, gs * 2);
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
    if (galaxyEl) observer.observe(galaxyEl);

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
