import { useEffect, useRef, useState } from "react";
import { onScrollChange } from "../../lib/scroll";

interface Props {
  ready: boolean;
}

const PREFERS_REDUCED_MOTION = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pre-cached alpha fill styles for zero-allocation rendering
const ALPHA_BUCKETS_COUNT = 10;
const ALPHA_STYLES: string[] = Array.from({ length: ALPHA_BUCKETS_COUNT }, (_, i) => {
  const a = ((i + 1) / ALPHA_BUCKETS_COUNT).toFixed(2);
  return `rgba(255, 255, 255, ${a})`;
});

// Helper: Generate About-Section Visual Target Coordinates (3/4 Perspective Wireframe Head & Forehead Lightbulb)
function generateAboutTargetCoordinates(count: number): {
  targetX2: Float32Array;
  targetY2: Float32Array;
} {
  const targetX2 = new Float32Array(count);
  const targetY2 = new Float32Array(count);

  // Center of Head & Visual on Viewport Left (Normalized 0..1)
  const headCx = 0.22;
  const headCy = 0.35;
  const headRx = 0.115;
  const headRy = 0.155;

  // 3/4 Yaw Rotation Angle (~18 degrees towards right)
  const yaw = 0.32;

  for (let i = 0; i < count; i++) {
    const ratio = i / count;

    if (ratio < 0.28) {
      // -------------------------------------------------------------
      // 1. Glowing Forehead Lightbulb Emblem & Radial Aura (28%)
      // -------------------------------------------------------------
      const bulbCx = headCx + 0.008;
      const bulbCy = headCy - 0.040;
      const sub = ratio / 0.28;

      if (sub < 0.25) {
        // Inner Glowing Spherical Core (Dense bright center circle)
        const r = Math.sqrt(Math.random()) * 0.016;
        const ang = Math.random() * Math.PI * 2;
        targetX2[i] = bulbCx + Math.cos(ang) * r;
        targetY2[i] = bulbCy - 0.010 + Math.sin(ang) * r;
      } else if (sub < 0.55) {
        // Smooth Outer Glass Bulb Shell (Dome top + neck taper)
        const bulbProg = (sub - 0.25) / 0.30;
        const angle = -Math.PI * 0.75 + bulbProg * Math.PI * 1.5;
        let r = 0.035;
        if (Math.sin(angle) > 0.2) {
          const taper = (Math.sin(angle) - 0.2) / 0.8;
          r = 0.035 * (1 - taper * 0.48);
        }
        targetX2[i] = bulbCx + Math.cos(angle) * r + (Math.random() - 0.5) * 0.002;
        targetY2[i] = bulbCy - 0.008 + Math.sin(angle) * r * 1.15 + (Math.random() - 0.5) * 0.002;
      } else if (sub < 0.72) {
        // Screw Base Threads
        const threadProg = (sub - 0.55) / 0.17;
        const ringIdx = Math.floor(threadProg * 4);
        const ringT = (threadProg * 4) % 1;
        const ringWidth = 0.018 - ringIdx * 0.0015;
        targetX2[i] = bulbCx + (ringT - 0.5) * ringWidth * 2;
        targetY2[i] = bulbCy + 0.032 + ringIdx * 0.006;
      } else {
        // Radial Soft Light Glow Aura (Spreading across forehead)
        const auraProg = (sub - 0.72) / 0.28;
        const r = 0.018 + Math.sqrt(auraProg) * 0.055;
        const ang = Math.random() * Math.PI * 2;
        targetX2[i] = bulbCx + Math.cos(ang) * r;
        targetY2[i] = bulbCy - 0.005 + Math.sin(ang) * r * 0.9;
      }
    } else if (ratio < 0.96) {
      // -------------------------------------------------------------
      // 2. 3/4 Perspective Wireframe Head, Face, Neck & Bust Mesh (68%)
      // -------------------------------------------------------------
      const sub = (ratio - 0.28) / 0.68;

      if (sub < 0.35) {
        // Horizontal Latitude Wireframe Rings (Head -> Neck -> Chest)
        const latIdx = Math.floor((sub / 0.35) * 36);
        const latT = ((sub / 0.35) * 36) % 1;
        const vNorm = latIdx / 36;

        let ringY: number;
        let ringRx: number;
        let ringZ: number;

        if (vNorm < 0.60) {
          const hT = vNorm / 0.60;
          ringY = headCy - headRy + hT * (headRy * 1.9);
          const headRadFactor = Math.sin(hT * Math.PI);
          ringRx = headRx * Math.pow(headRadFactor, 0.6);
          ringZ = headRx * 0.9 * headRadFactor;
        } else if (vNorm < 0.75) {
          const nT = (vNorm - 0.60) / 0.15;
          ringY = headCy + headRy * 0.9 + nT * 0.09;
          ringRx = 0.048 + nT * 0.012;
          ringZ = 0.045;
        } else {
          const cT = (vNorm - 0.75) / 0.25;
          ringY = headCy + headRy * 0.9 + 0.09 + cT * 0.15;
          ringRx = 0.060 + Math.pow(cT, 1.2) * 0.14;
          ringZ = 0.060 + cT * 0.08;
        }

        const angle3D = latT * Math.PI * 2;
        const x3d = Math.cos(angle3D) * ringRx;
        const z3d = Math.sin(angle3D) * ringZ;
        const rotX = x3d * Math.cos(yaw) + z3d * Math.sin(yaw);

        targetX2[i] = headCx + rotX + (Math.random() - 0.5) * 0.002;
        targetY2[i] = ringY + (Math.random() - 0.5) * 0.002;
      } else if (sub < 0.70) {
        // Vertical Longitude Meridian Wireframe Curves
        const lonIdx = Math.floor(((sub - 0.35) / 0.35) * 32);
        const lonT = Math.random();
        const angle3D = (lonIdx / 32) * Math.PI * 2;

        let ringY: number;
        let ringRx: number;
        let ringZ: number;

        if (lonT < 0.60) {
          const hT = lonT / 0.60;
          ringY = headCy - headRy + hT * (headRy * 1.9);
          const headRadFactor = Math.sin(hT * Math.PI);
          ringRx = headRx * Math.pow(headRadFactor, 0.6);
          ringZ = headRx * 0.9 * headRadFactor;
        } else if (lonT < 0.75) {
          const nT = (lonT - 0.60) / 0.15;
          ringY = headCy + headRy * 0.9 + nT * 0.09;
          ringRx = 0.048 + nT * 0.012;
          ringZ = 0.045;
        } else {
          const cT = (lonT - 0.75) / 0.25;
          ringY = headCy + headRy * 0.9 + 0.09 + cT * 0.15;
          ringRx = 0.060 + Math.pow(cT, 1.2) * 0.14;
          ringZ = 0.060 + cT * 0.08;
        }

        const x3d = Math.cos(angle3D) * ringRx;
        const z3d = Math.sin(angle3D) * ringZ;
        const rotX = x3d * Math.cos(yaw) + z3d * Math.sin(yaw);

        targetX2[i] = headCx + rotX + (Math.random() - 0.5) * 0.002;
        targetY2[i] = ringY + (Math.random() - 0.5) * 0.002;
      } else if (sub < 0.88) {
        // Diagonal Triangular Cross-Lattice Wireframe Lines
        const diagT = Math.random();
        const latLevel = Math.random();
        const angle3D = Math.random() * Math.PI * 2;
        const hRadFactor = Math.sin(Math.min(1, latLevel * 1.4) * Math.PI);

        const rX = headRx * 0.95 * Math.max(0.2, hRadFactor);
        const rZ = headRx * 0.85 * Math.max(0.2, hRadFactor);
        const yPos = headCy - headRy + latLevel * (headRy * 2.3);

        const x3d = Math.cos(angle3D + diagT * 0.2) * rX;
        const z3d = Math.sin(angle3D + diagT * 0.2) * rZ;
        const rotX = x3d * Math.cos(yaw) + z3d * Math.sin(yaw);

        targetX2[i] = headCx + rotX;
        targetY2[i] = yPos + diagT * 0.015;
      } else {
        // Specific 3/4 Facial Landmarks (Left Ear, Eye Socket Cutouts, Nose Ridge, Lips)
        const featIdx = Math.floor(((sub - 0.88) / 0.12) * 5);
        const featT = (((sub - 0.88) / 0.12) * 5) % 1;

        if (featIdx === 0) {
          // Left Ear Profile Arc
          const earAng = -Math.PI * 0.4 + featT * Math.PI * 0.85;
          targetX2[i] = headCx - 0.108 + Math.cos(earAng) * 0.014;
          targetY2[i] = headCy + 0.005 + Math.sin(earAng) * 0.038;
        } else if (featIdx === 1) {
          // Left Eye Socket Arc
          const eAng = featT * Math.PI * 2;
          targetX2[i] = headCx - 0.022 + Math.cos(eAng) * 0.016;
          targetY2[i] = headCy + 0.018 + Math.sin(eAng) * 0.009;
        } else if (featIdx === 2) {
          // Right Eye Socket Arc
          const eAng = featT * Math.PI * 2;
          targetX2[i] = headCx + 0.052 + Math.cos(eAng) * 0.012;
          targetY2[i] = headCy + 0.018 + Math.sin(eAng) * 0.008;
        } else if (featIdx === 3) {
          // Nose Ridge & Tip
          targetX2[i] = headCx + 0.018 + featT * 0.014;
          targetY2[i] = headCy + 0.018 + featT * 0.045;
        } else {
          // Mouth Line & Lips
          targetX2[i] = headCx - 0.010 + featT * 0.055;
          targetY2[i] = headCy + 0.082 + Math.sin(featT * Math.PI) * 0.004;
        }
      }
    } else {
      // -------------------------------------------------------------
      // 3. Ambient Deep-Space Micro Stars (4%)
      // -------------------------------------------------------------
      targetX2[i] = 0.04 + Math.random() * 0.38;
      targetY2[i] = 0.10 + Math.random() * 0.78;
    }
  }

  return { targetX2, targetY2 };
}

export default function PortraitParticleCanvas({ ready }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reusable typed arrays for zero-allocation particle state
  const particleCountRef = useRef<number>(0);
  const particleDataRef = useRef<{
    startX: Float32Array;
    startY: Float32Array;
    targetX1: Float32Array;
    targetY1: Float32Array;
    targetX2: Float32Array;
    targetY2: Float32Array;
    delay: Float32Array;
    duration: Float32Array;
    curveAmp: Float32Array;
    curveAngle: Float32Array;
    size: Float32Array;
    baseAlpha: Float32Array;
    twinkleSpeed: Float32Array;
    twinklePhase: Float32Array;
    isFacialFeature: Uint8Array;
    isStarFlare: Uint8Array;
  } | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const morphProgressRef = useRef<number>(0); // 0.0 = Hero Portrait (Right), 1.0 = About Visual (Left)
  const scrollDispersalRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const easedPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isVisibleRef = useRef<boolean>(true);

  // 1. Offscreen High-Resolution Blueprint Analysis & Dual Target Initialization
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/portrait.png";

    img.onload = () => {
      const sampleWidth = 500;
      const sampleHeight = 500;
      const offCanvas = document.createElement("canvas");
      offCanvas.width = sampleWidth;
      offCanvas.height = sampleHeight;
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
      const imgData = offCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const pixels = imgData.data;

      // Luminance Grid
      const lumGrid = new Float32Array(sampleWidth * sampleHeight);
      const alphaGrid = new Uint8Array(sampleWidth * sampleHeight);

      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          const idx = (y * sampleWidth + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const a = pixels[idx + 3];

          alphaGrid[y * sampleWidth + x] = a;
          if (a >= 20) {
            lumGrid[y * sampleWidth + x] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          }
        }
      }

      // Sobel Edge Detection for Facial Boundaries
      const edgeGrid = new Float32Array(sampleWidth * sampleHeight);
      for (let y = 1; y < sampleHeight - 1; y++) {
        for (let x = 1; x < sampleWidth - 1; x++) {
          if (alphaGrid[y * sampleWidth + x] < 20) continue;

          const gx =
            lumGrid[(y - 1) * sampleWidth + (x + 1)] +
            2 * lumGrid[y * sampleWidth + (x + 1)] +
            lumGrid[(y + 1) * sampleWidth + (x + 1)] -
            (lumGrid[(y - 1) * sampleWidth + (x - 1)] +
              2 * lumGrid[y * sampleWidth + (x - 1)] +
              lumGrid[(y + 1) * sampleWidth + (x - 1)]);

          const gy =
            lumGrid[(y + 1) * sampleWidth + (x - 1)] +
            2 * lumGrid[(y + 1) * sampleWidth + x] +
            lumGrid[(y + 1) * sampleWidth + (x + 1)] -
            (lumGrid[(y - 1) * sampleWidth + (x - 1)] +
              2 * lumGrid[(y - 1) * sampleWidth + x] +
              lumGrid[(y - 1) * sampleWidth + (x + 1)]);

          edgeGrid[y * sampleWidth + x] = Math.sqrt(gx * gx + gy * gy);
        }
      }

      interface Candidate {
        x: number;
        y: number;
        brightness: number;
        priorityWeight: number;
        isFeature: boolean;
      }

      const candidatePoints: Candidate[] = [];
      const step = 2;

      for (let y = 1; y < sampleHeight - 1; y += step) {
        for (let x = 1; x < sampleWidth - 1; x += step) {
          const idx = y * sampleWidth + x;
          const a = alphaGrid[idx];
          if (a < 20) continue;

          const brightness = lumGrid[idx];
          const edge = edgeGrid[idx];

          // Sub-pixel jitter removes horizontal scanline artifacts
          const jitterX = (Math.random() - 0.5) * step * 0.95;
          const jitterY = (Math.random() - 0.5) * step * 0.95;
          const normX = (x + jitterX) / sampleWidth;
          const normY = (y + jitterY) / sampleHeight;

          // Region Priority Identification
          const isEyes = normY >= 0.18 && normY <= 0.42 && normX >= 0.26 && normX <= 0.74;
          const isMouth = normY >= 0.46 && normY <= 0.64 && normX >= 0.32 && normX <= 0.68;
          const isNose = normY >= 0.28 && normY <= 0.50 && normX >= 0.34 && normX <= 0.66;
          const isJaw = normY >= 0.48 && normY <= 0.78 && (normX <= 0.38 || normX >= 0.62);
          const isHair = normY < 0.38;
          const isBody = normY > 0.68;

          let regionBonus = 1.0;
          let isFeature = false;

          if (isEyes) {
            regionBonus = 4.5;
            isFeature = true;
          } else if (isMouth) {
            regionBonus = 4.0;
            isFeature = true;
          } else if (isNose) {
            regionBonus = 3.5;
            isFeature = true;
          } else if (isJaw) {
            regionBonus = 2.8;
          } else if (isHair) {
            regionBonus = 2.0;
          } else if (isBody) {
            regionBonus = 0.3;
          }

          const priorityWeight = edge * 6.0 + brightness * 2.0 + regionBonus + Math.random() * 0.4;

          if (brightness > 0.015 || edge > 0.04 || regionBonus >= 2.0) {
            candidatePoints.push({
              x: normX,
              y: normY,
              brightness,
              priorityWeight,
              isFeature,
            });
          }
        }
      }

      // Sort candidate points by priority weight so facial features get top quota
      candidatePoints.sort((a, b) => b.priorityWeight - a.priorityWeight);

      const isMobile = window.innerWidth < 768;
      const maxParticles = isMobile ? 3800 : 9500;
      const count = Math.min(maxParticles, candidatePoints.length);

      if (count === 0) return;

      // Allocate Typed Arrays
      const startX = new Float32Array(count);
      const startY = new Float32Array(count);
      const targetX1 = new Float32Array(count);
      const targetY1 = new Float32Array(count);
      const delay = new Float32Array(count);
      const duration = new Float32Array(count);
      const curveAmp = new Float32Array(count);
      const curveAngle = new Float32Array(count);
      const size = new Float32Array(count);
      const baseAlpha = new Float32Array(count);
      const twinkleSpeed = new Float32Array(count);
      const twinklePhase = new Float32Array(count);
      const isFacialFeature = new Uint8Array(count);
      const isStarFlare = new Uint8Array(count);

      for (let i = 0; i < count; i++) {
        const pt = candidatePoints[i];
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.4 + Math.random() * 0.9;

        startX[i] = 0.5 + Math.cos(angle) * dist;
        startY[i] = 0.5 + Math.sin(angle) * dist;
        targetX1[i] = pt.x;
        targetY1[i] = pt.y;
        delay[i] = Math.random() * 1.1;
        duration[i] = 1.2 + Math.random() * 0.95;
        curveAmp[i] = (Math.random() - 0.5) * 0.35;
        curveAngle[i] = Math.random() * Math.PI * 2;

        const flare = !pt.isFeature && Math.random() < 0.03;
        isStarFlare[i] = flare ? 1 : 0;
        isFacialFeature[i] = pt.isFeature ? 1 : 0;

        size[i] = flare
          ? 1.5
          : pt.isFeature
          ? 0.55 + Math.random() * 0.35
          : 0.65 + Math.random() * 0.45;

        baseAlpha[i] = pt.isFeature
          ? Math.max(0.6, 0.55 + pt.brightness * 0.4)
          : Math.max(0.35, 0.4 + pt.brightness * 0.5);

        twinkleSpeed[i] = 1.5 + Math.random() * 3.5;
        twinklePhase[i] = Math.random() * Math.PI * 2;
      }

      // Generate About Visual Target Coordinates (Target 2: Left Side Head + Lightbulb)
      const { targetX2, targetY2 } = generateAboutTargetCoordinates(count);

      particleCountRef.current = count;
      particleDataRef.current = {
        startX,
        startY,
        targetX1,
        targetY1,
        targetX2,
        targetY2,
        delay,
        duration,
        curveAmp,
        curveAngle,
        size,
        baseAlpha,
        twinkleSpeed,
        twinklePhase,
        isFacialFeature,
        isStarFlare,
      };

      setImageLoaded(true);
    };
  }, []);

  // 2. Continuous Scroll-Scrubbed Particle Morph Render Loop
  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const reducedMotion = PREFERS_REDUCED_MOTION();
    const isMobile = window.innerWidth < 768;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // IntersectionObserver to pause when scrolling past About section
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry ? entry.isIntersecting : true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Scroll listener for real-time scrubbed particle morphing (Hero Right -> About Left)
    const unsubscribeScroll = onScrollChange(({ y }) => {
      const vh = window.innerHeight;
      // Morph occurs smoothly as user scrolls from Hero (y=0) to About (y=vh)
      const morph = Math.max(0, Math.min(1, (y - vh * 0.15) / (vh * 0.70)));
      morphProgressRef.current = morph;

      // Dispersal occurs after scroll moves past About section (y > vh * 1.85)
      const factor = Math.max(0, (y - vh * 1.85) / (vh * 0.5));
      scrollDispersalRef.current = Math.min(factor, 1.5);
    });

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    const batchPaths: Path2D[] = Array.from({ length: ALPHA_BUCKETS_COUNT }, () => new Path2D());

    // Main Render Loop
    const render = (timestamp: number) => {
      if (!isVisibleRef.current || document.visibilityState === "hidden") {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (!startTimeRef.current && ready) {
        startTimeRef.current = timestamp;
      }

      const elapsed = startTimeRef.current
        ? (timestamp - startTimeRef.current) / 1000
        : 0;

      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);
      const width = canvas.width;
      const height = canvas.height;
      const cssWidth = width / dpr;
      const cssHeight = height / dpr;

      ctx.clearRect(0, 0, width, height);

      const targetPointerX = pointerRef.current.active
        ? (pointerRef.current.x - 0.5) * 18
        : 0;
      const targetPointerY = pointerRef.current.active
        ? (pointerRef.current.y - 0.5) * 18
        : 0;

      easedPointerRef.current.x += (targetPointerX - easedPointerRef.current.x) * 0.05;
      easedPointerRef.current.y += (targetPointerY - easedPointerRef.current.y) * 0.05;

      const parallaxX = easedPointerRef.current.x;
      const parallaxY = easedPointerRef.current.y;
      const dispersal = scrollDispersalRef.current;
      const M = morphProgressRef.current; // Morph interpolation factor 0.0 -> 1.0

      const count = particleCountRef.current;
      const data = particleDataRef.current;

      if (!data || count === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Hero Portrait Right Side Container Scaling
      const heroSizeDim = Math.min(cssWidth * 0.5, cssHeight) * 0.96;
      const heroOffsetX = cssWidth * 0.5 + (cssWidth * 0.5 - heroSizeDim) / 2;
      const heroOffsetY = (cssHeight - heroSizeDim) / 2;

      // Re-initialize Path2D batch buckets
      for (let b = 0; b < ALPHA_BUCKETS_COUNT; b++) {
        batchPaths[b] = new Path2D();
      }

      // Cosmic Arc Swirl Factor during transition (0.15 < M < 0.85)
      const arcFactor = Math.sin(M * Math.PI);

      for (let i = 0; i < count; i++) {
        let progress = 0;

        if (reducedMotion) {
          progress = 1;
        } else if (ready && startTimeRef.current) {
          const particleTime = Math.max(0, elapsed - data.delay[i]);
          progress = Math.min(1, particleTime / data.duration[i]);
        }

        const easeOut = 1 - Math.pow(1 - progress, 3);
        let currX: number;
        let currY: number;

        // Target 1: Hero Portrait Normalized Viewport Position (Right side)
        const heroNormX = (heroOffsetX + data.targetX1[i] * heroSizeDim) / cssWidth;
        const heroNormY = (heroOffsetY + data.targetY1[i] * heroSizeDim) / cssHeight;

        // Target 2: About Visual Normalized Viewport Position (Left side)
        const aboutNormX = data.targetX2[i];
        const aboutNormY = data.targetY2[i];

        if (progress < 1) {
          // Initial landing formation movement
          const curveFactor = Math.sin(progress * Math.PI) * data.curveAmp[i];
          const curveX = Math.cos(data.curveAngle[i]) * curveFactor;
          const curveY = Math.sin(data.curveAngle[i]) * curveFactor;

          const normX = data.startX[i] + (heroNormX - data.startX[i]) * easeOut + curveX;
          const normY = data.startY[i] + (heroNormY - data.startY[i]) * easeOut + curveY;

          currX = normX * cssWidth;
          currY = normY * cssHeight;
        } else {
          // Fully formed & Scroll-Scrubbed Particle Morphing (Hero Right -> About Left)
          const shimmerX = Math.sin(elapsed * data.twinkleSpeed[i] + data.twinklePhase[i]) * 0.35;
          const shimmerY = Math.cos(elapsed * data.twinkleSpeed[i] * 0.8 + data.twinklePhase[i]) * 0.35;

          // Orbiting Cosmic Arc Swirl Offset during scroll transition
          const swirlX =
            Math.sin(M * Math.PI * 2 + data.twinklePhase[i]) *
            data.curveAmp[i] *
            arcFactor *
            120;
          const swirlY =
            Math.cos(M * Math.PI * 2 + data.twinklePhase[i]) *
            data.curveAmp[i] *
            arcFactor *
            120;

          // Continuous Interpolation from Target 1 to Target 2
          const normX = (1 - M) * heroNormX + M * aboutNormX;
          const normY = (1 - M) * heroNormY + M * aboutNormY;

          currX = normX * cssWidth + shimmerX + swirlX;
          currY = normY * cssHeight + shimmerY + swirlY;
        }

        // Apply scroll dispersal shift if scrolled past About section
        if (dispersal > 0) {
          const explodeAngle = (i / count) * Math.PI * 2 + data.twinklePhase[i];
          currX += Math.cos(explodeAngle) * dispersal * cssWidth * 0.6;
          currY += Math.sin(explodeAngle) * dispersal * cssHeight * 0.6;
        }

        // Parallax offset
        currX += parallaxX * (0.5 + data.targetY1[i] * 0.5);
        currY += parallaxY * (0.5 + data.targetY1[i] * 0.5);

        // Alpha calculation & twinkling
        let alpha = data.baseAlpha[i];
        if (progress === 1) {
          alpha += Math.sin(elapsed * data.twinkleSpeed[i] + data.twinklePhase[i]) * 0.18;
          alpha = Math.max(0.15, Math.min(1, alpha));
        } else {
          alpha *= Math.max(0.2, progress);
        }

        if (dispersal > 0) {
          alpha *= Math.max(0, 1 - dispersal * 0.8);
        }

        if (alpha <= 0.01) continue;

        const renderX = currX * dpr;
        const renderY = currY * dpr;
        const renderRadius = data.size[i] * dpr;

        // Group into alpha bucket for single-pass drawing
        const bucketIndex = Math.min(
          ALPHA_BUCKETS_COUNT - 1,
          Math.max(0, Math.floor(alpha * ALPHA_BUCKETS_COUNT))
        );

        const path = batchPaths[bucketIndex];
        path.moveTo(renderX + renderRadius, renderY);
        path.arc(renderX, renderY, renderRadius, 0, Math.PI * 2);
      }

      // Execute Batched Draw Calls (Only 10 fill calls per frame)
      for (let b = 0; b < ALPHA_BUCKETS_COUNT; b++) {
        ctx.fillStyle = ALPHA_STYLES[b];
        ctx.fill(batchPaths[b]);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      intersectionObserver.disconnect();
      unsubscribeScroll();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [imageLoaded, ready]);

  return (
    <div ref={containerRef} className="portrait-particle-fixed-wrapper">
      <canvas ref={canvasRef} className="portrait-particle-canvas" />
    </div>
  );
}
