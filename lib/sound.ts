declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const STORAGE_KEY = "pokedex.sound";

type SoundKind = "tab" | "pick" | "favorite";

let context: AudioContext | null = null;
let musicGain: GainNode | null = null;
let loopTimer: ReturnType<typeof setTimeout> | null = null;
let enabled = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

export function isSoundOn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function note(
  ctx: AudioContext,
  frequency: number,
  startAt: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  destination: AudioNode
) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  // Soft attack and release so the chiptune does not click between notes.
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.02);
  gain.gain.setValueAtTime(volume, startAt + duration - 0.05);
  gain.gain.linearRampToValueAtTime(0, startAt + duration);
  oscillator.connect(gain).connect(destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

export function playSound(kind: SoundKind) {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);

  if (kind === "tab") {
    note(ctx, 880, now, 0.07, "square", 0.5, master);
  } else if (kind === "pick") {
    note(ctx, 660, now, 0.06, "square", 0.5, master);
    note(ctx, 990, now + 0.06, 0.09, "square", 0.5, master);
  } else {
    note(ctx, 784, now, 0.06, "triangle", 0.6, master);
    note(ctx, 1046, now + 0.06, 0.06, "triangle", 0.6, master);
    note(ctx, 1318, now + 0.12, 0.12, "triangle", 0.6, master);
  }
}

// A gentle four-bar loop in C major, written as [frequency, beats].
const MELODY: [number, number][] = [
  [523.25, 1], [659.25, 1], [783.99, 1], [659.25, 1],
  [587.33, 1], [698.46, 1], [880.0, 1], [698.46, 1],
  [523.25, 1], [659.25, 1], [1046.5, 1], [783.99, 1],
  [880.0, 2], [783.99, 2],
];

const BASS: [number, number][] = [
  [130.81, 2], [146.83, 2], [174.61, 2], [196.0, 2],
  [130.81, 2], [174.61, 2], [196.0, 2], [196.0, 2],
];

const BEAT = 0.34;

function scheduleLoop() {
  const ctx = getContext();
  if (!ctx || !musicGain) return;

  let cursor = ctx.currentTime + 0.1;
  for (const [frequency, beats] of MELODY) {
    note(ctx, frequency, cursor, beats * BEAT * 0.9, "square", 0.16, musicGain);
    cursor += beats * BEAT;
  }

  let bassCursor = ctx.currentTime + 0.1;
  for (const [frequency, beats] of BASS) {
    note(ctx, frequency, bassCursor, beats * BEAT * 0.9, "triangle", 0.2, musicGain);
    bassCursor += beats * BEAT;
  }

  const loopLength = (cursor - ctx.currentTime) * 1000;
  loopTimer = setTimeout(scheduleLoop, loopLength - 60);
}

export function setSoundOn(on: boolean) {
  enabled = on;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // A private window can refuse storage; the toggle still works this session.
  }

  if (!on) {
    if (loopTimer) clearTimeout(loopTimer);
    loopTimer = null;
    if (musicGain) {
      musicGain.disconnect();
      musicGain = null;
    }
    return;
  }

  const ctx = getContext();
  if (!ctx) return;
  musicGain = ctx.createGain();
  musicGain.gain.value = 0.5;
  musicGain.connect(ctx.destination);
  scheduleLoop();
}

/** Restores the saved preference without starting audio before a user gesture. */
export function primeSound() {
  enabled = isSoundOn();
}
