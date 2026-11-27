"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  COURSE_CHAPTERS,
  ALL_COURSE_LESSONS,
  getLessonById,
  isCourseLessonUnlocked,
} from "@/lib/course";
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Check,
  Search,
  BookOpen,
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

  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    COURSE_CHAPTERS.forEach((ch) => {
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

  const filteredChapters = useMemo(() => {
    return COURSE_CHAPTERS.map((chapter) => {
      const lessons = chapter.lessonIds
        .map((id) => getLessonById(id))
        .filter((l): l is NonNullable<typeof l> => l !== undefined);

      const matchedLessons = lessons.filter((lesson) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          lesson.title.toLowerCase().includes(q) ||
          lesson.subtitle.toLowerCase().includes(q) ||
          lesson.code.toLowerCase().includes(q);

        const isDone = completedIds.includes(lesson.id);
        const matchesFilter =
          filterMode === "all" ||
          (filterMode === "completed" && isDone) ||
          (filterMode === "uncompleted" && !isDone);

        return matchesSearch && matchesFilter;
      });

      const doneInChapter = chapter.lessonIds.filter((id) => completedIds.includes(id)).length;

      return {
        ...chapter,
        matchedLessons,
        completedCount: doneInChapter,
        totalCount: chapter.lessonIds.length,
      };
    });
  }, [searchQuery, filterMode, completedIds]);

  const totalLessonsCount = ALL_COURSE_LESSONS.length;
  const totalCompletedCount = useMemo(() => {
    return ALL_COURSE_LESSONS.filter((l) => completedIds.includes(l.id)).length;
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
          title={`Mở danh sách ${totalLessonsCount} bài học DSA`}
          className="flex flex-col items-center gap-2.5 text-slate-400 hover:text-[#e06c53] transition-colors cursor-pointer group"
        >
          <BookOpen className="w-4 h-4 text-[#e06c53]" />
          <span className="text-[11px] font-bold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            Khóa học
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 group-hover:border-[#e06c53]/40">
            {totalCompletedCount}/{totalLessonsCount}
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
              {totalCompletedCount}/{totalLessonsCount}
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
            style={{ width: `${Math.round((totalCompletedCount / Math.max(1, totalLessonsCount)) * 100)}%` }}
          />
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài học, mã bài (VD: 03.4)..."
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-[#e06c53]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filterMode === "all"
                ? "bg-[#e06c53]/15 text-[#e06c53] font-bold"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterMode("completed")}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filterMode === "completed"
                ? "bg-emerald-500/15 text-emerald-500 font-bold"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            Đã Pass
          </button>
          <button
            onClick={() => setFilterMode("uncompleted")}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filterMode === "uncompleted"
                ? "bg-amber-500/15 text-amber-500 font-bold"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            Chưa học
          </button>
        </div>
      </div>

      {/* Scrollable Chapter Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 custom-scrollbar">
        {filteredChapters.map((chapter) => {
          const isChapterOpen = openChapters[chapter.id] ?? true;
          const matchedCount = chapter.matchedLessons.length;

          if ((searchQuery || filterMode !== "all") && matchedCount === 0) {
            return null;
          }

          return (
            <div key={chapter.id} className="rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  {isChapterOpen ? (
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
                    {chapter.completedCount}/{chapter.totalCount}
                  </span>
                  {isChapterOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  )}
                </div>
              </button>

              {isChapterOpen && (
                <div className="pl-5 pr-1 py-1 space-y-0.5 border-l border-slate-200 dark:border-slate-800/80 ml-4 my-0.5">
                  {chapter.matchedLessons.map((lesson) => {
                    const isActive = lesson.id === currentAlgorithmId;
                    const isDone = completedIds.includes(lesson.id);
                    const isUnlocked = isCourseLessonUnlocked(lesson.id, completedIds);

                    if (!isUnlocked && !isActive) {
                      return (
                        <div
                          key={lesson.id}
                          title="Pass bài trước đó để mở khóa bài này"
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed select-none"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                              <Lock className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                            </span>
                            <span className="font-mono text-[10px] opacity-80">{lesson.code}</span>
                            <span className="truncate">{lesson.title}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${lesson.id}`}
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
                          <span className={`font-mono text-[10px] shrink-0 ${isActive ? "text-white/80" : "text-slate-400"}`}>
                            {lesson.code}
                          </span>
                          <span className="truncate">{lesson.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
