"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  COURSE_CHAPTERS,
  ALL_COURSE_LESSONS,
  getLessonById,
  isCourseLessonUnlocked,
  getCourseFrontierLesson,
} from "@/lib/course";
import {
  getStoredCompletedAlgorithms,
  EVENT_PROGRESS_UPDATED,
} from "@/lib/roadmap";
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  GraduationCap,
  Code2,
  HelpCircle,
  Eye,
} from "lucide-react";

export default function LearnCourseOverviewPage() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    setCompletedIds(getStoredCompletedAlgorithms());
    const handleUpdate = (e: any) => {
      setCompletedIds(e.detail || getStoredCompletedAlgorithms());
    };
    window.addEventListener(EVENT_PROGRESS_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_PROGRESS_UPDATED, handleUpdate);
  }, []);

  const totalLessons = ALL_COURSE_LESSONS.length;
  const completedCount = useMemo(
    () => ALL_COURSE_LESSONS.filter((l) => completedIds.includes(l.id)).length,
    [completedIds]
  );
  const progressPct = Math.round((completedCount / Math.max(1, totalLessons)) * 100);
  const frontierLesson = useMemo(() => getCourseFrontierLesson(completedIds), [completedIds]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Course Hero Banner */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e06c53]/10 text-[#e06c53] border border-[#e06c53]/25 text-xs font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>Giáo trình chuẩn MIT 6.006 • Princeton Alg4 • CLRS • OpenDSA</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Khóa học Cấu trúc Dữ liệu & Giải thuật Toàn diện
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                42 bài học bài bản có đầu có cuối từ Nhập môn Bộ nhớ RAM & Big-O đến Đồ thị nâng cao và Quy hoạch động.
                Mỗi bài gồm <strong>4 chặng kiểm chứng</strong> (Lý thuyết → Demo → Quiz → Code & Chấm Test) để thực sự làm chủ trước khi qua bài mới.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-3">
              <Link
                href={`/learn/${frontierLesson.id}`}
                className="px-6 py-3.5 rounded-2xl bg-[#e06c53] hover:bg-[#d05c43] text-white font-bold text-sm shadow-lg shadow-[#e06c53]/25 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {completedCount === 0
                    ? `Bắt đầu từ Bài ${frontierLesson.code}`
                    : `Tiếp tục học: ${frontierLesson.code}. ${frontierLesson.title}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-xs font-mono text-slate-500 text-center sm:text-right">
                Tiến độ khóa học: <strong className="text-slate-900 dark:text-white">{completedCount}/{totalLessons} bài Pass ({progressPct}%)</strong>
              </div>
            </div>
          </div>

          {/* Global Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#e06c53] to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* 4-Stage Pill Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { icon: BookOpen, title: "1. Lý thuyết 6 mục", desc: "Bài toán, Trực giác, Bất biến & Big-O" },
              { icon: Eye, title: "2. Xem & Thử Demo", desc: "Mô phỏng trực quan & tùy biến dữ liệu" },
              { icon: HelpCircle, title: "3. Thực hành Quiz", desc: "Kiểm tra hiểu bản chất & tình huống" },
              { icon: Code2, title: "4. Code & Chấm bài", desc: "Tự viết hàm qua 100% Test Cases" },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.title} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#e06c53]">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{st.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chapters Syllabus List */}
        <div className="space-y-4">
          {COURSE_CHAPTERS.map((chapter) => {
            const lessons = chapter.lessonIds
              .map((id) => getLessonById(id))
              .filter((l): l is NonNullable<typeof l> => l !== undefined);
            const doneCount = lessons.filter((l) => completedIds.includes(l.id)).length;

            return (
              <div
                key={chapter.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
              >
                {/* Chapter Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-md bg-[#e06c53]/15 text-[#e06c53]">
                        CHƯƠNG {chapter.code}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {chapter.title}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
                      {chapter.chapterIntro.goal}
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 self-start sm:self-center">
                    {doneCount}/{lessons.length} bài
                  </span>
                </div>

                {/* Lessons Grid */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lessons.map((lesson) => {
                    const isPassed = completedIds.includes(lesson.id);
                    const isUnlocked = isCourseLessonUnlocked(lesson.id, completedIds);

                    if (!isUnlocked) {
                      return (
                        <div
                          key={lesson.id}
                          title="Hoàn thành (Pass) bài học trước đó để mở khóa"
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 opacity-60 cursor-not-allowed flex items-start justify-between gap-2"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="text-[11px] font-mono text-slate-400">{lesson.code}</div>
                            <div className="text-xs font-bold text-slate-500 truncate">{lesson.title}</div>
                          </div>
                          <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${lesson.id}`}
                        className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                          isPassed
                            ? "border-emerald-500/35 bg-emerald-500/5 hover:bg-emerald-500/10"
                            : "border-[#e06c53]/40 bg-[#e06c53]/5 hover:bg-[#e06c53]/10 shadow-2xs"
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono">
                            <span className={isPassed ? "text-emerald-500 font-bold" : "text-[#e06c53] font-bold"}>
                              {lesson.code}
                            </span>
                            {lesson.codeChallenge && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800 text-[10px] text-slate-500">
                                Code
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {lesson.title}
                          </div>
                        </div>

                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-[#e06c53] shrink-0 mt-0.5" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
