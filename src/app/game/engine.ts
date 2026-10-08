import * as THREE from "three";
import { initialState, type GameState, type RadarBlip } from "./types";

/* ──────────────────────────────────────────────────────────
   Space-combat engine.

   First-person cockpit. The ship always moves forward; the mouse
   steers, Q/E rolls, Shift burns boost. Enemies close in, hold a
   stand-off range and fire. Killing enough of them levels you up,
   which raises their count, speed and damage.

   Framework-free on purpose: React owns only the HUD.
   ────────────────────────────────────────────────────────── */

const BASE_SPEED = 42;
const BOOST_SPEED = 118;
const BOLT_SPEED = 320;
const ENEMY_BOLT_SPEED = 190;
const ARENA_RADIUS = 900;
const LOCK_CONE = Math.cos(THREE.MathUtils.degToRad(11));
const LOCK_RANGE = 700;
const LOCK_HOLD = 0.35;
const SHIELD_REGEN_DELAY = 2.4;
const SHIELD_REGEN_RATE = 22;
const BOOST_DRAIN = 0.42;
const BOOST_REGEN = 0.18;
const RADAR_RANGE = 900;

type Enemy = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  health: number;
  cooldown: number;
};

type Bolt = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  hostile: boolean;
};

export type EngineCallbacks = {
  onState: (state: GameState) => void;
  onBlips: (blips: RadarBlip[]) => void;
};

export class GameEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();

  private enemies: Enemy[] = [];
  private bolts: Bolt[] = [];

  private enemyGeometry: THREE.BufferGeometry;
  private enemyMaterial: THREE.Material;
  private boltGeometry: THREE.BufferGeometry;
  private playerBoltMaterial: THREE.Material;
  private enemyBoltMaterial: THREE.Material;
  private starGeometry!: THREE.BufferGeometry;
  private starMaterial!: THREE.Material;

  private keys = new Set<string>();
  private yawInput = 0;
  private pitchInput = 0;
  private fireCooldown = 0;
  private timeSinceHit = 99;
  private lockTimer = 0;
  private lockedEnemy: Enemy | null = null;
  private frame = 0;
  private running = false;

  private state: GameState = { ...initialState };

  constructor(
    private canvas: HTMLCanvasElement,
    private callbacks: EngineCallbacks
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x05070a, 1);

    this.camera = new THREE.PerspectiveCamera(
      78,
      window.innerWidth / window.innerHeight,
      0.5,
      4000
    );
    this.camera.rotation.order = "YXZ";

    this.scene.fog = new THREE.FogExp2(0x05070a, 0.0009);

    // Shared geometry/material — one allocation for every enemy and bolt.
    this.enemyGeometry = new THREE.OctahedronGeometry(3.4, 0);
    this.enemyMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a2020,
      emissive: 0x4a0000,
      emissiveIntensity: 0.8,
      flatShading: true,
      roughness: 0.5,
    });

    this.boltGeometry = new THREE.SphereGeometry(0.5, 6, 6);
    this.playerBoltMaterial = new THREE.MeshBasicMaterial({ color: 0x6effa0 });
    this.enemyBoltMaterial = new THREE.MeshBasicMaterial({ color: 0xff5a4a });

    this.buildEnvironment();
    this.bindInput();
  }

  /* ── setup ────────────────────────────────────────────── */

  private buildEnvironment() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(1, 1, 1);
    this.scene.add(key);

    const rim = new THREE.PointLight(0x3355ff, 220, 1400);
    rim.position.set(-200, 140, -300);
    this.scene.add(rim);

    const count = 5000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1)
      )
        .normalize()
        .multiplyScalar(THREE.MathUtils.randFloat(1500, 2400));

      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }

    this.starGeometry = new THREE.BufferGeometry();
    this.starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.4,
      sizeAttenuation: false,
      depthWrite: false,
    });

    this.scene.add(new THREE.Points(this.starGeometry, this.starMaterial));
  }

  private bindInput() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("resize", this.onResize);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("click", this.requestPointerLock);
  }

  private unbindInput() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("resize", this.onResize);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.canvas.removeEventListener("click", this.requestPointerLock);
  }

  private requestPointerLock = () => {
    if (this.state.status !== "playing") return;
    if (document.pointerLockElement !== this.canvas) {
      void this.canvas.requestPointerLock?.();
    }
  };

  private onKeyDown = (e: KeyboardEvent) => {
    // Escape belongs to the React shell (pause / exit).
    if (e.key === "Escape") return;
    if (this.state.status !== "playing") return;

    if (e.code === "Space") e.preventDefault();
    this.keys.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.state.status !== "playing") return;
    if (document.pointerLockElement !== this.canvas) return;

    this.yawInput -= e.movementX * 0.0016;
    this.pitchInput -= e.movementY * 0.0016;
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) this.keys.add("Space");
  };

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /* ── lifecycle ────────────────────────────────────────── */

  start() {
    this.state = { ...initialState, status: "playing" };
    this.clearEnemies();
    this.clearBolts();

    this.camera.position.set(0, 0, 0);
    this.camera.rotation.set(0, 0, 0);
    this.spawnWave();
    this.emit();

    if (!this.running) {
      this.running = true;
      this.clock.start();
      this.frame = requestAnimationFrame(this.loop);
    }
  }

  pause() {
    if (this.state.status !== "playing") return;
    this.state.status = "paused";
    this.keys.clear();
    document.exitPointerLock?.();
    this.emit();
  }

  resume() {
    if (this.state.status !== "paused") return;
    this.state.status = "playing";
    this.clock.getDelta(); // discard the paused interval
    this.emit();
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.unbindInput();
    document.exitPointerLock?.();

    this.clearEnemies();
    this.clearBolts();

    this.enemyGeometry.dispose();
    this.enemyMaterial.dispose();
    this.boltGeometry.dispose();
    this.playerBoltMaterial.dispose();
    this.enemyBoltMaterial.dispose();
    this.starGeometry.dispose();
    this.starMaterial.dispose();

    this.renderer.dispose();
    this.scene.clear();
  }

  /* ── spawning ─────────────────────────────────────────── */

  /** How many hostiles the arena holds at the current level. */
  private enemyBudget() {
    return Math.min(2 + this.state.level, 9);
  }

  private spawnWave() {
    const count = this.enemyBudget();
    for (let i = 0; i < count; i++) this.spawnEnemy();
  }

  private spawnEnemy() {
    const mesh = new THREE.Mesh(this.enemyGeometry, this.enemyMaterial);

    const direction = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(2),
      THREE.MathUtils.randFloatSpread(1.2),
      THREE.MathUtils.randFloatSpread(2)
    ).normalize();

    mesh.position
      .copy(this.camera.position)
      .add(direction.multiplyScalar(THREE.MathUtils.randFloat(480, 900)));

    this.scene.add(mesh);
    this.enemies.push({
      mesh,
      velocity: new THREE.Vector3(),
      health: 2 + Math.floor(this.state.level / 3),
      cooldown: THREE.MathUtils.randFloat(1, 3),
    });
  }

  private clearEnemies() {
    for (const enemy of this.enemies) this.scene.remove(enemy.mesh);
    this.enemies = [];
    this.lockedEnemy = null;
  }

  private clearBolts() {
    for (const bolt of this.bolts) this.scene.remove(bolt.mesh);
    this.bolts = [];
  }

  private spawnBolt(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    hostile: boolean
  ) {
    const mesh = new THREE.Mesh(
      this.boltGeometry,
      hostile ? this.enemyBoltMaterial : this.playerBoltMaterial
    );
    mesh.position.copy(origin);
    mesh.scale.setScalar(hostile ? 1.4 : 1.1);
    this.scene.add(mesh);

    this.bolts.push({
      mesh,
      velocity: direction
        .clone()
        .normalize()
        .multiplyScalar(hostile ? ENEMY_BOLT_SPEED : BOLT_SPEED),
      life: 3.2,
      hostile,
    });
  }

  /* ── frame ────────────────────────────────────────────── */

  private loop = () => {
    if (!this.running) return;

    const delta = Math.min(0.05, this.clock.getDelta());

    if (this.state.status === "playing") {
      this.updateFlight(delta);
      this.updateLock(delta);
      this.updateEnemies(delta);
      this.updateBolts(delta);
      this.updateSystems(delta);
      this.emitBlips();
    }

    this.renderer.render(this.scene, this.camera);
    this.frame = requestAnimationFrame(this.loop);
  };

  private updateFlight(delta: number) {
    // Keyboard steering supplements the mouse so the game is playable
    // without pointer lock.
    if (this.keys.has("ArrowLeft") || this.keys.has("KeyA")) {
      this.yawInput += 1.4 * delta;
    }
    if (this.keys.has("ArrowRight") || this.keys.has("KeyD")) {
      this.yawInput -= 1.4 * delta;
    }
    if (this.keys.has("ArrowUp") || this.keys.has("KeyW")) {
      this.pitchInput += 1.1 * delta;
    }
    if (this.keys.has("ArrowDown") || this.keys.has("KeyS")) {
      this.pitchInput -= 1.1 * delta;
    }

    this.camera.rotation.y += this.yawInput;
    this.camera.rotation.x = THREE.MathUtils.clamp(
      this.camera.rotation.x + this.pitchInput,
      -Math.PI / 2 + 0.05,
      Math.PI / 2 - 0.05
    );

    if (this.keys.has("KeyQ")) this.camera.rotation.z += 1.3 * delta;
    if (this.keys.has("KeyE")) this.camera.rotation.z -= 1.3 * delta;
    this.camera.rotation.z *= 1 - 1.6 * delta; // auto-level

    // Steering input decays rather than stopping dead — reads as inertia.
    const decay = Math.pow(0.0015, delta);
    this.yawInput *= decay;
    this.pitchInput *= decay;

    const boosting = this.keys.has("ShiftLeft") || this.keys.has("ShiftRight");
    const canBoost = boosting && this.state.boost > 0.02;

    if (canBoost) {
      this.state.boost = Math.max(0, this.state.boost - BOOST_DRAIN * delta);
    } else {
      this.state.boost = Math.min(1, this.state.boost + BOOST_REGEN * delta);
    }

    const speed = canBoost ? BOOST_SPEED : BASE_SPEED;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      this.camera.quaternion
    );
    this.camera.position.addScaledVector(forward, speed * delta);

    // Soft arena boundary: turn the ship back rather than wall it off.
    const distance = this.camera.position.length();
    if (distance > ARENA_RADIUS) {
      this.camera.position.setLength(ARENA_RADIUS);
    }

    // Fire
    this.fireCooldown -= delta;
    if (this.keys.has("Space") && this.fireCooldown <= 0) {
      this.fireCooldown = 0.16;
      const muzzle = this.camera.position
        .clone()
        .addScaledVector(forward, 4);
      this.spawnBolt(muzzle, forward, false);
    }
  }

  private updateLock(delta: number) {
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      this.camera.quaternion
    );

    let best: Enemy | null = null;
    let bestDot = LOCK_CONE;

    for (const enemy of this.enemies) {
      const toEnemy = enemy.mesh.position
        .clone()
        .sub(this.camera.position);
      const distance = toEnemy.length();
      if (distance > LOCK_RANGE) continue;

      const dot = toEnemy.normalize().dot(forward);
      if (dot > bestDot) {
        bestDot = dot;
        best = enemy;
      }
    }

    if (best && best === this.lockedEnemy) {
      this.lockTimer += delta;
    } else {
      this.lockedEnemy = best;
      this.lockTimer = 0;
    }

    const locked = Boolean(this.lockedEnemy) && this.lockTimer >= LOCK_HOLD;

    this.state.locked = locked;
    this.state.targetDistance = this.lockedEnemy
      ? Math.round(this.lockedEnemy.mesh.position.distanceTo(this.camera.position))
      : null;
  }

  private updateEnemies(delta: number) {
    const aggression = 1 + this.state.level * 0.12;

    for (const enemy of this.enemies) {
      const toPlayer = this.camera.position
        .clone()
        .sub(enemy.mesh.position);
      const distance = toPlayer.length();
      const direction = toPlayer.normalize();

      // Close to a stand-off ring, then circle.
      const desired = direction
        .clone()
        .multiplyScalar(distance > 160 ? 34 * aggression : -22);

      // A slight tangential push keeps them from queuing up in a line.
      const tangent = new THREE.Vector3()
        .crossVectors(direction, new THREE.Vector3(0, 1, 0))
        .multiplyScalar(14);

      enemy.velocity.lerp(desired.add(tangent), 1 - Math.pow(0.05, delta));
      enemy.mesh.position.addScaledVector(enemy.velocity, delta);
      enemy.mesh.lookAt(this.camera.position);
      enemy.mesh.rotation.z += delta * 0.8;

      enemy.cooldown -= delta;
      if (enemy.cooldown <= 0 && distance < 520) {
        enemy.cooldown = THREE.MathUtils.randFloat(2.6, 4.8) / aggression;

        // Enemies are not snipers. Without this cone they land every
        // shot on a straight-flying player and the run lasts seconds.
        const spread = Math.max(0.02, 0.085 - this.state.level * 0.004);
        const aim = direction
          .clone()
          .add(
            new THREE.Vector3(
              THREE.MathUtils.randFloatSpread(spread * 2),
              THREE.MathUtils.randFloatSpread(spread * 2),
              THREE.MathUtils.randFloatSpread(spread * 2)
            )
          )
          .normalize();

        this.spawnBolt(enemy.mesh.position.clone(), aim, true);
      }
    }
  }

  private updateBolts(delta: number) {
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const bolt = this.bolts[i];
      bolt.mesh.position.addScaledVector(bolt.velocity, delta);
      bolt.life -= delta;

      let consumed = false;

      if (bolt.hostile) {
        if (bolt.mesh.position.distanceTo(this.camera.position) < 4.5) {
          this.damagePlayer(5 + this.state.level * 0.8);
          consumed = true;
        }
      } else {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          if (bolt.mesh.position.distanceTo(enemy.mesh.position) > 6) continue;

          enemy.health -= 1;
          consumed = true;

          if (enemy.health <= 0) {
            this.scene.remove(enemy.mesh);
            this.enemies.splice(j, 1);
            if (this.lockedEnemy === enemy) this.lockedEnemy = null;
            this.registerKill();
          }
          break;
        }
      }

      if (consumed || bolt.life <= 0) {
        this.scene.remove(bolt.mesh);
        this.bolts.splice(i, 1);
      }
    }
  }

  private updateSystems(delta: number) {
    this.timeSinceHit += delta;

    if (
      this.timeSinceHit > SHIELD_REGEN_DELAY &&
      this.state.shield < this.state.maxShield
    ) {
      this.state.shield = Math.min(
        this.state.maxShield,
        this.state.shield + SHIELD_REGEN_RATE * delta
      );
    }

    // Keep the arena populated.
    if (this.enemies.length < this.enemyBudget()) this.spawnEnemy();

    this.state.enemiesAlive = this.enemies.length;
    this.emit();
  }

  private damagePlayer(amount: number) {
    this.timeSinceHit = 0;

    const absorbed = Math.min(this.state.shield, amount);
    this.state.shield -= absorbed;

    const through = amount - absorbed;
    if (through > 0) this.state.hull = Math.max(0, this.state.hull - through);

    if (this.state.hull <= 0) {
      this.state.status = "over";
      this.keys.clear();
      document.exitPointerLock?.();
    }
  }

  private registerKill() {
    this.state.kills += 1;
    this.state.score += 100 * this.state.level;

    if (this.state.kills >= this.state.killsToNext) {
      this.state.level += 1;
      this.state.kills = 0;
      this.state.killsToNext = 4 + this.state.level;
      // Levelling patches the hull a little — the reward for pushing on.
      this.state.hull = Math.min(
        this.state.maxHull,
        this.state.hull + 15
      );
      this.state.shield = this.state.maxShield;
      this.spawnEnemy();
    }
  }

  /* ── output ───────────────────────────────────────────── */

  private emit() {
    this.callbacks.onState({ ...this.state });
  }

  private emitBlips() {
    const inverse = this.camera.quaternion.clone().invert();
    const blips: RadarBlip[] = [];

    for (const enemy of this.enemies) {
      const local = enemy.mesh.position
        .clone()
        .sub(this.camera.position)
        .applyQuaternion(inverse);

      const distance = local.length();
      if (distance > RADAR_RANGE) continue;

      // Top-down: local X across, local -Z ahead.
      blips.push({
        x: THREE.MathUtils.clamp(local.x / RADAR_RANGE, -1, 1),
        y: THREE.MathUtils.clamp(-local.z / RADAR_RANGE, -1, 1),
        locked: this.state.locked && this.lockedEnemy?.mesh === enemy.mesh,
      });
    }

    this.callbacks.onBlips(blips);
  }
}
