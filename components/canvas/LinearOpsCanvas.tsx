"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Step } from "@/lib/types";
import { Layers, ArrowRight } from "lucide-react";

interface LinearOpsCanvasProps {
  currentStep: Step;
}

export function LinearOpsCanvas({ currentStep }: LinearOpsCanvasProps) {
  const stack = currentStep.linearOpsStack || [];
  const queue = currentStep.linearOpsQueue || [];
  const action = currentStep.linearOpsAction || "Sẵn sàng";

  return (
    <div className="w-full rounded-2xl bg-slate-50/50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-6 space-y-5 select-none">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <Layers className="w-4 h-4 text-[#e06c53]" />
          <span>Thao tác hiện tại:</span>
        </div>
        <span className="font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#e06c53]/15 text-[#e06c53] border border-[#e06c53]/30">
          {action}
        </span>
      </div>

      {/* Dual Comparison Grid: Stack (LIFO) vs Queue (FIFO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STACK - LIFO */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col items-center space-y-3">
          <div className="w-full flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400">STACK (Ngăn xếp • LIFO)</span>
            <span className="font-mono text-slate-400">Size: {stack.length}</span>
          </div>

          <div className="w-44 h-52 border-b-4 border-l-4 border-r-4 border-slate-700 rounded-b-2xl bg-slate-900/50 p-2 flex flex-col-reverse items-center gap-2 overflow-hidden">
            {stack.length === 0 ? (
              <div className="m-auto text-xs text-slate-500 italic">Stack rỗng</div>
            ) : (
              <AnimatePresence>
                {stack.map((item, idx) => {
                  const isTop = idx === stack.length - 1;
                  return (
                    <motion.div
                      key={`${item}-${idx}`}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-bold text-center border flex items-center justify-between ${
                        isTop
                          ? "bg-amber-500 text-slate-950 border-amber-300 shadow-md"
                          : "bg-slate-800 text-slate-200 border-slate-700"
                      }`}
                    >
                      <span>{item}</span>
                      {isTop && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950/20">
                          TOP
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Push thêm vào đỉnh • Pop rút từ <strong>đỉnh (vào sau ra trước)</strong>
          </p>
        </div>

        {/* QUEUE - FIFO */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between space-y-3">
          <div className="w-full flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400">QUEUE (Hàng đợi • FIFO)</span>
            <span className="font-mono text-slate-400">Size: {queue.length}</span>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
              <span className="text-emerald-400 font-bold">← FRONT (Dequeue ra)</span>
              <span className="text-cyan-400 font-bold">BACK (Enqueue vào) ←</span>
            </div>
            <div className="w-full min-h-[88px] border-t-4 border-b-4 border-slate-700 bg-slate-900/50 p-3 flex items-center gap-2 overflow-x-auto rounded-lg">
              {queue.length === 0 ? (
                <div className="m-auto text-xs text-slate-500 italic">Queue rỗng</div>
              ) : (
                <AnimatePresence>
                  {queue.map((item, idx) => (
                    <motion.div
                      key={`${item}-${idx}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-1.5 shrink-0"
                    >
                      <div
                        className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border ${
                          idx === 0
                            ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-md"
                            : idx === queue.length - 1
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                            : "bg-slate-800 text-slate-200 border-slate-700"
                        }`}
                      >
                        {item}
                      </div>
                      {idx < queue.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Enqueue vào đuôi • Dequeue lấy ở <strong>đầu (vào trước ra trước)</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
