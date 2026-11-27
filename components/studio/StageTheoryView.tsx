"use client";

import { CourseChapterMeta, CourseLesson } from "@/lib/course/types";
import {
  BookOpen,
  Lightbulb,
  CheckCircle2,
  ShieldCheck,
  Gauge,
  AlertTriangle,
  Scale,
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookMarked,
} from "lucide-react";

interface StageTheoryViewProps {
  lesson: CourseLesson;
  chapter: CourseChapterMeta;
  isFirstInChapter: boolean;
  isLastInChapter: boolean;
  isTheoryDone: boolean;
  onMarkTheoryDoneAndContinue: () => void;
}

export function StageTheoryView({
  lesson,
  chapter,
  isFirstInChapter,
  isLastInChapter,
  isTheoryDone,
  onMarkTheoryDoneAndContinue,
}: StageTheoryViewProps) {
  const { theory } = lesson;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Chapter Intro Banner (Displayed at first lesson of chapter, or collapsible summary) */}
      {isFirstInChapter && (
        <div className="rounded-2xl border border-[#e06c53]/30 bg-gradient-to-br from-[#e06c53]/10 via-amber-500/5 to-transparent p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e06c53]">
            <BookMarked className="w-4 h-4" />
            <span>Mở đầu Chương {chapter.code}: {chapter.title}</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
            {chapter.chapterIntro.goal}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {chapter.chapterIntro.whyLearn}
          </p>
          <div className="pt-1 flex flex-wrap gap-2">
            {chapter.chapterIntro.keyTakeaways.map((tk, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                • {tk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 1. Bài toán & Ứng dụng thực tế */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <span className="w-6 h-6 rounded-lg bg-[#e06c53]/15 text-[#e06c53] flex items-center justify-center font-mono text-xs font-extrabold">
            1
          </span>
          <BookOpen className="w-4 h-4 text-[#e06c53]" />
          <h3>Đặt vấn đề & Ứng dụng thực tế</h3>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {theory.problemAndApplications}
        </p>
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ứng dụng thực tiễn:</div>
          <ul className="space-y-1">
            {theory.realWorldApps.map((app, i) => (
              <li key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">▸</span>
                <span>{app}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Ý tưởng cốt lõi & Trực giác */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center font-mono text-xs font-extrabold">
            2
          </span>
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3>Ý tưởng cốt lõi & Trực giác</h3>
        </div>
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-slate-800 dark:text-amber-100 leading-relaxed">
          {theory.coreIntuition}
        </div>
      </section>

      {/* 3. Cơ chế từng bước & Tính đúng đắn (Loop Invariant) */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <span className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-mono text-xs font-extrabold">
            3
          </span>
          <ShieldCheck className="w-4 h-4 text-cyan-500" />
          <h3>Cơ chế hoạt động & Bất biến đúng đắn (Loop Invariant)</h3>
        </div>

        <ol className="space-y-2">
          {theory.mechanismSteps.map((stepText, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-slate-600 dark:text-slate-300">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{stepText}</span>
            </li>
          ))}
        </ol>

        <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/25 p-3.5 text-xs sm:text-sm text-cyan-900 dark:text-cyan-200 leading-relaxed">
          <strong className="font-bold uppercase text-[11px] tracking-wider block mb-1 text-cyan-600 dark:text-cyan-400">
            Tính bất biến (Loop Invariant / Định lý cốt lõi):
          </strong>
          {theory.loopInvariant}
        </div>
      </section>

      {/* 4. Phân tích Độ phức tạp */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-mono text-xs font-extrabold">
            4
          </span>
          <Gauge className="w-4 h-4 text-emerald-500" />
          <h3>Phân tích Độ phức tạp (Complexity Deep-Dive)</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Tốt nhất (Best)</div>
            <div className="font-mono text-sm font-extrabold text-emerald-500 mt-0.5">{theory.complexityDeepDive.best}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Trung bình (Avg)</div>
            <div className="font-mono text-sm font-extrabold text-cyan-500 mt-0.5">{theory.complexityDeepDive.average}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Tệ nhất (Worst)</div>
            <div className="font-mono text-sm font-extrabold text-rose-500 mt-0.5">{theory.complexityDeepDive.worst}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Bộ nhớ (Space)</div>
            <div className="font-mono text-sm font-extrabold text-amber-500 mt-0.5">{theory.complexityDeepDive.space}</div>
          </div>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p><strong className="text-slate-900 dark:text-white">• Giải thích Thời gian:</strong> {theory.complexityDeepDive.timeExplanation}</p>
          <p><strong className="text-slate-900 dark:text-white">• Giải thích Không gian:</strong> {theory.complexityDeepDive.spaceExplanation}</p>
        </div>
      </section>

      {/* 5 & 6. Trường hợp biên & Trade-offs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h3>5. Trường hợp biên & Bẫy phỏng vấn</h3>
          </div>
          <ul className="space-y-2">
            {theory.edgeCasesAndPitfalls.map((edge, i) => (
              <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                <span className="text-rose-500 font-bold mt-0.5">!</span>
                <span>{edge}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
            <Scale className="w-4 h-4" />
            <h3>6. So sánh & Lựa chọn (Trade-offs)</h3>
          </div>
          <ul className="space-y-2">
            {theory.tradeOffs.map((tf, i) => (
              <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                <span className="text-indigo-500 font-bold mt-0.5">⚖</span>
                <span>{tf}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Chapter Summary Card (if last lesson of chapter) */}
      {isLastInChapter && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Tổng kết Chương {chapter.code}: {chapter.title}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {chapter.chapterSummary.recap}
          </p>
          <ul className="space-y-1 pt-1">
            {chapter.chapterSummary.comparisonNotes.map((note, i) => (
              <li key={i} className="text-xs text-slate-600 dark:text-slate-400">
                ✓ {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Academic References */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
        <GraduationCap className="w-4 h-4 text-slate-400" />
        <span className="font-semibold">Nguồn tham khảo chính thống:</span>
        {theory.references.map((ref, i) => (
          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {ref}
          </span>
        ))}
      </div>

      {/* CTA Continue to Stage 2 */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onMarkTheoryDoneAndContinue}
          className="px-6 py-3 rounded-2xl bg-[#e06c53] hover:bg-[#d05c43] text-white font-bold text-sm shadow-lg shadow-[#e06c53]/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          {isTheoryDone ? <CheckCircle2 className="w-4 h-4" /> : null}
          <span>{isTheoryDone ? "Đã đọc Lý thuyết • Sang Chặng 2 (Demo)" : "Tôi đã nắm Lý thuyết → Sang Chặng 2: Xem Demo"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
