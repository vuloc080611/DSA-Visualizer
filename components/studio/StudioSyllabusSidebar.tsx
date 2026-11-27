"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CURRICULUM_CHAPTERS,
  CurriculumChapter,
  getChapterProgress,
  isAlgorithmUnlocked,
} from "@/lib/curriculum";
import { getAlgorithmById } from "@/lib/algorithms";
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Check,
  Search,
  BookOpen,
  Layers,
  Sparkles,
  Filter,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Lock,
} from "lucide-react";

interface StudioSyllabusSidebarProps {
  currentAlgorithmId: string;
  completedIds: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export function StudioSyllabusSidebar({
  currentAlgorithmId,
  completedIds,
  isOpen,
  onToggle,
}: StudioSyllabusSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "completed" | "uncompleted">("all");

  // Keep all chapters open by default, allow collapsing
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CURRICULUM_CHAPTERS.forEach((ch) => {
      initial[ch.id] = true;
    });
    return initial;
  });

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Filter algorithms according to search and status
  const filteredChapters = useMemo(() => {
    return CURRICULUM_CHAPTERS.map((chapter) => {
      const algs = chapter.algorithmIds
        .map((id) => getAlgorithmById(id))
        .filter((a): a is NonNullable<typeof a> => a !== undefined);

      const matchingAlgs = algs.filter((alg) => {
        const matchesSearch =
          alg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alg.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

        const isDone = completedIds.includes(alg.id);
        const matchesFilter =
          filterMode === "all" ||
          (filterMode === "completed" && isDone) ||
          (filterMode === "uncompleted" && !isDone);

        return matchesSearch && matchesFilter;
      });

      return {
        ...chapter,
        matchedAlgs: matchingAlgs,
      };
    });
  }, [searchQuery, filterMode, completedIds]);

  const totalAlgsCount = useMemo(() => {
    return CURRICULUM_CHAPTERS.reduce((sum, ch) => sum + ch.algorithmIds.length, 0);
  }, []);

  const totalCompletedCount = useMemo(() => {
    return completedIds.length;
  }, [completedIds]);

  if (!isOpen) {
    return (
      <aside className="hidden md:flex w-11 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md flex-col items-center py-3 gap-4 z-20 transition-all select-none">
        <button
          onClick={onToggle}
          title="Hiện danh mục khóa học"
          aria-label="Hiện danh mục khóa học"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-[#e06c53] hover:bg-[#e06c53]/10 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>

        <button
          onClick={onToggle}
          title="Mở danh sách 31 bài học DSA"
          className="flex flex-col items-center gap-2.5 text-slate-400 hover:text-[#e06c53] transition-colors cursor-pointer group"
        >
          <BookOpen className="w-4 h-4 text-[#e06c53]" />
          <span className="text-[11px] font-bold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            Khóa học
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 group-hover:border-[#e06c53]/40">
            {totalCompletedCount}/{totalAlgsCount}
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-64 xl:w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md flex flex-col z-20 transition-all select-none">
      {/* Header & Overall progress */}
      <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 text-[#e06c53] shrink-0" />
            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
              Khóa học DSA
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              {totalCompletedCount}/{totalAlgsCount}
            </span>
            <button
              onClick={onToggle}
              title="Ẩn thanh khóa học"
              aria-label="Ẩn thanh khóa học"
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#e06c53] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#e06c53] to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${Math.round((totalCompletedCount / Math.max(1, totalAlgsCount)) * 100)}%` }}
          />
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm bài học, giải thuật..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#e06c53] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[11px]">
          {(["all", "completed", "uncompleted"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filterMode === mode
                  ? "bg-[#e06c53]/15 text-[#e06c53] font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {mode === "all" ? "Tất cả" : mode === "completed" ? "Đã học" : "Chưa học"}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters & Lessons Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 custom-scrollbar">
        {filteredChapters.map((chapter) => {
          const isOpen = openChapters[chapter.id] !== false;
          const { completed, total } = getChapterProgress(chapter, completedIds);
          const hasAlgs = chapter.algorithmIds.length > 0;
          const matchedCount = chapter.matchedAlgs.length;

          // If searching or filtering and no match, skip this chapter
          if ((searchQuery || filterMode !== "all") && matchedCount === 0) {
            return null;
          }

          return (
            <div key={chapter.id} className="rounded-xl overflow-hidden transition-colors">
              {/* Chapter Header Button */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
              >
                <div className="flex items-center gap-2 truncate">
                  {isOpen ? (
                    <FolderOpen className="w-4 h-4 text-[#e06c53] shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">
                    {chapter.code}. {chapter.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  <span className="text-[10px] font-mono text-slate-400">
                    {completed}/{total}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  )}
                </div>
              </button>

              {/* Sub-lessons */}
              {isOpen && (
                <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-200 dark:border-slate-800/80 ml-4 my-0.5">
                  {chapter.matchedAlgs.map((alg) => {
                    const isActive = alg.id === currentAlgorithmId;
                    const isDone = completedIds.includes(alg.id);
                    const isUnlocked = isAlgorithmUnlocked(alg.id, completedIds);

                    if (!isUnlocked && !isActive) {
                      return (
                        <div
                          key={alg.id}
                          title="Hoàn thành (Pass) bài trước đó để mở khóa bài này"
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed select-none"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                              <Lock className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                            </span>
                            <span className="truncate">{alg.name}</span>
                          </div>

                          <span className="text-[10px] font-mono shrink-0 ml-1 text-slate-400 dark:text-slate-600">
                            {alg.complexity.average}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={alg.id}
                        href={`/visualizer/${alg.id}`}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                          isActive
                            ? "bg-[#e06c53] text-white font-bold shadow-sm shadow-[#e06c53]/20"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 text-[9px] ${
                              isDone
                                ? isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-emerald-500/20 text-emerald-500 font-bold"
                                : isActive
                                ? "border border-white/60 text-transparent"
                                : "border border-slate-300 dark:border-slate-700 text-transparent"
                            }`}
                          >
                            {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span className="truncate">{alg.name}</span>
                        </div>

                        <span
                          className={`text-[10px] font-mono shrink-0 ml-1 ${
                            isActive ? "text-white/80" : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {alg.complexity.average}
                        </span>
                      </Link>
                    );
                  })}

                  {!hasAlgs && (
                    <div className="text-[11px] text-slate-400 italic px-2 py-1">
                      Đang cập nhật...
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
