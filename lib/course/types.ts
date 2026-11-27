export interface TheorySection {
  /** 1. Bài toán & Ứng dụng thực tế */
  problemAndApplications: string;
  realWorldApps: string[];
  /** 2. Ý tưởng cốt lõi & Trực giác */
  coreIntuition: string;
  /** 3. Cơ chế từng bước & Tính đúng đắn (Loop Invariant) */
  mechanismSteps: string[];
  loopInvariant: string;
  /** 4. Phân tích Độ phức tạp */
  complexityDeepDive: {
    timeExplanation: string;
    spaceExplanation: string;
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  /** 5. Trường hợp biên & Bẫy phỏng vấn */
  edgeCasesAndPitfalls: string[];
  /** 6. So sánh & Lựa chọn */
  tradeOffs: string[];
  /** Nguồn tham khảo học thuật */
  references: string[];
}

export interface ConceptQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeTestCase {
  name: string;
  inputArgs: any[];
  expected: any;
  isEdgeCase?: boolean;
}

export interface CodeChallengeSpec {
  title: string;
  prompt: string;
  functionName: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases: CodeTestCase[];
}

export type LessonKind = "concept" | "algorithm" | "capstone";

export interface CourseLesson {
  /** Route & ID slug (for algorithm lessons, matches algorithm.id; for concept lessons, e.g. 'course-intro') */
  id: string;
  code: string; // e.g. "00.1", "01.1", "10.1"
  chapterId: string;
  kind: LessonKind;
  title: string;
  subtitle: string;
  algorithmId?: string;
  interactiveWidget?: "intro-roadmap" | "ram-adt" | "big-o-growth" | "recursion-stack" | "capstone-guide";
  theory: TheorySection;
  quizQuestions: ConceptQuestion[];
  codeChallenge?: CodeChallengeSpec;
}

export interface CourseChapterMeta {
  id: string;
  number: number;
  code: string;
  title: string;
  englishTitle: string;
  chapterIntro: {
    goal: string;
    whyLearn: string;
    keyTakeaways: string[];
  };
  chapterSummary: {
    recap: string;
    comparisonNotes: string[];
  };
  lessonIds: string[];
}

export interface LessonStageProgress {
  theoryRead: boolean;
  demoCompleted: boolean;
  practicePassed: boolean;
  codePassed: boolean;
  isPassed: boolean;
}
