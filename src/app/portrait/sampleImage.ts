/* Turns the star-portrait illustration into particle targets.

   The image is read at 500 × 500, edges are found with a Sobel pass, and
   every candidate pixel gets a priority: edge strength and brightness,
   plus a bonus for the regions a face is recognised by (eyes, mouth,
   nose, jaw). The highest-priority candidates become the particles, so
   the features are guaranteed their share of the budget before the suit
   and the background get any. */

export type PortraitTargets = {
  /** Normalised 0 → 1 inside the square portrait. */
  x: Float32Array;
  y: Float32Array;
  brightness: Float32Array;
  /** 1 for eyes / nose / mouth points, which draw smaller and brighter. */
  feature: Uint8Array;
  count: number;
};

const SAMPLE = 500;
const STEP = 2;

export async function samplePortrait(src: string, maxParticles: number): Promise<PortraitTargets> {
  const img = await loadImage(src);

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE;
  canvas.height = SAMPLE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");

  ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
  const pixels = ctx.getImageData(0, 0, SAMPLE, SAMPLE).data;

  const lum = new Float32Array(SAMPLE * SAMPLE);
  const alpha = new Uint8Array(SAMPLE * SAMPLE);

  for (let i = 0; i < SAMPLE * SAMPLE; i++) {
    const o = i * 4;
    alpha[i] = pixels[o + 3];
    if (alpha[i] >= 20) {
      lum[i] = (0.299 * pixels[o] + 0.587 * pixels[o + 1] + 0.114 * pixels[o + 2]) / 255;
    }
  }

  const edge = sobel(lum, alpha);

  type Candidate = { x: number; y: number; brightness: number; weight: number; feature: boolean };
  const candidates: Candidate[] = [];

  for (let y = 1; y < SAMPLE - 1; y += STEP) {
    for (let x = 1; x < SAMPLE - 1; x += STEP) {
      const i = y * SAMPLE + x;
      if (alpha[i] < 20) continue;

      const brightness = lum[i];
      const e = edge[i];

      // Sub-pixel jitter removes the scanline grid the step would leave
      const nx = (x + (Math.random() - 0.5) * STEP * 0.95) / SAMPLE;
      const ny = (y + (Math.random() - 0.5) * STEP * 0.95) / SAMPLE;

      const isEyes = ny >= 0.18 && ny <= 0.42 && nx >= 0.26 && nx <= 0.74;
      const isMouth = ny >= 0.46 && ny <= 0.64 && nx >= 0.32 && nx <= 0.68;
      const isNose = ny >= 0.28 && ny <= 0.5 && nx >= 0.34 && nx <= 0.66;
      const isJaw = ny >= 0.48 && ny <= 0.78 && (nx <= 0.38 || nx >= 0.62);
      const isHair = ny < 0.38;
      const isBody = ny > 0.68;

      let bonus = 1;
      let feature = false;
      if (isEyes) {
        bonus = 4.5;
        feature = true;
      } else if (isMouth) {
        bonus = 4;
        feature = true;
      } else if (isNose) {
        bonus = 3.5;
        feature = true;
      } else if (isJaw) {
        bonus = 2.8;
      } else if (isHair) {
        bonus = 2;
      } else if (isBody) {
        bonus = 0.3;
      }

      if (brightness > 0.015 || e > 0.04 || bonus >= 2) {
        candidates.push({
          x: nx,
          y: ny,
          brightness,
          weight: e * 6 + brightness * 2 + bonus + Math.random() * 0.4,
          feature,
        });
      }
    }
  }

  candidates.sort((a, b) => b.weight - a.weight);

  const count = Math.min(maxParticles, candidates.length);
  const out: PortraitTargets = {
    x: new Float32Array(count),
    y: new Float32Array(count),
    brightness: new Float32Array(count),
    feature: new Uint8Array(count),
    count,
  };

  for (let i = 0; i < count; i++) {
    const c = candidates[i];
    out.x[i] = c.x;
    out.y[i] = c.y;
    out.brightness[i] = c.brightness;
    out.feature[i] = c.feature ? 1 : 0;
  }

  return out;
}

function sobel(lum: Float32Array, alpha: Uint8Array): Float32Array {
  const out = new Float32Array(SAMPLE * SAMPLE);
  const at = (x: number, y: number) => lum[y * SAMPLE + x];

  for (let y = 1; y < SAMPLE - 1; y++) {
    for (let x = 1; x < SAMPLE - 1; x++) {
      if (alpha[y * SAMPLE + x] < 20) continue;

      const gx =
        at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) -
        (at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1));
      const gy =
        at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) -
        (at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1));

      out[y * SAMPLE + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  return out;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}
