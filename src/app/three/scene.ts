import * as THREE from "three";
import {
  createBox,
  createGroundPlane,
  createIcosahedron,
  createLights,
  createSphere,
  createStarLayers,
  createTorus,
  type Disposable,
} from "./objects";
import { WorldField, type WorldId } from "./worlds";

/** How far the camera travels along -Z across the full page scroll. */
const CAMERA_TRAVEL = 300;
const CAMERA_START_Z = 30;


export type SceneProgress = (fraction: number) => void;

export class PortfolioScene {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;

  private renderer: THREE.WebGLRenderer;
  private disposables: Disposable[] = [];
  private stars: THREE.Points[] = [];
  private spinners: THREE.Object3D[] = [];
  private world: WorldField;
  private clock = new THREE.Clock();

  /** Scroll progress, 0 → 1. Written by the host, read in render(). */
  private progress = 0;
  /** Eased follower so the camera glides instead of snapping. */
  private easedProgress = 0;

  constructor(canvas: HTMLCanvasElement, onProgress?: SceneProgress) {
    const step = (n: number) => onProgress?.(n);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0f0f0f, 0.0055);
    step(0.08);

    this.camera = new THREE.PerspectiveCamera(
      72,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, CAMERA_START_Z);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0f0f0f, 1);
    step(0.22);

    // Stars ---------------------------------------------------
    const { points, disposables: starDisposables } = createStarLayers();
    for (const layer of points) this.scene.add(layer);
    this.stars = points;
    this.disposables.push(...starDisposables);
    step(0.42);

    // Solids --------------------------------------------------
    const torus = createTorus();
    const sphere = createSphere();
    const ico = createIcosahedron();
    const box = createBox();
    const ground = createGroundPlane();

    for (const item of [torus, sphere, ico, box, ground]) {
      this.scene.add(item.mesh);
      this.disposables.push(item.disposable);
    }

    this.spinners = [torus.mesh, ico.mesh, box.mesh];
    step(0.68);

    // The per-profile world ---------------------------------
    this.world = new WorldField();
    this.world.setViewport(window.innerHeight, Math.min(window.devicePixelRatio, 2));
    this.scene.add(this.world.points);

    // Lights --------------------------------------------------
    for (const light of createLights()) this.scene.add(light);

    /* No bloom pass. A star field this dense blurs into a flat grey
       haze over the whole frame, which destroys the near-black ground
       the palette depends on. The scene renders straight instead. */
    step(1);
  }

  /** Rearrange the background for a profile; instant skips the morph. */
  setWorld(id: WorldId, instant = false) {
    this.world.setWorld(id, instant);
  }

  setProgress(progress: number) {
    this.progress = progress;
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h);
    this.world.setViewport(h, dpr);
  }

  /** One frame. `animate` false renders a single static frame. */
  render(animate = true) {
    const delta = this.clock.getDelta();

    // Ease toward the real scroll position; framerate-independent.
    const lerp = animate ? 1 - Math.pow(0.001, delta) : 1;
    this.easedProgress += (this.progress - this.easedProgress) * lerp;

    const p = this.easedProgress;
    this.camera.position.z = CAMERA_START_Z - p * CAMERA_TRAVEL;
    this.camera.position.x = Math.sin(p * Math.PI * 2) * 6;
    this.camera.position.y = Math.sin(p * Math.PI * 3) * 2.5;
    this.camera.rotation.y = -p * 0.35;

    if (animate) {
      const t = this.clock.elapsedTime;

      for (const mesh of this.spinners) {
        mesh.rotation.x += delta * 0.12;
        mesh.rotation.y += delta * 0.16;
      }

      // Stars counter-rotate very slowly for depth.
      const drift = [0.006, -0.004, 0.002];
      this.stars.forEach((layer, i) => {
        layer.rotation.y = t * drift[i];
      });

      this.world.update(delta, t);
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    for (const { geometry, material } of this.disposables) {
      geometry.dispose();
      material.dispose();
    }
    this.disposables = [];
    this.world.dispose();
    this.spinners = [];
    this.stars = [];

    this.renderer.dispose();
    this.scene.clear();
  }
}
