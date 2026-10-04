/* A head and neck sculpted from signed distance fields, then sampled as a
   stippled point cloud.

   Object space: y up, z toward the viewer, x to the subject's left.
   The crown sits at y ≈ 1.04, the chin at y ≈ -0.96 and the neck is cut
   flat at y = -1.5, so the whole bust is about 2.55 units tall.

   Tone is carried by dot COUNT, not dot brightness: white dots on a dark
   ground read lit where they crowd and shadowed where they thin out. */

export type HeadCloud = {
  /** Surface points, xyz interleaved. */
  positions: Float32Array;
  /** Unit surface normals, xyz interleaved. */
  normals: Float32Array;
  /** 0 → 1 baked light × occlusion, used for per-dot alpha. */
  shade: Float32Array;
  count: number;
};

/* Key light from the upper left, raking enough across the face that the
   far cheek, the eye sockets and the underside of the jaw fall away. */
const LIGHT = normalize3(-0.62, 0.5, 0.6);

/* The widest turn the renderer ever applies (idle sway plus cursor lean).
   Points that face away at every angle inside it are never seen, so they
   are not sampled; every dot goes to a visible surface. */
const MAX_YAW = 0.95;

const NECK_CUT_Y = -1.5;

/* Sampling volume, padded around the bust. */
const BOX = {
  minX: -0.9, maxX: 0.9,
  minY: NECK_CUT_Y - 0.02, maxY: 1.1,
  minZ: -1.0, maxZ: 1.05,
};

/* ---------------------------------------------------------------
   Distance primitives (inlined scalar maths, no allocation)
   --------------------------------------------------------------- */

function sphere(px: number, py: number, pz: number, cx: number, cy: number, cz: number, r: number) {
  const dx = px - cx;
  const dy = py - cy;
  const dz = pz - cz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - r;
}

/* Inigo Quilez's bound for an ellipsoid: not exact, but monotonic and
   close enough near the surface for projection to converge. */
function ellipsoid(
  px: number, py: number, pz: number,
  cx: number, cy: number, cz: number,
  rx: number, ry: number, rz: number
) {
  const x = (px - cx) / rx;
  const y = (py - cy) / ry;
  const z = (pz - cz) / rz;
  const k0 = Math.sqrt(x * x + y * y + z * z);
  const x1 = x / rx;
  const y1 = y / ry;
  const z1 = z / rz;
  const k1 = Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);
  return k1 === 0 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
}

function capsule(
  px: number, py: number, pz: number,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  r: number
) {
  const pax = px - ax;
  const pay = py - ay;
  const paz = pz - az;
  const bax = bx - ax;
  const bay = by - ay;
  const baz = bz - az;
  const h = Math.min(
    1,
    Math.max(0, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz))
  );
  const dx = pax - bax * h;
  const dy = pay - bay * h;
  const dz = paz - baz * h;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - r;
}

/* Polynomial smooth union / intersection. */
function smin(a: number, b: number, k: number) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

function smax(a: number, b: number, k: number) {
  return -smin(-a, -b, k);
}

/* ---------------------------------------------------------------
   The sculpt
   --------------------------------------------------------------- */

export function headSdf(px: number, py: number, pz: number): number {
  // Paired features are modelled once and mirrored.
  const ax = Math.abs(px);

  // Cranium and the front mass of the face
  let d = ellipsoid(px, py, pz, 0, 0.22, -0.06, 0.74, 0.82, 0.88);
  d = smin(d, ellipsoid(px, py, pz, 0, -0.22, 0.16, 0.6, 0.72, 0.66), 0.25);

  // Jaw tapering into the chin, with a defined angle below each ear
  d = smin(d, ellipsoid(px, py, pz, 0, -0.6, 0.12, 0.47, 0.36, 0.52), 0.2);
  d = smin(d, ellipsoid(ax, py, pz, 0.43, -0.58, -0.02, 0.13, 0.2, 0.2), 0.14);
  d = smin(d, capsule(ax, py, pz, 0.43, -0.7, 0.0, 0.12, -0.86, 0.36, 0.07), 0.12);
  d = smin(d, ellipsoid(px, py, pz, 0, -0.83, 0.4, 0.16, 0.13, 0.15), 0.12);

  // Temples, pressed in slightly so the cranium is not a plain egg
  d = smax(d, -ellipsoid(ax, py, pz, 0.8, 0.22, 0.28, 0.12, 0.2, 0.2), 0.12);

  // Cheekbones and brow ridge
  d = smin(d, ellipsoid(ax, py, pz, 0.4, -0.08, 0.5, 0.18, 0.12, 0.18), 0.12);
  d = smin(d, ellipsoid(px, py, pz, 0, 0.17, 0.6, 0.5, 0.1, 0.16), 0.1);

  // Eye sockets, then the eyes sitting back inside them
  d = smax(d, -sphere(ax, py, pz, 0.25, 0.02, 0.75, 0.14), 0.07);
  d = smin(d, sphere(ax, py, pz, 0.25, 0.01, 0.6, 0.11), 0.03);

  // Nose: bridge, tip and the two wings
  d = smin(d, capsule(px, py, pz, 0, 0.08, 0.7, 0, -0.22, 0.9, 0.065), 0.08);
  d = smin(d, sphere(px, py, pz, 0, -0.25, 0.88, 0.085), 0.06);
  d = smin(d, ellipsoid(ax, py, pz, 0.075, -0.3, 0.8, 0.065, 0.05, 0.06), 0.04);

  // Lips, parted by a shallow groove
  d = smin(d, ellipsoid(px, py, pz, 0, -0.46, 0.72, 0.2, 0.055, 0.09), 0.05);
  d = smin(d, ellipsoid(px, py, pz, 0, -0.56, 0.7, 0.17, 0.06, 0.09), 0.05);
  d = smax(d, -ellipsoid(px, py, pz, 0, -0.505, 0.8, 0.2, 0.012, 0.1), 0.02);

  // Ears
  d = smin(d, ellipsoid(ax, py, pz, 0.76, -0.02, -0.08, 0.07, 0.22, 0.14), 0.06);

  // Neck, with the two neck muscles running from behind the ears down to
  // the notch between the collarbones
  d = smin(d, capsule(px, py, pz, 0, -0.45, -0.2, 0, -1.6, -0.1, 0.37), 0.18);
  d = smin(d, capsule(ax, py, pz, 0.5, -0.42, -0.12, 0.09, -1.45, 0.2, 0.09), 0.12);

  // Flat cut across the base of the neck
  return smax(d, NECK_CUT_Y - py, 0.05);
}

/* ---------------------------------------------------------------
   Sampling
   --------------------------------------------------------------- */

function normalize3(x: number, y: number, z: number): [number, number, number] {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

/* Tetrahedral gradient: four field evaluations instead of six. */
const EPS = 0.0015;
function gradient(px: number, py: number, pz: number, out: Float64Array) {
  const a = headSdf(px + EPS, py - EPS, pz - EPS);
  const b = headSdf(px - EPS, py - EPS, pz + EPS);
  const c = headSdf(px - EPS, py + EPS, pz - EPS);
  const e = headSdf(px + EPS, py + EPS, pz + EPS);
  const inv = 1 / (4 * EPS);
  out[0] = (a - b - c + e) * inv;
  out[1] = (-a - b + c + e) * inv;
  out[2] = (-a + b - c + e) * inv;
}

/* Soft shadow toward the light: march the field and keep the narrowest
   miss. This is what puts the nose's shadow on the cheek and the brow's
   shadow over the eyes, which normals alone cannot. */
function softShadow(px: number, py: number, pz: number, lx: number, ly: number, lz: number) {
  let res = 1;
  let t = 0.03;
  for (let i = 0; i < 24 && t < 1.6; i++) {
    const h = headSdf(px + lx * t, py + ly * t, pz + lz * t);
    if (h < 0.001) return 0;
    res = Math.min(res, (10 * h) / t);
    t += Math.max(0.02, h);
  }
  return Math.max(0, Math.min(1, res));
}

/** Sample `count` stippled surface points. Deterministic for a given seed. */
export function sculptHead(count: number, seed = 0x5eed): HeadCloud {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const shade = new Float32Array(count);

  const g = new Float64Array(3);
  const cosYaw = Math.cos(MAX_YAW);
  const sinYaw = Math.sin(MAX_YAW);
  const [lx, ly, lz] = LIGHT;

  let n = 0;
  let guard = count * 400;

  while (n < count && guard-- > 0) {
    let px = BOX.minX + rand() * (BOX.maxX - BOX.minX);
    let py = BOX.minY + rand() * (BOX.maxY - BOX.minY);
    let pz = BOX.minZ + rand() * (BOX.maxZ - BOX.minZ);

    // Keep only a thin shell around the surface. A uniform shell gives a
    // near-uniform density per unit area once projected.
    let d = headSdf(px, py, pz);
    if (Math.abs(d) > 0.05) continue;

    // Newton steps onto the zero set
    for (let k = 0; k < 3; k++) {
      gradient(px, py, pz, g);
      const len2 = g[0] * g[0] + g[1] * g[1] + g[2] * g[2];
      if (len2 === 0) break;
      const s = d / len2;
      px -= g[0] * s;
      py -= g[1] * s;
      pz -= g[2] * s;
      d = headSdf(px, py, pz);
    }
    if (Math.abs(d) > 0.003) continue;

    // The cut face at the base of the neck is never shown
    if (py < NECK_CUT_Y + 0.025) continue;

    gradient(px, py, pz, g);
    const [nx, ny, nz] = normalize3(g[0], g[1], g[2]);

    // Never visible inside the widest turn → do not spend a dot on it
    if (nz * cosYaw + Math.abs(nx) * sinYaw < -0.1) continue;

    // Light and a one-tap occlusion term: in a crease (eye socket, under
    // the nose, the lip line) the field a short step out along the normal
    // is smaller than the step, so the point is darkened.
    const lambert = Math.max(0, nx * lx + ny * ly + nz * lz);
    const occlusion = Math.min(1, Math.max(0, headSdf(px + nx * 0.08, py + ny * 0.08, pz + nz * 0.08) / 0.08));
    const shadow = lambert > 0 ? softShadow(px + nx * 0.01, py + ny * 0.01, pz + nz * 0.01, lx, ly, lz) : 0;
    const tone = Math.pow(lambert * shadow, 1.4) * (0.12 + 0.88 * occlusion * occlusion);

    // Spend the budget where a face is read: the front of the face gets
    // full weight, the crown, the back of the skull and the neck less.
    const faceWeight = pz > 0.25 && py > -1.0 && py < 0.35 ? 1 : py < -0.95 ? 0.55 : 0.45;

    // Stipple acceptance: lit surfaces keep most of their dots, shadow
    // keeps a sparse scatter so the form never breaks into holes
    if (rand() > (0.035 + 0.965 * tone) * faceWeight) continue;

    positions[n * 3] = px;
    positions[n * 3 + 1] = py;
    positions[n * 3 + 2] = pz;
    normals[n * 3] = nx;
    normals[n * 3 + 1] = ny;
    normals[n * 3 + 2] = nz;
    shade[n] = tone;
    n++;
  }

  return {
    positions: positions.subarray(0, n * 3),
    normals: normals.subarray(0, n * 3),
    shade: shade.subarray(0, n),
    count: n,
  };
}

/* Small seeded PRNG so the bust is identical on every visit. */
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
