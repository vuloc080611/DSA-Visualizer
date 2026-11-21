"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  TrendingDown,
  SlidersHorizontal,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  currentStepIndex: number;
  totalSteps: number;
  onSeek: (step: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  // Customization
  category: string;
  onRandomize?: () => void;
  onNearlySorted?: () => void;
  onReversed?: () => void;
  onCustomInput?: (array: number[], target?: number) => void;
  currentTarget?: number;
}

export function ControlPanel({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  currentStepIndex,
  totalSteps,
  onSeek,
  speed,
  onSpeedChange,
  soundEnabled,
  onSoundToggle,
  category,
  onRandomize,
  onNearlySorted,
  onReversed,
  onCustomInput,
  currentTarget,
}: ControlPanelProps) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customArrayStr, setCustomArrayStr] = useState("");
  const [customTargetStr, setCustomTargetStr] = useState(
    currentTarget !== undefined ? String(currentTarget) : ""
  );
  const [inputError, setInputError] = useState("");

  const handleApplyCustom = () => {
    try {
      const numbers = customArrayStr
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => {
          const num = Number(s);
          if (isNaN(num)) throw new Error("Vui lòng chỉ nhập số hợp lệ.");
          return num;
        });

      if (numbers.length < 3 || numbers.length > 20) {
        setInputError("Số lượng phần tử nên từ 3 đến 20 số để hiển thị tốt nhất.");
        return;
      }

      let parsedTarget: number | undefined = undefined;
      if (customTargetStr.trim().length > 0) {
        parsedTarget = Number(customTargetStr.trim());
        if (isNaN(parsedTarget)) {
          setInputError("Target phải là một số hợp lệ.");
          return;
        }
      }

      setInputError("");
      onCustomInput?.(numbers, parsedTarget);
      setShowCustomModal(false);
    } catch (err: any) {
      setInputError(err.message || "Dữ liệu nhập không hợp lệ.");
    }
  };

  const speedOptions = [
    { label: "0.5x", value: 1000 },
    { label: "1x", value: 500 },
    { label: "2x", value: 250 },
    { label: "4x", value: 100 },
  ];

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4 transition-colors">
      {/* Top row: Main Controls + Speed + Sound */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            title="Quay về bước đầu tiên"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Prev */}
          <button
            onClick={onPrev}
            disabled={currentStepIndex <= 0 || isPlaying}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-slate-200 dark:border-slate-700"
            title="Bước trước đó"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause (Hero button) */}
          <button
            onClick={onPlayPause}
            className={cn(
              "px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md transition-all duration-200",
              isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
            )}
            title={isPlaying ? "Tạm dừng" : "Bắt đầu chạy"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{currentStepIndex >= totalSteps - 1 ? "Chạy lại" : "Chạy"}</span>
              </>
            )}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            disabled={currentStepIndex >= totalSteps - 1 || isPlaying}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-slate-200 dark:border-slate-700"
            title="Bước kế tiếp"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tốc độ:</span>
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            {speedOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSpeedChange(opt.value)}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                  speed === opt.value
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onSoundToggle}
            className={cn(
              "p-2 rounded-xl border transition-colors",
              soundEnabled
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
            )}
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh hiệu ứng"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar / Step Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>Tiến trình giải thuật</span>
          <span>
            Bước <strong className="text-slate-900 dark:text-white">{currentStepIndex + 1}</strong> / {totalSteps}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={currentStepIndex}
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={isPlaying}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
        />
      </div>

      {/* Bottom Row: Array Generation Options (Only for array/sorting/searching) */}
      {category !== "graph" && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Dữ liệu mẫu:</span>

            {onRandomize && (
              <button
                onClick={onRandomize}
                disabled={isPlaying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Shuffle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Ngẫu nhiên</span>
              </button>
            )}

            {onNearlySorted && (
              <button
                onClick={onNearlySorted}
                disabled={isPlaying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Gần sắp xếp</span>
              </button>
            )}

            {onReversed && (
              <button
                onClick={onReversed}
                disabled={isPlaying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                <span>Đảo ngược</span>
              </button>
            )}
          </div>

          {onCustomInput && (
            <button
              onClick={() => setShowCustomModal(true)}
              disabled={isPlaying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 disabled:opacity-50 transition-colors border border-emerald-200 dark:border-emerald-800"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Tùy chỉnh mảng...</span>
            </button>
          )}
        </div>
      )}

      {/* Custom Input Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Tùy chỉnh mảng đầu vào
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nhập các số nguyên phân cách bằng dấu phẩy hoặc khoảng trắng (3 đến 20 phần tử).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Các phần tử mảng:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 35, 12, 89, 45, 60, 23, 78"
                value={customArrayStr}
                onChange={(e) => setCustomArrayStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            {(category === "searching" || category === "array") && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Giá trị mục tiêu (Target):
                </label>
                <input
                  type="number"
                  placeholder="Ví dụ: 45"
                  value={customTargetStr}
                  onChange={(e) => setCustomTargetStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            )}

            {inputError && (
              <p className="text-xs text-rose-500 font-medium">{inputError}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyCustom}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/25 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Áp dụng</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
