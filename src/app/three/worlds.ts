import * as THREE from "three";

/* The "world" behind each profile: one field of points that rearranges
   itself when the visitor switches lens, so the background says which
   profile they are reading.

   - software: stacked lattice layers the camera flies through, like the
     tiers of a backend
   - ai:       dense clusters, like points in an embedding space
   - iot:      sensor nodes joined by dotted links, data in transit
   - neutral:  faint extra stars (front page, case studies, 404)

   All four are laid out once from a fixed seed. Switching snapshots the
   current blend as the new start and eases toward the target on the GPU,
   so a switch mid-flight never jumps. */

export type WorldId = "neutral" | "software" | "ai" | "iot";

type Layout = {
  pos: Float32Array;
  size: Float32Array;
  alpha: Float32Array;
};

const COUNT = 2200;
const MORPH_SECONDS = 1.8;

/* Depth the camera covers across a full page scroll, from scene.ts */
const NEAR_Z = 12;
const FAR_Z = -292;

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

function blank(): Layout {
  return {
    pos: new Float32Array(COUNT * 3),
    size: new Float32Array(COUNT),
    alpha: new Float32Array(COUNT),
  };
}

function neutral(rand: () => number): Layout {
  const l = blank();
  for (let i = 0; i < COUNT; i++) {
    l.pos[i * 3] = (rand() - 0.5) * 320;
    l.pos[i * 3 + 1] = (rand() - 0.5) * 200;
    l.pos[i * 3 + 2] = FAR_Z - 30 + rand() * (NEAR_Z - FAR_Z + 30);
    l.size[i] = 0.45 + rand() * 0.55;
    l.alpha[i] = 0.18 + rand() * 0.3;
  }
  return l;
}

function software(rand: () => number): Layout {
  // Five tiers along the flight path, each a regular lattice
  const l = blank();
  const layers = 5;
  const perLayer = Math.floor(COUNT / layers);
  const cols = 22;
  const rows = Math.ceil(perLayer / cols);

  for (let i = 0; i < COUNT; i++) {
    const layer = Math.min(layers - 1, Math.floor(i / perLayer));
    const k = i - layer * perLayer;
    const c = k % cols;
    const r = Math.floor(k / cols) % rows;
    l.pos[i * 3] = (c / (cols - 1) - 0.5) * 132 + (rand() - 0.5) * 0.4;
    l.pos[i * 3 + 1] = (r / (rows - 1) - 0.5) * 76 + (rand() - 0.5) * 0.4;
    l.pos[i * 3 + 2] = -layer * 62 - 6;
    l.size[i] = 0.75;
    l.alpha[i] = 0.32;
  }
  return l;
}

function ai(rand: () => number): Layout {
  // Clusters strung along the flight path, alternating sides
  const l = blank();
  const clusters = 12;
  const centers = Array.from({ length: clusters }, (_, k) => ({
    x: (k % 2 === 0 ? -1 : 1) * (26 + rand() * 40),
    y: (rand() - 0.5) * 50,
    z: NEAR_Z - 10 - (k / (clusters - 1)) * (NEAR_Z - FAR_Z - 20),
    s: 3.5 + rand() * 5,
  }));
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  for (let i = 0; i < COUNT; i++) {
    const c = centers[i % clusters];
    const g = Math.abs(gauss());
    l.pos[i * 3] = c.x + gauss() * c.s;
    l.pos[i * 3 + 1] = c.y + gauss() * c.s;
    l.pos[i * 3 + 2] = c.z + gauss() * c.s;
    // Cores glow, outskirts fade
    l.size[i] = g < 0.6 ? 1.15 : 0.7;
    l.alpha[i] = Math.max(0.2, 0.85 - g * 0.3);
  }
  return l;
}

function iot(rand: () => number): Layout {
  const l = blank();
  const nodes = 150;
  const np: THREE.Vector3[] = [];
  for (let n = 0; n < nodes; n++) {
    np.push(
      new THREE.Vector3(
        (rand() - 0.5) * 170,
        (rand() - 0.5) * 92,
        FAR_Z + rand() * (NEAR_Z - FAR_Z)
      )
    );
  }

  // Each node links to its two nearest neighbours
  const edges: Array<[number, number]> = [];
  const seen = new Set<string>();
  for (let a = 0; a < nodes; a++) {
    const nearest = np
      .map((p, b) => ({ b, d: b === a ? Infinity : p.distanceToSquared(np[a]) }))
      .sort((x, y) => x.d - y.d)
      .slice(0, 2);
    for (const { b } of nearest) {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }
  }

  // Nodes first, bright; the rest are dots spaced along the links
  for (let n = 0; n < nodes; n++) {
    l.pos.set([np[n].x, np[n].y, np[n].z], n * 3);
    l.size[n] = 2.1;
    l.alpha[n] = 0.95;
  }

  const lengths = edges.map(([a, b]) => np[a].distanceTo(np[b]));
  const total = lengths.reduce((s, x) => s + x, 0);
  const dots = COUNT - nodes;
  let i = nodes;
  edges.forEach(([a, b], e) => {
    const share = e === edges.length - 1 ? COUNT - i : Math.round((lengths[e] / total) * dots);
    for (let k = 0; k < share && i < COUNT; k++, i++) {
      const t = (k + 0.5) / share;
      l.pos[i * 3] = np[a].x + (np[b].x - np[a].x) * t;
      l.pos[i * 3 + 1] = np[a].y + (np[b].y - np[a].y) * t;
      l.pos[i * 3 + 2] = np[a].z + (np[b].z - np[a].z) * t;
      l.size[i] = 0.5;
      l.alpha[i] = 0.4;
    }
  });
  return l;
}

const vertexShader = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec2 aSize;
  attribute vec2 aAlpha;
  attribute vec3 aSeed;

  uniform float uMix;
  uniform float uTime;
  uniform float uScale;
  uniform float uMaxSize;

  varying float vAlpha;

  void main() {
    float e = uMix * uMix * (3.0 - 2.0 * uMix);
    vec3 p = mix(aFrom, aTo, e);

    // Billow outward mid-flight, settle at both ends
    p += aSeed * sin(e * 3.14159) * 14.0;
    // A slow breath so a settled world is never perfectly still
    p.y += sin(uTime * 0.5 + aSeed.x * 12.0) * 0.3;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = -mv.z;
    gl_PointSize = min(mix(aSize.x, aSize.y, e) * uScale / depth, uMaxSize);

    // Fade with distance, and right in front of the lens
    float fade = smoothstep(260.0, 110.0, depth) * smoothstep(2.0, 12.0, depth);
    vAlpha = mix(aAlpha.x, aAlpha.y, e) * fade;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 0.18, d) * vAlpha);
  }
`;

export class WorldField {
  readonly points: THREE.Points;
  readonly geometry: THREE.BufferGeometry;
  readonly material: THREE.ShaderMaterial;

  private layouts: Record<WorldId, Layout>;
  private current: WorldId = "neutral";
  private mix = 1;

  constructor() {
    const rand = mulberry32(0x5ca1e);
    this.layouts = {
      neutral: neutral(rand),
      software: software(rand),
      ai: ai(rand),
      iot: iot(rand),
    };

    const start = this.layouts.neutral;
    const seed = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) seed[i] = (rand() - 0.5) * 2;

    const size = new Float32Array(COUNT * 2);
    const alpha = new Float32Array(COUNT * 2);
    for (let i = 0; i < COUNT; i++) {
      size[i * 2] = size[i * 2 + 1] = start.size[i];
      alpha[i * 2] = alpha[i * 2 + 1] = start.alpha[i];
    }

    this.geometry = new THREE.BufferGeometry();
    // `position` is only used for bounds; the shader reads aFrom / aTo
    this.geometry.setAttribute("position", new THREE.BufferAttribute(start.pos.slice(), 3));
    this.geometry.setAttribute("aFrom", new THREE.BufferAttribute(start.pos.slice(), 3));
    this.geometry.setAttribute("aTo", new THREE.BufferAttribute(start.pos.slice(), 3));
    this.geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 2));
    this.geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 2));
    this.geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
    // Points travel; never cull the field as a whole
    this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -140), 1e4);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMix: { value: 1 },
        uTime: { value: 0 },
        uScale: { value: 450 },
        uMaxSize: { value: 7 },
      },
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  /** Point sizes follow the drawing buffer, like three's own size attenuation. */
  setViewport(heightPx: number, pixelRatio: number) {
    this.material.uniforms.uScale.value = heightPx * pixelRatio * 0.5;
    this.material.uniforms.uMaxSize.value = 7 * pixelRatio;
  }

  setWorld(id: WorldId, instant = false) {
    if (id === this.current && (this.mix >= 1 || !instant)) return;

    const from = this.geometry.getAttribute("aFrom") as THREE.BufferAttribute;
    const to = this.geometry.getAttribute("aTo") as THREE.BufferAttribute;
    const size = this.geometry.getAttribute("aSize") as THREE.BufferAttribute;
    const alpha = this.geometry.getAttribute("aAlpha") as THREE.BufferAttribute;
    const target = this.layouts[id];

    // Snapshot where every point is right now as the new start
    const m = this.mix;
    const e = m * m * (3 - 2 * m);
    const f = from.array as Float32Array;
    const t = to.array as Float32Array;
    const s = size.array as Float32Array;
    const a = alpha.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      for (let k = 0; k < 3; k++) {
        const j = i * 3 + k;
        f[j] = instant ? target.pos[j] : f[j] + (t[j] - f[j]) * e;
        t[j] = target.pos[j];
      }
      s[i * 2] = instant ? target.size[i] : s[i * 2] + (s[i * 2 + 1] - s[i * 2]) * e;
      s[i * 2 + 1] = target.size[i];
      a[i * 2] = instant ? target.alpha[i] : a[i * 2] + (a[i * 2 + 1] - a[i * 2]) * e;
      a[i * 2 + 1] = target.alpha[i];
    }

    from.needsUpdate = true;
    to.needsUpdate = true;
    size.needsUpdate = true;
    alpha.needsUpdate = true;

    this.current = id;
    this.mix = instant ? 1 : 0;
    this.material.uniforms.uMix.value = this.mix;
  }

  update(delta: number, elapsed: number) {
    if (this.mix < 1) {
      this.mix = Math.min(1, this.mix + delta / MORPH_SECONDS);
      this.material.uniforms.uMix.value = this.mix;
    }
    this.material.uniforms.uTime.value = elapsed;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
