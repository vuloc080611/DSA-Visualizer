"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HeroLiveWidget() {
  const [array, setArray] = useState<number[]>([42, 18, 77, 29, 65, 12, 88, 34, 53]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Auto-run gentle demo sorting simulation
  const handleShuffle = () => {
    setIsRunning(false);
    setActiveIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setArray(Array.from({ length: 9 }, () => Math.floor(Math.random() * 80) + 15));
  };

  const handleRunDemoSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setSortedIndices([]);

    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await new Promise((r) => setTimeout(r, 120));

        if (arr[j] > arr[j + 1]) {
          setSwappingIndices([j, j + 1]);
          const tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          setArray([...arr]);
          await new Promise((r) => setTimeout(r, 160));
          setSwappingIndices([]);
        }
      }
      setSortedIndices((prev) => [...prev, n - 1 - i]);
    }
    setSortedIndices(Array.from({ length: n }, (_, k) => k));
    setActiveIndices([]);
    setIsRunning(false);
  };

  // Run automatically on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRunDemoSort();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const maxVal = Math.max(...array, 100);

  return (
    <div className="relative mx-auto max-w-xl p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md shadow-xl space-y-3 group hover:border-emerald-500/40 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>Mô phỏng tức thì: Quick Bubble Sort Demo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShuffle}
            disabled={isRunning}
            className="p-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Trộn lại</span>
          </button>
          <button
            onClick={handleRunDemoSort}
            disabled={isRunning}
            className="p-1 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>{isRunning ? "Đang chạy..." : "Chạy demo"}</span>
          </button>
        </div>
      </div>

      {/* Mini Bars */}
      <div className="h-28 w-full flex items-end justify-center gap-2 sm:gap-2.5 px-3 py-2 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800/80 overflow-hidden">
        {array.map((val, idx) => {
          const isSorted = sortedIndices.includes(idx);
          const isSwapping = swappingIndices.includes(idx);
          const isHighlight = activeIndices.includes(idx);

          let barBg = "bg-slate-300 dark:bg-slate-700";
          if (isSorted) barBg = "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/20";
          else if (isSwapping) barBg = "bg-gradient-to-t from-rose-600 to-rose-400 shadow-md shadow-rose-500/25";
          else if (isHighlight) barBg = "bg-gradient-to-t from-amber-500 to-amber-300 shadow-md shadow-amber-500/20";

          const hPercent = Math.max((val / maxVal) * 90, 16);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full max-w-[36px]">
              <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-0.5">
                {val}
              </span>
              <motion.div
                layout
                style={{ height: `${hPercent}%` }}
                className={`w-full rounded-t-md transition-colors duration-150 ${barBg}`}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
