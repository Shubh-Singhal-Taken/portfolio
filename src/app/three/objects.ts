import * as THREE from "three";

/* ──────────────────────────────────────────────────────────
   Scene furniture. Each builder returns its mesh plus the
   geometries/materials it owns so the scene can dispose them
   deterministically on unmount.
   ────────────────────────────────────────────────────────── */

export type Disposable = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
};

/** Depth-layered star field. Three layers at different sizes read as parallax. */
export function createStarLayers(): {
  points: THREE.Points[];
  disposables: Disposable[];
} {
  const layers: Array<{ count: number; size: number; opacity: number; spread: number }> = [
    { count: 1400, size: 0.18, opacity: 0.95, spread: 260 },
    { count: 900, size: 0.32, opacity: 0.7, spread: 380 },
    { count: 500, size: 0.55, opacity: 0.45, spread: 520 },
  ];

  const points: THREE.Points[] = [];
  const disposables: Disposable[] = [];

  for (const layer of layers) {
    const positions = new Float32Array(layer.count * 3);

    for (let i = 0; i < layer.count; i++) {
      positions[i * 3] = THREE.MathUtils.randFloatSpread(layer.spread);
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(layer.spread);
      // Stars run deep along -Z so the camera keeps flying through them.
      positions[i * 3 + 2] = THREE.MathUtils.randFloat(-460, 60);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: layer.size,
      sizeAttenuation: true,
      transparent: true,
      opacity: layer.opacity,
      depthWrite: false,
    });

    const mesh = new THREE.Points(geometry, material);
    points.push(mesh);
    disposables.push({ geometry, material });
  }

  return { points, disposables };
}

/* Every solid sits off to one side of the reading column so the type
   in front of it is never fighting geometry for contrast. */

/** The wireframe torus that turns continuously past the hero. */
export function createTorus() {
  const geometry = new THREE.TorusGeometry(10, 2.6, 12, 64);
  const material = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    wireframe: true,
    emissive: 0x059400,
    emissiveIntensity: 0.06,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(-44, 10, -30);

  return { mesh, disposable: { geometry, material } satisfies Disposable };
}

/** Focal body passing the About section. */
export function createSphere() {
  const geometry = new THREE.SphereGeometry(5.6, 48, 48);
  const material = new THREE.MeshStandardMaterial({
    color: 0x272727,
    roughness: 0.8,
    metalness: 0.25,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(46, -12, -78);

  return { mesh, disposable: { geometry, material } satisfies Disposable };
}

/** Flat-shaded icosahedron near the capabilities section. */
export function createIcosahedron() {
  const geometry = new THREE.IcosahedronGeometry(6.5, 0);
  // Deliberately NOT MeshNormalMaterial: its rainbow shading is the one
  // thing that would break a strictly monochrome palette.
  const material = new THREE.MeshStandardMaterial({
    color: 0x343434,
    flatShading: true,
    roughness: 0.65,
    metalness: 0.35,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(-52, 14, -130);

  return { mesh, disposable: { geometry, material } satisfies Disposable };
}

/** Wireframe box near the projects section — the one green note. */
export function createBox() {
  const geometry = new THREE.BoxGeometry(8, 8, 8);
  const material = new THREE.MeshBasicMaterial({
    color: 0x059400,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(50, 12, -186);

  return { mesh, disposable: { geometry, material } satisfies Disposable };
}

/** Far ground grid. Sparse and faint — a horizon hint, not a surface. */
export function createGroundPlane() {
  const geometry = new THREE.PlaneGeometry(600, 600, 22, 22);
  const material = new THREE.MeshBasicMaterial({
    color: 0x2e2e2e,
    wireframe: true,
    transparent: true,
    opacity: 0.07,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, -62, -180);

  return { mesh, disposable: { geometry, material } satisfies Disposable };
}

/** One point light per section so objects light up as they are reached. */
export function createLights(): THREE.Light[] {
  const lights: THREE.Light[] = [];

  // Kept low: on a near-black ground a bright ambient flattens every
  // solid into the same grey as the sky.
  lights.push(new THREE.AmbientLight(0xffffff, 0.3));

  const directional = new THREE.DirectionalLight(0xffffff, 0.7);
  directional.position.set(4, 8, 12);
  lights.push(directional);

  // One lamp parked beside each solid, so an object lights up as the
  // camera reaches its section and falls dark again afterwards.
  const stations: Array<[number, number, number]> = [
    [-36, 14, -22],
    [38, -8, -70],
    [-44, 18, -122],
    [42, 16, -178],
    [-30, -6, -230],
    [28, 12, -276],
  ];

  for (const [x, y, z] of stations) {
    const light = new THREE.PointLight(0xffffff, 900, 130, 2);
    light.position.set(x, y, z);
    lights.push(light);
  }

  return lights;
}
