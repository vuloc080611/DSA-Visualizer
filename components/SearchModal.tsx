"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ALGORITHMS } from "@/lib/algorithms";
import { Search, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { ComplexityBadge } from "./ComplexityBadge";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = ALGORITHMS.filter(
    (alg) =>
      alg.name.toLowerCase().includes(query.toLowerCase()) ||
      alg.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
      alg.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Tìm kiếm giải thuật (ví dụ: Quick Sort, BFS, Two Sum...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-4 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((alg) => (
              <Link
                key={alg.id}
                href={`/visualizer/${alg.id}`}
                onClick={onClose}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {alg.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {alg.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {alg.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-2 pl-3">
                  <ComplexityBadge label="Avg" value={alg.complexity.average} />
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Không tìm thấy thuật toán nào phù hợp với &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Chọn:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono">
              Enter
            </kbd>
          </div>
          <div className="flex items-center gap-2">
            <span>Đóng:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono">
              Esc
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
