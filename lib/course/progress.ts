import { LessonStageProgress } from "./types";
import { markAlgorithmCompleted } from "@/lib/roadmap";

const STORAGE_KEY_STAGES = "dsa_lesson_stages_v1";
export const EVENT_STAGES_UPDATED = "dsa-lesson-stages-updated";

export const DEFAULT_STAGE_PROGRESS: LessonStageProgress = {
  theoryRead: false,
  demoCompleted: false,
  practicePassed: false,
  codePassed: false,
  isPassed: false,
};

export function getAllLessonStages(): Record<string, LessonStageProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_STAGES);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getLessonStages(lessonId: string): LessonStageProgress {
  const all = getAllLessonStages();
  return all[lessonId] || { ...DEFAULT_STAGE_PROGRESS };
}

export function updateLessonStage(
  lessonId: string,
  patch: Partial<LessonStageProgress>,
  requiresCode: boolean
): LessonStageProgress {
  const all = getAllLessonStages();
  const prev = all[lessonId] || { ...DEFAULT_STAGE_PROGRESS };
  const next: LessonStageProgress = {
    ...prev,
    ...patch,
  };

  // Strict Pass rule:
  // - Algorithm / coding lessons require theoryRead, practicePassed, AND codePassed.
  // - Pure conceptual lessons require theoryRead, demoCompleted, AND practicePassed.
  const canPass = requiresCode
    ? next.theoryRead && next.practicePassed && next.codePassed
    : next.theoryRead && next.demoCompleted && next.practicePassed;

  if (canPass) {
    next.isPassed = true;
  }

  all[lessonId] = next;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY_STAGES, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent(EVENT_STAGES_UPDATED, { detail: { lessonId, progress: next } }));
    } catch {
      // ignore storage quota errors
    }
  }

  if (next.isPassed) {
    markAlgorithmCompleted(lessonId);
  }

  return next;
}
