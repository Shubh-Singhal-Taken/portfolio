/* A realistic, anonymous head and neck sculpted from signed distance
   fields, then sampled as a stippled point cloud.

   Object space: y up, z toward the viewer, x to the subject's left.
   Proportions follow the classical thirds: hairline ≈ 0.62, brow ≈ 0.12,
   nose base ≈ -0.4, chin ≈ -0.95. The hair crown reaches y ≈ 1.12 and the
   neck is cut flat at y = -1.5.

   Tone is carried by dot COUNT, not dot brightness: white dots on a dark
   ground read lit where they crowd and shadowed where they thin out. */

export type HeadCloud = {
  /** Surface points, xyz interleaved. */
  positions: Float32Array;
  /** Unit surface normals, xyz interleaved. */
  normals: Float32Array;
  /** 0 → 1 baked light × occlusion, used for per-dot alpha. */
  shade: Float32Array;
  /** Surface material per point; see SKIN / HAIR / EYE. */
  kind: Uint8Array;
  count: number;
};

export const SKIN = 0;
export const HAIR = 1;
export const EYE = 2;

/* Key light from the upper left, raking enough across the face that the
   far cheek, the eye sockets and the underside of the jaw fall away. */
const LIGHT = normalize3(-0.6, 0.55, 0.58);

/* The widest turn the renderer ever applies while following the cursor.
   Points that face away at every angle inside it are never seen, so they
   are not sampled; every dot goes to a visible surface. */
const MAX_YAW = 0.95;

const NECK_CUT_Y = -1.5;

/* Sampling volume, padded around the bust. */
const BOX = {
  minX: -0.95, maxX: 0.95,
  minY: NECK_CUT_Y - 0.02, maxY: 1.18,
  minZ: -1.12, maxZ: 1.02,
};

/* Eyes: centre of each eyeball (mirrored on x) and its radius. */
const EYE_X = 0.25;
const EYE_Y = -0.01;
const EYE_Z = 0.6;
const EYE_R = 0.105;

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

function smoothstep(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* Distance to an axis-aligned box: a cheap lower bound used to skip a
   group of features when the point is too far away for them to change
   the result. Skipping a smooth-union feature is exact once the bound
   exceeds the current distance plus the blend radius. */
function boxDistance(
  px: number, py: number, pz: number,
  minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number
) {
  const dx = Math.max(minX - px, 0, px - maxX);
  const dy = Math.max(minY - py, 0, py - maxY);
  const dz = Math.max(minZ - pz, 0, pz - maxZ);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/* ---------------------------------------------------------------
   Skin: skull, face, ears, neck
   --------------------------------------------------------------- */

function skinSdf(px: number, py: number, pz: number): number {
  // Paired features are modelled once and mirrored.
  const ax = Math.abs(px);

  // Skull: flattened at the sides, with a bulge at the back and a forehead
  // that rises steeply before curving over, so it never reads as an egg.
  let d = ellipsoid(px, py, pz, 0, 0.28, -0.15, 0.72, 0.78, 0.86);
  d = smax(d, ax - 0.68, 0.18);
  d = smin(d, ellipsoid(px, py, pz, 0, 0.0, -0.62, 0.52, 0.45, 0.42), 0.2);
  d = smin(d, ellipsoid(px, py, pz, 0, 0.42, 0.42, 0.56, 0.36, 0.32), 0.2);
  d = smax(d, -ellipsoid(ax, py, pz, 0.74, 0.2, 0.3, 0.12, 0.2, 0.2), 0.12); // temples

  // Midface, narrower than the skull
  d = smin(d, ellipsoid(px, py, pz, 0, -0.2, 0.2, 0.56, 0.6, 0.58), 0.22);

  // Cheekbones, the arch running back toward the ear, and the soft cheek
  if (boxDistance(ax, py, pz, 0.1, 0.75, -0.7, 0.1, -0.15, 0.7) < d + 0.15) {
    d = smin(d, ellipsoid(ax, py, pz, 0.4, -0.12, 0.48, 0.17, 0.12, 0.18), 0.12);
    d = smin(d, capsule(ax, py, pz, 0.42, -0.1, 0.42, 0.64, -0.06, -0.02, 0.06), 0.1);
    d = smin(d, ellipsoid(ax, py, pz, 0.3, -0.42, 0.42, 0.2, 0.2, 0.2), 0.15);
  }

  // Jaw: the ramus down from the ear, the angle, the body to the chin
  if (boxDistance(ax, py, pz, 0, 0.75, -1.05, -0.12, -0.3, 0.6) < d + 0.18) {
    d = smin(d, ellipsoid(px, py, pz, 0, -0.62, 0.18, 0.44, 0.32, 0.42), 0.18);
    d = smin(d, capsule(ax, py, pz, 0.58, -0.28, -0.15, 0.5, -0.68, -0.08, 0.09), 0.12);
    d = smin(d, capsule(ax, py, pz, 0.5, -0.68, -0.08, 0.14, -0.9, 0.36, 0.085), 0.12);
    d = smin(d, ellipsoid(px, py, pz, 0, -0.86, 0.4, 0.17, 0.12, 0.13), 0.1);
  }

  // The face proper: brow, eyes, nose, lips
  if (boxDistance(ax, py, pz, 0, 0.5, -0.8, 0.25, 0.38, 1.02) < d + 0.08) {
    d = smin(d, ellipsoid(px, py, pz, 0, 0.13, 0.64, 0.48, 0.08, 0.14), 0.08);

    // Eye sockets
    d = smax(d, -sphere(ax, py, pz, EYE_X, 0.0, 0.76, 0.135), 0.06);

    // Eyelids: an upper lid shell over the top of the eyeball and a thinner
    // lower lid, leaving an almond-shaped opening that shows the iris
    const upperLid = Math.max(
      ellipsoid(ax, py, pz, EYE_X, EYE_Y, EYE_Z, 0.126, 0.118, 0.12),
      0.045 - py,
      0.55 - pz
    );
    const lowerLid = Math.max(
      ellipsoid(ax, py, pz, EYE_X, -0.045, 0.612, 0.116, 0.06, 0.1),
      py + 0.062,
      0.55 - pz
    );
    d = smin(d, upperLid, 0.025);
    d = smin(d, lowerLid, 0.02);

    // Nose: bridge, tip, wings, and the two nostrils
    d = smin(d, capsule(px, py, pz, 0, 0.06, 0.72, 0, -0.3, 0.93, 0.055), 0.07);
    d = smin(d, sphere(px, py, pz, 0, -0.32, 0.9, 0.075), 0.05);
    d = smin(d, ellipsoid(ax, py, pz, 0.08, -0.37, 0.8, 0.065, 0.05, 0.06), 0.04);
    d = smax(d, -sphere(ax, py, pz, 0.045, -0.415, 0.85, 0.024), 0.012);

    // Lips: a two-lobed upper lip for the cupid's bow, the lower lip, the
    // line between them, and the hollow under the lower lip
    d = smin(d, ellipsoid(ax, py, pz, 0.06, -0.53, 0.775, 0.11, 0.038, 0.065), 0.04);
    d = smin(d, ellipsoid(px, py, pz, 0, -0.615, 0.75, 0.145, 0.048, 0.07), 0.04);
    d = smax(d, -ellipsoid(px, py, pz, 0, -0.572, 0.82, 0.18, 0.009, 0.1), 0.012);
    d = smax(d, -ellipsoid(px, py, pz, 0, -0.7, 0.76, 0.12, 0.025, 0.06), 0.04);
  }

  // Ears, set close to the head with the back edge standing slightly off
  // it; each has an outer rim and a hollow bowl in front of the canal
  if (boxDistance(ax, py, pz, 0.58, 0.95, -0.45, 0.16, -0.38, 0.12) < d + 0.05) {
    const ex = ax - 0.72 + (pz + 0.12) * 0.2;
    let ear = ellipsoid(ex, py, pz, 0, -0.14, -0.13, 0.05, 0.235, 0.125);
    ear = smax(ear, -ellipsoid(ex, py, pz, 0.038, -0.17, -0.09, 0.03, 0.1, 0.055), 0.015);
    d = smin(d, ear, 0.04);
  }

  // Neck, leaning slightly forward, with the two neck muscles and the
  // larynx
  if (py < -0.15) {
    d = smin(d, capsule(px, py, pz, 0, -0.5, -0.22, 0, -1.6, -0.06, 0.33), 0.2);
    d = smin(d, capsule(ax, py, pz, 0.52, -0.42, -0.2, 0.08, -1.42, 0.2, 0.075), 0.1);
    d = smin(d, sphere(px, py, pz, 0, -1.02, 0.22, 0.05), 0.05);
  }

  // Flat cut across the base of the neck
  return smax(d, NECK_CUT_Y - py, 0.05);
}

/* ---------------------------------------------------------------
   Hair: a short cap with a hairline, clear of the ears
   --------------------------------------------------------------- */

function hairSdf(px: number, py: number, pz: number): number {
  // Nothing below the nape can be hair
  if (py < -0.62) return 10;

  const ax = Math.abs(px);

  let d = ellipsoid(px, py, pz, 0, 0.3, -0.16, 0.76, 0.84, 0.9);
  d = smax(d, ax - 0.73, 0.18);
  d = smin(d, ellipsoid(px, py, pz, 0, 0.02, -0.66, 0.56, 0.47, 0.44), 0.2);
  d = smin(d, ellipsoid(px, py, pz, 0, 0.62, -0.1, 0.66, 0.48, 0.78), 0.2);

  // Fine strand texture running front to back
  d += 0.0015 * Math.sin(px * 95 + Math.sin(pz * 7) * 2.5) * (0.6 + 0.4 * Math.sin(pz * 13 + py * 6));

  // Hairline: high at the forehead, receding at the temples, lower over
  // the sides and down to the nape at the back
  const front = smoothstep(-0.5, 0.45, pz);
  const hairline = -0.4 + (0.62 - 0.26 * (ax / 0.7) ** 2 + 0.4) * front;
  d = smax(d, hairline - py, 0.04);

  // Clear a curve over each ear
  return smax(d, -sphere(ax, py, pz, 0.72, -0.12, -0.12, 0.3), 0.06);
}

export function headSdf(px: number, py: number, pz: number): number {
  return smin(skinSdf(px, py, pz), hairSdf(px, py, pz), 0.02);
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

/* Laplacian of the field by central differences. */
const LAP_H = 0.012;
function laplacian(px: number, py: number, pz: number) {
  const c = headSdf(px, py, pz) * 6;
  const sum =
    headSdf(px + LAP_H, py, pz) + headSdf(px - LAP_H, py, pz) +
    headSdf(px, py + LAP_H, pz) + headSdf(px, py - LAP_H, pz) +
    headSdf(px, py, pz + LAP_H) + headSdf(px, py, pz - LAP_H);
  return (sum - c) / (LAP_H * LAP_H);
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

/* Which surface a point on the zero set belongs to, and how much that
   material scales the light: hair is darker and streaked, the iris and
   pupil darken the front of the eye. */
function material(px: number, py: number, pz: number): { kind: number; albedo: number } {
  const ax = Math.abs(px);

  if (hairSdf(px, py, pz) <= skinSdf(px, py, pz) + 0.002) {
    const strand = 0.5 + 0.5 * Math.sin(px * 95 + Math.sin(pz * 7) * 2.5);
    return { kind: HAIR, albedo: 0.35 + 0.45 * strand };
  }

  if (Math.abs(sphere(ax, py, pz, EYE_X, EYE_Y, EYE_Z, EYE_R)) < 0.006) {
    // Angle between this point and straight ahead, seen from the eye centre
    const [, , gz] = normalize3(ax - EYE_X, py - EYE_Y, pz - EYE_Z);
    if (gz > 0.985) return { kind: EYE, albedo: 0.05 }; // pupil
    if (gz > 0.9) return { kind: EYE, albedo: 0.32 }; // iris
    return { kind: EYE, albedo: 1.1 }; // white of the eye
  }

  // Lips sit a shade darker than the skin around them
  if (py < -0.5 && py > -0.67 && pz > 0.7 && ax < 0.2) return { kind: SKIN, albedo: 0.72 };

  return { kind: SKIN, albedo: 1 };
}

/** Sample `count` stippled surface points. Deterministic for a given seed. */
export function sculptHead(count: number, seed = 0x5eed): HeadCloud {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const shade = new Float32Array(count);
  const kind = new Uint8Array(count);

  const g = new Float64Array(3);
  const cosYaw = Math.cos(MAX_YAW);
  const sinYaw = Math.sin(MAX_YAW);
  const [lx, ly, lz] = LIGHT;

  let n = 0;
  let guard = count * 600;

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

    // Spend the budget where a face is read: the front of the face gets
    // full weight, the crown, the back of the skull and the neck less.
    const faceWeight = pz > 0.25 && py > -1.0 && py < 0.4 ? 1 : py < -0.95 ? 0.4 : 0.32;
    if (rand() > faceWeight) continue;

    // Light, cast shadow, and a one-tap occlusion term: in a crease (eye
    // socket, under the nose, the lip line) the field a short step out
    // along the normal is smaller than the step, so the point darkens.
    const lambert = Math.max(0, nx * lx + ny * ly + nz * lz);
    const occlusion = Math.min(1, Math.max(0, headSdf(px + nx * 0.08, py + ny * 0.08, pz + nz * 0.08) / 0.08));
    const shadow = lambert > 0 ? softShadow(px + nx * 0.01, py + ny * 0.01, pz + nz * 0.01, lx, ly, lz) : 0;
    const surface = material(px, py, pz);
    const tone = Math.min(
      1,
      Math.pow(lambert * shadow, 1.6) * (0.1 + 0.9 * occlusion * occlusion) * surface.albedo
    );

    // Line work: the field's Laplacian is the surface's mean curvature, so
    // it spikes along eyelid edges, the lip line, the nostrils, the rims of
    // the ears and the hairline. Those points get extra dots, the way an
    // engraver draws a feature's edge as well as shading its form.
    const crease = Math.min(1, Math.abs(laplacian(px, py, pz)) / 26);
    const line = crease * crease * (surface.kind === HAIR ? 0.35 : 1);

    // Stipple acceptance: lit surfaces keep most of their dots, shadow
    // keeps a sparse scatter so the form never breaks into holes
    if (rand() > Math.min(1, 0.03 + 0.97 * tone + 0.85 * line)) continue;

    positions[n * 3] = px;
    positions[n * 3 + 1] = py;
    positions[n * 3 + 2] = pz;
    normals[n * 3] = nx;
    normals[n * 3 + 1] = ny;
    normals[n * 3 + 2] = nz;
    shade[n] = Math.min(1, tone + line * 0.6);
    kind[n] = surface.kind;
    n++;
  }

  return {
    positions: positions.subarray(0, n * 3),
    normals: normals.subarray(0, n * 3),
    shade: shade.subarray(0, n),
    kind: kind.subarray(0, n),
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
