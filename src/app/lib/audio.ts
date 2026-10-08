import { createSignal } from "./signal";

/* Ambient audio + 6-band visualiser.
   Mirrors the reference: the element is created muted, the first user
   gesture unmutes it with a volume ramp, and playback pauses whenever
   the tab is hidden. Autoplay policy is respected throughout — nothing
   ever plays before a real click. */

export const BAR_COUNT = 6;
const TRACK_SRC = "/sound/ambient.mp3";

/* TODO(shubh): drop a royalty-free ambient loop at public/sound/ambient.mp3
   and fill this in — the reference design credits its track on screen, and
   most free licences require attribution. Leave it null and the credit line
   simply does not render. */
export const MUSIC_CREDIT: {
  title: string;
  artist: string;
  url?: string;
} | null = null;

const TARGET_VOLUME = 0.7;
const RAMP_MS = 500;

/** Normalised 0→1 level per bar; the visualiser reads this. */
export const audioLevels = createSignal<number[]>(
  new Array(BAR_COUNT).fill(0.16)
);
export const audioPlaying = createSignal(false);
/** False until we know the file actually exists and decodes. */
export const audioAvailable = createSignal(true);

let element: HTMLAudioElement | null = null;
let context: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let bins: Uint8Array | null = null;
let frame = 0;
let rampTimer: number | null = null;

function ensureElement(): HTMLAudioElement {
  if (element) return element;

  const audio = new Audio();
  audio.src = TRACK_SRC;
  audio.loop = true;
  audio.volume = 0;
  audio.muted = true;
  audio.preload = "none";
  audio.crossOrigin = "anonymous";

  audio.addEventListener("error", () => {
    // No track supplied yet — hide the control rather than offering a
    // button that cannot work.
    audioAvailable.set(false);
    audioPlaying.set(false);
  });

  element = audio;
  return audio;
}

function ensureAnalyser(audio: HTMLAudioElement) {
  if (analyser) return;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return;

  try {
    context = new Ctor();
    const source = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.75;
    bins = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(context.destination);
  } catch {
    // Analyser is a nicety; playback still works without it.
    analyser = null;
  }
}

function readLevels() {
  if (!analyser || !bins) {
    frame = requestAnimationFrame(readLevels);
    return;
  }

  analyser.getByteFrequencyData(bins);

  // Fold the spectrum into BAR_COUNT bands, skipping the DC bin.
  const usable = bins.length - 2;
  const band = Math.max(1, Math.floor(usable / BAR_COUNT));
  const next: number[] = [];

  for (let i = 0; i < BAR_COUNT; i++) {
    let sum = 0;
    for (let j = 0; j < band; j++) sum += bins[2 + i * band + j] ?? 0;
    // Floor at 0.16 so the bars never collapse to nothing.
    next.push(Math.max(0.16, sum / band / 255));
  }

  audioLevels.set(next);
  frame = requestAnimationFrame(readLevels);
}

function ramp(audio: HTMLAudioElement, to: number) {
  if (rampTimer !== null) window.clearInterval(rampTimer);

  const from = audio.volume;
  const start = performance.now();

  rampTimer = window.setInterval(() => {
    const t = Math.min(1, (performance.now() - start) / RAMP_MS);
    audio.volume = from + (to - from) * t;

    if (t === 1 && rampTimer !== null) {
      window.clearInterval(rampTimer);
      rampTimer = null;
      if (to === 0) audio.pause();
    }
  }, 16);
}

/** Start playback. Must be called from a user gesture. */
export async function enableAudio(): Promise<boolean> {
  const audio = ensureElement();
  audio.preload = "auto";
  audio.muted = false;

  try {
    await audio.play();
  } catch {
    audioAvailable.set(false);
    return false;
  }

  ensureAnalyser(audio);
  await context?.resume().catch(() => {});

  ramp(audio, TARGET_VOLUME);
  audioPlaying.set(true);

  if (!frame) frame = requestAnimationFrame(readLevels);
  return true;
}

export function muteAudio() {
  if (!element) return;

  ramp(element, 0);
  audioPlaying.set(false);
  audioLevels.set(new Array(BAR_COUNT).fill(0.16));

  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

export async function toggleAudio(): Promise<boolean> {
  if (audioPlaying.get()) {
    muteAudio();
    return false;
  }
  return enableAudio();
}

/* Probe once, cheaply, so the speaker control is only offered when a
   track actually exists. Without this the button shows on a fresh clone
   and does nothing until the first click fails. */
let probed = false;

export async function probeAudio() {
  if (probed) return;
  probed = true;

  try {
    const response = await fetch(TRACK_SRC, { method: "HEAD" });
    const type = response.headers.get("content-type") ?? "";

    // A dev server happily returns index.html for a missing file, so a
    // 200 alone is not proof — check it is actually audio.
    if (!response.ok || type.includes("text/html")) audioAvailable.set(false);
  } catch {
    audioAvailable.set(false);
  }
}

/** Pause on tab blur, resume when the tab returns (if it was playing). */
export function bindAudioVisibility(): () => void {
  let wasPlaying = false;

  const onVisibility = () => {
    if (!element) return;

    if (document.visibilityState === "hidden") {
      wasPlaying = audioPlaying.get();
      element.pause();
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    } else if (wasPlaying) {
      element.play().catch(() => {});
      if (!frame) frame = requestAnimationFrame(readLevels);
    }
  };

  document.addEventListener("visibilitychange", onVisibility);
  return () => document.removeEventListener("visibilitychange", onVisibility);
}

/** Used by the game to duck the ambient bed. */
export function setAudioDucked(ducked: boolean) {
  if (!element || !audioPlaying.get()) return;
  ramp(element, ducked ? TARGET_VOLUME * 0.25 : TARGET_VOLUME);
}
