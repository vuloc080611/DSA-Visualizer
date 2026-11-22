"use client";

import { Step, AlgorithmCategory, TreeNodeData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowDown, Activity } from "lucide-react";

interface VisualizerCanvasProps {
  currentStep: Step;
  category: AlgorithmCategory;
  arraySize?: number;
}

export function VisualizerCanvas({ currentStep, category }: VisualizerCanvasProps) {
  // If it's a graph algorithm (BFS/DFS), render the Graph Canvas
  if (category === "graph" && currentStep.graph) {
    return <GraphCanvas currentStep={currentStep} />;
  }

  // If it's a tree algorithm (BST / AVL), render the Tree Canvas
  if (category === "tree") {
    return <TreeCanvas currentStep={currentStep} />;
  }

  // Array / Sorting / Searching / Window Canvas
  return <ArrayCanvas currentStep={currentStep} />;
}

// ==================== ARRAY CANVAS ====================
function ArrayCanvas({ currentStep }: { currentStep: Step }) {
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

          if (isSorted) {
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
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full max-w-[56px] min-w-[20px]">
              {/* Pointer indicator above bar */}
              <div className="h-6 flex items-center justify-center">
                {isPivot && (
                  <motion.div
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-tight text-purple-600 dark:text-purple-300">
                      Pivot
                    </span>
                    <ArrowDown className="w-3 h-3 text-purple-500 -mt-0.5 animate-bounce" />
                  </motion.div>
                )}
                {isSwapping && !isPivot && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-rose-500 animate-ping"
                  />
                )}
              </div>

              {/* Animated Bar */}
              <motion.div
                layout
                initial={{ height: 0 }}
                animate={{ height: `${normalizedHeight}px` }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className={`w-full rounded-t-lg sm:rounded-t-xl border flex flex-col justify-between items-center py-1.5 transition-colors duration-200 ${barBg} ${borderGlow}`}
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
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  {idx}
                </span>
              </div>
            </div>
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
function GraphCanvas({ currentStep }: { currentStep: Step }) {
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
              strokeDash = "6 4";
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
                className="transition-all duration-300"
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
              <g key={node.id} className="cursor-pointer transition-transform duration-200">
                {/* Ping ring for active node */}
                {isCurrent && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={26}
                    fill="none"
                    stroke="#8b5cf6"
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
