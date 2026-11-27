"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { Algorithm, Step } from "@/lib/types";
import { getAlgorithmById } from "@/lib/algorithms";
import { VisualizerCanvas } from "@/components/VisualizerCanvas";
import { ControlPanel } from "@/components/ControlPanel";
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
import { ExportModal } from "@/components/ExportModal";
import { ChallengeHUD } from "@/components/challenge/ChallengeHUD";
import { ChallengeHintBanner } from "@/components/challenge/ChallengeHintBanner";
import { ChallengeVictoryModal } from "@/components/challenge/ChallengeVictoryModal";
import {
  getChallengePrompt,
  getChallengeHint,
  calculateChallengeRank,
  ChallengeFeedback,
  ChallengeStats,
} from "@/lib/challenge";
import {
  isAlgorithmCompleted,
  toggleAlgorithmCompleted,
  markAlgorithmCompleted,
  getStoredCompletedAlgorithms,
  EVENT_PROGRESS_UPDATED,
} from "@/lib/roadmap";
import {
  ALL_COURSE_LESSONS,
  getLessonById,
  getChapterForLesson,
  isCourseLessonUnlocked,
  getCourseFrontierLesson,
  getCourseNavigationContext,
} from "@/lib/course";
import {
  getLessonStages,
  updateLessonStage,
  EVENT_STAGES_UPDATED,
  DEFAULT_STAGE_PROGRESS,
} from "@/lib/course/progress";
import { LessonStageProgress } from "@/lib/course/types";
import { StudioSyllabusSidebar } from "@/components/studio/StudioSyllabusSidebar";
import { StudioLessonPanel } from "@/components/studio/StudioLessonPanel";
import { StageTheoryView } from "@/components/studio/StageTheoryView";
import { StagePracticeView } from "@/components/studio/StagePracticeView";
import { StageCodeJudgeView } from "@/components/studio/StageCodeJudgeView";
import { ConceptSandboxWidget } from "@/components/studio/ConceptSandboxWidget";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Share2,
  Check,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Trophy,
  Camera,
  Eye,
  Gamepad2,
  Map,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  FolderOpen,
  Lock,
  Code2,
} from "lucide-react";

interface VisualizerClientProps {
  algorithmId?: string;
  lessonId?: string;
  initialStage?: 1 | 2 | 3 | 4;
}

export function VisualizerClient({
  algorithmId,
  lessonId,
  initialStage = 2,
}: VisualizerClientProps) {
  const resolvedId = lessonId || algorithmId || "course-intro";
  const lesson = getLessonById(resolvedId) || ALL_COURSE_LESSONS[0];
  const algorithm = lesson.algorithmId ? getAlgorithmById(lesson.algorithmId) : undefined;
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Challenge Mode State
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [challengeHearts, setChallengeHearts] = useState(3);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [challengeMaxStreak, setChallengeMaxStreak] = useState(0);
  const [challengeMistakes, setChallengeMistakes] = useState(0);
  const [challengeTotalActions, setChallengeTotalActions] = useState(0);
  const [challengeHintsUsed, setChallengeHintsUsed] = useState(0);
  const [challengeElapsedSeconds, setChallengeElapsedSeconds] = useState(0);
  const [challengeSelectedIndices, setChallengeSelectedIndices] = useState<number[]>([]);
  const [challengeFeedback, setChallengeFeedback] = useState<ChallengeFeedback | null>(null);
  const [challengeActiveHint, setChallengeActiveHint] = useState<string | null>(null);
  const [isChallengeVictoryModalOpen, setIsChallengeVictoryModalOpen] = useState(false);
  const [isChallengeGameOver, setIsChallengeGameOver] = useState(false);

  // Roadmap & Stage Progress State
  const [isCompletedInRoadmap, setIsCompletedInRoadmap] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4>(initialStage);
  const [stageProgress, setStageProgress] = useState<LessonStageProgress>({ ...DEFAULT_STAGE_PROGRESS });

  // 3-Panel Studio Layout States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLessonPanelOpen, setIsLessonPanelOpen] = useState(true);

  // Load saved sidebar preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("dsa_studio_sidebar_open");
      if (saved !== null) {
        setIsSidebarOpen(saved === "true" && window.innerWidth >= 1024);
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("dsa_studio_sidebar_open", String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const storedCompleted = getStoredCompletedAlgorithms();
    setCompletedIds(storedCompleted);
    setIsCompletedInRoadmap(storedCompleted.includes(lesson.id));
    setStageProgress(getLessonStages(lesson.id));
    setHasLoadedProgress(true);

    const handleProgress = (e: any) => {
      const ids = e.detail || getStoredCompletedAlgorithms();
      setCompletedIds(ids);
      setIsCompletedInRoadmap(ids.includes(lesson.id));
    };

    const handleStages = (e: any) => {
      if (e.detail?.lessonId === lesson.id) {
        setStageProgress(e.detail.progress);
      } else {
        setStageProgress(getLessonStages(lesson.id));
      }
    };

    window.addEventListener(EVENT_PROGRESS_UPDATED, handleProgress);
    window.addEventListener(EVENT_STAGES_UPDATED, handleStages);
    return () => {
      window.removeEventListener(EVENT_PROGRESS_UPDATED, handleProgress);
      window.removeEventListener(EVENT_STAGES_UPDATED, handleStages);
    };
  }, [lesson.id]);

  // Chapter & Navigation Context (Curriculum 42-Lesson Blueprint)
  const chapter = useMemo(() => getChapterForLesson(lesson.id), [lesson.id]);
  const courseNav = useMemo(() => getCourseNavigationContext(lesson.id), [lesson.id]);
  const isLessonUnlocked = useMemo(
    () => !hasLoadedProgress || isCourseLessonUnlocked(lesson.id, completedIds),
    [hasLoadedProgress, lesson.id, completedIds]
  );
  const frontierLesson = useMemo(
    () => getCourseFrontierLesson(completedIds),
    [completedIds]
  );

  const handleUpdateStage = useCallback(
    (patch: Partial<LessonStageProgress>) => {
      const updated = updateLessonStage(lesson.id, patch, Boolean(lesson.codeChallenge));
      setStageProgress(updated);
      if (updated.isPassed && !isCompletedInRoadmap) {
        setIsCompletedInRoadmap(true);
        setCompletedIds(getStoredCompletedAlgorithms());
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      return updated;
    },
    [lesson.id, lesson.codeChallenge, isCompletedInRoadmap]
  );

  // Mark demoCompleted when user watches simulation to the final step (does NOT auto-pass whole lesson!)
  useEffect(() => {
    if (!hasLoadedProgress || !isLessonUnlocked || !algorithm) return;
    if (steps.length > 1 && currentStepIndex === steps.length - 1 && !stageProgress.demoCompleted) {
      handleUpdateStage({ demoCompleted: true });
    }
  }, [currentStepIndex, steps.length, stageProgress.demoCompleted, algorithm, hasLoadedProgress, isLessonUnlocked, handleUpdateStage]);

  const triggerChallengeVictory = () => {
    handleUpdateStage({ demoCompleted: true, practicePassed: true });
    setIsChallengeVictoryModalOpen(true);
  };

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

      if (!algorithm) return;
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
        if (currentStep.array && currentStep.array.length > 0 && algorithm?.category === "sorting") {
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

  // Challenge Timer Loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isChallengeMode && !isChallengeVictoryModalOpen && !isChallengeGameOver) {
      timer = setInterval(() => {
        setChallengeElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isChallengeMode, isChallengeVictoryModalOpen, isChallengeGameOver]);

  const handleRestartChallenge = () => {
    handleRandomize();
    setCurrentStepIndex(0);
    setChallengeHearts(3);
    setChallengeScore(0);
    setChallengeStreak(0);
    setChallengeMaxStreak(0);
    setChallengeMistakes(0);
    setChallengeTotalActions(0);
    setChallengeHintsUsed(0);
    setChallengeElapsedSeconds(0);
    setChallengeSelectedIndices([]);
    setChallengeFeedback(null);
    setChallengeActiveHint(null);
    setIsChallengeGameOver(false);
    setIsChallengeVictoryModalOpen(false);
  };

  const handleChallengeSelectIndex = (idx: number) => {
    if (isChallengeGameOver || isChallengeVictoryModalOpen) return;
    setChallengeSelectedIndices((prev) => {
      if (prev.includes(idx)) {
        return prev.filter((i) => i !== idx);
      }
      if (prev.length < 2) {
        return [...prev, idx];
      }
      return [prev[1], idx];
    });
    playTone(320 + idx * 30, "sine", 0.04, 0.03);
  };

  const handleChallengeSelectNode = (nodeId: string) => {
    if (isChallengeGameOver || isChallengeVictoryModalOpen) return;
    const nextStep = steps[currentStepIndex + 1];
    setChallengeTotalActions((prev) => prev + 1);

    if (nextStep && nextStep.currentNode === nodeId) {
      const nextStreak = challengeStreak + 1;
      setChallengeStreak(nextStreak);
      setChallengeMaxStreak((prev) => Math.max(prev, nextStreak));
      setChallengeScore((prev) => prev + 20 * nextStreak);
      setChallengeFeedback({
        type: "success",
        message: `Chính xác! Đỉnh '${nodeId}' được lấy ra xử lý tiếp theo (+${20 * nextStreak} XP)!`,
      });
      playTone(550, "triangle", 0.08, 0.05);

      if (currentStepIndex + 1 >= steps.length - 1) {
        triggerChallengeVictory();
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    } else {
      const nextHearts = challengeHearts - 1;
      setChallengeHearts(nextHearts);
      setChallengeMistakes((prev) => prev + 1);
      setChallengeStreak(0);
      setChallengeFeedback({
        type: "error",
        message: `Chưa đúng! Đỉnh '${nodeId}' chưa phải là đỉnh tiếp theo cần duyệt!`,
        hint: `Gợi ý: Kiểm tra thứ tự các đỉnh trong hàng đợi / ngăn xếp!`,
      });
      playTone(180, "sawtooth", 0.1, 0.08);

      if (nextHearts <= 0) {
        setIsChallengeGameOver(true);
        setIsChallengeVictoryModalOpen(true);
      }
    }
  };

  const handleChallengeSwap = () => {
    if (challengeSelectedIndices.length !== 2) return;
    const [i, j] = challengeSelectedIndices;
    const nextStep = steps[currentStepIndex + 1];
    setChallengeTotalActions((prev) => prev + 1);

    if (
      nextStep &&
      nextStep.swapping &&
      nextStep.swapping.includes(i) &&
      nextStep.swapping.includes(j)
    ) {
      const nextStreak = challengeStreak + 1;
      setChallengeStreak(nextStreak);
      setChallengeMaxStreak((prev) => Math.max(prev, nextStreak));
      setChallengeScore((prev) => prev + 20 * nextStreak);
      setChallengeFeedback({
        type: "success",
        message: `Chính xác! Đã hoán đổi vị trí [${i}] và [${j}] thành công (+${20 * nextStreak} XP)!`,
      });
      setChallengeSelectedIndices([]);
      setChallengeActiveHint(null);
      playTone(600, "triangle", 0.07, 0.05);

      if (currentStepIndex + 1 >= steps.length - 1) {
        triggerChallengeVictory();
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    } else {
      const nextHearts = challengeHearts - 1;
      setChallengeHearts(nextHearts);
      setChallengeMistakes((prev) => prev + 1);
      setChallengeStreak(0);
      setChallengeFeedback({
        type: "error",
        message: `Chưa đúng! Trong lượt này cặp [${i}] và [${j}] không cần hoán đổi (hoặc chưa đến lượt xét)!`,
        hint: `Gợi ý: Xem kỹ chiều duyệt và quy tắc so sánh của ${algorithm?.name || lesson.title}!`,
      });
      playTone(180, "sawtooth", 0.1, 0.08);

      if (nextHearts <= 0) {
        setIsChallengeGameOver(true);
        setIsChallengeVictoryModalOpen(true);
      }
    }
  };

  const handleChallengeNoSwap = () => {
    if (challengeSelectedIndices.length !== 2) return;
    const [i, j] = challengeSelectedIndices;
    const nextStep = steps[currentStepIndex + 1];
    setChallengeTotalActions((prev) => prev + 1);

    const isNextSwapping = nextStep && nextStep.swapping && nextStep.swapping.includes(i) && nextStep.swapping.includes(j);

    if (!isNextSwapping) {
      const nextStreak = challengeStreak + 1;
      setChallengeStreak(nextStreak);
      setChallengeMaxStreak((prev) => Math.max(prev, nextStreak));
      setChallengeScore((prev) => prev + 20 * nextStreak);
      setChallengeFeedback({
        type: "success",
        message: `Chính xác! Cặp [${i}] và [${j}] đã đúng thứ tự nên không cần hoán đổi (+${20 * nextStreak} XP)!`,
      });
      setChallengeSelectedIndices([]);
      setChallengeActiveHint(null);
      playTone(550, "sine", 0.06, 0.04);

      if (currentStepIndex + 1 >= steps.length - 1) {
        triggerChallengeVictory();
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    } else {
      const nextHearts = challengeHearts - 1;
      setChallengeHearts(nextHearts);
      setChallengeMistakes((prev) => prev + 1);
      setChallengeStreak(0);
      setChallengeFeedback({
        type: "error",
        message: `Chưa đúng! Cặp [${i}] và [${j}] đang sai thứ tự nên bắt buộc phải hoán đổi!`,
      });
      playTone(180, "sawtooth", 0.1, 0.08);

      if (nextHearts <= 0) {
        setIsChallengeGameOver(true);
        setIsChallengeVictoryModalOpen(true);
      }
    }
  };

  const handleChallengeConfirmSelection = () => {
    if (challengeSelectedIndices.length === 0) return;
    const idx = challengeSelectedIndices[0];
    const nextStep = steps[currentStepIndex + 1];
    setChallengeTotalActions((prev) => prev + 1);

    if (algorithm?.id === "binary-search" && nextStep && nextStep.pivot === idx) {
      const nextStreak = challengeStreak + 1;
      setChallengeStreak(nextStreak);
      setChallengeMaxStreak((prev) => Math.max(prev, nextStreak));
      setChallengeScore((prev) => prev + 25 * nextStreak);
      setChallengeFeedback({
        type: "success",
        message: `Chính xác! Vị trí mid = ${idx} là trung điểm chính xác (+${25 * nextStreak} XP)!`,
      });
      setChallengeSelectedIndices([]);
      setChallengeActiveHint(null);
      playTone(650, "triangle", 0.07, 0.05);

      if (currentStepIndex + 1 >= steps.length - 1) {
        triggerChallengeVictory();
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    } else {
      const nextHearts = challengeHearts - 1;
      setChallengeHearts(nextHearts);
      setChallengeMistakes((prev) => prev + 1);
      setChallengeStreak(0);
      setChallengeFeedback({
        type: "error",
        message: `Chưa đúng! Vị trí [${idx}] không phải là điểm cần chọn ở bước này.`,
      });
      playTone(180, "sawtooth", 0.1, 0.08);

      if (nextHearts <= 0) {
        setIsChallengeGameOver(true);
        setIsChallengeVictoryModalOpen(true);
      }
    }
  };

  const handleChallengeUseHint = () => {
    if (!algorithm) return;
    setChallengeHintsUsed((prev) => prev + 1);
    setChallengeScore((prev) => Math.max(0, prev - 5));
    const hint = getChallengeHint(algorithm, steps[currentStepIndex], steps[currentStepIndex + 1]);
    setChallengeActiveHint(hint);
  };

  const handleChallengeGiveUp = () => {
    setIsChallengeGameOver(true);
    setIsChallengeVictoryModalOpen(true);
  };

  const challengePrompt = algorithm
    ? getChallengePrompt(algorithm, steps[currentStepIndex] || {}, steps[currentStepIndex + 1])
    : { prompt: "" };

  const currentStep = steps[currentStepIndex] || {
    description: "Đang tải dữ liệu thuật toán...",
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Studio Top Control Ribbon */}
      <div className="sticky top-0 z-30 w-full max-w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3 shadow-2xs">
        {/* Left Side: Sidebar Toggle & Chapter Context */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <button
            onClick={handleToggleSidebar}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer shrink-0 ${
              isSidebarOpen
                ? "bg-slate-100 dark:bg-slate-800 text-[#e06c53] border-slate-300 dark:border-slate-700"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
            title={isSidebarOpen ? "Ẩn danh mục khóa học" : "Hiện danh mục khóa học"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            <span className="hidden sm:inline">Khóa học</span>
          </button>

          {chapter && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="font-mono text-[#e06c53] font-bold">[{chapter.code}]</span>
              <span className="truncate">{chapter.title}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                • Bài {courseNav.indexInChapter}/{chapter.lessonIds.length}
              </span>
            </div>
          )}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            <span className="font-mono text-[#e06c53] mr-1.5 text-sm">{lesson.code}</span>
            {lesson.title}
          </h1>
        </div>

        {/* Right Side: Quick Action Pills & Lesson Panel Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Lesson Pass Status Pill (Earned strictly by passing stages & code) */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-xs ${
              isCompletedInRoadmap
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800"
            }`}
            title={
              isCompletedInRoadmap
                ? "Bạn đã Pass bài học này!"
                : lesson.codeChallenge
                ? "Hoàn tất Lý thuyết, Kiểm tra Quiz và Pass 100% Test Cases Code để qua bài"
                : "Hoàn tất Lý thuyết, Tương tác và Quiz để qua bài"
            }
          >
            {isCompletedInRoadmap ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline">
              {isCompletedInRoadmap ? "Đã Pass" : "Chưa Pass"}
            </span>
          </div>

          {algorithm && (
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
              title="Xuất Video / Ảnh động / Snapshot PNG"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline ml-1">Xuất ảnh</span>
            </button>
          )}

          {/* Share button */}
          <button
            onClick={handleShare}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
            title="Sao chép liên kết"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          {/* Toggle Right Lesson Panel (shown in Stage 2 Visualizer) */}
          {algorithm && activeStage === 2 && (
            <button
              onClick={() => setIsLessonPanelOpen((prev) => !prev)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                isLessonPanelOpen
                  ? "bg-slate-100 dark:bg-slate-800 text-[#e06c53] border-slate-300 dark:border-slate-700"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
              title={isLessonPanelOpen ? "Đóng bảng giải thích" : "Mở bảng giải thích & mã giả"}
            >
              <span className="hidden sm:inline">Mã giả</span>
              {isLessonPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Studio 3-Panel Body */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-full relative">
        {/* ================= LEFT COLUMN: SYLLABUS SIDEBAR ================= */}
        <StudioSyllabusSidebar
          currentAlgorithmId={lesson.id}
          completedIds={completedIds}
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
        />

        {/* ================= CENTER COLUMN: 4-STAGE LEARNING WORKSPACE ================= */}
        <main className="flex-1 min-w-0 w-full p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto">
          {!isLessonUnlocked ? (
            <div className="max-w-xl mx-auto my-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-5 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Bài học đang bị khóa
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {lesson.code}. {lesson.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Theo lộ trình học tuần tự, bạn cần <strong>Pass</strong> bài học trước đó
                  {courseNav.prev ? (
                    <>
                      {" "}
                      (<span className="text-[#e06c53] font-semibold">{courseNav.prev.code}. {courseNav.prev.title}</span>)
                    </>
                  ) : null}{" "}
                  để mở khóa nội dung này.
                </p>
              </div>
              {frontierLesson && (
                <Link
                  href={`/learn/${frontierLesson.id}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#e06c53] hover:bg-[#d05c43] text-white font-bold text-sm shadow-lg shadow-[#e06c53]/25 transition-all"
                >
                  <span>Học bài tiếp theo cần Pass: {frontierLesson.code}. {frontierLesson.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Lesson Title & Big-O Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {chapter && (
                      <span className="px-2 py-0.5 rounded-full bg-[#e06c53]/10 text-[#e06c53] font-bold border border-[#e06c53]/25">
                        Chương {chapter.code}: {chapter.title}
                      </span>
                    )}
                    <span>•</span>
                    <span className="font-mono font-semibold text-slate-400">{lesson.code}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {lesson.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {lesson.subtitle}
                  </p>
                </div>

                {algorithm && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <ComplexityBadge label="Best" value={algorithm.complexity.best} />
                    <ComplexityBadge label="Average" value={algorithm.complexity.average} />
                    <ComplexityBadge label="Worst" value={algorithm.complexity.worst} />
                    <ComplexityBadge label="Space" value={algorithm.complexity.space} type="space" />
                  </div>
                )}
              </div>

              {/* 4-STAGE LEARNING STEPPER TABS */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pb-1">
                {[
                  {
                    stage: 1 as const,
                    label: "1. Lý thuyết",
                    icon: BookOpen,
                    done: stageProgress.theoryRead,
                  },
                  {
                    stage: 2 as const,
                    label: "2. Xem & Thử Demo",
                    icon: Eye,
                    done: stageProgress.demoCompleted,
                  },
                  {
                    stage: 3 as const,
                    label: "3. Thực hành Quiz",
                    icon: HelpCircle,
                    done: stageProgress.practicePassed,
                  },
                  ...(lesson.codeChallenge
                    ? [
                        {
                          stage: 4 as const,
                          label: "4. Code & Chấm bài",
                          icon: Code2,
                          done: stageProgress.codePassed,
                        },
                      ]
                    : []),
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeStage === tab.stage;
                  return (
                    <button
                      key={tab.stage}
                      onClick={() => setActiveStage(tab.stage)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-[#e06c53] text-white border-[#e06c53] shadow-md shadow-[#e06c53]/25"
                          : tab.done
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {tab.done && !isActive ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ================= STAGE 1: THEORY VIEW ================= */}
              {activeStage === 1 && chapter && (
                <StageTheoryView
                  lesson={lesson}
                  chapter={chapter}
                  isFirstInChapter={courseNav.indexInChapter === 1}
                  isLastInChapter={courseNav.indexInChapter === chapter.lessonIds.length}
                  isTheoryDone={stageProgress.theoryRead}
                  onMarkTheoryDoneAndContinue={() => {
                    handleUpdateStage({ theoryRead: true });
                    setActiveStage(2);
                  }}
                />
              )}

              {/* ================= STAGE 2: DEMO / INTERACTIVE SANDBOX ================= */}
              {activeStage === 2 && (
                <div className="space-y-6">
                  {algorithm ? (
                    <>
                      {/* Mode Selector Pill: Auto Visualizer vs Play-by-Hand Challenge */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                          <button
                            onClick={() => {
                              setIsChallengeMode(false);
                              setIsPlaying(false);
                            }}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                              !isChallengeMode
                                ? "bg-white dark:bg-slate-800 text-[#e06c53] shadow-sm border border-[#e06c53]/20"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <Eye className="w-4 h-4 text-[#e06c53]" />
                            <span>Mô phỏng tự động</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsChallengeMode(true);
                              setIsPlaying(false);
                              handleRestartChallenge();
                            }}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                              isChallengeMode
                                ? "bg-gradient-to-r from-[#e06c53] to-amber-500 text-white shadow-md shadow-[#e06c53]/25"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <Gamepad2 className="w-4 h-4 text-amber-200" />
                            <span>Tự giải bằng tay (Challenge)</span>
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            handleUpdateStage({ demoCompleted: true });
                            setActiveStage(3);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#e06c53] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Sang Chặng 3: Thực hành Quiz</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Interactive Canvas */}
                      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-950/80 p-2 sm:p-4 shadow-sm backdrop-blur-xs">
                        <VisualizerCanvas
                          currentStep={currentStep}
                          category={algorithm.category}
                          arraySize={arrayData.length}
                          onGridChange={algorithm.category === "pathfinding" ? handleGridChange : undefined}
                          isChallengeMode={isChallengeMode}
                          selectedIndices={challengeSelectedIndices}
                          onSelectIndex={handleChallengeSelectIndex}
                          onSelectNode={handleChallengeSelectNode}
                        />
                      </div>

                      {/* Control Panel vs Challenge HUD */}
                      {isChallengeMode ? (
                        <div className="space-y-4">
                          <ChallengeHintBanner
                            prompt={challengePrompt.prompt}
                            feedback={challengeFeedback}
                            activeHint={challengeActiveHint}
                          />
                          <ChallengeHUD
                            hearts={challengeHearts}
                            maxHearts={3}
                            score={challengeScore}
                            streak={challengeStreak}
                            elapsedSeconds={challengeElapsedSeconds}
                            selectedIndices={challengeSelectedIndices}
                            canSwap={algorithm.category === "sorting"}
                            onSwap={handleChallengeSwap}
                            onNoSwap={handleChallengeNoSwap}
                            onConfirmSelection={
                              algorithm.id === "binary-search" || algorithm.category === "graph"
                                ? handleChallengeConfirmSelection
                                : undefined
                            }
                            onUseHint={handleChallengeUseHint}
                            onGiveUp={handleChallengeGiveUp}
                            onRestart={handleRestartChallenge}
                            isCompleted={currentStepIndex >= steps.length - 1}
                            isGameOver={isChallengeGameOver}
                          />
                        </div>
                      ) : (
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
                      )}
                    </>
                  ) : (
                    <div className="space-y-5">
                      <ConceptSandboxWidget
                        widgetType={lesson.interactiveWidget || "intro-roadmap"}
                        onInteractComplete={() => handleUpdateStage({ demoCompleted: true })}
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            handleUpdateStage({ demoCompleted: true });
                            setActiveStage(3);
                          }}
                          className="px-6 py-3 rounded-2xl bg-[#e06c53] hover:bg-[#d05c43] text-white font-bold text-sm shadow-lg shadow-[#e06c53]/25 flex items-center gap-2 cursor-pointer"
                        >
                          <span>Đã thử tương tác → Sang Chặng 3: Thực hành Quiz</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= STAGE 3: PRACTICE QUIZ VIEW ================= */}
              {activeStage === 3 && (
                <StagePracticeView
                  lesson={lesson}
                  isPracticePassed={stageProgress.practicePassed}
                  hasNextCodeStage={Boolean(lesson.codeChallenge)}
                  onPracticePassed={() => {
                    handleUpdateStage({ theoryRead: true, demoCompleted: true, practicePassed: true });
                  }}
                  onContinueNextStage={() => setActiveStage(4)}
                />
              )}

              {/* ================= STAGE 4: CODE & JUDGE VIEW ================= */}
              {activeStage === 4 && lesson.codeChallenge && (
                <StageCodeJudgeView
                  lesson={lesson}
                  isCodePassed={stageProgress.codePassed}
                  isLessonPassed={isCompletedInRoadmap}
                  nextLesson={
                    courseNav.next
                      ? { id: courseNav.next.id, code: courseNav.next.code, title: courseNav.next.title }
                      : null
                  }
                  onCodeAllPassed={() => {
                    handleUpdateStage({ codePassed: true });
                  }}
                />
              )}

              {/* Bottom Lesson Navigation Bar */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {courseNav.prev ? (
                  <Link
                    href={`/learn/${courseNav.prev.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#e06c53] hover:text-[#e06c53] transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <div className="text-left min-w-0">
                      <div className="text-[10px] text-slate-400">Bài trước ({courseNav.prev.code})</div>
                      <div className="font-bold truncate">{courseNav.prev.title}</div>
                    </div>
                  </Link>
                ) : <div className="hidden sm:block" />}

                {courseNav.next ? (
                  isCompletedInRoadmap ? (
                    <Link
                      href={`/learn/${courseNav.next.id}`}
                      className="flex items-center justify-between sm:justify-end gap-2 px-4 py-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all sm:ml-auto"
                    >
                      <div className="text-left sm:text-right min-w-0">
                        <div className="text-[10px] text-emerald-500/80">Đã mở khóa • Bài tiếp theo ({courseNav.next.code})</div>
                        <div className="font-bold truncate">{courseNav.next.title}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>
                  ) : (
                    <div
                      title="Hoàn thành đủ các chặng (Lý thuyết, Quiz & Code) để mở khóa bài tiếp theo"
                      className="flex items-center justify-between sm:justify-end gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/50 text-xs font-semibold text-slate-400 dark:text-slate-500 cursor-not-allowed sm:ml-auto opacity-75"
                    >
                      <div className="text-left sm:text-right min-w-0">
                        <div className="text-[10px] text-slate-400">Pass đủ các chặng để mở khóa</div>
                        <div className="font-bold truncate">{courseNav.next.code}. {courseNav.next.title}</div>
                      </div>
                      <Lock className="w-4 h-4 shrink-0" />
                    </div>
                  )
                ) : <div />}
              </div>
            </>
          )}
        </main>

        {/* ================= RIGHT COLUMN: STEP LESSON & PSEUDOCODE (Only Stage 2 Demo) ================= */}
        {isLessonUnlocked && algorithm && activeStage === 2 && (
          <StudioLessonPanel
            algorithm={algorithm}
            steps={steps}
            currentStepIndex={currentStepIndex}
            onStepChange={setCurrentStepIndex}
            isOpen={isLessonPanelOpen}
            onToggle={() => setIsLessonPanelOpen(!isLessonPanelOpen)}
            isSidebarCollapsed={!isSidebarOpen}
            isCompleted={isCompletedInRoadmap}
            nextLesson={
              courseNav.next
                ? { id: courseNav.next.id, name: `${courseNav.next.code}. ${courseNav.next.title}` }
                : null
            }
          />
        )}
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

      {/* Export Snapshot & Video Modal */}
      {algorithm && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          algorithm={algorithm}
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          onPlayFromStart={() => {
            setCurrentStepIndex(0);
            setIsPlaying(true);
          }}
        />
      )}

      {/* Challenge Mode Victory / Game Over Modal */}
      {algorithm && (
        <ChallengeVictoryModal
          isOpen={isChallengeVictoryModalOpen}
          isGameOver={isChallengeGameOver}
          algorithm={algorithm}
          stats={{
            score: challengeScore,
            hearts: challengeHearts,
            maxHearts: 3,
            streak: challengeStreak,
            maxStreak: challengeMaxStreak,
            hintsUsed: challengeHintsUsed,
            mistakes: challengeMistakes,
            totalActions: challengeTotalActions,
            elapsedSeconds: challengeElapsedSeconds,
            rank: calculateChallengeRank(challengeMistakes, challengeHintsUsed, challengeTotalActions),
          }}
          onRestart={handleRestartChallenge}
          onSwitchToVisualizer={() => {
            setIsChallengeVictoryModalOpen(false);
            setIsChallengeMode(false);
          }}
        />
      )}
    </div>
  );
}
