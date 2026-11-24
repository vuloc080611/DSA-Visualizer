"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ALGORITHMS, CATEGORIES } from "@/lib/algorithms";
import { Algorithm } from "@/lib/types";
import {
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle,
  HelpCircle,
  Info,
  Layers,
  ArrowDownUp,
  Cpu,
  Database,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface CurveConfig {
  id: string;
  label: string;
  math: string;
  color: string;
  stroke: string;
  zone: "excellent" | "fair" | "horrible";
  calc: (n: number) => number;
  formatValue: (n: number) => string;
}

const CURVES: CurveConfig[] = [
  {
    id: "o1",
    label: "Hằng số",
    math: "O(1)",
    color: "text-emerald-400",
    stroke: "#10b981",
    zone: "excellent",
    calc: () => 1,
    formatValue: () => "1",
  },
  {
    id: "ologn",
    label: "Logarit",
    math: "O(log N)",
    color: "text-cyan-400",
    stroke: "#06b6d4",
    zone: "excellent",
    calc: (n) => (n <= 1 ? 0 : Math.log2(n)),
    formatValue: (n) => (n <= 1 ? "0" : Math.log2(n).toFixed(1)),
  },
  {
    id: "on",
    label: "Tuyến tính",
    math: "O(N)",
    color: "text-blue-400",
    stroke: "#3b82f6",
    zone: "fair",
    calc: (n) => n,
    formatValue: (n) => n.toString(),
  },
  {
    id: "onlogn",
    label: "Tuyến tính log",
    math: "O(N log N)",
    color: "text-amber-400",
    stroke: "#f59e0b",
    zone: "fair",
    calc: (n) => (n <= 1 ? 0 : n * Math.log2(n)),
    formatValue: (n) => (n <= 1 ? "0" : Math.round(n * Math.log2(n)).toLocaleString()),
  },
  {
    id: "on2",
    label: "Bậc hai",
    math: "O(N²)",
    color: "text-orange-500",
    stroke: "#f97316",
    zone: "horrible",
    calc: (n) => n * n,
    formatValue: (n) => (n * n).toLocaleString(),
  },
  {
    id: "o2n",
    label: "Hàm mũ",
    math: "O(2^N)",
    color: "text-rose-500",
    stroke: "#f43f5e",
    zone: "horrible",
    calc: (n) => Math.pow(2, n),
    formatValue: (n) => {
      const val = Math.pow(2, n);
      return val > 1e12 ? val.toExponential(2) : val.toLocaleString();
    },
  },
];

function getComplexityStyle(c: string) {
  const s = c.toLowerCase();
  if (s.includes("o(1)") || s.includes("log n") || s.includes("logn")) {
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  }
  if (s.includes("n²") || s.includes("n^2") || s.includes("!") || s.includes("b^d")) {
    return "bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold";
  }
  if (s.includes("n × w") || s.includes("m × n")) {
    return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  }
  return "bg-amber-500/15 text-amber-400 border-amber-500/30";
}

export default function CheatsheetPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplexityTier, setSelectedComplexityTier] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoverN, setHoverN] = useState<number>(16);
  const [activeCurves, setActiveCurves] = useState<Record<string, boolean>>({
    o1: true,
    ologn: true,
    on: true,
    onlogn: true,
    on2: true,
    o2n: true,
  });

  // Filter algorithms
  const filteredAlgorithms = useMemo(() => {
    return ALGORITHMS.filter((alg) => {
      // Search match
      const matchesSearch =
        alg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alg.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alg.category.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      // Category match
      if (selectedCategory !== "all" && alg.category !== selectedCategory) {
        return false;
      }

      // Complexity tier filter
      if (selectedComplexityTier !== "all") {
        const avg = alg.complexity.average.toLowerCase();
        if (selectedComplexityTier === "O(1)" && !avg.includes("o(1)")) return false;
        if (selectedComplexityTier === "O(log N)" && !avg.includes("log n")) return false;
        if (selectedComplexityTier === "O(N)" && (!avg.includes("o(n)") || avg.includes("log") || avg.includes("²"))) return false;
        if (selectedComplexityTier === "O(N log N)" && !avg.includes("n log n")) return false;
        if (selectedComplexityTier === "O(N²)" && !avg.includes("n²") && !avg.includes("n^2")) return false;
        if (selectedComplexityTier === "O(Advanced)" && (avg.includes("o(1)") || avg.includes("log n") || avg.includes("n²") || avg.includes("n log n"))) return false;
      }

      return true;
    });
  }, [searchTerm, selectedCategory, selectedComplexityTier]);

  // Chart dimensions
  const chartW = 720;
  const chartH = 340;
  const paddingL = 50;
  const paddingR = 30;
  const paddingT = 30;
  const paddingB = 40;

  const innerW = chartW - paddingL - paddingR;
  const innerH = chartH - paddingT - paddingB;

  // Max N on chart = 32, max operations display ceiling = 80
  const maxN = 32;
  const maxY = 80;

  // Helper to convert (n, y) to SVG (x, y)
  const toSvgX = (n: number) => paddingL + (n / maxN) * innerW;
  const toSvgY = (y: number) => {
    const clamped = Math.min(y, maxY);
    return paddingT + innerH - (clamped / maxY) * innerH;
  };

  // Generate SVG path for a curve
  const generatePath = (calc: (n: number) => number) => {
    const points: string[] = [];
    const step = 0.5;
    for (let n = 1; n <= maxN; n += step) {
      const y = calc(n);
      const px = toSvgX(n);
      const py = toSvgY(y);
      points.push(`${n === 1 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`);
      if (y >= maxY && n > 1) {
        break; // stop once it leaves ceiling
      }
    }
    return points.join(" ");
  };

  const toggleCurve = (id: string) => {
    setActiveCurves((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* ================= HEADER SECTION ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Interactive Big-O Matrix & Growth Curves</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Bảng Tra Cứu <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Độ Phức Tạp Big-O</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                So sánh hiệu năng toán học Thời gian & Không gian của toàn bộ 28 thuật toán. Biểu đồ trực quan giúp bạn nắm bắt ngay sự khác biệt bùng nổ giữa các bậc thuật toán khi dữ liệu đầu vào ($N$) mở rộng.
              </p>
            </div>

            <Link
              href="/roadmap"
              className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 transition-all text-xs font-semibold flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <span>Xem Lộ Trình Học 4 Chặng</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>

        {/* ================= INTERACTIVE BIG-O GROWTH CHART ================= */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Đồ Thị Tăng Trưởng Toán Học (Growth Curves)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kéo thanh trượt hoặc rê chuột trên biểu đồ để xem số phép tính tại kích thước dữ liệu $N = {hoverN}$
              </p>
            </div>

            {/* Safety Zones Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Tuyệt vời: O(1), O(log N)
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Chấp nhận: O(N), O(N log N)
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Nguy hiểm: O(N²), O(2^N)
              </span>
            </div>
          </div>

          {/* SVG Chart Container */}
          <div className="relative w-full overflow-hidden bg-slate-950/80 rounded-2xl border border-slate-800 p-2 sm:p-4 shadow-inner">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-auto cursor-crosshair select-none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, (mouseX - (paddingL / chartW) * rect.width) / ((innerW / chartW) * rect.width)));
                const val = Math.round(1 + ratio * (maxN - 1));
                setHoverN(Math.max(1, Math.min(maxN, val)));
              }}
            >
              <defs>
                {/* Zone Background Gradients */}
                <linearGradient id="grid-pattern" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Background Safety Zone Shading */}
              {/* Horrible zone (top) */}
              <rect
                x={paddingL}
                y={paddingT}
                width={innerW}
                height={innerH * 0.5}
                fill="#f43f5e"
                fillOpacity="0.04"
              />
              {/* Fair zone (middle) */}
              <rect
                x={paddingL}
                y={paddingT + innerH * 0.5}
                width={innerW}
                height={innerH * 0.3}
                fill="#f59e0b"
                fillOpacity="0.04"
              />
              {/* Excellent zone (bottom) */}
              <rect
                x={paddingL}
                y={paddingT + innerH * 0.8}
                width={innerW}
                height={innerH * 0.2}
                fill="#10b981"
                fillOpacity="0.05"
              />

              {/* Grid Lines */}
              {[0, 20, 40, 60, 80].map((yVal) => (
                <g key={`y-${yVal}`}>
                  <line
                    x1={paddingL}
                    y1={toSvgY(yVal)}
                    x2={paddingL + innerW}
                    y2={toSvgY(yVal)}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingL - 10}
                    y={toSvgY(yVal) + 4}
                    fill="#64748b"
                    fontSize="11"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {yVal}
                  </text>
                </g>
              ))}

              {[4, 8, 12, 16, 20, 24, 28, 32].map((xVal) => (
                <g key={`x-${xVal}`}>
                  <line
                    x1={toSvgX(xVal)}
                    y1={paddingT}
                    x2={toSvgX(xVal)}
                    y2={paddingT + innerH}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                  <text
                    x={toSvgX(xVal)}
                    y={paddingT + innerH + 20}
                    fill="#64748b"
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    N={xVal}
                  </text>
                </g>
              ))}

              {/* Axis Labels */}
              <text
                x={paddingL - 10}
                y={paddingT - 10}
                fill="#94a3b8"
                fontSize="11"
                fontWeight="bold"
                textAnchor="end"
              >
                Số phép tính ↑
              </text>
              <text
                x={paddingL + innerW}
                y={paddingT + innerH + 34}
                fill="#94a3b8"
                fontSize="11"
                fontWeight="bold"
                textAnchor="end"
              >
                Kích thước dữ liệu (N) →
              </text>

              {/* Curves */}
              {CURVES.map((curve) => {
                if (!activeCurves[curve.id]) return null;
                const d = generatePath(curve.calc);
                return (
                  <path
                    key={curve.id}
                    d={d}
                    fill="none"
                    stroke={curve.stroke}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-opacity duration-300"
                  />
                );
              })}

              {/* Hover Indicator Line & Dots */}
              <line
                x1={toSvgX(hoverN)}
                y1={paddingT}
                x2={toSvgX(hoverN)}
                y2={paddingT + innerH}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {CURVES.map((curve) => {
                if (!activeCurves[curve.id]) return null;
                const yVal = curve.calc(hoverN);
                if (yVal > maxY + 10) return null; // Don't draw dot outside chart
                return (
                  <circle
                    key={`dot-${curve.id}`}
                    cx={toSvgX(hoverN)}
                    cy={toSvgY(yVal)}
                    r="5"
                    fill={curve.stroke}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="transition-all duration-75"
                  />
                );
              })}
            </svg>
          </div>

          {/* Interactive Slider & Curve Toggles */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
            {/* Range Slider for N */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <span className="text-xs font-semibold text-slate-300 shrink-0">
                Kích thước N: <strong className="text-cyan-400 font-mono text-sm">{hoverN}</strong>
              </span>
              <input
                type="range"
                min="1"
                max={maxN}
                value={hoverN}
                onChange={(e) => setHoverN(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-500">Max 32</span>
            </div>

            {/* Curve visibility toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {CURVES.map((curve) => {
                const isActive = activeCurves[curve.id];
                return (
                  <button
                    key={curve.id}
                    onClick={() => toggleCurve(curve.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all ${
                      isActive
                        ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                        : "bg-slate-900/40 text-slate-500 border border-slate-800/80 opacity-50"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: curve.stroke }} />
                    <span>{curve.math}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Operations Comparison Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {CURVES.map((curve) => {
              const val = curve.calc(hoverN);
              return (
                <div
                  key={curve.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">{curve.label}</span>
                    <span className={`text-xs font-bold font-mono ${curve.color}`}>{curve.math}</span>
                  </div>
                  <div className="text-lg font-black text-white font-mono truncate">
                    {curve.formatValue(hoverN)}
                  </div>
                  <div className="text-[10px] text-slate-500">phép tính</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= ALGORITHMS MATRIX TABLE ================= */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <span>Bảng Ma Trận Hiệu Năng 28 Thuật Toán</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Hiển thị {filteredAlgorithms.length} / {ALGORITHMS.length} thuật toán theo bộ lọc
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên thuật toán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5" /> Lọc Big-O:
            </span>
            {["all", "O(1)", "O(log N)", "O(N)", "O(N log N)", "O(N²)", "O(Advanced)"].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedComplexityTier(tier)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                  selectedComplexityTier === tier
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {tier === "all" ? "Tất cả" : tier}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">Danh mục:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-slate-800 text-cyan-400 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat.name.split(" ")[0]} ({cat.count})
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <th className="py-3.5 px-4">Thuật toán</th>
                  <th className="py-3.5 px-4">Thời gian Tốt nhất</th>
                  <th className="py-3.5 px-4">Thời gian Trung bình</th>
                  <th className="py-3.5 px-4">Thời gian Xấu nhất</th>
                  <th className="py-3.5 px-4">Bộ nhớ (Space)</th>
                  <th className="py-3.5 px-4 text-center">Đặc tính</th>
                  <th className="py-3.5 px-4 text-right">Mô phỏng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAlgorithms.map((alg) => (
                  <tr
                    key={alg.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Algorithm Name & Category */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {alg.name}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {alg.category}
                      </div>
                    </td>

                    {/* Best Time */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono border text-[11px] ${getComplexityStyle(alg.complexity.best)}`}>
                        {alg.complexity.best}
                      </span>
                    </td>

                    {/* Average Time */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono border text-[11px] ${getComplexityStyle(alg.complexity.average)}`}>
                        {alg.complexity.average}
                      </span>
                    </td>

                    {/* Worst Time */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono border text-[11px] ${getComplexityStyle(alg.complexity.worst)}`}>
                        {alg.complexity.worst}
                      </span>
                    </td>

                    {/* Space */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono bg-slate-950 text-slate-300 border border-slate-800 text-[11px]">
                        {alg.complexity.space}
                      </span>
                    </td>

                    {/* Properties: Stable & In-place */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {alg.properties?.stable && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            title="Ổn định (Stable): Bảo tồn thứ tự tương đối của các phần tử bằng nhau"
                          >
                            Stable
                          </span>
                        )}
                        {alg.properties?.inPlace && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            title="Tại chỗ (In-Place): Không yêu cầu thêm mảng phụ đáng kể"
                          >
                            In-place
                          </span>
                        )}
                        {!alg.properties?.stable && !alg.properties?.inPlace && (
                          <span className="text-slate-600 font-mono">—</span>
                        )}
                      </div>
                    </td>

                    {/* Action link */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/visualizer/${alg.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-semibold border border-emerald-500/30 transition-all text-xs"
                      >
                        <span>Xem</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAlgorithms.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                Không tìm thấy thuật toán nào phù hợp với bộ lọc hiện tại.
              </div>
            )}
          </div>
        </div>

        {/* ================= CHEATSHEET RULES & INTERVIEW TIPS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Quy Tắc Cộng & Nhân</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nếu 2 thao tác chạy tuần tự: $O(A + B) = \max(O(A), O(B))$. Nếu 2 vòng lặp lồng nhau: $O(A \times B)$. Luôn triệt tiêu hằng số ($O(2N) \rightarrow O(N)$).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Không Gian Bộ Nhớ (Space)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tính cả Stack Frame của các hàm đệ quy (Call Stack). Ví dụ DFS trên cây nhị phân lệch có thể tốn $O(N)$ bộ nhớ Stack dù không cấp phát mảng phụ.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Mẹo Phỏng Vấn Big Tech</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khi thấy $N \le 20$, nghĩ tới Quay lui $O(2^N)$ hoặc $O(N!)$. Khi $N \le 10^5$, bài toán đòi hỏi nghiệm $O(N)$ hoặc $O(N \log N)$. Khi $N \ge 10^9$, chỉ có thể là $O(\log N)$ hoặc $O(1)$.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
