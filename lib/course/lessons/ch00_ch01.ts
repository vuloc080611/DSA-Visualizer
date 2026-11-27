import { CourseLesson } from "../types";

export const LESSONS_CH00_CH01: CourseLesson[] = [
  // =================== CHƯƠNG 00: NHẬP MÔN & TƯ DUY GIẢI THUẬT ===================
  {
    id: "course-intro",
    code: "00.1",
    chapterId: "chapter-00-foundations",
    kind: "concept",
    title: "Giới thiệu Khóa học & Phương pháp học DSA",
    subtitle: "Hiểu bản đồ lộ trình 42 bài học chuẩn MIT/Princeton & quy chuẩn 4 chặng để làm chủ giải thuật.",
    interactiveWidget: "intro-roadmap",
    theory: {
      problemAndApplications:
        "Nhiều người học Cấu trúc Dữ liệu & Giải thuật (DSA) thường bỏ cuộc giữa chừng vì học thuộc lòng code máy móc hoặc nhảy thẳng vào bài khó mà thiếu tư duy nền tảng. Khóa học này được tổ chức lại theo chuẩn đại học (MIT 6.006, Princeton Algorithms 4th Ed, OpenDSA), dẫn dắt từng bước từ cách máy tính lưu trữ dữ liệu trong RAM đến những chiến lược tối ưu hóa kinh điển.",
      realWorldApps: [
        "Thiết kế hệ thống tìm kiếm, gợi ý, định tuyến bản đồ và xử lý dữ liệu lớn hiệu năng cao.",
        "Vượt qua các vòng phỏng vấn kỹ thuật (Coding Interview) tại các công ty công nghệ.",
        "Nâng cao tư duy viết code sạch, dự đoán được chi phí bộ nhớ và thời gian chạy trước khi deploy.",
      ],
      coreIntuition:
        "Thuật toán (Algorithm) không phải là những đoạn code bí ẩn để học vẹt — đó là tập hợp hữu hạn các bước chỉ dẫn rõ ràng nhằm biến Đầu vào (Input) thành Đầu ra (Output) đúng đắn. Cấu trúc Dữ liệu (Data Structure) là cách sắp xếp dữ liệu trong bộ nhớ để thuật toán thao tác nhanh nhất.",
      mechanismSteps: [
        "Chặng 1 — Lý thuyết chuẩn hóa: Đọc hiểu bài toán, trực giác cốt lõi, điều kiện bất biến và độ phức tạp Big-O.",
        "Chặng 2 — Xem & Thử Demo: Quan sát từng bước thực thi trên Canvas trực quan và tự thử thay đổi dữ liệu đầu vào.",
        "Chặng 3 — Thực hành tư duy: Trả lời các câu hỏi tình huống hoặc tự tay điều khiển thuật toán ở chế độ Challenge.",
        "Chặng 4 — Code & Chấm bài: Viết lại hàm giải thuật bằng JavaScript và vượt qua 100% Test Cases tự động (bao gồm test biên) để Pass & mở khóa bài tiếp theo.",
      ],
      loopInvariant:
        "Nguyên tắc cốt lõi xuyên suốt khóa học: Hiểu 'Tại sao nó đúng' (Correctness) trước khi viết code, và luôn đo chi phí tăng trưởng theo kích thước dữ liệu N.",
      complexityDeepDive: {
        timeExplanation: "Việc học theo lộ trình 4 chặng giúp tiết kiệm thời gian ôn luyện về lâu dài nhờ nắm vững bản chất thay vì học thuộc.",
        spaceExplanation: "Tài liệu lưu tiến trình học tập trực tiếp trên trình duyệt của bạn, mở khóa tuần tự từng bài.",
        best: "Tùy bài",
        average: "15–30 phút/bài",
        worst: "Linh hoạt",
        space: "Lưu cục bộ",
      },
      edgeCasesAndPitfalls: [
        "Sai lầm 1: Chỉ xem hoạt ảnh cho đẹp mà không tự viết lại code.",
        "Sai lầm 2: Bỏ qua các bài nền tảng Chương 00 (Big-O, Bộ nhớ, Đệ quy) khiến càng về sau càng mất gốc.",
        "Sai lầm 3: Quên kiểm tra các trường hợp biên như mảng rỗng [], 1 phần tử, hoặc giá trị âm.",
      ],
      tradeOffs: [
        "Học tuần tự có khóa bài (Hướng B) giúp kiến thức nối tiếp chắc chắn hơn so với nhảy cóc ngẫu nhiên.",
      ],
      references: [
        "MIT OpenCourseWare 6.006 — Introduction to Algorithms (Lecture 1)",
        "OpenDSA (Virginia Tech) — Chapter 0 & Chapter 1: Data Structures and Algorithms",
      ],
    },
    quizQuestions: [
      {
        id: "intro-q1",
        question: "Theo lộ trình học chuẩn của khóa này, bạn cần hoàn thành yếu tố nào để chính thức Pass một bài học thuật toán?",
        options: [
          "Chỉ cần xem mô phỏng đến bước cuối cùng",
          "Đọc lý thuyết, vượt qua kiểm tra tư duy và Code qua 100% Test Cases",
          "Chỉ cần đọc hết phần code mẫu C++",
          "Bấm nút đánh dấu thủ công",
        ],
        correctIndex: 1,
        explanation: "Để đảm bảo thực sự làm chủ thuật toán, bạn phải vượt qua cả kiểm tra tư duy và tự viết code vượt qua toàn bộ Test Cases.",
      },
      {
        id: "intro-q2",
        question: "Tại sao trong kỹ thuật phần mềm ta cần chọn đúng Cấu trúc dữ liệu trước khi viết thuật toán?",
        options: [
          "Vì trình biên dịch yêu cầu phải viết tên cấu trúc dữ liệu",
          "Vì cách dữ liệu được tổ chức quyết định trực tiếp tốc độ truy cập, chèn, xóa và bộ nhớ tiêu tốn",
          "Chỉ để làm code trông dài và chuyên nghiệp hơn",
          "Không quan trọng, mọi cấu trúc dữ liệu đều có tốc độ như nhau",
        ],
        correctIndex: 1,
        explanation: "Theo giáo trình MIT 6.006 & Princeton, chọn đúng CTDL (VD: Hash Table vs Linked List) có thể giảm thời gian chạy từ O(N) xuống O(1).",
      },
    ],
  },

  {
    id: "memory-ram-adt",
    code: "00.2",
    chapterId: "chapter-00-foundations",
    kind: "concept",
    title: "Bộ nhớ RAM, Mảng & Kiểu dữ liệu trừu tượng (ADT)",
    subtitle: "Hiểu cách dữ liệu nằm trong bộ nhớ vật lý để biết vì sao truy cập mảng tốn O(1) còn chèn giữa tốn O(N).",
    interactiveWidget: "ram-adt",
    theory: {
      problemAndApplications:
        "Tại sao truy cập `arr[500]` lại nhanh ngang `arr[0]`, trong khi chèn thêm một phần tử vào đầu mảng lớn lại chậm? Câu trả lời nằm hoàn toàn ở cách Bộ nhớ truy cập ngẫu nhiên (RAM) tổ chức các ô nhớ theo địa chỉ vật lý.",
      realWorldApps: [
        "Cấp phát bộ nhớ đệm (Buffer), lưu ảnh/video dạng ma trận pixel liên tiếp trong RAM.",
        "Hiểu bản chất Con trỏ (Pointer/Reference) để xây dựng Danh sách liên kết, Cây và Đồ thị.",
      ],
      coreIntuition:
        "Hãy tưởng tượng RAM là một dãy tủ locker khổng lồ đánh số địa chỉ từ 0, 1, 2, 3... Bộ nhớ cho phép CPU nhảy thẳng tới bất kỳ địa chỉ nào trong 1 nhịp (Random Access = O(1)). Mảng (Array) đặt các phần tử nằm sát cạnh nhau nên chỉ cần biết địa chỉ đầu + chỉ số i là tính ra ngay vị trí ô nhớ: address(i) = base + i * size.",
      mechanismSteps: [
        "Mảng tĩnh (Static Array): Cấp phát một khối ô nhớ liên tiếp cố định. Đọc/ghi phần tử thứ i tốn O(1).",
        "Chèn/Xóa ở đầu hoặc giữa mảng: Phải dịch chuyển toàn bộ các phần tử phía sau để giữ tính liên tiếp → tốn O(N).",
        "Mảng động (Dynamic Array — như ArrayList/vector/JS Array): Khi đầy, cấp phát vùng nhớ mới gấp đôi (2x) và sao chép sang → chi phí thêm cuối trung bình (Amortized) vẫn là O(1).",
        "Kiểu dữ liệu trừu tượng (ADT vs Data Structure): ADT định nghĩa 'LÀM GÌ' (giao diện Stack có push/pop), còn CTDL định nghĩa 'LÀM NHƯ THẾ NÀO' (cài đặt bằng Mảng hay Danh sách liên kết).",
      ],
      loopInvariant:
        "Tính liên tiếp vật lý (Contiguous Memory) là cái giá của truy cập ngẫu nhiên O(1): đổi lại, kích thước mảng khó thay đổi tại chỗ mà không dịch chuyển phần tử.",
      complexityDeepDive: {
        timeExplanation: "Truy cập arr[i] tính bằng phép cộng địa chỉ O(1). Chèn giữa/đầu mảng phải dời tối đa N phần tử nên mất O(N).",
        spaceExplanation: "Mảng không tốn thêm bộ nhớ lưu con trỏ phụ như Linked List, tận dụng tối đa CPU Cache Locality.",
        best: "O(1) truy cập",
        average: "O(1) thêm cuối (Dynamic)",
        worst: "O(N) chèn/xóa đầu",
        space: "O(N)",
      },
      edgeCasesAndPitfalls: [
        "Truy cập ngoài biên mảng (Index Out of Bounds): arr[-1] hoặc arr[N].",
        "Nhầm lẫn giữa Kích thước logic (Length) và Dung lượng cấp phát (Capacity) của Mảng động.",
      ],
      tradeOffs: [
        "Mảng (Contiguous) vs Danh sách liên kết (Pointer-based): Mảng đọc cực nhanh O(1) nhờ Cache CPU, nhưng chèn đầu chậm O(N); Danh sách liên kết ngược lại.",
      ],
      references: [
        "MIT OpenCourseWare 6.006 — Lecture 2: Data Structures & Dynamic Arrays",
        "OpenDSA — Chapter 1: Abstract Data Types & Arrays",
      ],
    },
    quizQuestions: [
      {
        id: "ram-q1",
        question: "Vì sao phép đọc phần tử `arr[999999]` trong một mảng 1 triệu số nguyên vẫn chỉ tốn O(1)?",
        options: [
          "Vì CPU dùng tìm kiếm nhị phân để tìm ô nhớ thứ 999999",
          "Vì các phần tử nằm liên tiếp trong RAM, CPU tính thẳng địa chỉ bằng công thức base + index * element_size",
          "Vì mảng tự động lưu mọi chỉ số vào Hash Table",
          "Vì hệ điều hành luôn giữ phần tử cuối cùng trong thanh ghi",
        ],
        correctIndex: 1,
        explanation: "Địa chỉ phần tử thứ i được tính bằng 1 phép toán số học đơn giản O(1) nhờ tính liên tiếp trong RAM.",
      },
      {
        id: "ram-q2",
        question: "Phát biểu nào phân biệt ĐÚNG giữa Kiểu dữ liệu trừu tượng (ADT) và Cấu trúc dữ liệu (Data Structure)?",
        options: [
          "ADT và Cấu trúc dữ liệu là hoàn toàn giống nhau",
          "ADT mô tả hành vi/tập thao tác từ góc độ người dùng; Cấu trúc dữ liệu là cách cài đặt cụ thể trong bộ nhớ",
          "ADT chỉ tồn tại trong ngôn ngữ C++",
          "Cấu trúc dữ liệu không thể cài đặt được bằng mảng",
        ],
        correctIndex: 1,
        explanation: "Theo OpenDSA Ch.1, ADT (ví dụ List, Stack, Queue) định nghĩa đặc tả logic (What), còn Data Structure (Array, Linked List) là cài đặt cụ thể (How).",
      },
    ],
  },

  {
    id: "big-o-complexity",
    code: "00.3",
    chapterId: "chapter-00-foundations",
    kind: "concept",
    title: "Phân tích Thuật toán & Ký hiệu Big-O",
    subtitle: "Đếm số bước thực thi theo kích thước đầu vào N — không đo bằng giây đồng hồ.",
    interactiveWidget: "big-o-growth",
    theory: {
      problemAndApplications:
        "Tại sao không bấm giờ bằng đồng hồ để so sánh hai thuật toán? Vì một thuật toán tệ chạy trên siêu máy tính vẫn có thể nhanh hơn thuật toán tốt chạy trên điện thoại cũ khi đầu vào nhỏ. Để đánh giá khách quan, Khoa học Máy tính dùng Phân tích Tiệm cận (Asymptotic Analysis — Big-O).",
      realWorldApps: [
        "Ước lượng xem giải pháp có bị Time Limit Exceeded (TLE) khi N = 10^5 hoặc 10^6 hay không.",
        "Chọn kiến trúc cơ sở dữ liệu & chỉ mục (B-Tree O(log N) vs Full Table Scan O(N)).",
      ],
      coreIntuition:
        "Đừng đếm giây — hãy đếm SỐ BƯỚC cơ bản mà thuật toán phải thực hiện khi kích thước dữ liệu N tăng lên rất lớn (N → ∞). Ký hiệu Big-O giữ lại thành phần tăng trưởng nhanh nhất (Dominant Term) và bỏ qua các hằng số nhân (Constant Factors).",
      mechanismSteps: [
        "O(1) — Hằng số: Thời gian không đổi bất kể N lớn cỡ nào (VD: lấy phần tử đầu mảng).",
        "O(log N) — Logarit: Mỗi bước chặt đôi không gian tìm kiếm (VD: Tìm kiếm nhị phân trên 1 tỷ phần tử chỉ mất ~30 bước!).",
        "O(N) — Tuyến tính: Duyệt qua mỗi phần tử một số lần cố định (VD: Tìm giá trị lớn nhất).",
        "O(N log N) — Tuyến tính-Log: Chuẩn vàng của sắp xếp hiệu quả (Merge Sort, Quick Sort trung bình).",
        "O(N²) — Bậc hai: Vòng lặp lồng nhau duyệt mọi cặp (VD: Bubble Sort); chạm ngưỡng nguy hiểm khi N > 10^4.",
        "O(2^N) — Hàm mũ: Tăng bùng nổ theo cấp số nhân (VD: Đệ quy vét cạn không ghi nhớ).",
      ],
      loopInvariant:
        "Quy tắc tính Big-O thực chiến (CLRS Ch.3): Bỏ hằng số (O(3N) → O(N)), chỉ giữ số hạng bậc cao nhất (O(N² + 100N) → O(N²)), cộng khi tuần tự, nhân khi lồng nhau.",
      complexityDeepDive: {
        timeExplanation: "Luôn xét 3 trường hợp: Tốt nhất (Best - Ω), Trung bình (Average - Θ) và Tệ nhất (Worst - O). Trong phỏng vấn và hệ thống thực tế, ta quan tâm nhất đến Worst-case để đảm bảo độ an toàn.",
        spaceExplanation: "Space Complexity đo lượng bộ nhớ PHỤ (Auxiliary Space) cấp phát thêm ngoài đầu vào, bao gồm cả độ sâu Call Stack đệ quy.",
        best: "O(1)",
        average: "O(log N) .. O(N log N)",
        worst: "O(N²) / O(2^N)",
        space: "Tùy giải thuật",
      },
      edgeCasesAndPitfalls: [
        "Nhầm O(N + M) thành O(N): Khi có 2 đầu vào độc lập (ví dụ 2 mảng hoặc V đỉnh & E cạnh), KHÔNG được gộp chung một biến.",
        "Quên tính độ sâu ngăn xếp đệ quy (Recursion Call Stack) vào Space Complexity.",
      ],
      tradeOffs: [
        "Time-Space Trade-off: Ta thường dùng thêm bộ nhớ (như Hash Table hoặc mảng DP) để đổi lấy thời gian chạy nhanh hơn.",
      ],
      references: [
        "MIT OpenCourseWare 6.006 — Lecture 1: Algorithms and Computation",
        "CLRS — Chapter 3: Growth of Functions",
      ],
    },
    quizQuestions: [
      {
        id: "bigo-q1",
        question: "Với một mảng có N = 1,000,000 (1 triệu) phần tử đã sắp xếp, Tìm kiếm nhị phân O(log₂ N) cần tối đa khoảng bao nhiêu bước so sánh?",
        options: ["Khoảng 500,000 bước", "Khoảng 20 bước", "Khoảng 1,000 bước", "Đúng 1 bước"],
        correctIndex: 1,
        explanation: "Vì 2²⁰ = 1,048,576 > 1,000,000, nên sau tối đa 20 lần chia đôi ta chắc chắn tìm ra kết quả!",
      },
      {
        id: "bigo-q2",
        question: "Độ phức tạp của biểu thức T(N) = 5N² + 20N log N + 1000 theo ký hiệu Big-O là gì?",
        options: ["O(N² + N log N)", "O(5N²)", "O(N²)", "O(N log N)"],
        correctIndex: 2,
        explanation: "Ta bỏ hệ số hằng (5, 20, 1000) và giữ lại số hạng tăng trưởng nhanh nhất là N² → O(N²).",
      },
      {
        id: "bigo-q3",
        question: "Một hàm duyệt tuần tự qua mảng A độ dài N, sau đó duyệt một vòng lặp độc lập qua mảng B độ dài M. Độ phức tạp thời gian là:",
        options: ["O(N * M)", "O(N + M)", "O(N²)", "O(M²)"],
        correctIndex: 1,
        explanation: "Hai vòng lặp chạy nối tiếp (tuần tự) trên 2 kích thước độc lập N và M nên ta cộng lại: O(N + M).",
      },
    ],
  },

  {
    id: "recursion-divide-conquer",
    code: "00.4",
    chapterId: "chapter-00-foundations",
    kind: "concept",
    title: "Đệ quy & Tư duy Chia để trị",
    subtitle: "Làm chủ Call Stack, Điều kiện dừng (Base Case) và nền tảng của Merge Sort, Cây, Quay lui.",
    interactiveWidget: "recursion-stack",
    theory: {
      problemAndApplications:
        "Làm sao viết thuật toán duyệt một cây thư mục lồng nhau vô hạn cấp hoặc chia một bài toán khổng lồ thành các mảnh giống hệt nhau? Đệ quy (Recursion) là công cụ tự nhiên nhất để mô tả cấu trúc tự tương đồng (Self-similar).",
      realWorldApps: [
        "Duyệt cây DOM HTML, cây thư mục hệ điều hành, trình phân tích cú pháp (Parser).",
        "Là bộ khung của Merge Sort, Quick Sort, Cây nhị phân, DFS, Quay lui và Quy hoạch động Top-Down.",
      ],
      coreIntuition:
        "Đệ quy giống như mở một dãy búp bê Matryoshka: mỗi con búp bê lớn chứa một con nhỏ hơn cùng hình dáng cho đến con nhỏ nhất không thể mở nữa (Base Case). Trong máy tính, mỗi lần hàm tự gọi chính nó, hệ thống đẩy một khung nhớ (Stack Frame) lên Call Stack và thu gọn ngược lại khi chạm Base Case.",
      mechanismSteps: [
        "Bước 1 — Base Case (Điều kiện dừng): Trường hợp nhỏ nhất trả về kết quả trực tiếp (VD: n <= 1). Nếu thiếu Base Case → Lỗi tràn ngăn xếp (Stack Overflow).",
        "Bước 2 — Recursive Step (Bước đệ quy): Gọi lại hàm với đầu vào NHỎ HƠN tiến gần về Base Case.",
        "Bước 3 — Tư duy Chia để trị (Divide & Conquer — CLRS Ch.4): Chia bài toán thành k bài con độc lập → Giải đệ quy các bài con → Trộn (Combine) kết quả.",
      ],
      loopInvariant:
        "Để chứng minh hàm đệ quy đúng (bằng Quy nạp Toán học): Base Case đúng + Nếu bài con kích thước nhỏ hơn đúng thì bước kết hợp ở kích thước N cũng đúng.",
      complexityDeepDive: {
        timeExplanation: "Đo bằng tổng công việc trên toàn bộ Cây đệ quy (Recurrence Tree / Master Theorem: T(N) = aT(N/b) + f(N)).",
        spaceExplanation: "Tỷ lệ thuận với chiều sâu tối đa của Call Stack (Recursion Depth).",
        best: "O(1) depth",
        average: "O(log N) .. O(N)",
        worst: "Stack Overflow nếu quá sâu",
        space: "O(Chiều sâu cây đệ quy)",
      },
      edgeCasesAndPitfalls: [
        "Quên Base Case hoặc gọi đệ quy với đầu vào không thu nhỏ lại → Stack Overflow.",
        "Đệ quy phân nhánh trùng lặp (như Fibonacci ngây thơ f(n-1)+f(n-2)) làm số bước nổ thành O(2^N).",
      ],
      tradeOffs: [
        "Đệ quy giúp code ngắn gọn, biểu cảm trên Cây/Đồ thị, nhưng tốn bộ nhớ Call Stack hơn vòng lặp (Iterative).",
      ],
      references: [
        "CLRS — Chapter 4: Divide-and-Conquer",
        "Princeton Algorithms 4th Ed — Section 1.1: Recursion",
      ],
    },
    quizQuestions: [
      {
        id: "rec-q1",
        question: "Thành phần nào BẮT BUỘC phải có trong mọi hàm đệ quy để tránh lỗi Stack Overflow?",
        options: [
          "Một vòng lặp for",
          "Điều kiện dừng (Base Case) mà mọi nhánh đệ quy đều phải thu hẹp về tới đó",
          "Ít nhất 2 câu lệnh return",
          "Biến toàn cục (Global variable)",
        ],
        correctIndex: 1,
        explanation: "Thiếu Base Case hoặc đầu vào không tiến về Base Case khiến Call Stack đầy và gây lỗi Stack Overflow.",
      },
      {
        id: "rec-q2",
        question: "Theo mô hình Chia để trị (Divide and Conquer), bước thứ 3 sau khi Chia (Divide) và Trị (Conquer) là gì?",
        options: ["Xóa bỏ bài toán con", "Trộn/Kết hợp (Combine) kết quả từ các bài toán con", "Sắp xếp lại đầu vào", "Chạy lại từ đầu"],
        correctIndex: 1,
        explanation: "Mô hình Divide & Conquer chuẩn CLRS gồm 3 bước: Divide (Chia) → Conquer (Trị đệ quy) → Combine (Kết hợp kết quả).",
      },
    ],
    codeChallenge: {
      title: "Tính tổng mảng bằng Đệ quy (Chia để trị / Đệ quy tuyến tính)",
      prompt:
        "Hãy viết hàm đệ quy `sumArray(arr, index = 0)` tính tổng tất cả các số trong mảng `arr` mà KHÔNG dùng vòng lặp `for` hay `while`.",
      functionName: "sumArray",
      starterCode: `function sumArray(arr, index = 0) {
  // Base Case: nếu index vượt quá cuối mảng, trả về 0
  if (index >= arr.length) return 0;

  // Recursive Step: lấy arr[index] + tổng phần còn lại
  // Viết code của bạn ở đây
  
}`,
      solutionCode: `function sumArray(arr, index = 0) {
  if (index >= arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
}`,
      hints: [
        "Base Case đã gợi ý sẵn: khi index >= arr.length trả về 0.",
        "Bước đệ quy đơn giản là: return arr[index] + sumArray(arr, index + 1);",
      ],
      testCases: [
        { name: "Mảng chuẩn dương", inputArgs: [[1, 2, 3, 4, 5]], expected: 15 },
        { name: "Mảng có số âm & số 0", inputArgs: [[-3, 0, 7, -2]], expected: 2 },
        { name: "Mảng 1 phần tử (Edge Case)", inputArgs: [[42]], expected: 42, isEdgeCase: true },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[]], expected: 0, isEdgeCase: true },
      ],
    },
  },

  // =================== CHƯƠNG 01: TÌM KIẾM & KỸ THUẬT MẢNG ===================
  {
    id: "linear-search",
    code: "01.1",
    chapterId: "chapter-01-arrays-searching",
    kind: "algorithm",
    algorithmId: "linear-search",
    title: "Linear Search (Tìm kiếm tuần tự)",
    subtitle: "Thuật toán tìm kiếm cơ bản nhất — duyệt tuần tự từng phần tử không cần mảng sắp xếp trước.",
    theory: {
      problemAndApplications:
        "Cho một mảng `arr` gồm N phần tử (chưa sắp xếp) và giá trị `target`. Hãy trả về chỉ số (index) đầu tiên mà `arr[i] === target`, hoặc trả về `-1` nếu không tồn tại.",
      realWorldApps: [
        "Tìm kiếm trên các danh sách ngắn hoặc dữ liệu chưa qua sắp xếp/lập chỉ mục.",
        "Phép tìm kiếm mặc định của `Array.prototype.indexOf()` hoặc `.find()` trong JavaScript.",
      ],
      coreIntuition:
        "Giống như tìm một cuốn sách cụ thể trên một giá sách lộn xộn: bạn không còn cách nào khác ngoài việc lướt mắt từng quyển từ trái sang phải cho đến khi gặp cuốn cần tìm hoặc hết giá sách.",
      mechanismSteps: [
        "Khởi tạo con trỏ i = 0 ở đầu mảng.",
        "Ở mỗi bước, so sánh arr[i] với target.",
        "Nếu arr[i] === target → lập tức trả về i (dừng sớm).",
        "Nếu không khớp, tăng i lên 1 và lặp lại đến khi i === N → trả về -1.",
      ],
      loopInvariant:
        "Trước mỗi vòng lặp ở vị trí i, ta chắc chắn rằng đoạn mảng con arr[0 .. i-1] KHÔNG chứa phần tử nào bằng target.",
      complexityDeepDive: {
        timeExplanation: "Best: O(1) nếu phần tử ở ngay vị trí 0. Average & Worst: O(N) khi phần tử ở cuối hoặc không tồn tại.",
        spaceExplanation: "Chỉ dùng đúng biến đếm chỉ số i → O(1) bộ nhớ phụ.",
        best: "O(1)",
        average: "O(N)",
        worst: "O(N)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Mảng rỗng []: Vòng lặp không chạy lần nào, trả về ngay -1.",
        "Có nhiều phần tử trùng với target: Cần trả về vị trí ĐẦU TIÊN tìm thấy.",
      ],
      tradeOffs: [
        "Ưu điểm: Không yêu cầu mảng phải sắp xếp trước, cài đặt cực đơn giản, thân thiện với Bộ nhớ đệm (CPU Cache).",
        "Nhược điểm: Chậm O(N) khi tìm kiếm lặp lại nhiều lần trên tập dữ liệu lớn (nên sắp xếp rồi dùng Binary Search hoặc đưa vào Hash Table).",
      ],
      references: ["CLRS — Chapter 2 (Linear Search Exercise)", "OpenDSA — Linear Search"],
    },
    quizQuestions: [
      {
        id: "ls-q1",
        question: "Điều kiện tiên quyết nào cần có để chạy Linear Search đúng đắn?",
        options: [
          "Mảng bắt buộc phải sắp xếp tăng dần",
          "Mảng không được chứa số âm",
          "Không cần điều kiện sắp xếp nào, mảng lộn xộn vẫn chạy đúng",
          "Kích thước mảng phải là lũy thừa của 2",
        ],
        correctIndex: 2,
        explanation: "Linear Search duyệt qua mọi phần tử từ đầu đến cuối nên hoạt động đúng trên cả mảng chưa sắp xếp.",
      },
      {
        id: "ls-q2",
        question: "Trường hợp tệ nhất (Worst-case) của Linear Search xảy ra khi nào?",
        options: [
          "target nằm ngay ở arr[0]",
          "target nằm ở giữa mảng",
          "target nằm ở cuối mảng hoặc hoàn toàn không có trong mảng",
          "Mảng chỉ có 1 phần tử",
        ],
        correctIndex: 2,
        explanation: "Khi target không tồn tại hoặc nằm cuối, thuật toán buộc phải kiểm tra toàn bộ N phần tử → O(N).",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Linear Search",
      prompt: "Viết hàm `linearSearch(arr, target)` trả về index ĐẦU TIÊN của `target` trong mảng `arr`. Nếu không tìm thấy, trả về `-1`.",
      functionName: "linearSearch",
      starterCode: `function linearSearch(arr, target) {
  // Duyệt từ index 0 đến hết mảng arr
  // Nếu arr[i] === target thì trả về i
  
  return -1;
}`,
      solutionCode: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      hints: ["Dùng vòng lặp `for (let i = 0; i < arr.length; i++)` và kiểm tra `arr[i] === target`."],
      testCases: [
        { name: "Tìm thấy ở giữa", inputArgs: [[10, 25, 42, 7, 19], 42], expected: 2 },
        { name: "Tìm thấy đầu tiên khi trùng lặp", inputArgs: [[5, 8, 5, 9], 5], expected: 0 },
        { name: "Không tìm thấy", inputArgs: [[1, 2, 3, 4], 99], expected: -1 },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[], 10], expected: -1, isEdgeCase: true },
      ],
    },
  },

  {
    id: "binary-search",
    code: "01.2",
    chapterId: "chapter-01-arrays-searching",
    kind: "algorithm",
    algorithmId: "binary-search",
    title: "Binary Search (Tìm kiếm nhị phân)",
    subtitle: "Chặt đôi không gian tìm kiếm ở mỗi bước để đạt tốc độ O(log N) trên mảng đã sắp xếp.",
    theory: {
      problemAndApplications:
        "Cho mảng `arr` ĐÃ SẮP XẾP tăng dần gồm N phần tử và giá trị `target`. Hãy tìm chỉ số của `target` trong thời gian O(log N), hoặc trả về `-1` nếu không tồn tại.",
      realWorldApps: [
        "Tra cứu chỉ mục B-Tree trong cơ sở dữ liệu, lệnh `git bisect` tìm commit gây lỗi.",
        "Giải các bài toán tối ưu trên hàm đơn điệu (Binary Search on Answer).",
      ],
      coreIntuition:
        "Giống như tìm một từ trong cuốn từ điển giấy 1,000 trang: bạn mở ngay trang giữa (500). Nếu từ cần tìm đứng sau theo vần chữ cái, bạn vứt bỏ hoàn toàn 500 trang đầu và chỉ lặp lại với nửa sau.",
      mechanismSteps: [
        "Đặt hai biên left = 0 và right = n - 1.",
        "Trong khi left <= right: tính điểm giữa mid = Math.floor(left + (right - left) / 2).",
        "Nếu arr[mid] === target → tìm thấy, trả về mid.",
        "Nếu arr[mid] < target → loại bỏ nửa trái bằng cách gán left = mid + 1.",
        "Ngược lại (arr[mid] > target) → loại bỏ nửa phải bằng cách gán right = mid - 1.",
      ],
      loopInvariant:
        "Nếu target tồn tại trong mảng thì nó BẮT BUỘC phải nằm trong đoạn đóng [left, right] ở đầu mỗi lần lặp.",
      complexityDeepDive: {
        timeExplanation: "Mỗi lần so sánh giảm một nửa không gian tìm kiếm (N → N/2 → N/4 → ... → 1), cần tối đa log₂(N) bước.",
        spaceExplanation: "Phiên bản lặp dùng 3 biến con trỏ (left, right, mid) → O(1) Space.",
        best: "O(1)",
        average: "O(log N)",
        worst: "O(log N)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Lỗi vòng lặp vô tận: Viết nhầm `left = mid` thay vì `left = mid + 1` khi chỉ còn 2 phần tử.",
        "Tràn số nguyên (Integer Overflow ở C++/Java): Phải viết `left + Math.floor((right - left) / 2)` thay vì `(left + right) / 2`.",
        "Điều kiện vòng lặp phải là `left <= right` (có dấu bằng) để không bỏ sót trường hợp left === right.",
      ],
      tradeOffs: [
        "Nhanh gấp hàng chục nghìn lần Linear Search khi N lớn, nhưng bắt buộc dữ liệu phải được sắp xếp sẵn (tốn O(N log N) nếu phải sort lại liên tục).",
      ],
      references: ["MIT 6.006 — Searching & Sets", "CLRS — Chapter 2 (Binary Search)", "OpenDSA — Binary Search"],
    },
    quizQuestions: [
      {
        id: "bs-q1",
        question: "Trong Binary Search bản lặp chuẩn (`while (left <= right)`), tại sao cần cập nhật `left = mid + 1` và `right = mid - 1` thay vì gán bằng `mid`?",
        options: [
          "Vì phần tử tại `mid` đã được kiểm tra không bằng target, giữ lại `mid` có thể gây vòng lặp vô tận khi left và right kề nhau",
          "Để mảng tự động tăng tốc gấp 4 lần",
          "Chỉ là thói quen viết code của lập trình viên",
          "Để tránh truy cập arr[0]",
        ],
        correctIndex: 0,
        explanation: "Vì ta đã kiểm tra arr[mid] !== target nên mid chắc chắn bị loại. Thu hẹp biên vào mid+1 hoặc mid-1 giúp đoạn [left, right] luôn giảm kích thước ít nhất 1 đơn vị.",
      },
      {
        id: "bs-q2",
        question: "Nếu dùng công thức `mid = (left + right) / 2` trong C++/Java với mảng cực lớn, rủi ro gì có thể xảy ra?",
        options: ["Chia cho 0", "Tràn số nguyên có dấu (Integer Overflow)", "Mảng bị đảo ngược", "Tăng độ phức tạp lên O(N²)"],
        correctIndex: 1,
        explanation: "Tổng left + right có thể vượt quá MAX_INT. Công thức an toàn là left + (right - left) / 2.",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Binary Search chuẩn O(log N)",
      prompt: "Viết hàm `binarySearch(arr, target)` trên mảng tăng dần `arr`. Trả về index của `target`, hoặc `-1` nếu không tìm thấy.",
      functionName: "binarySearch",
      starterCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    // Viết logic so sánh arr[mid] với target ở đây
    
  }
  return -1;
}`,
      solutionCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      hints: ["So sánh `arr[mid] === target`, nếu nhỏ hơn thì `left = mid + 1`, lớn hơn thì `right = mid - 1`."],
      testCases: [
        { name: "Tìm thấy ở nửa phải", inputArgs: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 56], expected: 7 },
        { name: "Tìm thấy ngay phần tử đầu", inputArgs: [[1, 3, 5, 7, 9], 1], expected: 0 },
        { name: "Không có trong mảng", inputArgs: [[1, 3, 5, 7, 9], 4], expected: -1 },
        { name: "Mảng 1 phần tử khớp (Edge Case)", inputArgs: [[10], 10], expected: 0, isEdgeCase: true },
        { name: "Mảng rỗng (Edge Case)", inputArgs: [[], 5], expected: -1, isEdgeCase: true },
      ],
    },
  },

  {
    id: "two-sum",
    code: "01.3",
    chapterId: "chapter-01-arrays-searching",
    kind: "algorithm",
    algorithmId: "two-sum",
    title: "Two Pointers — Two Sum (Sorted)",
    subtitle: "Dùng hai con trỏ tiến từ hai đầu để tìm cặp có tổng bằng target trong thời gian tuyến tính O(N).",
    theory: {
      problemAndApplications:
        "Cho một mảng `arr` đã sắp xếp tăng dần và một giá trị `target`. Hãy tìm cặp chỉ số `[left, right]` (left < right) sao cho `arr[left] + arr[right] === target`.",
      realWorldApps: [
        "Là bài toán nền cho 3Sum, Container With Most Water, và gộp hai mảng đã sắp xếp.",
        "Tối ưu các truy vấn tìm cặp ghép trong tài chính và khớp lệnh.",
      ],
      coreIntuition:
        "Thay vì thử mọi cặp trong O(N²), ta đặt 1 con trỏ ở đầu (nhỏ nhất) và 1 con trỏ ở cuối (lớn nhất). Nếu tổng hiện tại nhỏ hơn target, cách duy nhất để tăng tổng là dịch `left` sang phải; nếu tổng lớn hơn target, phải dịch `right` sang trái.",
      mechanismSteps: [
        "Khởi tạo `left = 0`, `right = n - 1`.",
        "Tính `sum = arr[left] + arr[right]`.",
        "Nếu `sum === target` → trả về `[left, right]`.",
        "Nếu `sum < target` → tăng `left++` (chọn số lớn hơn).",
        "Nếu `sum > target` → giảm `right--` (chọn số nhỏ hơn).",
      ],
      loopInvariant:
        "Mọi cặp có tổng bằng target đều KHÔNG chứa bất kỳ phần tử nào nằm ngoài đoạn [left, right] đã bị loại ở các bước trước.",
      complexityDeepDive: {
        timeExplanation: "Mỗi bước, hoặc `left` tăng 1, hoặc `right` giảm 1 → tổng số bước tối đa là N → O(N).",
        spaceExplanation: "Chỉ dùng 2 biến con trỏ → O(1) Space (tốt hơn Hash Map O(N) khi mảng đã sort sẵn).",
        best: "O(1)",
        average: "O(N)",
        worst: "O(N)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Nhầm lẫn dùng Two Pointers trên mảng CHƯA sắp xếp (nếu mảng chưa sort, phải dùng Hash Map hoặc sort trước).",
        "Điều kiện dừng phải là `left < right` (không dùng `<=` vì không thể cộng một phần tử với chính nó).",
      ],
      tradeOffs: [
        "Khi mảng đã sort: Two Pointers tối ưu tuyệt đối O(N) Time, O(1) Space. Khi mảng chưa sort và cần giữ nguyên index gốc: Hash Map O(N) Time, O(N) Space.",
      ],
      references: ["Princeton Algorithms — Sorting & Searching Applications", "LeetCode 167: Two Sum II"],
    },
    quizQuestions: [
      {
        id: "ts-q1",
        question: "Tại sao Two Pointers giảm độ phức tạp tìm cặp tổng trên mảng đã sắp xếp từ O(N²) xuống O(N)?",
        options: [
          "Vì nó bỏ qua phần tử ở vị trí chẵn",
          "Nhờ tính đơn điệu của mảng tăng dần: khi tăng left hoặc giảm right, ta loại bỏ nguyên một hàng/cột cặp không hợp lệ mà không cần thử lại",
          "Vì nó chia mảng thành 4 phần bằng nhau",
          "Vì nó dùng đệ quy chia để trị",
        ],
        correctIndex: 1,
        explanation: "Nếu arr[left] + arr[right] > target, mọi cặp ghép với right ở phía bên phải của left chắc chắn càng lớn hơn target → loại bỏ right ngay lập tức!",
      },
    ],
    codeChallenge: {
      title: "Two Sum bằng Hai con trỏ (Sorted Array)",
      prompt: "Cho mảng tăng dần `arr` và `target`, viết hàm `twoSumSorted(arr, target)` trả về mảng 2 chỉ số `[i, j]` (`i < j`) sao cho `arr[i] + arr[j] === target`, hoặc `[]` nếu không có.",
      functionName: "twoSumSorted",
      starterCode: `function twoSumSorted(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    // Kiểm tra tổng arr[left] + arr[right]
    
  }
  return [];
}`,
      solutionCode: `function twoSumSorted(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
      hints: ["Nếu `arr[left] + arr[right] < target` thì `left++`, ngược lại `right--`."],
      testCases: [
        { name: "Cặp chuẩn", inputArgs: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { name: "Có số âm", inputArgs: [[-5, -2, 0, 3, 8], 1], expected: [1, 3] },
        { name: "Không tìm thấy", inputArgs: [[1, 2, 3, 4], 10], expected: [] },
        { name: "Mảng 1 phần tử (Edge Case)", inputArgs: [[5], 10], expected: [], isEdgeCase: true },
      ],
    },
  },

  {
    id: "sliding-window",
    code: "01.4",
    chapterId: "chapter-01-arrays-searching",
    kind: "algorithm",
    algorithmId: "sliding-window",
    title: "Sliding Window (Cửa sổ trượt)",
    subtitle: "Duy trì một cửa sổ trượt qua mảng để loại bỏ việc tính lại phần giao nhau, giảm xuống O(N).",
    theory: {
      problemAndApplications:
        "Cho mảng số nguyên `arr` và số nguyên `k`. Tìm tổng lớn nhất (hoặc giá trị lớn nhất) của một dãy con liên tiếp có đúng `k` phần tử.",
      realWorldApps: [
        "Đếm số request trong 1 phút gần nhất (Rate Limiter của hệ thống Backend).",
        "Phân tích chuỗi thời gian (Moving Average), truyền tải gói tin TCP Sliding Window.",
      ],
      coreIntuition:
        "Khi trượt khung dài k từ vị trí [0..k-1] sang [1..k], có tới k-1 phần tử ở giữa là GIỐNG HỆT nhau! Thay vì cộng lại từ đầu k phần tử, ta chỉ việc: lấy Tổng cũ + Phần tử mới bước vào (arr[i]) - Phần tử vừa rời khỏi khung (arr[i - k]).",
      mechanismSteps: [
        "Tính tổng cửa sổ đầu tiên gồm k phần tử: index 0 đến k-1.",
        "Gán `maxSum = windowSum`.",
        "Trượt i từ k đến n-1: `windowSum = windowSum + arr[i] - arr[i - k]`.",
        "Cập nhật `maxSum = Math.max(maxSum, windowSum)` ở mỗi bước trượt.",
      ],
      loopInvariant:
        "Tại bước i ≥ k, biến `windowSum` luôn lưu chính xác tổng của đúng k phần tử liên tiếp kết thúc tại i: `arr[i - k + 1 .. i]`.",
      complexityDeepDive: {
        timeExplanation: "Mỗi phần tử chỉ được thêm vào cửa sổ đúng 1 lần và bỏ ra đúng 1 lần → O(N) bất kể kích thước k lớn cỡ nào.",
        spaceExplanation: "Chỉ lưu biến tổng hiện tại và tổng lớn nhất → O(1) Space.",
        best: "O(N)",
        average: "O(N)",
        worst: "O(N)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "k lớn hơn độ dài mảng (`k > arr.length`) hoặc `k <= 0` → Cần xử lý trả về 0 hoặc null.",
        "Mảng toàn số âm: Phải khởi tạo `maxSum = firstWindowSum` chứ KHÔNG khởi tạo `maxSum = 0`!",
      ],
      tradeOffs: [
        "Áp dụng xuất sắc cho bài toán dãy con liên tiếp (Subarray / Substring). Không áp dụng được cho bài toán tập con không liên tiếp (Subsequence).",
      ],
      references: ["MIT & LeetCode Sliding Window Pattern", "TCP Congestion Control Protocol"],
    },
    quizQuestions: [
      {
        id: "sw-q1",
        question: "Tại sao bài toán tổng lớn nhất của dãy con liên tiếp dài k với mảng có số âm KHÔNG được khởi tạo `maxSum = 0`?",
        options: [
          "Vì JavaScript không hỗ trợ số 0",
          "Nếu mảng toàn số âm (ví dụ [-5, -2, -3]), tổng lớn nhất thực tế là số âm (-5), khởi tạo 0 sẽ trả về kết quả sai là 0",
          "Vì `maxSum = 0` làm tăng độ phức tạp lên O(N²)",
          "Không sao, khởi tạo 0 luôn đúng",
        ],
        correctIndex: 1,
        explanation: "Luôn khởi tạo maxSum bằng tổng của cửa sổ đầu tiên (hoặc -Infinity) để đúng với cả mảng toàn số âm.",
      },
    ],
    codeChallenge: {
      title: "Tìm tổng lớn nhất của mảng con liên tiếp độ dài K",
      prompt: "Viết hàm `maxSubarraySumK(arr, k)` trả về tổng lớn nhất của bất kỳ mảng con liên tiếp độ dài đúng `k`. Nếu `arr.length < k` hoặc `k <= 0`, trả về `0`.",
      functionName: "maxSubarraySumK",
      starterCode: `function maxSubarraySumK(arr, k) {
  if (k <= 0 || arr.length < k) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let maxSum = windowSum;

  // Trượt cửa sổ từ k đến hết mảng
  
  return maxSum;
}`,
      solutionCode: `function maxSubarraySumK(arr, k) {
  if (k <= 0 || arr.length < k) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    if (windowSum > maxSum) maxSum = windowSum;
  }
  return maxSum;
}`,
      hints: ["Trong vòng lặp từ `i = k` đến `arr.length - 1`: cập nhật `windowSum += arr[i] - arr[i - k]`."],
      testCases: [
        { name: "Mảng chuẩn", inputArgs: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
        { name: "Mảng có số âm", inputArgs: [[-5, -2, -1, -8], 2], expected: -3 },
        { name: "k = 1", inputArgs: [[4, 9, 2], 1], expected: 9 },
        { name: "Mảng nhỏ hơn k (Edge Case)", inputArgs: [[1, 2], 5], expected: 0, isEdgeCase: true },
      ],
    },
  },

  {
    id: "kadane",
    code: "01.5",
    chapterId: "chapter-01-arrays-searching",
    kind: "algorithm",
    algorithmId: "kadane",
    title: "Kadane's Algorithm (Mảng con tổng lớn nhất)",
    subtitle: "Quyết định cục bộ O(N) để tìm đoạn con liên tiếp có tổng lớn nhất kể cả khi có số âm.",
    theory: {
      problemAndApplications:
        "Cho mảng số nguyên `nums` (có cả số âm và dương, ít nhất 1 phần tử). Hãy tìm tổng lớn nhất có thể của một mảng con liên tiếp khác rỗng (Maximum Subarray Problem).",
      realWorldApps: [
        "Phân tích chuỗi thời gian chứng khoán: tìm giai đoạn sinh lời cao nhất.",
        "Xử lý ảnh: tìm vùng sáng có mật độ năng lượng cực đại (Maximum Submatrix 2D).",
      ],
      coreIntuition:
        "Tại mỗi vị trí i, bạn chỉ đứng trước 2 lựa chọn rất đơn giản: (1) Nối tiếp đoạn con đang chạy trước đó (`currentSum + nums[i]`), hoặc (2) Nếu `currentSum` đang âm (kéo lùi bạn lại), vứt bỏ quá khứ và bắt đầu lại một đoạn con mới từ `nums[i]`!",
      mechanismSteps: [
        "Khởi tạo `currentSum = nums[0]`, `bestSum = nums[0]`.",
        "Duyệt `i` từ `1` đến `n - 1`.",
        "Cập nhật `currentSum = Math.max(nums[i], currentSum + nums[i])`.",
        "Cập nhật `bestSum = Math.max(bestSum, currentSum)`.",
        "Trả về `bestSum`.",
      ],
      loopInvariant:
        "`currentSum` tại bước `i` luôn là tổng lớn nhất của mọi mảng con liên tiếp KẾT THÚC TẠI đúng chỉ số `i` (chính là bản chất Quy hoạch động 1D tối ưu không gian!).",
      complexityDeepDive: {
        timeExplanation: "Chỉ duyệt đúng 1 lượt qua toàn bộ mảng → O(N).",
        spaceExplanation: "Chỉ dùng 2 biến vô hướng `currentSum` và `bestSum` → O(1) Space.",
        best: "O(N)",
        average: "O(N)",
        worst: "O(N)",
        space: "O(1)",
      },
      edgeCasesAndPitfalls: [
        "Mảng toàn số âm (VD: `[-4, -2, -7]`): Đáp án phải là phần tử âm lớn nhất (`-2`), không phải `0`!",
      ],
      tradeOffs: [
        "Vượt trội hoàn toàn so với cách vét cạn O(N²) và nhanh gọn hơn cả Chia để trị O(N log N) (CLRS Ch.4).",
      ],
      references: ["CLRS — Chapter 4.1 (The Maximum-Subarray Problem)", "Bentley's Programming Pearls (Kadane's O(N) Algorithm)"],
    },
    quizQuestions: [
      {
        id: "kad-q1",
        question: "Tại bước `i`, công thức `currentSum = Math.max(nums[i], currentSum + nums[i])` có ý nghĩa gì?",
        options: [
          "Luôn chọn phần tử lớn nhất mảng",
          "Nếu tổng đoạn trước đó âm (làm giảm tổng), ta bỏ đoạn trước và bắt đầu đoạn mới ngay tại nums[i]",
          "Đảo ngược mảng nếu gặp số âm",
          "Xóa hết số âm khỏi mảng",
        ],
        correctIndex: 1,
        explanation: "Nếu currentSum < 0 thì currentSum + nums[i] < nums[i], nên mang theo quá khứ âm chỉ làm kết quả tệ hơn — ta reset lại tại nums[i].",
      },
    ],
    codeChallenge: {
      title: "Cài đặt Thuật toán Kadane O(N)",
      prompt: "Viết hàm `maxSubArray(nums)` trả về tổng lớn nhất của mảng con liên tiếp khác rỗng trong `nums`.",
      functionName: "maxSubArray",
      starterCode: `function maxSubArray(nums) {
  let currentSum = nums[0];
  let bestSum = nums[0];

  // Duyệt từ i = 1 đến hết mảng
  
  return bestSum;
}`,
      solutionCode: `function maxSubArray(nums) {
  let currentSum = nums[0];
  let bestSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    bestSum = Math.max(bestSum, currentSum);
  }
  return bestSum;
}`,
      hints: ["Dùng `currentSum = Math.max(nums[i], currentSum + nums[i])` và cập nhật `bestSum`."],
      testCases: [
        { name: "Mảng hỗn hợp âm dương", inputArgs: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
        { name: "Mảng toàn số dương", inputArgs: [[1, 2, 3, 4]], expected: 10 },
        { name: "Mảng toàn số âm (Edge Case)", inputArgs: [[-8, -3, -6, -2, -5]], expected: -2, isEdgeCase: true },
        { name: "Mảng 1 phần tử (Edge Case)", inputArgs: [[-5]], expected: -5, isEdgeCase: true },
      ],
    },
  },
];
