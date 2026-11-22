"use client";

import { useState, useMemo, useEffect } from "react";
import { ALGORITHMS, CATEGORIES } from "@/lib/algorithms";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { AlgorithmCategory } from "@/lib/types";
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
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-indigo-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Interactive Algorithm Visualization Web App</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Hiểu Rõ Bản Chất Giải Thuật Bằng{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Hình Ảnh Tương Tác
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Học và ôn tập 20+ thuật toán kinh điển từ Sorting, Searching, Graph, Cây BST/AVL, Mê cung 2D đến Danh sách liên kết & Ngăn xếp (Stack/Queue) với hoạt ảnh step-by-step mượt mà, phân tích độ phức tạp và code mẫu đa ngôn ngữ.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#algorithms"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Khám phá thuật toán</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/compare"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Swords className="w-4 h-4" />
              <span>Chế độ So Sánh (Race)</span>
            </Link>
            <Link
              href="/visualizer/bubble-sort"
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
            >
              Xem Demo Bubble Sort
            </Link>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8">
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">20</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Thuật toán có sẵn</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm">
              <div className="text-2xl font-bold text-emerald-500">8</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Chủ đề kinh điển</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">3</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">C++, Python, TS</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm">
              <div className="text-2xl font-bold text-emerald-500">60 FPS</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Framer Motion</div>
            </div>
          </div>
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
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                <span>{cat.name}</span>
                <span className="ml-1.5 text-xs opacity-75">({cat.count})</span>
              </button>
            ))}
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
