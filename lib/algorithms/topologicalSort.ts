import { Step, GraphData } from "../types";

export const DEFAULT_DAG_GRAPH: GraphData = {
  nodes: [
    { id: "CS101", label: "CS101 (Nhập môn C++)", x: 100, y: 150 },
    { id: "CS102", label: "CS102 (Cấu trúc Dữ liệu)", x: 260, y: 90 },
    { id: "CS202", label: "CS202 (Cơ sở Dữ liệu)", x: 260, y: 220 },
    { id: "CS201", label: "CS201 (Thiết kế Giải thuật)", x: 420, y: 90 },
    { id: "CS301", label: "CS301 (Lập trình Web)", x: 420, y: 220 },
    { id: "CS302", label: "CS302 (Trí tuệ Nhân tạo)", x: 570, y: 150 },
  ],
  edges: [
    { from: "CS101", to: "CS102" },
    { from: "CS101", to: "CS202" },
    { from: "CS102", to: "CS201" },
    { from: "CS102", to: "CS301" },
    { from: "CS202", to: "CS301" },
    { from: "CS201", to: "CS302" },
  ],
};

export function generateTopologicalSortSteps(graph: GraphData = DEFAULT_DAG_GRAPH): Step[] {
  const steps: Step[] = [];
  const nodes = graph.nodes;
  const edges = graph.edges;

  // Calculate initial In-Degree (bán bậc vào) for each node
  const inDegree: Record<string, number> = {};
  nodes.forEach((node) => {
    inDegree[node.id] = 0;
  });

  edges.forEach((edge) => {
    inDegree[edge.to] = (inDegree[edge.to] || 0) + 1;
  });

  const queue: string[] = [];
  const topoOrder: string[] = [];

  // Step 0: In-degree calculation
  steps.push({
    description: `Khởi tạo thuật toán Kahn (Topological Sort) cho đồ thị có hướng không chu trình (DAG). Tính toán Bán bậc vào (In-Degree: số lượng môn học tiên quyết) cho từng node.`,
    codeLine: 2,
    graph,
    inDegree: { ...inDegree },
    topoQueue: [],
    topoOrder: [],
    extraInfo: {
      "Tổng số môn học": nodes.length,
      "Tổng số ràng buộc": edges.length,
      "Trạng thái": "Tính Bán bậc vào (In-Degree)",
    },
  });

  // Collect initial nodes with in-degree == 0
  nodes.forEach((node) => {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
    }
  });

  steps.push({
    description: `Tìm thấy các node có Bán bậc vào In-Degree = 0 (không có môn tiên quyết): [${queue.join(", ")}]. Đưa tất cả vào Hàng đợi (Queue) để chuẩn bị học trước.`,
    codeLine: 6,
    graph,
    inDegree: { ...inDegree },
    topoQueue: [...queue],
    topoOrder: [],
    extraInfo: {
      "Hàng đợi khởi tạo": queue.join(", "),
      "Môn có thể học ngay": queue.length,
    },
  });

  // Process queue
  while (queue.length > 0) {
    const curr = queue.shift()!;
    topoOrder.push(curr);

    const outgoing = edges.filter((e) => e.from === curr);

    steps.push({
      description: `Lấy môn "${curr}" ra khỏi Hàng đợi ➔ ĐƯA VÀO DANH SÁCH HỌC TẬP HỢP LỆ (#${topoOrder.length}). Giờ đây môn này đã hoàn thành, chuẩn bị gỡ bỏ các ràng buộc tiên quyết cho các môn phía sau.`,
      codeLine: 10,
      graph,
      activeTopoNode: curr,
      inDegree: { ...inDegree },
      topoQueue: [...queue],
      topoOrder: [...topoOrder],
      activeOutgoingEdges: outgoing.map((e) => [e.from, e.to]),
      extraInfo: {
        "Đang xử lý": curr,
        "Thứ tự đã xếp": topoOrder.join(" ➔ "),
        "Các cạnh ràng buộc bị xóa": outgoing.length,
      },
    });

    for (const edge of outgoing) {
      inDegree[edge.to]--;
      const target = edge.to;

      if (inDegree[target] === 0) {
        queue.push(target);

        steps.push({
          description: `Gỡ bỏ ràng buộc (${curr} ➔ ${target}): In-Degree của "${target}" giảm xuống 0 (đã hoàn thành tất cả môn tiên quyết)! ĐƯA "${target}" VÀO HÀNG ĐỢI.`,
          codeLine: 14,
          graph,
          activeTopoNode: curr,
          inDegree: { ...inDegree },
          topoQueue: [...queue],
          topoOrder: [...topoOrder],
          extraInfo: {
            "Môn mở khóa": target,
            "In-Degree mới": 0,
            "Hàng đợi hiện tại": queue.join(", "),
          },
        });
      } else {
        steps.push({
          description: `Gỡ bỏ ràng buộc (${curr} ➔ ${target}): In-Degree của "${target}" giảm còn ${inDegree[target]} (vẫn còn môn tiên quyết khác chưa hoàn thành).`,
          codeLine: 16,
          graph,
          activeTopoNode: curr,
          inDegree: { ...inDegree },
          topoQueue: [...queue],
          topoOrder: [...topoOrder],
          extraInfo: {
            "Môn bị ảnh hưởng": target,
            "In-Degree còn lại": inDegree[target],
          },
        });
      }
    }
  }

  // Final celebration
  const isComplete = topoOrder.length === nodes.length;
  steps.push({
    description: isComplete
      ? `🎉 HOÀN TẤT SẮP XẾP TÔ-PÔ (TOPOLOGICAL SORT)! Thứ tự hoàn thành môn học hợp lệ: [${topoOrder.join(" ➔ ")}]. Đồ thị là DAG hợp lệ không chứa chu trình luẩn quẩn.`
      : `❌ PHÁT HIỆN CHU TRÌNH KÍN! Chỉ xếp được ${topoOrder.length}/${nodes.length} môn. Đồ thị có môn học tạo chu trình phụ thuộc lẫn nhau, không thể giải quyết!`,
    codeLine: 20,
    graph,
    inDegree: { ...inDegree },
    topoQueue: [],
    topoOrder: [...topoOrder],
    extraInfo: {
      "Kết quả": isComplete ? "Thành công (DAG hợp lệ)" : "Lỗi chu trình (Cycle Detected)",
      "Lộ trình học tập": topoOrder.join(" ➔ "),
      "Độ phức tạp": "O(V + E) thời gian tuyến tính",
    },
  });

  return steps;
}
