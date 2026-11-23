"use client";

import { useEffect } from "react";
import {
  Trophy,
  Flame,
  Clock,
  RotateCcw,
  Eye,
  Share2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Crown,
  HeartCrack,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { ChallengeStats } from "@/lib/challenge";
import { Algorithm } from "@/lib/types";

interface ChallengeVictoryModalProps {
  isOpen: boolean;
  isGameOver: boolean;
  algorithm: Algorithm;
  stats: ChallengeStats;
  onRestart: () => void;
  onSwitchToVisualizer: () => void;
}

export function ChallengeVictoryModal({
  isOpen,
  isGameOver,
  algorithm,
  stats,
  onRestart,
  onSwitchToVisualizer,
}: ChallengeVictoryModalProps) {
  useEffect(() => {
    if (isOpen && !isGameOver) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
      });
    }
  }, [isOpen, isGameOver]);

  if (!isOpen) return null;

  const accuracy =
    stats.totalActions > 0
      ? Math.round(((stats.totalActions - stats.mistakes) / stats.totalActions) * 100)
      : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const getRankBadge = () => {
    if (isGameOver) {
      return {
        label: "CHƯA HOÀN THÀNH",
        grade: "F",
        color: "text-rose-500",
        border: "border-rose-500/40",
        bg: "bg-rose-500/10",
        desc: "Bạn đã hết mạng sống! Hãy thử lại và suy nghĩ kỹ hơn ở từng bước.",
      };
    }
    switch (stats.rank) {
      case "S":
        return {
          label: "XUẤT SẮC TUYỆT ĐỐI",
          grade: "S",
          color: "text-amber-400",
          border: "border-amber-400/50",
          bg: "bg-amber-400/10",
          desc: "Đỉnh cao! Bạn giải hoàn hảo không sai một bước và không cần trợ giúp!",
        };
      case "A":
        return {
          label: "THÀNH THẠO GIẢI THUẬT",
          grade: "A",
          color: "text-emerald-400",
          border: "border-emerald-400/50",
          bg: "bg-emerald-400/10",
          desc: "Rất tốt! Bạn nắm rất vững nguyên lý hoạt động của thuật toán này.",
        };
      case "B":
        return {
          label: "ĐÃ NẮM ĐƯỢC CƠ BẢN",
          grade: "B",
          color: "text-cyan-400",
          border: "border-cyan-400/50",
          bg: "bg-cyan-400/10",
          desc: "Tốt lắm! Bạn đã giải xong, hãy thử lại để đạt hạng S nhé!",
        };
      default:
        return {
          label: "HOÀN THÀNH",
          grade: "C",
          color: "text-slate-300",
          border: "border-slate-500/50",
          bg: "bg-slate-500/10",
          desc: "Cần luyện tập thêm một chút để ghi nhớ chính xác thứ tự thao tác.",
        };
    }
  };

  const rankInfo = getRankBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center space-y-6 relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        {/* Grade Badge */}
        <div className="pt-2 flex flex-col items-center">
          <div
            className={`w-24 h-24 rounded-3xl border-2 ${rankInfo.border} ${rankInfo.bg} flex flex-col items-center justify-center shadow-lg relative`}
          >
            {isGameOver ? (
              <HeartCrack className="w-12 h-12 text-rose-500 animate-pulse" />
            ) : (
              <>
                <Crown className={`w-6 h-6 ${rankInfo.color} absolute -top-3`} />
                <span className={`text-5xl font-black font-mono ${rankInfo.color}`}>
                  {rankInfo.grade}
                </span>
              </>
            )}
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            {rankInfo.label}
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {isGameOver ? "Hết mạng sống!" : `Chinh phục ${algorithm.name}!`}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            {rankInfo.desc}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Điểm tích lũy
            </span>
            <span className="text-lg font-black font-mono text-amber-400">{stats.score} XP</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="text-slate-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Độ chính xác
            </span>
            <span className="text-lg font-black font-mono text-emerald-400">{accuracy}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="text-slate-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Combo cao nhất
            </span>
            <span className="text-lg font-black font-mono text-orange-400">x{stats.maxStreak}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Thời gian
            </span>
            <span className="text-lg font-black font-mono text-sky-400">{formatTime(stats.elapsedSeconds)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử lại để nâng hạng</span>
          </button>

          <button
            onClick={onSwitchToVisualizer}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Chuyển sang chế độ xem mô phỏng tự động</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
