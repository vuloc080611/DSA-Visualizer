import { Algorithm, Step } from "./types";

export interface QuizOption {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface QuizQuestion {
  id: string;
  stepIndex: number;
  question: string;
  options: QuizOption[];
  correctOptionId: "A" | "B" | "C" | "D";
  explanation: string;
  category: string;
  points: number;
}

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate quiz questions dynamically from the executed steps of any algorithm
export function generateQuizQuestions(steps: Step[], algorithm: Algorithm): QuizQuestion[] {
  if (!steps || steps.length < 3) return [];

  const questions: QuizQuestion[] = [];
  const totalSteps = steps.length;

  // 1. Check for Tree-specific questions (AVL rotation, BST insertion)
  if (algorithm.category === "tree") {
    // Look for rotation steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.rotationType && step.unbalancedNodeValue !== undefined) {
        const rotNameMap: Record<string, string> = {
          LL: "Xoay đơn phải (Right Rotation - LL)",
          RR: "Xoay đơn trái (Left Rotation - RR)",
          LR: "Xoay kép trái-phải (Left-Right Rotation - LR)",
          RL: "Xoay kép phải-trái (Right-Left Rotation - RL)",
        };
        const correctText = rotNameMap[step.rotationType] || `Xoay ${step.rotationType}`;
        const allTypes = ["LL", "RR", "LR", "RL"].filter((t) => t !== step.rotationType);
        const distractors = allTypes.map((t) => rotNameMap[t]);

        const rawOptions = [
          { text: correctText, isCorrect: true },
          { text: distractors[0], isCorrect: false },
          { text: distractors[1], isCorrect: false },
          { text: distractors[2], isCorrect: false },
        ];
        const shuffled = shuffleArray(rawOptions);
        const optIds: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
        const correctOpt = optIds[shuffled.findIndex((o) => o.isCorrect)]!;

        questions.push({
          id: `tree-rot-${i}`,
          stepIndex: Math.max(0, i - 1),
          question: `Node giá trị ${step.unbalancedNodeValue} đang bị mất cân bằng (Balance Factor nằm ngoài {-1, 0, 1}). Phép xoay nào sau đây cần được thực hiện?`,
          options: shuffled.map((o, idx) => ({ id: optIds[idx], text: o.text })),
          correctOptionId: correctOpt,
          explanation: `Chính xác! Khi cây bị lệch kiểu ${step.rotationType}, thuật toán AVL áp dụng phép ${correctText} để phục hồi tính cân bằng O(log N).`,
          category: "tree",
          points: 150,
        });
        break; // 1 rotation question is plenty
      }
    }

    // Look for active node comparison in BST
    for (let i = 1; i < steps.length; i++) {
      const step = steps[i];
      if (step.treeAction === "insert" && step.activeNodeValue !== undefined) {
        questions.push({
          id: `tree-insert-${i}`,
          stepIndex: i,
          question: `Theo tính chất Cây Nhị Phân Tìm Kiếm (BST), một giá trị mới X nhỏ hơn giá trị của Node hiện tại sẽ được chèn vào đâu?`,
          options: [
            { id: "A", text: "Nhánh con bên Trái (Left Subtree)" },
            { id: "B", text: "Nhánh con bên Phải (Right Subtree)" },
            { id: "C", text: "Thay thế luôn Node hiện tại" },
            { id: "D", text: "Đưa lên làm Node Gốc mới (Root)" },
          ],
          correctOptionId: "A",
          explanation: `Chính xác! Trong BST, tất cả các node ở cây con bên trái luôn có giá trị nhỏ hơn node gốc, và cây con bên phải có giá trị lớn hơn.`,
          category: "tree",
          points: 100,
        });
        break;
      }
    }
  }

  // 2. Check for Sorting algorithms (Swapping, Pivot, In-place)
  if (algorithm.category === "sorting") {
    // Quick Sort pivot question
    if (algorithm.id === "quick-sort") {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.pivot !== undefined && step.array && step.array[step.pivot] !== undefined) {
          const pivotVal = step.array[step.pivot];
          const otherVals = step.array.filter((v) => v !== pivotVal);
          const uniqueOthers = Array.from(new Set(otherVals)).slice(0, 3);
          while (uniqueOthers.length < 3) uniqueOthers.push(pivotVal + uniqueOthers.length + 5);

          const rawOptions = [
            { text: `Số ${pivotVal}`, isCorrect: true },
            { text: `Số ${uniqueOthers[0]}`, isCorrect: false },
            { text: `Số ${uniqueOthers[1]}`, isCorrect: false },
            { text: `Số ${uniqueOthers[2]}`, isCorrect: false },
          ];
          const shuffled = shuffleArray(rawOptions);
          const optIds: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
          const correctOpt = optIds[shuffled.findIndex((o) => o.isCorrect)]!;

          questions.push({
            id: `quick-pivot-${i}`,
            stepIndex: i,
            question: `Trong lượt phân hoạch này của Quick Sort, phần tử nào đang được chọn làm Chốt (Pivot)?`,
            options: shuffled.map((o, idx) => ({ id: optIds[idx], text: o.text })),
            correctOptionId: correctOpt,
            explanation: `Chính xác! Số ${pivotVal} được chọn làm Pivot để phân chia mảng thành 2 nửa: các số nhỏ hơn Pivot nằm bên trái, các số lớn hơn nằm bên phải.`,
            category: "sorting",
            points: 100,
          });
          break;
        }
      }
    }

    // Swapping prediction questions
    const swapSteps = steps
      .map((s, idx) => ({ step: s, idx }))
      .filter(({ step }) => step.swapping && step.swapping.length >= 2 && step.array);

    if (swapSteps.length > 0) {
      // Pick 1-2 swap steps to ask questions
      const selectedSwap = swapSteps[Math.floor(swapSteps.length / 2)] || swapSteps[0];
      const { step, idx } = selectedSwap;
      const arr = step.array!;
      const [i1, i2] = step.swapping!;
      const val1 = arr[i1];
      const val2 = arr[i2];

      if (val1 !== undefined && val2 !== undefined) {
        // Generate distractor pairs
        const otherPairs: [number, number][] = [];
        for (let k = 0; k < arr.length - 1; k++) {
          if (k !== i1 && k !== i2 && arr[k] !== val1 && arr[k + 1] !== val2) {
            otherPairs.push([arr[k], arr[k + 1]]);
            if (otherPairs.length >= 3) break;
          }
        }
        while (otherPairs.length < 3) {
          otherPairs.push([val1 + 7, val2 - 3]);
        }

        const rawOptions = [
          { text: `Hoán đổi số ${val1} và ${val2}`, isCorrect: true },
          { text: `Hoán đổi số ${otherPairs[0][0]} và ${otherPairs[0][1]}`, isCorrect: false },
          { text: `Hoán đổi số ${otherPairs[1][0]} và ${otherPairs[1][1]}`, isCorrect: false },
          { text: `Không hoán đổi phần tử nào`, isCorrect: false },
        ];
        const shuffled = shuffleArray(rawOptions);
        const optIds: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
        const correctOpt = optIds[shuffled.findIndex((o) => o.isCorrect)]!;

        questions.push({
          id: `sort-swap-${idx}`,
          stepIndex: Math.max(0, idx - 1),
          question: `Quan sát mảng hiện tại. Ở bước tiếp theo, cặp phần tử nào sẽ bị hoán đổi (swap) vị trí cho nhau vì sai thứ tự?`,
          options: shuffled.map((o, idxOpt) => ({ id: optIds[idxOpt], text: o.text })),
          correctOptionId: correctOpt,
          explanation: `Chính xác! Phần tử ${val1} lớn hơn ${val2} nên giải thuật tiến hành hoán đổi chúng để đảm bảo tính tăng dần.`,
          category: "sorting",
          points: 100,
        });
      }
    }

    // General Big-O question for the algorithm
    questions.push({
      id: `sort-bigo-${algorithm.id}`,
      stepIndex: Math.floor(totalSteps * 0.75),
      question: `Độ phức tạp thời gian trung bình (Average Time Complexity) của giải thuật ${algorithm.name} là bao nhiêu?`,
      options: [
        { id: "A", text: algorithm.complexity.average },
        { id: "B", text: algorithm.complexity.average === "O(N²)" ? "O(N log N)" : "O(N²)" },
        { id: "C", text: "O(N)" },
        { id: "D", text: "O(1)" },
      ],
      correctOptionId: "A",
      explanation: `Chính xác! ${algorithm.name} có độ phức tạp trung bình là ${algorithm.complexity.average}.`,
      category: "theory",
      points: 100,
    });
  }

  // 3. Check for Searching (Binary Search target range)
  if (algorithm.id === "binary-search") {
    questions.push({
      id: "bsearch-concept",
      stepIndex: Math.min(2, steps.length - 1),
      question: `Điều kiện tiên quyết bắt buộc để có thể áp dụng thuật toán Tìm Kiếm Nhị Phân (Binary Search) là gì?`,
      options: [
        { id: "A", text: "Mảng dữ liệu đầu vào đã được sắp xếp theo thứ tự" },
        { id: "B", text: "Mảng phải chứa toàn số nguyên dương" },
        { id: "C", text: "Mảng phải có độ dài là một lũy thừa của 2" },
        { id: "D", text: "Mảng không được chứa các phần tử trùng lặp" },
      ],
      correctOptionId: "A",
      explanation: `Chính xác! Binary Search chỉ hoạt động được trên mảng đã sắp xếp để có thể loại bỏ một nửa không gian tìm kiếm sau mỗi phép so sánh.`,
      category: "searching",
      points: 100,
    });
  }

  // 4. Check for Pathfinding (Dijkstra vs A*)
  if (algorithm.category === "pathfinding") {
    if (algorithm.id === "a-star") {
      questions.push({
        id: "astar-heuristic",
        stepIndex: Math.floor(steps.length * 0.3),
        question: `Trong thuật toán A* Search, hàm chi phí f(n) được tính toán theo công thức nào?`,
        options: [
          { id: "A", text: "f(n) = g(n) + h(n) [Chi phí thực tế + Ước lượng Heuristic]" },
          { id: "B", text: "f(n) = g(n) - h(n)" },
          { id: "C", text: "f(n) = g(n) × h(n)" },
          { id: "D", text: "f(n) = h(n) [Chỉ dùng hàm ước lượng]" },
        ],
        correctOptionId: "A",
        explanation: `Chính xác! A* kết hợp chi phí đã đi g(n) và khoảng cách ước tính tới đích h(n) để hướng đường tìm kiếm trực diện về mục tiêu.`,
        category: "pathfinding",
        points: 100,
      });
    } else {
      questions.push({
        id: "dijkstra-concept",
        stepIndex: Math.floor(steps.length * 0.3),
        question: `Cấu trúc dữ liệu tối ưu thường được dùng trong Dijkstra để lấy ra đỉnh có khoảng cách nhỏ nhất trong O(log V) là gì?`,
        options: [
          { id: "A", text: "Hàng đợi ưu tiên (Priority Queue / Min-Heap)" },
          { id: "B", text: "Ngăn xếp LIFO (Stack)" },
          { id: "C", text: "Danh sách liên kết đơn (Singly Linked List)" },
          { id: "D", text: "Hàng đợi thông thường FIFO (Queue)" },
        ],
        correctOptionId: "A",
        explanation: `Chính xác! Min-Heap / Priority Queue cho phép trích xuất đỉnh có khoảng cách nhỏ nhất trong thời gian O(log V).`,
        category: "pathfinding",
        points: 100,
      });
    }
  }

  // 5. Check for Linked List
  if (algorithm.category === "linked-list") {
    if (algorithm.id === "reverse-linked-list") {
      questions.push({
        id: "rll-pointer",
        stepIndex: 1,
        question: `Trong thuật toán Reverse Linked List, trước khi trỏ curr->next = prev, tại sao ta bắt buộc phải lưu next = curr->next?`,
        options: [
          { id: "A", text: "Để không bị mất liên kết đến các node còn lại của danh sách" },
          { id: "B", text: "Để giải phóng bộ nhớ của node hiện tại" },
          { id: "C", text: "Để tăng độ dài của danh sách liên kết" },
          { id: "D", text: "Để kiểm tra xem danh sách có bị chu trình hay không" },
        ],
        correctOptionId: "A",
        explanation: `Chính xác! Do là danh sách liên kết đơn, nếu không lưu con trỏ next trước khi đổi chiều curr->next, ta sẽ vĩnh viễn mất địa chỉ của phần còn lại.`,
        category: "linked-list",
        points: 100,
      });
    } else if (algorithm.id === "floyd-cycle") {
      questions.push({
        id: "floyd-concept",
        stepIndex: 2,
        question: `Tại sao thuật toán Rùa & Thỏ (Floyd's Tortoise & Hare) đảm bảo 100% hai con trỏ sẽ gặp nhau nếu danh sách có chu trình?`,
        options: [
          { id: "A", text: "Vì mỗi lượt Thỏ rút ngắn khoảng cách với Rùa đúng 1 bước trong chu trình kín" },
          { id: "B", text: "Vì Thỏ chạy nhanh gấp 10 lần Rùa" },
          { id: "C", text: "Vì danh sách tự động đảo ngược khi Thỏ chạm đáy" },
          { id: "D", text: "Vì Rùa sẽ đứng yên chờ Thỏ đến" },
        ],
        correctOptionId: "A",
        explanation: `Chính xác! Tốc độ tương đối giữa Thỏ (2 bước/lần) và Rùa (1 bước/lần) là 2 - 1 = 1 node/lượt. Khoảng cách giữa chúng giảm đều đặn 1 đơn vị mỗi vòng cho đến khi bằng 0!`,
        category: "linked-list",
        points: 100,
      });
    }
  }

  // 6. Check for Stack & Queue
  if (algorithm.category === "stack-queue") {
    questions.push({
      id: "stack-lifo",
      stepIndex: 1,
      question: `Cấu trúc dữ liệu Ngăn xếp (Stack) hoạt động theo nguyên lý truy xuất phần tử nào?`,
      options: [
        { id: "A", text: "LIFO (Last In First Out - Phần tử vào sau cùng sẽ được lấy ra đầu tiên)" },
        { id: "B", text: "FIFO (First In First Out - Vào trước ra trước như xếp hàng)" },
        { id: "C", text: "Random Access (Truy cập ngẫu nhiên qua chỉ số index)" },
        { id: "D", text: "Priority Based (Dựa theo độ ưu tiên của phần tử)" },
      ],
      correctOptionId: "A",
      explanation: `Chính xác! Stack hoạt động theo nguyên lý LIFO (Last In First Out). Phần tử đẩy vào đỉnh sau cùng sẽ là phần tử được lấy ra trước tiên.`,
      category: "stack-queue",
      points: 100,
    });
  }

  // 7. Check for Dynamic Programming (0/1 Knapsack)
  if (algorithm.category === "dp") {
    questions.push({
      id: "knapsack-formula",
      stepIndex: 3,
      question: `Trong bài toán Balo 0/1, nếu khối lượng của đồ vật thứ i (w_i) lớn hơn sức chứa hiện tại (w), giá trị dp[i][w] được tính như thế nào?`,
      options: [
        { id: "A", text: "dp[i][w] = dp[i-1][w] (Không thể chọn, kế thừa giá trị tối ưu của các đồ vật trước)" },
        { id: "B", text: "dp[i][w] = dp[i-1][w - w_i] + v_i (Bắt buộc chọn)" },
        { id: "C", text: "dp[i][w] = 0 (Đặt lại bằng 0)" },
        { id: "D", text: "dp[i][w] = max(dp[i][w-1], v_i)" },
      ],
      correctOptionId: "A",
      explanation: `Chính xác! Khi w_i > w, đồ vật vượt quá sức chứa balo nên bắt buộc phải bỏ qua. Giá trị tối ưu chính là kết quả khi chỉ xét (i-1) đồ vật trước với cùng sức chứa w.`,
      category: "dp",
      points: 120,
    });
  }

  // 8. Check for Backtracking (N-Queens)
  if (algorithm.category === "backtracking") {
    questions.push({
      id: "nqueens-concept",
      stepIndex: 4,
      question: `Trong thuật toán Quay lui xếp Hậu (N-Queens), hai quân Hậu tại [r1, c1] và [r2, c2] được xem là tấn công nhau trên đường chéo khi nào?`,
      options: [
        { id: "A", text: "|r1 - r2| === |c1 - c2| (Hiệu khoảng cách hàng bằng khoảng cách cột)" },
        { id: "B", text: "r1 + c1 === 10" },
        { id: "C", text: "c1 === c2 (Cùng chỉ số cột)" },
        { id: "D", text: "r1 === r2 (Cùng chỉ số hàng)" },
      ],
      correctOptionId: "A",
      explanation: `Chính xác! Hai ô nằm trên cùng một đường chéo (chính hoặc phụ) khi và chỉ khi khoảng cách hàng bằng khoảng cách cột: |r1 - r2| == |c1 - c2|.`,
      category: "backtracking",
      points: 120,
    });
  }

  // 7. Fallback general algorithmic questions if too few
  if (questions.length < 2) {
    questions.push({
      id: `gen-complexity-${algorithm.id}`,
      stepIndex: Math.floor(totalSteps * 0.5),
      question: `Độ phức tạp bộ nhớ (Space Complexity) của thuật toán ${algorithm.name} là bao nhiêu?`,
      options: [
        { id: "A", text: algorithm.complexity.space },
        { id: "B", text: algorithm.complexity.space === "O(1)" ? "O(N)" : "O(1)" },
        { id: "C", text: "O(N²)" },
        { id: "D", text: "O(log N)" },
      ],
      correctOptionId: "A",
      explanation: `Đúng rồi! ${algorithm.name} sử dụng lượng bộ nhớ bổ sung là ${algorithm.complexity.space}.`,
      category: "theory",
      points: 100,
    });
  }

  // Sort questions by stepIndex so they appear in chronological order
  return questions.sort((a, b) => a.stepIndex - b.stepIndex);
}
