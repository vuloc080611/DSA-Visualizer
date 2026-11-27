import {
  COURSE_CHAPTERS,
  ALL_COURSE_LESSONS,
  getLessonById,
  getChapterForLesson,
  getOrderedCourseLessons,
  isCourseLessonUnlocked,
  getCourseFrontierLesson,
  getCourseNavigationContext,
} from "./course";
import { getAlgorithmById } from "./algorithms";
import { Algorithm } from "./types";

export interface CurriculumChapter {
  id: string;
  number: number;
  code: string;
  title: string;
  englishTitle: string;
  description: string;
  icon: string;
  algorithmIds: string[];
  lessonIds: string[];
}

const CHAPTER_ICONS: Record<number, string> = {
  0: "Compass",
  1: "Search",
  2: "Link2",
  3: "ArrowDownUp",
  4: "Database",
  5: "GitFork",
  6: "BarChart2",
  7: "Network",
  8: "Zap",
  9: "Sparkles",
  10: "Award",
};

export const CURRICULUM_CHAPTERS: CurriculumChapter[] = COURSE_CHAPTERS.map((ch) => ({
  id: ch.id,
  number: ch.number,
  code: ch.code,
  title: ch.title,
  englishTitle: ch.englishTitle,
  description: ch.chapterIntro.goal,
  icon: CHAPTER_ICONS[ch.number] || "BookOpen",
  lessonIds: ch.lessonIds,
  algorithmIds: ch.lessonIds.filter((id) => getAlgorithmById(id) !== undefined),
}));

export const TOTAL_CURRICULUM_ALGORITHMS = ALL_COURSE_LESSONS.length;

export function getChapterByAlgorithmId(algorithmId: string): CurriculumChapter | undefined {
  return CURRICULUM_CHAPTERS.find((ch) => ch.lessonIds.includes(algorithmId));
}

export function getChapterProgress(chapter: CurriculumChapter, completedIds: string[]) {
  const total = chapter.lessonIds.length;
  if (total === 0) return { completed: 0, total: 0, percentage: 0 };
  const completed = chapter.lessonIds.filter((id) => completedIds.includes(id)).length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

export function getFlattenedCurriculum(): {
  alg: Algorithm;
  chapter: CurriculumChapter;
  indexInChapter: number;
}[] {
  const flattened: { alg: Algorithm; chapter: CurriculumChapter; indexInChapter: number }[] = [];

  for (const chapter of CURRICULUM_CHAPTERS) {
    chapter.algorithmIds.forEach((id, idx) => {
      const alg = getAlgorithmById(id);
      if (alg) {
        flattened.push({
          alg,
          chapter,
          indexInChapter: idx + 1,
        });
      }
    });
  }

  return flattened;
}

export function isAlgorithmUnlocked(algorithmId: string, completedIds: string[]): boolean {
  return isCourseLessonUnlocked(algorithmId, completedIds);
}

export function getCurrentFrontierLesson(completedIds: string[]) {
  const frontier = getCourseFrontierLesson(completedIds);
  const chapter = getChapterByAlgorithmId(frontier.id);
  const alg = frontier.algorithmId ? getAlgorithmById(frontier.algorithmId) : undefined;
  return alg && chapter ? { alg, chapter, indexInChapter: 1 } : null;
}

export function getNavigationContext(currentAlgorithmId: string) {
  const flattened = getFlattenedCurriculum();
  const currentIndex = flattened.findIndex((item) => item.alg.id === currentAlgorithmId);
  const currentItem = currentIndex !== -1 ? flattened[currentIndex] : null;

  const prev = currentIndex > 0 ? flattened[currentIndex - 1] : null;
  const next = currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null;

  return {
    currentItem,
    prev,
    next,
    totalAlgorithms: flattened.length,
    currentIndex: currentIndex + 1,
  };
}

export {
  COURSE_CHAPTERS,
  ALL_COURSE_LESSONS,
  getLessonById,
  getChapterForLesson,
  getOrderedCourseLessons,
  isCourseLessonUnlocked,
  getCourseFrontierLesson,
  getCourseNavigationContext,
};
