import { ALGORITHMS } from "./algorithms";
import { Algorithm } from "./types";

export interface RoadmapBadge {
  id: string;
  tierNumber: number;
  title: string;
  englishTitle: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface RoadmapTier {
  id: string;
  tierNumber: number;
  title: string;
  englishTitle: string;
  description: string;
  badge: RoadmapBadge;
  algorithmIds: string[];
}

export const ROADMAP_TIERS: RoadmapTier[] = [
  {
    id: "tier-1-foundation",
    tierNumber: 1,
    title: "Chặng 1: Khởi Động & Kỹ Thuật Mảng",
    englishTitle: "Foundation & Two Pointers",
    description: "Làm quen với cấu trúc mảng, các phép tìm kiếm căn bản và kỹ thuật hai con trỏ tối ưu hoá độ phức tạp tuyến tính.",
    badge: {
      id: "array-apprentice",
      tierNumber: 1,
      title: "Tân Thủ Mảng & Con Trỏ",
      englishTitle: "Array Apprentice",
      description: "Đã hoàn thành toàn bộ 5 thuật toán nền tảng về Mảng & Tìm kiếm",
      icon: "Layers",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10 text-emerald-500",
      borderColor: "border-emerald-500/30",
    },
    algorithmIds: [
      "linear-search",
      "binary-search",
      "two-sum",
      "sliding-window",
      "kadane",
    ],
  },
  {
    id: "tier-2-linear-sorting",
    tierNumber: 2,
    title: "Chặng 2: Tuyến Tính & Sắp Xếp Kinh Điển",
    englishTitle: "Linear Structures & Sorting",
    description: "Nắm vững danh sách liên kết, ngăn xếp (Stack) và toàn bộ các giải thuật sắp xếp kinh điển từ sơ cấp đến Chia để trị.",
    badge: {
      id: "sorting-specialist",
      tierNumber: 2,
      title: "Bậc Thầy Tuyến Tính & Sắp Xếp",
      englishTitle: "Sorting Specialist",
      description: "Chinh phục toàn bộ 13 thuật toán Danh sách liên kết, Ngăn xếp, Bảng băm & Sắp xếp",
      icon: "ArrowDownUp",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10 text-amber-500",
      borderColor: "border-amber-500/30",
    },
    algorithmIds: [
      "linear-ops",
      "reverse-linked-list",
      "floyd-cycle",
      "valid-parentheses",
      "hash-table",
      "hash-open-addressing",
      "bubble-sort",
      "selection-sort",
      "insertion-sort",
      "merge-sort",
      "quick-sort",
      "counting-sort",
      "heap-sort",
    ],
  },
  {
    id: "tier-3-trees-graphs",
    tierNumber: 3,
    title: "Chặng 3: Không Gian Cây & Đồ Thị Đa Chiều",
    englishTitle: "Trees & Graph Exploration",
    description: "Thao tác trên cấu trúc dữ liệu phi tuyến (Cây, BST, AVL, Min Heap, Segment Tree) và giải quyết các bài toán duyệt, tìm đường ngắn nhất, cây khung nhỏ nhất.",
    badge: {
      id: "graph-architect",
      tierNumber: 3,
      title: "Kiến Trúc Sư Đồ Thị",
      englishTitle: "Graph Architect",
      description: "Làm chủ cả 12 thuật toán Cây nhị phân, Min Heap & Đồ thị nâng cao",
      icon: "Network",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10 text-blue-500",
      borderColor: "border-blue-500/30",
    },
    algorithmIds: [
      "tree-traversals",
      "bst",
      "avl-tree",
      "min-heap",
      "segment-tree",
      "bfs",
      "dfs",
      "dijkstra",
      "bellman-ford",
      "kruskal-dsu",
      "topological-sort",
      "a-star",
    ],
  },
  {
    id: "tier-4-dp-advanced",
    tierNumber: 4,
    title: "Chặng 4: Đỉnh Cao Tham Lam, Tối Ưu Hóa & Chuỗi",
    englishTitle: "Greedy, Dynamic Programming & Trie",
    description: "Chinh phục những bài toán tham lam, tối ưu hoá quy hoạch động và so khớp mẫu nâng cao thường gặp nhất trong các vòng phỏng vấn kỹ thuật Big Tech.",
    badge: {
      id: "algorithm-grandmaster",
      tierNumber: 4,
      title: "Đại Hiệp Giải Thuật Big Tech",
      englishTitle: "Algorithm Grandmaster",
      description: "Vượt qua toàn bộ 7 thuật toán đỉnh cao Tham lam, Quy hoạch động, Quay lui & Trie",
      icon: "Crown",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10 text-purple-500",
      borderColor: "border-purple-500/30",
    },
    algorithmIds: [
      "greedy-interval-scheduling",
      "n-queens",
      "dp-1d",
      "knapsack-01",
      "lcs",
      "kmp",
      "trie",
    ],
  },
];

export const TOTAL_ROADMAP_ALGORITHMS = ROADMAP_TIERS.reduce(
  (acc, tier) => acc + tier.algorithmIds.length,
  0
);

export const STORAGE_KEY_COMPLETED = "dsa_completed_algorithms";
export const EVENT_PROGRESS_UPDATED = "dsa-progress-updated";

/**
 * Retrieve the list of completed algorithm IDs safely from localStorage
 */
export function getStoredCompletedAlgorithms(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to load completed algorithms:", err);
    return [];
  }
}

/**
 * Save completed algorithms to localStorage and emit change event
 */
function saveCompletedAlgorithms(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(EVENT_PROGRESS_UPDATED, { detail: ids }));
  } catch (err) {
    console.warn("Failed to save completed algorithms:", err);
  }
}

/**
 * Check if a specific algorithm is marked completed
 */
export function isAlgorithmCompleted(id: string): boolean {
  const completed = getStoredCompletedAlgorithms();
  return completed.includes(id);
}

/**
 * Mark an algorithm as completed
 */
export function markAlgorithmCompleted(id: string): string[] {
  const current = getStoredCompletedAlgorithms();
  if (!current.includes(id)) {
    const next = [...current, id];
    saveCompletedAlgorithms(next);
    return next;
  }
  return current;
}

/**
 * Unmark an algorithm
 */
export function unmarkAlgorithmCompleted(id: string): string[] {
  const current = getStoredCompletedAlgorithms();
  const next = current.filter((item) => item !== id);
  saveCompletedAlgorithms(next);
  return next;
}

/**
 * Toggle algorithm completion state
 */
export function toggleAlgorithmCompleted(id: string): { completed: boolean; allCompleted: string[] } {
  const current = getStoredCompletedAlgorithms();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  saveCompletedAlgorithms(next);
  return { completed: !exists, allCompleted: next };
}

/**
 * Reset all learning progress
 */
export function resetRoadmapProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_COMPLETED);
    window.dispatchEvent(new CustomEvent(EVENT_PROGRESS_UPDATED, { detail: [] }));
  } catch (err) {
    console.warn("Failed to reset progress:", err);
  }
}

/**
 * Calculate progress for a specific tier
 */
export function calculateTierProgress(tierNumber: number, completedIds: string[]) {
  const tier = ROADMAP_TIERS.find((t) => t.tierNumber === tierNumber);
  if (!tier) return { completedCount: 0, totalCount: 0, percentage: 0, isUnlocked: false };

  const totalCount = tier.algorithmIds.length;
  const completedCount = tier.algorithmIds.filter((id) => completedIds.includes(id)).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isUnlocked = percentage === 100;

  return { completedCount, totalCount, percentage, isUnlocked };
}

/**
 * Calculate overall learning progress across all 28 algorithms
 */
export function calculateOverallProgress(completedIds: string[]) {
  const totalCount = TOTAL_ROADMAP_ALGORITHMS;
  const validCompleted = completedIds.filter((id) =>
    ROADMAP_TIERS.some((t) => t.algorithmIds.includes(id))
  );
  const completedCount = validCompleted.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  // Each completed algorithm grants 100 XP + bonus 250 XP per tier fully mastered
  let xp = completedCount * 100;
  ROADMAP_TIERS.forEach((tier) => {
    const isMastered = tier.algorithmIds.every((id) => completedIds.includes(id));
    if (isMastered) xp += 250;
  });

  return { completedCount, totalCount, percentage, xp };
}

/**
 * Get list of unlocked badges based on completed IDs
 */
export function getUnlockedBadges(completedIds: string[]): RoadmapBadge[] {
  return ROADMAP_TIERS.filter((tier) =>
    tier.algorithmIds.every((id) => completedIds.includes(id))
  ).map((tier) => tier.badge);
}

/**
 * Get algorithm details enriched with tier info
 */
export function getAlgorithmsForTier(tier: RoadmapTier): Algorithm[] {
  return tier.algorithmIds
    .map((id) => ALGORITHMS.find((a) => a.id === id))
    .filter((a): a is Algorithm => a !== undefined);
}
