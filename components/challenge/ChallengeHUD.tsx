"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Flame,
  Trophy,
  Clock,
  Lightbulb,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flag,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChallengeHUDProps {
  hearts: number;
  maxHearts: number;
  score: number;
  streak: number;
  elapsedSeconds: number;
  selectedIndices: number[];
  canSwap?: boolean;
  onSwap?: () => void;
  onNoSwap?: () => void;
  onConfirmSelection?: () => void;
  onUseHint: () => void;
  onGiveUp: () => void;
  onRestart: () => void;
  isCompleted: boolean;
  isGameOver: boolean;
}

export function ChallengeHUD({
  hearts,
  maxHearts,
  score,
  streak,
  elapsedSeconds,
  selectedIndices,
  canSwap = true,
  onSwap,
  onNoSwap,
  onConfirmSelection,
  onUseHint,
  onGiveUp,
  onRestart,
  isCompleted,
  isGameOver,
}: ChallengeHUDProps) {
  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 border border-emerald-500/30 p-3 sm:p-4 shadow-xl backdrop-blur-md space-y-3 animate-in fade-in">
      {/* Top Bar: Stats, Timer & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs sm:text-sm">
        {/* Hearts Life */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-bold hidden sm:inline mr-1">Mạng sống:</span>
          {Array.from({ length: maxHearts }).map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i < hearts ? [1, 1.25, 1] : 1,
                opacity: i < hearts ? 1 : 0.25,
              }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-5 h-5 ${
                  i < hearts
                    ? "fill-rose-500 text-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    : "text-slate-600 fill-slate-800"
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-3">
          {/* XP Score */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold font-mono">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{score} XP</span>
          </div>

          {/* Streak Flame */}
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500/20 to-rose-500/20 border border-orange-500/40 text-orange-400 font-bold font-mono"
            >
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>x{streak}</span>
            </motion.div>
          )}

          {/* Timer */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onUseHint}
            disabled={isCompleted || isGameOver}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
            title="Sử dụng gợi ý (-5 XP)"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gợi ý (-5 XP)</span>
            <span className="sm:hidden">Gợi ý</span>
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Bắt đầu lại thử thách"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Action Control Buttons for Selected Elements */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Đang chọn:</span>
          {selectedIndices.length === 0 ? (
            <span className="text-slate-500 italic">Chưa chọn phần tử nào (Click trực tiếp lên cột/node)</span>
          ) : (
            <div className="flex items-center gap-1">
              {selectedIndices.map((idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold"
                >
                  [{idx}]
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action button choices */}
        <div className="flex items-center gap-2">
          {canSwap && onSwap && (
            <button
              onClick={onSwap}
              disabled={selectedIndices.length !== 2 || isCompleted || isGameOver}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-rose-500/25 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Hoán đổi cặp này</span>
            </button>
          )}

          {onNoSwap && (
            <button
              onClick={onNoSwap}
              disabled={selectedIndices.length !== 2 || isCompleted || isGameOver}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đã đúng thứ tự (Bỏ qua)</span>
            </button>
          )}

          {onConfirmSelection && (
            <button
              onClick={onConfirmSelection}
              disabled={selectedIndices.length === 0 || isCompleted || isGameOver}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Xác nhận lựa chọn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onGiveUp}
            disabled={isCompleted}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-rose-400 text-xs transition-colors cursor-pointer"
            title="Đầu hàng và xem đáp án"
          >
            <Flag className="w-3 h-3" />
            <span className="hidden sm:inline">Xem đáp án</span>
          </button>
        </div>
      </div>
    </div>
  );
}
