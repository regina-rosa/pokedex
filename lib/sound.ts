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
  // Rounded attack and a long release so held notes breathe instead of clicking.
  const attack = Math.min(0.06, duration * 0.25);
  const release = Math.min(0.25, duration * 0.45);
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + attack);
  gain.gain.setValueAtTime(volume, startAt + duration - release);
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

/**
 * "Home Town" — an original composition, not an arrangement of any game music.
 * It aims for the same unhurried, nostalgic mood as a starting-town theme:
 * slow tempo, warm major key, soft triangle lead over rocking arpeggios.
 */
const C3 = 130.81, F3 = 174.61, G3 = 196.0, A3 = 220.0, B3 = 246.94;
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.0, A4 = 440.0, B4 = 493.88;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880.0;

type Chord = { bass: number; notes: number[] };

// Eight bars of I - V - vi - IV - I - V - IV - V in C major.
const PROGRESSION: Chord[] = [
  { bass: C3, notes: [C4, E4, G4] },
  { bass: G3, notes: [B3, D4, G4] },
  { bass: A3, notes: [A3, C4, E4] },
  { bass: F3, notes: [F3, A3, C4] },
  { bass: C3, notes: [C4, E4, G4] },
  { bass: G3, notes: [B3, D4, G4] },
  { bass: F3, notes: [F3, A3, C4] },
  { bass: G3, notes: [B3, D4, G4] },
];

// One entry per bar: the melody phrase played over that chord, as [note, beats].
const MELODY: [number, number][][] = [
  [[E4, 1], [G4, 1], [C5, 2]],
  [[D5, 1], [B4, 1], [G4, 2]],
  [[A4, 1], [C5, 1], [E5, 2]],
  [[D5, 1], [C5, 1], [A4, 2]],
  [[E5, 1], [G5, 1], [A5, 2]],
  [[G5, 1], [E5, 1], [D5, 2]],
  [[C5, 1], [A4, 1], [F4, 2]],
  [[G4, 2], [C5, 2]],
];

const BEAT = 0.55; // roughly 109 bpm — walking pace, not marching
const BEATS_PER_BAR = 4;

function scheduleLoop() {
  const ctx = getContext();
  if (!ctx || !musicGain) return;

  const start = ctx.currentTime + 0.1;

  PROGRESSION.forEach((chord, bar) => {
    const barStart = start + bar * BEATS_PER_BAR * BEAT;

    note(ctx, chord.bass, barStart, BEAT * 3.6, "sine", 0.22, musicGain!);

    // Rocking arpeggio underneath: low, high, middle, high.
    const pattern = [chord.notes[0], chord.notes[2], chord.notes[1], chord.notes[2]];
    pattern.forEach((frequency, step) => {
      note(
        ctx,
        frequency,
        barStart + step * BEAT,
        BEAT * 0.8,
        "sine",
        0.07,
        musicGain!
      );
    });

    let melodyCursor = barStart;
    for (const [frequency, beats] of MELODY[bar]) {
      note(
        ctx,
        frequency,
        melodyCursor,
        beats * BEAT * 0.92,
        "triangle",
        0.13,
        musicGain!
      );
      melodyCursor += beats * BEAT;
    }
  });

  const loopLength = PROGRESSION.length * BEATS_PER_BAR * BEAT * 1000;
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
