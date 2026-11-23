"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Algorithm, Step } from "@/lib/types";
import { getAlgorithmById } from "@/lib/algorithms";
import { VisualizerCanvas } from "@/components/VisualizerCanvas";
import { ControlPanel } from "@/components/ControlPanel";
import { StepDescription } from "@/components/StepDescription";
import { CodePanel } from "@/components/CodePanel";
import { ComplexityBadge } from "@/components/ComplexityBadge";
import {
  generateRandomArray,
  generateNearlySortedArray,
  generateReversedArray,
  playStepSound,
  playTone,
  getPitchForValue,
  playCompletionSweep,
} from "@/lib/utils";
import { generateRandomWalls, generateStaircaseWalls } from "@/lib/algorithms/pathfinding";
import { generateQuizQuestions, QuizQuestion } from "@/lib/quiz";
import { QuizModal } from "@/components/QuizModal";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BookOpen,
  Share2,
  Check,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Trophy,
} from "lucide-react";

interface VisualizerClientProps {
  algorithmId: string;
}

export function VisualizerClient({ algorithmId }: VisualizerClientProps) {
  const algorithm = getAlgorithmById(algorithmId)!;
  const [arrayData, setArrayData] = useState<number[]>(
    algorithm?.defaultArray
      ? [...algorithm.defaultArray]
      : algorithm?.defaultTreeValues
      ? [...algorithm.defaultTreeValues]
      : []
  );
  const [target, setTarget] = useState<number | undefined>(algorithm?.defaultTarget);
  const [gridWalls, setGridWalls] = useState<[number, number][]>(
    algorithm?.defaultGrid?.walls ? [...algorithm.defaultGrid.walls] : []
  );
  const [gridStart, setGridStart] = useState<[number, number]>(
    algorithm?.defaultGrid?.start || [7, 4]
  );
  const [gridEnd, setGridEnd] = useState<[number, number]>(
    algorithm?.defaultGrid?.end || [7, 20]
  );
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quiz Mode State
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());

  // Re-generate steps when array, target or grid changes
  const initSteps = useCallback(
    (
      arr?: number[],
      tgt?: number,
      walls?: [number, number][],
      start?: [number, number],
      end?: [number, number]
    ) => {
      const activeArr = arr || arrayData;
      const activeTgt = tgt !== undefined ? tgt : target;
      const activeWalls = walls !== undefined ? walls : gridWalls;
      const activeStart = start || gridStart;
      const activeEnd = end || gridEnd;

      const generated = algorithm.generateSteps({
        array: activeArr,
        treeValues: activeArr,
        target: activeTgt,
        graph: algorithm.defaultGraph,
        walls: activeWalls,
        start: activeStart,
        end: activeEnd,
        rows: algorithm.defaultGrid?.rows,
        cols: algorithm.defaultGrid?.cols,
      });
      setSteps(generated);
      setCurrentStepIndex(0);
      setIsPlaying(false);

      // Generate dynamic quiz questions based on the executed steps
      const questions = generateQuizQuestions(generated, algorithm);
      setQuizQuestions(questions);
      setAnsweredQuestionIds(new Set());
    },
    [algorithm, arrayData, target, gridWalls, gridStart, gridEnd]
  );

  const handleGridChange = (
    nextWalls: [number, number][],
    nextStart: [number, number],
    nextEnd: [number, number]
  ) => {
    setGridWalls(nextWalls);
    setGridStart(nextStart);
    setGridEnd(nextEnd);
    initSteps(arrayData, target, nextWalls, nextStart, nextEnd);
  };

  // Trigger quiz question when current step matches a question in Quiz Mode
  useEffect(() => {
    if (!isQuizMode || isQuizModalOpen || quizQuestions.length === 0) return;

    const pendingQuestion = quizQuestions.find(
      (q) => q.stepIndex === currentStepIndex && !answeredQuestionIds.has(q.id)
    );

    if (pendingQuestion) {
      setIsPlaying(false);
      setActiveQuestion(pendingQuestion);
      setIsQuizModalOpen(true);
    }
  }, [currentStepIndex, isQuizMode, isQuizModalOpen, quizQuestions, answeredQuestionIds]);

  const handleQuizAnswer = (isCorrect: boolean, points: number) => {
    if (!activeQuestion) return;
    setAnsweredQuestionIds((prev) => new Set(prev).add(activeQuestion.id));

    if (isCorrect) {
      setQuizScore((prev) => prev + points);
      setQuizStreak((prev) => prev + 1);
    } else {
      setQuizStreak(0);
    }
  };

  const handleQuizContinue = () => {
    setIsQuizModalOpen(false);
    setActiveQuestion(null);
  };

  const handleToggleQuiz = () => {
    setIsQuizMode((prev) => !prev);
  };

  useEffect(() => {
    initSteps();
  }, [initSteps]);

  // Audio & Confetti trigger on step change
  useEffect(() => {
    if (!steps || steps.length === 0) return;
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    if (soundEnabled) {
      if (currentStepIndex === steps.length - 1) {
        if (currentStep.array && currentStep.array.length > 0 && algorithm.category === "sorting") {
          playCompletionSweep(currentStep.array);
        } else {
          playStepSound("complete");
        }
      } else {
        // Pitch-based Audio: Sound frequency scales proportionally with the active element values
        if (currentStep.array && currentStep.array.length > 0) {
          const minVal = Math.min(...currentStep.array);
          const maxVal = Math.max(...currentStep.array);

          if (currentStep.swapping && currentStep.swapping.length > 0) {
            const vals = currentStep.swapping.map((idx) => currentStep.array![idx]).filter((v) => v !== undefined);
            playStepSound("swap", vals, minVal, maxVal);
          } else if (currentStep.highlights && currentStep.highlights.length > 0) {
            const vals = currentStep.highlights.map((idx) => currentStep.array![idx]).filter((v) => v !== undefined);
            playStepSound("compare", vals, minVal, maxVal);
          } else if (currentStep.pivot !== undefined) {
            const pivotVal = currentStep.array[currentStep.pivot];
            playStepSound("compare", [pivotVal], minVal, maxVal);
          }
        } else if (currentStep.activeNodeValue !== undefined) {
          // Pitch-based audio for Tree algorithms (BST / AVL)
          playStepSound("compare", [currentStep.activeNodeValue], 0, 100);
        } else if (currentStep.currentCell) {
          // Pathfinding grid: pitch scales with distance or progress
          const dist = currentStep.cellMetrics?.distance ?? currentStepIndex;
          playTone(getPitchForValue(dist, 0, Math.max(steps.length, 25), 220, 780), "sine", 0.035, 0.035);
        } else if (currentStep.currentNode) {
          // Graph: pitch scales with traversal progression
          playTone(getPitchForValue(currentStepIndex, 0, Math.max(steps.length, 10), 260, 680), "sine", 0.04, 0.035);
        } else if (currentStep.currentDpCell) {
          // Dynamic Programming (0/1 Knapsack): pitch scales with item row & capacity column
          const [row, col] = currentStep.currentDpCell;
          const pitch = 220 + row * 70 + col * 45;
          playTone(pitch, "triangle", 0.04, 0.035);
        } else if (currentStep.nQueensBoard) {
          // Backtracking (N-Queens) sound design
          if (currentStep.isBacktracking) {
            playTone(180, "sawtooth", 0.06, 0.05); // Lower descending tone for backtrack
          } else if (currentStep.queenConflicts && currentStep.queenConflicts.length > 0) {
            playTone(240, "square", 0.03, 0.03); // Conflict warning click
          } else if (currentStep.currentQueen) {
            const [r, c] = currentStep.currentQueen;
            playTone(320 + r * 70 + c * 35, "sine", 0.05, 0.04); // Safe placement tone
          }
        } else if (currentStep.trie) {
          // Trie: pitch scales with prefix path depth
          const depth = currentStep.trieActivePath?.length || 1;
          playTone(280 + depth * 70, "sine", 0.04, 0.035);
        } else if (currentStep.kmpText) {
          // KMP: matching vs mismatching tones
          if (currentStep.kmpState === "found" || currentStep.kmpState === "match") {
            const pIdx = currentStep.kmpPatternIndex ?? 0;
            playTone(320 + pIdx * 45, "sine", 0.04, 0.035);
          } else if (currentStep.kmpState === "mismatch" || currentStep.kmpState === "lps-jump") {
            playTone(190, "sawtooth", 0.035, 0.03);
          }
        } else if (currentStep.dsuEdges) {
          // Kruskal / DSU: accepted edge vs cycle
          const considering = currentStep.dsuEdges.find((e) => e.status === "considering");
          if (considering) {
            playTone(300 + (considering.weight || 0) * 30, "triangle", 0.04, 0.035);
          }
        } else if (currentStep.segTree) {
          // Segment Tree: query inspection vs matched node
          playTone(getPitchForValue(currentStepIndex, 0, Math.max(steps.length, 12), 260, 680), "sine", 0.04, 0.035);
        } else if (currentStep.inDegree) {
          // Topological Sort: popping courses
          const count = currentStep.topoOrder?.length || 0;
          playTone(260 + count * 65, "sine", 0.05, 0.04);
        } else if (currentStep.lcsTable) {
          // LCS: cell updates
          const [i, j] = currentStep.currentLcsCell || [0, 0];
          playTone(220 + i * 35 + j * 25, "triangle", 0.035, 0.03);
        }
      }
    }

    // Celebration confetti when reaching the final step
    if (currentStepIndex === steps.length - 1 && steps.length > 1) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
      });
    }
  }, [currentStepIndex, steps, soundEnabled]);

  // Animation Timer Loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      if (currentStepIndex >= steps.length - 1) {
        setIsPlaying(false);
      } else {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => {
            if (prev >= steps.length - 1) {
              setIsPlaying(false);
              return prev;
            }
            return prev + 1;
          });
        }, speed);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      } else if (e.code === "KeyR") {
        e.preventDefault();
        setCurrentStepIndex(0);
        setIsPlaying(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStepIndex, steps.length]);

  // Control handlers
  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleRandomize = () => {
    const newArr = generateRandomArray(10, 10, 99);
    setArrayData(newArr);
    initSteps(newArr, target);
  };

  const handleNearlySorted = () => {
    const newArr = generateNearlySortedArray(10);
    setArrayData(newArr);
    initSteps(newArr, target);
  };

  const handleReversed = () => {
    const newArr = generateReversedArray(10);
    setArrayData(newArr);
    initSteps(newArr, target);
  };

  const handleCustomInput = (customArr: number[], customTgt?: number) => {
    setArrayData(customArr);
    if (customTgt !== undefined) {
      setTarget(customTgt);
    }
    initSteps(customArr, customTgt !== undefined ? customTgt : target);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const currentStep = steps[currentStepIndex] || {
    description: "Đang tải dữ liệu thuật toán...",
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Bar: Back button + Algorithm Header + Share */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trở về danh sách thuật toán</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {algorithm.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 uppercase tracking-wide">
              {algorithm.category}
            </span>
          </div>
        </div>

        {/* Action icons, quiz score & share */}
        <div className="flex items-center gap-2">
          {isQuizMode && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono shadow-sm animate-in fade-in">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{quizScore} XP</span>
              {quizStreak > 1 && <span className="text-rose-500 font-extrabold">🔥x{quizStreak}</span>}
            </div>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            title="Sao chép liên kết"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500">Đã chép link</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Complexity & Property Badges Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <ComplexityBadge label="Best" value={algorithm.complexity.best} />
        <ComplexityBadge label="Average" value={algorithm.complexity.average} />
        <ComplexityBadge label="Worst" value={algorithm.complexity.worst} />
        <ComplexityBadge label="Space" value={algorithm.complexity.space} type="space" />

        {algorithm.properties?.stable && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            Stable: Có
          </span>
        )}
        {algorithm.properties?.inPlace && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
            In-place: Có
          </span>
        )}
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visualizer Canvas + Controls + Step Description */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* Canvas */}
          <VisualizerCanvas
            currentStep={currentStep}
            category={algorithm.category}
            arraySize={arrayData.length}
            onGridChange={algorithm.category === "pathfinding" ? handleGridChange : undefined}
          />

          {/* Control Panel */}
          <ControlPanel
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            onSeek={(idx) => {
              setCurrentStepIndex(idx);
              setIsPlaying(false);
            }}
            speed={speed}
            onSpeedChange={setSpeed}
            soundEnabled={soundEnabled}
            onSoundToggle={() => setSoundEnabled(!soundEnabled)}
            isQuizMode={isQuizMode}
            onQuizToggle={handleToggleQuiz}
            category={algorithm.category}
            onRandomize={
              algorithm.category === "pathfinding"
                ? () => handleGridChange(generateRandomWalls(15, 25, gridStart, gridEnd, 0.28), gridStart, gridEnd)
                : (algorithm.category === "sorting" || algorithm.category === "searching" || algorithm.category === "array" || algorithm.category === "tree")
                ? handleRandomize
                : undefined
            }
            onNearlySorted={
              algorithm.category === "pathfinding"
                ? () => handleGridChange(generateStaircaseWalls(15, 25, gridStart, gridEnd), gridStart, gridEnd)
                : (algorithm.category === "sorting" || algorithm.category === "searching" || algorithm.category === "array" || algorithm.category === "tree")
                ? handleNearlySorted
                : undefined
            }
            onReversed={
              algorithm.category === "pathfinding"
                ? () => handleGridChange([], gridStart, gridEnd)
                : (algorithm.category === "sorting" || algorithm.category === "searching" || algorithm.category === "array" || algorithm.category === "tree")
                ? handleReversed
                : undefined
            }
            onCustomInput={
              (algorithm.category === "sorting" || algorithm.category === "searching" || algorithm.category === "array")
                ? handleCustomInput
                : undefined
            }
            currentTarget={target}
          />

          {/* Step Description */}
          <StepDescription step={currentStep} totalSteps={steps.length} />
        </div>

        {/* Right Column: Code Panel + Educational Description */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Code Panel */}
          <div className="h-[420px]">
            <CodePanel code={algorithm.code} activeLine={currentStep.codeLine} />
          </div>

          {/* Educational Explanation Box */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Nguyên lý hoạt động
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {algorithm.fullDescription}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Phím tắt điều khiển:</span>
              </div>
              <p>• <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">Space</kbd>: Chạy / Tạm dừng</p>
              <p>• <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">→</kbd>: Bước kế tiếp | <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">←</kbd>: Bước trước</p>
              <p>• <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">R</kbd>: Reset về đầu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quiz Practice Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        question={activeQuestion}
        questionIndex={
          activeQuestion
            ? quizQuestions.findIndex((q) => q.id === activeQuestion.id)
            : 0
        }
        totalQuestions={quizQuestions.length}
        score={quizScore}
        streak={quizStreak}
        onAnswer={handleQuizAnswer}
        onContinue={handleQuizContinue}
        onClose={() => setIsQuizModalOpen(false)}
      />
    </div>
  );
}
