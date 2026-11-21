"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ALGORITHMS } from "@/lib/algorithms";
import { Step } from "@/lib/types";
import { CompareCanvas } from "@/components/CompareCanvas";
import {
  generateRandomArray,
  generateNearlySortedArray,
  generateReversedArray,
  playStepSound,
} from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Swords,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Shuffle,
  TrendingDown,
  Volume2,
  VolumeX,
  Trophy,
  ArrowRight,
  Zap,
  Info,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SORTING_ALGORITHMS = ALGORITHMS.filter((a) => a.category === "sorting");

export default function ComparePage() {
  // Algorithm selection
  const [algAId, setAlgAId] = useState("bubble-sort");
  const [algBId, setAlgBId] = useState("quick-sort");

  // Configuration
  const [arraySize, setArraySize] = useState(15);
  const [arrayType, setArrayType] = useState<"random" | "nearly" | "reversed">("random");
  const [currentBaseArray, setCurrentBaseArray] = useState<number[]>([]);

  // Steps state
  const [stepsA, setStepsA] = useState<Step[]>([]);
  const [stepsB, setStepsB] = useState<Step[]>([]);
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(150); // faster by default for race
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [winner, setWinner] = useState<"A" | "B" | "tie" | null>(null);

  const algA = SORTING_ALGORITHMS.find((a) => a.id === algAId) || SORTING_ALGORITHMS[0];
  const algB = SORTING_ALGORITHMS.find((a) => a.id === algBId) || SORTING_ALGORITHMS[4];

  // Generate base array
  const createArray = useCallback((size: number, type: "random" | "nearly" | "reversed") => {
    switch (type) {
      case "nearly":
        return generateNearlySortedArray(size);
      case "reversed":
        return generateReversedArray(size);
      case "random":
      default:
        return generateRandomArray(size, 10, 99);
    }
  }, []);

  // Initialize both algorithms with the same array
  const initRace = useCallback(
    (arr?: number[]) => {
      const baseArr = arr || currentBaseArray;
      if (baseArr.length === 0) return;

      const genA = algA.generateSteps({ array: [...baseArr] });
      const genB = algB.generateSteps({ array: [...baseArr] });

      setStepsA(genA);
      setStepsB(genB);
      setIndexA(0);
      setIndexB(0);
      setIsPlaying(false);
      setWinner(null);
    },
    [algA, algB, currentBaseArray]
  );

  // Initial load
  useEffect(() => {
    const initialArr = createArray(arraySize, arrayType);
    setCurrentBaseArray(initialArr);
    initRace(initialArr);
  }, [arraySize, arrayType, algAId, algBId, createArray, initRace]);

  // Race loop: advances both steps concurrently
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPlaying) {
      const finishedA = indexA >= stepsA.length - 1;
      const finishedB = indexB >= stepsB.length - 1;

      // Both finished
      if (finishedA && finishedB) {
        setIsPlaying(false);
      } else {
        timer = setTimeout(() => {
          // Check winner on first completion
          if (finishedA && !finishedB && !winner) {
            setWinner("A");
            confetti({ particleCount: 70, spread: 60, origin: { x: 0.3, y: 0.6 } });
          } else if (finishedB && !finishedA && !winner) {
            setWinner("B");
            confetti({ particleCount: 70, spread: 60, origin: { x: 0.7, y: 0.6 } });
          } else if (finishedA && finishedB && !winner) {
            setWinner("tie");
          }

          // Advance A if not finished
          if (!finishedA) {
            setIndexA((prev) => prev + 1);
          }
          // Advance B if not finished
          if (!finishedB) {
            setIndexB((prev) => prev + 1);
          }

          if (soundEnabled) {
            playStepSound("compare");
          }
        }, speed);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, indexA, indexB, stepsA.length, stepsB.length, speed, winner, soundEnabled]);

  // Handlers
  const handleStartPause = () => {
    if (indexA >= stepsA.length - 1 && indexB >= stepsB.length - 1) {
      // Re-run
      setIndexA(0);
      setIndexB(0);
      setWinner(null);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIndexA(0);
    setIndexB(0);
    setIsPlaying(false);
    setWinner(null);
  };

  const handleGenerateNewArray = (type: "random" | "nearly" | "reversed") => {
    setArrayType(type);
    const newArr = createArray(arraySize, type);
    setCurrentBaseArray(newArr);
    initRace(newArr);
  };

  const handleSizeChange = (newSize: number) => {
    setArraySize(newSize);
    const newArr = createArray(newSize, arrayType);
    setCurrentBaseArray(newArr);
    initRace(newArr);
  };

  // Presets
  const applyPreset = (idA: string, idB: string) => {
    setAlgAId(idA);
    setAlgBId(idB);
  };

  const currentStepA = stepsA[indexA] || { description: "" };
  const currentStepB = stepsB[indexB] || { description: "" };
  const finishedA = indexA >= stepsA.length - 1;
  const finishedB = indexB >= stepsB.length - 1;
  const bothFinished = finishedA && finishedB;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Swords className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Algorithm Race &amp; Benchmark
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            So Sánh Đối Đầu Giải Thuật
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
            Chạy đua 2 giải thuật sắp xếp cùng lúc trên cùng 1 mảng dữ liệu. Trực tiếp kiểm chứng sự chênh lệch vượt trội giữa các bậc độ phức tạp Big-O.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Gợi ý:</span>
          <button
            onClick={() => applyPreset("bubble-sort", "quick-sort")}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            Bubble vs Quick
          </button>
          <button
            onClick={() => applyPreset("merge-sort", "quick-sort")}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            Merge vs Quick
          </button>
          <button
            onClick={() => applyPreset("insertion-sort", "selection-sort")}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            Insertion vs Selection
          </button>
        </div>
      </div>

      {/* Control & Configuration Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Select Algorithm A */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Thuật toán A:
            </label>
            <select
              value={algAId}
              onChange={(e) => setAlgAId(e.target.value)}
              disabled={isPlaying}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {SORTING_ALGORITHMS.map((alg) => (
                <option key={alg.id} value={alg.id}>
                  {alg.name} ({alg.complexity.average})
                </option>
              ))}
            </select>
          </div>

          {/* VS Center Indicator */}
          <div className="md:col-span-4 flex items-center justify-center">
            {/* Big Action Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartPause}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center gap-2 transition-all hover:scale-105",
                  isPlaying
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
                    : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
                )}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{bothFinished ? "Đua lại" : "Bắt đầu cuộc đua!"}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Reset về bước đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Select Algorithm B */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Thuật toán B:
            </label>
            <select
              value={algBId}
              onChange={(e) => setAlgBId(e.target.value)}
              disabled={isPlaying}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              {SORTING_ALGORITHMS.map((alg) => (
                <option key={alg.id} value={alg.id}>
                  {alg.name} ({alg.complexity.average})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Options Row: Array Size, Array Type, Speed, Sound */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Array Size */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Số phần tử:</span>
            {[10, 15, 25, 40].map((size) => (
              <button
                key={size}
                disabled={isPlaying}
                onClick={() => handleSizeChange(size)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-mono font-semibold transition-all",
                  arraySize === size
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                )}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Array Type */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Dữ liệu:</span>
            <button
              disabled={isPlaying}
              onClick={() => handleGenerateNewArray("random")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1",
                arrayType === "random"
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              )}
            >
              <Shuffle className="w-3 h-3" />
              <span>Ngẫu nhiên</span>
            </button>
            <button
              disabled={isPlaying}
              onClick={() => handleGenerateNewArray("nearly")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1",
                arrayType === "nearly"
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              )}
            >
              <Sparkles className="w-3 h-3" />
              <span>Gần sắp xếp</span>
            </button>
            <button
              disabled={isPlaying}
              onClick={() => handleGenerateNewArray("reversed")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1",
                arrayType === "reversed"
                  ? "bg-rose-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              )}
            >
              <TrendingDown className="w-3 h-3" />
              <span>Đảo ngược</span>
            </button>
          </div>

          {/* Speed & Sound */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Tốc độ:</span>
            {[
              { label: "1x", val: 300 },
              { label: "2x", val: 150 },
              { label: "4x", val: 60 },
              { label: "Turbo", val: 25 },
            ].map((spd) => (
              <button
                key={spd.val}
                onClick={() => setSpeed(spd.val)}
                className={cn(
                  "px-2 py-1 rounded-lg font-mono font-semibold transition-all",
                  speed === spd.val
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {spd.label}
              </button>
            ))}

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 ml-1"
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Duel Battlefield (Side-by-Side Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Left Side: Algorithm A */}
        <CompareCanvas
          algorithm={algA}
          currentStep={currentStepA}
          stepIndex={indexA}
          totalSteps={stepsA.length}
          isFinished={finishedA}
          isWinner={winner === "A"}
          side="left"
        />

        {/* Right Side: Algorithm B */}
        <CompareCanvas
          algorithm={algB}
          currentStep={currentStepB}
          stepIndex={indexB}
          totalSteps={stepsB.length}
          isFinished={finishedB}
          isWinner={winner === "B"}
          side="right"
        />
      </div>

      {/* Winner Summary Report & Analysis Box */}
      {bothFinished && (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-slate-900 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <Trophy className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Kết Quả Cuộc Đua:{" "}
                <span className="text-emerald-500">
                  {winner === "A"
                    ? `${algA.name} Chiến Thắng!`
                    : winner === "B"
                    ? `${algB.name} Chiến Thắng!`
                    : "Hòa nhau!"}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thống kê hiệu năng thực tế trên mảng gồm {arraySize} phần tử.
              </p>
            </div>
          </div>

          {/* Stats Comparison Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-sans font-semibold">Chỉ số so sánh</th>
                  <th className="py-2.5 px-4 text-blue-600 dark:text-blue-400 font-bold">{algA.name}</th>
                  <th className="py-2.5 px-4 text-purple-600 dark:text-purple-400 font-bold">{algB.name}</th>
                  <th className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">Chênh lệch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">
                    Tổng số bước (Steps)
                  </td>
                  <td className="py-2.5 px-4 font-bold">{stepsA.length}</td>
                  <td className="py-2.5 px-4 font-bold">{stepsB.length}</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-500">
                    {stepsA.length < stepsB.length
                      ? `${algA.name} ít hơn ${stepsB.length - stepsA.length} bước`
                      : stepsB.length < stepsA.length
                      ? `${algB.name} ít hơn ${stepsA.length - stepsB.length} bước`
                      : "Bằng nhau"}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">
                    Số phép so sánh (Comparisons)
                  </td>
                  <td className="py-2.5 px-4 font-bold">{currentStepA.comparisons ?? 0}</td>
                  <td className="py-2.5 px-4 font-bold">{currentStepB.comparisons ?? 0}</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-500">
                    {Math.abs((currentStepA.comparisons || 0) - (currentStepB.comparisons || 0))} phép
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">
                    Số lần hoán đổi (Swaps)
                  </td>
                  <td className="py-2.5 px-4 font-bold">{currentStepA.swaps ?? 0}</td>
                  <td className="py-2.5 px-4 font-bold">{currentStepB.swaps ?? 0}</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-500">
                    {Math.abs((currentStepA.swaps || 0) - (currentStepB.swaps || 0))} lần
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">
                    Độ phức tạp trung bình (Average Big-O)
                  </td>
                  <td className="py-2.5 px-4 font-bold text-amber-500">{algA.complexity.average}</td>
                  <td className="py-2.5 px-4 font-bold text-amber-500">{algB.complexity.average}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-600 dark:text-slate-400">
                    {algA.complexity.average === algB.complexity.average
                      ? "Cùng bậc độ phức tạp"
                      : "Khác biệt bậc thời gian"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
