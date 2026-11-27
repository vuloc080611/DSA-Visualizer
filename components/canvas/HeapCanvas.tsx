"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Step } from "@/lib/types";
import { ArrowDown, Layers, Sparkles, Award } from "lucide-react";

interface HeapCanvasProps {
  currentStep: Step;
}

interface HeapTreeNode {
  index: number;
  value: number;
  x: number;
  y: number;
  parentIndex?: number;
}

export function HeapCanvas({ currentStep }: HeapCanvasProps) {
  const heap = currentStep.heapArray || [];
  const highlights = currentStep.heapHighlightIndices || [];
  const swapping: number[] = currentStep.heapSwappingIndices ? [...currentStep.heapSwappingIndices] : [];
  const extracted = currentStep.heapExtractedValue;

  // Compute node (x, y) coordinates for binary tree
  const treeNodes: HeapTreeNode[] = useMemo(() => {
    const nodes: HeapTreeNode[] = [];
    const width = 640;
    const levelHeight = 70;

    heap.forEach((val, i) => {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);

      const segmentWidth = width / totalInLevel;
      const x = segmentWidth * posInLevel + segmentWidth / 2;
      const y = 45 + level * levelHeight;
      const parentIndex = i > 0 ? Math.floor((i - 1) / 2) : undefined;

      nodes.push({ index: i, value: val, x, y, parentIndex });
    });

    return nodes;
  }, [heap]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 select-none space-y-4">
      {/* HUD Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#e06c53]" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Cấu Trúc Đống Nhị Phân (Binary Min Heap)
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            N = {heap.length} phần tử
          </span>
        </div>

        {extracted !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Đã lấy giá trị Min: {extracted}</span>
          </div>
        )}
      </div>

      {/* Tree Visualization SVG Stage */}
      <div className="w-full h-64 sm:h-72 relative rounded-2xl bg-slate-950 p-2 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
        {heap.length === 0 ? (
          <div className="text-slate-600 font-mono text-xs italic">
            Đống đang rỗng (Empty Heap)
          </div>
        ) : (
          <svg viewBox="0 0 640 260" className="w-full h-full">
            {/* Tree Edges */}
            {treeNodes.map((node) => {
              if (node.parentIndex === undefined) return null;
              const parentNode = treeNodes[node.parentIndex];
              if (!parentNode) return null;

              const isEdgeHighlighted =
                highlights.includes(node.index) && highlights.includes(node.parentIndex);

              return (
                <line
                  key={`edge-${node.index}`}
                  x1={parentNode.x}
                  y1={parentNode.y}
                  x2={node.x}
                  y2={node.y}
                  stroke={isEdgeHighlighted ? "#f59e0b" : "#334155"}
                  strokeWidth={isEdgeHighlighted ? "3" : "1.5"}
                  strokeDasharray={isEdgeHighlighted ? "4 2" : undefined}
                />
              );
            })}

            {/* Tree Nodes */}
            {treeNodes.map((node) => {
              const isComparing = highlights.includes(node.index);
              const isSwapping = swapping.includes(node.index);
              const isRoot = node.index === 0;

              return (
                <g key={`node-${node.index}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill={
                      isSwapping
                        ? "#f97316"
                        : isComparing
                        ? "#f59e0b"
                        : isRoot
                        ? "#10b981"
                        : "#1e293b"
                    }
                    stroke={
                      isSwapping
                        ? "#fed7aa"
                        : isComparing
                        ? "#fef08a"
                        : isRoot
                        ? "#6ee7b7"
                        : "#475569"
                    }
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill={isSwapping || isComparing || isRoot ? "#0f172a" : "#f8fafc"}
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.value}
                  </text>
                  <text
                    x={node.x}
                    y={node.y - 22}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    i={node.index}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* 1D Array Representation Cells */}
      <div className="w-full space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Mảng lưu trữ thực tế bên dưới (heap[i] với con trái: 2i+1, con phải: 2i+2):
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto p-2 rounded-xl bg-slate-900 border border-slate-800">
          {heap.length === 0 ? (
            <span className="text-slate-600 text-xs italic px-2">[]</span>
          ) : (
            heap.map((val, idx) => {
              const isComparing = highlights.includes(idx);
              const isSwapping = swapping.includes(idx);

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-11 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold border transition-all ${
                      isSwapping
                        ? "bg-orange-500 text-white border-orange-300 shadow-sm"
                        : isComparing
                        ? "bg-amber-500 text-slate-950 border-amber-300 font-black shadow-sm"
                        : idx === 0
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-slate-800 text-slate-200 border-slate-700"
                    }`}
                  >
                    {val}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    [{idx}]
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
