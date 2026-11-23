"use client";

import { useState, useMemo } from "react";
import { Step, AlgorithmCategory, TreeNodeData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowDown,
  Activity,
  Flag,
  Target,
  Shuffle,
  Trash2,
  RotateCcw,
  Footprints,
  Compass,
  Link2,
  CornerDownLeft,
  CheckCircle2,
  XCircle,
  Layers,
  Crown,
  Package,
  Undo2,
  Table2,
  Calculator,
  AlertCircle,
  GitBranch,
  ArrowRight,
  CornerDownRight,
  ListOrdered,
  Check,
  CaseSensitive,
  Network,
  GitFork,
} from "lucide-react";
import {
  DEFAULT_GRID_ROWS,
  DEFAULT_GRID_COLS,
  DEFAULT_START,
  DEFAULT_END,
  DEFAULT_GRID_WALLS,
  generateRandomWalls,
  generateStaircaseWalls,
} from "@/lib/algorithms/pathfinding";

interface VisualizerCanvasProps {
  currentStep: Step;
  category: AlgorithmCategory;
  arraySize?: number;
  onGridChange?: (walls: [number, number][], start: [number, number], end: [number, number]) => void;
  isChallengeMode?: boolean;
  selectedIndices?: number[];
  onSelectIndex?: (index: number) => void;
  onSelectNode?: (nodeId: string) => void;
}

export function VisualizerCanvas({
  currentStep,
  category,
  onGridChange,
  isChallengeMode = false,
  selectedIndices = [],
  onSelectIndex,
  onSelectNode,
}: VisualizerCanvasProps) {
  // Trie (Prefix Tree & Autocomplete)
  if (currentStep.trie !== undefined) {
    return <TrieCanvas currentStep={currentStep} />;
  }

  // KMP String Pattern Matching
  if (currentStep.kmpText !== undefined) {
    return <KmpCanvas currentStep={currentStep} />;
  }

  // Kruskal's MST & DSU
  if (currentStep.dsuEdges !== undefined) {
    return <DsuCanvas currentStep={currentStep} />;
  }

  // Segment Tree
  if (currentStep.segTree !== undefined) {
    return <SegmentTreeCanvas currentStep={currentStep} />;
  }

  // Topological Sort (Kahn's Algorithm)
  if (currentStep.topoQueue !== undefined || currentStep.inDegree !== undefined) {
    return <TopologicalSortCanvas currentStep={currentStep} />;
  }

  // Longest Common Subsequence (LCS)
  if (currentStep.lcsTable !== undefined) {
    return <LcsCanvas currentStep={currentStep} />;
  }

  // If it's a dynamic programming algorithm (0/1 Knapsack), render DpCanvas
  if (category === "dp" || currentStep.dpTable !== undefined) {
    return <DpCanvas currentStep={currentStep} />;
  }

  // If it's a backtracking algorithm (N-Queens), render NQueensCanvas
  if (category === "backtracking" || currentStep.nQueensBoard !== undefined) {
    return <NQueensCanvas currentStep={currentStep} />;
  }

  // If it's a linked list algorithm (Reverse, Floyd's Cycle), render LinkedListCanvas
  if (category === "linked-list" || currentStep.linkedList !== undefined) {
    return <LinkedListCanvas currentStep={currentStep} />;
  }

  // If it's a stack & queue algorithm (Valid Parentheses), render StackCanvas
  if (category === "stack-queue" || currentStep.stackItems !== undefined) {
    return <StackCanvas currentStep={currentStep} />;
  }

  // If it's a pathfinding algorithm (Dijkstra/A* on 2D Grid), render the Pathfinding Canvas
  if (category === "pathfinding" || currentStep.gridRows !== undefined) {
    return <PathfindingCanvas currentStep={currentStep} onGridChange={onGridChange} />;
  }

  // If it's a graph algorithm (BFS/DFS), render the Graph Canvas
  if (category === "graph" && currentStep.graph) {
    return (
      <GraphCanvas
        currentStep={currentStep}
        isChallengeMode={isChallengeMode}
        onSelectNode={onSelectNode}
      />
    );
  }

  // If it's a tree algorithm (BST / AVL), render the Tree Canvas
  if (category === "tree") {
    return <TreeCanvas currentStep={currentStep} />;
  }

  // Array / Sorting / Searching / Window Canvas
  return (
    <ArrayCanvas
      currentStep={currentStep}
      isChallengeMode={isChallengeMode}
      selectedIndices={selectedIndices}
      onSelectIndex={onSelectIndex}
    />
  );
}

// ==================== ARRAY CANVAS ====================
function ArrayCanvas({
  currentStep,
  isChallengeMode = false,
  selectedIndices = [],
  onSelectIndex,
}: {
  currentStep: Step;
  isChallengeMode?: boolean;
  selectedIndices?: number[];
  onSelectIndex?: (index: number) => void;
}) {
  const array = currentStep.array || [];
  if (array.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-slate-400">
        Không có dữ liệu mảng.
      </div>
    );
  }

  // Calculate min and max for scaling
  const minVal = Math.min(...array, 0);
  const maxVal = Math.max(...array, 100);
  const range = maxVal - minVal || 100;
  const canvasHeight = 280; // px

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] flex flex-col justify-end items-center px-4 pt-10 pb-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Target or Window Badge indicator */}
      {(currentStep.target !== undefined || currentStep.window !== undefined) && (
        <div className="absolute top-3 left-4 flex flex-wrap gap-2 z-10">
          {currentStep.target !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span>Target: {currentStep.target}</span>
            </div>
          )}
          {currentStep.window && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold shadow-sm">
              <span>Cửa sổ [Index {currentStep.window[0]}..{currentStep.window[1]}]</span>
            </div>
          )}
        </div>
      )}

      {/* Bars Container */}
      <div className="relative z-10 w-full flex items-end justify-center gap-1.5 sm:gap-2.5 max-w-4xl h-[280px]">
        {array.map((value, idx) => {
          // Status priority
          const isSelected = selectedIndices.includes(idx);
          const isSorted = currentStep.sorted?.includes(idx);
          const isSwapping = currentStep.swapping?.includes(idx);
          const isHighlight = currentStep.highlights?.includes(idx);
          const isPivot = currentStep.pivot === idx;
          const isInWindow =
            currentStep.window && idx >= currentStep.window[0] && idx <= currentStep.window[1];

          // Compute normalized height
          const normalizedHeight = Math.max(
            Math.round(((value - Math.min(0, minVal)) / range) * (canvasHeight - 60)) + 30,
            24
          );

          // Color themes
          let barBg = "bg-slate-200 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200";
          let borderGlow = "border-slate-300 dark:border-slate-600";
          let labelText = "Default";

          if (isSelected) {
            barBg = "bg-gradient-to-t from-cyan-500 to-sky-400 text-white shadow-xl shadow-cyan-500/40";
            borderGlow = "border-cyan-300 ring-4 ring-cyan-400/80";
            labelText = "Selected";
          } else if (isSorted) {
            barBg = "bg-gradient-to-t from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-500/25";
            borderGlow = "border-emerald-400";
            labelText = "Sorted";
          } else if (isSwapping) {
            barBg = "bg-gradient-to-t from-rose-600 to-rose-400 text-white shadow-lg shadow-rose-500/30";
            borderGlow = "border-rose-400";
            labelText = "Swapping";
          } else if (isPivot) {
            barBg = "bg-gradient-to-t from-purple-600 to-purple-400 text-white shadow-lg shadow-purple-500/30";
            borderGlow = "border-purple-400";
            labelText = "Pivot";
          } else if (isHighlight) {
            barBg = "bg-gradient-to-t from-amber-500 to-amber-300 text-slate-900 shadow-lg shadow-amber-500/25";
            borderGlow = "border-amber-400";
            labelText = "Comparing";
          } else if (isInWindow) {
            barBg = "bg-gradient-to-t from-sky-500/80 to-sky-400/80 text-white shadow-md shadow-sky-500/20";
            borderGlow = "border-sky-300";
          }

          return (
            <motion.div
              layout
              key={`bar-col-${idx}`}
              onClick={() => {
                if (isChallengeMode) {
                  onSelectIndex?.(idx);
                }
              }}
              animate={
                isSwapping
                  ? { y: [0, -14, 0], scale: [1, 1.07, 1] }
                  : isHighlight || isSelected
                  ? { y: [0, -5, 0], scale: isSelected ? 1.05 : 1 }
                  : { y: 0, scale: 1 }
              }
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 26 },
                y: { duration: 0.22, ease: "easeInOut" },
              }}
              className={`flex-1 flex flex-col items-center justify-end h-full max-w-[56px] min-w-[20px] relative ${
                isChallengeMode ? "cursor-pointer hover:brightness-110" : ""
              }`}
            >
              {/* Pointer indicator above bar */}
              <div className="h-6 flex items-center justify-center">
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-1.5 py-0.2 rounded-md bg-cyan-500 text-white text-[9px] font-bold shadow-md shadow-cyan-500/30 flex items-center gap-0.5"
                  >
                    <span>✓ Chọn</span>
                  </motion.div>
                )}
                {!isSelected && isPivot && (
                  <motion.div
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-tight text-purple-600 dark:text-purple-300">
                      Pivot
                    </span>
                    <ArrowDown className="w-3.5 h-3.5 text-purple-500 -mt-0.5 animate-bounce" />
                  </motion.div>
                )}
                {!isSelected && isSwapping && !isPivot && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="flex items-center gap-1"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/50 animate-ping" />
                  </motion.div>
                )}
              </div>

              {/* Animated Bar with Physical Elevation */}
              <motion.div
                layout
                initial={{ height: 0 }}
                animate={{ height: `${normalizedHeight}px` }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className={`w-full rounded-t-lg sm:rounded-t-xl border flex flex-col justify-between items-center py-1.5 transition-colors duration-200 ${barBg} ${borderGlow} ${
                  isSwapping ? "shadow-2xl shadow-rose-500/50 ring-2 ring-rose-400" : ""
                }`}
              >
                {/* Value at top */}
                <span className="text-xs sm:text-sm font-bold font-mono tracking-tight drop-shadow-sm">
                  {value}
                </span>

                {/* Subtitle inside bar if high enough */}
                {normalizedHeight > 90 && (
                  <span className="text-[9px] font-medium uppercase tracking-wider opacity-75 hidden sm:block">
                    {labelText}
                  </span>
                )}
              </motion.div>

              {/* Index at bottom */}
              <div className="mt-2 text-center">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-semibold">
                  {idx}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400 z-10 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 w-full">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-700" />
          <span>Mặc định</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400" />
          <span>So sánh / Đang xét</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-500" />
          <span>Hoán đổi / Đổi chỗ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500" />
          <span>Đã sắp xếp / Tìm thấy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-500" />
          <span>Pivot / Điểm mốc</span>
        </div>
      </div>
    </div>
  );
}

// ==================== GRAPH CANVAS (BFS / DFS) ====================
function GraphCanvas({
  currentStep,
  isChallengeMode = false,
  onSelectNode,
}: {
  currentStep: Step;
  isChallengeMode?: boolean;
  onSelectNode?: (nodeId: string) => void;
}) {
  const graph = currentStep.graph;
  if (!graph) return null;

  const visitedNodes = new Set(currentStep.visitedNodes || []);
  const frontierNodes = new Set(currentStep.frontierNodes || []);
  const currentNode = currentStep.currentNode;
  const activeEdge = currentStep.activeEdge;
  const visitedEdges = currentStep.visitedEdges || [];

  const isEdgeVisited = (u: string, v: string) => {
    return visitedEdges.some(
      ([from, to]) => (from === u && to === v) || (from === v && to === u)
    );
  };

  const isEdgeActive = (u: string, v: string) => {
    if (!activeEdge) return false;
    return (
      (activeEdge[0] === u && activeEdge[1] === v) ||
      (activeEdge[0] === v && activeEdge[1] === u)
    );
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-6 backdrop-blur-sm overflow-hidden select-none">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* SVG Canvas for Graph rendering */}
      <div className="relative z-10 w-full flex justify-center">
        <svg
          viewBox="0 0 600 320"
          className="w-full max-w-2xl h-[260px] sm:h-[300px] overflow-visible"
        >
          {/* Edges */}
          {graph.edges.map((edge, idx) => {
            const fromNode = graph.nodes.find((n) => n.id === edge.from);
            const toNode = graph.nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const active = isEdgeActive(edge.from, edge.to);
            const visited = isEdgeVisited(edge.from, edge.to);

            let strokeColor = "#94a3b8"; // slate-400
            let strokeWidth = 2;
            let strokeDash = "";

            if (active) {
              strokeColor = "#06b6d4"; // cyan
              strokeWidth = 4;
              strokeDash = "8 6";
            } else if (visited) {
              strokeColor = "#10b981"; // emerald
              strokeWidth = 3;
            }

            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDash}
                className={active ? "animate-laser" : "transition-all duration-300"}
              />
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((node) => {
            const isCurrent = currentNode === node.id;
            const isFrontier = frontierNodes.has(node.id) && !isCurrent;
            const isVisited = visitedNodes.has(node.id) && !isCurrent;

            let fillColor = "#f1f5f9"; // default light slate
            let strokeColor = "#64748b";
            let textColor = "#1e293b";

            if (isCurrent) {
              fillColor = "#8b5cf6"; // purple / violet
              strokeColor = "#c084fc";
              textColor = "#ffffff";
            } else if (isFrontier) {
              fillColor = "#f59e0b"; // amber
              strokeColor = "#fbbf24";
              textColor = "#ffffff";
            } else if (isVisited) {
              fillColor = "#10b981"; // emerald
              strokeColor = "#34d399";
              textColor = "#ffffff";
            }

            return (
              <g
                key={node.id}
                onClick={() => {
                  if (isChallengeMode) {
                    onSelectNode?.(node.id);
                  }
                }}
                className={`cursor-pointer transition-transform duration-200 ${
                  isChallengeMode ? "hover:scale-110" : ""
                }`}
              >
                {/* Ping rings for active node */}
                {isCurrent && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={28}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2.5"
                      className="animate-ping opacity-75"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={36}
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      className="animate-spin opacity-50"
                    />
                  </>
                )}

                {/* Node Circle with Neon Glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3"
                  filter={
                    isCurrent
                      ? "drop-shadow(0 0 10px rgba(139, 92, 246, 0.7))"
                      : isVisited
                      ? "drop-shadow(0 0 6px rgba(16, 185, 129, 0.45))"
                      : undefined
                  }
                  className="shadow-md transition-colors duration-300"
                />

                {/* Node Label */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal Order Breadcrumbs */}
      {currentStep.traversalOrder && currentStep.traversalOrder.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Thứ tự duyệt:
            </span>
            <div className="flex items-center gap-1 font-mono font-bold">
              {currentStep.traversalOrder.map((node, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {node}
                  </span>
                  {i < (currentStep.traversalOrder?.length || 0) - 1 && (
                    <span className="text-slate-400">➔</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Graph Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400 z-10 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 w-full">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Đỉnh đang xét (Current)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Trong Queue / Stack</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Đã thăm (Visited)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-emerald-500" />
          <span>Cạnh đã duyệt</span>
        </div>
      </div>
    </div>
  );
}

// ==================== TREE CANVAS (BST & AVL) ====================
interface FlatNode {
  id: string;
  value: number;
  x: number;
  y: number;
  height?: number;
  balanceFactor?: number;
}
interface FlatEdge {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromVal: number;
  toVal: number;
}

function flattenTree(node: TreeNodeData | null | undefined): { nodes: FlatNode[]; edges: FlatEdge[] } {
  const nodes: FlatNode[] = [];
  const edges: FlatEdge[] = [];
  if (!node || node.x === undefined || node.y === undefined) return { nodes, edges };

  function traverse(curr: TreeNodeData) {
    nodes.push({
      id: curr.id,
      value: curr.value,
      x: curr.x!,
      y: curr.y!,
      height: curr.height,
      balanceFactor: curr.balanceFactor,
    });

    if (curr.left && curr.left.x !== undefined && curr.left.y !== undefined) {
      edges.push({
        fromX: curr.x!,
        fromY: curr.y!,
        toX: curr.left.x,
        toY: curr.left.y,
        fromVal: curr.value,
        toVal: curr.left.value,
      });
      traverse(curr.left);
    }

    if (curr.right && curr.right.x !== undefined && curr.right.y !== undefined) {
      edges.push({
        fromX: curr.x!,
        fromY: curr.y!,
        toX: curr.right.x,
        toY: curr.right.y,
        fromVal: curr.value,
        toVal: curr.right.value,
      });
      traverse(curr.right);
    }
  }

  traverse(node);
  return { nodes, edges };
}

function TreeCanvas({ currentStep }: { currentStep: Step }) {
  const tree = currentStep.tree;
  const { nodes, edges } = flattenTree(tree);

  const activeVal = currentStep.activeNodeValue;
  const unbalancedVal = currentStep.unbalancedNodeValue;
  const foundVal = currentStep.foundNodeValue;
  const highlights = new Set(currentStep.treeHighlights || []);

  return (
    <div className="relative w-full rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-6 backdrop-blur-sm overflow-hidden select-none">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Action / Rotation Badge */}
      <div className="absolute top-3 left-4 flex flex-wrap gap-2 z-10">
        {currentStep.rotationType && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold shadow-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <span>
              Xoay AVL:{" "}
              {currentStep.rotationType === "LL"
                ? "Phải (Single Right - LL)"
                : currentStep.rotationType === "RR"
                ? "Trái (Single Left - RR)"
                : currentStep.rotationType === "LR"
                ? "Kép Trái-Phải (LR Double)"
                : "Kép Phải-Trái (RL Double)"}
            </span>
          </div>
        )}
        {currentStep.treeAction && !currentStep.rotationType && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm">
            <span className="capitalize">
              {currentStep.treeAction === "insert"
                ? "Thao tác: Chèn (Insert)"
                : currentStep.treeAction === "delete"
                ? "Thao tác: Xóa (Delete)"
                : currentStep.treeAction === "search"
                ? "Thao tác: Tìm kiếm (Search)"
                : "Thao tác: Cân bằng (Rebalance)"}
            </span>
          </div>
        )}
      </div>

      {nodes.length === 0 ? (
        <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-slate-400 font-mono text-sm">
          Cây rỗng (Root = null). Đang chuẩn bị chèn node đầu tiên...
        </div>
      ) : (
        <div className="relative z-10 w-full flex justify-center">
          <svg viewBox="0 0 700 320" className="w-full max-w-3xl h-[280px] sm:h-[320px] overflow-visible">
            {/* Edges */}
            {edges.map((edge, idx) => {
              const isPath = highlights.has(edge.fromVal) && highlights.has(edge.toVal);
              return (
                <line
                  key={idx}
                  x1={edge.fromX}
                  y1={edge.fromY}
                  x2={edge.toX}
                  y2={edge.toY}
                  stroke={isPath ? "#10b981" : "#94a3b8"}
                  strokeWidth={isPath ? 3 : 2}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isActive = activeVal === node.value;
              const isUnbalanced = unbalancedVal === node.value;
              const isFound = foundVal === node.value;
              const isHighlighted = highlights.has(node.value) && !isActive && !isFound;

              let fillColor = "#f8fafc";
              let strokeColor = "#64748b";
              let textColor = "#0f172a";

              if (isUnbalanced) {
                fillColor = "#f43f5e"; // rose/red
                strokeColor = "#fda4af";
                textColor = "#ffffff";
              } else if (isActive) {
                fillColor = "#8b5cf6"; // violet
                strokeColor = "#c084fc";
                textColor = "#ffffff";
              } else if (isFound) {
                fillColor = "#10b981"; // emerald
                strokeColor = "#34d399";
                textColor = "#ffffff";
              } else if (isHighlighted) {
                fillColor = "#f59e0b"; // amber
                strokeColor = "#fbbf24";
                textColor = "#ffffff";
              }

              const hasBF = node.balanceFactor !== undefined;
              const bf = node.balanceFactor ?? 0;
              const isBfCritical = Math.abs(bf) > 1;

              return (
                <g key={node.id} className="cursor-pointer transition-transform duration-200">
                  {/* Ping ring for active or unbalanced node */}
                  {(isActive || isUnbalanced) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={26}
                      fill="none"
                      stroke={isUnbalanced ? "#f43f5e" : "#8b5cf6"}
                      strokeWidth="3"
                      className="animate-ping opacity-60"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="3"
                    className="shadow-md transition-colors duration-300"
                  />

                  {/* Value */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.value}
                  </text>

                  {/* AVL Balance Factor & Height Tag */}
                  {hasBF && (
                    <g transform={`translate(${node.x + 14}, ${node.y - 18})`}>
                      <rect
                        width={28}
                        height={16}
                        rx={4}
                        fill={isBfCritical ? "#e11d48" : "#1e293b"}
                        stroke={isBfCritical ? "#f43f5e" : "#475569"}
                        strokeWidth={1}
                      />
                      <text
                        x={14}
                        y={12}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill={isBfCritical ? "#ffffff" : "#94a3b8"}
                        fontFamily="monospace"
                      >
                        {bf > 0 ? `+${bf}` : bf}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Tree Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400 z-10 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 w-full">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Đang xét / So sánh</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Đường đi duyệt (Path)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Vừa chèn / Tìm thấy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Mất cân bằng (|BF| &gt; 1) / Xóa</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
            BF: ±k
          </span>
          <span>Hệ số cân bằng (Balance Factor)</span>
        </div>
      </div>
    </div>
  );
}

// ==================== PATHFINDING CANVAS (2D GRID) ====================
function PathfindingCanvas({
  currentStep,
  onGridChange,
}: {
  currentStep: Step;
  onGridChange?: (walls: [number, number][], start: [number, number], end: [number, number]) => void;
}) {
  const rows = currentStep.gridRows || DEFAULT_GRID_ROWS;
  const cols = currentStep.gridCols || DEFAULT_GRID_COLS;
  const start = currentStep.gridStart || DEFAULT_START;
  const end = currentStep.gridEnd || DEFAULT_END;
  const walls = currentStep.gridWalls || DEFAULT_GRID_WALLS;

  const currentCell = currentStep.currentCell;
  const visitedCells = currentStep.visitedCells || [];
  const frontierCells = currentStep.frontierCells || [];
  const pathCells = currentStep.pathCells || [];
  const pathLength = currentStep.pathLength || 0;
  const pathFound = currentStep.pathFound || false;
  const cellMetrics = currentStep.cellMetrics;

  // Local state for interactive wall drawing & drag start/end
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragMode, setDragMode] = useState<"draw-wall" | "erase-wall" | "move-start" | "move-end" | null>(null);

  // Fast coordinate lookup sets
  const wallKeySet = useMemo(() => new Set(walls.map(([r, c]) => `${r},${c}`)), [walls]);
  const visitedKeySet = useMemo(() => new Set(visitedCells.map(([r, c]) => `${r},${c}`)), [visitedCells]);
  const frontierKeySet = useMemo(() => new Set(frontierCells.map(([r, c]) => `${r},${c}`)), [frontierCells]);
  const pathKeySet = useMemo(() => new Set(pathCells.map(([r, c]) => `${r},${c}`)), [pathCells]);

  const handleCellMouseDown = (r: number, c: number) => {
    if (!onGridChange) return;
    setIsMouseDown(true);

    if (r === start[0] && c === start[1]) {
      setDragMode("move-start");
      return;
    }
    if (r === end[0] && c === end[1]) {
      setDragMode("move-end");
      return;
    }

    const key = `${r},${c}`;
    if (wallKeySet.has(key)) {
      setDragMode("erase-wall");
      const nextWalls = walls.filter(([wr, wc]) => !(wr === r && wc === c));
      onGridChange(nextWalls, start, end);
    } else {
      setDragMode("draw-wall");
      const nextWalls: [number, number][] = [...walls, [r, c]];
      onGridChange(nextWalls, start, end);
    }
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (!isMouseDown || !dragMode || !onGridChange) return;

    if (dragMode === "move-start") {
      if ((r === end[0] && c === end[1]) || wallKeySet.has(`${r},${c}`)) return;
      onGridChange(walls, [r, c], end);
      return;
    }

    if (dragMode === "move-end") {
      if ((r === start[0] && c === start[1]) || wallKeySet.has(`${r},${c}`)) return;
      onGridChange(walls, start, [r, c]);
      return;
    }

    if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) return;

    const key = `${r},${c}`;
    if (dragMode === "draw-wall" && !wallKeySet.has(key)) {
      onGridChange([...walls, [r, c]], start, end);
    } else if (dragMode === "erase-wall" && wallKeySet.has(key)) {
      onGridChange(
        walls.filter(([wr, wc]) => !(wr === r && wc === c)),
        start,
        end
      );
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragMode(null);
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full flex flex-col justify-between items-center p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none"
    >
      {/* Background grid accent pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Grid Top Toolbar: Stats + Quick Maze presets */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        {/* Real-time stats */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-semibold shadow-sm">
            <Footprints className="w-3.5 h-3.5" />
            <span>Đã duyệt: {visitedCells.length} ô</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Độ dài đường đi: {pathLength > 0 ? `${pathLength} bước` : "--"}</span>
          </div>

          {cellMetrics?.fCost !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-mono font-semibold shadow-sm">
              <span>f = {cellMetrics.fCost} (g={cellMetrics.distance}, h={cellMetrics.hCost})</span>
            </div>
          )}

          {pathFound && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md shadow-emerald-500/25 animate-bounce">
              🎯 Đã tới đích!
            </span>
          )}
        </div>

        {/* Maze Generators & Wall Actions */}
        {onGridChange && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onGridChange(generateRandomWalls(rows, cols, start, end, 0.28), start, end)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="Tạo các bức tường ngẫu nhiên"
            >
              <Shuffle className="w-3 h-3 text-emerald-500" />
              <span className="hidden sm:inline">Tường 30%</span>
            </button>

            <button
              onClick={() => onGridChange(generateStaircaseWalls(rows, cols, start, end), start, end)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="Tạo mê cung ziczac"
            >
              <Compass className="w-3 h-3 text-indigo-500" />
              <span className="hidden sm:inline">Mê cung Ziczac</span>
            </button>

            <button
              onClick={() => onGridChange([], start, end)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border border-slate-200 dark:border-slate-700"
              title="Xóa tất cả tường"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Xóa tường</span>
            </button>

            <button
              onClick={() => onGridChange(walls, DEFAULT_START, DEFAULT_END)}
              className="p-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="Đặt lại vị trí Start & End mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid Container (Scrollable on small mobile screens) */}
      <div className="relative z-10 w-full overflow-x-auto py-3 flex items-center justify-center">
        <div
          className="grid gap-[2px] p-2 rounded-xl bg-slate-200/60 dark:bg-slate-950/80 border border-slate-300/80 dark:border-slate-800 shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const isStart = r === start[0] && c === start[1];
              const isEnd = r === end[0] && c === end[1];
              const isCurrent = currentCell && currentCell[0] === r && currentCell[1] === c;
              const key = `${r},${c}`;
              const isWall = wallKeySet.has(key);
              const isPath = pathKeySet.has(key);
              const isVisited = visitedKeySet.has(key);
              const isFrontier = frontierKeySet.has(key);

              // Cell Color Logic
              let cellClass =
                "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800";

              if (isStart) {
                cellClass =
                  "bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-500/40 border-emerald-300 cursor-grab active:cursor-grabbing scale-105 z-20";
              } else if (isEnd) {
                cellClass =
                  "bg-gradient-to-tr from-rose-600 to-rose-400 text-white shadow-lg shadow-rose-500/40 border-rose-300 cursor-grab active:cursor-grabbing scale-105 z-20";
              } else if (isCurrent) {
                cellClass =
                  "bg-white dark:bg-slate-100 text-slate-900 ring-2 ring-amber-400 scale-110 z-30 shadow-md";
              } else if (isPath) {
                cellClass =
                  "bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-lg shadow-amber-400/60 border-amber-300 scale-[1.08] z-20 font-extrabold animate-pulse";
              } else if (isWall) {
                cellClass =
                  "bg-slate-800 dark:bg-slate-200 border-slate-700 dark:border-slate-300 shadow-sm";
              } else if (isVisited) {
                cellClass =
                  "bg-gradient-to-tr from-cyan-600 to-teal-400 border-cyan-300/80 text-white shadow-sm transition-transform duration-200";
              } else if (isFrontier) {
                cellClass =
                  "bg-gradient-to-tr from-purple-600 to-indigo-500 border-purple-400 text-white animate-pulse shadow-sm";
              }

              return (
                <div
                  key={key}
                  onMouseDown={() => handleCellMouseDown(r, c)}
                  onMouseEnter={() => handleCellMouseEnter(r, c)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[4px] flex items-center justify-center transition-all duration-150 select-none ${cellClass}`}
                >
                  {isStart && <Flag className="w-3.5 h-3.5 text-white" />}
                  {isEnd && <Target className="w-3.5 h-3.5 text-white animate-pulse" />}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Grid Legend & Instructions */}
      <div className="relative z-10 w-full mt-2 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[4px] bg-emerald-500 flex items-center justify-center">
              <Flag className="w-2 h-2 text-white" />
            </span>
            <span>Bắt đầu (Start)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[4px] bg-rose-500 flex items-center justify-center">
              <Target className="w-2 h-2 text-white" />
            </span>
            <span>Đích (End)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[4px] bg-slate-800 dark:bg-slate-200" />
            <span>Tường (Wall)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[4px] bg-cyan-500" />
            <span>Đã duyệt (Visited)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[4px] bg-amber-400" />
            <span>Đường ngắn nhất (Path)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
          💡 Mẹo: Nhấn giữ chuột và kéo trên lưới để vẽ/xóa tường, hoặc kéo nút Start/End để đổi chỗ!
        </div>
      </div>
    </div>
  );
}

// ==================== LINKED LIST CANVAS ====================
function LinkedListCanvas({ currentStep }: { currentStep: Step }) {
  const nodes = currentStep.linkedList || [];
  const headId = currentStep.headId;
  const currId = currentStep.currNodeId;
  const prevId = currentStep.prevNodeId;
  const nextId = currentStep.nextNodeId;
  const slowId = currentStep.slowNodeId;
  const fastId = currentStep.fastNodeId;
  const cycleEntryId = currentStep.cycleEntryId;
  const reversedEdges = currentStep.reversedEdges || [];

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] flex flex-col justify-between items-center p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none">
      {/* Background grid accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Status Bar: Pointer Summary */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/60 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {headId && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Head: Node {nodes.find((n) => n.id === headId)?.value}</span>
            </div>
          )}

          {slowId && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm">
              <span>🐢 Rùa (Slow): Node {nodes.find((n) => n.id === slowId)?.value}</span>
            </div>
          )}

          {fastId && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-semibold shadow-sm">
              <span>🐇 Thỏ (Fast): Node {nodes.find((n) => n.id === fastId)?.value}</span>
            </div>
          )}

          {cycleEntryId && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold shadow-sm">
              <span>🔄 Điểm Chu Trình: Node {nodes.find((n) => n.id === cycleEntryId)?.value}</span>
            </div>
          )}
        </div>

        <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          Danh sách: {nodes.length} nodes
        </div>
      </div>

      {/* Main Chain Container */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center overflow-x-auto py-6 px-4">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          {nodes.map((node, idx) => {
            const isHead = node.id === headId;
            const isCurr = node.id === currId;
            const isPrev = node.id === prevId;
            const isNext = node.id === nextId;
            const isSlow = node.id === slowId;
            const isFast = node.id === fastId;
            const isCycleTarget = node.id === cycleEntryId;

            // Check if pointer leaving this node is reversed
            const hasReversedOutgoing = reversedEdges.some(([from]) => from === node.id);

            return (
              <div key={node.id} className="flex items-center">
                {/* Node Structure */}
                <div className="relative flex flex-col items-center">
                  {/* Top Pointer Badges */}
                  <div className="absolute -top-10 flex flex-col items-center gap-0.5 z-20">
                    <div className="flex items-center gap-1">
                      {isHead && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500 text-white shadow-sm">
                          Head
                        </span>
                      )}
                      {isPrev && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-white shadow-sm">
                          prev
                        </span>
                      )}
                      {isCurr && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow-sm animate-bounce">
                          curr
                        </span>
                      )}
                      {isNext && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-white shadow-sm">
                          next
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isSlow && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                          🐢 Slow
                        </span>
                      )}
                      {isFast && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white shadow-sm">
                          🐇 Fast
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Node Capsule Box (Value + Next pointer) */}
                  <div
                    className={`flex items-center rounded-2xl shadow-md transition-all duration-200 border-2 ${
                      isCurr || (isSlow && isFast)
                        ? "border-amber-400 dark:border-amber-400 ring-4 ring-amber-400/20 scale-105"
                        : isSlow
                        ? "border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20"
                        : isFast
                        ? "border-rose-500 dark:border-rose-400 ring-2 ring-rose-500/20"
                        : isCycleTarget
                        ? "border-amber-400/80 dark:border-amber-500/80 bg-amber-50/20"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    }`}
                  >
                    {/* Node Data Compartment */}
                    <div className="w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center font-bold text-base sm:text-lg text-slate-900 dark:text-white font-mono bg-white dark:bg-slate-900 rounded-l-[14px]">
                      {node.value}
                    </div>

                    {/* Node Next Pointer Compartment */}
                    <div className="w-7 sm:w-8 h-12 sm:h-14 border-l border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 rounded-r-[14px] text-slate-400">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          hasReversedOutgoing
                            ? "bg-emerald-500 ring-2 ring-emerald-400"
                            : "bg-slate-400 dark:bg-slate-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Bottom Node Address Index */}
                  <span className="text-[10px] font-mono text-slate-400 mt-1.5">
                    node[{idx}]
                  </span>
                </div>

                {/* Arrow Connector to next node */}
                {idx < nodes.length - 1 && (
                  <div className="w-10 sm:w-14 flex items-center justify-center relative">
                    {hasReversedOutgoing ? (
                      // Reversed Arrow (<-)
                      <div className="w-full flex items-center justify-center text-emerald-500">
                        <svg className="w-full h-6" viewBox="0 0 50 20">
                          <path
                            d="M 45 10 L 5 10 M 12 4 L 4 10 L 12 16"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </div>
                    ) : (
                      // Normal Arrow (->)
                      <div className="w-full flex items-center justify-center text-cyan-500 dark:text-cyan-400">
                        <svg className="w-full h-6" viewBox="0 0 50 20">
                          <path
                            d="M 5 10 L 45 10 M 38 4 L 46 10 L 38 16"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Terminal NULL Block */}
          {!cycleEntryId && (
            <div className="flex items-center pl-2">
              <div className="px-3 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 shadow-inner">
                NULL
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Head (Đầu)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
              C
            </span>
            <span>Con trỏ Hiện tại (curr)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500" />
            <span>Liên kết thuận (Next)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Đã đảo chiều (Reversed)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
          💡 Danh sách liên kết: Mỗi node gồm Dữ liệu (Value) và Địa chỉ con trỏ kế tiếp (.next)
        </div>
      </div>
    </div>
  );
}

// ==================== STACK & QUEUE CANVAS ====================
function StackCanvas({ currentStep }: { currentStep: Step }) {
  const stackItems = currentStep.stackItems || [];
  const inputString = currentStep.inputString || "";
  const charIndex = currentStep.charIndex ?? -1;

  return (
    <div className="relative w-full h-[400px] sm:h-[440px] flex flex-col justify-between items-center p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none">
      {/* Background grid accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Input String Scanning Tape */}
      <div className="relative z-10 w-full flex flex-col items-center gap-1 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Chuỗi ngoặc đầu vào (Input Tape):
        </span>

        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {inputString.split("").map((ch, idx) => {
            const isScanned = idx < charIndex;
            const isCurrent = idx === charIndex;

            return (
              <div key={idx} className="relative flex flex-col items-center">
                {isCurrent && (
                  <span className="absolute -top-5 text-[10px] font-bold text-amber-500 animate-bounce">
                    ↓ Đang đọc
                  </span>
                )}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-base transition-all duration-150 ${
                    isCurrent
                      ? "bg-amber-500 text-white ring-4 ring-amber-400/30 scale-110 shadow-md"
                      : isScanned
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      : "bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {ch}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center: The Glass Tube Stack Chamber */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center py-2">
        <div className="relative flex items-end justify-center">
          {/* Stack Top Pointer Arrow */}
          {stackItems.length > 0 && (
            <div className="absolute -left-20 top-2 sm:top-4 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono animate-pulse">
              <span>ĐỈNH TOP</span>
              <span>→</span>
            </div>
          )}

          {/* The U-Shaped Glass Container */}
          <div className="w-44 sm:w-52 h-48 border-b-4 border-l-4 border-r-4 border-slate-300 dark:border-slate-600 rounded-b-3xl bg-slate-200/20 dark:bg-slate-950/40 flex flex-col-reverse items-center p-2.5 gap-2 overflow-hidden shadow-inner backdrop-blur-sm">
            {stackItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs italic">
                <span>Ngăn xếp rỗng</span>
                <span className="text-[10px] text-slate-500">(Stack is empty)</span>
              </div>
            ) : (
              stackItems.map((item, idx) => {
                let badgeStyle = "bg-indigo-600 text-white";
                if (item.status === "push") badgeStyle = "bg-amber-500 text-white animate-bounce shadow-lg shadow-amber-500/30";
                if (item.status === "matched") badgeStyle = "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30";
                if (item.status === "unmatched") badgeStyle = "bg-rose-500 text-white animate-shake shadow-lg shadow-rose-500/30";

                return (
                  <div
                    key={item.id}
                    className={`w-full py-2 px-4 rounded-xl flex items-center justify-between text-sm font-mono font-bold shadow-md transition-all duration-200 ${badgeStyle}`}
                  >
                    <span className="text-lg">{item.value}</span>
                    <span className="text-[10px] font-sans opacity-80 uppercase">
                      {idx === stackItems.length - 1 ? "Top" : `#${idx + 1}`}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Legend & Principle */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span>PUSH (Đẩy vào đỉnh Stack)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span>POP (Khớp cặp ngoặc)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span>Lỗi sai ngoặc (Mismatch)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
          💡 Nguyên lý LIFO (Last In First Out): Phần tử vào sau cùng sẽ được lấy ra đầu tiên
        </div>
      </div>
    </div>
  );
}

// ==================== DYNAMIC PROGRAMMING (KNAPSACK) CANVAS ====================
function DpCanvas({ currentStep }: { currentStep: Step }) {
  const dpTable = currentStep.dpTable || [];
  const rowLabels = currentStep.dpRowLabels || [];
  const colLabels = currentStep.dpColLabels || [];
  const currentCell = currentStep.currentDpCell;
  const sourceCells = currentStep.dpSourceCells || [];
  const selectedItems = currentStep.selectedItems || [];
  const items = currentStep.knapsackItems || [];
  const capacity = currentStep.knapsackCapacity ?? 7;
  const totalValue = currentStep.totalValue ?? 0;
  const totalWeight = currentStep.totalWeight ?? 0;

  return (
    <div className="relative w-full min-h-[480px] flex flex-col justify-between items-center p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none space-y-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Bảng Ma Trận Quy Hoạch Động (0/1 Knapsack)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                2D DP Table
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Công thức: dp[i][w] = max(dp[i-1][w], dp[i-1][w - w_i] + v_i)
            </p>
          </div>
        </div>

        {/* Live Knapsack stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Package className="w-3.5 h-3.5 text-amber-500" />
            <span>Khối lượng:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {totalWeight}/{capacity}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tổng Giá Trị:</span>
            <span className="font-mono text-sm">{totalValue}</span>
          </div>
        </div>
      </div>

      {/* Formula & Calculation Callout */}
      {currentStep.dpFormula && (
        <div className="relative z-10 w-full py-2 px-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px] tracking-wider bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800">
              Phép tính hiện tại
            </span>
            <span className="font-semibold text-sm">{currentStep.dpFormula}</span>
          </div>
          {currentCell && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Ô đang xét: [{currentCell[0]}, {currentCell[1]}]
            </span>
          )}
        </div>
      )}

      {/* 2D DP Matrix Table */}
      <div className="relative z-10 w-full overflow-x-auto no-scrollbar py-2">
        <table className="w-full border-collapse text-xs font-mono select-none">
          <thead>
            <tr>
              <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-left text-slate-600 dark:text-slate-300 font-sans font-bold text-[11px] sticky left-0 z-20 min-w-[140px] sm:min-w-[170px]">
                Đồ vật \ Sức chứa W
              </th>
              {colLabels.map((col, idx) => (
                <th
                  key={idx}
                  className={`p-2 border border-slate-200 dark:border-slate-800 text-center font-bold min-w-[42px] ${
                    currentCell && currentCell[1] === col
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dpTable.map((row, rIdx) => {
              const isCurrentRow = currentCell && currentCell[0] === rIdx;
              const isItemPicked = selectedItems.includes(rIdx);

              return (
                <tr key={rIdx} className={isCurrentRow ? "bg-amber-500/5 dark:bg-amber-500/10" : ""}>
                  {/* Row Label (Sticky on horizontal scroll) */}
                  <td
                    className={`p-2 border border-slate-200 dark:border-slate-800 font-sans text-xs font-semibold sticky left-0 z-10 ${
                      isItemPicked
                        ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border-l-4 border-l-emerald-500"
                        : isCurrentRow
                        ? "bg-amber-100/90 dark:bg-slate-800 text-amber-800 dark:text-amber-300 font-bold border-l-4 border-l-amber-500"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate">{rowLabels[rIdx] || `Hàng ${rIdx}`}</span>
                      {isItemPicked && (
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-500 text-white font-extrabold shrink-0">
                          Đã chọn
                        </span>
                      )}
                    </div>
                  </td>

                  {/* DP Cells */}
                  {row.map((cellVal, cIdx) => {
                    const isCellActive = currentCell && currentCell[0] === rIdx && currentCell[1] === cIdx;
                    const isCellSource = sourceCells.some(([sr, sc]) => sr === rIdx && sc === cIdx);

                    let cellStyle = "bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800";

                    if (isCellActive) {
                      cellStyle = "bg-amber-400 text-slate-950 font-extrabold scale-110 shadow-lg shadow-amber-500/40 ring-2 ring-amber-500 z-10 transition-transform duration-150";
                    } else if (isCellSource) {
                      cellStyle = "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold ring-2 ring-cyan-400 dark:ring-cyan-500 z-10";
                    } else if (isItemPicked && cellVal > 0) {
                      cellStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-300/40 dark:border-emerald-700/40";
                    }

                    return (
                      <td
                        key={cIdx}
                        className={`p-2 border text-center font-mono font-bold text-sm transition-all duration-200 ${cellStyle}`}
                      >
                        {cellVal}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Available Items Shelf */}
      {items.length > 0 && (
        <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Danh sách đồ vật có sẵn ({items.length} món)</span>
            <span>Sức chứa tối đa: {capacity}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {items.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              const isConsidering = currentCell && currentCell[0] === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-sm"
                      : isConsidering
                      ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 shadow-sm ring-1 ring-amber-400"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                    <span>{item.name}</span>
                    {isSelected ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                        ✔ Balo
                      </span>
                    ) : isConsidering ? (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold animate-pulse">
                        Đang xét
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>Khối lượng: {item.weight}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +{item.value}đ
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500 shadow-xs" />
            <span>Ô đang tính dp[i][w]</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-cyan-400/50 border border-cyan-400" />
            <span>Ô nguồn so sánh: dp[i-1][w] & dp[i-1][w-w_i]</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600" />
            <span>Đồ vật được chọn sau Truy vết</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          💡 dp[i][w] lưu giá trị lớn nhất có thể đạt được với i đồ vật đầu và sức chứa w
        </div>
      </div>
    </div>
  );
}

// ==================== BACKTRACKING (N-QUEENS) CANVAS ====================
function NQueensCanvas({ currentStep }: { currentStep: Step }) {
  const board = currentStep.nQueensBoard || [];
  const n = currentStep.boardSize || board.length || 4;
  const currentQueen = currentStep.currentQueen;
  const conflicts = currentStep.queenConflicts || [];
  const isBacktracking = currentStep.isBacktracking;
  const isSolution = currentStep.isSolution;
  const backtrackCount = currentStep.backtrackCount ?? 0;

  const queensPlaced = board.filter((c) => c !== -1).length;

  return (
    <div className="relative w-full min-h-[480px] flex flex-col justify-between items-center p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none space-y-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Bàn Cờ Vua N-Queens ({n} × {n})</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Backtracking
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Đặt {n} quân Hậu sao cho không có 2 quân Hậu nào khống chế lẫn nhau
            </p>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Quân trên bàn:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {queensPlaced}/{n}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 shadow-2xs">
            <Undo2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Quay lui:</span>
            <span className="font-mono">{backtrackCount} lần</span>
          </div>
        </div>
      </div>

      {/* Dynamic Status Alert Banner */}
      {isSolution ? (
        <div className="relative z-10 w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>🎉 ĐÃ TÌM THẤY LỜI GIẢI HOÀN HẢO! Cả {n} quân Hậu được xếp an toàn không bị chiếu.</span>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
            Solution Found
          </span>
        </div>
      ) : isBacktracking ? (
        <div className="relative z-10 w-full py-2 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <Undo2 className="w-4 h-4 text-rose-500 shrink-0 animate-spin" />
          <span>↩️ Đang Quay Lui (Backtrack): Nhánh phía dưới là ngõ cụt, rút lại quân Hậu để thử vị trí mới...</span>
        </div>
      ) : conflicts.length > 0 && currentQueen ? (
        <div className="relative z-10 w-full py-2 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Ô [{currentQueen[0]}, {currentQueen[1]}] bị chiếu bởi quân Hậu ở [{conflicts[0][0]}, {conflicts[0][1]}]!</span>
        </div>
      ) : null}

      {/* Chessboard Grid */}
      <div className="relative z-10 flex flex-col items-center justify-center py-2">
        <div className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-xl">
          {/* Top Column Labels */}
          <div className="flex pl-6 pb-1">
            {Array.from({ length: n }).map((_, c) => (
              <div
                key={c}
                className="w-14 sm:w-16 text-center text-xs font-mono font-bold text-slate-500 dark:text-slate-400"
              >
                {String.fromCharCode(65 + c)}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-0 border-2 border-slate-400/60 dark:border-slate-600 rounded-xl overflow-hidden shadow-inner">
            {Array.from({ length: n }).map((_, r) => {
              const queenCol = board[r];

              return (
                <div key={r} className="flex items-center">
                  {/* Row Label */}
                  <div className="w-6 text-center text-xs font-mono font-bold text-slate-500 dark:text-slate-400 pr-1">
                    {r}
                  </div>

                  {/* Squares in row */}
                  {Array.from({ length: n }).map((_, c) => {
                    const isDarkSquare = (r + c) % 2 === 1;
                    const hasQueen = queenCol === c;
                    const isTesting = currentQueen && currentQueen[0] === r && currentQueen[1] === c;
                    const isConflicted = conflicts.some(([cr, cc]) => cr === r && cc === c);
                    const isAttacked = isTesting && conflicts.length > 0;

                    let squareBg = isDarkSquare
                      ? "bg-slate-300 dark:bg-slate-800"
                      : "bg-slate-100 dark:bg-slate-700";

                    if (isAttacked) {
                      squareBg = "bg-rose-500/30 dark:bg-rose-950/70";
                    } else if (isTesting && !isAttacked) {
                      squareBg = "bg-emerald-500/30 dark:bg-emerald-950/70";
                    } else if (hasQueen && isSolution) {
                      squareBg = "bg-amber-400/30 dark:bg-amber-950/60";
                    }

                    return (
                      <div
                        key={c}
                        className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center relative transition-colors duration-200 ${squareBg}`}
                      >
                        {/* Queen Crown Piece */}
                        {hasQueen && (
                          <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative z-10 flex flex-col items-center justify-center cursor-pointer"
                          >
                            <div
                              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                                isSolution
                                  ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-amber-500/50 scale-110 animate-bounce"
                                  : "bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-900 shadow-amber-500/30 hover:scale-105"
                              }`}
                            >
                              <Crown className="w-6 h-6 fill-current" />
                            </div>
                            <span className="text-[9px] font-mono font-bold mt-0.5 text-slate-700 dark:text-slate-300">
                              Q{r + 1}
                            </span>
                          </motion.div>
                        )}

                        {/* Testing indicator / Attack Warning */}
                        {isTesting && !hasQueen && (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center"
                          >
                            {isAttacked ? (
                              <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-pulse">
                                <XCircle className="w-5 h-5" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Conflicted cell marker if another queen attacks */}
                        {isConflicted && (
                          <div className="absolute inset-0 border-2 border-dashed border-rose-500 pointer-events-none animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Principle */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-400 flex items-center justify-center text-[10px]">👑</span>
            <span>Quân Hậu (Queen)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span>Vị trí an toàn</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span>Xung đột / Bị chiếu</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Undo2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Quay lui (Rút quân thử lại)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          💡 Thử lần lượt các cột trên mỗi hàng ➔ Gặp ngõ cụt sẽ quay lui (Backtrack)
        </div>
      </div>
    </div>
  );
}

// ==================== TRIE (PREFIX TREE) CANVAS ====================
function TrieCanvas({ currentStep }: { currentStep: Step }) {
  const root = currentStep.trie;
  const activePath = currentStep.trieActivePath || [];
  const currentWord = currentStep.trieCurrentWord;
  const action = currentStep.trieAction || "insert";
  const suggestions = currentStep.trieSuggestions || [];

  const renderTrieNode = (node: import("@/lib/types").TrieNodeData, level: number = 0) => {
    const isActive = activePath.includes(node.id);
    const childrenKeys = Object.keys(node.children);

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Circle */}
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center font-mono font-bold text-sm shadow-md transition-all duration-300 relative ${
            isActive
              ? "bg-amber-400 text-slate-950 scale-110 shadow-lg shadow-amber-500/40 ring-4 ring-amber-400/50"
              : node.isEndOfWord
              ? "bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-400"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700"
          }`}
        >
          <span>{node.char}</span>
          {node.isEndOfWord && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" title={`Từ: ${node.word}`} />
          )}
        </div>

        {node.word && node.isEndOfWord && (
          <span className="mt-1 px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-[10px] font-sans font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            {node.word}
          </span>
        )}

        {/* Children Row */}
        {childrenKeys.length > 0 && (
          <div className="flex items-start gap-4 sm:gap-6 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            {childrenKeys.map((char) => renderTrieNode(node.children[char], level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-[460px] flex flex-col justify-between items-center p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none space-y-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Cây Tiền Tố Trie (Prefix Tree)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {action === "autocomplete" ? "Gợi ý Autocomplete" : "Nạp từ vào từ điển"}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chia sẻ tiền tố chung giữa các từ, tìm kiếm theo độ dài từ O(L)
            </p>
          </div>
        </div>

        {currentWord && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-300 shadow-2xs">
            <span>Từ đang xét:</span>
            <span className="font-mono text-sm uppercase px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border">
              {currentWord}
            </span>
          </div>
        )}
      </div>

      {/* Autocomplete Suggestions Banner */}
      {suggestions.length > 0 && (
        <div className="relative z-10 w-full p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Kết quả gợi ý tìm kiếm cho tiền tố &quot;{currentWord}&quot;:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {suggestions.map((s, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-mono font-bold text-xs shadow-sm animate-bounce"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tree Visualization Area */}
      <div className="relative z-10 w-full overflow-x-auto no-scrollbar py-4 flex justify-center items-center min-h-[260px]">
        {root ? renderTrieNode(root) : <div className="text-slate-400">Đang tải Trie...</div>}
      </div>

      {/* Legend */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500" />
            <span>Node đang duyệt (Active Path)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-600" />
            <span>Ký tự kết thúc từ (isEndOfWord)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-400" />
            <span>Node tiền tố thông thường</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          💡 Tất cả từ có chung tiền tố sẽ hội tụ về cùng một đường đi từ Root
        </div>
      </div>
    </div>
  );
}

// ==================== KMP (STRING MATCHING) CANVAS ====================
function KmpCanvas({ currentStep }: { currentStep: Step }) {
  const text = currentStep.kmpText || "";
  const pattern = currentStep.kmpPattern || "";
  const lps = currentStep.kmpLps || [];
  const textIdx = currentStep.kmpTextIndex ?? -1;
  const patIdx = currentStep.kmpPatternIndex ?? -1;
  const matches = currentStep.kmpMatchedIndices || [];
  const state = currentStep.kmpState;

  return (
    <div className="relative w-full min-h-[460px] flex flex-col justify-between items-center p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none space-y-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <CaseSensitive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Thuật Toán KMP (Knuth-Morris-Pratt)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                LPS Array O(N+M)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tìm kiếm chuỗi con không quay lui con trỏ văn bản nhờ bảng tiền tố LPS
            </p>
          </div>
        </div>

        {/* Live Matches Counter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tìm thấy:</span>
            <span className="font-mono text-sm">{matches.length} lần</span>
          </div>
        </div>
      </div>

      {/* Main Text vs Pattern Alignment Box */}
      <div className="relative z-10 w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 overflow-x-auto no-scrollbar">
        {/* Text String Row */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>Văn bản (Text) - Con trỏ i = {textIdx >= 0 ? textIdx : 0}</span>
            <span className="font-mono text-[11px]">Độ dài: {text.length}</span>
          </div>
          <div className="flex items-center gap-1">
            {text.split("").map((char, idx) => {
              const isCurrent = idx === textIdx;
              const isMatched = matches.some((m) => idx >= m && idx < m + pattern.length);

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-9 sm:w-9 sm:h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all duration-150 ${
                      isCurrent
                        ? state === "match" || state === "found"
                          ? "bg-emerald-500 text-white scale-110 shadow-lg ring-2 ring-emerald-400"
                          : state === "mismatch"
                          ? "bg-rose-500 text-white scale-110 shadow-lg ring-2 ring-rose-400"
                          : "bg-amber-400 text-slate-950 scale-110 shadow-lg ring-2 ring-amber-400"
                        : isMatched
                        ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {char}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pattern String Row */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>Mẫu tìm kiếm (Pattern) - Con trỏ j = {patIdx >= 0 ? patIdx : 0}</span>
            <span className="font-mono text-[11px]">Độ dài: {pattern.length}</span>
          </div>
          <div className="flex items-center gap-1">
            {pattern.split("").map((char, idx) => {
              const isCurrent = idx === patIdx;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-9 sm:w-9 sm:h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all duration-150 ${
                      isCurrent
                        ? state === "match" || state === "found"
                          ? "bg-emerald-500 text-white scale-110 shadow-lg ring-2 ring-emerald-400"
                          : state === "mismatch"
                          ? "bg-rose-500 text-white scale-110 shadow-lg ring-2 ring-rose-400"
                          : "bg-amber-400 text-slate-950 scale-110 shadow-lg ring-2 ring-amber-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {char}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">j={idx}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* LPS Table Display */}
      {lps.length > 0 && (
        <div className="relative z-10 w-full p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Bảng Tiền tố - Hậu tố LPS (Longest Prefix Suffix Array)</span>
            <span className="text-[11px] text-slate-400 italic">Vị trí nhảy cóc khi mismatch</span>
          </div>
          <div className="flex items-center gap-1">
            {lps.map((val, idx) => {
              const isCurrent = idx === patIdx;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                      isCurrent
                        ? "bg-cyan-500 text-white shadow-md ring-2 ring-cyan-300 font-extrabold"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {val}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">{pattern[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
            <span>Ký tự trùng khớp (Match)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-500" />
            <span>Ký tự lệch (Mismatch)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-cyan-500" />
            <span>Nhảy con trỏ LPS Jump</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          💡 Con trỏ văn bản i luôn chỉ tiến, không bao giờ quay lui
        </div>
      </div>
    </div>
  );
}

// ==================== KRUSKAL & DSU CANVAS ====================
function DsuCanvas({ currentStep }: { currentStep: Step }) {
  const graph = currentStep.graph;
  const edges = currentStep.dsuEdges || [];
  const components = currentStep.dsuComponents || {};
  const activeEdge = currentStep.activeEdge;
  const mstWeight = currentStep.mstWeight ?? 0;
  const acceptedCount = currentStep.mstEdgesCount ?? 0;
  const totalNodes = graph?.nodes.length || 6;

  return (
    <div className="relative w-full min-h-[480px] flex flex-col justify-between items-center p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none space-y-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Kruskal&apos;s MST & Disjoint Set Union (DSU)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                Cây Khung Nhỏ Nhất
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sắp xếp cạnh tăng dần và dùng DSU kiểm tra chu trình trong O(E log E)
            </p>
          </div>
        </div>

        {/* Live MST Metrics */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs font-semibold">
            <span>Cạnh MST:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {acceptedCount} / {totalNodes - 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tổng Trọng Số:</span>
            <span className="font-mono text-sm">{mstWeight}</span>
          </div>
        </div>
      </div>

      {/* Graph Display Area */}
      <div className="relative z-10 w-full h-[260px] flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 620 340">
          {/* Edges */}
          {edges.map((e, idx) => {
            const uNode = graph?.nodes.find((n) => n.id === e.from);
            const vNode = graph?.nodes.find((n) => n.id === e.to);
            if (!uNode || !vNode) return null;

            const isAccepted = e.status === "accepted";
            const isRejected = e.status === "rejected";
            const isConsidering = e.status === "considering";

            let strokeColor = "#94a3b8";
            let strokeWidth = 2;
            let strokeDasharray = undefined;

            if (isAccepted) {
              strokeColor = "#10b981";
              strokeWidth = 4;
            } else if (isRejected) {
              strokeColor = "#f43f5e";
              strokeWidth = 2;
              strokeDasharray = "5,5";
            } else if (isConsidering) {
              strokeColor = "#f59e0b";
              strokeWidth = 4;
            }

            const midX = (uNode.x + vNode.x) / 2;
            const midY = (uNode.y + vNode.y) / 2;

            return (
              <g key={idx}>
                <line
                  x1={uNode.x}
                  y1={uNode.y}
                  x2={vNode.x}
                  y2={vNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  className="transition-all duration-300"
                />
                <circle cx={midX} cy={midY} r={12} fill="#ffffff" stroke={strokeColor} strokeWidth={1.5} />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className="text-[11px] font-mono font-bold fill-slate-800 dark:fill-slate-900"
                >
                  {e.weight}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {graph?.nodes.map((node) => {
            const color = components[node.id] || "#10b981";

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={3}
                  className="shadow-md transition-all duration-300"
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="text-sm font-bold font-mono fill-white drop-shadow-sm select-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Sorted Edge Queue Shelf */}
      <div className="relative z-10 w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
          <span>Hàng đợi cạnh sắp xếp tăng dần ({edges.length} cạnh)</span>
          <span className="text-[11px]">Xét lần lượt từ nhỏ đến lớn</span>
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          {edges.map((e, idx) => {
            let badgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
            if (e.status === "accepted") {
              badgeStyle = "bg-emerald-500 text-white border-emerald-600 shadow-xs font-bold";
            } else if (e.status === "rejected") {
              badgeStyle = "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 line-through opacity-70";
            } else if (e.status === "considering") {
              badgeStyle = "bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-400 shadow-md font-bold scale-105 animate-pulse";
            }

            return (
              <div
                key={idx}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border whitespace-nowrap transition-all duration-200 ${badgeStyle}`}
              >
                <span>{e.from}-{e.to}</span>
                <span className="opacity-80 ml-1">({e.weight})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
            <span>Cạnh chấp nhận (Accepted vào MST)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-500" />
            <span>Cạnh loại bỏ (Tạo chu trình kín)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" />
            <span>Màu sắc = Tập hợp DSU (Cùng màu là cùng nhóm)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          💡 find(u) == find(v) ➔ Cùng gốc sẽ tạo chu trình kín, bỏ qua ngay!
        </div>
      </div>
    </div>
  );
}

// ==================== SEGMENT TREE CANVAS ====================
function SegmentTreeCanvas({ currentStep }: { currentStep: Step }) {
  const root = currentStep.segTree;
  const arr = currentStep.segTreeArray || [];
  const queryRange = currentStep.segTreeQueryRange;
  const updatedIdx = currentStep.segTreeUpdatedIndex;
  const action = currentStep.segTreeAction;

  const renderSegNode = (node: import("@/lib/types").SegTreeNodeData) => {
    let nodeStyle = "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700";

    if (node.status === "matched") {
      nodeStyle = "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-400/50 shadow-lg scale-105 font-extrabold";
    } else if (node.status === "inspecting") {
      nodeStyle = "bg-cyan-500 text-white border-cyan-600 ring-2 ring-cyan-400 shadow-md font-bold";
    } else if (node.status === "updated") {
      nodeStyle = "bg-amber-400 text-slate-950 border-amber-500 ring-4 ring-amber-400/50 shadow-lg scale-105 font-extrabold animate-pulse";
    }

    return (
      <div key={node.id} className="flex flex-col items-center">
        <div
          className={`px-3 py-1.5 rounded-xl flex flex-col items-center justify-center font-mono text-xs border shadow-sm transition-all duration-200 ${nodeStyle}`}
        >
          <span className="font-bold text-sm">{node.sum}</span>
          <span className="text-[10px] opacity-80">[{node.range[0]}, {node.range[1]}]</span>
        </div>

        {(node.left || node.right) && (
          <div className="flex items-start gap-4 sm:gap-8 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            {node.left && renderSegNode(node.left)}
            {node.right && renderSegNode(node.right)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-[480px] flex flex-col justify-between items-center p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none space-y-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Cây Phân Đoạn (Segment Tree)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                Range Query & Update O(log N)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lưu trữ tổng đoạn con, hỗ trợ truy vấn và cập nhật điểm siêu tốc
            </p>
          </div>
        </div>

        {queryRange && action === "query" && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-2xs">
            <span>Truy vấn đoạn:</span>
            <span className="font-mono text-sm px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border">
              [{queryRange[0]}, {queryRange[1]}]
            </span>
          </div>
        )}
      </div>

      {/* Underlying Array Row */}
      <div className="relative z-10 w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Mảng gốc (Underlying Array)</span>
          <span className="text-[11px] font-mono">N = {arr.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {arr.map((val, idx) => {
            const inQuery = queryRange && idx >= queryRange[0] && idx <= queryRange[1] && action === "query";
            const isUpdated = idx === updatedIdx && action === "update";

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 ${
                    isUpdated
                      ? "bg-amber-400 text-slate-950 scale-110 shadow-md ring-2 ring-amber-400"
                      : inQuery
                      ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-400 font-extrabold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {val}
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Segment Tree Render Area */}
      <div className="relative z-10 w-full overflow-x-auto no-scrollbar py-3 flex justify-center items-center min-h-[220px]">
        {root ? renderSegNode(root) : <div className="text-slate-400">Đang tải Segment Tree...</div>}
      </div>

      {/* Legend */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
            <span>Node khớp hoàn toàn (Lấy ngay giá trị sum)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-cyan-500" />
            <span>Giao nhau một phần (Rẽ xuống 2 con)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-400" />
            <span>Đường cập nhật giá trị Point Update</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          💡 Đoạn bất kỳ luôn được biểu diễn bằng không quá 2 × log₂(N) node
        </div>
      </div>
    </div>
  );
}

// ==================== TOPOLOGICAL SORT CANVAS ====================
function TopologicalSortCanvas({ currentStep }: { currentStep: Step }) {
  const graph = currentStep.graph;
  const inDegree = currentStep.inDegree || {};
  const queue = currentStep.topoQueue || [];
  const order = currentStep.topoOrder || [];
  const activeNode = currentStep.activeTopoNode;
  const activeEdges = currentStep.activeOutgoingEdges || [];

  return (
    <div className="relative w-full min-h-[480px] flex flex-col justify-between items-center p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none space-y-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Sắp Xếp Tô-pô (Topological Sort - Thuật toán Kahn)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                DAG & In-Degree O(V+E)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lập trình tự hoàn thành môn học hợp lệ theo các điều kiện tiên quyết
            </p>
          </div>
        </div>

        {/* Live Queue Box */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs font-semibold">
          <span>Hàng đợi In-Degree = 0:</span>
          {queue.length === 0 ? (
            <span className="text-slate-400 italic font-mono text-[11px]">(Trống)</span>
          ) : (
            <div className="flex items-center gap-1 font-mono font-bold text-amber-700 dark:text-amber-300">
              {queue.map((q, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-amber-300">
                  {q}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Graph Display Area */}
      <div className="relative z-10 w-full h-[240px] flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 650 300">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Directed Edges */}
          {graph?.edges.map((e, idx) => {
            const uNode = graph.nodes.find((n) => n.id === e.from);
            const vNode = graph.nodes.find((n) => n.id === e.to);
            if (!uNode || !vNode) return null;

            const isRemoved = activeEdges.some(([from, to]) => from === e.from && to === e.to);
            const isFinished = order.includes(e.from);

            return (
              <line
                key={idx}
                x1={uNode.x}
                y1={uNode.y}
                x2={vNode.x}
                y2={vNode.y}
                stroke={isRemoved ? "#f59e0b" : isFinished ? "#cbd5e1" : "#94a3b8"}
                strokeWidth={isRemoved ? 3 : 2}
                strokeDasharray={isFinished && !isRemoved ? "4,4" : undefined}
                markerEnd={isRemoved ? "url(#arrow-active)" : "url(#arrow)"}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Nodes */}
          {graph?.nodes.map((node) => {
            const deg = inDegree[node.id] ?? 0;
            const isCompleted = order.includes(node.id);
            const isActive = activeNode === node.id;
            const inQueue = queue.includes(node.id);

            let nodeColor = "#3b82f6";
            if (isCompleted) nodeColor = "#10b981";
            if (isActive) nodeColor = "#f59e0b";
            if (inQueue) nodeColor = "#06b6d4";

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill={nodeColor}
                  stroke="#ffffff"
                  strokeWidth={3}
                  className="shadow-md transition-all duration-300"
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className="text-xs font-bold font-mono fill-white drop-shadow-sm select-none"
                >
                  {node.id}
                </text>

                {/* In-Degree Counter Badge */}
                <circle cx={node.x + 16} cy={node.y - 16} r={10} fill="#0f172a" stroke="#ffffff" strokeWidth={1.5} />
                <text
                  x={node.x + 16}
                  y={node.y - 13}
                  textAnchor="middle"
                  className="text-[10px] font-mono font-bold fill-white"
                >
                  {deg}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Sorted Linear Runway */}
      <div className="relative z-10 w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Thứ tự học tập hợp lệ (Topological Order)</span>
          <span className="font-mono text-[11px]">{order.length} / {graph?.nodes.length || 6} môn</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          {order.length === 0 ? (
            <span className="text-xs text-slate-400 italic">Chưa có môn nào được xuất...</span>
          ) : (
            order.map((cId, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-mono font-bold text-xs shadow-sm flex items-center gap-1.5">
                  <span className="text-[10px] opacity-80">#{idx + 1}</span>
                  <span>{cId}</span>
                </div>
                {idx < order.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
            <span>Môn đã hoàn thành (Xếp vào danh sách)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-500" />
            <span>In-Degree = 0 (Đang đợi trong Queue)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
            <span>Đang gỡ bỏ các cạnh tiên quyết</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          💡 Số tròn nhỏ góc trên mỗi node là Bán bậc vào (In-Degree)
        </div>
      </div>
    </div>
  );
}

// ==================== LCS (LONGEST COMMON SUBSEQUENCE) CANVAS ====================
function LcsCanvas({ currentStep }: { currentStep: Step }) {
  const str1 = currentStep.lcsString1 || "";
  const str2 = currentStep.lcsString2 || "";
  const dp = currentStep.lcsTable || [];
  const currentCell = currentStep.currentLcsCell;
  const backtrackPath = currentStep.lcsBacktrackPath || [];
  const result = currentStep.lcsResult || "";

  return (
    <div className="relative w-full min-h-[480px] flex flex-col justify-between items-center p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm overflow-hidden select-none space-y-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>Chuỗi Con Chung Dài Nhất (Longest Common Subsequence)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-800">
                2D DP Table & Git Diff
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Công thức: Nếu khớp dp[i][j] = dp[i-1][j-1] + 1; Ngược lại max(Trên, Trái)
            </p>
          </div>
        </div>

        {/* Live LCS Result */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Chuỗi LCS:</span>
            <span className="font-mono text-sm uppercase px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border">
              {result.length > 0 ? result : "..."}
            </span>
          </div>
        </div>
      </div>

      {/* 2D DP Table for LCS */}
      <div className="relative z-10 w-full overflow-x-auto no-scrollbar py-2">
        <table className="w-full border-collapse text-xs font-mono select-none">
          <thead>
            <tr>
              <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-center font-bold text-slate-500">
                S1 \ S2
              </th>
              <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-center font-bold text-slate-400 min-w-[36px]">
                Ø
              </th>
              {str2.split("").map((c, idx) => (
                <th
                  key={idx}
                  className={`p-2 border border-slate-200 dark:border-slate-800 text-center font-bold min-w-[36px] ${
                    currentCell && currentCell[1] === idx + 1
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, rIdx) => {
              const isCurrentRow = currentCell && currentCell[0] === rIdx;
              const rowChar = rIdx === 0 ? "Ø" : str1[rIdx - 1];

              return (
                <tr key={rIdx} className={isCurrentRow ? "bg-amber-500/5 dark:bg-amber-500/10" : ""}>
                  <td
                    className={`p-2 border border-slate-200 dark:border-slate-800 font-sans text-xs font-bold text-center ${
                      isCurrentRow
                        ? "bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border-l-4 border-l-amber-500"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {rowChar}
                  </td>

                  {row.map((val, cIdx) => {
                    const isCellActive = currentCell && currentCell[0] === rIdx && currentCell[1] === cIdx;
                    const inBacktrack = backtrackPath.some(([br, bc]) => br === rIdx && bc === cIdx);

                    let cellStyle = "bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800";

                    if (isCellActive) {
                      cellStyle = "bg-amber-400 text-slate-950 font-extrabold scale-110 shadow-lg shadow-amber-500/40 ring-2 ring-amber-500 z-10 transition-transform duration-150";
                    } else if (inBacktrack) {
                      cellStyle = "bg-emerald-500 text-white font-extrabold shadow-sm ring-2 ring-emerald-400 z-10";
                    }

                    return (
                      <td
                        key={cIdx}
                        className={`p-2 border text-center font-mono font-bold text-sm transition-all duration-200 ${cellStyle}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="relative z-10 w-full pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-400" />
            <span>Ô đang tính dp[i][j]</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
            <span>Đường truy vết (Backtrack Path tạo chuỗi LCS)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          💡 Khi 2 ký tự trùng nhau, ta lùi chéo lên trên và ghi nhận ký tự vào kết quả
        </div>
      </div>
    </div>
  );
}


