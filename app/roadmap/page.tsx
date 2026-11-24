"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ROADMAP_TIERS,
  TOTAL_ROADMAP_ALGORITHMS,
  RoadmapTier,
  RoadmapBadge,
  getStoredCompletedAlgorithms,
  toggleAlgorithmCompleted,
  resetRoadmapProgress,
  calculateTierProgress,
  calculateOverallProgress,
  getAlgorithmsForTier,
  EVENT_PROGRESS_UPDATED,
} from "@/lib/roadmap";
import {
  CheckCircle2,
  Circle,
  Trophy,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Lock,
  Unlock,
  Gamepad2,
  Zap,
  Check,
  ChevronRight,
  Flame,
  LayoutGrid,
  GitCommit,
  Layers,
  ArrowDownUp,
  Network,
  Crown,
} from "lucide-react";

const BADGE_ICONS: Record<string, any> = {
  Layers: Layers,
  ArrowDownUp: ArrowDownUp,
  Network: Network,
  Crown: Crown,
};

export default function RoadmapPage() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");
  const [activeTierFilter, setActiveTierFilter] = useState<number | "all">("all");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load progress on mount and listen to storage updates
  useEffect(() => {
    setIsMounted(true);
    setCompletedIds(getStoredCompletedAlgorithms());

    const handleProgressUpdate = (e: any) => {
      if (e.detail) {
        setCompletedIds(e.detail);
      } else {
        setCompletedIds(getStoredCompletedAlgorithms());
      }
    };

    window.addEventListener(EVENT_PROGRESS_UPDATED, handleProgressUpdate);
    return () => {
      window.removeEventListener(EVENT_PROGRESS_UPDATED, handleProgressUpdate);
    };
  }, []);

  const overall = useMemo(() => calculateOverallProgress(completedIds), [completedIds]);

  // Determine user rank based on completed count
  const rankInfo = useMemo(() => {
    const c = overall.completedCount;
    if (c >= 28) return { title: "Huyền Thoại Giải Thuật (Grandmaster)", color: "text-purple-400", level: 5 };
    if (c >= 20) return { title: "Cao Thủ Cấu Trúc Dữ Liệu (Architect)", color: "text-blue-400", level: 4 };
    if (c >= 12) return { title: "Chiến Binh Giải Thuật (Specialist)", color: "text-amber-400", level: 3 };
    if (c >= 5) return { title: "Tập Sự Luyện Code (Apprentice)", color: "text-emerald-400", level: 2 };
    return { title: "Tân Thủ Bắt Đầu (Novice)", color: "text-slate-400", level: 1 };
  }, [overall.completedCount]);

  // Find next uncompleted algorithm to recommend
  const nextUpAlgorithm = useMemo(() => {
    for (const tier of ROADMAP_TIERS) {
      const algs = getAlgorithmsForTier(tier);
      const uncompleted = algs.find((a) => !completedIds.includes(a.id));
      if (uncompleted) {
        return { alg: uncompleted, tier };
      }
    }
    return null;
  }, [completedIds]);

  const handleToggle = (id: string, tierIndex: number) => {
    const prevTierProgress = calculateTierProgress(tierIndex, completedIds);
    const { completed, allCompleted } = toggleAlgorithmCompleted(id);
    setCompletedIds(allCompleted);

    // If this toggle unlocked the entire tier, fire confetti!
    if (completed) {
      const newTierProgress = calculateTierProgress(tierIndex, allCompleted);
      if (!prevTierProgress.isUnlocked && newTierProgress.isUnlocked) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"],
        });
      }
    }
  };

  const handleReset = () => {
    resetRoadmapProgress();
    setCompletedIds([]);
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* ================= HEADER & OVERALL PROGRESS ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Skill Tree Roadmap • 4 Tiers</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Lộ Trình Học DSA <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Chuyên Sâu</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                Chinh phục 28 giải thuật cốt lõi theo 4 chặng từ cơ bản đến nâng cao. Tiến độ được lưu tự động trên máy giúp bạn duy trì thói quen luyện code mỗi ngày.
              </p>
            </div>

            {/* Quick stats & Level card */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="flex-1 sm:flex-initial bg-slate-900/90 border border-slate-800 rounded-2xl p-4 min-w-[160px] text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Kinh nghiệm</span>
                </div>
                <div className="text-2xl font-black text-amber-400">{overall.xp.toLocaleString()} <span className="text-xs text-amber-500/80 font-normal">XP</span></div>
              </div>

              <div className="flex-1 sm:flex-initial bg-slate-900/90 border border-slate-800 rounded-2xl p-4 min-w-[180px] text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Danh hiệu</span>
                </div>
                <div className={`text-sm font-bold truncate ${rankInfo.color}`}>
                  Lv.{rankInfo.level} {rankInfo.title.split("(")[0]}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Tổng tiến độ hoàn thành:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  {overall.completedCount} / {TOTAL_ROADMAP_ALGORITHMS} ({overall.percentage}%)
                </span>
              </div>
              <div className="flex items-center gap-4">
                {nextUpAlgorithm && (
                  <Link
                    href={`/visualizer/${nextUpAlgorithm.alg.id}`}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Học tiếp: <strong>{nextUpAlgorithm.alg.name}</strong></span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  title="Đặt lại toàn bộ tiến độ"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đặt lại</span>
                </button>
              </div>
            </div>

            {/* Glowing progress bar track */}
            <div className="h-3.5 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${overall.percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* ================= ACHIEVEMENT BADGES SHOWCASE ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Huy Hiệu Chinh Phục (Milestone Badges)</h2>
            </div>
            <span className="text-xs text-slate-400">
              Hoàn thành 100% từng chặng để mở khóa huy hiệu vinh danh
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROADMAP_TIERS.map((tier) => {
              const tierProgress = calculateTierProgress(tier.tierNumber, completedIds);
              const isUnlocked = tierProgress.isUnlocked;
              const IconComponent = BADGE_ICONS[tier.badge.icon] || Trophy;

              return (
                <div
                  key={tier.badge.id}
                  className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
                    isUnlocked
                      ? "bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20"
                      : "bg-slate-900/40 border-slate-800/80 opacity-70 hover:opacity-90"
                  }`}
                >
                  {isUnlocked && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đã mở khóa
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 text-[10px] font-medium border border-slate-700/50 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {tierProgress.completedCount}/{tierProgress.totalCount}
                    </div>
                  )}

                  <div className="flex items-center gap-3.5 mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? `bg-gradient-to-tr ${tier.badge.color} text-white shadow-lg`
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Chặng {tier.tierNumber}
                      </div>
                      <h3 className={`text-sm font-bold ${isUnlocked ? "text-white" : "text-slate-300"}`}>
                        {tier.badge.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {tier.badge.description}
                  </p>

                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isUnlocked ? "bg-emerald-400" : "bg-slate-700"
                      }`}
                      style={{ width: `${tierProgress.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= CONTROLS & VIEW TOGGLE ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          {/* Tier filter buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTierFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTierFilter === "all"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Tất cả 4 chặng ({TOTAL_ROADMAP_ALGORITHMS})
            </button>
            {ROADMAP_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setActiveTierFilter(tier.tierNumber)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTierFilter === tier.tierNumber
                    ? "bg-slate-800 text-white border border-slate-600 shadow-sm"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80"
                }`}
              >
                Chặng {tier.tierNumber} ({tier.algorithmIds.length})
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Timeline vs Grid */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === "timeline"
                  ? "bg-slate-800 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Dòng thời gian</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-slate-800 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Lưới thẻ</span>
            </button>
          </div>
        </div>

        {/* ================= ROADMAP CONTENT ================= */}
        <div className="space-y-12">
          {ROADMAP_TIERS.filter((t) => activeTierFilter === "all" || activeTierFilter === t.tierNumber).map(
            (tier, tierIdx) => {
              const tierProgress = calculateTierProgress(tier.tierNumber, completedIds);
              const algorithms = getAlgorithmsForTier(tier);
              const IconComponent = BADGE_ICONS[tier.badge.icon] || Trophy;

              return (
                <div key={tier.id} className="relative">
                  {/* Tier Header Card */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-gradient-to-tr ${tier.badge.color} text-white shadow-lg shrink-0`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Chặng {tier.tierNumber} • {tier.englishTitle}
                            </span>
                            {tierProgress.isUnlocked && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                                Hoàn thành 100%
                              </span>
                            )}
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                            {tier.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                            {tier.description}
                          </p>
                        </div>
                      </div>

                      {/* Tier progress indicator */}
                      <div className="sm:text-right shrink-0">
                        <div className="text-xs text-slate-400 mb-1">
                          Tiến độ chặng: <strong className="text-white">{tierProgress.completedCount}/{tierProgress.totalCount}</strong>
                        </div>
                        <div className="w-32 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${tierProgress.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Render view: Timeline vs Grid */}
                  {viewMode === "timeline" ? (
                    <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 ml-4 sm:ml-6 space-y-4">
                      {algorithms.map((alg, index) => {
                        const isDone = completedIds.includes(alg.id);

                        return (
                          <div key={alg.id} className="relative group">
                            {/* Connector node bullet */}
                            <button
                              onClick={() => handleToggle(alg.id, tier.tierNumber)}
                              className={`absolute -left-[31px] sm:-left-[39px] top-4 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isDone
                                  ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 scale-105"
                                  : "bg-slate-900 border-2 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                              }`}
                              title={isDone ? "Đánh dấu chưa học" : "Đánh dấu đã hoàn thành"}
                            >
                              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-[11px] font-bold">{index + 1}</span>}
                            </button>

                            {/* Card Content */}
                            <div
                              className={`rounded-2xl border transition-all duration-200 p-4 sm:p-5 ${
                                isDone
                                  ? "bg-slate-900/40 border-emerald-500/30 hover:border-emerald-500/50"
                                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className={`text-base font-bold ${isDone ? "text-emerald-300" : "text-white"}`}>
                                      {alg.name}
                                    </h3>
                                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                                      {alg.complexity.average}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                                      Space: {alg.complexity.space}
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    {alg.shortDescription}
                                  </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                                  <button
                                    onClick={() => handleToggle(alg.id, tier.tierNumber)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                      isDone
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                    }`}
                                  >
                                    {isDone ? (
                                      <>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Đã học</span>
                                      </>
                                    ) : (
                                      <>
                                        <Circle className="w-3.5 h-3.5" />
                                        <span>Đánh dấu xong</span>
                                      </>
                                    )}
                                  </button>

                                  <Link
                                    href={`/visualizer/${alg.id}`}
                                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 transition-all flex items-center gap-1"
                                  >
                                    <span>Mô phỏng</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {algorithms.map((alg, index) => {
                        const isDone = completedIds.includes(alg.id);

                        return (
                          <div
                            key={alg.id}
                            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                              isDone
                                ? "bg-slate-900/40 border-emerald-500/30 hover:border-emerald-500/50"
                                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono text-slate-500">#{index + 1}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                    {alg.complexity.average}
                                  </span>
                                </div>
                              </div>

                              <h3 className={`text-base font-bold ${isDone ? "text-emerald-300" : "text-white"}`}>
                                {alg.name}
                              </h3>

                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {alg.shortDescription}
                              </p>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                              <button
                                onClick={() => handleToggle(alg.id, tier.tierNumber)}
                                className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                                  isDone
                                    ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                <span>{isDone ? "Đã học" : "Chưa học"}</span>
                              </button>

                              <Link
                                href={`/visualizer/${alg.id}`}
                                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                              >
                                <span>Mô phỏng</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>

        {/* Quick Link Footer to Big-O Cheat Sheet */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Cần tra cứu nhanh độ phức tạp Big-O của cả 28 thuật toán?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Khám phá trang Big-O Cheat Sheet với biểu đồ toán học so sánh trực quan các hàm tăng trưởng $O(1)$ đến $O(2^N)$ và bảng lọc ma trận toàn diện.
            </p>
          </div>
          <Link
            href="/cheatsheet"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all shrink-0 flex items-center gap-2"
          >
            <span>Mở Bảng Tra Cứu Big-O</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white">Đặt lại toàn bộ tiến độ?</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Hành động này sẽ xóa các đánh dấu đã hoàn thành của toàn bộ 28 thuật toán trên thiết bị này. Điểm XP và huy hiệu sẽ được tính lại từ đầu.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-xs hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Xác nhận đặt lại
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
