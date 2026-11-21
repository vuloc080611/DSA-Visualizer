import { Algorithm, AlgorithmCategory } from "../types";
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps,
} from "./sorting";
import { generateLinearSearchSteps, generateBinarySearchSteps } from "./searching";
import { generateBFSSteps, generateDFSSteps, defaultGraphData } from "./graph";
import { generateTwoSumSteps, generateSlidingWindowSteps, generateKadaneSteps } from "./array";

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
];

export const CATEGORIES: { id: AlgorithmCategory | "all"; name: string; count: number }[] = [
  { id: "all", name: "Tất cả", count: ALGORITHMS.length },
  { id: "sorting", name: "Sorting (Sắp xếp)", count: ALGORITHMS.filter((a) => a.category === "sorting").length },
  { id: "searching", name: "Searching (Tìm kiếm)", count: ALGORITHMS.filter((a) => a.category === "searching").length },
  { id: "graph", name: "Graph (Đồ thị)", count: ALGORITHMS.filter((a) => a.category === "graph").length },
  { id: "array", name: "Array & Window", count: ALGORITHMS.filter((a) => a.category === "array").length },
];

export function getAlgorithmById(id: string): Algorithm | undefined {
  return ALGORITHMS.find((alg) => alg.id === id);
}

export function getAlgorithmsByCategory(category: AlgorithmCategory | "all"): Algorithm[] {
  if (category === "all") return ALGORITHMS;
  return ALGORITHMS.filter((alg) => alg.category === category);
}
