import { ALGORITHMS, getAlgorithmById } from "./algorithms";
import { Algorithm } from "./types";

export interface CurriculumChapter {
  id: string;
  number: number;
  code: string; // e.g. "01", "02", ...
  title: string;
  englishTitle: string;
  description: string;
  icon: string;
  algorithmIds: string[];
}

export const CURRICULUM_CHAPTERS: CurriculumChapter[] = [
  {
    id: "chapter-01-foundations",
    number: 1,
    code: "01",
    title: "Nền tảng & Tìm kiếm",
    englishTitle: "Foundations & Searching",
    description: "Nhập môn phân tích độ phức tạp Big-O và các phương pháp tìm kiếm tuyến tính, nhị phân căn bản.",
    icon: "Compass",
    algorithmIds: ["linear-search", "binary-search"],
  },
  {
    id: "chapter-02-arrays",
    number: 2,
    code: "02",
    title: "Mảng & Hai con trỏ",
    englishTitle: "Arrays & Two Pointers",
    description: "Các kỹ thuật thao tác mảng tốc độ cao: Hai con trỏ, Cửa sổ trượt (Sliding Window) và Mảng con lớn nhất (Kadane).",
    icon: "Layers",
    algorithmIds: ["two-sum", "sliding-window", "kadane"],
  },
  {
    id: "chapter-03-linked-lists",
    number: 3,
    code: "03",
    title: "Danh sách liên kết",
    englishTitle: "Linked Lists",
    description: "Làm chủ con trỏ bộ nhớ: Đảo ngược danh sách liên kết và thuật toán Rùa & Thỏ phát hiện chu trình (Floyd's Cycle).",
    icon: "Link2",
    algorithmIds: ["reverse-linked-list", "floyd-cycle"],
  },
  {
    id: "chapter-04-stack-queue",
    number: 4,
    code: "04",
    title: "Ngăn xếp & Hàng đợi",
    englishTitle: "Stack & Queue",
    description: "Cấu trúc LIFO và FIFO kinh điển trong phân tích cú pháp dấu ngoặc và xử lý luồng sự kiện.",
    icon: "Layers",
    algorithmIds: ["valid-parentheses"],
  },
  {
    id: "chapter-05-hashing",
    number: 5,
    code: "05",
    title: "Bảng băm (Hash Table)",
    englishTitle: "Hashing & Tables",
    description: "Nguyên lý hàm băm $O(1)$, xử lý xung đột bằng Chaining và Open Addressing.",
    icon: "Database",
    algorithmIds: ["hash-table"],
  },
  {
    id: "chapter-06-trees",
    number: 6,
    code: "06",
    title: "Cây nhị phân & Cây cân bằng",
    englishTitle: "Trees & Balanced BST",
    description: "Khám phá Cây tìm kiếm nhị phân (BST), Cây tự cân bằng (AVL Tree) với 4 phép xoay và Cây phân đoạn (Segment Tree).",
    icon: "GitFork",
    algorithmIds: ["bst", "avl-tree", "segment-tree"],
  },
  {
    id: "chapter-07-heaps",
    number: 7,
    code: "07",
    title: "Đống & Hàng đợi ưu tiên",
    englishTitle: "Heap & Priority Queue",
    description: "Cấu trúc Max Heap, Min Heap, thao tác Heapify và thuật toán Sắp xếp vun đống (Heap Sort).",
    icon: "BarChart2",
    algorithmIds: ["min-heap", "heap-sort"],
  },
  {
    id: "chapter-08-graphs",
    number: 8,
    code: "08",
    title: "Đồ thị & Đường đi ngắn nhất",
    englishTitle: "Graphs & Shortest Path",
    description: "Duyệt BFS, DFS, tìm đường ngắn nhất Dijkstra, tìm đường heuristic A*, cây khung Kruskal DSU và sắp xếp Topo.",
    icon: "Network",
    algorithmIds: [
      "bfs",
      "dfs",
      "dijkstra",
      "a-star",
      "kruskal-dsu",
      "topological-sort",
    ],
  },
  {
    id: "chapter-09-sorting",
    number: 9,
    code: "09",
    title: "Sắp xếp & Chia để trị",
    englishTitle: "Sorting & Divide-and-Conquer",
    description: "Bộ sưu tập sắp xếp kinh điển: Bubble, Selection, Insertion, Merge Sort và Quick Sort tối ưu.",
    icon: "ArrowDownUp",
    algorithmIds: [
      "bubble-sort",
      "selection-sort",
      "insertion-sort",
      "merge-sort",
      "quick-sort",
    ],
  },
  {
    id: "chapter-10-greedy",
    number: 10,
    code: "10",
    title: "Thuật toán Tham lam",
    englishTitle: "Greedy Strategy",
    description: "Chiến lược tối ưu hóa cục bộ trong chọn lịch hoạt động không xung đột và bài toán cái túi phân số.",
    icon: "Zap",
    algorithmIds: ["greedy-interval-scheduling"],
  },
  {
    id: "chapter-11-backtracking",
    number: 11,
    code: "11",
    title: "Quay lui (Backtracking)",
    englishTitle: "Backtracking & Exhaustive",
    description: "Duyệt không gian trạng thái, tỉa nhánh và bài toán xếp 8 quân Hậu (N-Queens).",
    icon: "Crown",
    algorithmIds: ["n-queens"],
  },
  {
    id: "chapter-12-dp-strings",
    number: 12,
    code: "12",
    title: "Quy hoạch động & Chuỗi",
    englishTitle: "Dynamic Programming & Trie",
    description: "Đỉnh cao thuật toán Big Tech: Cái túi 0/1, Dãy con chung dài nhất (LCS), Khớp chuỗi KMP và Cây tiền tố Trie.",
    icon: "Sparkles",
    algorithmIds: ["knapsack-01", "lcs", "kmp", "trie"],
  },
];

/**
 * Total active algorithms registered across curriculum
 */
export const TOTAL_CURRICULUM_ALGORITHMS = CURRICULUM_CHAPTERS.reduce(
  (sum, chap) => sum + chap.algorithmIds.length,
  0
);

/**
 * Find which chapter an algorithm belongs to
 */
export function getChapterByAlgorithmId(algorithmId: string): CurriculumChapter | undefined {
  return CURRICULUM_CHAPTERS.find((ch) => ch.algorithmIds.includes(algorithmId));
}

/**
 * Get progress data for a specific chapter
 */
export function getChapterProgress(chapter: CurriculumChapter, completedIds: string[]) {
  const total = chapter.algorithmIds.length;
  if (total === 0) return { completed: 0, total: 0, percentage: 0 };
  const completed = chapter.algorithmIds.filter((id) => completedIds.includes(id)).length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

/**
 * Get the previous and next algorithm in the sequential curriculum order
 */
export function getNavigationContext(currentAlgorithmId: string) {
  // Flatten all active algorithms in chapter order
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
