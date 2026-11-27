import { CourseChapterMeta, CourseLesson } from "./types";
import { LESSONS_CH00_CH01 } from "./lessons/ch00_ch01";
import { LESSONS_CH02_CH03 } from "./lessons/ch02_ch03";
import { LESSONS_CH04_CH05_CH06 } from "./lessons/ch04_ch05_ch06";
import { LESSONS_CH07 } from "./lessons/ch07";
import { LESSONS_CH08_CH09_CH10 } from "./lessons/ch08_ch09_ch10";

export const ALL_COURSE_LESSONS: CourseLesson[] = [
  ...LESSONS_CH00_CH01,
  ...LESSONS_CH02_CH03,
  ...LESSONS_CH04_CH05_CH06,
  ...LESSONS_CH07,
  ...LESSONS_CH08_CH09_CH10,
];

export const COURSE_CHAPTERS: CourseChapterMeta[] = [
  {
    id: "chapter-00-foundations",
    number: 0,
    code: "00",
    title: "Nhập môn & Tư duy Giải thuật",
    englishTitle: "Course Intro & Foundations",
    chapterIntro: {
      goal: "Xây dựng bộ khung tư duy chuẩn khoa học máy tính trước khi viết bất kỳ thuật toán nào.",
      whyLearn:
        "Theo MIT 6.006 & OpenDSA, nếu chưa hiểu cách RAM lưu trữ ô nhớ, cách đếm số bước Big-O và cơ chế Call Stack của đệ quy, người học rất dễ học vẹt và bế tắc khi sang Cây, Đồ thị, Quy hoạch động.",
      keyTakeaways: [
        "Lộ trình 4 chặng bắt buộc (Lý thuyết → Demo → Thực hành → Code & Pass).",
        "Tại sao truy cập mảng tốn O(1) nhưng chèn đầu mảng tốn O(N).",
        "Đọc hiểu & phân biệt nhanh các mức Big-O từ O(1) đến O(2^N).",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã nắm vững mô hình bộ nhớ RAM, khái niệm ADT, cách đánh giá hiệu năng bằng Big-O và tư duy Chia để trị bằng đệ quy.",
      comparisonNotes: [
        "O(1) < O(log N) < O(N) < O(N log N) < O(N²) < O(2^N).",
        "Mọi hàm đệ quy bắt buộc phải có Base Case thu hẹp đầu vào.",
      ],
    },
    lessonIds: ["course-intro", "memory-ram-adt", "big-o-complexity", "recursion-divide-conquer"],
  },
  {
    id: "chapter-01-arrays-searching",
    number: 1,
    code: "01",
    title: "Tìm kiếm & Kỹ thuật Mảng",
    englishTitle: "Searching & Array Techniques",
    chapterIntro: {
      goal: "Làm chủ các kỹ thuật khai thác tối đa cấu trúc mảng để cắt giảm độ phức tạp từ O(N²) xuống O(N) hoặc O(log N).",
      whyLearn: "Mảng là cấu trúc dữ liệu phổ biến nhất trong mọi ngôn ngữ lập trình và chiếm hơn 40% các bài phỏng vấn cơ bản đến trung bình.",
      keyTakeaways: [
        "Chặt đôi không gian tìm kiếm với Binary Search O(log N).",
        "Loại bỏ vòng lặp lồng nhau bằng Two Pointers & Sliding Window.",
        "Thuật toán Kadane O(N) cho bài toán mảng con tổng lớn nhất.",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã biết cách chọn Linear Search khi mảng chưa sort, Binary Search/Two Pointers khi có tính đơn điệu, Sliding Window cho đoạn k liên tiếp và Kadane khi có số âm.",
      comparisonNotes: [
        "Linear Search O(N) không cần sắp xếp vs Binary Search O(log N) cần mảng tăng dần.",
        "Sliding Window (kích thước cố định/động) vs Kadane's DP O(N)/O(1).",
      ],
    },
    lessonIds: ["linear-search", "binary-search", "two-sum", "sliding-window", "kadane"],
  },
  {
    id: "chapter-02-linear-structures",
    number: 2,
    code: "02",
    title: "Cấu trúc Dữ liệu Tuyến tính",
    englishTitle: "Linked Lists, Stacks & Queues",
    chapterIntro: {
      goal: "Thành thạo thao tác con trỏ bộ nhớ rời rạc (Linked List) và hai giao diện LIFO/FIFO cốt lõi (Stack & Queue).",
      whyLearn: "Con trỏ của Linked List là bước đệm trực tiếp để hiểu Cây và Đồ thị; còn Stack/Queue đứng sau DFS, BFS và bộ phân tích cú pháp.",
      keyTakeaways: [
        "Phân biệt quy tắc vào-ra của Stack (LIFO) và Queue (FIFO).",
        "Kỹ thuật 3 con trỏ đảo ngược danh sách tại chỗ O(1).",
        "Thuật toán Rùa & Thỏ phát hiện chu trình bộ nhớ O(1).",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã kiểm soát tốt con trỏ next trong Linked List và biết ứng dụng Stack kiểm tra ngoặc lồng nhau.",
      comparisonNotes: [
        "Linked List chèn/xóa đầu O(1) nhưng truy cập ngẫu nhiên O(N) — ngược với Mảng.",
        "Stack LIFO vs Queue FIFO.",
      ],
    },
    lessonIds: ["linear-ops", "reverse-linked-list", "floyd-cycle", "valid-parentheses"],
  },
  {
    id: "chapter-03-sorting",
    number: 3,
    code: "03",
    title: "Sắp xếp & Chia để trị",
    englishTitle: "Sorting Algorithms",
    chapterIntro: {
      goal: "So sánh toàn diện từ các thuật toán sắp xếp sơ cấp O(N²) đến Chia để trị O(N log N) và Sắp xếp đếm tuyến tính O(N + K).",
      whyLearn: "Theo MIT 6.006 & Princeton Ch.2, sắp xếp là bài toán kinh điển nhất để rèn tư duy tối ưu thuật toán, tính ổn định (Stability) và chia để trị.",
      keyTakeaways: [
        "Tại sao Insertion Sort được dùng cho mảng con nhỏ trong Timsort/Introsort.",
        "Merge Sort (ổn định, O(N log N) an toàn) vs Quick Sort (tại chỗ, cực nhanh thực tế).",
        "Phá vỡ cận dưới Ω(N log N) bằng Counting Sort không so sánh.",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã hiểu rõ bản chất và trade-off của 6 thuật toán sắp xếp quan trọng nhất.",
      comparisonNotes: [
        "Bubble / Selection / Insertion: O(N²), In-place O(1); Insertion đạt O(N) khi gần đúng thứ tự.",
        "Merge Sort O(N log N) Stable / O(N) Space vs Quick Sort O(N log N) avg / O(log N) Stack.",
        "Counting Sort O(N + K) không so sánh khi miền giá trị K nhỏ.",
      ],
    },
    lessonIds: ["bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort", "counting-sort"],
  },
  {
    id: "chapter-04-hashing",
    number: 4,
    code: "04",
    title: "Bảng Băm (Hash Tables)",
    englishTitle: "Hashing & Collision Resolution",
    chapterIntro: {
      goal: "Hiểu cơ chế biến tra cứu dữ liệu thành O(1) kỳ vọng và hai phương pháp xử lý xung đột kinh điển.",
      whyLearn: "Hash Table là cấu trúc dữ liệu được sử dụng thường xuyên nhất trong thực tế lập trình (Map, Set, Dict, Cache).",
      keyTakeaways: [
        "Vai trò của Hàm băm (Hash Function) và Hệ số tải (Load Factor α).",
        "Xử lý xung đột bằng Separate Chaining vs Open Addressing (Linear Probing).",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã nắm vững cách hoạt động bên dưới các cấu trúc Map/Dict và biết lưu ý về Tombstone khi xóa phần tử.",
      comparisonNotes: [
        "Separate Chaining: dùng danh sách liên kết, chịu tải α > 1.",
        "Linear Probing: mảng phẳng cache-friendly, cẩn thận hiện tượng Primary Clustering.",
      ],
    },
    lessonIds: ["hash-table", "hash-open-addressing"],
  },
  {
    id: "chapter-05-trees",
    number: 5,
    code: "05",
    title: "Cây Nhị Phân & Cây Cân Bằng",
    englishTitle: "Trees & Balanced Search Trees",
    chapterIntro: {
      goal: "Làm chủ cấu trúc phân cấp cây: từ 4 phép duyệt cơ bản đến BST, Cây tự cân bằng AVL và Cây phân đoạn.",
      whyLearn: "Cây cho phép vừa tìm kiếm nhanh O(log N), vừa chèn/xóa linh hoạt và xử lý dữ liệu phân cấp (DOM, SQL Index, Range Queries).",
      keyTakeaways: [
        "In-Order, Pre-Order, Post-Order và Level-Order.",
        "Tại sao BST thường có thể suy biến thành O(N) và cách AVL Tree giải quyết bằng 4 phép xoay.",
        "Segment Tree giải bài toán cập nhật + truy vấn đoạn [L..R] trong O(log N).",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã thông thạo thao tác đệ quy trên cây và cơ chế giữ cân bằng chiều cao O(log N).",
      comparisonNotes: [
        "BST thường: dễ viết nhưng worst-case O(N) nếu dữ liệu tăng dần.",
        "AVL Tree: khóa chặt O(log N) bằng Balance Factor ∈ {-1, 0, 1}.",
      ],
    },
    lessonIds: ["tree-traversals", "bst", "avl-tree", "segment-tree"],
  },
  {
    id: "chapter-06-heaps",
    number: 6,
    code: "06",
    title: "Đống Nhị Phân & Hàng Đợi Ưu Tiên",
    englishTitle: "Heaps & Priority Queues",
    chapterIntro: {
      goal: "Biểu diễn cây nhị phân hoàn chỉnh trên mảng 1D để lấy Min/Max tức thì và sắp xếp tại chỗ O(N log N).",
      whyLearn: "Priority Queue (Heap) là thành phần bắt buộc để tăng tốc Dijkstra, A*, Prim và các bài toán Top-K.",
      keyTakeaways: [
        "Công thức cha-con trên mảng 1D: 2i+1 và 2i+2.",
        "Hai thao tác cốt lõi Sift Up (Push) và Sift Down (Extract Min).",
        "Heap Sort đạt O(N log N) mọi trường hợp với O(1) bộ nhớ phụ.",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã làm chủ hoàn toàn cơ chế vun đống và thấy rõ sự kết hợp tuyệt vời giữa Heap Sort và Quick Sort trong Introsort.",
      comparisonNotes: [
        "Min Heap: Peek Min O(1), Push/Pop O(log N), Build Heap O(N).",
        "Heap Sort: O(N log N) mọi case + O(1) Space nhưng không ổn định.",
      ],
    },
    lessonIds: ["min-heap", "heap-sort"],
  },
  {
    id: "chapter-07-graphs",
    number: 7,
    code: "07",
    title: "Đồ Thị & Đường Đi Ngắn Nhất",
    englishTitle: "Graphs & Shortest Paths",
    chapterIntro: {
      goal: "Mô hình hóa mạng lưới đa chiều và giải quyết trọn vẹn các bài toán Duyệt, Topo, Cây khung nhỏ nhất và Đường đi ngắn nhất.",
      whyLearn: "Theo MIT Module 3 & Princeton Ch.4, Đồ thị là công cụ mạnh nhất để mô hình hóa bản đồ, mạng xã hội, phụ thuộc công việc và mạng máy tính.",
      keyTakeaways: [
        "BFS (tầng lớp, ngắn nhất không trọng số) vs DFS (sâu, chu trình, liên thông).",
        "Topological Sort (Kahn's Algorithm) và Kruskal MST + Union-Find (DSU).",
        "Dijkstra (cạnh ≥ 0) vs Bellman-Ford (hỗ trợ cạnh âm) vs A* (Heuristic).",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã sở hữu trọn bộ công cụ xử lý đồ thị từ cơ bản đến nâng cao chuẩn đại học.",
      comparisonNotes: [
        "Không trọng số → BFS O(V+E); Trọng số dương → Dijkstra O((V+E)log V); Có cạnh âm → Bellman-Ford O(V·E); Có đích & tọa độ → A*.",
      ],
    },
    lessonIds: ["bfs", "dfs", "topological-sort", "kruskal-dsu", "dijkstra", "bellman-ford", "a-star"],
  },
  {
    id: "chapter-08-paradigms",
    number: 8,
    code: "08",
    title: "Chiến Lược Thiết Kế Thuật Toán",
    englishTitle: "Greedy, Backtracking & Dynamic Programming",
    chapterIntro: {
      goal: "Phân biệt và làm chủ 3 mô thức giải quyết bài toán tối ưu & tổ hợp lớn nhất trong Khoa học Máy tính.",
      whyLearn: "Biết khi nào bài toán có thể Tham lam ngay lập tức, khi nào buộc phải Quay lui thử-sai, và khi nào cần Quy hoạch động ghi nhớ bài toán con.",
      keyTakeaways: [
        "Greedy Choice Property với bài toán Interval Scheduling.",
        "Backtracking (Choose → Explore → Unchoose) với N-Queens.",
        "Dynamic Programming từ 1D (Coin Change / Stairs) đến 2D (0/1 Knapsack, LCS).",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã chuyển từ học thuật toán riêng lẻ sang tư duy thiết kế thuật toán cho các bài toán chưa từng gặp.",
      comparisonNotes: [
        "Tham lam: chọn cục bộ tối ưu không quay lại (nhanh nhất nhưng ít bài thỏa mãn).",
        "Quay lui: thử mọi khả năng + tỉa nhánh.",
        "Quy hoạch động: ghi nhớ bài toán con gối nhau trên DAG.",
      ],
    },
    lessonIds: ["greedy-interval-scheduling", "n-queens", "dp-1d", "knapsack-01", "lcs"],
  },
  {
    id: "chapter-09-strings",
    number: 9,
    code: "09",
    title: "Xử Lý Chuỗi Nâng Cao",
    englishTitle: "String Matching & Prefix Trees",
    chapterIntro: {
      goal: "Xây dựng cấu trúc từ điển tra cứu tiền tố O(L) và thuật toán tìm kiếm mẫu chuỗi tuyến tính O(N + M).",
      whyLearn: "Xử lý văn bản quy mô lớn (Autocomplete, Search Engine, Sinh tin học) đòi hỏi cấu trúc chuyên biệt ngoài mảng thông thường.",
      keyTakeaways: [
        "Trie gộp chung tiền tố để Autocomplete không phụ thuộc số lượng từ.",
        "KMP dùng mảng LPS để không bao giờ phải lùi con trỏ văn bản.",
      ],
    },
    chapterSummary: {
      recap: "Bạn đã hoàn thành toàn bộ các chuyên đề cấu trúc dữ liệu và giải thuật cốt lõi!",
      comparisonNotes: [
        "Trie O(L) hỗ trợ Prefix search vs Hash Table O(L) chỉ khớp nguyên từ.",
        "KMP O(N + M) vs Brute-Force O(N · M).",
      ],
    },
    lessonIds: ["trie", "kmp"],
  },
  {
    id: "chapter-10-capstone",
    number: 10,
    code: "10",
    title: "Tổng kết & Tốt nghiệp Khóa học",
    englishTitle: "Course Wrap-up & Interview Guide",
    chapterIntro: {
      goal: "Hệ thống hóa toàn bộ 42 bài học thành bản đồ phản xạ nhanh khi gặp đề bài mới.",
      whyLearn: "Một kỹ sư giỏi không chỉ biết thuật toán, mà biết chẩn đoán đầu vào để chọn đúng vũ khí trong 5 phút đầu tiên.",
      keyTakeaways: [
        "Suy ngược độ phức tạp cho phép từ ràng buộc N.",
        "Bản đồ tra cứu mẫu bài tập phỏng vấn Big Tech.",
      ],
    },
    chapterSummary: {
      recap: "Hoàn tất 100% Khóa học Cấu trúc Dữ liệu & Giải thuật toàn diện!",
      comparisonNotes: ["Chúc mừng bạn đã chinh phục trọn vẹn lộ trình từ Chương 00 đến Chương 10."],
    },
    lessonIds: ["course-capstone"],
  },
];

export function getLessonById(id: string): CourseLesson | undefined {
  return ALL_COURSE_LESSONS.find((l) => l.id === id);
}

export function getChapterForLesson(lessonId: string): CourseChapterMeta | undefined {
  return COURSE_CHAPTERS.find((c) => c.lessonIds.includes(lessonId));
}

export function getOrderedCourseLessons(): CourseLesson[] {
  const ordered: CourseLesson[] = [];
  for (const ch of COURSE_CHAPTERS) {
    for (const id of ch.lessonIds) {
      const lesson = getLessonById(id);
      if (lesson) ordered.push(lesson);
    }
  }
  return ordered;
}

export function isCourseLessonUnlocked(lessonId: string, passedIds: string[]): boolean {
  if (passedIds.includes(lessonId)) return true;
  const ordered = getOrderedCourseLessons();
  const idx = ordered.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true; // First lesson 00.1 is always unlocked!
  const prevId = ordered[idx - 1].id;
  return passedIds.includes(prevId);
}

export function getCourseFrontierLesson(passedIds: string[]): CourseLesson {
  const ordered = getOrderedCourseLessons();
  return ordered.find((l) => !passedIds.includes(l.id)) || ordered[0];
}

export function getCourseNavigationContext(lessonId: string) {
  const ordered = getOrderedCourseLessons();
  const idx = ordered.findIndex((l) => l.id === lessonId);
  const current = idx !== -1 ? ordered[idx] : null;
  const chapter = getChapterForLesson(lessonId);
  const indexInChapter = chapter ? chapter.lessonIds.indexOf(lessonId) + 1 : 0;

  return {
    current,
    chapter,
    indexInChapter,
    prev: idx > 0 ? ordered[idx - 1] : null,
    next: idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null,
    totalLessons: ordered.length,
    currentIndex: idx + 1,
  };
}
