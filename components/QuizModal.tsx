"use client";

import { useState, useEffect } from "react";
import { QuizQuestion } from "@/lib/quiz";
import { playQuizSound } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
} from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  question: QuizQuestion | null;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  onAnswer: (isCorrect: boolean, points: number) => void;
  onContinue: () => void;
  onClose: () => void;
}

export function QuizModal({
  isOpen,
  question,
  questionIndex,
  totalQuestions,
  score,
  streak,
  onAnswer,
  onContinue,
  onClose,
}: QuizModalProps) {
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset local state when a new question arrives
  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
    setIsCorrect(false);
  }, [question?.id]);

  // Keyboard navigation (A, B, C, D or 1, 2, 3, 4)
  useEffect(() => {
    if (!isOpen || !question) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasAnswered) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onContinue();
        }
        return;
      }

      const keyMap: Record<string, "A" | "B" | "C" | "D"> = {
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
      };
      const chosen = keyMap[e.key.toLowerCase()];
      if (chosen) {
        handleOptionSelect(chosen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, question, hasAnswered, onContinue]);

  if (!isOpen || !question) return null;

  const handleOptionSelect = (optionId: "A" | "B" | "C" | "D") => {
    if (hasAnswered) return;

    setSelectedOption(optionId);
    setHasAnswered(true);

    const correct = optionId === question.correctOptionId;
    setIsCorrect(correct);

    if (correct) {
      playQuizSound("correct");
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
      });
      onAnswer(true, question.points);
    } else {
      playQuizSound("wrong");
      onAnswer(false, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Top Header: Badge + Stats */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Thử Thách Giải Thuật
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Câu hỏi {questionIndex + 1} / {totalQuestions}
              </p>
            </div>
          </div>

          {/* Gamification Badges */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{score} XP</span>
            </div>

            {streak > 1 && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold animate-pulse">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>x{streak}</span>
              </div>
            )}
          </div>
        </div>

        {/* Question Body */}
        <div className="space-y-2">
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {question.question}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chọn đáp án đúng bằng cách click chuột hoặc gõ phím <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px]">A</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px]">B</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px]">C</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px]">D</kbd>:
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrectOption = opt.id === question.correctOptionId;

            let cardStyle =
              "border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200";

            if (hasAnswered) {
              if (isCorrectOption) {
                cardStyle =
                  "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500 shadow-sm";
              } else if (isSelected && !isCorrectOption) {
                cardStyle =
                  "border-rose-500 bg-rose-50/80 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 line-through opacity-80 ring-1 ring-rose-500";
              } else {
                cardStyle = "opacity-40 border-slate-200 dark:border-slate-800 text-slate-500";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleOptionSelect(opt.id)}
                disabled={hasAnswered}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-150 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      hasAnswered && isCorrectOption
                        ? "bg-emerald-500 text-white"
                        : hasAnswered && isSelected
                        ? "bg-rose-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </div>

                {hasAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                )}
                {hasAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Action Footer */}
        {hasAnswered && (
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm ${
                isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Xuất sắc! +{question.points} XP</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>Giải thích chi tiết:</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed opacity-95">{question.explanation}</p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                Nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">Enter</kbd> để tiếp tục
              </span>

              <button
                onClick={onContinue}
                className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                <span>Tiếp tục giải thuật</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
