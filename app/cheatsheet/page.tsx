"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Play,
  Pause,
  RotateCcw,
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
  const [hoveredCurveId, setHoveredCurveId] = useState<string | null>(null);
  const [isAutoPlayingN, setIsAutoPlayingN] = useState(false);
  const [activeCurves, setActiveCurves] = useState<Record<string, boolean>>({
    o1: true,
    ologn: true,
    on: true,
    onlogn: true,
    on2: true,
    o2n: true,
  });

  // Auto-play N from 1 -> maxN
  useEffect(() => {
    if (!isAutoPlayingN) return;
    const timer = setInterval(() => {
      setHoverN((prev) => {
        if (prev >= 32) {
          setIsAutoPlayingN(false);
          return 32;
        }
        return prev + 1;
      });
    }, 170);
    return () => clearInterval(timer);
  }, [isAutoPlayingN]);

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
        if (selectedComplexityTier === "O(Advanced)" && (avg === "o(1)" || avg.includes("o(1)") || avg.includes("log n") || avg.includes("n²") || avg.includes("n log n") || (avg.includes("o(n)") && !avg.includes("·") && !avg.includes("+")))) return false;
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
    <div className="min-h-screen w-full overflow-x-clip bg-slate-950 text-slate-100 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl"
        >
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-aurora" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-aurora-reverse" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
                <span>Interactive Big-O Matrix & Growth Curves</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Bảng Tra Cứu <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Độ Phức Tạp Big-O</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                So sánh hiệu năng toán học Thời gian & Không gian của toàn bộ <strong className="text-slate-200">{ALGORITHMS.length} thuật toán</strong>. Biểu đồ trực quan giúp bạn nắm bắt ngay sự khác biệt bùng nổ giữa các bậc thuật toán khi dữ liệu đầu vào <code className="font-mono text-cyan-400">N</code> mở rộng.
              </p>
            </div>

            <Link
              href="/roadmap"
              className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-emerald-500/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:scale-[1.03] active:scale-95 transition-all text-xs font-semibold flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <span>Xem Lộ Trình Học 4 Chặng</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </motion.div>

        {/* ================= INTERACTIVE BIG-O GROWTH CHART ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-5 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Đồ Thị Tăng Trưởng Toán Học (Growth Curves)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kéo thanh trượt hoặc rê chuột trên biểu đồ để xem số phép tính tại kích thước dữ liệu <strong className="font-mono text-cyan-400">N = {hoverN}</strong>
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
                x={paddingL + 8}
                y={paddingT - 10}
                fill="#94a3b8"
                fontSize="11"
                fontWeight="bold"
                textAnchor="start"
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

              {/* Animated Growth Curves */}
              {CURVES.map((curve, idx) => {
                if (!activeCurves[curve.id]) return null;
                const d = generatePath(curve.calc);
                const isHovered = hoveredCurveId === curve.id;
                const isDimmed = hoveredCurveId !== null && hoveredCurveId !== curve.id;

                return (
                  <motion.path
                    key={curve.id}
                    d={d}
                    fill="none"
                    stroke={curve.stroke}
                    strokeWidth={isHovered ? 4 : 2.5}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isDimmed ? 0.2 : 1 }}
                    transition={{
                      pathLength: { duration: 1.0, delay: idx * 0.08, ease: "easeOut" },
                      opacity: { duration: 0.2 },
                    }}
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 8px ${curve.stroke})` : undefined,
                    }}
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
                const cx = toSvgX(hoverN);
                const cy = toSvgY(yVal);
                const isDangerous = curve.zone === "horrible" && yVal >= 32;

                return (
                  <g key={`dot-${curve.id}`}>
                    {isDangerous && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="9"
                        fill={curve.stroke}
                        fillOpacity="0.25"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={hoveredCurveId === curve.id ? 6.5 : 5}
                      fill={curve.stroke}
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all duration-75"
                    />
                  </g>
                );
              })}

              {/* Floating SVG Tooltip Card */}
              {(() => {
                const tooltipW = 148;
                const activeList = CURVES.filter((c) => activeCurves[c.id]);
                const tooltipH = 26 + activeList.length * 16;
                const lineX = toSvgX(hoverN);
                const boxX = hoverN > 20 ? lineX - tooltipW - 12 : lineX + 12;
                const boxY = paddingT + 8;

                return (
                  <g className="pointer-events-none">
                    <rect
                      x={boxX}
                      y={boxY}
                      width={tooltipW}
                      height={tooltipH}
                      rx={10}
                      fill="#090d16"
                      fillOpacity="0.92"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text
                      x={boxX + 10}
                      y={boxY + 17}
                      fill="#38bdf8"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      Tại N = {hoverN}:
                    </text>
                    {activeList.map((c, idx) => (
                      <g key={`tip-${c.id}`}>
                        <circle cx={boxX + 14} cy={boxY + 30 + idx * 16} r="3" fill={c.stroke} />
                        <text
                          x={boxX + 22}
                          y={boxY + 33 + idx * 16}
                          fill="#cbd5e1"
                          fontSize="10"
                          fontFamily="monospace"
                        >
                          {c.math}
                        </text>
                        <text
                          x={boxX + tooltipW - 10}
                          y={boxY + 33 + idx * 16}
                          fill={c.stroke}
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="end"
                        >
                          {c.formatValue(hoverN)}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Interactive Slider, Auto-Play & Curve Toggles */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
            {/* Range Slider & Auto-Play for N */}
            <div className="flex flex-wrap items-center gap-3 flex-1 max-w-xl">
              <button
                onClick={() => {
                  if (!isAutoPlayingN && hoverN >= maxN) {
                    setHoverN(1);
                  }
                  setIsAutoPlayingN((prev) => !prev);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
                  isAutoPlayingN
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 border-emerald-400 shadow-sm shadow-emerald-500/25"
                }`}
              >
                {isAutoPlayingN ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isAutoPlayingN ? "Tạm dừng" : "Chạy thử N"}</span>
              </button>

              <button
                onClick={() => {
                  setIsAutoPlayingN(false);
                  setHoverN(1);
                }}
                title="Đưa N về 1"
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs font-semibold text-slate-300 shrink-0">
                N = <strong className="text-cyan-400 font-mono text-sm">{hoverN}</strong>
              </span>
              <input
                type="range"
                min="1"
                max={maxN}
                value={hoverN}
                onChange={(e) => {
                  setIsAutoPlayingN(false);
                  setHoverN(parseInt(e.target.value));
                }}
                className="flex-1 min-w-[120px] accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Curve visibility toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {CURVES.map((curve) => {
                const isActive = activeCurves[curve.id];
                return (
                  <button
                    key={curve.id}
                    onClick={() => toggleCurve(curve.id)}
                    onMouseEnter={() => setHoveredCurveId(curve.id)}
                    onMouseLeave={() => setHoveredCurveId(null)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-800 text-white border border-slate-700 shadow-sm hover:border-slate-500"
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
              const barPct = Math.min(100, Math.max(4, Math.round((val / 150) * 100)));
              const isExploding = curve.zone === "horrible" && val >= 100;
              const isHighlighted = hoveredCurveId === curve.id;

              return (
                <motion.div
                  key={curve.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onMouseEnter={() => setHoveredCurveId(curve.id)}
                  onMouseLeave={() => setHoveredCurveId(null)}
                  className={`rounded-2xl border p-3.5 space-y-2 transition-colors cursor-default ${
                    isHighlighted
                      ? "bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                      : isExploding
                      ? "bg-rose-950/20 border-rose-500/40"
                      : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-semibold text-slate-400 truncate">{curve.label}</span>
                    <span className={`text-xs font-bold font-mono shrink-0 ${curve.color}`}>{curve.math}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="text-lg font-black text-white font-mono truncate">
                      {curve.formatValue(hoverN)}
                    </div>
                    {isExploding && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 animate-pulse shrink-0">
                        Bùng nổ
                      </span>
                    )}
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{ width: `${barPct}%`, backgroundColor: curve.stroke }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ================= ALGORITHMS MATRIX TABLE ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <span>Bảng Ma Trận Hiệu Năng {ALGORITHMS.length} Thuật Toán</span>
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
            {["all", "O(1)", "O(log N)", "O(N)", "O(N log N)", "O(N²)", "O(Advanced)"].map((tier) => {
              const active = selectedComplexityTier === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedComplexityTier(tier)}
                  className={`relative px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${
                    active ? "text-slate-950 font-bold" : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="cheatsheet-tier-pill"
                      className="absolute inset-0 bg-amber-500 rounded-lg shadow-sm shadow-amber-500/20 -z-0"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tier === "all" ? "Tất cả" : tier}</span>
                </button>
              );
            })}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">Danh mục:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-slate-800 text-cyan-400 border border-slate-700 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                {cat.name.replace(/\s*\([^)]*\)/g, "")} ({cat.count})
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
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded font-mono border text-[11px] whitespace-nowrap ${getComplexityStyle(alg.complexity.best)}`}>
                        {alg.complexity.best}
                      </span>
                    </td>

                    {/* Average Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded font-mono border text-[11px] whitespace-nowrap ${getComplexityStyle(alg.complexity.average)}`}>
                        {alg.complexity.average}
                      </span>
                    </td>

                    {/* Worst Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded font-mono border text-[11px] whitespace-nowrap ${getComplexityStyle(alg.complexity.worst)}`}>
                        {alg.complexity.worst}
                      </span>
                    </td>

                    {/* Space */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded font-mono bg-slate-950 text-slate-300 border border-slate-800 text-[11px] whitespace-nowrap">
                        {alg.complexity.space}
                      </span>
                    </td>

                    {/* Properties: Stable & In-place */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                        {alg.properties?.stable && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap"
                            title="Ổn định (Stable): Bảo tồn thứ tự tương đối của các phần tử bằng nhau"
                          >
                            Stable
                          </span>
                        )}
                        {alg.properties?.inPlace && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 whitespace-nowrap"
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
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/learn/${alg.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-semibold border border-emerald-500/30 transition-all text-xs whitespace-nowrap"
                      >
                        <span>Xem</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
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
        </motion.div>

        {/* ================= CHEATSHEET RULES & INTERVIEW TIPS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-emerald-500/50 hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.25)] p-5 space-y-3 transition-colors duration-300"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Quy Tắc Cộng & Nhân</span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
              Nếu 2 thao tác chạy tuần tự: <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px]">O(A + B) = max(O(A), O(B))</code>.
              Nếu 2 vòng lặp lồng nhau: <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px]">O(A × B)</code>.
              Luôn triệt tiêu hằng số (<code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px]">O(2N) → O(N)</code>).
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-amber-500/50 hover:shadow-[0_12px_32px_-8px_rgba(245,158,11,0.25)] p-5 space-y-3 transition-colors duration-300"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-500 via-orange-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Cpu className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Không Gian Bộ Nhớ (Space)</span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
              Tính cả Stack Frame của các hàm đệ quy (Call Stack). Ví dụ DFS trên cây nhị phân lệch có thể tốn{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400 font-mono text-[11px]">O(N)</code>{" "}
              bộ nhớ Stack dù không cấp phát mảng phụ.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-cyan-500/50 hover:shadow-[0_12px_32px_-8px_rgba(6,182,212,0.25)] p-5 space-y-3 transition-colors duration-300"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Mẹo Phỏng Vấn Big Tech</span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
              Khi thấy <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]">N ≤ 20</code>: nghĩ tới Quay lui{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]">O(2^N)</code> hoặc{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]">O(N!)</code>.{" "}
              Khi <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]">N ≤ 10⁵</code>: cần nghiệm{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]">O(N)</code> hoặc{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]">O(N log N)</code>.{" "}
              Khi <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]">N ≥ 10⁹</code>: chỉ có thể là{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]">O(log N)</code> hoặc{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[11px]">O(1)</code>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
