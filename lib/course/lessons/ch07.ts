import { CourseLesson } from "../types";

export const LESSONS_CH07: CourseLesson[] = [
  {
    id: "bfs",
    code: "07.1",
    chapterId: "chapter-07-graphs",
    kind: "algorithm",
    algorithmId: "bfs",
    title: "Breadth-First Search (BFS — Duyệt theo Chiều Rộng)",
    subtitle: "Khám phá đồ thị lan tỏa từng lớp bằng Queue để tìm đường đi ngắn nhất trên đồ thị không trọng số.",
    theory: {
      problemAndApplications:
        "Cho đồ thị gồm V đỉnh và E cạnh cùng đỉnh xuất phát `start`. Làm thế nào duyệt qua mọi đỉnh theo thứ tự khoảng cách (số cạnh) gần nhất trước, và tìm đường đi ít cạnh nhất từ `start` tới các đỉnh khác?",
      realWorldApps: [
        "Tìm bậc kết nối gần nhất trên mạng xã hội (LinkedIn 1st/2nd/3rd connections).",
        "Tìm đường ngắn nhất trong mê cung không trọng số, Web Crawler và phát hiện chu trình đồ thị vô hướng.",
      ],
      coreIntuition:
        "BFS giống như vết dầu loang hoặc gợn sóng khi ném viên sỏi xuống hồ: trước hết thăm mọi đỉnh cách nguồn đúng 1 bước, sau đó mới tới các đỉnh cách 2 bước, 3 bước... Hàng đợi **Queue (FIFO)** đảm bảo các đỉnh ở lớp gần hơn luôn được xét xong trước khi động tới lớp xa hơn.",
      mechanismSteps: [
        "Đẩy đỉnh nguồn `start` vào `Queue`, đánh dấu `visited[start] = true` ngay lúc đẩy vào Queue (tránh đẩy trùng nhiều lần!).",
        "Trong khi `Queue` chưa rỗng: rút đỉnh `u` ở đầu hàng đợi.",
        "Duyệt mọi đỉnh kề `v` của `u`: nếu `!visited[v]`, đánh dấu `visited[v] = true` và đẩy `v` vào cuối `Queue`.",
      ],
      loopInvariant:
        "Khi đỉnh `u` được lấy ra khỏi Queue, độ dài đường đi từ `start` đến `u` chính là đường đi ngắn nhất (ít cạnh nhất) có thể (CLRS Ch.22.2).",
      complexityDeepDive: {
        timeExplanation: "Dùng Danh sách kề (Adjacency List): mỗi đỉnh vào Queue tối đa 1 lần, mỗi cạnh được kiểm tra tối đa 2 lần → O(V + E).",
        spaceExplanation: "Mảng `visited` và hàng đợi `Queue` chứa tối đa V đỉnh → O(V).",
        best: "O(V + E)",
        average: "O(V + E)",
        worst: "O(V + E)",
        space: "O(V)",
      },
      edgeCasesAndPitfalls: [
        "Đánh dấu `visited` SAU KHI pop thay vì NGAY LÚC push vào Queue: khiến cùng một đỉnh bị đẩy vào Queue hàng chục lần, làm nổ bộ nhớ/thời gian!",
        "Đồ thị có nhiều thành phần liên thông rời nhau (Disconnected): Cần lặp qua tất cả V đỉnh nếu muốn duyệt toàn bộ đồ thị.",
      ],
      tradeOffs: [
        "BFS tìm được đường đi ít cạnh nhất trên đồ thị KHÔNG TRỌNG SỐ, nhưng tốn Queue O(V) khi đồ thị rộng (mức phân nhánh lớn); DFS tiết kiệm bộ nhớ hơn nếu cây hẹp và sâu vừa.",
      ],
      references: ["MIT 6.006 — Lecture 9: Breadth-First Search", "CLRS — Chapter 22.2 (BFS)"],
    },
    quizQuestions: [
      {
        id: "bfs-q1",
        question: "Trên đồ thị KHÔNG có trọng số (hoặc trọng số mọi cạnh đều bằng 1), thuật toán nào đảm bảo tìm ra đường đi ngắn nhất từ đỉnh A đến đỉnh B?",
        options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Union-Find (DSU)", "Topological Sort"],
        correctIndex: 1,
        explanation: "Vì BFS mở rộng dần theo từng lớp khoảng cách k = 1, 2, 3..., lần đầu tiên chạm tới B chắc chắn là đường đi ít cạnh nhất.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Duyệt BFS & Tìm Thứ tự Duyệt",
      prompt:
        "Cho danh sách kề `adj` dạng object (ví dụ `{ A: ['B', 'C'], B: ['D'], ... }`) và đỉnh bắt đầu `start`. Viết hàm `bfsOrder(adj, start)` trả về mảng thứ tự các đỉnh được thăm bằng BFS (duyệt các đỉnh kề theo đúng thứ tự trong mảng `adj[u]`).",
      functionName: "bfsOrder",
      starterCode: `function bfsOrder(adj, start) {
  if (!adj || !adj[start]) return [];
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  let head = 0;

  // TODO: Rút đỉnh từ queue (dùng queue[head++]), thêm vào order, duyệt kề
  
  return order;
}`,
      solutionCode: `function bfsOrder(adj, start) {
  if (!adj || !adj[start]) return [];
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  let head = 0;

  while (head < queue.length) {
    const u = queue[head++];
    order.push(u);
    for (const v of adj[u] || []) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }
  }
  return order;
}`,
      hints: ["Đừng quên `visited.add(v)` NGAY trước `queue.push(v)` để tránh lặp."],
      testCases: [
        {
          name: "Đồ thị có chu trình cơ bản",
          inputArgs: [{ A: ["B", "C"], B: ["A", "D"], C: ["A", "E"], D: ["B"], E: ["C"] }, "A"],
          expected: ["A", "B", "C", "D", "E"],
        },
        {
          name: "Đồ thị có đỉnh cô lập",
          inputArgs: [{ A: ["B"], B: [], C: ["D"], D: [] }, "A"],
          expected: ["A", "B"],
        },
        {
          name: "1 đỉnh duy nhất (Edge Case)",
          inputArgs: [{ X: [] }, "X"],
          expected: ["X"],
          isEdgeCase: true,
        },
      ],
    },
  },

  {
    id: "dfs",
    code: "07.2",
    chapterId: "chapter-07-graphs",
    kind: "algorithm",
    algorithmId: "dfs",
    title: "Depth-First Search (DFS — Duyệt theo Chiều Sâu)",
    subtitle: "Đi sâu hết nhánh rồi mới quay lui — chìa khóa giải quyết Chu trình, Thành phần liên thông và DFS Cây.",
    theory: {
      problemAndApplications:
        "Khám phá mọi nhánh đường đi sâu nhất có thể từ một đỉnh trước khi quay lui tìm hướng rẽ khác.",
      realWorldApps: [
        "Phát hiện chu trình (Cycle Detection) trong đồ thị có hướng/vô hướng, phân tích phụ thuộc gói phần mềm.",
        "Tìm thành phần liên thông mạnh (Kosaraju / Tarjan SCC), giải mê cung và thuật toán Quay lui.",
      ],
      coreIntuition:
        "Giống như đi thám hiểm hang động có một cuộn chỉ: gặp ngã ba bạn cứ đi sâu mãi vào một ngách cho tới ngõ cụt rồi mới lần theo cuộn chỉ quay ngược lại ngã rẽ gần nhất để thử ngách còn lại. Cơ chế quay lui này tự nhiên sử dụng **Stack** (hoặc Call Stack của Đệ quy).",
      mechanismSteps: [
        "Gọi `dfs(u)`: Đánh dấu `visited[u] = true` và ghi nhận `u`.",
        "Với mỗi đỉnh kề `v` của `u`: nếu `!visited[v]` → gọi đệ quy `dfs(v)`.",
        "Khi mọi kề của `u` đã thăm xong, hàm `dfs(u)` tự động quay lui về đỉnh đã gọi nó.",
      ],
      loopInvariant:
        "Trong đồ thị có hướng (MIT 6.006 L10), phân loại 4 loại cạnh (Tree, Forward, Back, Cross): Đồ thị có hướng có chu trình khi và chỉ khi DFS phát hiện ít nhất một **Back Edge** (cạnh trỏ tới tổ tiên đang nằm trên Call Stack!).",
      complexityDeepDive: {
        timeExplanation: "Mỗi đỉnh được thăm 1 lần và mỗi cạnh được duyệt 1–2 lần với Adjacency List → O(V + E).",
        spaceExplanation: "Bộ nhớ cho `visited` + độ sâu Call Stack đệ quy → O(V).",
        best: "O(V + E)",
        average: "O(V + E)",
        worst: "O(V + E)",
        space: "O(V)",
      },
      edgeCasesAndPitfalls: [
        "Đồ thị rất sâu dạng chuỗi 100,000 đỉnh: Đệ quy có thể gây Stack Overflow → dùng Stack tường minh (Iterative DFS) khi cần thiết.",
      ],
      tradeOffs: [
        "DFS mạnh trong kiểm tra liên thông, chu trình, Topological Sort, tìm toàn bộ đường đi; nhưng KHÔNG dùng DFS để tìm đường ngắn nhất trên đồ thị tổng quát!",
      ],
      references: ["MIT 6.006 — Lecture 10: Depth-First Search", "CLRS — Chapter 22.3 (DFS)"],
    },
    quizQuestions: [
      {
        id: "dfs-q1",
        question: "Theo phân loại cạnh của DFS (CLRS Ch.22), dấu hiệu nào cho biết một đồ thị CÓ HƯỚNG chứa chu trình?",
        options: [
          "Tìm thấy 2 đỉnh cùng trỏ vào 1 đỉnh",
          "Tồn tại một cạnh quay ngược (Back Edge) trỏ từ đỉnh đang xét tới một đỉnh TỔ TIÊN vẫn đang nằm trên Call Stack (đang thăm dở)",
          "Số cạnh E nhỏ hơn số đỉnh V",
          "Đồ thị có đỉnh bậc 0",
        ],
        correctIndex: 1,
        explanation: "Nếu từ u đi tới v mà v đang ở trạng thái 'Visiting' (nằm trên ngăn xếp đệ quy hiện tại), tức là có đường từ v → u → v (chu trình)!",
      },
    ],
    codeChallenge: {
      title: "Đếm số Thành phần Liên thông bằng DFS",
      prompt:
        "Cho đồ thị VÔ HƯỚNG gồm `n` đỉnh đánh số `0 .. n-1` và danh sách cạnh `edges` (mảng các cặp `[u, v]`). Viết hàm `countComponents(n, edges)` dùng DFS đếm xem đồ thị có bao nhiêu thành phần liên thông.",
      functionName: "countComponents",
      starterCode: `function countComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Array(n).fill(false);
  let count = 0;

  function dfs(u) {
    // TODO: Đánh dấu visited[u] và gọi đệ quy sang các đỉnh kề
    
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      count++;
      dfs(i);
    }
  }
  return count;
}`,
      solutionCode: `function countComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Array(n).fill(false);
  let count = 0;

  function dfs(u) {
    visited[u] = true;
    for (const v of adj[u]) {
      if (!visited[v]) dfs(v);
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      count++;
      dfs(i);
    }
  }
  return count;
}`,
      hints: ["Bên trong `dfs(u)`: gán `visited[u] = true;` rồi lặp `for (const v of adj[u]) if (!visited[v]) dfs(v);`."],
      testCases: [
        { name: "2 thành phần liên thông", inputArgs: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
        { name: "1 thành phần duy nhất", inputArgs: [4, [[0, 1], [1, 2], [2, 3], [3, 0]]], expected: 1 },
        { name: "Không có cạnh nào (Edge Case)", inputArgs: [4, []], expected: 4, isEdgeCase: true },
        { name: "0 đỉnh (Edge Case)", inputArgs: [0, []], expected: 0, isEdgeCase: true },
      ],
    },
  },

  {
    id: "topological-sort",
    code: "07.3",
    chapterId: "chapter-07-graphs",
    kind: "algorithm",
    algorithmId: "topological-sort",
    title: "Topological Sort (Kahn's Algorithm trên DAG)",
    subtitle: "Sắp xếp thứ tự công việc phụ thuộc (Build Systems, Môn học tiên quyết) và phát hiện phụ thuộc vòng.",
    theory: {
      problemAndApplications:
        "Cho Đồ thị có hướng không chu trình (DAG) biểu diễn mối quan hệ tiên quyết (`u → v` nghĩa là phải làm `u` trước `v`). Hãy xếp tất cả các đỉnh thành một hàng ngang sao cho mọi cạnh đều đi từ trái sang phải.",
      realWorldApps: [
        "Trình quản lý gói `npm / apt / pip`, hệ thống Build (`Make, Bazel, Webpack`), sắp xếp lộ trình môn học đại học.",
      ],
      coreIntuition:
        "Thuật toán Kahn (Dùng Bậc vào — In-degree): Môn học nào có **In-degree = 0** (không đòi hỏi môn tiên quyết nào trước đó) thì được học trước tiên! Khi học xong môn đó, ta xóa bỏ sự phụ thuộc của nó vào các môn kế tiếp (giảm In-degree của đỉnh kề đi 1). Môn nào vừa chạm ngưỡng In-degree = 0 lại được đẩy vào hàng đợi.",
      mechanismSteps: [
        "Tính `inDegree[v]` (số cạnh đi vào mỗi đỉnh `v`).",
        "Đẩy tất cả các đỉnh có `inDegree === 0` vào Queue.",
        "Lặp lấy đỉnh `u` từ Queue, thêm vào `order`, rồi với mỗi cạnh `u → v`: giảm `inDegree[v]--`. Nếu `inDegree[v] === 0`, đẩy `v` vào Queue.",
        "Cuối cùng kiểm tra: Nếu `order.length < V`, đồ thị chắc chắn CÓ CHU TRÌNH (Deadlock phụ thuộc!).",
      ],
      loopInvariant:
        "Tại thời điểm một đỉnh `u` được đẩy vào Queue, toàn bộ các đỉnh tiên quyết bắt buộc đứng trước `u` đều đã nằm trong danh sách kết quả `order`.",
      complexityDeepDive: {
        timeExplanation: "Tính bậc vào O(V + E), mỗi đỉnh vào/ra Queue tối đa 1 lần, mỗi cạnh giảm bậc đúng 1 lần → O(V + E).",
        spaceExplanation: "Lưu mảng `inDegree` và `Queue` → O(V).",
        best: "O(V + E)",
        average: "O(V + E)",
        worst: "O(V + E)",
        space: "O(V)",
      },
      edgeCasesAndPitfalls: [
        "Đồ thị có chu trình (Cycle): Kahn's Algorithm sẽ trả về mảng có độ dài nhỏ hơn `V` (không thể sắp xếp đủ tất cả đỉnh) — đây chính là cách chuẩn để phát hiện phụ thuộc vòng!",
      ],
      tradeOffs: [
        "So với DFS Post-Order Reverse: Kahn's Algorithm dễ trực quan hóa theo lớp phụ thuộc và đồng thời kiểm tra luôn chu trình.",
      ],
      references: ["CLRS — Chapter 22.4 (Topological Sort)", "Kahn's Algorithm (1962)"],
    },
    quizQuestions: [
      {
        id: "topo-q1",
        question: "Trong thuật toán Kahn, nếu Queue đã rỗng mà số lượng đỉnh đã xếp vẫn NHỎ HƠN tổng số đỉnh V thì điều gì xảy ra?",
        options: [
          "Đồ thị bị thiếu cạnh",
          "Đồ thị tồn tại chu trình phụ thuộc vòng (không phải DAG) nên không tồn tại thứ tự Topo hợp lệ",
          "Cần chạy lại lần 2",
          "Tất cả đỉnh đều có bậc vào bằng 0",
        ],
        correctIndex: 1,
        explanation: "Mọi đỉnh trong một chu trình đều có `inDegree >= 1` do đỉnh trước trong chu trình giữ lại, khiến không đỉnh nào đạt 0 để vào Queue.",
      },
    ],
    codeChallenge: {
      title: "Sắp xếp Topo & Kiểm tra Tốt nghiệp (Course Schedule)",
      prompt:
        "Có `numCourses` môn học (`0 .. numCourses-1`) và mảng điều kiện `[course, prereq]` (cần học `prereq` TRƯỚC `course`). Viết hàm `topoOrderCourses(numCourses, prerequisites)` trả về mảng thứ tự học hợp lệ, hoặc trả về `[]` nếu phát hiện phụ thuộc vòng không thể hoàn thành.",
      functionName: "topoOrderCourses",
      starterCode: `function topoOrderCourses(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    inDegree[course]++;
  }

  // TODO: Cài đặt Kahn's Algorithm trả về mảng thứ tự hoặc [] nếu có chu trình
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  
  return order.length === numCourses ? order : [];
}`,
      solutionCode: `function topoOrderCourses(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    inDegree[course]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    order.push(u);
    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}`,
      hints: ["Lặp lấy `u` từ Queue, thêm vào `order`, giảm `inDegree[v]--` cho mọi `v` trong `adj[u]`, nếu bằng 0 thì đẩy vào Queue."],
      testCases: [
        { name: "Thứ tự hợp lệ tuyến tính", inputArgs: [4, [[1, 0], [2, 1], [3, 2]]], expected: [0, 1, 2, 3] },
        { name: "Phát hiện chu trình phụ thuộc vòng (Edge Case)", inputArgs: [2, [[1, 0], [0, 1]]], expected: [], isEdgeCase: true },
        { name: "Không có điều kiện ràng buộc", inputArgs: [3, []], expected: [0, 1, 2] },
      ],
    },
  },

  {
    id: "kruskal-dsu",
    code: "07.4",
    chapterId: "chapter-07-graphs",
    kind: "algorithm",
    algorithmId: "kruskal-dsu",
    title: "Kruskal's MST & Disjoint Set Union (DSU)",
    subtitle: "Tìm Cây Khung Nhỏ Nhất bằng chiến lược Tham lam kết hợp cấu trúc Union-Find siêu tốc α(N).",
    theory: {
      problemAndApplications:
        "Cho đồ thị vô hướng liên thông có trọng số (ví dụ mạng lưới nối cáp quang giữa V thành phố). Hãy chọn ra đúng V - 1 cạnh sao cho nối thông được tất cả đỉnh với TỔNG CHI PHÍ NHỎ NHẤT (Minimum Spanning Tree).",
      realWorldApps: [
        "Thiết kế mạng lưới điện, đường ống nước, cáp viễn thông tốn ít dây nhất.",
        "Thuật toán phân cụm dữ liệu (Single-Linkage Clustering) trong Học máy.",
      ],
      coreIntuition:
        "Chiến lược Tham lam của Kruskal cực kỳ tự nhiên: Sắp xếp tất cả các cạnh từ RẺ NHẤT đến ĐẮT NHẤT. Lần lượt nhặt từng cạnh rẻ nhất thêm vào mạng lưới, **trừ phi** hai đầu mút của cạnh đó ĐÃ thông nhau rồi (vì nối thêm sẽ tạo chu trình lãng phí!). Để kiểm tra 2 đỉnh đã thông nhau chưa trong O(1), ta dùng **DSU (Union-Find)** với Path Compression & Union by Rank.",
      mechanismSteps: [
        "Sắp xếp tất cả các cạnh theo trọng số tăng dần (tốn O(E log E)).",
        "Khởi tạo DSU: mỗi đỉnh là một tập riêng biệt (`parent[i] = i`).",
        "Duyệt từng cạnh `(u, v, w)`: nếu `find(u) !== find(v)` → gộp hai tập `union(u, v)` và cộng `w` vào tổng trọng số MST; dừng ngay khi đủ `V - 1` cạnh.",
      ],
      loopInvariant:
        "Tập các cạnh được chọn trước mỗi bước luôn là một tập con của một Cây Khung Nhỏ Nhất hợp lệ (theo Định lý Cut Property — CLRS Ch.23).",
      complexityDeepDive: {
        timeExplanation: "Sắp xếp cạnh tốn O(E log E). Các thao tác `find` / `union` với Path Compression & Union by Rank chỉ tốn O(α(V)) ≈ O(1) (nghịch đảo hàm Ackermann) → Tổng O(E log E).",
        spaceExplanation: "Lưu mảng `parent` và `rank` của DSU → O(V + E).",
        best: "O(E log E)",
        average: "O(E log E)",
        worst: "O(E log E)",
        space: "O(V + E)",
      },
      edgeCasesAndPitfalls: [
        "Quên Path Compression (`parent[x] = find(parent[x])`) có thể khiến DSU suy biến thành O(V) khi đồ thị lớn.",
        "Đồ thị không liên thông: Không thể đủ V - 1 cạnh để nối thông toàn bộ đỉnh.",
      ],
      tradeOffs: [
        "Kruskal rất mạnh khi đồ thị thưa (E nhỏ) hoặc danh sách cạnh đã có sẵn; Prim nhanh hơn một chút trên đồ thị dày đặc.",
      ],
      references: ["Princeton Algorithms 4th Ed — Section 1.5 (Union-Find) & Section 4.3 (Kruskal's MST)", "CLRS — Chapter 21 & 23"],
    },
    quizQuestions: [
      {
        id: "kr-q1",
        question: "Trong thuật toán Kruskal, cấu trúc dữ liệu Disjoint Set Union (Union-Find) dùng để giải quyết câu hỏi cốt lõi nào?",
        options: [
          "Tìm cạnh có trọng số âm",
          "Kiểm tra nhanh hai đỉnh u và v đã nằm trong cùng một thành phần liên thông hay chưa (tránh tạo chu trình khi thêm cạnh)",
          "Sắp xếp trọng số các cạnh",
          "Tìm đường đi ngắn nhất từ S đến mọi đỉnh",
        ],
        correctIndex: 1,
        explanation: "Nếu `find(u) === find(v)`, hai đỉnh đã nối thông rồi nên thêm cạnh `(u, v)` chắc chắn tạo chu trình — Kruskal lập tức bỏ qua.",
      },
    ],
    codeChallenge: {
      title: "Tìm Tổng Trọng số Cây Khung Nhỏ Nhất (Kruskal + DSU)",
      prompt:
        "Cho `n` đỉnh (`0 .. n-1`) và danh sách cạnh có trọng số `edges = [[u, v, weight], ...]`. Viết hàm `kruskalMST(n, edges)` trả về tổng trọng số nhỏ nhất của cây khung nối thông cả `n` đỉnh, hoặc `-1` nếu đồ thị không liên thông.",
      functionName: "kruskalMST",
      starterCode: `function kruskalMST(n, edges) {
  if (n <= 1) return 0;
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const parent = Array.from({ length: n }, (_, i) => i);

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  let mstWeight = 0;
  let edgesUsed = 0;
  // TODO: Duyệt sorted edges, dùng find(u) và find(v) để gộp nhóm
  
  return edgesUsed === n - 1 ? mstWeight : -1;
}`,
      solutionCode: `function kruskalMST(n, edges) {
  if (n <= 1) return 0;
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const parent = Array.from({ length: n }, (_, i) => i);

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  let mstWeight = 0;
  let edgesUsed = 0;
  for (const [u, v, w] of sorted) {
    const ru = find(u);
    const rv = find(v);
    if (ru !== rv) {
      parent[ru] = rv;
      mstWeight += w;
      edgesUsed++;
      if (edgesUsed === n - 1) break;
    }
  }
  return edgesUsed === n - 1 ? mstWeight : -1;
}`,
      hints: ["Nếu `ru !== rv` thì gán `parent[ru] = rv`, cộng `mstWeight += w` và tăng `edgesUsed++`."],
      testCases: [
        { name: "Đồ thị chuẩn 4 đỉnh", inputArgs: [4, [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]], expected: 19 },
        { name: "Đồ thị không liên thông (Edge Case)", inputArgs: [4, [[0, 1, 1], [2, 3, 2]]], expected: -1, isEdgeCase: true },
        { name: "1 đỉnh (Edge Case)", inputArgs: [1, []], expected: 0, isEdgeCase: true },
      ],
    },
  },

  {
    id: "dijkstra",
    code: "07.5",
    chapterId: "chapter-07-graphs",
    kind: "algorithm",
    algorithmId: "dijkstra",
    title: "Dijkstra's Shortest Path (Đường đi ngắn nhất)",
    subtitle: "Thuật toán tìm đường định vị bản đồ kinh điển trên đồ thị trọng số KHÔNG ÂM bằng Greedy + Relaxation.",
    theory: {
      problemAndApplications:
        "Cho đồ thị có trọng số KHÔNG ÂM (`w >= 0`) và đỉnh nguồn `src`. Hãy tìm đường đi có tổng trọng số nhỏ nhất từ `src` tới tất cả các đỉnh khác.",
      realWorldApps: [
        "Định tuyến GPS (Google Maps / Grab), giao thức định tuyến mạng OSPF trên Internet.",
      ],
      coreIntuition:
        "Tại mỗi bước, Dijkstra luôn chọn đỉnh chưa chốt có **khoảng cách tạm thời nhỏ nhất** để cố định (Greedy). Vì mọi cạnh đều KHÔNG ÂM (`>= 0`), không có đường vòng nào sau này có thể đi vòng qua đỉnh xa hơn để rút ngắn quãng đường xuống nhỏ hơn nữa!",
      mechanismSteps: [
        "Khởi tạo `dist[src] = 0`, mọi đỉnh khác `dist[v] = Infinity`.",
        "Đưa `(0, src)` vào Min-Heap (hoặc chọn đỉnh chưa chốt có `dist` nhỏ nhất).",
        "Lấy đỉnh `u` nhỏ nhất ra, đánh dấu đã chốt.",
        "Edge Relaxation: Với mọi cạnh `(u, v, w)`, nếu `dist[u] + w < dist[v]` → cập nhật `dist[v] = dist[u] + w`.",
      ],
      loopInvariant:
        "Ngay khi một đỉnh `u` được trích xuất khỏi Min-Heap (chốt), `dist[u]` ĐẢM BẢO là độ dài đường đi ngắn nhất chính xác tuyệt đối từ `src` đến `u` (CLRS Ch.24.3 — chỉ đúng khi w ≥ 0!).",
      complexityDeepDive: {
        timeExplanation: "Với Danh sách kề + Binary Min Heap: O((V + E) log V).",
        spaceExplanation: "Lưu mảng `dist`, `visited` và Min Heap → O(V + E).",
        best: "O((V + E) log V)",
        average: "O((V + E) log V)",
        worst: "O((V + E) log V)",
        space: "O(V + E)",
      },
      edgeCasesAndPitfalls: [
        "Gặp **Cạnh trọng số ÂM**: Dijkstra SẼ CHO KẾT QUẢ SAI vì giả định 'đã chốt là ngắn nhất' bị phá vỡ khi cộng thêm số âm ở bước sau! Khi có cạnh âm phải dùng **Bellman-Ford**.",
      ],
      tradeOffs: [
        "Dijkstra nhanh hơn Bellman-Ford rất nhiều trên đồ thị cạnh dương; còn nếu biết tọa độ đích và hàm ước lượng Heuristic, A* sẽ tìm đích nhanh hơn nữa.",
      ],
      references: ["MIT 6.006 — Lecture 13: Dijkstra", "CLRS — Chapter 24.3 (Dijkstra's Algorithm)"],
    },
    quizQuestions: [
      {
        id: "dij-q1",
        question: "Vì sao Dijkstra có thể cho KẾT QUẢ SAI khi đồ thị tồn tại cạnh có trọng số ÂM?",
        options: [
          "Vì Priority Queue không chứa được số âm",
          "Vì Dijkstra chốt vĩnh viễn đỉnh gần nhất ở hiện tại với niềm tin không đường vòng nào đi tiếp mà ngắn hơn được nữa — niềm tin này sụp đổ khi cộng thêm cạnh âm",
          "Vì Dijkstra chỉ chạy trên đồ thị vô hướng",
          "Vì độ phức tạp bị tăng thành O(2^V)",
        ],
        correctIndex: 1,
        explanation: "Với cạnh dương, đường đi dài dần ra mỗi bước. Khi có cạnh âm, một nhánh ban đầu trông đắt hơn nhưng đi tiếp gặp cạnh -100 có thể rẻ hơn nhánh đã chốt!",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Dijkstra (Tìm khoảng cách ngắn nhất từ đỉnh src)",
      prompt:
        "Cho `n` đỉnh (`0 .. n-1`), danh sách cạnh có hướng không âm `edges = [[u, v, w], ...]`, và đỉnh nguồn `src`. Viết hàm `dijkstraDistances(n, edges, src)` trả về mảng `dist` độ dài `n` chứa khoảng cách ngắn nhất từ `src` tới mỗi đỉnh (đỉnh không tới được gán `-1`).",
      functionName: "dijkstraDistances",
      starterCode: `function dijkstraDistances(n, edges, src) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) adj[u].push([v, w]);

  const dist = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  dist[src] = 0;

  // TODO: Lặp n lần: chọn đỉnh u chưa visited có dist[u] nhỏ nhất, rồi Relax các cạnh kề
  
  return dist.map((d) => (d === Infinity ? -1 : d));
}`,
      solutionCode: `function dijkstraDistances(n, edges, src) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) adj[u].push([v, w]);

  const dist = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  dist[src] = 0;

  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (u === -1 || dist[u] === Infinity) break;
    visited[u] = true;

    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  return dist.map((d) => (d === Infinity ? -1 : d));
}`,
      hints: ["Chọn `u` chưa `visited` với `dist[u]` min, đánh dấu `visited[u] = true`, rồi cập nhật `dist[v] = Math.min(dist[v], dist[u] + w)`."],
      testCases: [
        { name: "Đồ thị có hướng chuẩn", inputArgs: [4, [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1], [2, 3, 5]], 0], expected: [0, 3, 1, 4] },
        { name: "Có đỉnh không tới được (Edge Case)", inputArgs: [4, [[0, 1, 2], [2, 3, 5]], 0], expected: [0, 2, -1, -1], isEdgeCase: true },
        { name: "1 đỉnh nguồn (Edge Case)", inputArgs: [1, [], 0], expected: [0], isEdgeCase: true },
      ],
    },
  },

  {
    id: "bellman-ford",
    code: "07.6",
    chapterId: "chapter-07-graphs",
    kind: "algorithm",
    algorithmId: "bellman-ford",
    title: "Bellman-Ford Algorithm (Hỗ trợ Trọng số Âm)",
    subtitle: "Giải bài toán đường đi ngắn nhất khi có cạnh âm và phát hiện Chu trình Âm sau V - 1 lượt Relax.",
    theory: {
      problemAndApplications:
        "Làm sao tìm đường đi ngắn nhất khi đồ thị có cạnh trọng số ÂM (VD: hoàn tiền, chênh lệch tỷ giá tiền tệ, chi phí ròng) — nơi Dijkstra thất bại hoàn toàn?",
      realWorldApps: [
        "Phát hiện cơ hội chênh lệch tỷ giá ngoại hối (Currency Arbitrage — chính là tìm Chu trình Âm sau khi lấy `-log(tỷ giá)`!).",
        "Giao thức định tuyến vector khoảng cách RIP (Routing Information Protocol).",
      ],
      coreIntuition:
        "Một đường đi đơn giản bất kỳ trên đồ thị V đỉnh không chứa chu trình thì có **tối đa V - 1 cạnh**. Do đó, nếu ta kiên nhẫn thực hiện nới lỏng (Relax) TẤT CẢ các cạnh đúng `V - 1` vòng, khoảng cách ngắn nhất chắc chắn lan truyền qua đủ mọi cạnh bất chấp trọng số âm! Nếu sang vòng thứ `V` mà vẫn có cạnh rút ngắn thêm được nữa → chắc chắn đồ thị có **Chu trình Âm**!",
      mechanismSteps: [
        "Khởi tạo `dist[src] = 0`, mọi đỉnh khác `Infinity`.",
        "Lặp `V - 1` lần: với mỗi cạnh `(u, v, w)`, nếu `dist[u] !== Infinity && dist[u] + w < dist[v]` → `dist[v] = dist[u] + w`.",
        "(Tối ưu) Nếu trong 1 vòng không có cạnh nào cập nhật thêm → dừng sớm!",
        "Kiểm tra Chu trình Âm: Chạy thêm 1 vòng kiểm tra tất cả các cạnh; nếu còn cạnh giảm được `dist[v]` → trả về báo hiệu có chu trình âm.",
      ],
      loopInvariant:
        "Sau lượt nới lỏng thứ `k`, `dist[v]` không lớn hơn độ dài của bất kỳ đường đi nào từ `src` tới `v` có tối đa `k` cạnh (MIT 6.006 L12 / CLRS Ch.24.1).",
      complexityDeepDive: {
        timeExplanation: "V - 1 vòng × E cạnh → O(V · E). Chậm hơn Dijkstra trên cạnh dương nhưng tổng quát hơn.",
        spaceExplanation: "Mảng `dist` kích thước V → O(V).",
        best: "O(E) nếu dừng sớm",
        average: "O(V · E)",
        worst: "O(V · E)",
        space: "O(V)",
      },
      edgeCasesAndPitfalls: [
        "Lỗi `Infinity + (-5)`: Phải luôn kiểm tra `dist[u] !== Infinity` TRƯỚC khi cộng trọng số `w`!",
        "Quên lượt kiểm tra thứ V phát hiện chu trình âm (Negative Weight Cycle).",
      ],
      tradeOffs: [
        "Dùng Dijkstra O((V+E)log V) khi mọi cạnh ≥ 0; bắt buộc dùng Bellman-Ford O(V·E) khi có cạnh âm hoặc cần phát hiện chu trình âm.",
      ],
      references: ["MIT 6.006 — Lecture 12: Bellman-Ford", "CLRS — Chapter 24.1 (The Bellman-Ford Algorithm)"],
    },
    quizQuestions: [
      {
        id: "bf-q1",
        question: "Tại sao Bellman-Ford phải lặp tối đa đúng `V - 1` vòng nới lỏng toàn bộ cạnh?",
        options: [
          "Vì đồ thị luôn có V - 1 cạnh",
          "Vì một đường đi ngắn nhất không chứa chu trình qua V đỉnh chỉ có thể đi qua tối đa V - 1 cạnh",
          "Để kiểm tra mọi cặp đỉnh",
          "Vì mỗi đỉnh chỉ được Relax 1 lần",
        ],
        correctIndex: 1,
        explanation: "Đường đi đơn qua tối đa V đỉnh có nhiều nhất V - 1 cạnh; mỗi vòng đảm bảo lan truyền được ít nhất 1 cạnh tiến tới đáp án chuẩn.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Bellman-Ford & Phát hiện Chu trình Âm",
      prompt:
        "Cho `n` đỉnh (`0..n-1`), danh sách cạnh `edges = [[u, v, w], ...]`, đỉnh nguồn `src`. Viết hàm `bellmanFord(n, edges, src)` trả về mảng `dist` (đỉnh không tới được thay bằng `null`), hoặc trả về chuỗi `'NEGATIVE_CYCLE'` nếu phát hiện chu trình âm tới được từ `src`.",
      functionName: "bellmanFord",
      starterCode: `function bellmanFord(n, edges, src) {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;

  // TODO: Lặp n - 1 lượt nới lỏng toàn bộ cạnh
  
  // TODO: Kiểm tra lượt thứ n xem có phát hiện chu trình âm không (trả về "NEGATIVE_CYCLE")

  return dist.map((d) => (d === Infinity ? null : d));
}`,
      solutionCode: `function bellmanFord(n, edges, src) {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;

  for (let i = 0; i < n - 1; i++) {
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
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      return "NEGATIVE_CYCLE";
    }
  }

  return dist.map((d) => (d === Infinity ? null : d));
}`,
      hints: ["Nhớ kiểm tra `dist[u] !== Infinity` trước khi tính `dist[u] + w < dist[v]`."],
      testCases: [
        { name: "Có cạnh âm nhưng KHÔNG có chu trình âm", inputArgs: [4, [[0, 1, 4], [0, 2, 5], [1, 2, -2], [2, 3, 3]], 0], expected: [0, 4, 2, 5] },
        { name: "Phát hiện chu trình âm (Edge Case)", inputArgs: [3, [[0, 1, 2], [1, 2, -4], [2, 0, 1]], 0], expected: "NEGATIVE_CYCLE", isEdgeCase: true },
        { name: "Có đỉnh không tới được", inputArgs: [3, [[0, 1, 5]], 0], expected: [0, 5, null] },
      ],
    },
  },

  {
    id: "a-star",
    code: "07.7",
    chapterId: "chapter-07-graphs",
    kind: "algorithm",
    algorithmId: "a-star",
    title: "A* Pathfinding Search (Tìm đường có Định hướng)",
    subtitle: "Kết hợp Dijkstra với hàm ước lượng Heuristic f(n) = g(n) + h(n) để tìm đích nhanh vượt trội trong Game/Robot.",
    theory: {
      problemAndApplications:
        "Trên bản đồ lưới 2D hoặc bản đồ đường xá, Dijkstra mở rộng tỏa tròn vô hướng về mọi phía kể cả hướng ngược lại đích. Làm sao hướng thuật toán tiến thẳng về đích mà VẪN đảm bảo tìm ra đường ngắn nhất?",
      realWorldApps: [
        "Tìm đường cho nhân vật trong Game (Unity/Unreal NavMesh), điều hướng xe tự hành và Robot kho hàng.",
      ],
      coreIntuition:
        "A* đánh giá mỗi ô theo công thức `f(n) = g(n) + h(n)`: trong đó `g(n)` là chi phí THỰC TẾ đã đi từ Start tới n, còn `h(n)` (Heuristic) là khoảng cách ƯỚC LƯỢNG từ n đến Goal (VD: Manhattan Distance `|x1-x2| + |y1-y2|`). Nhờ `h(n)` định hướng, A* ưu tiên mở các ô nằm hướng về đích trước!",
      mechanismSteps: [
        "Tính `h(node) = |node.row - end.row| + |node.col - end.col|` (trên lưới 4 hướng).",
        "Duy trì `Open Set` (Min-Heap ưu tiên theo `f = g + h`), khởi tạo `g[start] = 0`, `f[start] = h(start)`.",
        "Lấy ô có `f` nhỏ nhất: nếu là `Goal` → tìm xong đường đi ngắn nhất!",
        "Mở rộng 4 ô láng giềng hợp lệ (không phải tường), cập nhật `g` và `f` nếu tìm được đường tốt hơn.",
      ],
      loopInvariant:
        "Định lý A* Admissibility (Hart, Nilsson & Raphael 1968): Nếu hàm Heuristic `h(n)` **không bao giờ đánh giá quá cao** chi phí thực tế (`h(n) <= h*(n)` — gọi là Admissible), A* ĐẢM BẢO luôn tìm ra đường đi tối ưu!",
      complexityDeepDive: {
        timeExplanation: "Phụ thuộc vào độ chính xác của `h(n)`: tốt nhất có thể đi thẳng O(Độ dài đường đi); tệ nhất trên mê cung phức tạp là O(E log V) tương đương Dijkstra.",
        spaceExplanation: "Cần lưu Open Set và Closed Set các ô đã duyệt → O(V).",
        best: "O(d)",
        average: "Nhanh hơn Dijkstra nhiều lần",
        worst: "O(V log V)",
        space: "O(V)",
      },
      edgeCasesAndPitfalls: [
        "Nếu `h(n)` quá lớn (`h(n) > chi phí thực`): A* biến thành Greedy Best-First Search — chạy nhanh nhưng KHÔNG còn đảm bảo ngắn nhất!",
        "Khi `h(n) = 0`: A* thu về chính xác là thuật toán Dijkstra.",
      ],
      tradeOffs: [
        "Tối ưu nhất cho tìm đường từ 1 điểm tới 1 đích cụ thể (Single-Pair) khi biết tọa độ hình học; không phù hợp khi cần tìm đường tới tất cả mọi đỉnh.",
      ],
      references: ["Russell & Norvig — Artificial Intelligence: A Modern Approach (Ch.3 Informed Search)", "Stanford Red Blob Games A*"],
    },
    quizQuestions: [
      {
        id: "astar-q1",
        question: "Trong công thức `f(n) = g(n) + h(n)` của thuật toán A*, điều kiện nào đối với `h(n)` để A* ĐẢM BẢO luôn tìm ra đường đi ngắn nhất?",
        options: [
          "h(n) phải luôn lớn hơn chi phí thực tế",
          "h(n) phải chấp nhận được (Admissible) — tức là KHÔNG BAO GIỜ ước lượng quá cao (lớn hơn) khoảng cách thực tế tới đích",
          "h(n) phải luôn bằng N²",
          "h(n) phải là số âm",
        ],
        correctIndex: 1,
        explanation: "Ví dụ trên lưới đi 4 hướng, khoảng cách Manhattan luôn <= khoảng cách đi thật qua chướng ngại vật nên là Admissible, đảm bảo A* luôn tối ưu.",
      },
    ],
    codeChallenge: {
      title: "Tìm đường ngắn nhất trên Lưới 2D bằng A* (Manhattan Heuristic)",
      prompt:
        "Cho lưới `grid` kích thước R×C (`0` là đường đi, `1` là tường), điểm đầu `start = [r1, c1]` và đích `end = [r2, c2]` (di chuyển 4 hướng). Viết hàm `aStarGrid(grid, start, end)` trả về độ dài đường đi ngắn nhất (số bước) từ `start` đến `end`, hoặc `-1` nếu không có đường.",
      functionName: "aStarGrid",
      starterCode: `function aStarGrid(grid, start, end) {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  if (!rows || !cols || grid[start[0]][start[1]] === 1 || grid[end[0]][end[1]] === 1) return -1;

  const h = (r, c) => Math.abs(r - end[0]) + Math.abs(c - end[1]);
  const gScore = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  const closed = Array.from({ length: rows }, () => new Array(cols).fill(false));

  gScore[start[0]][start[1]] = 0;
  // Hàng đợi ưu tiên đơn giản lưu [r, c, f]
  const open = [[start[0], start[1], h(start[0], start[1])]];

  // TODO: Lặp lấy phần tử có f nhỏ nhất trong open, nếu tới end thì trả về gScore[r][c]
  
  return -1;
}`,
      solutionCode: `function aStarGrid(grid, start, end) {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  if (!rows || !cols || grid[start[0]][start[1]] === 1 || grid[end[0]][end[1]] === 1) return -1;

  const h = (r, c) => Math.abs(r - end[0]) + Math.abs(c - end[1]);
  const gScore = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  const closed = Array.from({ length: rows }, () => new Array(cols).fill(false));

  gScore[start[0]][start[1]] = 0;
  const open = [[start[0], start[1], h(start[0], start[1])]];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (open.length > 0) {
    let bestIdx = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i][2] < open[bestIdx][2]) bestIdx = i;
    }
    const [r, c] = open.splice(bestIdx, 1)[0];
    if (r === end[0] && c === end[1]) return gScore[r][c];
    if (closed[r][c]) continue;
    closed[r][c] = true;

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0 && !closed[nr][nc]) {
        const nextG = gScore[r][c] + 1;
        if (nextG < gScore[nr][nc]) {
          gScore[nr][nc] = nextG;
          open.push([nr, nc, nextG + h(nr, nc)]);
        }
      }
    }
  }
  return -1;
}`,
      hints: ["Chọn ô trong `open` có `f` min, kiểm tra nếu `(r, c) === end` thì trả `gScore[r][c]`, ngược lại mở 4 hướng hợp lệ."],
      testCases: [
        { name: "Lưới có chướng ngại vật", inputArgs: [[[0, 0, 0], [1, 1, 0], [0, 0, 0]], [0, 0], [2, 2]], expected: 4 },
        { name: "Bị chặn hoàn toàn (Edge Case)", inputArgs: [[[0, 1, 0], [0, 1, 0], [0, 1, 0]], [0, 0], [2, 2]], expected: -1, isEdgeCase: true },
        { name: "Start trùng End (Edge Case)", inputArgs: [[[0]], [0, 0], [0, 0]], expected: 0, isEdgeCase: true },
      ],
    },
  },
];
