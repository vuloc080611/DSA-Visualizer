"use client";

import { Step, Algorithm } from "@/lib/types";
import { ComplexityBadge } from "./ComplexityBadge";
import { Trophy, Activity, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CompareCanvasProps {
  algorithm: Algorithm;
  currentStep: Step;
  stepIndex: number;
  totalSteps: number;
  isFinished: boolean;
  isWinner?: boolean;
  rank?: number | null;
  side?: "left" | "right";
  laneIndex?: number;
}

export function CompareCanvas({
  algorithm,
  currentStep,
  stepIndex,
  totalSteps,
  isFinished,
  isWinner = false,
  rank = null,
  side,
  laneIndex = 0,
}: CompareCanvasProps) {
  const array = currentStep.array || [];
  const minVal = Math.min(...array, 0);
  const maxVal = Math.max(...array, 100);
  const range = maxVal - minVal || 100;
  const canvasHeight = 160;

  const progressPercent = totalSteps > 1 ? Math.round(((stepIndex + 1) / totalSteps) * 100) : 0;

  // Lane badge styling
  const LANE_STYLES = [
    { label: "1", bg: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", bar: "bg-blue-500" },
    { label: "2", bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", bar: "bg-emerald-500" },
    { label: "3", bg: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300", bar: "bg-purple-500" },
    { label: "4", bg: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", bar: "bg-amber-500" },
  ];
  const laneStyle = LANE_STYLES[laneIndex % LANE_STYLES.length];

  const getRankBadge = () => {
    if (rank === 1 || isWinner) {
      return (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-400 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1 z-20 animate-bounce">
          <Trophy className="w-3.5 h-3.5 fill-slate-950" />
          <span>HẠNG 1 (VÔ ĐỊCH) 🥇</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-slate-300 to-slate-200 text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1 z-20">
          <span>HẠNG 2 (Á QUÂN) 🥈</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-700 to-amber-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1 z-20">
          <span>HẠNG 3 (QUÝ QUÂN) 🥉</span>
        </div>
      );
    }
    if (rank === 4) {
      return (
        <div className="absolute top-0 right-0 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1 z-20">
          <span>HẠNG 4</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-300 flex flex-col justify-between overflow-hidden",
        rank === 1 || isWinner
          ? "border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10"
          : isFinished
          ? "border-emerald-300/60 dark:border-emerald-800/60"
          : "border-slate-200 dark:border-slate-800"
      )}
    >
      {/* Rank / Winner Banner Ribbon */}
      {getRankBadge()}

      {/* Header Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between pr-24">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center font-mono",
                laneStyle.bg
              )}
            >
              #{laneIndex + 1}
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
              {algorithm.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <ComplexityBadge label="Avg" value={algorithm.complexity.average} />
          </div>
        </div>

        {/* Real-time Counters */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              So sánh:
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {currentStep.comparisons ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ArrowLeftRight className="w-3.5 h-3.5 text-rose-500" />
              Hoán đổi:
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {currentStep.swaps ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Array Bars Visualization Canvas */}
      <div className="relative w-full h-[180px] rounded-xl bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 px-2 pt-6 pb-2 flex items-end justify-center gap-1 overflow-hidden select-none">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {array.map((value, idx) => {
          const isSorted = currentStep.sorted?.includes(idx);
          const isSwapping = currentStep.swapping?.includes(idx);
          const isHighlight = currentStep.highlights?.includes(idx);
          const isPivot = currentStep.pivot === idx;

          const normalizedHeight = Math.max(
            Math.round(((value - Math.min(0, minVal)) / range) * (canvasHeight - 35)) + 14,
            10
          );

          let barBg = "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
          if (isSorted) {
            barBg = "bg-gradient-to-t from-emerald-600 to-emerald-400 text-white shadow-sm";
          } else if (isSwapping) {
            barBg = "bg-gradient-to-t from-rose-600 to-rose-400 text-white shadow-sm";
          } else if (isPivot) {
            barBg = "bg-gradient-to-t from-purple-600 to-purple-400 text-white shadow-sm";
          } else if (isHighlight) {
            barBg = "bg-gradient-to-t from-amber-500 to-amber-300 text-slate-900 shadow-sm";
          }

          return (
            <motion.div
              layout
              key={idx}
              animate={
                isSwapping
                  ? { y: -8, scale: 1.05 }
                  : isHighlight
                  ? { y: -3 }
                  : { y: 0, scale: 1 }
              }
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="flex-1 flex flex-col items-center justify-end h-full max-w-[28px] min-w-[4px]"
            >
              <div
                style={{ height: `${normalizedHeight}px` }}
                className={cn(
                  "w-full rounded-t transition-all duration-150 flex items-center justify-center",
                  barBg,
                  isSwapping && "shadow-lg shadow-rose-500/50 ring-1 ring-rose-400"
                )}
              >
                {array.length <= 15 && (
                  <span className="text-[9px] font-mono font-bold leading-none hidden sm:block">
                    {value}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress & Step Description Footer */}
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>
            {isFinished ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Về đích
              </span>
            ) : (
              <span>Đang đua...</span>
            )}
          </span>
          <span>
            {stepIndex + 1} / {totalSteps} ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className={cn(
              "h-full transition-all duration-150",
              rank === 1
                ? "bg-amber-400"
                : isFinished
                ? "bg-emerald-500"
                : laneStyle.bar
            )}
          />
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate h-4 font-medium">
          {currentStep.description}
        </p>
      </div>
    </div>
  );
}
