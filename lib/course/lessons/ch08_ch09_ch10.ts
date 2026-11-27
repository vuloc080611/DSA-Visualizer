import { CourseLesson } from "../types";

export const LESSONS_CH08_CH09_CH10: CourseLesson[] = [
  // =================== CHƯƠNG 08: CHIẾN LƯỢC THIẾT KẾ THUẬT TOÁN ===================
  {
    id: "greedy-interval-scheduling",
    code: "08.1",
    chapterId: "chapter-08-paradigms",
    kind: "algorithm",
    algorithmId: "greedy-interval-scheduling",
    title: "Greedy — Interval Scheduling (Lập lịch Tối ưu)",
    subtitle: "Hiểu tính chất Greedy Choice Property qua bài toán chọn nhiều hoạt động không chồng chéo nhất.",
    theory: {
      problemAndApplications:
        "Cho danh sách N cuộc họp với thời điểm bắt đầu và kết thúc `[start, end]`. Chỉ có một phòng họp duy nhất — hãy chọn ra SỐ LƯỢNG CUỘC HỌP NHIỀU NHẤT không bị trùng thời gian.",
      realWorldApps: [
        "Lập lịch tiến trình CPU (Earliest Deadline First), phân bổ phòng học, lịch chiếu rạp và băng thông vệ tinh.",
      ],
      coreIntuition:
        "Đừng chọn cuộc họp ngắn nhất hay cuộc họp bắt đầu sớm nhất (đều có phản ví dụ sai!). Mẹo vàng là chọn cuộc họp **KẾT THÚC SỚM NHẤT** — vì kết thúc càng sớm thì quỹ thời gian còn trống để nhét thêm các cuộc họp phía sau càng lớn!",
      mechanismSteps: [
        "Sắp xếp tất cả các khoảng `[start, end]` theo `end` tăng dần (O(N log N)).",
        "Khởi tạo `lastEnd = -Infinity`, `count = 0`.",
        "Duyệt qua từng cuộc họp đã sắp xếp: nếu `start >= lastEnd` (không trùng) → chọn nó, tăng `count++` và cập nhật `lastEnd = end`.",
      ],
      loopInvariant:
        "Bằng phương pháp chứng minh đổi chỗ (Exchange Argument — CLRS Ch.16.1): mọi lịch tối ưu luôn có thể hoán đổi cuộc họp đầu tiên bằng cuộc họp kết thúc sớm nhất mà vẫn tối ưu.",
      complexityDeepDive: {
        timeExplanation: "Chi phí sắp xếp khoảng thời gian là O(N log N), vòng lặp tham lam duyệt tuyến tính mất O(N) → Tổng O(N log N).",
        spaceExplanation: "O(1) đến O(N) tùy ngôn ngữ cho thao tác Sort.",
        best: "O(N log N)",
        average: "O(N log N)",
        worst: "O(N log N)",
        space: "O(1) .. O(N)",
      },
      edgeCasesAndPitfalls: [
        "Sai lầm phổ biến nhất: Sắp xếp theo `start` tăng dần hoặc theo độ dài `end - start` nhỏ nhất — cả hai đều cho đáp án SAI ở một số đầu vào!",
        "Lưu ý quy ước chạm biên `start === lastEnd`: thông thường cho phép nối tiếp không tính trùng (`>=`).",
      ],
      tradeOffs: [
        "Tham lam cực nhanh O(N log N), nhưng CHỈ áp dụng được khi mọi cuộc họp có trọng số bằng nhau; nếu mỗi cuộc họp mang lại lợi nhuận tiền khác nhau (Weighted Interval Scheduling), phải chuyển sang **Quy hoạch động**!",
      ],
      references: ["CLRS — Chapter 16.1 (An Activity-Selection Problem)", "Kleinberg & Tardos — Algorithm Design Ch.4 (Greedy)"],
    },
    quizQuestions: [
      {
        id: "gr-q1",
        question: "Trong bài toán Interval Scheduling (chọn tối đa các hoạt động không trùng nhau), tiêu chí tham lam ĐÚNG DUY NHẤT để sắp xếp trước khi duyệt là gì?",
        options: [
          "Thời điểm bắt đầu (start) sớm nhất",
          "Thời lượng (end - start) ngắn nhất",
          "Thời điểm kết thúc (end) sớm nhất",
          "Giữ nguyên thứ tự đầu vào",
        ],
        correctIndex: 2,
        explanation: "Chọn hoạt động kết thúc sớm nhất luôn giải phóng tài nguyên nhanh nhất có thể để nhường chỗ cho tối đa hoạt động kế tiếp.",
      },
    ],
    codeChallenge: {
      title: "Chọn Tối Đa Khoảng Thời Gian Không Giao Nhau",
      prompt:
        "Cho mảng `intervals` gồm các cặp `[start, end]`. Viết hàm `maxNonOverlappingIntervals(intervals)` trả về số lượng tối đa các khoảng không chồng chéo nhau (được phép chạm biên `start >= lastEnd`).",
      functionName: "maxNonOverlappingIntervals",
      starterCode: `function maxNonOverlappingIntervals(intervals) {
  if (intervals.length === 0) return 0;
  // TODO: Sắp xếp theo end tăng dần rồi tham lam chọn
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  
  return 0;
}`,
      solutionCode: `function maxNonOverlappingIntervals(intervals) {
  if (intervals.length === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }
  return count;
}`,
      hints: ["So sánh `start >= lastEnd`, nếu thỏa mãn thì `count++` và cập nhật `lastEnd = end`."],
      testCases: [
        { name: "Nhiều khoảng xen kẽ", inputArgs: [[[1, 4], [2, 3], [3, 5], [0, 6], [5, 7]]], expected: 3 },
        { name: "Chạm biên liên tiếp", inputArgs: [[[1, 2], [2, 3], [3, 4]]], expected: 3 },
        { name: "Chồng chéo hoàn toàn", inputArgs: [[[1, 5], [2, 6], [3, 7]]], expected: 1 },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[]], expected: 0, isEdgeCase: true },
      ],
    },
  },

  {
    id: "n-queens",
    code: "08.2",
    chapterId: "chapter-08-paradigms",
    kind: "algorithm",
    algorithmId: "n-queens",
    title: "Backtracking — N-Queens (Quay lui Tỉa nhánh)",
    subtitle: "Duyệt không gian trạng thái theo mô hình Choose → Explore → Unchoose để giải bài toán ràng buộc.",
    theory: {
      problemAndApplications:
        "Đặt N quân Hậu lên bàn cờ vua kích thước `N × N` sao cho không có hai quân nào ăn nhau (cùng hàng, cùng cột, hoặc cùng đường chéo). Bài toán mẫu mực cho kỹ thuật Quay lui (Backtracking).",
      realWorldApps: [
        "Giải các bài toán thỏa mãn ràng buộc (Constraint Satisfaction): Sudoku, xếp lịch thi, giải bài toán SAT, phân bổ tần số vô tuyến.",
      ],
      coreIntuition:
        "Đặt từng quân Hậu theo từng hàng (từ hàng 0 đến N-1). Tại mỗi hàng, thử từng cột: nếu cột hoặc đường chéo đó bị quân phía trên khống chế, **tỉa nhánh ngay lập tức** (Pruning — không đi tiếp xuống nhánh sai!). Nếu đặt được đến hàng N → tìm ra 1 nghiệm. Ngược lại, **quay lui (Backtrack)** nhấc quân Hậu vừa đặt lên và thử cột khác.",
      mechanismSteps: [
        "Theo dõi trạng thái bị chiếm trong O(1): tập `cols`, `diag1 (row - col)`, và `diag2 (row + col)`.",
        "Base Case: Nếu `row === n` → tăng số nghiệm lên 1.",
        "Vòng lặp thử từng `col = 0 .. n-1`: nếu hợp lệ → Đánh dấu (Choose) → Đệ quy `backtrack(row + 1)` (Explore) → Gỡ đánh dấu (Unchoose).",
      ],
      loopInvariant:
        "Ở độ sâu `row`, `row` quân Hậu đã đặt ở các hàng `0 .. row-1` hoàn toàn hợp lệ và không ăn nhau.",
      complexityDeepDive: {
        timeExplanation: "Chặn trên O(N!) nhờ tỉa nhánh sớm (nhanh hơn nhiều so với vét cạn N^N).",
        spaceExplanation: "Độ sâu Call Stack và các tập trạng thái tối đa là N → O(N).",
        best: "O(N!)",
        average: "O(N!)",
        worst: "O(N!)",
        space: "O(N)",
      },
      edgeCasesAndPitfalls: [
        "Quên bước **Unchoose** (gỡ bỏ cột & đường chéo khỏi Set sau khi đệ quy trả về) khiến mọi nhánh sau bị chặn oan!",
        "Với `n = 2` và `n = 3`: hoàn toàn VÔ NGHIỆM (kết quả bằng 0).",
      ],
      tradeOffs: [
        "Quay lui giải chính xác mọi bài toán tìm tất cả cấu hình / ràng buộc NP-hard với kích thước vừa phải (N ≤ 14–15).",
      ],
      references: ["Skiena — The Algorithm Design Manual (Ch.9 Backtracking)", "LeetCode 51 & 52: N-Queens"],
    },
    quizQuestions: [
      {
        id: "nq-q1",
        question: "Trong bài toán N-Queens, tại sao hai ô `(r1, c1)` và `(r2, c2)` nằm trên cùng một đường chéo chính (hoặc phụ) có thể kiểm tra trong O(1)?",
        options: [
          "Vì tổng `r + c` hoặc hiệu `r - c` của tất cả các ô trên cùng một đường chéo luôn BẰNG NHAU",
          "Vì tích `r * c` luôn bằng nhau",
          "Phải duyệt lại toàn bộ bàn cờ mới biết",
          "Chỉ cần kiểm tra `c1 === c2`",
        ],
        correctIndex: 0,
        explanation: "Mọi ô trên đường chéo phụ `/` có `row + col` hằng số; mọi ô trên đường chéo chính `\\` có `row - col` hằng số → tra cứu Set O(1)!",
      },
    ],
    codeChallenge: {
      title: "Đếm số Nghiệm bài toán N-Queens (Backtracking)",
      prompt: "Viết hàm `totalNQueens(n)` trả về tổng số cách đặt `n` quân Hậu hợp lệ trên bàn cờ `n × n` sao cho không quân nào ăn nhau.",
      functionName: "totalNQueens",
      starterCode: `function totalNQueens(n) {
  let count = 0;
  const cols = new Set();
  const diag1 = new Set(); // row - col
  const diag2 = new Set(); // row + col

  function backtrack(row) {
    if (row === n) {
      count++;
      return;
    }
    // TODO: Thử từng col từ 0 đến n - 1
    
  }

  backtrack(0);
  return count;
}`,
      solutionCode: `function totalNQueens(n) {
  let count = 0;
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();

  function backtrack(row) {
    if (row === n) {
      count++;
      return;
    }
    for (let col = 0; col < n; col++) {
      const d1 = row - col;
      const d2 = row + col;
      if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) continue;

      cols.add(col);
      diag1.add(d1);
      diag2.add(d2);

      backtrack(row + 1);

      cols.delete(col);
      diag1.delete(d1);
      diag2.delete(d2);
    }
  }

  backtrack(0);
  return count;
}`,
      hints: ["Dùng `cols`, `diag1 (row - col)`, `diag2 (row + col)`. Nhớ gọi `.delete()` ở bước quay lui (Unchoose)."],
      testCases: [
        { name: "4-Queens chuẩn", inputArgs: [4], expected: 2 },
        { name: "8-Queens kinh điển", inputArgs: [8], expected: 92 },
        { name: "Vô nghiệm (n = 3, Edge Case)", inputArgs: [3], expected: 0, isEdgeCase: true },
        { name: "n = 1 (Edge Case)", inputArgs: [1], expected: 1, isEdgeCase: true },
      ],
    },
  },

  {
    id: "dp-1d",
    code: "08.3",
    chapterId: "chapter-08-paradigms",
    kind: "algorithm",
    algorithmId: "dp-1d",
    title: "DP 1D Nhập môn — Climbing Stairs & Subproblems",
    subtitle: "Hiểu bản chất Quy hoạch động (Memoization vs Tabulation) để biến O(2^N) thành O(N).",
    theory: {
      problemAndApplications:
        "Bạn đứng trước một cầu thang có N bậc. Mỗi lần bạn có thể bước lên **1 bậc** hoặc **2 bậc**. Hỏi có bao nhiêu cách khác nhau để leo lên đỉnh bậc thứ N?",
      realWorldApps: [
        "Bài toán nhập môn tại MIT 6.006 Module 4: hiểu 2 điều kiện cốt lõi của Quy hoạch động — **Optimal Substructure** và **Overlapping Subproblems**.",
      ],
      coreIntuition:
        "Để đặt chân lên bậc thứ `i`, bước cuối cùng của bạn chỉ có thể xuất phát từ **bậc `i - 1`** (nhảy 1 bước) hoặc **bậc `i - 2`** (nhảy 2 bước)! Vậy `ways(i) = ways(i - 1) + ways(i - 2)`. Nếu dùng đệ quy ngây thơ sẽ tính lặp lại `ways(i-2)` hàng triệu lần (O(2^N)). DP lưu kết quả từng bậc vào mảng `dp[i]` để mỗi bậc chỉ tính **đúng 1 lần**!",
      mechanismSteps: [
        "Xác định trạng thái: `dp[i]` = số cách leo đến bậc `i`.",
        "Trường hợp cơ sở: `dp[0] = 1`, `dp[1] = 1`.",
        "Công thức chuyển trạng thái (Recurrence): `dp[i] = dp[i - 1] + dp[i - 2]` với `i` đi từ `2 .. N`.",
        "(Tối ưu RAM O(1)): Vì `dp[i]` chỉ phụ thuộc 2 giá trị ngay trước nó, ta chỉ cần 2 biến `prev1, prev2`!",
      ],
      loopInvariant:
        "Mọi giá trị trong mảng `dp[0..i]` sau khi tính xong đều bất biến và giải chính xác bài toán con tại bậc đó theo thứ tự Topo của DAG bài toán con (MIT 6.006 L16).",
      complexityDeepDive: {
        timeExplanation: "N bài toán con, mỗi bài toán con tốn O(1) tổng hợp → O(N).",
        spaceExplanation: "O(N) nếu giữ mảng `dp`, hoặc O(1) nếu chỉ lưu 2 biến gần nhất.",
        best: "O(N)",
        average: "O(N)",
        worst: "O(N)",
        space: "O(N) → O(1)",
      },
      edgeCasesAndPitfalls: [
        "Bài toán chỉ dùng đệ quy chia để trị thông thường (như Merge Sort) KHÔNG phải DP vì các bài con không gối nhau (non-overlapping); DP chỉ tỏa sáng khi bài toán con bị TÍNH LẶP LẠI!",
      ],
      tradeOffs: [
        "Top-Down (Memoization) dễ viết từ công thức đệ quy nhưng tốn Call Stack; Bottom-Up (Tabulation) chạy nhanh, không sợ Stack Overflow và dễ tối ưu RAM xuống O(1).",
      ],
      references: ["MIT 6.006 — Lecture 15 & 16: Dynamic Programming", "CLRS — Chapter 15 (Dynamic Programming)"],
    },
    quizQuestions: [
      {
        id: "dp1d-q1",
        question: "Hai dấu hiệu đặc trưng nhất để nhận biết một bài toán có thể giải bằng Quy hoạch động (DP) là gì?",
        options: [
          "Đầu vào đã sắp xếp và không có số âm",
          "Cấu trúc con tối ưu (Optimal Substructure) và Các bài toán con gối nhau/lặp lại (Overlapping Subproblems)",
          "Đồ thị luôn có chu trình âm",
          "Bắt buộc dùng cây nhị phân cân bằng",
        ],
        correctIndex: 1,
        explanation: "Theo CLRS Ch.15 & MIT 6.006, DP giải quyết các bài toán có Optimal Substructure kết hợp Overlapping Subproblems (tính 1 lần, ghi nhớ dùng lại).",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Climbing Stairs & Coin Change 1D (DP Bottom-Up)",
      prompt:
        "Hãy giải bài toán DP 1D mở rộng kinh điển — **Đổi tiền tối thiểu (Coin Change)**: Cho các mệnh giá xu `coins` và số tiền `amount`. Viết hàm `coinChangeMin(coins, amount)` trả về SỐ ĐỒNG XU ÍT NHẤT cần dùng để tạo thành đúng `amount` (hoặc `-1` nếu không thể tạo được).",
      functionName: "coinChangeMin",
      starterCode: `function coinChangeMin(coins, amount) {
  if (amount === 0) return 0;
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  // TODO: Với mỗi mức tiền x từ 1..amount, thử từng đồng xu c trong coins
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      solutionCode: `function coinChangeMin(coins, amount) {
  if (amount === 0) return 0;
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let x = 1; x <= amount; x++) {
    for (const c of coins) {
      if (x - c >= 0 && dp[x - c] !== Infinity) {
        dp[x] = Math.min(dp[x], dp[x - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      hints: ["Với mỗi `x` từ 1 đến `amount`: `dp[x] = Math.min(dp[x], dp[x - c] + 1)` nếu `x - c >= 0`. (Nhắc: Tham lam chọn xu to nhất KHÔNG đúng cho mọi bộ xu, VD `[1, 3, 4]` với `amount = 6`!)."],
      testCases: [
        { name: "Trường hợp Greedy sai nhưng DP đúng (6 với [1, 3, 4])", inputArgs: [[1, 3, 4], 6], expected: 2 },
        { name: "Bộ xu chuẩn", inputArgs: [[1, 2, 5], 11], expected: 3 },
        { name: "Không thể đổi được (Edge Case)", inputArgs: [[2], 3], expected: -1, isEdgeCase: true },
        { name: "amount = 0 (Edge Case)", inputArgs: [[1, 2], 0], expected: 0, isEdgeCase: true },
      ],
    },
  },

  {
    id: "knapsack-01",
    code: "08.4",
    chapterId: "chapter-08-paradigms",
    kind: "algorithm",
    algorithmId: "knapsack-01",
    title: "DP 2D — 0/1 Knapsack (Cái túi 0/1)",
    subtitle: "Quyết định Chọn hoặc Bỏ từng đồ vật trên bảng Quy hoạch động 2 chiều để tối đa giá trị.",
    theory: {
      problemAndApplications:
        "Có N đồ vật, mỗi món có khối lượng `w[i]` và giá trị `v[i]`, cùng một chiếc balo chịu tải tối đa `W`. Mỗi món chỉ được lấy nguyên vẹn (1) hoặc không lấy (0). Hãy tìm tổng giá trị lớn nhất mang theo được.",
      realWorldApps: [
        "Phân bổ ngân sách đầu tư tối ưu (Capital Budgeting), đóng gói hàng hóa container và chọn quảng cáo tối ưu doanh thu.",
      ],
      coreIntuition:
        "Khi xét món đồ thứ `i` với sức chứa balo còn lại `w`, bạn đứng trước 2 quyết định: (1) BỎ QUA nó → giá trị giữ nguyên bằng `dp[i-1][w]`; (2) CHỌN nó (nếu `w >= w[i]`) → nhận `v[i]` + giá trị tốt nhất với sức chứa còn lại `dp[i-1][w - w[i]]`. Lấy `Math.max` giữa 2 phương án!",
      mechanismSteps: [
        "Tạo bảng `dp[N+1][W+1]` khởi tạo toàn số 0.",
        "Duyệt từng món `i = 1..N` và từng sức chứa `w = 0..W`.",
        "Nếu `weights[i-1] <= w`: `dp[i][w] = Math.max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])`; ngược lại `dp[i][w] = dp[i-1][w]`.",
      ],
      loopInvariant:
        "`dp[i][w]` luôn là tổng giá trị tối ưu khi chỉ xét `i` đồ vật đầu tiên với giới hạn sức chứa `w`.",
      complexityDeepDive: {
        timeExplanation: "O(N · W) — đây gọi là độ phức tạp **Giả đa thức (Pseudopolynomial)** (MIT 6.006 L18) vì W là giá trị số đầu vào chứ không phải số lượng đồ vật N!",
        spaceExplanation: "O(N · W) cho bảng 2D (có thể nén xuống mảng 1D O(W) bằng cách duyệt `w` từ `W` về `w[i]`).",
        best: "O(N · W)",
        average: "O(N · W)",
        worst: "O(N · W)",
        space: "O(N · W) → O(W)",
      },
      edgeCasesAndPitfalls: [
        "Nếu nén mảng về 1D `dp[w]`: BẮT BUỘC duyệt `w` từ `W` GIẢM DẦN về `weights[i]` để tránh việc dùng một món đồ nhiều lần (nếu duyệt xuôi sẽ biến thành Unbounded Knapsack!).",
      ],
      tradeOffs: [
        "Khác với Fractional Knapsack (được cắt lẻ đồ vật → dùng Tham lam O(N log N)), 0/1 Knapsack là bài toán NP-Complete đòi hỏi Quy hoạch động.",
      ],
      references: ["MIT 6.006 — Lecture 18: Dynamic Programming IV (Pseudopolynomial Time)", "CLRS — Chapter 16 Notes (0/1 vs Fractional Knapsack)"],
    },
    quizQuestions: [
      {
        id: "ks-q1",
        question: "Tại sao bài toán Balo Phân số (Fractional Knapsack — được phép cắt nhỏ món đồ) giải được bằng Tham lam O(N log N), còn Balo 0/1 bắt buộc phải dùng Quy hoạch động?",
        options: [
          "Vì Balo 0/1 không thể cắt lẻ món đồ, chọn món có tỉ lệ giá trị/khối lượng cao nhất có thể làm thừa khoảng trống lãng phí mà không nhét vừa món khác",
          "Vì Balo 0/1 có số âm",
          "Vì Balo 0/1 luôn ít đồ vật hơn",
          "Cả hai đều giải đúng bằng Tham lam",
        ],
        correctIndex: 0,
        explanation: "Tham lam theo đơn giá bị hụt không gian trống ở Balo 0/1 (VD: sức chứa 10, chọn món (6, 30$) làm lỡ mất cặp hai món (5, 20$) + (5, 20$) = 40$).",
      },
    ],
    codeChallenge: {
      title: "Giải Bài toán Balo 0/1 (0/1 Knapsack)",
      prompt:
        "Cho mảng khối lượng `weights`, mảng giá trị `values` và sức chứa tối đa `capacity`. Viết hàm `knapsack01(weights, values, capacity)` trả về tổng giá trị lớn nhất đạt được.",
      functionName: "knapsack01",
      starterCode: `function knapsack01(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  // TODO: Điền bảng DP 2D
  
  return dp[n][capacity];
}`,
      solutionCode: `function knapsack01(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const wItem = weights[i - 1];
    const vItem = values[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (wItem <= w) {
        dp[i][w] = Math.max(dp[i][w], vItem + dp[i - 1][w - wItem]);
      }
    }
  }
  return dp[n][capacity];
}`,
      hints: ["So sánh `dp[i - 1][w]` (bỏ món i) và `values[i - 1] + dp[i - 1][w - weights[i - 1]]` (lấy món i)."],
      testCases: [
        { name: "Bộ test chuẩn", inputArgs: [[2, 3, 4, 5], [3, 4, 5, 8], 7], expected: 11 },
        { name: "Tham lam đơn giá thất bại", inputArgs: [[6, 5, 5], [30, 20, 20], 10], expected: 40 },
        { name: "Sức chứa 0 (Edge Case)", inputArgs: [[1, 2], [10, 20], 0], expected: 0, isEdgeCase: true },
        { name: "Không có đồ vật (Edge Case)", inputArgs: [[], [], 10], expected: 0, isEdgeCase: true },
      ],
    },
  },

  {
    id: "lcs",
    code: "08.5",
    chapterId: "chapter-08-paradigms",
    kind: "algorithm",
    algorithmId: "lcs",
    title: "DP 2D — Longest Common Subsequence (LCS)",
    subtitle: "Tìm Dãy con chung dài nhất giữa hai chuỗi — trái tim của công cụ `git diff` và so sánh ADN.",
    theory: {
      problemAndApplications:
        "Cho hai chuỗi `s1` và `s2`. Hãy tìm độ dài dãy con chung dài nhất (Subsequence — giữ nguyên thứ tự tương đối, không bắt buộc liên tiếp).",
      realWorldApps: [
        "Công cụ **`git diff`** phát hiện dòng code nào được thêm/sửa/giữ nguyên giữa hai phiên bản file.",
        "Tin sinh học: Đối chiếu trình tự gen ADN/Protein để đo mức độ tương đồng di truyền.",
      ],
      coreIntuition:
        "So sánh ký tự cuối của hai tiền tố `s1[0..i-1]` và `s2[0..j-1]`: (1) Nếu `s1[i-1] === s2[j-1]` → tuyệt vời, ta ghép thêm được 1 ký tự chung → `dp[i][j] = 1 + dp[i-1][j-1]`; (2) Nếu khác nhau → phải thử bỏ bớt 1 ký tự ở đầu `s1` hoặc `s2` và chọn phương án dài hơn: `Math.max(dp[i-1][j], dp[i][j-1])`.",
      mechanismSteps: [
        "Tạo bảng `dp[m+1][n+1]` toàn số 0.",
        "Duyệt `i = 1..m`, `j = 1..n`: kiểm tra `s1[i-1] === s2[j-1]`.",
        "Trả về `dp[m][n]` (và có thể truy vết ngược từ `(m, n)` về `(0, 0)` để tái tạo chính xác chuỗi LCS).",
      ],
      loopInvariant:
        "`dp[i][j]` luôn là độ dài LCS chính xác của tiền tố độ dài `i` của `s1` và tiền tố độ dài `j` của `s2` (CLRS Ch.15.4).",
      complexityDeepDive: {
        timeExplanation: "Hai vòng lặp qua bảng `(m+1) × (n+1)` → O(M · N).",
        spaceExplanation: "O(M · N) để lưu bảng truy vết (có thể giảm xuống O(min(M, N)) nếu chỉ cần độ dài).",
        best: "O(M · N)",
        average: "O(M · N)",
        worst: "O(M · N)",
        space: "O(M · N)",
      },
      edgeCasesAndPitfalls: [
        "Nhầm lẫn giữa Subsequence (không cần liên tiếp, VD: 'ace' là con của 'abcde') và Substring (bắt buộc liên tiếp).",
      ],
      tradeOffs: [
        "Biến thể mở rộng trực tiếp của LCS là **Edit Distance (Levenshtein Distance)** dùng trong kiểm tra chính tả.",
      ],
      references: ["CLRS — Chapter 15.4 (Longest Common Subsequence)", "MIT 6.006 — Lecture 17"],
    },
    quizQuestions: [
      {
        id: "lcs-q1",
        question: "Khi đang tính `dp[i][j]` trong LCS, nếu `s1[i-1] === s2[j-1]`, công thức chuyển trạng thái chuẩn xác là gì?",
        options: [
          "dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])",
          "dp[i][j] = 1 + dp[i-1][j-1]",
          "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
          "dp[i][j] = 1",
        ],
        correctIndex: 1,
        explanation: "Vì 2 ký tự cuối khớp nhau, nó đóng góp thêm 1 vào độ dài LCS của tiền tố bỏ đi cả 2 ký tự đó (`dp[i-1][j-1]`).",
      },
    ],
    codeChallenge: {
      title: "Tìm Độ dài Dãy Con Chung Dài Nhất (LCS)",
      prompt: "Viết hàm `longestCommonSubsequence(s1, s2)` trả về độ dài của dãy con chung dài nhất giữa hai chuỗi `s1` và `s2`.",
      functionName: "longestCommonSubsequence",
      starterCode: `function longestCommonSubsequence(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // TODO: Điền bảng LCS
  
  return dp[m][n];
}`,
      solutionCode: `function longestCommonSubsequence(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
      hints: ["Nếu `s1[i-1] === s2[j-1]` thì `1 + dp[i-1][j-1]`; ngược lại `Math.max(dp[i-1][j], dp[i][j-1])`."],
      testCases: [
        { name: "Chuỗi chuẩn", inputArgs: ["abcde", "ace"], expected: 3 },
        { name: "Giống nhau hoàn toàn", inputArgs: ["abc", "abc"], expected: 3 },
        { name: "Không có ký tự chung (Edge Case)", inputArgs: ["abc", "def"], expected: 0, isEdgeCase: true },
        { name: "Chuỗi rỗng (Edge Case)", inputArgs: ["", "abc"], expected: 0, isEdgeCase: true },
      ],
    },
  },

  // =================== CHƯƠNG 09: XỬ LÝ CHUỖI NÂNG CAO ===================
  {
    id: "trie",
    code: "09.1",
    chapterId: "chapter-09-strings",
    kind: "algorithm",
    algorithmId: "trie",
    title: "Trie (Prefix Tree — Cây Tiền Tố)",
    subtitle: "Tìm kiếm từ và gợi ý tiền tố Autocomplete chỉ phụ thuộc vào độ dài từ O(L), bất chấp từ điển có 1 triệu từ!",
    theory: {
      problemAndApplications:
        "Làm thế nào thanh tìm kiếm Google hoặc bàn phím điện thoại gõ chữ `'alg'` là lập tức gợi ý ra `'algorithm', 'algebra'` trong vài mili-giây giữa hàng triệu từ khóa?",
      realWorldApps: [
        "Gợi ý tìm kiếm (Autocomplete), Kiểm tra chính tả, Bảng định tuyến IP (Longest Prefix Matching) trong Router mạng.",
      ],
      coreIntuition:
        "Thay vì lưu từng từ riêng lẻ, Trie gộp chung các phần đầu giống nhau thành một cái cây ký tự. Mỗi cạnh là 1 ký tự, từ gốc đi xuống gặp `isEndOfWord = true` là tạo thành 1 từ hoàn chỉnh. Tìm từ dài L chỉ mất đúng L bước nhảy, KHÔNG phụ thuộc số lượng từ N trong từ điển!",
      mechanismSteps: [
        "Mỗi TrieNode chứa `children` (Map ký tự → TrieNode) và cờ `isEndOfWord`.",
        "Insert(word): Đi lần lượt qua từng ký tự `ch`; nếu nhánh `ch` chưa có thì tạo node mới; đến cuối từ đặt `node.isEndOfWord = true`.",
        "Search(word): Đi theo từng ký tự; nếu đứt nhánh giữa chừng trả về `false`; đi hết từ trả về `node.isEndOfWord`.",
        "StartsWith(prefix): Tương tự Search nhưng chỉ cần đi hết chuỗi `prefix` mà không đứt nhánh là trả về `true`.",
      ],
      loopInvariant:
        "Mọi node ở độ sâu `k` đại diện cho đúng tiền tố độ dài `k` tính từ gốc — mọi từ chia sẻ tiền tố chung đều đi qua cùng một đường dẫn từ gốc.",
      complexityDeepDive: {
        timeExplanation: "Insert, Search, StartsWith đều tốn O(L) với L là độ dài từ/tiền tố (nhanh hơn cả tìm kiếm chuỗi trên Hash Table khi kiểm tra tiền tố!).",
        spaceExplanation: "O(Tổng số ký tự của các từ không trùng tiền tố × kích thước bảng chữ cái).",
        best: "O(L)",
        average: "O(L)",
        worst: "O(L)",
        space: "O(Σ L)",
      },
      edgeCasesAndPitfalls: [
        "Nhầm lẫn giữa `search('app')` và `startsWith('app')` khi trong từ điển mới chỉ chèn `'apple'` mà chưa đánh dấu `isEndOfWord` tại `'app'`!",
      ],
      tradeOffs: [
        "Trie ăn đứt Hash Table khi cần tìm kiếm theo tiền tố (Prefix Matching / Autocomplete) hoặc sắp xếp từ điển theo thứ tự ABC; nhưng tốn nhiều RAM hơn Hash Table nếu các từ ít chia sẻ tiền tố.",
      ],
      references: ["Princeton Algorithms 4th Ed — Section 5.2 (Tries)", "LeetCode 208: Implement Trie"],
    },
    quizQuestions: [
      {
        id: "trie-q1",
        question: "Giả sử ta chỉ chèn từ `'apple'` vào một Trie rỗng. Kết quả của `search('app')` và `startsWith('app')` lần lượt là gì?",
        options: [
          "true và true",
          "false và true (vì nút 'p' thứ 2 tồn tại nhưng chưa được đánh dấu `isEndOfWord = true`)",
          "false và false",
          "true và false",
        ],
        correctIndex: 1,
        explanation: "'app' chỉ là tiền tố của 'apple' (`startsWith` → true), chưa được chèn như một từ độc lập (`search` → false).",
      },
    ],
    codeChallenge: {
      title: "Xây dựng Trie hỗ trợ Insert, Search & StartsWith",
      prompt:
        "Cho danh sách từ cần nạp `words` và danh sách truy vấn `queries` gồm `[type, str]` (với `type` là `'search'` hoặc `'startsWith'`). Hãy cài đặt cấu trúc Trie trả về mảng kết quả boolean cho từng truy vấn.",
      functionName: "runTrieQueries",
      starterCode: `function runTrieQueries(words, queries) {
  const root = { children: {}, isEnd: false };

  function insert(word) {
    // TODO: Chèn word vào Trie
    
  }

  function search(word) {
    // TODO: Kiểm tra từ hoàn chỉnh
    
  }

  function startsWith(prefix) {
    // TODO: Kiểm tra tiền tố
    
  }

  for (const w of words) insert(w);
  return queries.map(([type, s]) => (type === "search" ? search(s) : startsWith(s)));
}`,
      solutionCode: `function runTrieQueries(words, queries) {
  const root = { children: {}, isEnd: false };

  function insert(word) {
    let curr = root;
    for (const ch of word) {
      if (!curr.children[ch]) curr.children[ch] = { children: {}, isEnd: false };
      curr = curr.children[ch];
    }
    curr.isEnd = true;
  }

  function traverse(str) {
    let curr = root;
    for (const ch of str) {
      if (!curr.children[ch]) return null;
      curr = curr.children[ch];
    }
    return curr;
  }

  function search(word) {
    const node = traverse(word);
    return node !== null && node.isEnd;
  }

  function startsWith(prefix) {
    return traverse(prefix) !== null;
  }

  for (const w of words) insert(w);
  return queries.map(([type, s]) => (type === "search" ? search(s) : startsWith(s)));
}`,
      hints: ["Viết hàm helper `traverse(str)` đi dọc theo `curr.children[ch]`; `search` cần thêm `node.isEnd === true`."],
      testCases: [
        {
          name: "Phân biệt search và startsWith",
          inputArgs: [["apple", "app", "banana"], [["search", "apple"], ["search", "app"], ["search", "ap"], ["startsWith", "ap"], ["startsWith", "ban"], ["search", "cat"]]],
          expected: [true, true, false, true, true, false],
        },
        { name: "Chèn rồi tìm từ chưa kết thúc (Edge Case)", inputArgs: [["algorithm"], [["search", "algo"], ["startsWith", "algo"]]], expected: [false, true], isEdgeCase: true },
      ],
    },
  },

  {
    id: "kmp",
    code: "09.2",
    chapterId: "chapter-09-strings",
    kind: "algorithm",
    algorithmId: "kmp",
    title: "Knuth-Morris-Pratt (KMP String Matching)",
    subtitle: "Khớp mẫu chuỗi trong thời gian tuyến tính O(N + M) không bao giờ lùi con trỏ văn bản nhờ bảng LPS.",
    theory: {
      problemAndApplications:
        "Tìm vị trí xuất hiện đầu tiên của chuỗi mẫu `pattern` (dài M) bên trong văn bản `text` (dài N). Thuật toán ngây thơ mất O(N · M) khi lùi con trỏ `text` liên tục (VD tìm `'aaaaab'` trong `'aaaaaaaaab'`). KMP giải quyết dứt điểm trong O(N + M)!",
      realWorldApps: [
        "Công cụ tìm kiếm văn bản (Ctrl+F / grep), phát hiện chữ ký mã độc (Antivirus Signature Scanning), đối chiếu mẫu ADN.",
      ],
      coreIntuition:
        "Khi so khớp được 5 ký tự đầu của `pattern` rồi mới bị sai ở ký tự thứ 6, tại sao phải vứt bỏ toàn bộ công sức quay lại từ đầu? KMP tính trước bảng **LPS (Longest Prefix Suffix)** cho biết đoạn tiền tố nào của `pattern` trùng với hậu tố ngay trước điểm sai → giữ nguyên con trỏ `i` trên `text`, chỉ trượt con trỏ `j` của `pattern` về `lps[j - 1]`!",
      mechanismSteps: [
        "Pha 1 (Build LPS — O(M)): Với mỗi vị trí `k` trong `pattern`, `lps[k]` = độ dài tiền tố thực sự dài nhất trùng với hậu tố kết thúc tại `k`.",
        "Pha 2 (Search — O(N)): Con trỏ `i` chạy trên `text`, `j` trên `pattern`. Nếu `text[i] === pattern[j]` → tăng cả `i, j`; nếu `j === M` → tìm thấy tại `i - M`!",
        "Nếu không khớp: Nếu `j > 0`, gán `j = lps[j - 1]` (KHÔNG giảm `i`!); nếu `j === 0`, chỉ tăng `i++`.",
      ],
      loopInvariant:
        "Con trỏ `i` của văn bản KHÔNG BAO GIỜ lùi lại; ở mỗi bước, `pattern[0 .. j-1]` luôn khớp với đoạn văn bản ngay trước vị trí `i` (CLRS Ch.32.4).",
      complexityDeepDive: {
        timeExplanation: "Xây bảng LPS tốn O(M), pha duyệt văn bản tốn O(N) (vì giá trị `j` tăng tối đa N lần nên tổng số lần nhảy lùi `j = lps[j-1]` cũng không vượt quá N!) → Tổng O(N + M).",
        spaceExplanation: "Mảng bảng `lps` kích thước M → O(M).",
        best: "O(N + M)",
        average: "O(N + M)",
        worst: "O(N + M)",
        space: "O(M)",
      },
      edgeCasesAndPitfalls: [
        "`pattern` rỗng `\"\"`: Theo chuẩn `indexOf(\"\")`, trả về `0`.",
        "Cài đặt nhầm hàm dựng `lps` không lùi `len = lps[len - 1]` khi không khớp.",
      ],
      tradeOffs: [
        "KMP đảm bảo worst-case tuyến tính O(N + M) tuyệt đối, khác với Brute-Force O(N·M) hay Rabin-Karp O(N·M) worst-case khi đụng độ hash.",
      ],
      references: ["CLRS — Chapter 32.4 (The Knuth-Morris-Pratt Algorithm)", "Princeton Algorithms 4th Ed — Section 5.3"],
    },
    quizQuestions: [
      {
        id: "kmp-q1",
        question: "Bảng `LPS` của chuỗi mẫu `pattern = \"ABABC\"` tại mỗi chỉ số `[0, 1, 2, 3, 4]` mang giá trị nào sau đây?",
        options: ["[0, 0, 1, 2, 0]", "[0, 1, 2, 3, 4]", "[0, 0, 0, 1, 2]", "[0, 0, 1, 1, 0]"],
        correctIndex: 0,
        explanation: "'A'→0; 'AB'→0; 'ABA'→1 ('A'); 'ABAB'→2 ('AB'); 'ABABC'→0.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt KMP Tìm kiếm Chuỗi O(N + M)",
      prompt: "Viết hàm `kmpSearch(text, pattern)` trả về chỉ số xuất hiện ĐẦU TIÊN của `pattern` trong `text` (hoặc `-1` nếu không tìm thấy; trả về `0` nếu `pattern === \"\"`).",
      functionName: "kmpSearch",
      starterCode: `function kmpSearch(text, pattern) {
  if (pattern.length === 0) return 0;
  const m = pattern.length, n = text.length;
  const lps = new Array(m).fill(0);

  // TODO: Pha 1 - Xây dựng mảng LPS cho pattern
  
  // TODO: Pha 2 - Khớp chuỗi text bằng KMP và trả về index đầu tiên
  
  return -1;
}`,
      solutionCode: `function kmpSearch(text, pattern) {
  if (pattern.length === 0) return 0;
  const m = pattern.length, n = text.length;
  const lps = new Array(m).fill(0);

  let len = 0, k = 1;
  while (k < m) {
    if (pattern[k] === pattern[len]) {
      lps[k++] = ++len;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[k++] = 0;
    }
  }

  let i = 0, j = 0;
  while (i < n) {
    if (text[i] === pattern[j]) {
      i++; j++;
      if (j === m) return i - m;
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }
  return -1;
}`,
      hints: ["Khi không khớp ở cả hai pha: nếu `len > 0` (hoặc `j > 0`) thì gán `len = lps[len - 1]` (hoặc `j = lps[j - 1]`); ngược lại mới tăng biến chạy."],
      testCases: [
        { name: "Chuỗi lặp trùng khớp một phần", inputArgs: ["ababcabcabababd", "ababd"], expected: 10 },
        { name: "Khớp ngay đầu", inputArgs: ["algorithm", "algo"], expected: 0 },
        { name: "Không tồn tại", inputArgs: ["hello world", "xyz"], expected: -1 },
        { name: "Pattern rỗng (Edge Case)", inputArgs: ["abc", ""], expected: 0, isEdgeCase: true },
      ],
    },
  },

  // =================== PHẦN KẾT KHÓA ===================
  {
    id: "course-capstone",
    code: "10.1",
    chapterId: "chapter-10-capstone",
    kind: "capstone",
    title: "Tổng kết Toàn khóa & Cẩm nang Phỏng vấn DSA",
    subtitle: "Hệ thống hóa toàn bộ 10 chương: Cách nhìn đề bài chọn ngay đúng Cấu trúc Dữ liệu & Thuật toán tối ưu.",
    interactiveWidget: "capstone-guide",
    theory: {
      problemAndApplications:
        "Chúc mừng bạn đã đi tới trạm cuối cùng của khóa học! Ở ngoài thực tế và trong phòng phỏng vấn kỹ thuật, đề bài KHÔNG bao giờ ghi sẵn tên 'Hãy dùng Sliding Window' hay 'Hãy dùng Dijkstra'. Kỹ năng quan trọng nhất của một Kỹ sư phần mềm là **nhận diện tín hiệu (Pattern Recognition)** từ ràng buộc kích thước N và tính chất dữ liệu.",
      realWorldApps: [
        "N ≤ 20 → Nghĩ ngay Quay lui (Backtracking) hoặc DP Bitmask O(2^N).",
        "N ≤ 10^3 → DP 2D / O(N²) / Bellman-Ford / Floyd-Warshall.",
        "N ≤ 10^5 → Bắt buộc O(N log N) hoặc O(N): Sorting, Two Pointers, Sliding Window, Heap, BST, BFS/DFS, Dijkstra, Segment Tree, DSU.",
        "N ≥ 10^7 → O(log N) (Binary Search) hoặc O(1) (Toán học / Hash / Bit Manipulation).",
      ],
      coreIntuition:
        "Hãy nhớ bộ câu hỏi 4 bước khi đứng trước bất kỳ bài toán lạ nào: (1) Đầu vào là dạng gì (Mảng đã sort? Chuỗi? Cây? Đồ thị có trọng số âm?) → (2) Giới hạn N là bao nhiêu? → (3) CTDL nào cho phép thao tác chính nhanh nhất? → (4) Thử nghiệm tay với Edge Cases (rỗng, 1 phần tử, âm, trùng lặp) trước khi gõ code!",
      mechanismSteps: [
        "Mảng đã sắp xếp → Binary Search O(log N) hoặc Two Pointers O(N).",
        "Đoạn con liên tiếp / Chuỗi con → Sliding Window hoặc Prefix Sum / Kadane O(N).",
        "Tra cứu tồn tại nhanh / Đếm tần suất → Hash Table O(1).",
        "Liên tục lấy Min/Max hoặc Top-K → Heap / Priority Queue O(log N).",
        "Đồ thị đường ngắn nhất: Không trọng số → BFS; Trọng số ≥ 0 → Dijkstra; Có cạnh âm → Bellman-Ford; Thứ tự phụ thuộc → Topological Sort.",
        "Tối ưu hóa có bài toán con lặp lại → DP 1D / 2D; Tìm mọi cấu hình có ràng buộc → Backtracking.",
      ],
      loopInvariant:
        "Kỹ năng thật sự đến từ việc hiểu Bất biến (Invariants), phân tích rành mạch Trade-offs giữa Thời gian và Không gian, và kiểm tra biên cẩn thận.",
      complexityDeepDive: {
        timeExplanation: "Bạn đã làm chủ toàn bộ phổ độ phức tạp từ O(1), O(log N), O(N), O(N log N), O(V + E), đến O(N·W) và O(N!).",
        spaceExplanation: "Biết cách cân bằng Time–Space Tradeoff trong từng bài toán cụ thể.",
        best: "O(1)",
        average: "Tùy Pattern",
        worst: "Đạt chuẩn Production",
        space: "Tối ưu",
      },
      edgeCasesAndPitfalls: [
        "Luôn đặt câu hỏi kiểm tra biên cho mọi bài code: Empty input, Single element, Duplicate values, Negative values / Overflow, Disconnected Graph.",
      ],
      tradeOffs: [
        "Không có cấu trúc dữ liệu nào 'tốt nhất mọi lúc' — chỉ có cấu trúc phù hợp nhất với thao tác thường xuyên nhất của bài toán.",
      ],
      references: [
        "MIT OpenCourseWare 6.006 — Lecture 20 & 21: Course Review & Next Steps",
        "Princeton Algorithms 4th Ed — Chapter 6: Context",
      ],
    },
    quizQuestions: [
      {
        id: "cap-q1",
        question: "Một bài toán có giới hạn `N = 100,000` phần tử và thời gian chạy cho phép là 1 giây (~10^7 – 10^8 phép toán). Độ phức tạp thuật toán nào dưới đây chắc chắn bị Time Limit Exceeded (TLE)?",
        options: ["O(N)", "O(N log N)", "O(N²) (tương đương ~10^10 phép toán)", "O(log N)"],
        correctIndex: 2,
        explanation: "Với N = 10^5, N² = 10^10 phép toán vượt xa khả năng xử lý trong 1 giây → bắt buộc phải tối ưu xuống O(N log N) hoặc O(N).",
      },
      {
        id: "cap-q2",
        question: "Cho một đồ thị có hướng, có cạnh trọng số ÂM nhưng không có chu trình âm, yêu cầu tìm đường đi ngắn nhất từ đỉnh S tới mọi đỉnh. Bạn chọn thuật toán nào?",
        options: ["BFS", "Dijkstra", "Bellman-Ford", "Kruskal"],
        correctIndex: 2,
        explanation: "BFS không xử lý trọng số; Dijkstra sai khi gặp cạnh âm; Kruskal tìm cây khung chứ không tìm đường đi ngắn nhất. Bellman-Ford là lựa chọn đúng!",
      },
    ],
  },
];
