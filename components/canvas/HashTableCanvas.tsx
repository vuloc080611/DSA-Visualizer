"use client";

import { motion } from "framer-motion";
import { Step } from "@/lib/types";
import { Database, ArrowRight, AlertTriangle, Check, Search, Hash } from "lucide-react";

interface HashTableCanvasProps {
  currentStep: Step;
}

export function HashTableCanvas({ currentStep }: HashTableCanvasProps) {
  const buckets = currentStep.hashBuckets || [];
  const activeKey = currentStep.currentHashKey;
  const activeIndex = currentStep.computedHashIndex;
  const hasCollision = currentStep.hashCollisionDetected;

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 select-none space-y-4">
      {/* Top HUD: Hash calculation display */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Hash className="w-4 h-4 text-[#e06c53]" />
            <span>Hàm băm: <code>hash(k) = k mod {buckets.length}</code></span>
          </div>

          {activeKey !== undefined && activeIndex !== undefined && (
            <span className="font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-700">
              k = {activeKey} → index = {activeIndex}
            </span>
          )}
        </div>

        {hasCollision && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-bold border border-rose-500/30 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Phát hiện xung đột (Collision)!</span>
          </div>
        )}
      </div>

      {/* Main Buckets & Chaining Viewport */}
      <div className="w-full rounded-2xl bg-slate-950 p-4 sm:p-6 border border-slate-800 space-y-3 shadow-inner">
        {buckets.map((bucket) => {
          const isTargetBucket = activeIndex === bucket.index;
          const isCollided = isTargetBucket && hasCollision;
          const isMatched = bucket.status === "matched";

          return (
            <div
              key={bucket.index}
              className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                isCollided
                  ? "bg-rose-950/20 border border-rose-500/40"
                  : isMatched
                  ? "bg-emerald-950/20 border border-emerald-500/40"
                  : isTargetBucket
                  ? "bg-amber-950/20 border border-amber-500/40"
                  : "bg-slate-900/40 border border-slate-800/80"
              }`}
            >
              {/* Bucket Index Cell */}
              <div
                className={`w-16 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all ${
                  isCollided
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                    : isMatched
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : isTargetBucket
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                [{bucket.index}]
              </div>

              {/* Chaining Linked List Arrow & Nodes */}
              <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1">
                {bucket.items.length === 0 ? (
                  <span className="text-slate-600 font-mono text-xs italic pl-2">
                    null (trống)
                  </span>
                ) : (
                  bucket.items.map((item, itemIdx) => {
                    const isJustAdded = isTargetBucket && item.key === activeKey;

                    return (
                      <div key={itemIdx} className="flex items-center gap-2 shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <motion.div
                          initial={isJustAdded ? { scale: 0.5, opacity: 0 } : false}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                            isJustAdded
                              ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white border-amber-400 shadow-md shadow-amber-500/30 ring-2 ring-amber-300"
                              : isMatched && item.key === activeKey
                              ? "bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-300"
                              : "bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          {item.key}
                        </motion.div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend & Technique Note */}
      <div className="w-full flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500" />
            <span>Đang chèn / Tìm kiếm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-500" />
            <span>Xảy ra xung đột</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500" />
            <span>Tìm thấy khóa (O(1))</span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Kỹ thuật giải quyết: Separate Chaining (Nối chuỗi DSLK)
        </span>
      </div>
    </div>
  );
}
