import { CourseLesson } from "../types";

export const LESSONS_CH04_CH05_CH06: CourseLesson[] = [
  // =================== CHƯƠNG 04: BẢNG BĂM (HASH TABLES) ===================
  {
    id: "hash-table",
    code: "04.1",
    chapterId: "chapter-04-hashing",
    kind: "algorithm",
    algorithmId: "hash-table",
    title: "Hash Table — Separate Chaining (Nối chuỗi)",
    subtitle: "Đạt tốc độ tra cứu O(1) kỳ vọng bằng Hàm băm và giải quyết xung đột bằng Danh sách liên kết.",
    theory: {
      problemAndApplications:
        "Làm thế nào để lưu trữ và tra cứu hàng triệu cặp Key–Value (ví dụ: Từ điển, Bộ nhớ đệm Cache) trong thời gian O(1) trung bình mà không cần tìm kiếm tuyến tính?",
      realWorldApps: [
        "Cấu trúc `Map / Set / Object` trong JavaScript, `dict` trong Python, `unordered_map` trong C++ STL.",
        "Hệ thống Caching (Redis / Memcached), Indexing cơ sở dữ liệu (Hash Index).",
      ],
      coreIntuition:
        "Hàm băm (Hash Function) đóng vai trò như một 'máy dịch tọa độ': biến khóa bất kỳ `k` thành chỉ số ô mảng `idx = hash(k) % M`. Khi hai khóa khác nhau tình cờ rơi trúng cùng một ô (Xung đột — Collision), Separate Chaining giải quyết cực đơn giản: treo một danh sách liên kết ở ô đó để chứa cả hai!",
      mechanismSteps: [
        "Chọn kích thước bảng `M` (thường là số nguyên tố để phân bố đều) và tạo `M` bucket rỗng.",
        "Tính `idx = Math.abs(key) % M`.",
        "Kiểm tra danh sách liên kết tại `buckets[idx]`: nếu `key` đã có thì cập nhật, ngược lại nối vào danh sách.",
        "Giữ Hệ số tải (Load Factor) `α = N / M` thấp (thường `< 0.75`); khi vượt quá, thực hiện **Rehashing** (nhân đôi kích thước bảng `M` và băm lại toàn bộ).",
      ],
      loopInvariant:
        "Với giả thiết **Simple Uniform Hashing** (MIT 6.006 L4), độ dài trung bình mỗi dây chuyền là α = N / M; nếu M = Θ(N) thì mọi thao tác tìm/chèn/xóa tốn O(1 + α) = O(1) kỳ vọng!",
      complexityDeepDive: {
        timeExplanation: "Trung bình O(1) khi hàm băm phân tán đều và α nhỏ. Tệ nhất O(N) nếu tất cả N khóa đụng độ vào cùng 1 bucket.",
        spaceExplanation: "Tốn O(N + M) để lưu bảng bucket và N nút trong chuỗi.",
        best: "O(1)",
        average: "O(1)",
        worst: "O(N)",
        space: "O(N)",
      },
      edgeCasesAndPitfalls: [
        "Khóa âm trong C++/JavaScript: Phép `%` trả về số âm (VD `-5 % 7 = -5`), gây lỗi index → phải dùng `((key % M) + M) % M`!",
        "Không Rehash khi N tăng quá lớn làm chuỗi dài thành O(N).",
      ],
      tradeOffs: [
        "Separate Chaining chịu tải được khi α > 1 và xóa phần tử dễ dàng, nhưng tốn thêm bộ nhớ cho con trỏ liên kết và kém Cache Locality hơn Open Addressing.",
      ],
      references: ["MIT 6.006 — Lecture 4: Hashing", "CLRS — Chapter 11.2 (Hash Tables with Chaining)"],
    },
    quizQuestions: [
      {
        id: "ht-q1",
        question: "Theo Nguyên lý Chuồng Bồ câu (Pigeonhole Principle), điều gì là BẤT KHẢ KHÁNG trong Bảng Băm?",
        options: [
          "Luôn tồn tại trường hợp hai khóa khác nhau cho ra cùng một giá trị hash (Collision) khi tập khóa đầu vào lớn hơn kích thước bảng",
          "Hàm băm luôn mất O(N) để tính",
          "Không thể lưu số nguyên âm",
          "Separate Chaining chỉ chứa tối đa 2 phần tử",
        ],
        correctIndex: 0,
        explanation: "Vì không gian khóa đầu vào là vô hạn còn số lượng bucket M là hữu hạn, xung đột (Collision) chắc chắn xảy ra và ta bắt buộc phải có chiến lược xử lý.",
      },
    ],
    codeChallenge: {
      title: "Giải quyết Xung đột Bảng Băm bằng Separate Chaining",
      prompt:
        "Hoàn thiện hàm `insertChaining(keys, tableSize)` nhận danh sách các số nguyên `keys` và kích thước bảng `tableSize`. Hãy dùng hàm băm `idx = ((k % tableSize) + tableSize) % tableSize` để chèn lần lượt vào `buckets` (bỏ qua nếu khóa đã tồn tại) và trả về mảng 2 chiều `buckets`.",
      functionName: "insertChaining",
      starterCode: `function insertChaining(keys, tableSize) {
  const buckets = Array.from({ length: tableSize }, () => []);
  for (const k of keys) {
    // Tính idx dương trong [0..tableSize-1] và chèn k vào buckets[idx] nếu chưa có
    
  }
  return buckets;
}`,
      solutionCode: `function insertChaining(keys, tableSize) {
  const buckets = Array.from({ length: tableSize }, () => []);
  for (const k of keys) {
    const idx = ((k % tableSize) + tableSize) % tableSize;
    if (!buckets[idx].includes(k)) {
      buckets[idx].push(k);
    }
  }
  return buckets;
}`,
      hints: ["Dùng `const idx = ((k % tableSize) + tableSize) % tableSize;` rồi kiểm tra `!buckets[idx].includes(k)` trước khi `.push(k)`."],
      testCases: [
        { name: "Phân bố có xung đột (mod 5)", inputArgs: [[10, 15, 7, 12, 3], 5], expected: [[10, 15], [], [7, 12], [3], []] },
        { name: "Loại bỏ khóa trùng", inputArgs: [[4, 9, 4], 5], expected: [[], [], [], [], [4, 9]] },
        { name: "Có số âm (Edge Case)", inputArgs: [[-2, 3], 5], expected: [[], [], [], [-2, 3], []], isEdgeCase: true },
        { name: "Danh sách rỗng (Edge Case)", inputArgs: [[], 3], expected: [[], [], []], isEdgeCase: true },
      ],
    },
  },

  {
    id: "hash-open-addressing",
    code: "04.2",
    chapterId: "chapter-04-hashing",
    kind: "algorithm",
    algorithmId: "hash-open-addressing",
    title: "Hash Table — Open Addressing (Linear Probing)",
    subtitle: "Lưu toàn bộ dữ liệu trên mảng phẳng không dùng con trỏ liên kết bằng dò tuyến tính.",
    theory: {
      problemAndApplications:
        "Nếu muốn tiết kiệm bộ nhớ con trỏ và tận dụng tối đa CPU Cache Locality của mảng phẳng, ta xử lý xung đột trực tiếp ngay trong bảng băm như thế nào?",
      realWorldApps: [
        "Cài đặt `dict` trong **Python** và **SwissTable / Abseil flat_hash_map** của Google sử dụng biến thể của Open Addressing!",
      ],
      coreIntuition:
        "Thay vì treo thêm danh sách liên kết khi ô `idx` bị chiếm, Open Addressing giống như việc tìm chỗ đỗ xe: nếu ô số `idx` đã có xe, bạn lái xe nhích sang ô `(idx + 1) % M`, rồi `(idx + 2) % M`... cho đến khi gặp ô còn trống!",
      mechanismSteps: [
        "Tạo bảng phẳng `slots` độ dài `M` toàn giá trị `null`.",
        "Tính vị trí xuất phát `start = hash(key) % M`.",
        "Dò tuyến tính (Linear Probing): lặp `i = 0 .. M - 1`, tính `idx = (start + i) % M`.",
        "Nếu `slots[idx] === null` hoặc `slots[idx] === key` → đặt `key` vào và kết thúc.",
      ],
      loopInvariant:
        "Trong Linear Probing, khi tìm kiếm một khóa `k`, nếu gặp một ô `null` dọc đường dò thì `k` chắc chắn KHÔNG có trong bảng (trừ trường hợp đã xóa mà không đánh dấu Tombstone!).",
      complexityDeepDive: {
        timeExplanation: "Nhanh O(1) trung bình khi hệ số tải α < 0.7 nhờ Cache Locality tuyệt vời. Khi α gần 1, xảy ra hiện tượng **Primary Clustering** (tụ cụm thành khối dài) khiến dò tìm chậm dần thành O(N).",
        spaceExplanation: "Không tốn bộ nhớ con trỏ phụ → O(M).",
        best: "O(1)",
        average: "O(1)",
        worst: "O(N)",
        space: "O(M)",
      },
      edgeCasesAndPitfalls: [
        "Xóa phần tử trong Linear Probing: KHÔNG ĐƯỢC gán thẳng ô đó về `null` vì sẽ làm đứt chuỗi dò của các khóa đứng sau nó — phải dùng nhãn đánh dấu **Tombstone (DELETED)**!",
        "Bảng đầy (α = 1): Phải dừng sau M bước dò để tránh vòng lặp vô tận.",
      ],
      tradeOffs: [
        "Open Addressing (Linear Probing) vs Separate Chaining: Linear Probing nhanh hơn nhờ Cache khi α < 0.7, nhưng yêu cầu Rehash sớm trước khi bảng đầy.",
      ],
      references: ["Princeton Algorithms 4th Ed — Section 3.4 (Linear Probing)", "CLRS — Chapter 11.4 (Open Addressing)"],
    },
    quizQuestions: [
      {
        id: "oa-q1",
        question: "Khi xóa một khóa trong Bảng băm Open Addressing (Linear Probing), tại sao ta KHÔNG được gán thẳng ô đó thành `null`?",
        options: [
          "Vì JavaScript không cho gán null trong mảng",
          "Vì sẽ làm đứt đoạn chuỗi dò tìm — khiến thuật toán Search tưởng nhầm các khóa bị đẩy ra phía sau ô đó là không tồn tại",
          "Vì nó làm tăng kích thước bảng lên gấp đôi",
          "Không sao cả, có thể gán thẳng null",
        ],
        correctIndex: 1,
        explanation: "Nếu Search gặp `null` giữa đường, nó sẽ dừng và kết luận 'Không tìm thấy', bỏ sót các khóa từng bị đẩy tiếp sang phải. Do đó cần đặt một giá trị đặc biệt là Tombstone (DELETED).",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Bảng Băm Linear Probing",
      prompt:
        "Hoàn thiện hàm `insertLinearProbing(keys, tableSize)` chèn lần lượt các khóa không âm `keys` vào bảng kích thước `tableSize` bằng Linear Probing `(start + step) % tableSize`. Bỏ qua nếu khóa đã có hoặc bảng đã đầy. Trả về mảng kết quả gồm số nguyên hoặc `null`.",
      functionName: "insertLinearProbing",
      starterCode: `function insertLinearProbing(keys, tableSize) {
  const slots = new Array(tableSize).fill(null);
  for (const key of keys) {
    const start = ((key % tableSize) + tableSize) % tableSize;
    // Dò tuyến tính từ step = 0 .. tableSize - 1
    
  }
  return slots;
}`,
      solutionCode: `function insertLinearProbing(keys, tableSize) {
  const slots = new Array(tableSize).fill(null);
  for (const key of keys) {
    const start = ((key % tableSize) + tableSize) % tableSize;
    for (let step = 0; step < tableSize; step++) {
      const idx = (start + step) % tableSize;
      if (slots[idx] === key) break;
      if (slots[idx] === null) {
        slots[idx] = key;
        break;
      }
    }
  }
  return slots;
}`,
      hints: ["Dùng vòng lặp `step` từ 0 đến `tableSize - 1`: nếu `slots[idx] === key` thì `break`, nếu `slots[idx] === null` thì gán `slots[idx] = key` rồi `break`."],
      testCases: [
        { name: "Dò tuyến tính khi xung đột", inputArgs: [[12, 19, 26, 5], 7], expected: [26, 5, null, null, null, 12, 19] },
        { name: "Không xung đột", inputArgs: [[0, 1, 2], 5], expected: [0, 1, 2, null, null] },
        { name: "Bảng đầy (Edge Case)", inputArgs: [[1, 2, 3, 4], 3], expected: [3, 1, 2], isEdgeCase: true },
        { name: "Khóa trùng lặp (Edge Case)", inputArgs: [[7, 7, 14], 7], expected: [7, 14, null, null, null, null, null], isEdgeCase: true },
      ],
    },
  },

  // =================== CHƯƠNG 05: CÂY NHỊ PHÂN & CÂY CÂN BẰNG ===================
  {
    id: "tree-traversals",
    code: "05.1",
    chapterId: "chapter-05-trees",
    kind: "algorithm",
    algorithmId: "tree-traversals",
    title: "Binary Tree Traversals (4 Phép Duyệt Cây)",
    subtitle: "Nền tảng cốt lõi thao tác trên mọi cấu trúc Cây: In-Order, Pre-Order, Post-Order và Level-Order.",
    theory: {
      problemAndApplications:
        "Khác với mảng chỉ có 1 chiều trái → phải, cây nhị phân có cấu trúc phân nhánh 2 chiều. Làm sao thăm hết mọi node trong cây theo một thứ tự có quy luật rõ ràng?",
      realWorldApps: [
        "In-Order (L-N-R): Trích xuất dãy khóa ĐÃ SẮP XẾP TĂNG DẦN từ Binary Search Tree.",
        "Pre-Order (N-L-R): Sao chép cấu trúc cây hoặc serialize cây để lưu xuống đĩa.",
        "Post-Order (L-R-N): Tính dung lượng thư mục (cần tính hết thư mục con trước rồi mới cộng vào thư mục cha) hoặc giải phóng bộ nhớ cây.",
        "Level-Order (BFS): Duyệt cây theo từng tầng độ sâu, tìm node gần gốc nhất.",
      ],
      coreIntuition:
        "Tên gọi của 3 phép duyệt DFS được đặt theo **thời điểm bạn ghé thăm Node Gốc (N)**: trước hai con (**Pre**-order: N-L-R), ở giữa hai con (**In**-order: L-N-R), hay sau cùng (**Post**-order: L-R-N). Còn Level-Order dùng Queue đi ngang từng tầng từ trên xuống.",
      mechanismSteps: [
        "Pre-Order: Ghi nhận `node.val` → Đệ quy Trái → Đệ quy Phải.",
        "In-Order: Đệ quy Trái → Ghi nhận `node.val` → Đệ quy Phải.",
        "Post-Order: Đệ quy Trái → Đệ quy Phải → Ghi nhận `node.val`.",
        "Level-Order: Đẩy `root` vào Queue; lặp lấy đầu Queue ra ghi nhận rồi đẩy con trái, con phải (nếu có) vào cuối Queue.",
      ],
      loopInvariant:
        "Cả 4 phép duyệt đều thăm mỗi đỉnh đúng 1 lần trong O(N) thời gian.",
      complexityDeepDive: {
        timeExplanation: "Thăm đúng N node trên cây → O(N).",
        spaceExplanation: "Duyệt DFS tốn bộ nhớ Call Stack bằng chiều cao cây O(H) (từ O(log N) đến O(N) nếu cây lệch). Level-Order BFS tốn Queue tối đa O(W) với W là bề rộng tầng lớn nhất (tối đa N/2 = O(N)).",
        best: "O(N)",
        average: "O(N)",
        worst: "O(N)",
        space: "O(H) .. O(N)",
      },
      edgeCasesAndPitfalls: [
        "Cây rỗng (`root === null`): Phải trả về ngay mảng rỗng `[]`.",
      ],
      tradeOffs: [
        "DFS (Pre/In/Post-order) tiết kiệm bộ nhớ hơn BFS nếu cây cân bằng rộng và sâu vừa phải; BFS tìm node gần gốc nhất tốt hơn.",
      ],
      references: ["MIT 6.006 — Lecture 6: Binary Trees I", "OpenDSA — Binary Tree Traversals"],
    },
    quizQuestions: [
      {
        id: "tt-q1",
        question: "Nếu bạn cần xóa toàn bộ bộ nhớ (hoặc tính tổng kích thước thư mục) từ các nhánh con rồi mới xử lý đến thư mục cha, phép duyệt nào là tự nhiên nhất?",
        options: ["Pre-Order (Gốc → Trái → Phải)", "In-Order (Trái → Gốc → Phải)", "Post-Order (Trái → Phải → Gốc)", "Level-Order"],
        correctIndex: 2,
        explanation: "Post-Order xử lý hoàn tất hai cây con (Trái, Phải) trước khi quay lên xử lý Node hiện tại — hoàn hảo để gom kết quả từ dưới lên (Bottom-Up) hoặc xóa node con trước khi xóa node cha.",
      },
    ],
    codeChallenge: {
      title: "Duyệt Cây In-Order (Mảng Heap-Indexed Tree)",
      prompt:
        "Cây nhị phân được truyền vào dưới dạng mảng Level-Order `tree` (với `null` là ô trống, con trái của `i` là `2*i + 1`, con phải là `2*i + 2`). Viết hàm `inorderTraversal(tree)` trả về mảng thứ tự duyệt In-Order (Trái → Gốc → Phải).",
      functionName: "inorderTraversal",
      starterCode: `function inorderTraversal(tree) {
  const result = [];
  function dfs(idx) {
    if (idx >= tree.length || tree[idx] === null) return;
    // TODO: Gọi đệ quy trái, ghi nhận tree[idx], gọi đệ quy phải
    
  }
  dfs(0);
  return result;
}`,
      solutionCode: `function inorderTraversal(tree) {
  const result = [];
  function dfs(idx) {
    if (idx >= tree.length || tree[idx] === null) return;
    dfs(2 * idx + 1);
    result.push(tree[idx]);
    dfs(2 * idx + 2);
  }
  dfs(0);
  return result;
}`,
      hints: ["Con trái tại `2 * idx + 1`, con phải tại `2 * idx + 2`."],
      testCases: [
        { name: "BST chuẩn 7 nút", inputArgs: [[50, 30, 70, 20, 40, 60, 80]], expected: [20, 30, 40, 50, 60, 70, 80] },
        { name: "Cây khuyết nhánh", inputArgs: [[1, null, 2, null, null, 3]], expected: [1, 3, 2] },
        { name: "1 nút (Edge Case)", inputArgs: [[10]], expected: [10], isEdgeCase: true },
        { name: "Cây rỗng (Edge Case)", inputArgs: [[]], expected: [], isEdgeCase: true },
      ],
    },
  },

  {
    id: "bst",
    code: "05.2",
    chapterId: "chapter-05-trees",
    kind: "algorithm",
    algorithmId: "bst",
    title: "Binary Search Tree (BST — Cây tìm kiếm nhị phân)",
    subtitle: "Kết hợp ưu điểm tra cứu nhanh như Binary Search và chèn/xóa linh hoạt trong O(H).",
    theory: {
      problemAndApplications:
        "Mảng sắp xếp tìm nhanh O(log N) nhưng chèn/xóa chậm O(N); Danh sách liên kết chèn nhanh nhưng tìm chậm O(N). Binary Search Tree cho phép cả Tìm, Chèn, Xóa đều đạt O(H) với H là chiều cao cây.",
      realWorldApps: [
        "Nền tảng cho các cây cân bằng `std::set / std::map` (Red-Black Tree), chỉ mục B-Tree trong SQL.",
      ],
      coreIntuition:
        "Mọi node trên BST đều tuân thủ luật bất biến: **MỌI giá trị ở nhánh cây con TRÁI đều nhỏ hơn node hiện tại, và MỌI giá trị ở nhánh cây con PHẢI đều lớn hơn node hiện tại.** Nhờ đó mỗi bước so sánh giúp bạn loại ngay một nửa nhánh cây!",
      mechanismSteps: [
        "Tìm kiếm (Search): So sánh `target` với `node.val`; nhỏ hơn rẽ trái, lớn hơn rẽ phải.",
        "Chèn (Insert): Tìm xuống cho đến khi gặp nhánh `null` rồi gắn node mới tại đó.",
        "Xóa (Delete — 3 trường hợp): (1) Node lá → xóa thẳng; (2) Có 1 con → nối con lên thay; (3) Có 2 con → thay bằng giá trị nhỏ nhất bên nhánh phải (**Inorder Successor**).",
      ],
      loopInvariant:
        "Bất biến BST: Đối với mọi nút x, tất cả nút bên trái x có khóa < x.key, và bên phải có khóa > x.key (CLRS Ch.12).",
      complexityDeepDive: {
        timeExplanation: "Trung bình khi cây cân bằng: O(log N). Tệ nhất khi chèn dãy đã tăng dần: cây bị suy biến thành chuỗi thẳng (chiều cao H = N) → O(N)!",
        spaceExplanation: "O(N) lưu N nút + O(H) Call Stack.",
        best: "O(log N)",
        average: "O(log N)",
        worst: "O(N)",
        space: "O(H)",
      },
      edgeCasesAndPitfalls: [
        "Chèn dãy đã sắp xếp `[1, 2, 3, 4, 5]` liên tiếp vào BST thường sẽ tạo thành cây lệch phải hoàn toàn (O(N)) → đó là lý do cần cây tự cân bằng AVL / Red-Black Tree!",
      ],
      tradeOffs: [
        "BST thường đơn giản, nhanh trung bình nếu dữ liệu ngẫu nhiên; nhưng không an toàn trước dữ liệu có thứ tự (cần AVL/Red-Black).",
      ],
      references: ["CLRS — Chapter 12 (Binary Search Trees)", "OpenDSA — Binary Search Trees"],
    },
    quizQuestions: [
      {
        id: "bst-q1",
        question: "Khi xóa một node có đủ CẢ 2 CON khỏi cây BST, giá trị nào sau đây có thể thay thế vị trí của node đó mà vẫn giữ nguyên tính chất BST?",
        options: [
          "Luôn lấy node gốc (Root)",
          "Giá trị nhỏ nhất của cây con phải (Inorder Successor) hoặc lớn nhất của cây con trái (Inorder Predecessor)",
          "Một giá trị ngẫu nhiên",
          "Luôn lấy con trái trực tiếp bất kể nó có nhánh phải hay không",
        ],
        correctIndex: 1,
        explanation: "Inorder Successor lớn hơn toàn bộ nhánh trái và nhỏ hơn phần còn lại của nhánh phải nên thay thế hoàn hảo.",
      },
    ],
    codeChallenge: {
      title: "Kiểm tra tính hợp lệ của Binary Search Tree",
      prompt:
        "Cho cây nhị phân dạng mảng Level-Order `tree` (`null` là nút trống). Viết hàm `isValidBST(tree)` trả về `true` nếu cây thỏa mãn bất biến BST nghiêm ngặt (mọi nút con trái < nút cha < mọi nút con phải), ngược lại `false`.",
      functionName: "isValidBST",
      starterCode: `function isValidBST(tree) {
  function validate(idx, minVal, maxVal) {
    if (idx >= tree.length || tree[idx] === null) return true;
    const val = tree[idx];
    // TODO: Kiểm tra val có nằm trong khoảng (minVal, maxVal) không
    
    return true;
  }
  return validate(0, -Infinity, Infinity);
}`,
      solutionCode: `function isValidBST(tree) {
  function validate(idx, minVal, maxVal) {
    if (idx >= tree.length || tree[idx] === null) return true;
    const val = tree[idx];
    if (val <= minVal || val >= maxVal) return false;
    return validate(2 * idx + 1, minVal, val) && validate(2 * idx + 2, val, maxVal);
  }
  return validate(0, -Infinity, Infinity);
}`,
      hints: ["Kiểm tra `if (val <= minVal || val >= maxVal) return false;` rồi truyền cận `(minVal, val)` cho nhánh trái và `(val, maxVal)` cho nhánh phải."],
      testCases: [
        { name: "BST hợp lệ", inputArgs: [[50, 30, 70, 20, 40, 60, 80]], expected: true },
        { name: "Vi phạm sâu (45 nằm nhánh trái của 40? không: 55 nằm nhánh trái của 50!)", inputArgs: [[50, 30, 70, 20, 55]], expected: false },
        { name: "Giá trị bằng cha (Edge Case)", inputArgs: [[10, 10, 20]], expected: false, isEdgeCase: true },
        { name: "Cây rỗng (Edge Case)", inputArgs: [[]], expected: true, isEdgeCase: true },
      ],
    },
  },

  {
    id: "avl-tree",
    code: "05.3",
    chapterId: "chapter-05-trees",
    kind: "algorithm",
    algorithmId: "avl-tree",
    title: "AVL Tree (Cây Tự Cân Bằng)",
    subtitle: "Chống suy biến cây BST bằng Hệ số Cân bằng và 4 phép xoay LL, RR, LR, RL để khóa chặt O(log N).",
    theory: {
      problemAndApplications:
        "Làm sao ngăn không cho BST bị suy biến thành chuỗi thẳng O(N) khi chèn dữ liệu tăng dần? Phát minh năm 1962 của Adelson-Velsky & Landis là cấu trúc Cây Tự Cân Bằng đầu tiên trên thế giới.",
      realWorldApps: [
        "Các hệ thống đọc nhiều hơn ghi (Read-heavy In-Memory Index) vì chiều cao AVL cực chặt (`< 1.44 log₂ N`).",
      ],
      coreIntuition:
        "Mỗi node theo dõi chiều cao hai nhánh con và tính **Balance Factor = height(left) - height(right)**. Ngay khi độ chênh lệch vượt ngưỡng `±1` (tức là `+2` hoặc `-2`), cây tự động xoay (Rotate) nhánh bị nặng lên thay thế, đưa chiều cao trở lại trạng thái cân bằng hoàn hảo.",
      mechanismSteps: [
        "Chèn hoặc xóa như BST bình thường, cập nhật lại `height` từ dưới lên trên.",
        "Tính `BF = height(left) - height(right)`.",
        "Nếu `BF > 1` (lệch trái): Trường hợp LL (`val < left.val`) → Xoay Phải; Trường hợp LR → Xoay Trái tại con trái rồi Xoay Phải tại gốc lệch.",
        "Nếu `BF < -1` (lệch phải): Trường hợp RR → Xoay Trái; Trường hợp RL → Xoay Phải tại con phải rồi Xoay Trái tại gốc lệch.",
      ],
      loopInvariant:
        "Mọi node trong Cây AVL luôn duy trì bất biến `|height(left) - height(right)| ≤ 1`, đảm bảo chiều cao toàn cây luôn là O(log N).",
      complexityDeepDive: {
        timeExplanation: "Tìm kiếm, Chèn và Xóa đều ĐẢM BẢO chặt chẽ O(log N) ngay cả trong trường hợp xấu nhất!",
        spaceExplanation: "O(N) lưu thêm thuộc tính `height` ở mỗi node.",
        best: "O(log N)",
        average: "O(log N)",
        worst: "O(log N)",
        space: "O(N)",
      },
      edgeCasesAndPitfalls: [
        "Quên cập nhật lại chiều cao (`height`) của node gốc cũ TRƯỚC node gốc mới sau khi xoay cây!",
      ],
      tradeOffs: [
        "AVL cân bằng chặt hơn Red-Black Tree nên TÌM nhanh hơn, nhưng khi CHÈN/XÓA có thể xoay nhiều hơn Red-Black Tree.",
      ],
      references: ["MIT 6.006 — Lecture 7: Binary Trees II (AVL)", "CLRS — Chapter 13 Notes (Balanced Trees)"],
    },
    quizQuestions: [
      {
        id: "avl-q1",
        question: "Khi chèn dãy tăng dần `10 → 20 → 30` vào cây AVL rỗng, cây bị lệch Phải-Phải (RR) tại node 10. Cây AVL xử lý thế nào?",
        options: [
          "Giữ nguyên thành đường thẳng",
          "Thực hiện 1 phép Xoay Trái (Left Rotate) tại node 10, đưa 20 lên làm gốc với con trái là 10 và con phải là 30",
          "Xóa node 30",
          "Thực hiện Xoay Phải tại node 30",
        ],
        correctIndex: 1,
        explanation: "Với tình huống mất cân bằng Phải-Phải (RR), phép Xoay Trái tại node mất cân bằng (10) đưa 20 lên làm gốc cân bằng ngay lập tức.",
      },
    ],
    codeChallenge: {
      title: "Tính Chiều cao & Kiểm tra Cây Cân bằng (AVL Property)",
      prompt:
        "Cho cây nhị phân dạng mảng Level-Order `tree` (`null` là trống). Viết hàm `isHeightBalanced(tree)` trả về `true` nếu MỌI node trong cây có độ chênh lệch chiều cao hai nhánh con `|height(left) - height(right)| <= 1`, ngược lại `false`.",
      functionName: "isHeightBalanced",
      starterCode: `function isHeightBalanced(tree) {
  function checkHeight(idx) {
    if (idx >= tree.length || tree[idx] === null) return 0;
    // TODO: Kiểm tra chiều cao trái/phải; trả về -1 nếu mất cân bằng
    
  }
  return checkHeight(0) !== -1;
}`,
      solutionCode: `function isHeightBalanced(tree) {
  function checkHeight(idx) {
    if (idx >= tree.length || tree[idx] === null) return 0;
    const lh = checkHeight(2 * idx + 1);
    if (lh === -1) return -1;
    const rh = checkHeight(2 * idx + 2);
    if (rh === -1) return -1;
    if (Math.abs(lh - rh) > 1) return -1;
    return 1 + Math.max(lh, rh);
  }
  return checkHeight(0) !== -1;
}`,
      hints: ["Dùng chiến lược Bottom-Up O(N): nếu `lh === -1 || rh === -1 || Math.abs(lh - rh) > 1` thì trả về `-1`."],
      testCases: [
        { name: "Cây cân bằng", inputArgs: [[3, 9, 20, null, null, 15, 7]], expected: true },
        { name: "Cây lệch trái độ sâu > 1", inputArgs: [[1, 2, null, 3, null]], expected: false },
        { name: "1 nút (Edge Case)", inputArgs: [[1]], expected: true, isEdgeCase: true },
        { name: "Cây rỗng (Edge Case)", inputArgs: [[]], expected: true, isEdgeCase: true },
      ],
    },
  },

  {
    id: "segment-tree",
    code: "05.4",
    chapterId: "chapter-05-trees",
    kind: "algorithm",
    algorithmId: "segment-tree",
    title: "Segment Tree (Cây Phân Đoạn)",
    subtitle: "Truy vấn tổng/Min/Max trên bất kỳ đoạn [L..R] nào và cập nhật phần tử trong O(log N).",
    theory: {
      problemAndApplications:
        "Cho mảng N phần tử thường xuyên bị thay đổi giá trị và đồng thời nhận hàng trăm nghìn yêu cầu tính Tổng (hoặc Min/Max) trong đoạn `[L..R]`. Nếu dùng Prefix Sum, cập nhật tốn O(N); nếu dùng vòng lặp thường, truy vấn tốn O(N). Segment Tree đạt O(log N) cho CẢ HAI!",
      realWorldApps: [
        "Cơ sở dữ liệu chuỗi thời gian (Time-Series Analytics), đồ họa máy tính (Range Queries), hệ thống thi đấu Lập trình thi đấu.",
      ],
      coreIntuition:
        "Mỗi nút trong Segment Tree chịu trách nhiệm lưu tổng (hoặc min/max) của một ĐOẠN `[start..end]`. Nút gốc giữ đoạn `[0..N-1]`, hai con chia đôi giữ `[0..mid]` và `[mid+1..N-1]`. Khi cần hỏi tổng đoạn `[L..R]`, ta chỉ cần ghép các nút nằm trọn bên trong `[L..R]` (tối đa ~4 log N nút!).",
      mechanismSteps: [
        "Build O(N): Nút lá lưu `arr[idx]`, nút cha lưu `tree[left] + tree[right]`.",
        "Query `[L..R]` O(log N): (1) Nằm ngoài hoàn toàn → trả 0; (2) Nằm gọn bên trong `[L..R]` → trả ngay giá trị nút; (3) Giao một phần → cộng kết quả đệ quy hai con.",
        "Update(idx, val) O(log N): Đi xuống đúng nút lá `idx` cập nhật, rồi cập nhật ngược lên các nút tổ tiên.",
      ],
      loopInvariant:
        "Giá trị lưu tại mỗi nút cha luôn là tổng hợp chính xác của hai đoạn con không giao nhau hợp lại thành đoạn của nó.",
      complexityDeepDive: {
        timeExplanation: "Build cây tốn O(N). Mỗi thao tác Query `[L..R]` và Point Update thăm tối đa O(log N) nút.",
        spaceExplanation: "Mảng cây phân đoạn thường cấp phát kích thước an toàn `4 * N` → O(N).",
        best: "O(log N) query",
        average: "O(log N)",
        worst: "O(log N)",
        space: "O(N)",
      },
      edgeCasesAndPitfalls: [
        "Cấp phát kích thước mảng tree nhỏ hơn `4 * N` có thể gây lỗi truy cập ngoài biên khi `N` không phải lũy thừa của 2.",
      ],
      tradeOffs: [
        "Mạnh hơn Fenwick Tree (BIT) ở chỗ giải được cả Range Min/Max (vốn không có phép trừ ngược) và hỗ trợ Lazy Propagation cập nhật cả đoạn.",
      ],
      references: ["CP-Algorithms: Segment Tree", "Competitive Programmer's Handbook (Antti Laaksonen — Ch.9)"],
    },
    quizQuestions: [
      {
        id: "seg-q1",
        question: "Tại sao kích thước mảng lưu Segment Tree thường được cấp phát là `4 * N` thay vì `2 * N`?",
        options: [
          "Vì mỗi nút có 4 con",
          "Vì khi N không phải lũy thừa của 2 (VD: N = 6), cây nhị phân lưu theo chỉ số `2*i` và `2*i+1` có thể có các khoảng trống khiến chỉ số lớn nhất chạm ngưỡng gần 4*N",
          "Để chứa thêm số âm",
          "Không cần, 2*N là đủ cho mọi N",
        ],
        correctIndex: 1,
        explanation: "Nếu N = 2^k + 1, tầng lá cuối cùng kéo dài sang phải gần gấp đôi chiều rộng 2^k, nên tổng chỉ số mảng 1D tối đa < 4*N.",
      },
    ],
    codeChallenge: {
      title: "Xây dựng & Truy vấn Tổng Đoạn trên Segment Tree",
      prompt:
        "Viết hàm `rangeSumQueries(arr, queries)` nhận mảng `arr` và danh sách truy vấn `queries` gồm `[L, R]` (độ dài `arr >= 1`). Hãy cài đặt Segment Tree (Build & Query) để trả về mảng đáp án tổng cho từng truy vấn `[L, R]`.",
      functionName: "rangeSumQueries",
      starterCode: `function rangeSumQueries(arr, queries) {
  const n = arr.length;
  const tree = new Array(4 * n).fill(0);

  function build(node, start, end) {
    if (start === end) {
      tree[node] = arr[start];
      return;
    }
    const mid = Math.floor((start + end) / 2);
    build(2 * node + 1, start, mid);
    build(2 * node + 2, mid + 1, end);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
  }

  function query(node, start, end, L, R) {
    // TODO: Xử lý 3 trường hợp: ngoài đoạn, trọn trong đoạn, giao một phần
    
  }

  if (n > 0) build(0, 0, n - 1);
  return queries.map(([L, R]) => (n > 0 ? query(0, 0, n - 1, L, R) : 0));
}`,
      solutionCode: `function rangeSumQueries(arr, queries) {
  const n = arr.length;
  const tree = new Array(4 * n).fill(0);

  function build(node, start, end) {
    if (start === end) {
      tree[node] = arr[start];
      return;
    }
    const mid = Math.floor((start + end) / 2);
    build(2 * node + 1, start, mid);
    build(2 * node + 2, mid + 1, end);
    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
  }

  function query(node, start, end, L, R) {
    if (R < start || end < L) return 0;
    if (L <= start && end <= R) return tree[node];
    const mid = Math.floor((start + end) / 2);
    return query(2 * node + 1, start, mid, L, R) + query(2 * node + 2, mid + 1, end, L, R);
  }

  if (n > 0) build(0, 0, n - 1);
  return queries.map(([L, R]) => (n > 0 ? query(0, 0, n - 1, L, R) : 0));
}`,
      hints: ["Ngoài đoạn: `if (R < start || end < L) return 0;`. Trọn bên trong: `if (L <= start && end <= R) return tree[node];`."],
      testCases: [
        { name: "Nhiều truy vấn đoạn", inputArgs: [[1, 3, 5, 7, 9, 11], [[0, 2], [1, 4], [0, 5]]], expected: [9, 24, 36] },
        { name: "Truy vấn 1 phần tử", inputArgs: [[10, -2, 6, 4], [[1, 1], [1, 3]]], expected: [-2, 8] },
        { name: "Mảng 1 phần tử (Edge Case)", inputArgs: [[42], [[0, 0]]], expected: [42], isEdgeCase: true },
      ],
    },
  },

  // =================== CHƯƠNG 06: ĐỐNG NHỊ PHÂN & HÀNG ĐỢI ƯU TIÊN ===================
  {
    id: "min-heap",
    code: "06.1",
    chapterId: "chapter-06-heaps",
    kind: "algorithm",
    algorithmId: "min-heap",
    title: "Binary Min Heap Operations (Sift Up / Down)",
    subtitle: "Cấu trúc nền tảng của Hàng đợi Ưu tiên (Priority Queue) cho phép lấy phần tử nhỏ nhất trong O(log N).",
    theory: {
      problemAndApplications:
        "Làm sao liên tục tìm và lấy ra phần tử NHỎ NHẤT (hoặc LỚN NHẤT) trong một tập dữ liệu đang được thêm mới liên tục? Sắp xếp lại từ đầu tốn O(N log N) mỗi lần; Min Heap giải quyết Push và Extract-Min chỉ trong O(log N)!",
      realWorldApps: [
        "Lõi của thuật toán **Dijkstra**, **Prim MST**, **A\*** và bộ lập lịch CPU (Task Scheduler).",
        "Bài toán **Top-K Elements** trên luồng dữ liệu lớn (Streaming Top-K) trong O(N log K).",
      ],
      coreIntuition:
        "Min Heap là một cây nhị phân hoàn chỉnh lưu gọn trong mảng 1D (cha ở `i`, con trái `2i+1`, con phải `2i+2`), chỉ cần duy trì một luật duy nhất: **Cha luôn nhỏ hơn hoặc bằng Con**. Khi thêm số mới vào cuối mảng, nếu nó nhỏ hơn cha, cho nó trèo ngược lên (**Sift Up**). Khi rút gốc, đưa phần tử cuối lên gốc rồi cho chìm dần xuống đúng chỗ (**Sift Down**).",
      mechanismSteps: [
        "Peek Min O(1): Đọc ngay `heap[0]`.",
        "Push O(log N): Đẩy vào cuối mảng, rồi `siftUp` so sánh với cha `Math.floor((i - 1) / 2)` và đổi chỗ nếu nhỏ hơn.",
        "Extract Min O(log N): Lưu `heap[0]`, đưa phần tử cuối lên `heap[0]`, rồi `siftDown` so sánh với con nhỏ hơn trong `{2i+1, 2i+2}` và đổi chỗ xuống dưới.",
      ],
      loopInvariant:
        "Min-Heap Property: Với mọi chỉ số `i > 0`, luôn thỏa mãn `heap[parent(i)] <= heap[i]` (CLRS Ch.6).",
      complexityDeepDive: {
        timeExplanation: "Chiều cao cây hoàn chỉnh có N nút luôn là ⌊log₂ N⌋ → Sift Up và Sift Down đi tối đa log₂ N tầng. Xây Heap từ mảng có sẵn bằng thuật toán Floyd (Bottom-up Sift Down) chỉ tốn **O(N)**!",
        spaceExplanation: "Lưu trực tiếp trên mảng 1D không cần con trỏ trái/phải → O(N).",
        best: "O(1) peek",
        average: "O(log N)",
        worst: "O(log N)",
        space: "O(N)",
      },
      edgeCasesAndPitfalls: [
        "Khi Sift Down phải so sánh với **con NHỎ HƠN** trong 2 con trái/phải trước khi đổi chỗ với cha!",
        "Quên kiểm tra khi Heap chỉ còn 1 phần tử lúc Extract-Min (pop xong là rỗng, không được gán lại vào `heap[0]`).",
      ],
      tradeOffs: [
        "Heap chỉ đảm bảo tìm Min/Max tức thì O(1), không hỗ trợ tìm kiếm phần tử bất kỳ nhanh (mất O(N)) — khác với BST tìm mọi phần tử O(log N).",
      ],
      references: ["MIT 6.006 — Lecture 8: Binary Heaps", "CLRS — Chapter 6 (Heapsort & Priority Queues)"],
    },
    quizQuestions: [
      {
        id: "heap-q1",
        question: "Trên cây nhị phân lưu bằng mảng 1D đánh chỉ số từ 0 (`0, 1, 2, ...`), nếu nút hiện tại nằm ở vị trí `i`, thì nút CHA và hai nút CON của nó nằm ở đâu?",
        options: [
          "Cha: i/2 | Con: 2i, 2i+1",
          "Cha: Math.floor((i - 1) / 2) | Con trái: 2*i + 1, Con phải: 2*i + 2",
          "Cha: i - 1 | Con: i + 1, i + 2",
          "Không tính được bằng công thức",
        ],
        correctIndex: 1,
        explanation: "Với chỉ số bắt đầu từ 0: cha của i là floor((i-1)/2), hai con là 2i+1 và 2i+2.",
      },
    ],
    codeChallenge: {
      title: "Tìm phần tử nhỏ thứ K / Mô phỏng Min Heap (Push & Extract-Min)",
      prompt:
        "Hãy hoàn thiện class/hàm `processMinHeap(nums, extractCount)`: chèn lần lượt tất cả các số trong `nums` vào Min Heap (dùng Sift Up), sau đó thực hiện `extractCount` lần `extractMin` (dùng Sift Down) và trả về mảng các giá trị đã rút ra.",
      functionName: "processMinHeap",
      starterCode: `function processMinHeap(nums, extractCount) {
  const heap = [];

  function push(val) {
    heap.push(val);
    let i = heap.length - 1;
    // TODO: Sift Up
    
  }

  function extractMin() {
    if (heap.length === 0) return null;
    const min = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      // TODO: Sift Down từ i = 0
      
    }
    return min;
  }

  for (const x of nums) push(x);
  const res = [];
  for (let k = 0; k < extractCount; k++) {
    const m = extractMin();
    if (m !== null) res.push(m);
  }
  return res;
}`,
      solutionCode: `function processMinHeap(nums, extractCount) {
  const heap = [];

  function push(val) {
    heap.push(val);
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (heap[p] <= heap[i]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  }

  function extractMin() {
    if (heap.length === 0) return null;
    const min = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      const n = heap.length;
      while (true) {
        let smallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n && heap[left] < heap[smallest]) smallest = left;
        if (right < n && heap[right] < heap[smallest]) smallest = right;
        if (smallest === i) break;
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }
    return min;
  }

  for (const x of nums) push(x);
  const res = [];
  for (let k = 0; k < extractCount; k++) {
    const m = extractMin();
    if (m !== null) res.push(m);
  }
  return res;
}`,
      hints: ["Sift Up so sánh `heap[p] > heap[i]`; Sift Down tìm `smallest` giữa `i`, `2*i+1`, `2*i+2` rồi swap cho đến khi `smallest === i`."],
      testCases: [
        { name: "Rút 3 phần tử nhỏ nhất", inputArgs: [[10, 4, 15, 1, 8, 3], 3], expected: [1, 3, 4] },
        { name: "Rút toàn bộ mảng", inputArgs: [[5, 2, 9, -3, 7], 5], expected: [-3, 2, 5, 7, 9] },
        { name: "Trùng lặp phần tử", inputArgs: [[4, 4, 2, 2], 4], expected: [2, 2, 4, 4] },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[], 2], expected: [], isEdgeCase: true },
      ],
    },
  },

  {
    id: "heap-sort",
    code: "06.2",
    chapterId: "chapter-06-heaps",
    kind: "algorithm",
    algorithmId: "heap-sort",
    title: "Heap Sort (Sắp xếp vun đống)",
    subtitle: "Đảm bảo O(N log N) trong mọi trường hợp mà CHỈ tốn O(1) bộ nhớ phụ nhờ sắp xếp trên Max Heap.",
    theory: {
      problemAndApplications:
        "Merge Sort đảm bảo O(N log N) nhưng tốn O(N) RAM; Quick Sort tốn O(log N) nhưng có thể tụt xuống O(N²). Heap Sort kết hợp ưu điểm của cả hai: **luôn là O(N log N) và tại chỗ O(1) Space**!",
      realWorldApps: [
        "Là thuật toán dự phòng trong **Introsort** (C++ `std::sort`): nếu độ sâu đệ quy của Quick Sort vượt quá `2 * log N`, hệ thống tự chuyển sang Heap Sort để bảo toàn giới hạn O(N log N)!",
      ],
      coreIntuition:
        "Pha 1: Biến mảng lộn xộn thành một **Max Heap** (nút lớn nhất luôn nằm ở `arr[0]`). Pha 2: Liên tục đổi chỗ `arr[0]` (lớn nhất) về cuối đoạn hiện tại, thu hẹp kích thước heap đi 1, rồi gọi `heapify(0)` để phần tử lớn tiếp theo nổi lên đỉnh!",
      mechanismSteps: [
        "Build Max Heap O(N): Chạy `heapify(n, i)` từ nút cha cuối cùng `Math.floor(n/2) - 1` ngược về `0`.",
        "Trích xuất lặp `i` từ `n - 1` về `1`: Đổi chỗ `arr[0]` với `arr[i]` (cố định giá trị lớn nhất ở cuối).",
        "Gọi `heapify(i, 0)` trên phần heap còn lại kích thước `i`.",
      ],
      loopInvariant:
        "Trước mỗi vòng lặp rút `i`: đoạn `arr[0..i]` là một Max Heap hợp lệ, và đoạn `arr[i+1..n-1]` chứa `n - i - 1` phần tử lớn nhất đã được sắp xếp đúng vị trí.",
      complexityDeepDive: {
        timeExplanation: "Build Heap O(N) + (N - 1) lần `heapify` O(log N) → Θ(N log N) trong MỌI trường hợp.",
        spaceExplanation: "Làm việc hoàn toàn trên mảng gốc bằng vòng lặp `heapify` (hoặc đệ quy đuôi) → O(1) Auxiliary Space.",
        best: "O(N log N)",
        average: "O(N log N)",
        worst: "O(N log N)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Heap Sort KHÔNG ổn định (Unstable).",
        "Trong thực tế chậm hơn Quick Sort một chút do phép nhảy `2i + 1` gây Cache Miss nhiều hơn.",
      ],
      tradeOffs: [
        "An toàn nhất về cả Thời gian worst-case O(N log N) lẫn Bộ nhớ O(1), rất hợp cho hệ thống nhúng bị giới hạn RAM.",
      ],
      references: ["CLRS — Chapter 6.4 (The Heapsort Algorithm)", "MIT 6.006 — Lecture 8"],
    },
    quizQuestions: [
      {
        id: "hs-q1",
        question: "Để sắp xếp mảng TĂNG DẦN bằng Heap Sort tại chỗ, ta nên xây dựng loại Heap nào ở Pha 1?",
        options: [
          "Min Heap",
          "Max Heap (để rút phần tử LỚN NHẤT đặt dần về cuối mảng)",
          "Cả hai đều không làm tại chỗ được",
          "AVL Tree",
        ],
        correctIndex: 1,
        explanation: "Max Heap đưa phần tử lớn nhất lên đỉnh arr[0]; mỗi bước ta đổi arr[0] về cuối mảng i, nên phần cuối mảng được điền từ lớn đến nhỏ → toàn mảng tăng dần!",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Heap Sort Tại Chỗ O(N log N) / O(1) Space",
      prompt: "Viết hàm `heapSort(arr)` sắp xếp mảng `arr` tăng dần tại chỗ bằng Max Heap.",
      functionName: "heapSort",
      starterCode: `function heapSort(arr) {
  const n = arr.length;
  function heapify(size, rootIdx) {
    // TODO: Vun đống Max Heap tại nút rootIdx trong phạm vi size
    
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(i, 0);
  }
  return arr;
}`,
      solutionCode: `function heapSort(arr) {
  const n = arr.length;
  function heapify(size, rootIdx) {
    let largest = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;
    if (left < size && arr[left] > arr[largest]) largest = left;
    if (right < size && arr[right] > arr[largest]) largest = right;
    if (largest !== rootIdx) {
      [arr[rootIdx], arr[largest]] = [arr[largest], arr[rootIdx]];
      heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(i, 0);
  }
  return arr;
}`,
      hints: ["So sánh `arr[left] > arr[largest]` và `arr[right] > arr[largest]` (lưu ý `< size`), nếu `largest !== rootIdx` thì swap và đệ quy `heapify(size, largest)`."],
      testCases: [
        { name: "Mảng ngẫu nhiên", inputArgs: [[12, 11, 13, 5, 6, 7]], expected: [5, 6, 7, 11, 12, 13] },
        { name: "Số âm & trùng", inputArgs: [[4, -1, 4, 0, -9]], expected: [-9, -1, 0, 4, 4] },
        { name: "1 phần tử (Edge Case)", inputArgs: [[100]], expected: [100], isEdgeCase: true },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[]], expected: [], isEdgeCase: true },
      ],
    },
  },
];
