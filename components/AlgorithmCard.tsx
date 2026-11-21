"use client";

import Link from "next/link";
import { Algorithm } from "@/lib/types";
import { ComplexityBadge } from "./ComplexityBadge";
import { ArrowRight, BarChart2, Search, Network, Layers, CheckCircle2, Sliders } from "lucide-react";
import { motion } from "framer-motion";

interface AlgorithmCardProps {
  algorithm: Algorithm;
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sorting":
        return <BarChart2 className="w-4 h-4 text-emerald-500" />;
      case "searching":
        return <Search className="w-4 h-4 text-blue-500" />;
      case "graph":
        return <Network className="w-4 h-4 text-purple-500" />;
      case "array":
        return <Layers className="w-4 h-4 text-amber-500" />;
      default:
        return <Sliders className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "sorting":
        return "Sorting";
      case "searching":
        return "Searching";
      case "graph":
        return "Graph";
      case "array":
        return "Array / Window";
      default:
        return category;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300"
    >
      <div>
        {/* Top Header: Category & Properties */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {getCategoryIcon(algorithm.category)}
            <span>{getCategoryLabel(algorithm.category)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {algorithm.properties?.stable && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Stable
              </span>
            )}
            {algorithm.properties?.inPlace && (
              <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                In-place
              </span>
            )}
          </div>
        </div>

        {/* Algorithm Name */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors mb-2">
          {algorithm.name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {algorithm.shortDescription}
        </p>

        {/* Complexity Grid */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          <ComplexityBadge label="Avg" value={algorithm.complexity.average} />
          <ComplexityBadge label="Worst" value={algorithm.complexity.worst} />
          <ComplexityBadge label="Space" value={algorithm.complexity.space} type="space" />
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/visualizer/${algorithm.id}`}
        className="mt-2 flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white text-slate-700 dark:text-slate-200 text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all group-hover:shadow-md"
      >
        <span>Trực quan hóa</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
