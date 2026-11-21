"use client";

import { Step } from "@/lib/types";
import { Info, GitCommit, ArrowLeftRight, Activity, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StepDescriptionProps {
  step: Step;
  totalSteps: number;
}

export function StepDescription({ step, totalSteps }: StepDescriptionProps) {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3 transition-colors">
      {/* Header & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Info className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            Diễn giải từng bước
          </span>
        </div>

        {/* Real-time stats */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {step.comparisons !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>So sánh: <strong>{step.comparisons}</strong></span>
            </div>
          )}

          {step.swaps !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <ArrowLeftRight className="w-3.5 h-3.5 text-rose-500" />
              <span>Hoán đổi: <strong>{step.swaps}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Description text with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.p
          key={step.description}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.15 }}
          className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed"
        >
          {step.description}
        </motion.p>
      </AnimatePresence>

      {/* Extra Info Tags (Hash Map, Call Stack, Queue, Current Sum) */}
      {step.extraInfo && Object.keys(step.extraInfo).length > 0 && (
        <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
          {Object.entries(step.extraInfo).map(([key, val]) => (
            <div
              key={key}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80"
            >
              <span className="font-semibold">{key}: </span>
              <span>{String(val)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
