import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate random array of numbers within [min, max]
export function generateRandomArray(size: number = 12, min: number = 10, max: number = 100): number[] {
  const result: number[] = [];
  for (let i = 0; i < size; i++) {
    result.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return result;
}

// Generate nearly sorted array
export function generateNearlySortedArray(size: number = 12): number[] {
  const arr = Array.from({ length: size }, (_, i) => Math.floor(((i + 1) * 90) / size) + 10);
  // swap 2 random adjacent elements
  const idx = Math.floor(Math.random() * (size - 1));
  [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
  return arr;
}

// Generate reversed array
export function generateReversedArray(size: number = 12): number[] {
  return Array.from({ length: size }, (_, i) => Math.floor(((size - i) * 90) / size) + 10);
}

// Web Audio API Synthesizer for delicate audio feedback (comparisons & swaps)
let audioCtx: AudioContext | null = null;

export function playTone(frequency: number = 440, type: OscillatorType = "sine", duration: number = 0.05, volume: number = 0.05) {
  if (typeof window === "undefined") return;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (!audioCtx || audioCtx.state === "suspended") {
      audioCtx?.resume();
    }
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

export function playStepSound(actionType: "compare" | "swap" | "complete" | "visit" = "compare") {
  if (typeof window === "undefined") return;
  switch (actionType) {
    case "compare":
      playTone(320 + Math.random() * 80, "sine", 0.04, 0.03);
      break;
    case "swap":
      playTone(550, "triangle", 0.06, 0.04);
      break;
    case "visit":
      playTone(400, "sine", 0.05, 0.03);
      break;
    case "complete":
      // Arpeggio
      setTimeout(() => playTone(523.25, "triangle", 0.1, 0.06), 0);
      setTimeout(() => playTone(659.25, "triangle", 0.1, 0.06), 80);
      setTimeout(() => playTone(783.99, "triangle", 0.15, 0.06), 160);
      setTimeout(() => playTone(1046.5, "triangle", 0.25, 0.08), 240);
      break;
  }
}
