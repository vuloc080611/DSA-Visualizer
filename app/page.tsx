"use client";

import { useState, useMemo, useEffect } from "react";
import { ALGORITHMS, CATEGORIES } from "@/lib/algorithms";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { AlgorithmCategory } from "@/lib/types";
import { HeroConstellation } from "@/components/HeroConstellation";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroLiveWidget } from "@/components/HeroLiveWidget";
import {
  Search,
  Sparkles,
  BarChart2,
  Code2,
  Cpu,
  Layers,
  Zap,
  ArrowRight,
  Filter,
  CheckCircle,
  Swords,
  Play,
  Terminal,
  Map,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const syncCategoryFromHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (
        [
          "sorting",
          "searching",
          "graph",
          "array",
          "tree",
          "pathfinding",
          "linked-list",
          "stack-queue",
          "dp",
          "backtracking",
          "string",
        ].includes(hash)
      ) {
        setSelectedCategory(hash as AlgorithmCategory);
        const el = document.getElementById("algorithms");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Check on initial mount
    syncCategoryFromHash();

    // Listen to hash changes (back/forward or URL updates)
    window.addEventListener("hashchange", syncCategoryFromHash);

    // Listen to custom category selection from Navbar
    const handleCustomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<AlgorithmCategory>;
      if (customEvent.detail) {
        setSelectedCategory(customEvent.detail);
      }
    };
    window.addEventListener("select-category", handleCustomSelect as EventListener);

    return () => {
      window.removeEventListener("hashchange", syncCategoryFromHash);
      window.removeEventListener("select-category", handleCustomSelect as EventListener);
    };
  }, []);

  const filteredAlgorithms = useMemo(() => {
    return ALGORITHMS.filter((alg) => {
      const matchCategory = selectedCategory === "all" || alg.category === selectedCategory;
      const matchSearch =
        alg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alg.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alg.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Constellation Particle Canvas in background */}
        <HeroConstellation />

        {/* Ambient Living Aurora Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-transparent blur-3xl pointer-events-none rounded-full animate-aurora" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-bl from-cyan-500/15 via-indigo-500/15 to-transparent blur-3xl pointer-events-none rounded-full animate-aurora-reverse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Interactive Algorithm Visualization Web App • Next.js 15</span>
          </motion.div>

          {/* Title with Shimmer Gradient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-x-10 top-1/2 -translate-y-1/2 h-28 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none -z-10" />
            <h1
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight drop-shadow-sm"
            >
              Hiểu Rõ Bản Chất Giải Thuật Bằng{" "}
              <span
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                className="bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-shimmer filter drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]"
              >
                Hình Ảnh Tương Tác
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Học và ôn tập 28 thuật toán kinh điển từ Sorting, Searching, Graph, Cây BST/AVL, Mê cung 2D, Quy hoạch động đến Quay lui với hoạt ảnh step-by-step 60 FPS mượt mà và code mẫu đa ngôn ngữ.
          </motion.p>

          {/* Quick CTA Buttons with Radiant Glow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <a
              href="#algorithms"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Khám phá thuật toán</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/compare"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>Đua 4 làn (Race)</span>
            </Link>
            <Link
              href="/playground"
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border-2 border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Live Playground</span>
            </Link>
          </motion.div>

          {/* Hero Live Interactive Mini-Visualizer Sandbox */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="pt-2"
          >
            <HeroLiveWidget />
          </motion.div>

          {/* Animated 3D Interactive Stat Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4"
          >
            {/* Card 1: 28 Thuật toán */}
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              className="relative group p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md shadow-sm hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                  <AnimatedCounter target={ALGORITHMS.length} />
                </span>
                <Cpu className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Thuật toán có sẵn</div>
            </motion.div>

            {/* Card 2: 11 Chủ đề */}
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              className="relative group p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md shadow-sm hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                  <AnimatedCounter target={CATEGORIES.length - 1} suffix=" Chủ đề" />
                </span>
                <Layers className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Danh mục phong phú</div>
            </motion.div>

            {/* Card 3: 3 Ngôn ngữ */}
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              className="relative group p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md shadow-sm hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] transition-all overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl sm:text-3xl font-black text-cyan-500 font-mono">3</span>
                <Code2 className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">C++, Python, TS</div>
            </motion.div>

            {/* Card 4: 60 FPS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              className="relative group p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md shadow-sm hover:border-purple-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl sm:text-3xl font-black text-purple-500 font-mono">
                  <AnimatedCounter target={60} suffix=" FPS" />
                </span>
                <Zap className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Framer Motion</div>
            </motion.div>
          </motion.div>

          {/* Feature Spotlight: Roadmap & Big-O Cheatsheet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto pt-4 text-left"
          >
            {/* Card 1: Roadmap */}
            <Link
              href="/roadmap"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-900/80 to-slate-900/80 border border-teal-500/30 hover:border-teal-400 p-5 shadow-lg transition-all hover:scale-[1.02] hover:shadow-teal-500/10 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/20 transition-all" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Map className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Cây Kỹ Năng • 4 Chặng
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors flex items-center justify-between">
                    <span>Lộ Trình Học DSA</span>
                    <ArrowRight className="w-4 h-4 text-teal-400 transform group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    Lộ trình bài bản 4 cấp độ từ Khởi động đến Đỉnh cao DP. Tự động lưu tiến độ vào trình duyệt và mở khóa 4 huy hiệu vinh danh!
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Big-O Cheatsheet */}
            <Link
              href="/cheatsheet"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-900/80 border border-amber-500/30 hover:border-amber-400 p-5 shadow-lg transition-all hover:scale-[1.02] hover:shadow-amber-500/10 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Biểu Đồ & Ma Trận
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                    <span>Bảng Tra Cứu Big-O</span>
                    <ArrowRight className="w-4 h-4 text-amber-400 transform group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    So sánh đồ thị toán học trực quan $O(1)$ đến $O(2^N)$, ma trận Thời gian & Không gian của 28 thuật toán và bí quyết phỏng vấn Big Tech.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Algorithm Gallery Section */}
      <section id="algorithms" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 relative">
        {/* Hidden scroll anchor targets for navbar navigation */}
        <div id="sorting" className="absolute -top-24" />
        <div id="searching" className="absolute -top-24" />
        <div id="graph" className="absolute -top-24" />
        <div id="array" className="absolute -top-24" />
        <div id="tree" className="absolute -top-24" />
        <div id="pathfinding" className="absolute -top-24" />
        <div id="linked-list" className="absolute -top-24" />
        <div id="stack-queue" className="absolute -top-24" />
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs with Sliding Active Pill */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "text-white font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="category-tab-active-home"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-md shadow-emerald-500/25 -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span>{cat.name}</span>
                  <span className="ml-1.5 text-xs opacity-80">({cat.count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thuật toán..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Algorithm Cards Grid */}
        {filteredAlgorithms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredAlgorithms.map((alg) => (
                <AlgorithmCard key={alg.id} algorithm={alg} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Không tìm thấy thuật toán nào phù hợp với từ khóa &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-xs font-semibold text-emerald-500 hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </section>

      {/* Big-O Cheat Sheet Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-4 mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Cpu className="w-4 h-4" />
            <span>Tóm tắt độ phức tạp</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Bảng Tra Cứu Độ Phức Tạp (Complexity Cheat Sheet)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            So sánh nhanh độ phức tạp thời gian và không gian của các giải thuật đã cài đặt.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Thuật toán</th>
                <th className="py-3 px-4">Chủ đề</th>
                <th className="py-3 px-4">Best Time</th>
                <th className="py-3 px-4">Average Time</th>
                <th className="py-3 px-4">Worst Time</th>
                <th className="py-3 px-4">Space</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
              {ALGORITHMS.map((alg) => (
                <tr
                  key={alg.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white">
                    {alg.name}
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] text-slate-500 font-sans">
                    {alg.category}
                  </td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    {alg.complexity.best}
                  </td>
                  <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-semibold">
                    {alg.complexity.average}
                  </td>
                  <td className="py-3 px-4 text-rose-600 dark:text-rose-400 font-semibold">
                    {alg.complexity.worst}
                  </td>
                  <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold">
                    {alg.complexity.space}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <Link
                      href={`/visualizer/${alg.id}`}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Xem</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
