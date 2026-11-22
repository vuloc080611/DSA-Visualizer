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

// Web Audio API Synthesizer with Pitch-based Audio (tần số biến thiên theo giá trị)
let audioCtx: AudioContext | null = null;

// Map element value to pitch frequency (180 Hz to 960 Hz) using natural musical exponential scaling
export function getPitchForValue(
  value: number,
  min: number = 0,
  max: number = 100,
  minFreq: number = 180,
  maxFreq: number = 960
): number {
  const safeRange = max - min || 1;
  const normalized = Math.max(0, Math.min(1, (value - min) / safeRange));
  // Exponential frequency scale sounds natural and melodic to the human ear
  return minFreq * Math.pow(maxFreq / minFreq, normalized);
}

export function playTone(
  frequency: number = 440,
  type: OscillatorType = "sine",
  duration: number = 0.05,
  volume: number = 0.05
) {
  if (typeof window === "undefined") return;
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

    // Smooth envelope with exponential decay to prevent clicks/pops
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

export function playStepSound(
  actionType: "compare" | "swap" | "complete" | "visit" = "compare",
  values?: number[],
  min: number = 0,
  max: number = 100
) {
  if (typeof window === "undefined") return;

  if (actionType === "complete") {
    // Celebratory victory arpeggio: C5 -> E5 -> G5 -> C6
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, "triangle", 0.12, 0.06), idx * 75);
    });
    return;
  }

  // Pitch-based Audio: Sound frequency scales proportionally with active element values
  if (values && values.length > 0) {
    const primaryVal = values[0];
    const freq1 = getPitchForValue(primaryVal, min, max);

    if (actionType === "swap") {
      // Brighter triangle timbre for swaps
      playTone(freq1, "triangle", 0.055, 0.055);
      if (values.length > 1) {
        const freq2 = getPitchForValue(values[1], min, max);
        setTimeout(() => playTone(freq2, "triangle", 0.055, 0.045), 25);
      }
    } else {
      // Warm sine timbre for comparisons
      playTone(freq1, "sine", 0.045, 0.04);
      if (values.length > 1) {
        const freq2 = getPitchForValue(values[1], min, max);
        setTimeout(() => playTone(freq2, "sine", 0.035, 0.03), 20);
      }
    }
    return;
  }

  // Fallback defaults if no values provided
  switch (actionType) {
    case "compare":
      playTone(340 + Math.random() * 80, "sine", 0.04, 0.03);
      break;
    case "swap":
      playTone(550, "triangle", 0.06, 0.04);
      break;
    case "visit":
      playTone(420, "sine", 0.05, 0.03);
      break;
  }
}

// Iconic sorting verification sweep sound (Left-to-right ascending pitch sweep)
export function playCompletionSweep(array: number[]) {
  if (typeof window === "undefined" || !array.length) return;
  const min = Math.min(...array);
  const max = Math.max(...array);
  const stepDelay = Math.max(15, Math.min(40, 600 / array.length));

  array.forEach((val, idx) => {
    setTimeout(() => {
      const freq = getPitchForValue(val, min, max);
      playTone(freq, "triangle", 0.04, 0.04);
    }, idx * stepDelay);
  });

  setTimeout(() => {
    playStepSound("complete");
  }, array.length * stepDelay + 80);
}
