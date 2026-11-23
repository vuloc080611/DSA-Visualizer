"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ALGORITHMS } from "@/lib/algorithms";
import { Step, Algorithm } from "@/lib/types";
import { CompareCanvas } from "@/components/CompareCanvas";
import {
  generateRandomArray,
  generateNearlySortedArray,
  generateReversedArray,
  playStepSound,
  playTone,
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
  Upload,
  FileText,
  Check,
  AlertCircle,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SORTING_ALGORITHMS = ALGORITHMS.filter((a) => a.category === "sorting");

interface RacerState {
  id: string;
  algorithm: Algorithm;
  steps: Step[];
  index: number;
  rank: number | null;
}

export default function ComparePage() {
  // Track Mode: 2 (1v1) or 4 (Grand Prix)
  const [trackMode, setTrackMode] = useState<2 | 4>(4);

  // Selected Algorithm IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "quick-sort",
    "merge-sort",
    "heap-sort",
    "bubble-sort",
  ]);

  // Array configuration
  const [arraySize, setArraySize] = useState(15);
  const [arrayType, setArrayType] = useState<"random" | "nearly" | "reversed">("random");
  const [currentBaseArray, setCurrentBaseArray] = useState<number[]>([]);

  // Racers state
  const [racers, setRacers] = useState<RacerState[]>([]);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(120);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const rankCounterRef = useRef<number>(1);

  // File import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedArray, setImportedArray] = useState<number[] | null>(null);
  const [importFileName, setImportFileName] = useState("");
  const [importError, setImportError] = useState("");

  // Helper to generate base array
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

  // Initialize all active racers
  const initRace = useCallback(
    (arr?: number[]) => {
      const baseArr = arr || currentBaseArray;
      if (baseArr.length === 0) return;

      const activeIds = selectedIds.slice(0, trackMode);
      const newRacers: RacerState[] = activeIds.map((id) => {
        const alg = SORTING_ALGORITHMS.find((a) => a.id === id) || SORTING_ALGORITHMS[0];
        const steps = alg.generateSteps({ array: [...baseArr] });
        return {
          id: alg.id,
          algorithm: alg,
          steps,
          index: 0,
          rank: null,
        };
      });

      setRacers(newRacers);
      setIsPlaying(false);
      rankCounterRef.current = 1;
    },
    [currentBaseArray, selectedIds, trackMode]
  );

  // Initial load or size/type change
  useEffect(() => {
    const initialArr = createArray(arraySize, arrayType);
    setCurrentBaseArray(initialArr);
    initRace(initialArr);
  }, [arraySize, arrayType, trackMode, createArray, initRace]);

  // Race Loop: Advances all active racers concurrently
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPlaying) {
      const allFinished = racers.every((r) => r.index >= r.steps.length - 1);

      if (allFinished) {
        setIsPlaying(false);
      } else {
        timer = setTimeout(() => {
          setRacers((prevRacers) => {
            const nextRacers = [...prevRacers];
            let newlyFinished = false;

            for (let i = 0; i < nextRacers.length; i++) {
              const r = nextRacers[i];
              if (r.index < r.steps.length - 1) {
                const nextIdx = r.index + 1;
                const isNowDone = nextIdx >= r.steps.length - 1;

                let assignedRank = r.rank;
                if (isNowDone && assignedRank === null) {
                  assignedRank = rankCounterRef.current;
                  rankCounterRef.current++;
                  newlyFinished = true;

                  // First place celebration
                  if (assignedRank === 1) {
                    confetti({
                      particleCount: 90,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899"],
                    });
                    if (soundEnabled) {
                      playTone(587, "sine", 0.08, 0.06);
                      setTimeout(() => playTone(880, "sine", 0.15, 0.1), 80);
                    }
                  }
                }

                nextRacers[i] = {
                  ...r,
                  index: nextIdx,
                  rank: assignedRank,
                };
              }
            }

            // Audio tick for leading racer
            if (soundEnabled && !newlyFinished) {
              const active = nextRacers.find((r) => r.index < r.steps.length - 1);
              if (active && active.steps[active.index]) {
                const step = active.steps[active.index];
                if (step.swapping?.length) {
                  playStepSound("swap");
                } else if (step.highlights?.length) {
                  playStepSound("compare");
                }
              }
            }

            return nextRacers;
          });
        }, speed);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, racers, speed, soundEnabled]);

  // Controls
  const handleStartPause = () => {
    const allFinished = racers.every((r) => r.index >= r.steps.length - 1);
    if (allFinished) {
      initRace();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    initRace();
  };

  const handleAlgChange = (laneIdx: number, newAlgId: string) => {
    const updated = [...selectedIds];
    updated[laneIdx] = newAlgId;
    setSelectedIds(updated);

    const baseArr = currentBaseArray;
    const newRacers = updated.slice(0, trackMode).map((id) => {
      const alg = SORTING_ALGORITHMS.find((a) => a.id === id) || SORTING_ALGORITHMS[0];
      const steps = alg.generateSteps({ array: [...baseArr] });
      return {
        id: alg.id,
        algorithm: alg,
        steps,
        index: 0,
        rank: null,
      };
    });
    setRacers(newRacers);
    setIsPlaying(false);
    rankCounterRef.current = 1;
  };

  const handleApplyPreset = (ids: string[]) => {
    setSelectedIds(ids);
    setTrackMode(ids.length as 2 | 4);
    const baseArr = currentBaseArray;
    const newRacers = ids.map((id) => {
      const alg = SORTING_ALGORITHMS.find((a) => a.id === id) || SORTING_ALGORITHMS[0];
      const steps = alg.generateSteps({ array: [...baseArr] });
      return {
        id: alg.id,
        algorithm: alg,
        steps,
        index: 0,
        rank: null,
      };
    });
    setRacers(newRacers);
    setIsPlaying(false);
    rankCounterRef.current = 1;
  };

  // File Upload Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setImportError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let numbers: number[] = [];

        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            numbers = parsed.filter((n) => typeof n === "number");
          } else if (parsed.array && Array.isArray(parsed.array)) {
            numbers = parsed.array.filter((n: any) => typeof n === "number");
          }
        } else {
          // CSV or TXT
          numbers = text
            .split(/[\r\n,;\s]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .map(Number)
            .filter((n) => !isNaN(n));
        }

        if (numbers.length < 4) {
          setImportError("Tệp cần chứa ít nhất 4 số hợp lệ để đua thuật toán.");
          return;
        }

        // Limit to max 40 numbers for optimal display
        const finalNumbers = numbers.slice(0, 40);
        setImportedArray(finalNumbers);
      } catch (err: any) {
        setImportError("Lỗi đọc tệp: " + (err.message || "Định dạng không hợp lệ"));
      }
    };
    reader.readAsText(file);
  };

  const handleApplyImportedData = () => {
    if (importedArray && importedArray.length >= 4) {
      setCurrentBaseArray(importedArray);
      setArraySize(importedArray.length);
      initRace(importedArray);
      setShowImportModal(false);
    }
  };

  const allFinished = racers.length > 0 && racers.every((r) => r.index >= r.steps.length - 1);
  const firstPlaceRacer = racers.find((r) => r.rank === 1);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Swords className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Grand Prix &amp; Algorithm Arena
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Đại Hội Đua Thuật Toán {trackMode === 4 ? "4 Làn" : "Đối Đầu"}</span>
            <span className="text-xs uppercase font-extrabold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              {trackMode === 4 ? "4-Way Grand Prix" : "1v1 Duel"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
            Chạy đua song song {trackMode} giải thuật sắp xếp trên cùng 1 bộ dữ liệu chuẩn. Trực tiếp kiểm chứng tốc độ thực tế và sự chênh lệch Big-O.
          </p>
        </div>

        {/* Mode Switch & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode toggle */}
          <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTrackMode(2)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                trackMode === 2
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              2 Làn (1v1)
            </button>
            <button
              onClick={() => setTrackMode(4)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                trackMode === 4
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>4 Làn (Grand Prix)</span>
            </button>
          </div>

          {/* Import File Button */}
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Nhập dữ liệu bài tập từ tệp CSV / JSON / TXT"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-500" />
            <span>Nhập File</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 mr-1">Giải đấu mẫu:</span>
        <button
          onClick={() => handleApplyPreset(["quick-sort", "merge-sort", "heap-sort", "bubble-sort"])}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-100 transition-colors"
        >
          🏁 Tứ Đại Đỉnh Cao: Quick vs Merge vs Heap vs Bubble
        </button>
        <button
          onClick={() => handleApplyPreset(["quick-sort", "merge-sort", "heap-sort", "insertion-sort"])}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
        >
          ⚡ O(N log N) So Găng: Quick vs Merge vs Heap vs Insertion
        </button>
        <button
          onClick={() => handleApplyPreset(["bubble-sort", "selection-sort", "insertion-sort", "quick-sort"])}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
        >
          🐢 Nhóm O(N²) vs Quick Sort
        </button>
      </div>

      {/* Control & Configuration Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Racer Selectors Grid */}
        <div className={cn("grid gap-3", trackMode === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2")}>
          {Array.from({ length: trackMode }).map((_, laneIdx) => {
            const laneLabels = ["Làn 1 (Xanh lam)", "Làn 2 (Lục bảo)", "Làn 3 (Tím)", "Làn 4 (Hổ phách)"];
            const currentId = selectedIds[laneIdx] || SORTING_ALGORITHMS[laneIdx]?.id;

            return (
              <div key={laneIdx} className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{laneLabels[laneIdx]}:</span>
                </label>
                <select
                  value={currentId}
                  onChange={(e) => handleAlgChange(laneIdx, e.target.value)}
                  disabled={isPlaying}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  {SORTING_ALGORITHMS.map((alg) => (
                    <option key={alg.id} value={alg.id}>
                      {alg.name} ({alg.complexity.average})
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        {/* Global Controls & Dataset Generation */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Main Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartPause}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer",
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
              )}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Tạm dừng</span>
                </>
              ) : allFinished ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Đua lại từ đầu</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>BẮT ĐẦU ĐUA (START)</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              disabled={isPlaying}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 disabled:opacity-50 transition-colors"
              title="Đặt lại mảng đua"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn(
                "p-2.5 rounded-xl border transition-colors",
                soundEnabled
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
              )}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh cuộc đua"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Dataset Generator Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Mẫu:</span>
            <button
              onClick={() => {
                setArrayType("random");
                const arr = createArray(arraySize, "random");
                setCurrentBaseArray(arr);
                initRace(arr);
              }}
              disabled={isPlaying}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <Shuffle className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
              Ngẫu nhiên
            </button>
            <button
              onClick={() => {
                setArrayType("nearly");
                const arr = createArray(arraySize, "nearly");
                setCurrentBaseArray(arr);
                initRace(arr);
              }}
              disabled={isPlaying}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
              Gần sắp xếp
            </button>
            <button
              onClick={() => {
                setArrayType("reversed");
                const arr = createArray(arraySize, "reversed");
                setCurrentBaseArray(arr);
                initRace(arr);
              }}
              disabled={isPlaying}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <TrendingDown className="w-3.5 h-3.5 inline mr-1 text-rose-500" />
              Đảo ngược
            </button>

            {/* Size Selector */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs font-mono">
              <span className="text-slate-400">N={arraySize}</span>
              {[15, 25, 40].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setArraySize(s);
                    const arr = createArray(s, arrayType);
                    setCurrentBaseArray(arr);
                    initRace(arr);
                  }}
                  disabled={isPlaying}
                  className={cn(
                    "px-2 py-0.5 rounded text-xs",
                    arraySize === s
                      ? "bg-emerald-500 text-white font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Winner Podium Banner */}
      {firstPlaceRacer && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-emerald-500/20 border-2 border-amber-400 dark:border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30">
              <Trophy className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider">
                Nhà Vô Địch Cuộc Đua (Champion 🥇)
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {firstPlaceRacer.algorithm.name} ({firstPlaceRacer.algorithm.complexity.average})
              </h2>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-300/50">
            Số phép so sánh: <strong>{firstPlaceRacer.steps[firstPlaceRacer.index]?.comparisons ?? 0}</strong> | Hoán đổi: <strong>{firstPlaceRacer.steps[firstPlaceRacer.index]?.swaps ?? 0}</strong>
          </div>
        </div>
      )}

      {/* Racers Grid: 2 columns or 4 columns */}
      <div className={cn("grid gap-5", trackMode === 4 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2")}>
        {racers.map((racer, idx) => {
          const currentStep = racer.steps[racer.index] || { description: "" };
          const isFinished = racer.index >= racer.steps.length - 1;

          return (
            <CompareCanvas
              key={`${racer.id}-${idx}`}
              algorithm={racer.algorithm}
              currentStep={currentStep}
              stepIndex={racer.index}
              totalSteps={racer.steps.length}
              isFinished={isFinished}
              isWinner={racer.rank === 1}
              rank={racer.rank}
              laneIndex={idx}
            />
          );
        })}
      </div>

      {/* Grand Prix Live Leaderboard Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Bảng Xếp Hạng &amp; Thống Kê Chi Tiết (Grand Prix Leaderboard)</span>
        </h3>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-2">Hạng</th>
                <th className="pb-2">Làn</th>
                <th className="pb-2">Thuật toán</th>
                <th className="pb-2">Độ phức tạp</th>
                <th className="pb-2">Số phép so sánh</th>
                <th className="pb-2">Số phép hoán đổi</th>
                <th className="pb-2">Tổng số bước</th>
                <th className="pb-2 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {racers.map((r, idx) => {
                const currentStep = r.steps[r.index] || {};
                const isDone = r.index >= r.steps.length - 1;

                let rankBadge = <span className="text-slate-400">Đang chạy...</span>;
                if (r.rank === 1) rankBadge = <span className="text-amber-500 font-extrabold text-sm">🥇 Hạng 1</span>;
                else if (r.rank === 2) rankBadge = <span className="text-slate-400 font-extrabold text-sm">🥈 Hạng 2</span>;
                else if (r.rank === 3) rankBadge = <span className="text-amber-700 font-extrabold text-sm">🥉 Hạng 3</span>;
                else if (r.rank === 4) rankBadge = <span className="text-slate-500 font-bold">Hạng 4</span>;

                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold">{rankBadge}</td>
                    <td className="py-2.5 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-2.5 font-sans font-bold text-slate-900 dark:text-white">{r.algorithm.name}</td>
                    <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-bold">{r.algorithm.complexity.average}</td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">{currentStep.comparisons ?? 0}</td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">{currentStep.swaps ?? 0}</td>
                    <td className="py-2.5 text-slate-500">{r.index + 1} / {r.steps.length}</td>
                    <td className="py-2.5 text-right font-sans font-semibold">
                      {isDone ? (
                        <span className="text-emerald-500">Đã về đích ✔</span>
                      ) : (
                        <span className="text-amber-500 animate-pulse">Đang đua...</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= FILE IMPORT MODAL ================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Nhập Dữ Liệu Từ File (CSV / JSON / TXT)
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kéo thả hoặc tải lên tệp bài tập thực tế từ máy tính của bạn. Hệ thống sẽ tự động trích xuất các số nguyên để đưa vào cuộc đua.
            </p>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <FileText className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {importFileName ? importFileName : "Bấm để chọn file hoặc kéo thả vào đây"}
                </span>
                <span className="text-xs text-slate-400">
                  Hỗ trợ định dạng: .csv, .json, .txt (Tối đa 40 số)
                </span>
              </label>
            </div>

            {/* Error or Preview */}
            {importError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importedArray && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <span>Trích xuất thành công: {importedArray.length} số</span>
                  <span className="text-emerald-500 font-bold">Sẵn sàng</span>
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 break-all max-h-20 overflow-y-auto">
                  [{importedArray.join(", ")}]
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyImportedData}
                disabled={!importedArray || importedArray.length < 4}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
              >
                Áp dụng vào cuộc đua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
