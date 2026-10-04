/* A two-armed spiral galaxy as a point cloud.

   Disc in the x-z plane, y is its (thin) thickness, radius ≈ 1. Three
   populations: a dense central bulge, two logarithmic spiral arms whose
   spread widens with radius, and a faint scattered disc between them. */

export type Galaxy = {
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  /** Distance from the centre in the disc plane, 0 → ~1. */
  radius: Float32Array;
  /** Alpha before twinkle: the core glows, the outskirts fade. */
  brightness: Float32Array;
  /** Dot radius in CSS pixels. */
  size: Float32Array;
  count: number;
};

const ARMS = 2;
const ARM_START = 0.07; // radius where the arms leave the bulge
const PITCH = 0.3; // log-spiral tightness: smaller winds tighter

export function buildGalaxy(count: number, seed = 0x6a1a): Galaxy {
  const rand = mulberry32(seed);
  const gauss = () => {
    // Box–Muller
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const g: Galaxy = {
    x: new Float32Array(count),
    y: new Float32Array(count),
    z: new Float32Array(count),
    radius: new Float32Array(count),
    brightness: new Float32Array(count),
    size: new Float32Array(count),
    count,
  };

  for (let i = 0; i < count; i++) {
    const pick = rand();
    let r: number;
    let theta: number;
    let thickness: number;
    let bright: number;

    if (pick < 0.17) {
      // Bulge: a tight gaussian knot
      r = Math.abs(gauss()) * 0.09;
      theta = rand() * Math.PI * 2;
      thickness = gauss() * 0.035;
      bright = 0.8 + rand() * 0.2;
    } else if (pick < 0.86) {
      // Arms: r = ARM_START · e^(PITCH · θ), scattered more as they open
      const arm = i % ARMS;
      r = ARM_START + Math.pow(rand(), 0.85) * (1 - ARM_START);
      theta = (arm * Math.PI * 2) / ARMS + Math.log(r / ARM_START) / PITCH;
      theta += gauss() * (0.12 + 0.1 * r);
      r += gauss() * (0.015 + 0.05 * r);
      thickness = gauss() * 0.02;
      bright = 0.45 + 0.5 * (1 - r) + rand() * 0.15;
    } else {
      // Disc: faint stars between the arms
      r = Math.sqrt(rand()) * 1.05;
      theta = rand() * Math.PI * 2;
      thickness = gauss() * 0.03;
      bright = 0.2 + rand() * 0.2;
    }

    r = Math.max(0, r);
    g.x[i] = Math.cos(theta) * r;
    g.z[i] = Math.sin(theta) * r;
    g.y[i] = thickness;
    g.radius[i] = r;
    g.brightness[i] = Math.min(1, bright);
    g.size[i] = r < 0.1 ? 0.75 + rand() * 0.35 : rand() < 0.02 ? 1.35 : 0.5 + rand() * 0.35;
  }

  return g;
}

/* Small seeded PRNG so the galaxy is identical on every visit. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
