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
  Zap,
  ArrowRight,
  Filter,
  CheckCircle,
  Swords,
  Play,
  Terminal,
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight"
          >
            Hiểu Rõ Bản Chất Giải Thuật Bằng{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-shimmer">
              Hình Ảnh Tương Tác
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Học và ôn tập 28 thuật toán kinh điển từ Sorting, Searching, Graph, Cây BST/AVL, Mê cung 2D, Quy hoạch động đến Quay lui với hoạt ảnh step-by-step 60 FPS mượt mà và code mẫu đa ngôn ngữ.
          </motion.p>

          {/* Quick CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-1"
          >
            <a
              href="#algorithms"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 animate-glow-pulse"
            >
              <span>Khám phá thuật toán</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/compare"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Swords className="w-4 h-4" />
              <span>Đua 4 làn (Race)</span>
            </Link>
            <Link
              href="/playground"
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-emerald-500" />
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

          {/* Animated Stat Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4"
          >
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                <AnimatedCounter target={ALGORITHMS.length} />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Thuật toán có sẵn</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">
                <AnimatedCounter target={CATEGORIES.length - 1} suffix=" Chủ đề" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Danh mục phong phú</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                3
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">C++, Python, TS</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">
                <AnimatedCounter target={60} suffix=" FPS" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Framer Motion</div>
            </div>
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
