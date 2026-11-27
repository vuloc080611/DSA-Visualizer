import { Algorithm, AlgorithmCategory } from "../types";
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
  generateCountingSortSteps,
} from "./sorting";
import { generateLinearSearchSteps, generateBinarySearchSteps } from "./searching";
import {
  generateBFSSteps,
  generateDFSSteps,
  generateBellmanFordSteps,
  defaultGraphData,
  defaultBellmanFordGraph,
} from "./graph";
import { generateTwoSumSteps, generateSlidingWindowSteps, generateKadaneSteps } from "./array";
import { generateBSTSteps, generateAVLSteps, generateTreeTraversalSteps } from "./tree";
import {
  generateDijkstraSteps,
  generateAStarSteps,
  DEFAULT_GRID_ROWS,
  DEFAULT_GRID_COLS,
  DEFAULT_START,
  DEFAULT_END,
  DEFAULT_GRID_WALLS,
} from "./pathfinding";
import {
  generateReverseLinkedListSteps,
  generateFloydCycleSteps,
  DEFAULT_LINKED_LIST_VALUES,
} from "./linkedList";
import { generateValidParenthesesSteps, DEFAULT_PARENTHESES_STRING } from "./stackQueue";
import {
  generateKnapsackSteps,
  generateDp1DSteps,
  DEFAULT_KNAPSACK_ITEMS,
  DEFAULT_KNAPSACK_CAPACITY,
} from "./dp";
import { generateNQueensSteps, DEFAULT_N_QUEENS_SIZE } from "./backtracking";
import { generateTrieSteps, DEFAULT_TRIE_WORDS } from "./trie";
import { generateKMPSteps, DEFAULT_KMP_TEXT, DEFAULT_KMP_PATTERN } from "./kmp";
import { generateKruskalSteps, DEFAULT_KRUSKAL_GRAPH } from "./dsu";
import { generateSegmentTreeSteps, DEFAULT_SEG_TREE_ARRAY } from "./segmentTree";
import { generateTopologicalSortSteps, DEFAULT_DAG_GRAPH } from "./topologicalSort";
import { generateLCSSteps, DEFAULT_LCS_STR1, DEFAULT_LCS_STR2 } from "./lcs";
import { generateIntervalSchedulingSteps } from "./greedy";
import { generateHashTableSteps, generateHashOpenAddressingSteps } from "./hashTable";
import { generateMinHeapSteps } from "./heapOperations";
import { generateLinearOpsSteps } from "./linearOps";

export const ALGORITHMS: Algorithm[] = [
  // =================== SORTING ===================
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    shortDescription: "Sắp xếp nổi bọt bằng cách liên tục so sánh và hoán đổi các cặp phần tử liền kề nếu chúng sai thứ tự.",
    fullDescription:
      "Bubble Sort là thuật toán sắp xếp đơn giản nhất. Trong mỗi lượt duyệt qua mảng, các phần tử liền kề được so sánh với nhau, nếu phần tử trước lớn hơn phần tử sau thì hoán đổi vị trí. Sau mỗi lượt duyệt, phần tử lớn nhất sẽ 'nổi bọt' về cuối mảng.",
    complexity: {
      best: "O(N)",
      average: "O(N²)",
      worst: "O(N²)",
      space: "O(1)",
    },
    properties: {
      stable: true,
      inPlace: true,
      dataStructure: "Array",
    },
    defaultArray: [45, 12, 85, 32, 89, 39, 69, 22, 58, 10],
    code: {
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      typescript: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    },
    generateSteps: (cfg) => generateBubbleSortSteps(cfg?.array || [45, 12, 85, 32, 89, 39, 69, 22, 58, 10]),
  },

  {
    id: "selection-sort",
    name: "Selection Sort",
    category: "sorting",
    shortDescription: "Sắp xếp chọn bằng cách liên tục tìm phần tử nhỏ nhất trong đoạn chưa sắp xếp và đưa về đầu đoạn.",
    fullDescription:
      "Selection Sort chia mảng thành hai phần: phần đã sắp xếp ở bên trái và phần chưa sắp xếp ở bên phải. Mỗi bước, thuật toán tìm phần tử nhỏ nhất trong phần chưa sắp xếp và hoán đổi nó với phần tử đầu tiên của phần đó.",
    complexity: {
      best: "O(N²)",
      average: "O(N²)",
      worst: "O(N²)",
      space: "O(1)",
    },
    properties: {
      stable: false,
      inPlace: true,
      dataStructure: "Array",
    },
    defaultArray: [64, 25, 12, 22, 11, 90, 43, 38],
    code: {
      cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) swap(arr[i], arr[minIdx]);
    }
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
      typescript: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
    },
    generateSteps: (cfg) => generateSelectionSortSteps(cfg?.array || [64, 25, 12, 22, 11, 90, 43, 38]),
  },

  {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "sorting",
    shortDescription: "Sắp xếp chèn bằng cách lấy từng phần tử và chèn vào đúng vị trí trong đoạn con đã được sắp xếp trước đó.",
    fullDescription:
      "Insertion Sort hoạt động tương tự như cách chúng ta xếp các quân bài trên tay. Bắt đầu từ phần tử thứ hai, thuật toán so sánh phần tử hiện tại với các phần tử trước đó và dời các phần tử lớn hơn sang phải để tạo chỗ chèn.",
    complexity: {
      best: "O(N)",
      average: "O(N²)",
      worst: "O(N²)",
      space: "O(1)",
    },
    properties: {
      stable: true,
      inPlace: true,
      dataStructure: "Array",
    },
    defaultArray: [12, 11, 13, 5, 6, 42, 28, 19],
    code: {
      cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
      typescript: `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    },
    generateSteps: (cfg) => generateInsertionSortSteps(cfg?.array || [12, 11, 13, 5, 6, 42, 28, 19]),
  },

  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "sorting",
    shortDescription: "Thuật toán Chia để Trị chia đôi mảng đệ quy rồi gộp hai nửa đã sắp xếp lại với nhau.",
    fullDescription:
      "Merge Sort liên tục chia đôi mảng cho đến khi các đoạn con chỉ còn 1 phần tử (đã được coi là sắp xếp), sau đó gộp (merge) từng cặp đoạn con lại theo thứ tự tăng dần. Thuật toán luôn đảm bảo thời gian O(N log N) trong mọi trường hợp.",
    complexity: {
      best: "O(N log N)",
      average: "O(N log N)",
      worst: "O(N log N)",
      space: "O(N)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "Array",
    },
    defaultArray: [38, 27, 43, 3, 9, 82, 10, 56],
    code: {
      cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res`,
      typescript: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
    },
    generateSteps: (cfg) => generateMergeSortSteps(cfg?.array || [38, 27, 43, 3, 9, 82, 10, 56]),
  },

  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "sorting",
    shortDescription: "Sắp xếp nhanh bằng cách phân hoạch mảng quanh một phần tử chốt (Pivot) đã chọn.",
    fullDescription:
      "Quick Sort chọn một phần tử làm Pivot (ở đây chọn phần tử cuối). Sau đó phân hoạch mảng sao cho tất cả phần tử nhỏ hơn Pivot nằm bên trái, lớn hơn Pivot nằm bên phải. Tiếp tục đệ quy sắp xếp hai nửa đó.",
    complexity: {
      best: "O(N log N)",
      average: "O(N log N)",
      worst: "O(N²)",
      space: "O(log N)",
    },
    properties: {
      stable: false,
      inPlace: true,
      dataStructure: "Array",
    },
    defaultArray: [40, 20, 60, 10, 50, 30, 80, 70],
    code: {
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      typescript: `function quickSort(arr: number[], low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}`,
    },
    generateSteps: (cfg) => generateQuickSortSteps(cfg?.array || [40, 20, 60, 10, 50, 30, 80, 70]),
  },

  {
    id: "heap-sort",
    name: "Heap Sort",
    category: "sorting",
    shortDescription: "Sắp xếp vun đống dựa trên cấu trúc Max-Heap để liên tục trích xuất phần tử cực đại.",
    fullDescription:
      "Heap Sort chuyển đổi mảng thành cấu trúc cây nhị phân Max-Heap. Phần tử lớn nhất luôn nằm ở gốc (arr[0]). Thuật toán hoán đổi gốc với phần tử cuối mảng, giảm kích thước heap và vun lại đống (Heapify) cho đến khi hoàn thành.",
    complexity: {
      best: "O(N log N)",
      average: "O(N log N)",
      worst: "O(N log N)",
      space: "O(1)",
    },
    properties: {
      stable: false,
      inPlace: true,
      dataStructure: "Heap / Binary Tree",
    },
    defaultArray: [25, 45, 15, 65, 35, 75, 5, 55],
    code: {
      cpp: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
      python: `def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1; r = 2 * i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)`,
      typescript: `function heapSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}`,
    },
    generateSteps: (cfg) => generateHeapSortSteps(cfg?.array || [25, 45, 15, 65, 35, 75, 5, 55]),
  },

  // =================== SEARCHING ===================
  {
    id: "linear-search",
    name: "Linear Search",
    category: "searching",
    shortDescription: "Tìm kiếm tuần tự duyệt qua từng phần tử từ đầu đến cuối mảng cho đến khi gặp giá trị cần tìm.",
    fullDescription:
      "Linear Search (tìm kiếm tuyến tính) là giải thuật tìm kiếm trực quan nhất. Thuật toán kiểm tra tuần tự từng phần tử trong danh sách từ trái sang phải cho đến khi tìm thấy phần tử khớp với mục tiêu hoặc hết danh sách.",
    complexity: {
      best: "O(1)",
      average: "O(N)",
      worst: "O(N)",
      space: "O(1)",
    },
    properties: {
      stable: true,
      inPlace: true,
      dataStructure: "Array",
    },
    defaultArray: [18, 42, 7, 33, 91, 56, 24, 68, 12, 80],
    defaultTarget: 56,
    code: {
      cpp: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i; // Tìm thấy tại index i
        }
    }
    return -1; // Không tìm thấy
}`,
      python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i  # Tim thay
    return -1`,
      typescript: `function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    },
    generateSteps: (cfg) =>
      generateLinearSearchSteps(cfg?.array || [18, 42, 7, 33, 91, 56, 24, 68, 12, 80], cfg?.target ?? 56),
  },

  {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    shortDescription: "Tìm kiếm nhị phân trên mảng đã sắp xếp bằng cách chia đôi không gian tìm kiếm ở mỗi bước.",
    fullDescription:
      "Binary Search yêu cầu mảng đầu vào phải được sắp xếp trước. Mỗi bước so sánh phần tử giữa (mid) với target: nếu bằng thì dừng, nếu nhỏ hơn thì tìm tiếp ở nửa phải, nếu lớn hơn thì tìm tiếp ở nửa trái. Giảm một nửa số lượng phần tử sau mỗi phép so sánh.",
    complexity: {
      best: "O(1)",
      average: "O(log N)",
      worst: "O(log N)",
      space: "O(1)",
    },
    properties: {
      stable: true,
      inPlace: true,
      dataStructure: "Sorted Array",
    },
    defaultArray: [11, 23, 34, 45, 56, 67, 78, 89, 92, 99],
    defaultTarget: 67,
    code: {
      cpp: `int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
      typescript: `function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    },
    generateSteps: (cfg) =>
      generateBinarySearchSteps(cfg?.array || [11, 23, 34, 45, 56, 67, 78, 89, 92, 99], cfg?.target ?? 67),
  },

  // =================== GRAPH ===================
  {
    id: "bfs",
    name: "Breadth-First Search (BFS)",
    category: "graph",
    shortDescription: "Thuật toán tìm kiếm theo chiều rộng duyệt đồ thị theo từng tầng sử dụng hàng đợi (Queue).",
    fullDescription:
      "BFS khám phá các đỉnh của đồ thị theo mức khoảng cách (level-order): bắt đầu từ một đỉnh nguồn, thăm tất cả các đỉnh kề trực tiếp trước khi chuyển sang các đỉnh cách xa hơn. Rất hiệu quả để tìm đường đi ngắn nhất trên đồ thị không trọng số.",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "Queue + Graph",
    },
    defaultGraph: defaultGraphData,
    code: {
      cpp: `void bfs(int start, const vector<vector<int>>& adj) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
      python: `from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if v not in visited:
                visited.add(v)
                queue.append(v)`,
      typescript: `function bfs(graph: Map<string, string[]>, start: string) {
  const visited = new Set<string>([start]);
  const queue: string[] = [start];
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of graph.get(u) || []) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }
  }
}`,
    },
    generateSteps: (cfg) => generateBFSSteps(cfg?.graph || defaultGraphData, "A"),
  },

  {
    id: "dfs",
    name: "Depth-First Search (DFS)",
    category: "graph",
    shortDescription: "Thuật toán tìm kiếm theo chiều sâu đi sâu vào từng nhánh của đồ thị trước khi quay lui (Backtrack).",
    fullDescription:
      "DFS duyệt đồ thị bằng cách đi theo một nhánh sâu nhất có thể cho đến khi gặp ngõ cụt (hoặc đỉnh đã thăm), sau đó quay lui (backtracking) lại nút cha để tiếp tục khám phá các nhánh chưa khám phá. DFS thường được thực thi bằng đệ quy hoặc ngăn xếp (Call Stack).",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "Stack / Recursion + Graph",
    },
    defaultGraph: defaultGraphData,
    code: {
      cpp: `void dfs(int u, const vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}`,
      python: `def dfs(graph, u, visited=None):
    if visited is None:
        visited = set()
    visited.add(u)
    for v in graph[u]:
        if v not in visited:
            dfs(graph, v, visited)`,
      typescript: `function dfs(graph: Map<string, string[]>, u: string, visited = new Set<string>()) {
  visited.add(u);
  for (const v of graph.get(u) || []) {
    if (!visited.has(v)) {
      dfs(graph, v, visited);
    }
  }
}`,
    },
    generateSteps: (cfg) => generateDFSSteps(cfg?.graph || defaultGraphData, "A"),
  },

  // =================== ARRAY / OTHERS ===================
  {
    id: "two-sum",
    name: "Two Sum",
    category: "array",
    shortDescription: "Bài toán kinh điển: Tìm hai phần tử trong mảng có tổng bằng một giá trị Target cho trước.",
    fullDescription:
      "Thuật toán Two Sum sử dụng Bảng Băm (Hash Map) để lưu trữ các giá trị đã duyệt qua và chỉ số tương ứng của chúng. Với mỗi phần tử x, ta chỉ cần kiểm tra xem (Target - x) đã có trong Hash Map hay chưa trong thời gian O(1).",
    complexity: {
      best: "O(1)",
      average: "O(N)",
      worst: "O(N)",
      space: "O(N)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "Hash Map / Hash Table",
    },
    defaultArray: [2, 7, 11, 15, 3, 9, 14, 8],
    defaultTarget: 26,
    code: {
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (mp.find(complement) != mp.end()) {
            return {mp[complement], i};
        }
        mp[nums[i]] = i;
    }
    return {};
}`,
      python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp)!, i];
    map.set(nums[i], i);
  }
  return [];
}`,
    },
    generateSteps: (cfg) => generateTwoSumSteps(cfg?.array || [2, 7, 11, 15, 3, 9, 14, 8], cfg?.target ?? 26),
  },

  {
    id: "sliding-window",
    name: "Sliding Window Maximum",
    category: "array",
    shortDescription: "Kỹ thuật cửa sổ trượt: Tìm giá trị lớn nhất trong mỗi cửa sổ con kích thước k trượt từ trái sang phải.",
    fullDescription:
      "Kỹ thuật Sliding Window duy trì một cửa sổ có kích thước cố định k và dịch chuyển dần sang phải. Trong mỗi lần dịch chuyển, ta cập nhật trạng thái của cửa sổ mà không cần phải duyệt lại từ đầu toàn bộ các phần tử, tối ưu hóa thời gian tính toán.",
    complexity: {
      best: "O(N)",
      average: "O(N)",
      worst: "O(N)",
      space: "O(k)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "Sliding Window / Deque",
    },
    defaultArray: [12, 45, 23, 67, 34, 89, 21, 56, 78, 30],
    code: {
      cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> result;
    deque<int> dq;
    for (int i = 0; i < nums.size(); i++) {
        if (!dq.empty() && dq.front() == i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}`,
      python: `from collections import deque

def max_sliding_window(nums, k):
    dq = deque()
    res = []
    for i, num in enumerate(nums):
        if dq and dq[0] == i - k:
            dq.popleft()
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res`,
      typescript: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  for (let i = 0; i <= nums.length - k; i++) {
    result.push(Math.max(...nums.slice(i, i + k)));
  }
  return result;
}`,
    },
    generateSteps: (cfg) => generateSlidingWindowSteps(cfg?.array || [12, 45, 23, 67, 34, 89, 21, 56, 78, 30], 3),
  },

  {
    id: "kadane",
    name: "Kadane's Algorithm",
    category: "array",
    shortDescription: "Thuật toán quy hoạch động kinh điển tìm dãy con liên tiếp có tổng lớn nhất trong O(N).",
    fullDescription:
      "Thuật toán Kadane giải quyết bài toán Maximum Subarray Problem trong thời gian tuyến tính O(N). Thuật toán liên tục tính toán xem nên bắt đầu một dãy con mới tại phần tử hiện tại hay tiếp tục kéo dài dãy con từ các phần tử trước đó.",
    complexity: {
      best: "O(N)",
      average: "O(N)",
      worst: "O(N)",
      space: "O(1)",
    },
    properties: {
      stable: true,
      inPlace: true,
      dataStructure: "Dynamic Programming / Array",
    },
    defaultArray: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    code: {
      cpp: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0], currentMax = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        currentMax = max(nums[i], currentMax + nums[i]);
        maxSoFar = max(maxSoFar, currentMax);
    }
    return maxSoFar;
}`,
      python: `def max_sub_array(nums):
    max_so_far = current_max = nums[0]
    for x in nums[1:]:
        current_max = max(x, current_max + x)
        max_so_far = max(max_so_far, current_max)
    return max_so_far`,
      typescript: `function maxSubArray(nums: number[]): number {
  let maxSoFar = nums[0], currentMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}`,
    },
    generateSteps: (cfg) => generateKadaneSteps(cfg?.array || [-2, 1, -3, 4, -1, 2, 1, -5, 4]),
  },

  // =================== TREE (CÂY NHỊ PHÂN) ===================
  {
    id: "bst",
    name: "Binary Search Tree (BST)",
    category: "tree",
    shortDescription: "Cây nhị phân tìm kiếm hỗ trợ thao tác Chèn (Insert), Tìm kiếm (Search) và Xóa (Delete) trong O(log N).",
    fullDescription:
      "Binary Search Tree (BST) là cấu trúc dữ liệu cây nhị phân có tính chất: với mọi nút X, tất cả các nút ở cây con trái đều nhỏ hơn X, và tất cả các nút ở cây con phải đều lớn hơn X. Nhờ tính chất này, việc tìm kiếm, chèn và xóa có thể thực hiện trung bình trong O(log N). Khi xóa nút có 2 con, ta thay thế bằng phần tử nhỏ nhất cây con phải (Inorder Successor).",
    complexity: {
      best: "O(1)",
      average: "O(log N)",
      worst: "O(N)",
      space: "O(N)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "Binary Tree / Pointer Node",
    },
    defaultTreeValues: [50, 30, 70, 20, 40, 60, 80],
    code: {
      cpp: `struct Node {
    int val;
    Node *left, *right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val) root->left = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    return root;
}

Node* search(Node* root, int target) {
    if (!root || root->val == target) return root;
    if (target < root->val) return search(root->left, target);
    return search(root->right, target);
}

Node* deleteNode(Node* root, int key) {
    if (!root) return root;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) { Node* temp = root->right; delete root; return temp; }
        else if (!root->right) { Node* temp = root->left; delete root; return temp; }
        Node* succ = root->right;
        while (succ->left) succ = succ->left;
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def search(root, target):
    if not root or root.val == target:
        return root
    if target < root.val:
        return search(root.left, target)
    return search(root.right, target)`,
      typescript: `class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

function insertBST(root: TreeNode | null, val: number): TreeNode {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else if (val > root.val) root.right = insertBST(root.right, val);
  return root;
}`,
    },
    generateSteps: (cfg) => generateBSTSteps(cfg?.treeValues || [50, 30, 70, 20, 40, 60, 80], cfg),
  },

  {
    id: "avl-tree",
    name: "AVL Tree (Self-Balancing)",
    category: "tree",
    shortDescription: "Cây nhị phân tự cân bằng duy trì hệ số Balance Factor ∈ {-1, 0, 1} bằng 4 phép xoay cây (Rotations).",
    fullDescription:
      "AVL Tree là cây tìm kiếm nhị phân tự cân bằng đầu tiên trên thế giới. Sau mỗi thao tác chèn hoặc xóa, cây tính toán hệ số cân bằng Balance Factor = Height(Left) - Height(Right). Nếu mất cân bằng (|BF| > 1), cây tự động kích hoạt một trong 4 kỹ thuật xoay: Xoay Phải (LL), Xoay Trái (RR), Xoay Kép Trái-Phải (LR), hoặc Xoay Kép Phải-Trái (RL) để đảm bảo chiều cao luôn là O(log N) cho mọi tình huống.",
    complexity: {
      best: "O(1)",
      average: "O(log N)",
      worst: "O(log N)",
      space: "O(N)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "Self-Balancing Binary Tree",
    },
    defaultTreeValues: [10, 20, 30, 40, 50, 25],
    code: {
      cpp: `int height(Node* n) { return n ? n->height : 0; }
int getBalance(Node* n) { return n ? height(n->left) - height(n->right) : 0; }

Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = 1 + max(height(y->left), height(y->right));
    x->height = 1 + max(height(x->left), height(x->right));
    return x;
}

Node* leftRotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;
    y->left = x;
    x->right = T2;
    x->height = 1 + max(height(x->left), height(x->right));
    y->height = 1 + max(height(y->left), height(y->right));
    return y;
}

Node* insertAVL(Node* node, int val) {
    if (!node) return new Node(val);
    if (val < node->val) node->left = insertAVL(node->left, val);
    else if (val > node->val) node->right = insertAVL(node->right, val);
    else return node;

    node->height = 1 + max(height(node->left), height(node->right));
    int bf = getBalance(node);

    // LL Case
    if (bf > 1 && val < node->left->val) return rightRotate(node);
    // RR Case
    if (bf < -1 && val > node->right->val) return leftRotate(node);
    // LR Case
    if (bf > 1 && val > node->left->val) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    // RL Case
    if (bf < -1 && val < node->right->val) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}`,
      python: `def right_rotate(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left = T2
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    return x

def left_rotate(x):
    y = x.right
    T2 = y.left
    y.left = x
    x.right = T2
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    return y`,
      typescript: `function insertAVL(node: TreeNode | null, val: number): TreeNode {
  if (!node) return new TreeNode(val);
  if (val < node.val) node.left = insertAVL(node.left, val);
  else if (val > node.val) node.right = insertAVL(node.right, val);
  else return node;

  const bf = getBalance(node);
  if (bf > 1 && val < node.left!.val) return rightRotate(node);
  if (bf < -1 && val > node.right!.val) return leftRotate(node);
  if (bf > 1 && val > node.left!.val) {
    node.left = leftRotate(node.left!);
    return rightRotate(node);
  }
  if (bf < -1 && val < node.right!.val) {
    node.right = rightRotate(node.right!);
    return leftRotate(node);
  }
  return node;
}`,
    },
    generateSteps: (cfg) => generateAVLSteps(cfg?.treeValues || [10, 20, 30, 40, 50, 25], cfg),
  },

  // =================== PATHFINDING (2D GRID) ===================
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm (Lưới 2D)",
    category: "pathfinding",
    shortDescription: "Tìm đường đi ngắn nhất kinh điển trong mê cung lưới 2D bằng hàng đợi ưu tiên.",
    fullDescription:
      "Thuật toán Dijkstra tìm đường đi ngắn nhất từ một điểm xuất phát duy nhất (Single-source shortest path). Trên mê cung lưới 2D, Dijkstra lan tỏa đồng đều theo mọi hướng (dạng sóng tròn) qua các ô kề cạnh (4 hướng) để luồn lách qua các bức tường chướng ngại vật và luôn đảm bảo tìm được đường đi ngắn nhất đến đích.",
    complexity: {
      best: "O(V + E log V)",
      average: "O(E + V log V)",
      worst: "O(E + V log V)",
      space: "O(V)",
    },
    properties: {
      inPlace: false,
      dataStructure: "Priority Queue (Min-Heap), 2D Grid",
    },
    defaultGrid: {
      rows: DEFAULT_GRID_ROWS,
      cols: DEFAULT_GRID_COLS,
      start: DEFAULT_START,
      end: DEFAULT_END,
      walls: DEFAULT_GRID_WALLS,
    },
    code: {
      cpp: `// Dijkstra trên lưới 2D có chướng ngại vật
vector<Point> dijkstra2D(Point start, Point end, vector<vector<int>>& grid) {
    int R = grid.size(), C = grid[0].size();
    vector<vector<int>> dist(R, vector<int>(C, 1e9));
    vector<vector<Point>> parent(R, vector<Point>(C, {-1, -1}));
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> pq;

    dist[start.r][start.c] = 0;
    pq.push({0, start.r, start.c});
    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    while (!pq.empty()) {
        auto [d, r, c] = pq.top(); pq.pop();
        if (r == end.r && c == end.c) break; // Tìm thấy đích!
        if (d > dist[r][c]) continue;

        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 0) {
                if (dist[r][c] + 1 < dist[nr][nc]) {
                    dist[nr][nc] = dist[r][c] + 1;
                    parent[nr][nc] = {r, c};
                    pq.push({dist[nr][nc], nr, nc});
                }
            }
        }
    }
    return reconstructPath(parent, start, end);
}`,
      python: `import heapq

def dijkstra_grid(grid, start, end):
    R, C = len(grid), len(grid[0])
    dist = {start: 0}
    parent = {}
    pq = [(0, start[0], start[1])]
    visited = set()

    while pq:
        d, r, c = heapq.heappop(pq)
        if (r, c) == end:
            break
        if (r, c) in visited:
            continue
        visited.add((r, c))

        for dr, dc in [(-1, 0), (0, 1), (1, 0), (0, -1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0:
                new_dist = d + 1
                if new_dist < dist.get((nr, nc), float('inf')):
                    dist[(nr, nc)] = new_dist
                    parent[(nr, nc)] = (r, c)
                    heapq.heappush(pq, (new_dist, nr, nc))
    return reconstruct_path(parent, start, end)`,
      typescript: `function dijkstraGrid(grid: number[][], start: [number, number], end: [number, number]) {
  const rows = grid.length, cols = grid[0].length;
  const dist: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const parent: Map<string, [number, number]> = new Map();
  const pq: { r: number; c: number; d: number }[] = [{ r: start[0], c: start[1], d: 0 }];
  dist[start[0]][start[1]] = 0;

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d);
    const { r, c, d } = pq.shift()!;
    if (r === end[0] && c === end[1]) break; // Found end!

    for (const [dr, dc] of [[-1, 0], [0, 1], [1, 0], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        if (d + 1 < dist[nr][nc]) {
          dist[nr][nc] = d + 1;
          parent.set(\`\${nr},\${nc}\`, [r, c]);
          pq.push({ r: nr, c: nc, d: d + 1 });
        }
      }
    }
  }
  return reconstructPath(parent, start, end);
}`,
    },
    generateSteps: (cfg) => generateDijkstraSteps(cfg),
  },

  {
    id: "a-star",
    name: "A* Search Algorithm (Lưới 2D)",
    category: "pathfinding",
    shortDescription: "Thuật toán tìm đường đi tối ưu sử dụng hàm heuristic hướng đích f(n) = g(n) + h(n).",
    fullDescription:
      "A* (A-Star) là phiên bản nâng cấp có định hướng (Informed Search) của Dijkstra. Bằng cách sử dụng hàm ước lượng Heuristic (khoảng cách Manhattan h = |Δr| + |Δc| trên lưới 2D), A* 'kéo' quá trình duyệt trực diện về phía điểm kết thúc End, giúp tiết kiệm số ô cần duyệt vượt trội so với Dijkstra.",
    complexity: {
      best: "O(V)",
      average: "O(E)",
      worst: "O(b^d)",
      space: "O(V)",
    },
    properties: {
      inPlace: false,
      dataStructure: "Priority Queue, Manhattan Heuristic",
    },
    defaultGrid: {
      rows: DEFAULT_GRID_ROWS,
      cols: DEFAULT_GRID_COLS,
      start: DEFAULT_START,
      end: DEFAULT_END,
      walls: DEFAULT_GRID_WALLS,
    },
    code: {
      cpp: `// A* Search trên lưới 2D với Manhattan Heuristic
int manhattan(Point a, Point b) {
    return abs(a.r - b.r) + abs(a.c - b.c);
}

vector<Point> aStarSearch(Point start, Point end, vector<vector<int>>& grid) {
    int R = grid.size(), C = grid[0].size();
    vector<vector<int>> gScore(R, vector<int>(C, 1e9));
    priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> openSet;

    gScore[start.r][start.c] = 0;
    openSet.push({manhattan(start, end), start.r, start.c}); // f = g + h

    while (!openSet.empty()) {
        auto [f, r, c] = openSet.top(); openSet.pop();
        if (r == end.r && c == end.c) break; // Đã tới đích!

        for (auto [dr, dc] : directions) {
            int nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 0) {
                int tentativeG = gScore[r][c] + 1;
                if (tentativeG < gScore[nr][nc]) {
                    gScore[nr][nc] = tentativeG;
                    int fScore = tentativeG + manhattan({nr, nc}, end);
                    openSet.push({fScore, nr, nc});
                }
            }
        }
    }
    return reconstructPath(parent, start, end);
}`,
      python: `import heapq

def a_star_grid(grid, start, end):
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1]) # Manhattan

    open_set = [(heuristic(start, end), 0, start)] # (f, g, node)
    g_score = {start: 0}
    parent = {}

    while open_set:
        f, g, (r, c) = heapq.heappop(open_set)
        if (r, c) == end:
            break

        for dr, dc in [(-1, 0), (0, 1), (1, 0), (0, -1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc] == 0:
                tentative_g = g + 1
                if tentative_g < g_score.get((nr, nc), float('inf')):
                    g_score[(nr, nc)] = tentative_g
                    f_score = tentative_g + heuristic((nr, nc), end)
                    parent[(nr, nc)] = (r, c)
                    heapq.heappush(open_set, (f_score, tentative_g, (nr, nc)))
    return reconstruct_path(parent, start, end)`,
      typescript: `function aStarGrid(grid: number[][], start: [number, number], end: [number, number]) {
  const h = (r: number, c: number) => Math.abs(r - end[0]) + Math.abs(c - end[1]);
  const rows = grid.length, cols = grid[0].length;
  const gScore: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const parent: Map<string, [number, number]> = new Map();
  
  gScore[start[0]][start[1]] = 0;
  const openSet = [{ r: start[0], c: start[1], g: 0, f: h(start[0], start[1]) }];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const curr = openSet.shift()!;
    if (curr.r === end[0] && curr.c === end[1]) break; // Found end!

    for (const [dr, dc] of [[-1, 0], [0, 1], [1, 0], [0, -1]]) {
      const nr = curr.r + dr, nc = curr.c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        const tentativeG = curr.g + 1;
        if (tentativeG < gScore[nr][nc]) {
          gScore[nr][nc] = tentativeG;
          parent.set(\`\${nr},\${nc}\`, [curr.r, curr.c]);
          openSet.push({ r: nr, c: nc, g: tentativeG, f: tentativeG + h(nr, nc) });
        }
      }
    }
  }
  return reconstructPath(parent, start, end);
}`,
    },
    generateSteps: (cfg) => generateAStarSteps(cfg),
  },

  // =================== LINKED LIST ===================
  {
    id: "reverse-linked-list",
    name: "Reverse Linked List (Đảo ngược DSLK)",
    category: "linked-list",
    shortDescription: "Thuật toán đảo ngược danh sách liên kết đơn bằng cách đổi chiều con trỏ trong O(N).",
    fullDescription:
      "Đảo ngược danh sách liên kết (LeetCode #206) là bài toán kinh điển kiểm tra khả năng thao tác con trỏ. Thuật toán duy trì 3 con trỏ: prev (node phía trước), curr (node hiện tại), next (node phía sau). Ở mỗi bước, con trỏ next của curr được trỏ ngược về prev, sau đó tịnh tiến về phía trước.",
    complexity: {
      best: "O(N)",
      average: "O(N)",
      worst: "O(N)",
      space: "O(1)",
    },
    properties: {
      inPlace: true,
      dataStructure: "Singly Linked List",
    },
    defaultArray: DEFAULT_LINKED_LIST_VALUES,
    code: {
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next; // 1. Lưu con trỏ next
        curr->next = prev;               // 2. Đảo chiều con trỏ
        prev = curr;                     // 3. Tịnh tiến prev
        curr = nextTemp;                 // 4. Tịnh tiến curr
    }
    return prev; // Head mới của danh sách
}`,
      python: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next  # 1. Lưu con trỏ kế tiếp
        curr.next = prev       # 2. Đảo ngược mũi tên
        prev = curr            # 3. Tịnh tiến prev
        curr = next_temp       # 4. Tịnh tiến curr
    return prev`,
      typescript: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr !== null) {
    const nextTemp = curr.next; // 1. Lưu node kế
    curr.next = prev;           // 2. Đảo chiều trỏ ngược
    prev = curr;                // 3. Tiến prev
    curr = nextTemp;            // 4. Tiến curr
  }
  return prev;
}`,
    },
    generateSteps: (cfg) => generateReverseLinkedListSteps(cfg?.array || DEFAULT_LINKED_LIST_VALUES),
  },

  {
    id: "floyd-cycle",
    name: "Floyd's Cycle Detection (Rùa & Thỏ)",
    category: "linked-list",
    shortDescription: "Thuật toán phát hiện chu trình trong danh sách liên kết với 2 con trỏ Fast & Slow.",
    fullDescription:
      "Thuật toán phát hiện chu trình của Floyd (Tortoise and Hare - LeetCode #141) sử dụng 2 con trỏ chạy với tốc độ khác nhau: Slow (Rùa) bước 1 node mỗi lần, Fast (Thỏ) nhảy 2 node mỗi lần. Nếu danh sách có chu trình kín, Thỏ chắc chắn sẽ đuổi kịp Rùa từ phía sau trong O(N) với bộ nhớ O(1).",
    complexity: {
      best: "O(1)",
      average: "O(N)",
      worst: "O(N)",
      space: "O(1)",
    },
    properties: {
      inPlace: true,
      dataStructure: "Cyclic Linked List",
    },
    code: {
      cpp: `bool hasCycle(ListNode *head) {
    if (!head || !head->next) return false;
    ListNode *slow = head;
    ListNode *fast = head;
    while (fast && fast->next) {
        slow = slow->next;          // Rùa đi 1 bước
        fast = fast->next->next;    // Thỏ đi 2 bước
        if (slow == fast) {
            return true;            // Bắt kịp -> Có chu trình!
        }
    }
    return false;
}`,
      python: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next           # Rùa đi 1 bước
        fast = fast.next.next      # Thỏ đi 2 bước
        if slow == fast:
            return True            # Gặp nhau trong chu trình!
    return False`,
      typescript: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;          // 1 bước
    fast = fast.next.next;      // 2 bước
    if (slow === fast) {
      return true;              // Bắt kịp nhau!
    }
  }
  return false;
}`,
    },
    generateSteps: () => generateFloydCycleSteps(),
  },

  // =================== STACK & QUEUE ===================
  {
    id: "valid-parentheses",
    name: "Valid Parentheses (Ngoặc hợp lệ - Stack)",
    category: "stack-queue",
    shortDescription: "Kiểm tra tính hợp lệ của chuỗi các dấu ngoặc đóng mở bằng cấu trúc Ngăn xếp LIFO.",
    fullDescription:
      "Bài toán kiểm tra ngoặc hợp lệ (LeetCode #20) là ứng dụng tiêu biểu nhất của Ngăn xếp (Stack). Duyệt qua từng ký tự: nếu là ngoặc mở ('(', '[', '{') thì ĐẨY (PUSH) vào Stack; nếu là ngoặc đóng (')', ']', '}') thì LẤY (POP) phần tử ở đỉnh Stack ra để so khớp cặp. Nếu rỗng hoặc không khớp -> Không hợp lệ.",
    complexity: {
      best: "O(1)",
      average: "O(N)",
      worst: "O(N)",
      space: "O(N)",
    },
    properties: {
      inPlace: false,
      dataStructure: "Stack (LIFO)",
    },
    code: {
      cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> map = {{')', '('}, {']', '['}, {'}', '{'}};
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c); // Đẩy ngoặc mở vào stack
        } else {
            if (st.empty() || st.top() != map[c]) return false;
            st.pop();  // Khớp cặp -> Lấy ra khỏi stack
        }
    }
    return st.empty(); // Phải rỗng mới hợp lệ
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "]": "[", "}": "{"}
    for char in s:
        if char in mapping.values():
            stack.append(char) # Push mở ngoặc
        elif char in mapping:
            if not stack or stack[-1] != mapping[char]:
                return False   # Mismatch
            stack.pop()        # Pop khi khớp
    return len(stack) == 0`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char); // Push ngoặc mở
    } else {
      if (stack.length === 0 || stack[stack.length - 1] !== map[char]) {
        return false;   // Sai thứ tự hoặc rỗng
      }
      stack.pop();      // Pop khớp cặp
    }
  }
  return stack.length === 0;
}`,
    },
    generateSteps: () => generateValidParenthesesSteps(),
  },

  // =================== DYNAMIC PROGRAMMING ===================
  {
    id: "knapsack-01",
    name: "0/1 Knapsack (Balo 0/1)",
    category: "dp",
    shortDescription: "Bài toán cái túi 0/1: Chọn các đồ vật sao cho tổng giá trị lớn nhất mà không vượt quá sức chứa W của Balo bằng Quy hoạch động ma trận 2D.",
    fullDescription:
      "0/1 Knapsack là bài toán kinh điển của Quy hoạch động. Cho N đồ vật, mỗi đồ có trọng lượng w_i và giá trị v_i. Ta cần chọn một tập con các đồ vật để tổng giá trị là lớn nhất và tổng khối lượng không vượt quá W. Bảng dp[i][w] lưu giá trị tối ưu khi chỉ xét i đồ vật đầu tiên với sức chứa balo là w. Công thức: dp[i][w] = max(dp[i-1][w], dp[i-1][w - w_i] + v_i). Cuối cùng thuật toán truy vết ngược để tìm chính xác các đồ vật đã chọn.",
    complexity: {
      best: "O(N × W)",
      average: "O(N × W)",
      worst: "O(N × W)",
      space: "O(N × W)",
    },
    properties: {
      stable: false,
      inPlace: false,
      dataStructure: "2D DP Table / Matrix",
    },
    code: {
      cpp: `int knapsack(int W, vector<int>& wt, vector<int>& val, int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - wt[i - 1]] + val[i - 1]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,
      python: `def knapsack(W, wt, val, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i - 1] <= w:
                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - wt[i - 1]] + val[i - 1])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]`,
      typescript: `function knapsack(W: number, wt: number[], val: number[], n: number): number {
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (wt[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wt[i - 1]] + val[i - 1]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][W];
}`,
    },
    generateSteps: () => generateKnapsackSteps(),
  },

  // =================== BACKTRACKING ===================
  {
    id: "n-queens",
    name: "N-Queens (Xếp N quân Hậu)",
    category: "backtracking",
    shortDescription: "Bài toán xếp N quân Hậu trên bàn cờ N×N sao cho không có 2 quân Hậu nào khống chế nhau bằng thuật toán Quay lui (Backtracking).",
    fullDescription:
      "N-Queens là bài toán kinh điển mô tả kỹ thuật Quay lui (Backtracking) và vét cạn có tỉa nhánh. Mục tiêu là xếp N quân Hậu lên bàn cờ N×N sao cho không có hai quân Hậu nào cùng hàng, cùng cột hoặc cùng đường chéo. Thuật toán thử đặt quân Hậu lần lượt từ hàng 0 đến hàng N-1. Nếu tại một hàng không tìm thấy ô an toàn (bị chiếu), thuật toán sẽ QUAY LUI (Backtrack) về hàng trước đó để rút quân và thử vị trí tiếp theo.",
    complexity: {
      best: "O(N)",
      average: "O(N!)",
      worst: "O(N!)",
      space: "O(N)",
    },
    properties: {
      stable: false,
      inPlace: true,
      dataStructure: "Chessboard / Array",
    },
    code: {
      cpp: `bool isSafe(vector<int>& board, int row, int col) {
    for (int r = 0; r < row; r++) {
        if (board[r] == col || abs(board[r] - col) == abs(r - row))
            return false;
    }
    return true;
}

bool solveNQueens(vector<int>& board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col;
            if (solveNQueens(board, row + 1, n)) return true;
            board[row] = -1; // Backtrack
        }
    }
    return false;
}`,
      python: `def is_safe(board, row, col):
    for r in range(row):
        if board[r] == col or abs(board[r] - col) == abs(r - row):
            return False
    return True

def solve_n_queens(board, row, n):
    if row == n:
        return True
    for col in range(n):
        if is_safe(board, row, col):
            board[row] = col
            if solve_n_queens(board, row + 1, n):
                return True
            board[row] = -1  # Backtrack
    return False`,
      typescript: `function isSafe(board: number[], row: number, col: number): boolean {
  for (let r = 0; r < row; r++) {
    if (board[r] === col || Math.abs(board[r] - col) === Math.abs(r - row)) {
      return false;
    }
  }
  return true;
}

function solveNQueens(board: number[], row: number, n: number): boolean {
  if (row === n) return true;
  for (let col = 0; col < n; col++) {
    if (isSafe(board, row, col)) {
      board[row] = col;
      if (solveNQueens(board, row + 1, n)) return true;
      board[row] = -1; // Backtrack
    }
  }
  return false;
}`,
    },
    generateSteps: () => generateNQueensSteps(),
  },

  // =================== STRING & TRIE ===================
  {
    id: "trie",
    name: "Trie (Prefix Tree & Autocomplete)",
    category: "string",
    shortDescription: "Cây tiền tố (Trie) hỗ trợ chèn từ, tra cứu và tự động gợi ý tìm kiếm (Autocomplete) siêu tốc trong thời gian O(L).",
    fullDescription:
      "Trie (còn gọi là Prefix Tree) là cấu trúc dữ liệu cây chuyên dùng để lưu trữ tập hợp các chuỗi ký tự. Mỗi cạnh hoặc node biểu diễn một ký tự. Các từ có cùng tiền tố sẽ dùng chung một nhánh từ gốc, giúp tiết kiệm bộ nhớ và tìm kiếm nhanh chóng trong O(L) với L là độ dài từ. Ứng dụng phổ biến trong tính năng Autocomplete của Google và bộ kiểm tra chính tả.",
    complexity: {
      best: "O(L)",
      average: "O(L)",
      worst: "O(L)",
      space: "O(N × L)",
    },
    properties: {
      stable: false,
      inPlace: false,
      dataStructure: "Prefix Tree",
    },
    code: {
      cpp: `class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEndOfWord = false;
};

void insert(TrieNode* root, string word) {
    TrieNode* curr = root;
    for (char c : word) {
        if (!curr->children.count(c))
            curr->children[c] = new TrieNode();
        curr = curr->children[c];
    }
    curr->isEndOfWord = true;
}`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

def insert(root, word):
    curr = root
    for char in word:
        if char not in curr.children:
            curr.children[char] = TrieNode()
        curr = curr.children[char]
    curr.is_end = True`,
      typescript: `class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord = false;
}

function insert(root: TrieNode, word: string): void {
  let curr = root;
  for (const char of word) {
    if (!curr.children[char]) {
      curr.children[char] = new TrieNode();
    }
    curr = curr.children[char];
  }
  curr.isEndOfWord = true;
}`,
    },
    generateSteps: () => generateTrieSteps(),
  },

  {
    id: "kmp",
    name: "KMP (Knuth-Morris-Pratt)",
    category: "string",
    shortDescription: "Thuật toán tìm kiếm xâu mẫu (Pattern Matching) tuyến tính O(N + M) sử dụng mảng tiền tố LPS để nhảy cóc bỏ qua các ký tự đã so khớp.",
    fullDescription:
      "KMP là một trong những giải thuật xử lý chuỗi kinh điển nhất trong khoa học máy tính. Bằng cách tính toán trước mảng LPS (Longest Prefix Suffix), khi gặp một vị trí không khớp (mismatch), KMP không bao giờ lùi con trỏ của văn bản mà dùng mảng LPS để trượt mẫu tìm kiếm sang vị trí thích hợp tiếp theo.",
    complexity: {
      best: "O(N)",
      average: "O(N + M)",
      worst: "O(N + M)",
      space: "O(M)",
    },
    properties: {
      stable: true,
      inPlace: true,
      dataStructure: "Array / String",
    },
    code: {
      cpp: `vector<int> computeLPS(string pat) {
    int m = pat.length(), len = 0, i = 1;
    vector<int> lps(m, 0);
    while (i < m) {
        if (pat[i] == pat[len]) {
            len++; lps[i] = len; i++;
        } else if (len != 0) {
            len = lps[len - 1];
        } else {
            lps[i] = 0; i++;
        }
    }
    return lps;
}`,
      python: `def compute_lps(pattern):
    lps = [0] * len(pattern)
    length, i = 0, 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length != 0:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps`,
      typescript: `function computeLPS(pattern: string): number[] {
  const lps = Array(pattern.length).fill(0);
  let len = 0, i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++; lps[i] = len; i++;
    } else if (len !== 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0; i++;
    }
  }
  return lps;
}`,
    },
    generateSteps: () => generateKMPSteps(),
  },

  // =================== GRAPH ADVANCED ===================
  {
    id: "kruskal-dsu",
    name: "Kruskal's MST (Cây khung DSU)",
    category: "graph",
    shortDescription: "Tìm Cây Khung Nhỏ Nhất (MST) kết nối toàn bộ đồ thị với chi phí tối thiểu bằng giải thuật Kruskal và cấu trúc dữ liệu Disjoint Set Union (DSU).",
    fullDescription:
      "Thuật toán Kruskal sắp xếp toàn bộ cạnh theo trọng số tăng dần, sau đó lần lượt xét từng cạnh và dùng cấu trúc tập hợp rời rạc (DSU) với phép Find và Union để kiểm tra xem cạnh đó có tạo chu trình kín hay không. Nếu an toàn, cạnh được nạp vào MST cho đến khi đủ V-1 cạnh.",
    complexity: {
      best: "O(E log E)",
      average: "O(E log E)",
      worst: "O(E log E)",
      space: "O(V + E)",
    },
    properties: {
      stable: false,
      inPlace: false,
      dataStructure: "Graph & Disjoint Set",
    },
    code: {
      cpp: `int find(int i, vector<int>& parent) {
    if (parent[i] == i) return i;
    return parent[i] = find(parent[i], parent); // Path compression
}

void unionSet(int i, int j, vector<int>& parent) {
    int rootI = find(i, parent);
    int rootJ = find(j, parent);
    if (rootI != rootJ) parent[rootI] = rootJ;
}`,
      python: `def find(parent, i):
    if parent[i] == i:
        return i
    parent[i] = find(parent, parent[i]) # Path compression
    return parent[i]

def union(parent, i, j):
    root_i = find(parent, i)
    root_j = find(parent, j)
    if root_i != root_j:
        parent[root_i] = root_j`,
      typescript: `function find(parent: Record<string, string>, i: string): string {
  if (parent[i] === i) return i;
  parent[i] = find(parent, parent[i]); // Path compression
  return parent[i];
}

function union(parent: Record<string, string>, i: string, j: string): void {
  const rootI = find(parent, i);
  const rootJ = find(parent, j);
  if (rootI !== rootJ) parent[rootI] = rootJ;
}`,
    },
    generateSteps: () => generateKruskalSteps(),
  },

  {
    id: "topological-sort",
    name: "Topological Sort (Thuật toán Kahn)",
    category: "graph",
    shortDescription: "Sắp xếp các đỉnh của đồ thị có hướng không chu trình (DAG) theo thứ tự tuyến tính hợp lệ (bài toán Course Schedule / Build Dependencies).",
    fullDescription:
      "Topological Sort dùng thuật toán Kahn dựa trên Bán bậc vào (In-Degree). Hàng đợi lưu các đỉnh có bán bậc vào bằng 0 (không phụ thuộc vào môn nào). Mỗi lượt lấy một đỉnh ra khỏi hàng đợi và giảm bán bậc vào của các đỉnh kề. Nếu tất cả đỉnh được xếp, đồ thị là DAG hợp lệ; nếu còn sót, phát hiện có chu trình phụ thuộc lẫn nhau.",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "Directed Acyclic Graph (DAG)",
    },
    code: {
      cpp: `vector<int> topologicalSort(int V, vector<vector<int>>& adj) {
    vector<int> inDegree(V, 0), order;
    for (int u = 0; u < V; u++)
        for (int v : adj[u]) inDegree[v]++;
    queue<int> q;
    for (int i = 0; i < V; i++)
        if (inDegree[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u])
            if (--inDegree[v] == 0) q.push(v);
    }
    return order;
}`,
      python: `def topological_sort(V, adj):
    in_degree = [0] * V
    for u in range(V):
        for v in adj[u]:
            in_degree[v] += 1
    queue = [i for i in range(V) if in_degree[i] == 0]
    order = []
    while queue:
        u = queue.pop(0)
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    return order`,
      typescript: `function topologicalSort(V: number, adj: Record<string, string[]>): string[] {
  const inDegree: Record<string, number> = {};
  const order: string[] = [];
  const queue: string[] = [];
  // Kahn's Algorithm
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj[u] || []) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }
  return order;
}`,
    },
    generateSteps: () => generateTopologicalSortSteps(),
  },

  // =================== TREE ADVANCED ===================
  {
    id: "segment-tree",
    name: "Segment Tree (Cây Phân Đoạn)",
    category: "tree",
    shortDescription: "Cấu trúc cây nhị phân lưu trữ thông tin đoạn [L, R], hỗ trợ truy vấn tổng đoạn (Range Sum) và cập nhật điểm (Point Update) đều trong O(log N).",
    fullDescription:
      "Segment Tree là cấu trúc dữ liệu nâng cao quan trọng bậc nhất trong lập trình thi đấu CP. Mỗi node quản lý một khoảng chỉ số [L, R] và tổng của nó. Mọi truy vấn đoạn bất kỳ đều chỉ cần duyệt qua tối đa 4 node ở mỗi tầng, mang lại độ phức tạp O(log N) cho cả thao tác truy vấn và cập nhật giá trị.",
    complexity: {
      best: "O(log N)",
      average: "O(log N)",
      worst: "O(log N)",
      space: "O(4N)",
    },
    properties: {
      stable: false,
      inPlace: false,
      dataStructure: "Binary Segment Tree",
    },
    code: {
      cpp: `void update(int node, int start, int end, int idx, int val, vector<int>& tree) {
    if (start == end) {
        tree[node] = val;
        return;
    }
    int mid = (start + end) / 2;
    if (idx <= mid) update(2 * node, start, mid, idx, val, tree);
    else update(2 * node + 1, mid + 1, end, idx, val, tree);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
      python: `def update(node, start, end, idx, val, tree):
    if start == end:
        tree[node] = val
        return
    mid = (start + end) // 2
    if idx <= mid:
        update(2 * node, start, mid, idx, val, tree)
    else:
        update(2 * node + 1, mid + 1, end, idx, val, tree)
    tree[node] = tree[2 * node] + tree[2 * node + 1]`,
      typescript: `function update(node: number, start: number, end: number, idx: number, val: number, tree: number[]): void {
  if (start === end) {
    tree[node] = val;
    return;
  }
  const mid = Math.floor((start + end) / 2);
  if (idx <= mid) update(2 * node, start, mid, idx, val, tree);
  else update(2 * node + 1, mid + 1, end, idx, val, tree);
  tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
    },
    generateSteps: () => generateSegmentTreeSteps(),
  },

  // =================== DYNAMIC PROGRAMMING ADVANCED ===================
  {
    id: "lcs",
    name: "Longest Common Subsequence (LCS)",
    category: "dp",
    shortDescription: "Tìm độ dài và chuỗi con chung dài nhất giữa hai xâu bằng Quy hoạch động ma trận 2D và truy vết ngược (thuật toán cốt lõi của Git Diff).",
    fullDescription:
      "LCS là bài toán quy hoạch động cổ điển: dp[i][j] lưu độ dài chuỗi con chung dài nhất của tiền tố xâu 1 độ dài i và tiền tố xâu 2 độ dài j. Nếu hai ký tự trùng nhau, giá trị tăng lên 1 từ đường chéo dp[i-1][j-1]; nếu khác nhau, lấy giá trị max giữa ô trên và ô trái. Sau đó, thuật toán truy vết ngược từ ô cuối để xuất chuỗi con chung.",
    complexity: {
      best: "O(M × N)",
      average: "O(M × N)",
      worst: "O(M × N)",
      space: "O(M × N)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "2D DP Table",
    },
    code: {
      cpp: `int lcs(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
      python: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
      typescript: `function lcs(s1: string, s2: string): number {
  const m = s1.length, n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,
    },
    generateSteps: () => generateLCSSteps(),
  },

  // =================== GREEDY ===================
  {
    id: "greedy-interval-scheduling",
    name: "Interval Scheduling (Tham lam)",
    category: "greedy",
    shortDescription: "Thuật toán chọn tập khoảng thời gian không giao nhau lớn nhất bằng chiến lược tham lam (Earliest Deadline First).",
    fullDescription:
      "Bài toán lập lịch khoảng thời gian (Interval Scheduling / Activity Selection) tìm tập hợp lớn nhất các công việc không trùng nhau. Chiến lược tối ưu là sắp xếp các công việc tăng dần theo thời điểm kết thúc (Finish Time) và luôn tham lam chọn công việc kết thúc sớm nhất còn khả dụng.",
    complexity: {
      best: "O(N log N)",
      average: "O(N log N)",
      worst: "O(N log N)",
      space: "O(N)",
    },
    properties: {
      dataStructure: "Interval Array",
    },
    code: {
      python: `def interval_scheduling(intervals):
    # Sắp xếp theo thời gian kết thúc tăng dần
    intervals.sort(key=lambda x: x[1])
    selected = []
    last_end = float('-inf')
    for start, end in intervals:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    return selected`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

struct Interval { int start, finish; };

bool compareInterval(Interval a, Interval b) {
    return a.finish < b.finish;
}

vector<Interval> intervalScheduling(vector<Interval>& arr) {
    sort(arr.begin(), arr.end(), compareInterval);
    vector<Interval> res;
    int last_finish = -1e9;
    for (auto& item : arr) {
        if (item.start >= last_finish) {
            res.push_back(item);
            last_finish = item.finish;
        }
    }
    return res;
}`,
      typescript: `function intervalScheduling(intervals: { start: number; finish: number }[]) {
  intervals.sort((a, b) => a.finish - b.finish);
  const selected: { start: number; finish: number }[] = [];
  let lastFinish = -Infinity;
  for (const item of intervals) {
    if (item.start >= lastFinish) {
      selected.push(item);
      lastFinish = item.finish;
    }
  }
  return selected;
}`,
    },
    generateSteps: () => generateIntervalSchedulingSteps(),
  },

  // =================== HASH TABLE ===================
  {
    id: "hash-table",
    name: "Bảng Băm (Hash Table Chaining)",
    category: "hash-table",
    shortDescription: "Cấu trúc dữ liệu ánh xạ khoá tới vị trí bucket bằng hàm băm và giải quyết xung đột bằng danh sách liên kết.",
    fullDescription:
      "Bảng băm (Hash Table) sử dụng hàm băm (h(k) = k mod M) để tính chỉ số bucket cho mỗi khoá. Khi xảy ra xung đột (collision) — hai khoá khác nhau ra cùng một bucket index — phương pháp Separate Chaining giải quyết bằng cách liên kết các phần tử thành một danh sách liên kết tại bucket đó.",
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(N)",
      space: "O(N)",
    },
    properties: {
      dataStructure: "Hash Table / Linked List",
    },
    code: {
      python: `class HashTable:
    def __init__(self, size=7):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return key % self.size

    def insert(self, key, value):
        idx = self._hash(key)
        for i, (k, v) in enumerate(self.table[idx]):
            if k == key:
                self.table[idx][i] = (key, value)
                return
        self.table[idx].append((key, value))`,
      cpp: `#include <vector>
#include <list>
using namespace std;

class HashTable {
    int size;
    vector<list<pair<int, string>>> table;
public:
    HashTable(int s = 7) : size(s), table(s) {}
    int hashFunc(int key) { return key % size; }
    void insert(int key, string val) {
        int idx = hashFunc(key);
        for (auto& p : table[idx]) {
            if (p.first == key) { p.second = val; return; }
        }
        table[idx].push_back({key, val});
    }
};`,
      typescript: `class HashTable {
  private size: number;
  private table: Array<Array<{ key: number; value: any }>>;
  constructor(size: number = 7) {
    this.size = size;
    this.table = Array.from({ length: size }, () => []);
  }
  private hash(key: number): number { return Math.abs(key) % this.size; }
  insert(key: number, value: any) {
    const idx = this.hash(key);
    const bucket = this.table[idx];
    const existing = bucket.find(item => item.key === key);
    if (existing) existing.value = value;
    else bucket.push({ key, value });
  }
}`,
    },
    generateSteps: () => generateHashTableSteps(),
  },

  // =================== HEAP ===================
  {
    id: "min-heap",
    name: "Thao Tác Min Heap (Sift Up / Down)",
    category: "heap",
    shortDescription: "Cây nhị phân hoàn chỉnh duy trì tính chất min-heap: nút cha luôn nhỏ hơn hoặc bằng các nút con.",
    fullDescription:
      "Min Heap là cây nhị phân hoàn chỉnh được biểu diễn gọn gàng dưới dạng mảng 1D (với nút cha tại i có con trái tại 2i+1, con phải tại 2i+2). Thao tác chèn (Push) thêm phần tử vào cuối và đẩy ngược lên (Sift Up). Thao tác lấy phần tử nhỏ nhất (Extract Min) đưa phần tử cuối lên gốc và sàng xuống (Sift Down).",
    complexity: {
      best: "O(1)",
      average: "O(log N)",
      worst: "O(log N)",
      space: "O(N)",
    },
    properties: {
      dataStructure: "Binary Heap (1D Array)",
    },
    code: {
      python: `import heapq

# Min Heap chuẩn trong Python
heap = []
# Chèn phần tử: O(log N)
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 6)

# Lấy giá trị nhỏ nhất: O(log N)
min_val = heapq.heappop(heap) # Trả về 1`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

// Min Heap trong C++ STL
priority_queue<int, vector<int>, greater<int>> minHeap;

void demo() {
    minHeap.push(3);
    minHeap.push(1);
    minHeap.push(6);
    int top = minHeap.top(); // 1
    minHeap.pop();
}`,
      typescript: `class MinHeap {
  private heap: number[] = [];
  push(val: number) {
    this.heap.push(val);
    this.siftUp(this.heap.length - 1);
  }
  extractMin(): number | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.siftDown(0);
    }
    return min;
  }
  private siftUp(idx: number) { /* parent <= child */ }
  private siftDown(idx: number) { /* parent <= child */ }
}`,
    },
    generateSteps: () => generateMinHeapSteps(),
  },

  // =================== NEW CORE CURRICULUM ALGORITHMS ===================
  {
    id: "linear-ops",
    name: "Thao tác Stack & Queue (LIFO / FIFO)",
    category: "stack-queue",
    shortDescription: "Minh họa trực tiếp sự khác biệt giữa Ngăn xếp LIFO (Push/Pop) và Hàng đợi FIFO (Enqueue/Dequeue) với độ phức tạp O(1).",
    fullDescription:
      "Stack (Ngăn xếp) tuân theo quy tắc Vào sau Ra trước (LIFO) và Queue (Hàng đợi) tuân theo quy tắc Vào trước Ra trước (FIFO). Đây là hai kiểu dữ liệu trừu tượng nền tảng đứng sau lời gọi hàm (Call Stack), duyệt đồ thị (DFS/BFS) và hàng đợi tác vụ.",
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(N)",
    },
    properties: {
      dataStructure: "Stack & Queue",
    },
    code: {
      python: `from collections import deque

# Stack (LIFO) dùng list
stack = []
stack.append("Task A")  # Push O(1)
top = stack.pop()       # Pop O(1)

# Queue (FIFO) dùng deque để popleft O(1)
queue = deque()
queue.append("Task A")  # Enqueue O(1)
front = queue.popleft() # Dequeue O(1)`,
      cpp: `#include <stack>
#include <queue>
#include <string>
using namespace std;

void demo() {
    stack<string> st;
    st.push("Task A"); st.pop();

    queue<string> q;
    q.push("Task A"); q.pop();
}`,
      typescript: `const stack: string[] = [];
stack.push("Task A"); // O(1)
const popped = stack.pop(); // O(1)

const queue: string[] = [];
queue.push("Task A"); // Enqueue
const front = queue.shift(); // Dequeue (nên dùng Circular Buffer / Deque để đạt O(1))`,
    },
    generateSteps: () => generateLinearOpsSteps(),
  },
  {
    id: "counting-sort",
    name: "Counting Sort",
    category: "sorting",
    shortDescription: "Thuật toán sắp xếp không dùng phép so sánh, đếm tần suất xuất hiện để đạt độ phức tạp tuyến tính O(N + K).",
    fullDescription:
      "Khác với Merge Sort hay Quick Sort bị chặn bởi giới hạn dưới O(N log N) của sắp xếp so sánh, Counting Sort đếm số lần xuất hiện của mỗi giá trị nguyên trong miền [0..K] rồi điền trực tiếp kết quả về mảng trong O(N + K).",
    complexity: {
      best: "O(N + K)",
      average: "O(N + K)",
      worst: "O(N + K)",
      space: "O(N + K)",
    },
    properties: {
      stable: true,
      inPlace: false,
      dataStructure: "Array + Count Array",
    },
    defaultArray: [4, 2, 2, 8, 3, 3, 1, 7],
    code: {
      python: `def counting_sort(arr):
    if not arr: return []
    k = max(arr)
    count = [0] * (k + 1)
    for x in arr:
        count[x] += 1
    res = []
    for val, c in enumerate(count):
        res.extend([val] * c)
    return res`,
      cpp: `vector<int> countingSort(vector<int>& arr) {
    if (arr.empty()) return {};
    int k = *max_element(arr.begin(), arr.end());
    vector<int> count(k + 1, 0);
    for (int x : arr) count[x]++;
    vector<int> res;
    for (int v = 0; v <= k; v++)
        while (count[v]--) res.push_back(v);
    return res;
}`,
      typescript: `function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return [];
  const k = Math.max(...arr);
  const count = new Array(k + 1).fill(0);
  for (const x of arr) count[x]++;
  const res: number[] = [];
  for (let v = 0; v <= k; v++) {
    while (count[v]-- > 0) res.push(v);
  }
  return res;
}`,
    },
    generateSteps: (config) => generateCountingSortSteps(config?.array || [4, 2, 2, 8, 3, 3, 1, 7]),
  },
  {
    id: "hash-open-addressing",
    name: "Bảng Băm — Open Addressing (Linear Probing)",
    category: "hash-table",
    shortDescription: "Giải quyết xung đột ngay bên trong mảng bảng băm bằng cách dò tuyến tính sang các ô trống kế tiếp.",
    fullDescription:
      "Thay vì tạo danh sách liên kết ở mỗi bucket như Separate Chaining, phương pháp Open Addressing (Linear Probing) lưu mọi phần tử trực tiếp trong mảng kích thước M. Khi xảy ra xung đột tại h(k), thuật toán dò lần lượt (h(k) + 1) mod M, (h(k) + 2) mod M cho đến khi gặp ô trống.",
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(N)",
      space: "O(M)",
    },
    properties: {
      dataStructure: "Flat Array Hash Table",
    },
    code: {
      python: `class LinearProbingHashTable:
    def __init__(self, m=7):
        self.m = m
        self.keys = [None] * m

    def insert(self, key):
        idx = key % self.m
        while self.keys[idx] is not None:
            if self.keys[idx] == key: return
            idx = (idx + 1) % self.m
        self.keys[idx] = key`,
      cpp: `class LinearProbingHashTable {
    int m;
    vector<int> slots;
public:
    LinearProbingHashTable(int size = 7) : m(size), slots(size, -1) {}
    void insert(int key) {
        int idx = key % m;
        while (slots[idx] != -1 && slots[idx] != key)
            idx = (idx + 1) % m;
        slots[idx] = key;
    }
};`,
      typescript: `class LinearProbingHashTable {
  private slots: (number | null)[];
  constructor(private m = 7) {
    this.slots = Array(m).fill(null);
  }
  insert(key: number) {
    let idx = key % this.m;
    while (this.slots[idx] !== null && this.slots[idx] !== key) {
      idx = (idx + 1) % this.m;
    }
    this.slots[idx] = key;
  }
}`,
    },
    generateSteps: () => generateHashOpenAddressingSteps(),
  },
  {
    id: "tree-traversals",
    name: "Duyệt Cây Nhị Phân (Tree Traversals)",
    category: "tree",
    shortDescription: "4 phép duyệt kinh điển trên cây nhị phân: In-Order, Pre-Order, Post-Order (DFS) và Level-Order (BFS).",
    fullDescription:
      "Duyệt cây nhị phân là nền tảng để xử lý mọi bài toán trên cây. Duyệt theo chiều sâu gồm Pre-order (Nút-Trái-Phải), In-order (Trái-Nút-Phải — cho dãy tăng dần trên BST), Post-order (Trái-Phải-Nút); còn duyệt theo chiều rộng Level-order sử dụng Queue để đi từng tầng.",
    complexity: {
      best: "O(N)",
      average: "O(N)",
      worst: "O(N)",
      space: "O(H)",
    },
    properties: {
      dataStructure: "Binary Tree",
    },
    defaultTreeValues: [50, 30, 70, 20, 40, 60, 80],
    code: {
      python: `def inorder(node, res):
    if not node: return
    inorder(node.left, res)
    res.append(node.val)
    inorder(node.right, res)

from collections import deque
def level_order(root):
    if not root: return []
    q, res = deque([root]), []
    while q:
        curr = q.popleft()
        res.append(curr.val)
        if curr.left: q.append(curr.left)
        if curr.right: q.append(curr.right)
    return res`,
      cpp: `void inorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    inorder(root->left, res);
    res.push_back(root->val);
    inorder(root->right, res);
}`,
      typescript: `function inorder(node: TreeNode | null, res: number[] = []): number[] {
  if (!node) return res;
  inorder(node.left, res);
  res.push(node.val);
  inorder(node.right, res);
  return res;
}`,
    },
    generateSteps: (config) => generateTreeTraversalSteps(config?.treeValues || [50, 30, 70, 20, 40, 60, 80]),
  },
  {
    id: "bellman-ford",
    name: "Bellman-Ford Shortest Path",
    category: "graph",
    shortDescription: "Tìm đường đi ngắn nhất từ 1 đỉnh trên đồ thị có cả cạnh trọng số ÂM và phát hiện chu trình âm.",
    fullDescription:
      "Không giống Dijkstra vốn thất bại khi gặp cạnh âm, Bellman-Ford thực hiện V - 1 lượt nới lỏng (Relaxation) qua tất cả E cạnh. Nhờ đó thuật toán xử lý chính xác trọng số âm và dùng thêm lượt thứ V để phát hiện chu trình âm (Negative Cycle).",
    complexity: {
      best: "O(E)",
      average: "O(V · E)",
      worst: "O(V · E)",
      space: "O(V)",
    },
    properties: {
      dataStructure: "Weighted Directed Graph",
    },
    defaultGraph: defaultBellmanFordGraph,
    code: {
      python: `def bellman_ford(V, edges, src):
    dist = [float('inf')] * V
    dist[src] = 0
    for _ in range(V - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated: break
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return None # Negative cycle detected
    return dist`,
      cpp: `vector<int> bellmanFord(int V, vector<tuple<int,int,int>>& edges, int src) {
    vector<int> dist(V, 1e9);
    dist[src] = 0;
    for (int i = 0; i < V - 1; i++) {
        for (auto& [u, v, w] : edges) {
            if (dist[u] < 1e9 && dist[u] + w < dist[v])
                dist[v] = dist[u] + w;
        }
    }
    return dist;
}`,
      typescript: `function bellmanFord(V: number, edges: [number, number, number][], src: number): number[] | null {
  const dist = Array(V).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i < V - 1; i++) {
    let updated = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        updated = true;
      }
    }
    if (!updated) break;
  }
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return null;
  }
  return dist;
}`,
    },
    generateSteps: (config) => generateBellmanFordSteps(config?.graph || defaultBellmanFordGraph, "S"),
  },
  {
    id: "dp-1d",
    name: "Quy hoạch động 1D (Climbing Stairs)",
    category: "dp",
    shortDescription: "Bài học nhập môn Quy hoạch động: tối ưu từ đệ quy mũ O(2^N) xuống tuyến tính O(N) bằng bảng 1 chiều.",
    fullDescription:
      "Climbing Stairs (Leo cầu thang) là bài toán kinh điển nhất để hiểu bản chất Quy hoạch động (Dynamic Programming): chia nhỏ bài toán thành các bài toán con gối nhau (dp[i] = dp[i-1] + dp[i-2]) và lưu lại kết quả thay vì tính lặp đi lặp lại.",
    complexity: {
      best: "O(N)",
      average: "O(N)",
      worst: "O(N)",
      space: "O(N) → O(1)",
    },
    properties: {
      dataStructure: "1D DP Array",
    },
    code: {
      python: `def climb_stairs(n):
    if n <= 1: return 1
    dp = [0] * (n + 1)
    dp[0], dp[1] = 1, 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
      cpp: `int climbStairs(int n) {
    if (n <= 1) return 1;
    vector<int> dp(n + 1, 0);
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}`,
      typescript: `function climbStairs(n: number): number {
  if (n <= 1) return 1;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
    },
    generateSteps: () => generateDp1DSteps(8),
  },
];

export const CATEGORIES: { id: AlgorithmCategory | "all"; name: string; count: number }[] = [
  { id: "all", name: "Tất cả", count: ALGORITHMS.length },
  { id: "sorting", name: "Sorting (Sắp xếp)", count: ALGORITHMS.filter((a) => a.category === "sorting").length },
  { id: "searching", name: "Searching (Tìm kiếm)", count: ALGORITHMS.filter((a) => a.category === "searching").length },
  { id: "graph", name: "Graph (Đồ thị)", count: ALGORITHMS.filter((a) => a.category === "graph").length },
  { id: "array", name: "Array & Window", count: ALGORITHMS.filter((a) => a.category === "array").length },
  { id: "tree", name: "Tree (Cây BST, AVL, Segment)", count: ALGORITHMS.filter((a) => a.category === "tree").length },
  { id: "string", name: "String & Trie (Chuỗi)", count: ALGORITHMS.filter((a) => a.category === "string").length },
  { id: "pathfinding", name: "Pathfinding (Mê cung 2D)", count: ALGORITHMS.filter((a) => a.category === "pathfinding").length },
  { id: "linked-list", name: "Linked List (DS Liên kết)", count: ALGORITHMS.filter((a) => a.category === "linked-list").length },
  { id: "stack-queue", name: "Stack & Queue", count: ALGORITHMS.filter((a) => a.category === "stack-queue").length },
  { id: "hash-table", name: "Hash Table (Bảng băm)", count: ALGORITHMS.filter((a) => a.category === "hash-table").length },
  { id: "heap", name: "Heap (Đống nhị phân)", count: ALGORITHMS.filter((a) => a.category === "heap").length },
  { id: "greedy", name: "Greedy (Thuật toán tham lam)", count: ALGORITHMS.filter((a) => a.category === "greedy").length },
  { id: "dp", name: "Quy hoạch động (DP)", count: ALGORITHMS.filter((a) => a.category === "dp").length },
  { id: "backtracking", name: "Quay lui (Backtracking)", count: ALGORITHMS.filter((a) => a.category === "backtracking").length },
];

export function getAlgorithmById(id: string): Algorithm | undefined {
  return ALGORITHMS.find((alg) => alg.id === id);
}

export function getAlgorithmsByCategory(category: AlgorithmCategory | "all"): Algorithm[] {
  if (category === "all") return ALGORITHMS;
  return ALGORITHMS.filter((alg) => alg.category === category);
}
