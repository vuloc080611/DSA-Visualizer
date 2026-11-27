import { CourseLesson } from "../types";

export const LESSONS_CH02_CH03: CourseLesson[] = [
  // =================== CHƯƠNG 02: CẤU TRÚC TUYẾN TÍNH ===================
  {
    id: "linear-ops",
    code: "02.1",
    chapterId: "chapter-02-linear-structures",
    kind: "algorithm",
    algorithmId: "linear-ops",
    title: "Thao tác Stack & Queue (LIFO / FIFO)",
    subtitle: "Làm chủ Ngăn xếp (LIFO) và Hàng đợi (FIFO) — hai kiểu dữ liệu trừu tượng xương sống của hệ điều hành.",
    theory: {
      problemAndApplications:
        "Trong nhiều hệ thống, ta không cần truy cập phần tử ở giữa mà chỉ cần quản lý thứ tự xử lý: hoặc ưu tiên tác vụ mới nhất (Undo trong Word, Call Stack), hoặc xử lý công bằng theo thứ tự đến trước (hàng đợi máy in, duyệt BFS).",
      realWorldApps: [
        "Stack (LIFO): Nút Back của trình duyệt, cơ chế Undo/Redo, Call Stack lưu hàm đang chạy.",
        "Queue (FIFO): Hàng đợi tác vụ (Message Queue như Kafka/RabbitMQ), lập lịch tiến trình CPU, thuật toán BFS.",
      ],
      coreIntuition:
        "Stack giống như một chồng đĩa trong ống: đĩa đặt vào sau cùng nằm trên đỉnh nên bắt buộc phải lấy ra đầu tiên (Last-In First-Out). Queue giống như hàng người xếp hàng mua vé: người đến trước đứng ở đầu hàng được phục vụ trước (First-In First-Out).",
      mechanismSteps: [
        "Stack: `push(x)` đẩy x lên đỉnh, `pop()` rút phần tử ở đỉnh, `peek()` xem phần tử ở đỉnh (đều O(1)).",
        "Queue: `enqueue(x)` thêm x vào cuối hàng (Back), `dequeue()` rút phần tử ở đầu hàng (Front).",
        "Lưu ý cài đặt: Queue cài bằng mảng thường tốn O(N) khi `shift()` đầu mảng; để đạt O(1) thật sự cần dùng Danh sách liên kết hoặc Mảng vòng (Circular Buffer).",
      ],
      loopInvariant:
        "Stack luôn bảo toàn thứ tự đảo ngược lịch sử đẩy vào; Queue luôn bảo toàn thứ tự thời gian đến trước – phục vụ trước.",
      complexityDeepDive: {
        timeExplanation: "Push/Pop/Peek của Stack là O(1). Enqueue/Dequeue của Queue dùng con trỏ Front/Rear hoặc Circular Array cũng là O(1).",
        spaceExplanation: "Chứa tối đa N phần tử đang lưu trong cấu trúc → O(N).",
        best: "O(1)",
        average: "O(1)",
        worst: "O(1)",
        space: "O(N)",
      },
      edgeCasesAndPitfalls: [
        "Stack Underflow / Queue Empty: Gọi `pop()` hoặc `dequeue()` khi cấu trúc đang rỗng.",
        "Dùng `Array.shift()` trong JS cho Queue lớn (N > 10^5) có thể khiến tổng thời gian thành O(N²) do dịch chuyển phần tử.",
      ],
      tradeOffs: [
        "Stack dùng cho bài toán cần quay lui/ghi nhớ trạng thái gần nhất; Queue dùng cho bài toán cần công bằng thứ tự/mở rộng theo từng lớp.",
      ],
      references: ["Princeton Algorithms 4th Ed — Section 1.3: Bags, Queues, and Stacks", "OpenDSA — Chapter 3: Stacks & Queues"],
    },
    quizQuestions: [
      {
        id: "lin-q1",
        question: "Nếu thực hiện lần lượt Push(1), Push(2), Push(3), Pop(), Push(4), Pop() trên một Stack rỗng thì phần tử Pop ra ở lần thứ hai là số mấy?",
        options: ["1", "2", "3", "4"],
        correctIndex: 3,
        explanation: "Sau Pop() lần 1 (lấy 3), Stack còn [1, 2]. Push(4) tạo thành [1, 2, 4]. Pop() lần 2 lấy ngay đỉnh mới nhất là 4!",
      },
      {
        id: "lin-q2",
        question: "Trong JavaScript, nếu dùng mảng thường `arr.shift()` để làm Queue cho thuật toán BFS đồ thị lớn, điều gì bất lợi xảy ra?",
        options: [
          "arr.shift() trả về phần tử cuối",
          "arr.shift() tốn O(N) để dời toàn bộ phần tử còn lại sang trái mỗi lần lấy ra",
          "arr.shift() chỉ hoạt động với số nguyên",
          "Không có nhược điểm nào",
        ],
        correctIndex: 1,
        explanation: "Xóa phần tử ở index 0 của mảng liên tiếp buộc các phần tử sau phải dịch chuyển O(N). Nên dùng 2 con trỏ `head++` hoặc Linked List.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Min Stack hoặc Đảo ngược mảng bằng Stack",
      prompt:
        "Cho một mảng các thao tác mô phỏng: `ops` là mảng các số nguyên (nếu `x >= 0`: push `x` vào Stack; nếu `x === -1`: pop phần tử trên đỉnh Stack nếu không rỗng). Viết hàm `simulateStack(ops)` trả về mảng trạng thái cuối cùng của Stack.",
      functionName: "simulateStack",
      starterCode: `function simulateStack(ops) {
  const stack = [];
  for (const op of ops) {
    // Nếu op === -1 và stack không rỗng -> pop
    // Ngược lại nếu op >= 0 -> push op
    
  }
  return stack;
}`,
      solutionCode: `function simulateStack(ops) {
  const stack = [];
  for (const op of ops) {
    if (op === -1) {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(op);
    }
  }
  return stack;
}`,
      hints: ["Kiểm tra `op === -1` và nhớ kiểm tra `stack.length > 0` trước khi `.pop()`."],
      testCases: [
        { name: "Thao tác Push & Pop chuẩn", inputArgs: [[10, 20, -1, 30, 40, -1]], expected: [10, 30] },
        { name: "Pop khi Stack rỗng (Edge Case)", inputArgs: [[-1, -1, 5, 6]], expected: [5, 6], isEdgeCase: true },
        { name: "Xóa sạch Stack", inputArgs: [[1, 2, -1, -1]], expected: [] },
        { name: "Dãy rỗng (Edge Case)", inputArgs: [[]], expected: [], isEdgeCase: true },
      ],
    },
  },

  {
    id: "reverse-linked-list",
    code: "02.2",
    chapterId: "chapter-02-linear-structures",
    kind: "algorithm",
    algorithmId: "reverse-linked-list",
    title: "Reverse Linked List (Đảo ngược Danh sách liên kết)",
    subtitle: "Đảo chiều toàn bộ con trỏ next tại chỗ với bộ nhớ phụ O(1) bằng kỹ thuật 3 con trỏ.",
    theory: {
      problemAndApplications:
        "Cho con trỏ `head` của một danh sách liên kết đơn (Singly Linked List). Hãy đảo ngược hướng liên kết của tất cả các node để phần tử cuối trở thành `head` mới mà không tạo mảng mới.",
      realWorldApps: [
        "Thao tác Undo lịch sử chuỗi sự kiện, xử lý đa thức biểu diễn qua danh sách liên kết.",
        "Bước con bắt buộc trong nhiều bài toán phỏng vấn (Palindrome Linked List, Reverse Nodes in k-Group).",
      ],
      coreIntuition:
        "Mỗi node chỉ có 1 sợi dây `next` trỏ sang node kế tiếp. Nếu bạn bẻ dây `curr.next` quay ngược về `prev` ngay lập tức, bạn sẽ làm đứt mất liên kết tới phần còn lại! Vì thế ta cần biến thứ 3 `nextTemp = curr.next` để giữ chặt phần đuôi trước khi bẻ hướng mũi tên.",
      mechanismSteps: [
        "Khởi tạo `prev = null` và `curr = head`.",
        "Khi `curr !== null`: lưu `nextTemp = curr.next`.",
        "Đảo chiều con trỏ: `curr.next = prev`.",
        "Tịnh tiến cả hai con trỏ: `prev = curr`, `curr = nextTemp`.",
        "Khi `curr === null`, `prev` chính là `head` mới.",
      ],
      loopInvariant:
        "Đoạn danh sách từ `prev` trở về trước đã được đảo ngược hoàn chỉnh, trong khi đoạn từ `curr` đến cuối vẫn giữ nguyên trật tự ban đầu.",
      complexityDeepDive: {
        timeExplanation: "Duyệt qua mỗi node đúng 1 lần → O(N).",
        spaceExplanation: "Chỉ dùng 3 con trỏ phụ (prev, curr, nextTemp) → O(1) Space (tối ưu hơn đệ quy O(N) Call Stack).",
        best: "O(N)",
        average: "O(N)",
        worst: "O(N)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Danh sách rỗng (`head === null`) hoặc chỉ có 1 node: Trả về ngay `head`.",
        "Quên lưu `nextTemp` trước khi gán `curr.next = prev` dẫn đến mất toàn bộ phần sau danh sách.",
      ],
      tradeOffs: [
        "Bản lặp (Iterative) dùng O(1) Space an toàn cho danh sách hàng triệu node; bản đệ quy gọn nhưng có nguy cơ tràn Stack nếu N > 10^4.",
      ],
      references: ["CLRS — Chapter 10.2 (Linked Lists)", "LeetCode 206: Reverse Linked List"],
    },
    quizQuestions: [
      {
        id: "rll-q1",
        question: "Tại sao trong vòng lặp đảo ngược danh sách liên kết ta BẮT BUỘC phải lưu `nextTemp = curr.next` trước khi gán `curr.next = prev`?",
        options: [
          "Để tăng tốc độ CPU",
          "Vì ngay khi gán `curr.next = prev`, tham chiếu tới node tiếp theo sẽ bị ghi đè và mất vĩnh viễn nếu chưa lưu lại",
          "Để tạo bản sao mới cho node",
          "Không cần lưu, có thể gán ngược lại sau",
        ],
        correctIndex: 1,
        explanation: "Danh sách liên kết đơn chỉ có con trỏ tiến, nên ghi đè `curr.next` trước khi lưu `nextTemp` sẽ làm đứt chuỗi.",
      },
    ],
    codeChallenge: {
      title: "Đảo ngược Danh sách (Mảng đại diện Linked List / Con trỏ)",
      prompt:
        "Để tập trung vào thuật toán 3 con trỏ: hàm `reverseListNodes(values)` nhận vào mảng các giá trị node (từ `head` đến cuối), hãy dựng thành Linked List `{ val, next }`, chạy thuật toán 3 con trỏ `prev / curr / nextTemp` để đảo ngược, rồi trả về mảng các giá trị theo thứ tự mới.",
      functionName: "reverseListNodes",
      starterCode: `function reverseListNodes(values) {
  // Dựng danh sách liên kết đơn từ mảng values
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) {
    head = { val: values[i], next: head };
  }

  // TODO: Đảo ngược danh sách bằng 3 con trỏ prev, curr, nextTemp
  let prev = null;
  let curr = head;
  while (curr !== null) {
    
  }

  // Chuyển danh sách kết quả (bắt đầu từ prev) thành mảng để chấm điểm
  const result = [];
  let p = prev;
  while (p !== null) {
    result.push(p.val);
    p = p.next;
  }
  return result;
}`,
      solutionCode: `function reverseListNodes(values) {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) {
    head = { val: values[i], next: head };
  }

  let prev = null;
  let curr = head;
  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }

  const result = [];
  let p = prev;
  while (p !== null) {
    result.push(p.val);
    p = p.next;
  }
  return result;
}`,
      hints: ["Bên trong `while (curr !== null)`: lưu `const nextTemp = curr.next; curr.next = prev; prev = curr; curr = nextTemp;`."],
      testCases: [
        { name: "Danh sách 5 node", inputArgs: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
        { name: "Danh sách 2 node", inputArgs: [[10, 20]], expected: [20, 10] },
        { name: "1 node (Edge Case)", inputArgs: [[99]], expected: [99], isEdgeCase: true },
        { name: "Danh sách rỗng (Edge Case)", inputArgs: [[]], expected: [], isEdgeCase: true },
      ],
    },
  },

  {
    id: "floyd-cycle",
    code: "02.3",
    chapterId: "chapter-02-linear-structures",
    kind: "algorithm",
    algorithmId: "floyd-cycle",
    title: "Floyd's Cycle Detection (Rùa & Thỏ)",
    subtitle: "Phát hiện vòng lặp vô hạn trong danh sách liên kết hoặc dãy chuyển trạng thái bằng bộ nhớ O(1).",
    theory: {
      problemAndApplications:
        "Làm sao biết một danh sách liên kết có bị nối vòng (Cycle) hay kết thúc ở `null`, nếu ta không được phép dùng HashSet O(N) bộ nhớ? Thuật toán Rùa & Thỏ của Robert Floyd giải quyết bài toán này chỉ với 2 con trỏ.",
      realWorldApps: [
        "Phát hiện chu trình vô hạn trong bộ thu gom rác (Garbage Collector), đồ thị trạng thái, và thuật toán Pollard's Rho phân tích thừa số nguyên tố.",
        "Bài toán kinh điển tìm số trùng lặp (Find the Duplicate Number) trong mảng chỉ dùng O(1) bộ nhớ.",
      ],
      coreIntuition:
        "Hãy tưởng tượng hai vận động viên chạy trên một đường đua khép kín: Rùa chạy 1 bước/lượt, Thỏ chạy 2 bước/lượt. Nếu đường chạy là đường thẳng có đích (`null`), Thỏ sẽ về đích trước. Nếu đường chạy là vòng tròn (có chu trình), Thỏ chắc chắn sẽ đuổi kịp và gặp Rùa (vận tốc tương đối = 2 - 1 = 1 bước/lượt nên không bao giờ nhảy cóc qua Rùa!).",
      mechanismSteps: [
        "Khởi tạo hai con trỏ `slow = head`, `fast = head`.",
        "Trong khi `fast !== null && fast.next !== null`: `slow = slow.next` (1 bước), `fast = fast.next.next` (2 bước).",
        "Nếu `slow === fast` → chắc chắn tồn tại chu trình (`return true`).",
        "Nếu `fast` chạm `null` → không có chu trình (`return false`).",
      ],
      loopInvariant:
        "Khoảng cách giữa Thỏ và Rùa trong vòng tròn giảm đúng 1 bước sau mỗi lượt đi nên hai con trỏ buộc phải gặp nhau trong ≤ độ dài chu trình.",
      complexityDeepDive: {
        timeExplanation: "Rùa đi tối đa N bước, Thỏ đi tối đa 2N bước → O(N).",
        spaceExplanation: "Chỉ dùng 2 con trỏ `slow` và `fast` → O(1) Space (ăn đứt HashSet O(N) Space).",
        best: "O(N)",
        average: "O(N)",
        worst: "O(N)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Quên kiểm tra cả `fast !== null` LẪN `fast.next !== null` → gây lỗi `Cannot read properties of null` khi đọc `fast.next.next`.",
      ],
      tradeOffs: [
        "So với HashSet: Tốn O(1) bộ nhớ thay vì O(N), cực kỳ hữu ích trên hệ thống nhúng hoặc chuỗi trạng thái khổng lồ.",
      ],
      references: ["CLRS / Knuth TAOCP Vol.2 (Cycle Detection)", "LeetCode 141 & 142: Linked List Cycle"],
    },
    quizQuestions: [
      {
        id: "floyd-q1",
        question: "Tại sao trong vòng lặp Rùa & Thỏ, Thỏ (đi 2 bước) KHÔNG bao giờ 'nhảy vọt qua đầu' Rùa (đi 1 bước) mà không gặp nhau?",
        options: [
          "Vì Rùa và Thỏ đi ngược chiều nhau",
          "Vì hiệu vận tốc là 2 - 1 = 1 bước mỗi lượt, khoảng cách giảm đều đặn từng đơn vị 1 nên chắc chắn chạm mốc 0 (gặp nhau)",
          "Vì vòng lặp tự động chậm lại khi gần nhau",
          "Vì danh sách liên kết luôn có độ dài chẵn",
        ],
        correctIndex: 1,
        explanation: "Giả sử Thỏ cách Rùa k bước phía sau trong vòng tròn: sau 1 lượt khoảng cách thành k + 1 - 2 = k - 1. Vì mỗi lượt giảm đúng 1, sẽ có lúc khoảng cách bằng 0!",
      },
    ],
    codeChallenge: {
      title: "Phát hiện Chu trình bằng Floyd's Tortoise & Hare",
      prompt:
        "Hàm `hasCycle(values, cyclePos)` nhận mảng `values` để dựng Linked List; nếu `cyclePos >= 0`, node cuối sẽ trỏ ngược về node tại chỉ số `cyclePos` (nếu `-1` thì trỏ `null`). Hãy dùng thuật toán `slow / fast` trả về `true` nếu có chu trình, `false` nếu không.",
      functionName: "hasCycle",
      starterCode: `function hasCycle(values, cyclePos) {
  if (values.length === 0) return false;
  const nodes = values.map((v) => ({ val: v, next: null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (cyclePos >= 0 && cyclePos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[cyclePos];
  }
  const head = nodes[0];

  // TODO: Dùng slow và fast (Rùa & Thỏ) kiểm tra chu trình
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    
  }
  return false;
}`,
      solutionCode: `function hasCycle(values, cyclePos) {
  if (values.length === 0) return false;
  const nodes = values.map((v) => ({ val: v, next: null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (cyclePos >= 0 && cyclePos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[cyclePos];
  }
  const head = nodes[0];

  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      hints: ["Cập nhật `slow = slow.next; fast = fast.next.next;` rồi kiểm tra `if (slow === fast) return true;`."],
      testCases: [
        { name: "Có chu trình tại index 1", inputArgs: [[3, 2, 0, -4], 1], expected: true },
        { name: "Tự vòng ở node đầu (index 0)", inputArgs: [[1, 2], 0], expected: true },
        { name: "Không có chu trình", inputArgs: [[1, 2, 3, 4], -1], expected: false },
        { name: "1 node không chu trình (Edge Case)", inputArgs: [[1], -1], expected: false, isEdgeCase: true },
      ],
    },
  },

  {
    id: "valid-parentheses",
    code: "02.4",
    chapterId: "chapter-02-linear-structures",
    kind: "algorithm",
    algorithmId: "valid-parentheses",
    title: "Valid Parentheses (Ứng dụng Stack)",
    subtitle: "Kiểm tra tính hợp lệ của dấu ngoặc lồng nhau trong trình biên dịch bằng Ngăn xếp LIFO.",
    theory: {
      problemAndApplications:
        "Cho chuỗi `s` chỉ gồm các dấu ngoặc `(`, `)`, `{`, `}`, `[`, `]`. Hãy kiểm tra xem chuỗi ngoặc có đóng mở đúng thứ tự và khớp loại hay không (VD: `({[]})` hợp lệ, `([)]` không hợp lệ).",
      realWorldApps: [
        "Bộ kiểm tra cú pháp (Parser / Linter) cho mã nguồn C++, Java, JavaScript, JSON và biểu thức HTML.",
      ],
      coreIntuition:
        "Dấu ngoặc mở NÀO xuất hiện sau cùng thì bắt buộc phải được đóng LẠI đầu tiên! Quy tắc 'mở sau đóng trước' khớp hoàn hảo với tính chất LIFO (Last-In First-Out) của Stack.",
      mechanismSteps: [
        "Duyệt từng ký tự ch trong chuỗi s.",
        "Nếu ch là ngoặc mở (`(`, `{`, `[`) → push vào Stack.",
        "Nếu ch là ngoặc đóng (`)`, `}`, `]`) → nếu Stack rỗng thì sai ngay (`return false`); ngược lại pop đỉnh Stack ra và kiểm tra xem có cùng cặp với ch không.",
        "Kết thúc chuỗi: Hợp lệ khi và chỉ khi Stack RỖNG (không còn ngoặc mở nào bị quên đóng).",
      ],
      loopInvariant:
        "Mọi phần tử nằm trong Stack tại bước i đều là các dấu ngoặc mở đang 'chờ' cặp đóng tương ứng của nó theo đúng thứ tự lồng nhau.",
      complexityDeepDive: {
        timeExplanation: "Duyệt mỗi ký tự đúng 1 lần, mỗi dấu ngoặc push và pop tối đa 1 lần → O(N).",
        spaceExplanation: "Trường hợp tệ nhất chuỗi toàn ngoặc mở `(((((` → Stack chứa N phần tử → O(N).",
        best: "O(1) khi sai sớm",
        average: "O(N)",
        worst: "O(N)",
        space: "O(N)",
      },
      edgeCasesAndPitfalls: [
        "Chuỗi chỉ toàn ngoặc mở `(((`: Quên kiểm tra `stack.length === 0` ở cuối hàm sẽ trả nhầm thành `true`!",
        "Chuỗi bắt đầu bằng ngoặc đóng `)`: Pop khi stack đang rỗng.",
        "Độ dài chuỗi lẻ: Có thể loại nhanh `if (s.length % 2 !== 0) return false`.",
      ],
      tradeOffs: [
        "Stack kết hợp bảng ánh xạ `pairs = { ')': '(', '}': '{', ']': '[' }` cho code sạch, dễ mở rộng cho các thẻ đóng mở HTML/XML.",
      ],
      references: ["Princeton Algorithms 4th Ed — Section 1.3 (Dijkstra Two-Stack / Parentheses)", "LeetCode 20: Valid Parentheses"],
    },
    quizQuestions: [
      {
        id: "vp-q1",
        question: "Khi kết thúc vòng lặp duyệt chuỗi dấu ngoặc mà không gặp lỗi sai cặp nào, điều kiện nào quyết định chuỗi có hợp lệ hay không?",
        options: [
          "Stack còn đúng 1 phần tử",
          "Stack hoàn toàn rỗng (`stack.length === 0`)",
          "Độ dài chuỗi phải chia hết cho 4",
          "Mặc định luôn hợp lệ",
        ],
        correctIndex: 1,
        explanation: "Nếu chuỗi là `((()`, vòng lặp kết thúc mà không gặp ngoặc đóng sai, nhưng Stack vẫn còn ngoặc mở chưa đóng nên phải kiểm tra `stack.length === 0`.",
      },
    ],
    codeChallenge: {
      title: "Kiểm tra Dấu ngoặc Hợp lệ (Valid Parentheses)",
      prompt: "Viết hàm `isValidParentheses(s)` trả về `true` nếu chuỗi `s` chứa các ngoặc `()[]{}` hợp lệ, ngược lại trả về `false`.",
      functionName: "isValidParentheses",
      starterCode: `function isValidParentheses(s) {
  const stack = [];
  const pairs = { ")": "(", "}": "{", "]": "[" };

  for (const ch of s) {
    // Xử lý ngoặc mở và ngoặc đóng
    
  }
  return stack.length === 0;
}`,
      solutionCode: `function isValidParentheses(s) {
  const stack = [];
  const pairs = { ")": "(", "}": "{", "]": "[" };

  for (const ch of s) {
    if (ch === "(" || ch === "{" || ch === "[") {
      stack.push(ch);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[ch]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      hints: ["Khi gặp ngoặc đóng `ch`, kiểm tra `stack.length === 0 || stack.pop() !== pairs[ch]`."],
      testCases: [
        { name: "Ngoặc lồng hợp lệ", inputArgs: ["({[]})"], expected: true },
        { name: "Ngoặc lồng đan chéo sai", inputArgs: ["([)]"], expected: false },
        { name: "Chỉ toàn ngoặc mở (Edge Case)", inputArgs: ["((("], expected: false, isEdgeCase: true },
        { name: "Bắt đầu bằng ngoặc đóng (Edge Case)", inputArgs: ["])"], expected: false, isEdgeCase: true },
        { name: "Chuỗi rỗng (Edge Case)", inputArgs: [""], expected: true, isEdgeCase: true },
      ],
    },
  },

  // =================== CHƯƠNG 03: SẮP XẾP & CHIA ĐỂ TRỊ ===================
  {
    id: "bubble-sort",
    code: "03.1",
    chapterId: "chapter-03-sorting",
    kind: "algorithm",
    algorithmId: "bubble-sort",
    title: "Bubble Sort (Sắp xếp nổi bọt)",
    subtitle: "Hoán đổi liên tục các cặp kề nhau sai thứ tự — hiểu tính ổn định và tối ưu dừng sớm.",
    theory: {
      problemAndApplications:
        "Cho mảng số nguyên `arr` gồm N phần tử. Sắp xếp mảng tăng dần tại chỗ (In-place) bằng cách lặp đi lặp lại việc so sánh hai phần tử liền kề.",
      realWorldApps: [
        "Công cụ giảng dạy nhập môn trực quan về Loop Invariant và Sorting.",
        "Hữu ích khi kiểm tra mảng đã sắp xếp gần hết (với cờ `swapped` dừng trong O(N)).",
      ],
      coreIntuition:
        "Giống như bọt khí trong nước nổi dần lên mặt thoáng: sau mỗi lượt duyệt từ trái sang phải, phần tử LỚN NHẤT trong đoạn chưa sắp xếp bị đẩy dạt về đúng vị trí cuối cùng của nó.",
      mechanismSteps: [
        "Lặp `i` từ `0` đến `n - 2` (lượt thứ i cố định thêm 1 phần tử lớn nhất ở cuối).",
        "Đặt cờ `swapped = false`.",
        "Duyệt `j` từ `0` đến `n - i - 2`: nếu `arr[j] > arr[j + 1]` → hoán đổi và đặt `swapped = true`.",
        "Nếu kết thúc lượt mà `swapped === false` → mảng đã hoàn toàn có thứ tự, thoát sớm!",
      ],
      loopInvariant:
        "Sau i lượt lặp bên ngoài, `i` phần tử lớn nhất đã nằm đúng vị trí cố định ở cuối mảng `arr[n - i .. n - 1]`.",
      complexityDeepDive: {
        timeExplanation: "Tốt nhất O(N) khi mảng đã sort sẵn (nhờ cờ `swapped`). Trung bình & Tệ nhất thực hiện N(N-1)/2 phép so sánh → O(N²).",
        spaceExplanation: "Sắp xếp trực tiếp trên mảng đầu vào → O(1) Space.",
        best: "O(N)",
        average: "O(N²)",
        worst: "O(N²)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Quên cờ `swapped` khiến Best-case bị trượt thành O(N²) trên mảng đã sort.",
        "Biên vòng trong quên `- i` làm so sánh thừa vào phần đuôi đã cố định.",
      ],
      tradeOffs: [
        "Ổn định (Stable), In-place, nhưng rất chậm O(N²) do phải hoán đổi quá nhiều lần trên mảng lớn.",
      ],
      references: ["CLRS — Chapter 2 (Problems: Bubble Sort)", "OpenDSA — Bubble Sort"],
    },
    quizQuestions: [
      {
        id: "bub-q1",
        question: "Cờ `swapped = false` trong Bubble Sort giúp cải thiện độ phức tạp trường hợp nào?",
        options: [
          "Worst-case giảm từ O(N²) xuống O(N log N)",
          "Best-case (khi mảng đầu vào đã sắp xếp sẵn) dừng ngay sau 1 lượt duyệt → O(N)",
          "Giảm Space Complexity xuống O(0)",
          "Biến Bubble Sort thành không ổn định",
        ],
        correctIndex: 1,
        explanation: "Nếu qua 1 lượt duyệt không có cặp nào bị hoán đổi (`!swapped`), mảng chắc chắn đã sắp xếp → dừng sớm trong O(N).",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Bubble Sort tối ưu (có dừng sớm)",
      prompt: "Viết hàm `bubbleSort(arr)` sắp xếp mảng `arr` tăng dần và trả về mảng đã sắp xếp.",
      functionName: "bubbleSort",
      starterCode: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    // Duyệt cặp liền kề và hoán đổi nếu arr[j] > arr[j + 1]
    
    if (!swapped) break;
  }
  return arr;
}`,
      solutionCode: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
      hints: ["Vòng trong chạy `j` từ `0` đến `< n - i - 1`, so sánh `arr[j] > arr[j + 1]`."],
      testCases: [
        { name: "Mảng ngẫu nhiên", inputArgs: [[64, 34, 25, 12, 22, 11, 90]], expected: [11, 12, 22, 25, 34, 64, 90] },
        { name: "Mảng đảo ngược", inputArgs: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
        { name: "Có số trùng & số âm", inputArgs: [[3, -1, 3, 0, -5]], expected: [-5, -1, 0, 3, 3] },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[]], expected: [], isEdgeCase: true },
      ],
    },
  },

  {
    id: "selection-sort",
    code: "03.2",
    chapterId: "chapter-03-sorting",
    kind: "algorithm",
    algorithmId: "selection-sort",
    title: "Selection Sort (Sắp xếp chọn)",
    subtitle: "Tìm phần tử nhỏ nhất ở phần chưa sắp xếp và chỉ thực hiện tối đa 1 phép hoán đổi mỗi lượt.",
    theory: {
      problemAndApplications:
        "Sắp xếp mảng `arr` tăng dần bằng cách chọn phần tử nhỏ nhất ở phần còn lại đặt vào đầu đoạn chưa sắp xếp.",
      realWorldApps: [
        "Hệ thống bộ nhớ Flash/EEPROM nơi số lần **ghi/hoán đổi bộ nhớ (Write operations)** rất đắt đỏ, vì Selection Sort chỉ swap tối đa N - 1 lần!",
      ],
      coreIntuition:
        "Ở mỗi vị trí `i`, bạn quét hết phần còn lại từ `i + 1` đến cuối để tìm ra ứng viên nhỏ nhất `minIdx`, sau đó mới đổi chỗ duy nhất 1 lần đưa nó về vị trí `i`.",
      mechanismSteps: [
        "Lặp `i` từ `0` đến `n - 2`.",
        "Gán `minIdx = i`.",
        "Duyệt `j` từ `i + 1` đến `n - 1`: nếu `arr[j] < arr[minIdx]` → `minIdx = j`.",
        "Nếu `minIdx !== i` → hoán đổi `arr[i]` và `arr[minIdx]`.",
      ],
      loopInvariant:
        "Trước lượt lặp thứ `i`, đoạn `arr[0 .. i-1]` chứa `i` phần tử nhỏ nhất của toàn mảng và đã đúng thứ tự.",
      complexityDeepDive: {
        timeExplanation: "Luôn phải quét hết đoạn còn lại để chứng minh `minIdx` nhỏ nhất, kể cả khi mảng đã sort → Best/Avg/Worst đều là O(N²). Nhưng số lần Swap tối đa chỉ là O(N)!",
        spaceExplanation: "Tại chỗ O(1).",
        best: "O(N²)",
        average: "O(N²)",
        worst: "O(N²)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Selection Sort thông thường KHÔNG ổn định (Unstable) vì phép swap tầm xa có thể đẩy một phần tử ra sau phần tử bằng nó.",
      ],
      tradeOffs: [
        "So với Bubble/Insertion Sort: Không dừng sớm được O(N), nhưng tối thiểu hóa số phép ghi vào bộ nhớ O(N) swaps.",
      ],
      references: ["Princeton Algorithms 4th Ed — Section 2.1 (Selection Sort)", "OpenDSA — Selection Sort"],
    },
    quizQuestions: [
      {
        id: "sel-q1",
        question: "Điểm mạnh đặc biệt nhất của Selection Sort so với Bubble Sort và Insertion Sort là gì?",
        options: [
          "Đạt độ phức tạp O(N log N)",
          "Số lượng phép hoán đổi (Swap / Write) tối đa chỉ là N - 1 lần → O(N) lần ghi bộ nhớ",
          "Luôn chạy O(N) khi mảng đã sắp xếp",
          "Tốn bộ nhớ O(N) phụ",
        ],
        correctIndex: 1,
        explanation: "Mỗi lượt lặp ngoài của Selection Sort chỉ thực hiện tối đa 1 lần swap duy nhất.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Selection Sort",
      prompt: "Viết hàm `selectionSort(arr)` sắp xếp mảng tăng dần bằng thuật toán Sắp xếp chọn.",
      functionName: "selectionSort",
      starterCode: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    // Tìm minIdx trong [i + 1 .. n - 1] rồi hoán đổi với arr[i]
    
  }
  return arr;
}`,
      solutionCode: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
    }
  }
  return arr;
}`,
      hints: ["Tìm chỉ số nhỏ nhất `minIdx`, sau vòng lặp `j` mới hoán đổi `arr[i]` và `arr[minIdx]`."],
      testCases: [
        { name: "Mảng chuẩn", inputArgs: [[29, 10, 14, 37, 13]], expected: [10, 13, 14, 29, 37] },
        { name: "Đã sắp xếp", inputArgs: [[1, 2, 3]], expected: [1, 2, 3] },
        { name: "Số âm & trùng", inputArgs: [[0, -2, 5, -2]], expected: [-2, -2, 0, 5] },
        { name: "1 phần tử (Edge Case)", inputArgs: [[7]], expected: [7], isEdgeCase: true },
      ],
    },
  },

  {
    id: "insertion-sort",
    code: "03.3",
    chapterId: "chapter-03-sorting",
    kind: "algorithm",
    algorithmId: "insertion-sort",
    title: "Insertion Sort (Sắp xếp chèn)",
    subtitle: "Chèn từng phần tử mới vào đúng vị trí như cách xếp bài trên tay — thuật toán O(N²) hiệu quả nhất thực tế.",
    theory: {
      problemAndApplications:
        "Sắp xếp mảng `arr` bằng cách giữ nửa đầu đã sắp xếp và lần lượt chèn phần tử tiếp theo vào đúng khe hở của nó.",
      realWorldApps: [
        "Được dùng bên trong các thuật toán lai thực tế như **Timsort** (Python, Java) và **Introsort** (C++ STL) khi kích thước mảng con nhỏ (N ≤ 32) nhờ hằng số nhân siêu nhỏ và tính thân thiện Cache!",
        "Online Algorithm: Có thể sắp xếp luồng dữ liệu đến liên tục theo thời gian thực.",
      ],
      coreIntuition:
        "Giống hệt cách bạn chơi bài tây: tay trái cầm những lá đã xếp tăng dần; mỗi khi bốc thêm một lá mới (`key`), bạn trượt các lá lớn hơn sang phải một chút để chèn `key` vào đúng vị trí.",
      mechanismSteps: [
        "Lặp `i` từ `1` đến `n - 1`, lưu `key = arr[i]`.",
        "Đặt `j = i - 1`.",
        "Trong khi `j >= 0 && arr[j] > key`: dịch `arr[j + 1] = arr[j]`, giảm `j--`.",
        "Đặt `arr[j + 1] = key`.",
      ],
      loopInvariant:
        "Tại đầu mỗi lượt lặp `i`, mảng con `arr[0 .. i-1]` luôn gồm đúng các phần tử ban đầu ở đoạn đó nhưng đã được sắp xếp theo thứ tự tăng dần (CLRS Ch.2).",
      complexityDeepDive: {
        timeExplanation: "Tốt nhất O(N) khi mảng đã gần như sắp xếp (Nearly Sorted). Trung bình & Tệ nhất (mảng đảo ngược) là O(N²).",
        spaceExplanation: "Tại chỗ O(1).",
        best: "O(N)",
        average: "O(N²)",
        worst: "O(N²)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Dùng `arr[j] > key` (nghiêm ngặt) thay vì `>=` để giữ nguyên tính Ổn định (Stable Sort).",
      ],
      tradeOffs: [
        "Vượt trội hoàn toàn so với Bubble/Selection Sort trong thực tế trên mảng nhỏ hoặc mảng gần sắp xếp.",
      ],
      references: ["CLRS — Chapter 2.1 (Insertion Sort & Loop Invariant)", "MIT 6.006 — Lecture 3"],
    },
    quizQuestions: [
      {
        id: "ins-q1",
        question: "Tại sao các thư viện lớn như Timsort (Python/Java) vẫn chuyển sang dùng Insertion Sort cho các đoạn mảng nhỏ (≤ 32 phần tử)?",
        options: [
          "Vì Insertion Sort có độ phức tạp O(1)",
          "Vì với N nhỏ, Insertion Sort không tốn chi phí đệ quy, dịch chuyển tuần tự cực thân thiện CPU Cache và chạy O(N) nếu dữ liệu gần đúng thứ tự",
          "Vì Merge Sort bị lỗi với N < 32",
          "Vì Insertion Sort không cần so sánh phần tử",
        ],
        correctIndex: 1,
        explanation: "Hệ số hằng cực thấp và tốc độ O(N) trên dữ liệu gần sắp xếp khiến Insertion Sort đánh bại Quick/Merge Sort khi N nhỏ.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Insertion Sort",
      prompt: "Viết hàm `insertionSort(arr)` cài đặt Sắp xếp chèn ổn định, tăng dần.",
      functionName: "insertionSort",
      starterCode: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    // Dịch các phần tử lớn hơn key sang phải và chèn key
    
    arr[j + 1] = key;
  }
  return arr;
}`,
      solutionCode: `function insertionSort(arr) {
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
      hints: ["Dùng `while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }`."],
      testCases: [
        { name: "Mảng chuẩn", inputArgs: [[12, 11, 13, 5, 6]], expected: [5, 6, 11, 12, 13] },
        { name: "Mảng đã sort", inputArgs: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] },
        { name: "Đảo ngược", inputArgs: [[9, 7, 5, 3, 1]], expected: [1, 3, 5, 7, 9] },
        { name: "Rỗng (Edge Case)", inputArgs: [[]], expected: [], isEdgeCase: true },
      ],
    },
  },

  {
    id: "merge-sort",
    code: "03.4",
    chapterId: "chapter-03-sorting",
    kind: "algorithm",
    algorithmId: "merge-sort",
    title: "Merge Sort (Sắp xếp trộn — Chia để trị)",
    subtitle: "Đảm bảo O(N log N) trong MỌI trường hợp và bảo toàn tính ổn định bằng phép Trộn hai mảng con.",
    theory: {
      problemAndApplications:
        "Sắp xếp mảng `arr` trong thời gian đảm bảo luôn là O(N log N) bất chấp đầu vào xấu nhất như thế nào, đồng thời giữ nguyên thứ tự tương đối của các khóa bằng nhau (Stable).",
      realWorldApps: [
        "Thuật toán cốt lõi trong External Sorting (sắp xếp file dữ liệu hàng TB không vừa RAM).",
        "Nền tảng cho `Array.prototype.sort` ổn định (Timsort) và bài toán đếm cặp nghịch thế (Count Inversions).",
      ],
      coreIntuition:
        "Chia mảng làm đôi liên tục cho đến khi mỗi mảnh chỉ còn 1 phần tử (mảng 1 phần tử mặc nhiên đã được sắp xếp!). Sau đó dùng kỹ thuật 2 con trỏ để trộn (Merge) hai nửa đã sắp xếp thành một mảng lớn hơn có thứ tự.",
      mechanismSteps: [
        "Divide: Nếu `arr.length <= 1` trả về ngay; ngược lại cắt đôi tại `mid = Math.floor(arr.length / 2)`.",
        "Conquer: Đệ quy `left = mergeSort(arr.slice(0, mid))` và `right = mergeSort(arr.slice(mid))`.",
        "Combine: Dùng 2 con trỏ `i`, `j` lần lượt chọn phần tử nhỏ hơn từ `left` và `right` (ưu tiên `left[i] <= right[j]` để giữ Stable) bỏ vào mảng kết quả.",
      ],
      loopInvariant:
        "Mảng đầu ra của hàm `merge(left, right)` luôn chứa đúng hợp nhất các phần tử của `left` và `right` theo thứ tự không giảm.",
      complexityDeepDive: {
        timeExplanation: "Cây đệ quy có chiều cao log₂ N tầng; mỗi tầng thực hiện trộn tốn tổng cộng O(N) → T(N) = 2T(N/2) + O(N) = Θ(N log N) ở MỌI trường hợp.",
        spaceExplanation: "Cần mảng phụ để trộn → O(N) Auxiliary Space.",
        best: "O(N log N)",
        average: "O(N log N)",
        worst: "O(N log N)",
        space: "O(N)",
      },
      edgeCasesAndPitfalls: [
        "Quên copy các phần tử còn dư ở `left` hoặc `right` sau khi một trong hai con trỏ chạy hết.",
        "Ghi `left[i] < right[j]` thay vì `<=` làm mất tính Ổn định (Stability) khi hai phần tử bằng nhau.",
      ],
      tradeOffs: [
        "Merge Sort vs Quick Sort: Merge Sort an toàn tuyệt đối O(N log N) worst-case & Stable, nhưng tốn thêm O(N) RAM; Quick Sort tại chỗ O(log N) Stack và cache-friendly hơn.",
      ],
      references: ["MIT 6.006 — Lecture 3: Merge Sort", "Princeton Algorithms 4th Ed — Section 2.2 (Mergesort)"],
    },
    quizQuestions: [
      {
        id: "ms-q1",
        question: "Tại sao Merge Sort KHÔNG bao giờ bị rơi xuống độ phức tạp O(N²) như Quick Sort?",
        options: [
          "Vì Merge Sort luôn chia đôi mảng chính xác tại điểm giữa (N/2) nên cây đệ quy luôn cân bằng với chiều sâu log₂ N",
          "Vì Merge Sort không dùng đệ quy",
          "Vì Merge Sort chạy 2 vòng lặp lồng nhau",
          "Vì nó chọn pivot ngẫu nhiên",
        ],
        correctIndex: 0,
        explanation: "Phép chia luôn cắt chính xác ở `mid`, đảm bảo cây đệ quy luôn sâu đúng log₂ N tầng bất kể dữ liệu đầu vào.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Merge Sort (Divide & Merge)",
      prompt: "Viết hàm `mergeSort(arr)` trả về một mảng mới đã được sắp xếp tăng dần bằng Chia để trị.",
      functionName: "mergeSort",
      starterCode: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // TODO: Trộn hai mảng đã sắp xếp left và right
  const merged = [];
  let i = 0, j = 0;
  
  return merged;
}`,
      solutionCode: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++]);
    else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}`,
      hints: ["Dùng 3 vòng while: so sánh `left[i] <= right[j]`, sau đó đẩy phần dư của `left` và `right` vào `merged`."],
      testCases: [
        { name: "Mảng ngẫu nhiên", inputArgs: [[38, 27, 43, 3, 9, 82, 10]], expected: [3, 9, 10, 27, 38, 43, 82] },
        { name: "Có phần tử trùng", inputArgs: [[5, 2, 5, 1, 2]], expected: [1, 2, 2, 5, 5] },
        { name: "Mảng đảo ngược", inputArgs: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[]], expected: [], isEdgeCase: true },
      ],
    },
  },

  {
    id: "quick-sort",
    code: "03.5",
    chapterId: "chapter-03-sorting",
    kind: "algorithm",
    algorithmId: "quick-sort",
    title: "Quick Sort (Sắp xếp nhanh)",
    subtitle: "Vua tốc độ thực tế nhờ Phân hoạch (Partition) tại chỗ thân thiện CPU Cache & Quickselect.",
    theory: {
      problemAndApplications:
        "Sắp xếp mảng tại chỗ với tốc độ thực tế nhanh nhất nhờ tận dụng Cache Locality và không cần cấp phát mảng phụ O(N) khi trộn.",
      realWorldApps: [
        "Cài đặt nền của `qsort` trong C, thuật toán **Introsort** của C++ `std::sort`, và ý tưởng Partition dùng trong **Quickselect** tìm phần tử lớn thứ K trong O(N).",
      ],
      coreIntuition:
        "Chọn một phần tử làm chốt (`pivot`). Tổ chức lại mảng sao cho: tất cả phần tử nhỏ hơn hoặc bằng `pivot` nằm bên TRÁI, lớn hơn nằm bên PHẢI. Lúc này `pivot` đã đứng đúng vị trí vĩnh viễn của nó! Ta chỉ cần đệ quy làm tương tự cho hai nửa hai bên.",
      mechanismSteps: [
        "Nếu `low >= high` → dừng (Base Case).",
        "Partition (Lomuto/Hoare): Chọn `pivot`, đưa các phần tử `< pivot` về trước và đặt `pivot` vào đúng vị trí `p`.",
        "Đệ quy `quickSort(arr, low, p - 1)` và `quickSort(arr, p + 1, high)`.",
      ],
      loopInvariant:
        "Trong phân hoạch Lomuto, ở mỗi bước `j`: các phần tử `[low..i]` đều `<= pivot`, các phần tử `[i+1..j-1]` đều `> pivot` (CLRS Ch.7).",
      complexityDeepDive: {
        timeExplanation: "Trung bình & Tốt nhất: O(N log N). Tệ nhất: O(N²) nếu luôn chọn pivot là phần tử nhỏ nhất/lớn nhất (VD mảng đã sort khi chọn phần tử cuối). Khắc phục bằng Randomized Pivot!",
        spaceExplanation: "Tại chỗ, chỉ tốn O(log N) Call Stack trung bình (Worst O(N) nếu lệch hoàn toàn).",
        best: "O(N log N)",
        average: "O(N log N)",
        worst: "O(N²)",
        space: "O(log N)",
      },
      edgeCasesAndPitfalls: [
        "Mảng có toàn phần tử giống hệt nhau hoặc đã sắp xếp sẵn: Chọn pivot cuối cố định gây ra phân hoạch lệch N-1 và Stack Overflow nếu N lớn.",
      ],
      tradeOffs: [
        "Quick Sort KHÔNG ổn định (Unstable), nhưng chạy nhanh hơn Merge Sort 1.5–2 lần trong RAM trên mảng kiểu nguyên thủy.",
      ],
      references: ["CLRS — Chapter 7 (Quicksort)", "Princeton Algorithms 4th Ed — Section 2.3 (Quicksort)"],
    },
    quizQuestions: [
      {
        id: "qs-q1",
        question: "Cách đơn giản và hiệu quả nhất để tránh trường hợp tệ nhất O(N²) của Quick Sort trên mảng đã sắp xếp là gì?",
        options: [
          "Luôn chọn phần tử đầu tiên làm pivot",
          "Chọn pivot ngẫu nhiên (Randomized Quick Sort) hoặc Median-of-Three",
          "Chạy Bubble Sort trước",
          "Không thể tránh được",
        ],
        correctIndex: 1,
        explanation: "Chọn ngẫu nhiên hoặc Median-of-Three giúp xác suất phân hoạch lệch cực kỳ nhỏ, giữ kỳ vọng thời gian chạy ở Θ(N log N) bất chấp đầu vào.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Quick Sort (Partition tại chỗ)",
      prompt: "Viết hàm `quickSort(arr)` sắp xếp tại chỗ mảng `arr` bằng thuật toán Quick Sort và trả về `arr`.",
      functionName: "quickSort",
      starterCode: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const p = partition(arr, low, high);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  // TODO: Phân hoạch các phần tử <= pivot về bên trái
  
  return i + 1;
}`,
      solutionCode: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const p = partition(arr, low, high);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }
  const tmp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = tmp;
  return i + 1;
}`,
      hints: ["Trong `partition`: duyệt `j` từ `low` đến `high - 1`; nếu `arr[j] <= pivot` thì tăng `i` và swap `arr[i], arr[j]`. Cuối cùng swap `arr[i+1]` và `arr[high]`."],
      testCases: [
        { name: "Mảng ngẫu nhiên", inputArgs: [[10, 7, 8, 9, 1, 5]], expected: [1, 5, 7, 8, 9, 10] },
        { name: "Nhiều phần tử bằng nhau", inputArgs: [[4, 2, 4, 1, 2, 4]], expected: [1, 2, 2, 4, 4, 4] },
        { name: "Có số âm", inputArgs: [[-3, 10, -7, 0]], expected: [-7, -3, 0, 10] },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[]], expected: [], isEdgeCase: true },
      ],
    },
  },

  {
    id: "counting-sort",
    code: "03.6",
    chapterId: "chapter-03-sorting",
    kind: "algorithm",
    algorithmId: "counting-sort",
    title: "Counting Sort (Sắp xếp Đếm tuyến tính)",
    subtitle: "Phá vỡ rào cản O(N log N) của sắp xếp so sánh bằng cách đếm tần suất trong O(N + K).",
    theory: {
      problemAndApplications:
        "Cho mảng N số nguyên không âm nằm trong phạm vi nhỏ `[0..K]`. Hãy sắp xếp mảng nhanh hơn O(N log N).",
      realWorldApps: [
        "Là bước con cốt lõi bên trong **Radix Sort** để sắp xếp hàng tỷ số nguyên hoặc chuỗi cố định trong O(N).",
        "Xếp hạng điểm thi (0..100), đếm độ tuổi dân số trên dữ liệu triệu bản ghi.",
      ],
      coreIntuition:
        "Mọi thuật toán chỉ dùng phép so sánh `<` hay `>` đều không thể nhanh hơn Ω(N log N) (theo định lý Decision Tree Lower Bound). Counting Sort lách qua định lý này bằng cách KHÔNG so sánh hai phần tử với nhau, mà dùng chính GIÁ TRỊ của phần tử làm chỉ số mảng đếm `count[x]`!",
      mechanismSteps: [
        "Tìm giá trị lớn nhất `K = max(arr)`.",
        "Tạo mảng đếm `count` kích thước `K + 1` toàn số 0.",
        "Duyệt `arr`: với mỗi phần tử `x`, tăng `count[x]++`.",
        "Duyệt `v` từ `0` đến `K`: ghi giá trị `v` vào mảng kết quả đúng `count[v]` lần (hoặc dùng prefix sum để giữ Stability với object).",
      ],
      loopInvariant:
        "Sau giai đoạn đếm, `count[v]` lưu chính xác tổng số lần xuất hiện của giá trị `v` trong mảng gốc.",
      complexityDeepDive: {
        timeExplanation: "1 lượt tìm max & đếm O(N) + 1 lượt duyệt miền giá trị K & ghi kết quả O(N + K) → Tổng O(N + K).",
        spaceExplanation: "Cấp phát mảng đếm kích thước K + 1 → O(N + K).",
        best: "O(N + K)",
        average: "O(N + K)",
        worst: "O(N + K)",
        space: "O(N + K)",
      },
      edgeCasesAndPitfalls: [
        "Miền giá trị K quá lớn (VD mảng chỉ có `[1, 1000000000]`): sẽ gây tràn RAM cho mảng `count` → tuyệt đối không dùng Counting Sort khi K >> N!",
        "Mảng có số âm: Cần dịch offset bằng `-minVal` nếu muốn hỗ trợ số âm.",
      ],
      tradeOffs: [
        "Nhanh tuyến tính O(N) khi K nhỏ (K = O(N)), nhưng vô dụng với số thực (float) hoặc K cực đại.",
      ],
      references: ["MIT 6.006 — Lecture 5: Linear Sorting", "CLRS — Chapter 8.2 (Counting Sort)"],
    },
    quizQuestions: [
      {
        id: "cs-q1",
        question: "Khi nào KHÔNG NÊN sử dụng Counting Sort?",
        options: [
          "Khi N = 100,000 và các giá trị là điểm thi từ 0 đến 100",
          "Khi mảng chỉ có 5 phần tử nhưng chứa giá trị cực lớn là 1,000,000,000 (K quá lớn so với N)",
          "Khi mảng có nhiều giá trị trùng lặp",
          "Khi không được phép dùng đệ quy",
        ],
        correctIndex: 1,
        explanation: "Vì độ phức tạp thời gian và bộ nhớ phụ thuộc trực tiếp vào K (O(N + K)), nếu K = 10^9 thì sẽ tốn hàng GB RAM lãng phí.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Counting Sort O(N + K)",
      prompt: "Viết hàm `countingSort(arr)` sắp xếp mảng số nguyên KHÔNG ÂM tăng dần bằng Counting Sort (không dùng `.sort()`).",
      functionName: "countingSort",
      starterCode: `function countingSort(arr) {
  if (arr.length <= 1) return arr;
  let maxVal = arr[0];
  for (const x of arr) if (x > maxVal) maxVal = x;

  const count = new Array(maxVal + 1).fill(0);
  // TODO: Đếm tần suất và tái tạo mảng kết quả
  const result = [];
  
  return result;
}`,
      solutionCode: `function countingSort(arr) {
  if (arr.length <= 1) return arr;
  let maxVal = arr[0];
  for (const x of arr) if (x > maxVal) maxVal = x;

  const count = new Array(maxVal + 1).fill(0);
  for (const x of arr) count[x]++;

  const result = [];
  for (let v = 0; v <= maxVal; v++) {
    while (count[v] > 0) {
      result.push(v);
      count[v]--;
    }
  }
  return result;
}`,
      hints: ["Tăng `count[x]++` cho từng phần tử, sau đó lặp `v` từ 0 đến `maxVal` và push `v` đúng `count[v]` lần."],
      testCases: [
        { name: "Mảng lặp nhiều số nhỏ", inputArgs: [[4, 2, 2, 8, 3, 3, 1]], expected: [1, 2, 2, 3, 3, 4, 8] },
        { name: "Chứa số 0", inputArgs: [[0, 5, 0, 2, 0]], expected: [0, 0, 0, 2, 5] },
        { name: "1 phần tử (Edge Case)", inputArgs: [[3]], expected: [3], isEdgeCase: true },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[]], expected: [], isEdgeCase: true },
      ],
    },
  },
];
