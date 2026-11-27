"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CourseLesson } from "@/lib/course/types";
import { runCodeChallenge, JudgeRunResult } from "@/lib/course/codeRunner";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Code2,
  Terminal,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

interface StageCodeJudgeViewProps {
  lesson: CourseLesson;
  isCodePassed: boolean;
  isLessonPassed: boolean;
  nextLesson: { id: string; code: string; title: string } | null;
  onCodeAllPassed: () => void;
}

export function StageCodeJudgeView({
  lesson,
  isCodePassed,
  isLessonPassed,
  nextLesson,
  onCodeAllPassed,
}: StageCodeJudgeViewProps) {
  const spec = lesson.codeChallenge;
  const [code, setCode] = useState(spec?.starterCode || "");
  const [result, setResult] = useState<JudgeRunResult | null>(null);
  const [showHintIndex, setShowHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setCode(spec?.starterCode || "");
    setResult(null);
    setShowHintIndex(0);
    setShowSolution(false);
  }, [lesson.id, spec?.starterCode]);

  if (!spec) return null;

  const handleRunTests = () => {
    const runRes = runCodeChallenge(code, spec);
    setResult(runRes);
    if (runRes.allPassed) {
      onCodeAllPassed();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = code.substring(0, start) + "  " + code.substring(end);
      setCode(updated);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunTests();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* Challenge Prompt Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#e06c53]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{spec.title}</h3>
          </div>
          {isCodePassed && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã Pass Test Cases
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {spec.prompt}
        </p>

        {/* Hints & Sample Solution Controls */}
        <div className="flex items-center flex-wrap gap-2 pt-1">
          {spec.hints.length > 0 && (
            <button
              onClick={() => setShowHintIndex((prev) => (prev < spec.hints.length ? prev + 1 : 0))}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHintIndex === 0 ? "Xem gợi ý" : `Gợi ý (${showHintIndex}/${spec.hints.length})`}</span>
            </button>
          )}

          <button
            onClick={() => setShowSolution((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showSolution ? "Ẩn code mẫu" : "Xem đáp án tham khảo"}</span>
          </button>
        </div>

        {showHintIndex > 0 && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3 space-y-1 text-xs text-amber-800 dark:text-amber-200">
            {spec.hints.slice(0, showHintIndex).map((h, i) => (
              <p key={i}>• {h}</p>
            ))}
          </div>
        )}

        {showSolution && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold text-amber-400">Đáp án tham khảo (Nên tự gõ lại để ghi nhớ!)</span>
              <button
                onClick={() => setCode(spec.solutionCode)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
              >
                Nạp vào Editor
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {spec.solutionCode}
            </pre>
          </div>
        )}
      </div>

      {/* Main Split: Code Editor + Test Case Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left/Top: JavaScript Code Editor (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col shadow-lg">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e06c53]" />
              <span>solution.js</span>
              <span className="text-[10px] text-slate-500">({spec.functionName})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCode(spec.starterCode);
                  setResult(null);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                title="Khôi phục khung code mặc định"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleRunTests}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Chạy Test Cases</span>
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            rows={15}
            className="w-full flex-1 bg-slate-950 text-slate-100 font-mono text-[15px] sm:text-[13px] p-4 leading-relaxed focus:outline-none resize-y min-h-[300px]"
            placeholder="// Viết mã JavaScript của bạn tại đây..."
          />

          <div className="px-4 py-2 bg-slate-900/70 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Hỗ trợ phím Tab thụt lề • Chạy an toàn trực tiếp trong trình duyệt</span>
            <span>Ctrl + Enter để Chấm bài</span>
          </div>
        </div>

        {/* Right/Bottom: Judge Output & Test Cases (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <Terminal className="w-4 h-4 text-[#e06c53]" />
                <span>Trình Chấm Bài Tự Động ({spec.testCases.length} Tests)</span>
              </div>
              {result && !result.compileError && (
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    result.allPassed
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-rose-500/15 text-rose-500"
                  }`}
                >
                  {result.passedCount}/{result.totalCount} Passed
                </span>
              )}
            </div>

            {result?.compileError && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-500 font-mono space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Lỗi biên dịch / Cú pháp:</span>
                </div>
                <p>{result.compileError}</p>
              </div>
            )}

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {(result ? result.results : spec.testCases.map((tc) => ({
                name: tc.name,
                passed: null as boolean | null,
                inputDisplay: tc.inputArgs.map((a) => JSON.stringify(a)).join(", "),
                expectedDisplay: JSON.stringify(tc.expected),
                actualDisplay: "",
                error: undefined,
                durationMs: 0,
                isEdgeCase: tc.isEdgeCase,
              }))).map((tc, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 text-xs space-y-1.5 transition-all ${
                    tc.passed === true
                      ? "border-emerald-500/35 bg-emerald-500/5"
                      : tc.passed === false
                      ? "border-rose-500/35 bg-rose-500/5"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      {tc.passed === true && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      {tc.passed === false && <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                      <span className="truncate">Case {idx + 1}: {tc.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {tc.isEdgeCase && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-500 text-[10px] font-bold">
                          Edge
                        </span>
                      )}
                      {tc.passed !== null && (
                        <span className="text-[10px] font-mono text-slate-400">{tc.durationMs}ms</span>
                      )}
                    </div>
                  </div>

                  <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 break-all">
                    <div><span className="text-slate-400">Input:</span> {tc.inputDisplay}</div>
                    <div><span className="text-slate-400">Expected:</span> <span className="text-emerald-500">{tc.expectedDisplay}</span></div>
                    {tc.passed === false && (
                      <div>
                        <span className="text-slate-400">Actual:</span>{" "}
                        <span className="text-rose-500">{tc.error ? `${tc.actualDisplay} (${tc.error})` : tc.actualDisplay}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {result && result.logs.length > 0 && (
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Console Output:</div>
                {result.logs.map((log, i) => (
                  <div key={i} className="text-[11px] font-mono text-cyan-300">
                    &gt; {log}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Victory / Next Lesson Unlock Card */}
          {(result?.allPassed || isCodePassed) && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Sparkles className="w-5 h-5 shrink-0" />
                <span>
                  {isLessonPassed
                    ? "🎉 Chúc mừng! Bạn đã chính thức PASS bài học này!"
                    : "Pass 100% Test Cases! Hãy đảm bảo hoàn tất Chặng 1 (Lý thuyết) & Chặng 3 (Quiz) để mở khóa bài tiếp theo."}
                </span>
              </div>
              {isLessonPassed && nextLesson && (
                <Link
                  href={`/learn/${nextLesson.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <span className="truncate">Sang bài tiếp theo ({nextLesson.code}): {nextLesson.title}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
