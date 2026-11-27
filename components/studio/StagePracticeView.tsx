"use client";

import { useState, useEffect } from "react";
import { CourseLesson } from "@/lib/course/types";
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

interface StagePracticeViewProps {
  lesson: CourseLesson;
  isPracticePassed: boolean;
  hasNextCodeStage: boolean;
  onPracticePassed: () => void;
  onContinueNextStage: () => void;
}

export function StagePracticeView({
  lesson,
  isPracticePassed,
  hasNextCodeStage,
  onPracticePassed,
  onContinueNextStage,
}: StagePracticeViewProps) {
  const questions = lesson.quizQuestions;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelectedAnswers({});
    setSubmitted(false);
  }, [lesson.id]);

  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);
  const correctCount = questions.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;
  const isAllCorrect = questions.length > 0 && correctCount === questions.length;

  const handleSubmit = () => {
    setSubmitted(true);
    if (isAllCorrect) {
      onPracticePassed();
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <HelpCircle className="w-4 h-4 text-[#e06c53]" />
            <span>Kiểm tra Hiểu Bản Chất ({questions.length} câu hỏi tình huống)</span>
          </div>
          {isPracticePassed && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Chặng 3 Đã đạt
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Trả lời đúng toàn bộ {questions.length} câu hỏi bên dưới để chứng minh bạn nắm vững cơ chế và trường hợp biên trước khi chuyển sang viết code.
        </p>
      </div>

      {/* Question Cards */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const picked = selectedAnswers[q.id];
          const isCorrect = picked === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-3 shadow-xs"
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                <span className="text-[#e06c53] font-mono mr-1.5">Câu {qIdx + 1}.</span>
                {q.question}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = picked === optIdx;
                  const isAnswer = optIdx === q.correctIndex;

                  let btnStyle =
                    "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 hover:border-slate-400";
                  if (submitted) {
                    if (isAnswer) {
                      btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold";
                    } else if (isSelected && !isAnswer) {
                      btnStyle = "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400";
                    }
                  } else if (isSelected) {
                    btnStyle = "border-[#e06c53] bg-[#e06c53]/10 text-slate-900 dark:text-white font-semibold";
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${
                        submitted ? "cursor-default" : "cursor-pointer"
                      } ${btnStyle}`}
                    >
                      <span>
                        <strong className="font-mono mr-2">{String.fromCharCode(65 + optIdx)}.</strong>
                        {opt}
                      </span>
                      {submitted && isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {submitted && isSelected && !isAnswer && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`rounded-xl p-3 text-xs leading-relaxed border ${
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-200"
                      : "bg-amber-500/10 border-amber-500/25 text-amber-800 dark:text-amber-200"
                  }`}
                >
                  <strong className="block mb-0.5">{isCorrect ? "✓ Chính xác!" : "✗ Chưa đúng — Giải thích:"}</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="ml-auto px-6 py-3 rounded-2xl bg-[#e06c53] hover:bg-[#d05c43] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-[#e06c53]/25 transition-all cursor-pointer"
          >
            Kiểm tra Đáp án
          </button>
        ) : !isAllCorrect ? (
          <div className="w-full flex items-center justify-between gap-3 bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl">
            <div className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-semibold">
              Bạn đạt {correctCount}/{questions.length} câu đúng. Hãy xem giải thích và làm lại để đạt 100%!
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between flex-wrap gap-3 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>
                {hasNextCodeStage
                  ? "Xuất sắc! Đạt 100% Quiz — Hãy tiến vào Chặng 4 Tự Code & Chấm bài!"
                  : "Hoàn thành xuất sắc bài học!"}
              </span>
            </div>
            {hasNextCodeStage && (
              <button
                onClick={onContinueNextStage}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <span>Sang Chặng 4: Code & Chấm bài</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
