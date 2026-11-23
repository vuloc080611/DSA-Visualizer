import { Step, Algorithm } from "./types";

export interface ChallengeStats {
  score: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  maxStreak: number;
  hintsUsed: number;
  mistakes: number;
  totalActions: number;
  elapsedSeconds: number;
  rank: "S" | "A" | "B" | "C" | null;
}

export interface ChallengeFeedback {
  type: "success" | "error" | "info";
  message: string;
  hint?: string;
}

/**
 * Calculates final rank based on mistakes, hints, and accuracy
 */
export function calculateChallengeRank(mistakes: number, hintsUsed: number, totalActions: number): "S" | "A" | "B" | "C" {
  if (totalActions === 0) return "C";
  const accuracy = Math.max(0, (totalActions - mistakes) / totalActions);

  if (mistakes === 0 && hintsUsed === 0 && accuracy >= 0.95) return "S";
  if (mistakes <= 1 && hintsUsed <= 1 && accuracy >= 0.8) return "A";
  if (mistakes <= 2 && accuracy >= 0.6) return "B";
  return "C";
}

/**
 * Generates an intuitive task prompt for the current step in the algorithm
 */
export function getChallengePrompt(
  algorithm: Algorithm,
  currentStep: Step,
  nextStep?: Step
): { prompt: string; actionType: "compare-or-swap" | "pick-mid" | "pick-node" | "generic" } {
  if (!nextStep) {
    return {
      prompt: "Chúc mừng! Bạn đã hoàn thành toàn bộ giải thuật!",
      actionType: "generic",
    };
  }

  // Sorting
  if (algorithm.category === "sorting") {
    if (nextStep.swapping && nextStep.swapping.length >= 2) {
      return {
        prompt: `Chọn cặp phần tử đang sai thứ tự và nhấn 'Hoán đổi' để tráo đổi chúng!`,
        actionType: "compare-or-swap",
      };
    }
    if (nextStep.highlights && nextStep.highlights.length >= 2) {
      return {
        prompt: `Chọn 2 phần tử liền kề tiếp theo để so sánh!`,
        actionType: "compare-or-swap",
      };
    }
    if (nextStep.sorted && nextStep.sorted.length > 0) {
      return {
        prompt: `Phần tử nào đã về đúng vị trí cuối cùng của lượt này?`,
        actionType: "compare-or-swap",
      };
    }
    return {
      prompt: "Click chọn 2 phần tử tiếp theo để xử lý!",
      actionType: "compare-or-swap",
    };
  }

  // Searching (Binary Search)
  if (algorithm.id === "binary-search") {
    if (nextStep.pivot !== undefined) {
      return {
        prompt: `Khoảng tìm kiếm hiện tại là [L=${currentStep.window?.[0] ?? 0}, R=${
          currentStep.window?.[1] ?? (currentStep.array?.length ?? 1) - 1
        }]. Click chọn phần tử 'mid' ở chính giữa!`,
        actionType: "pick-mid",
      };
    }
    return {
      prompt: `So sánh giá trị tại 'mid' với Target = ${currentStep.target}. Thuật toán sẽ tiếp tục tìm ở đâu?`,
      actionType: "generic",
    };
  }

  // Graph (BFS / DFS)
  if (algorithm.category === "graph") {
    if (nextStep.currentNode) {
      return {
        prompt: `Theo thứ tự duyệt của ${algorithm.name}, click chọn đỉnh tiếp theo sẽ được duyệt!`,
        actionType: "pick-node",
      };
    }
    return {
      prompt: "Click chọn đỉnh tiếp theo để thăm!",
      actionType: "pick-node",
    };
  }

  return {
    prompt: `Quan sát trạng thái và chọn phần tử phù hợp với bước tiếp theo của ${algorithm.name}!`,
    actionType: "generic",
  };
}

/**
 * Generates an informative hint for the user when requested
 */
export function getChallengeHint(algorithm: Algorithm, currentStep: Step, nextStep?: Step): string {
  if (!nextStep) return "Thuật toán đã ở bước cuối cùng!";

  if (algorithm.category === "sorting") {
    if (nextStep.swapping && nextStep.swapping.length >= 2) {
      const [i, j] = nextStep.swapping;
      const v1 = currentStep.array?.[i];
      const v2 = currentStep.array?.[j];
      return `Gợi ý: Cặp ở vị trí [${i}] (${v1}) và [${j}] (${v2}) đang sai thứ tự cần hoán đổi!`;
    }
    if (nextStep.highlights && nextStep.highlights.length >= 2) {
      const [i, j] = nextStep.highlights;
      return `Gợi ý: Hãy quan sát 2 phần tử ở chỉ số [${i}] và [${j}]!`;
    }
  }

  if (algorithm.id === "binary-search" && nextStep.pivot !== undefined) {
    const w = currentStep.window || [0, (currentStep.array?.length || 1) - 1];
    const mid = Math.floor((w[0] + w[1]) / 2);
    return `Gợi ý: Công thức tính mid = floor((${w[0]} + ${w[1]}) / 2) = ${mid}!`;
  }

  if (algorithm.category === "graph" && nextStep.currentNode) {
    return `Gợi ý: Đỉnh tiếp theo được lấy ra là đỉnh '${nextStep.currentNode}'!`;
  }

  return `Gợi ý: Đọc kỹ phần 'Nguyên lý hoạt động' của ${algorithm.name} để biết bước tiếp theo!`;
}
