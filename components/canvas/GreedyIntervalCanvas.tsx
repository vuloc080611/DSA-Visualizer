"use client";

import { motion } from "framer-motion";
import { Step, IntervalActivity } from "@/lib/types";
import { Check, X, Clock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

interface GreedyIntervalCanvasProps {
  currentStep: Step;
}

export function GreedyIntervalCanvas({ currentStep }: GreedyIntervalCanvasProps) {
  const intervals = currentStep.intervals || [];
  const maxHour = 16;
  const lastEnd = currentStep.lastEndTime ?? 0;
  const selectedCount = currentStep.selectedIntervalsCount ?? 0;

  // Generate ticks for 0 to 16h
  const timeTicks = [0, 2, 4, 6, 8, 10, 12, 14, 16];

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 select-none space-y-4">
      {/* HUD Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Calendar className="w-4 h-4 text-[#e06c53]" />
            <span>Trục Thời Gian Sự Kiện (0h → 16h)</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
            Đã chọn: {selectedCount} sự kiện
          </span>
        </div>

        {lastEnd > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Phòng bận đến: <strong className="text-white bg-amber-600 px-1.5 py-0.5 rounded">{lastEnd}h</strong></span>
          </div>
        )}
      </div>

      {/* Main Timeline Viewport */}
      <div className="w-full relative rounded-2xl bg-slate-950 p-4 border border-slate-800 overflow-hidden shadow-inner">
        {/* Time Ticks Header */}
        <div className="relative w-full h-8 border-b border-slate-800 mb-3 flex items-center">
          {timeTicks.map((hour) => {
            const leftPercent = (hour / maxHour) * 100;
            return (
              <div
                key={hour}
                style={{ left: `${leftPercent}%` }}
                className="absolute -translate-x-1/2 flex flex-col items-center"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {hour}h
                </span>
                <span className="w-px h-2 bg-slate-700 mt-1" />
              </div>
            );
          })}
        </div>

        {/* Background Grid Lines */}
        <div className="absolute inset-0 pointer-events-none top-14">
          {timeTicks.map((hour) => {
            const leftPercent = (hour / maxHour) * 100;
            return (
              <div
                key={`grid-${hour}`}
                style={{ left: `${leftPercent}%` }}
                className="absolute top-0 bottom-0 w-px bg-slate-800/40"
              />
            );
          })}

          {/* Current Busy Horizon Indicator Line */}
          {lastEnd > 0 && (
            <motion.div
              initial={false}
              animate={{ left: `${(lastEnd / maxHour) * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute top-0 bottom-0 w-0.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] z-10"
            >
              <div className="absolute -top-3 -translate-x-1/2 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-mono font-black">
                Mốc {lastEnd}h
              </div>
            </motion.div>
          )}
        </div>

        {/* Activities List */}
        <div className="relative space-y-2 py-1 z-10">
          {intervals.map((act) => {
            const leftPercent = (act.start / maxHour) * 100;
            const widthPercent = ((act.end - act.start) / maxHour) * 100;

            const isSelected = act.status === "selected";
            const isInspecting = act.status === "inspecting";
            const isOverlapping = act.status === "overlapping";

            return (
              <div key={act.id} className="relative h-9 flex items-center">
                {/* Interval Bar */}
                <motion.div
                  layout
                  style={{
                    left: `${leftPercent}%`,
                    width: `${Math.max(widthPercent, 5)}%`,
                  }}
                  className={`absolute h-7 rounded-xl px-2.5 flex items-center justify-between text-xs font-semibold shadow-sm transition-all overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-400"
                      : isInspecting
                      ? "bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-300 scale-[1.02] shadow-amber-500/40"
                      : isOverlapping
                      ? "bg-slate-800/60 text-slate-500 border border-slate-700 line-through opacity-50"
                      : "bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                    {isOverlapping && <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    <span className="truncate text-[11px]">{act.name}</span>
                  </div>

                  <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">
                    [{act.start}-{act.end}h]
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Đã tham lam chọn</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Đang xét duyệt</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-700" />
          <span>Bị loại (Trùng giờ)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600" />
          <span>Chưa xét</span>
        </div>
      </div>
    </div>
  );
}
