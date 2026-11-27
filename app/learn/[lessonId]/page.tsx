import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_COURSE_LESSONS, getLessonById } from "@/lib/course";
import { VisualizerClient } from "@/app/visualizer/[algorithm]/VisualizerClient";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export async function generateStaticParams() {
  return ALL_COURSE_LESSONS.map((lesson) => ({
    lessonId: lesson.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return {
      title: "Bài học không tồn tại - DSA Visualizer",
    };
  }

  return {
    title: `${lesson.code}. ${lesson.title} | Khóa học DSA`,
    description: lesson.subtitle,
  };
}

export default async function LearnLessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  return <VisualizerClient lessonId={lessonId} initialStage={1} />;
}
