import { Step, GraphData } from "../types";

export interface KruskalEdge {
  from: string;
  to: string;
  weight: number;
}

export const DEFAULT_KRUSKAL_GRAPH: GraphData = {
  nodes: [
    { id: "A", label: "A", x: 120, y: 100 },
    { id: "B", label: "B", x: 300, y: 80 },
    { id: "C", label: "C", x: 200, y: 220 },
    { id: "D", label: "D", x: 440, y: 130 },
    { id: "E", label: "E", x: 340, y: 280 },
    { id: "F", label: "F", x: 500, y: 260 },
  ],
  edges: [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "B", to: "C", weight: 1 },
    { from: "B", to: "D", weight: 5 },
    { from: "C", to: "D", weight: 8 },
    { from: "C", to: "E", weight: 10 },
    { from: "D", to: "E", weight: 2 },
    { from: "D", to: "F", weight: 6 },
    { from: "E", to: "F", weight: 3 },
  ],
};

const COMPONENT_COLORS = [
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
];

export function generateKruskalSteps(graph: GraphData = DEFAULT_KRUSKAL_GRAPH): Step[] {
  const steps: Step[] = [];
  const nodes = graph.nodes;
  const n = nodes.length;

  // Clone and sort edges by weight ascending
  const sortedEdges = [...graph.edges].sort((a, b) => (a.weight || 0) - (b.weight || 0));

  // Initialize DSU parent and rank
  const parent: Record<string, string> = {};
  const rank: Record<string, number> = {};
  const componentColor: Record<string, string> = {};

  nodes.forEach((node, idx) => {
    parent[node.id] = node.id;
    rank[node.id] = 0;
    componentColor[node.id] = COMPONENT_COLORS[idx % COMPONENT_COLORS.length];
  });

  function find(u: string): string {
    if (parent[u] !== u) {
      parent[u] = find(parent[u]); // Path compression
    }
    return parent[u];
  }

  function union(u: string, v: string) {
    const rootU = find(u);
    const rootV = find(v);
    if (rootU !== rootV) {
      if (rank[rootU] < rank[rootV]) {
        parent[rootU] = rootV;
      } else if (rank[rootU] > rank[rootV]) {
        parent[rootV] = rootU;
      } else {
        parent[rootV] = rootU;
        rank[rootU]++;
      }

      // Synchronize color for visualization
      const targetColor = componentColor[rootU];
      for (const node of nodes) {
        if (find(node.id) === find(rootU)) {
          componentColor[node.id] = targetColor;
        }
      }
    }
  }

  const edgeStatuses: {
    from: string;
    to: string;
    weight: number;
    status: "considering" | "accepted" | "rejected" | "normal";
  }[] = sortedEdges.map((e) => ({
    from: e.from,
    to: e.to,
    weight: e.weight || 0,
    status: "normal",
  }));

  let totalMSTWeight = 0;
  let acceptedCount = 0;

  // Step 0: Initial state
  steps.push({
    description: `Khởi tạo thuật toán Kruskal tìm Cây Khung Nhỏ Nhất (MST) với Cấu trúc Dữ liệu Rời Rạc (Disjoint Set Union - DSU). Có ${n} đỉnh (mỗi đỉnh ban đầu là 1 tập hợp riêng biệt có màu khác nhau) và ${sortedEdges.length} cạnh đã được sắp xếp tăng dần theo trọng số.`,
    codeLine: 2,
    graph,
    dsuEdges: edgeStatuses.map((e) => ({ ...e })),
    dsuParent: { ...parent },
    dsuComponents: { ...componentColor },
    mstWeight: 0,
    mstEdgesCount: 0,
    extraInfo: {
      "Số đỉnh": n,
      "Số cạnh cần MST": n - 1,
      "Trọng số ban đầu": 0,
    },
  });

  // Iterate over sorted edges
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const u = edge.from;
    const v = edge.to;
    const w = edge.weight || 0;

    // Highlight edge under consideration
    edgeStatuses[i].status = "considering";

    const rootU = find(u);
    const rootV = find(v);
    const causesCycle = rootU === rootV;

    steps.push({
      description: `Xét cạnh nhỏ nhất tiếp theo: (${u} - ${v}, trọng số = ${w}). Kiểm tra chu trình: find(${u}) = '${rootU}' vs find(${v}) = '${rootV}'.`,
      codeLine: 6,
      graph,
      activeEdge: [u, v],
      dsuEdges: edgeStatuses.map((e) => ({ ...e })),
      dsuParent: { ...parent },
      dsuComponents: { ...componentColor },
      mstWeight: totalMSTWeight,
      mstEdgesCount: acceptedCount,
      extraInfo: {
        "Đang xét": `(${u} - ${v})`,
        "Trọng số": w,
        "Gốc của u": rootU,
        "Gốc của v": rootV,
      },
    });

    if (!causesCycle) {
      // Accept edge
      union(u, v);
      edgeStatuses[i].status = "accepted";
      totalMSTWeight += w;
      acceptedCount++;

      steps.push({
        description: ` AN TOÀN! find(${u}) khác find(${v}) ➔ Cạnh (${u} - ${v}) không tạo chu trình kín. THÊM VÀO CÂY KHUNG MST! Hợp nhất 2 tập hợp (Union) và đồng bộ màu sắc. Tổng trọng số MST hiện tại: ${totalMSTWeight}.`,
        codeLine: 8,
        graph,
        activeEdge: [u, v],
        dsuEdges: edgeStatuses.map((e) => ({ ...e })),
        dsuParent: { ...parent },
        dsuComponents: { ...componentColor },
        mstWeight: totalMSTWeight,
        mstEdgesCount: acceptedCount,
        extraInfo: {
          "Quyết định": "Chấp nhận cạnh",
          "Số cạnh MST đã chọn": `${acceptedCount} / ${n - 1}`,
          "Tổng trọng số MST": totalMSTWeight,
        },
      });

      if (acceptedCount === n - 1) {
        steps.push({
          description: `🎯 ĐÃ CHỌN ĐỦ ${n - 1} CẠNH CHO ${n} ĐỈNH! Cây Khung Nhỏ Nhất (MST) đã hoàn chỉnh, tất cả đỉnh đã cùng một thành phần liên thông. Dừng sớm thuật toán mà không cần xét các cạnh còn lại.`,
          codeLine: 12,
          graph,
          dsuEdges: edgeStatuses.map((e) => ({ ...e })),
          dsuParent: { ...parent },
          dsuComponents: { ...componentColor },
          mstWeight: totalMSTWeight,
          mstEdgesCount: acceptedCount,
          extraInfo: {
            "Trạng thái": "MST hoàn chỉnh",
            "Tổng trọng số tối thiểu": totalMSTWeight,
          },
        });
        break;
      }
    } else {
      // Reject edge
      edgeStatuses[i].status = "rejected";

      steps.push({
        description: `❌ TẠO CHU TRÌNH! Cả ${u} và ${v} đều đã cùng thuộc một tập hợp gốc '${rootU}'. Nếu thêm cạnh (${u} - ${v}) sẽ tạo thành chu trình kín (vòng lặp)! BỎ QUA CẠNH NÀY.`,
        codeLine: 10,
        graph,
        activeEdge: [u, v],
        dsuEdges: edgeStatuses.map((e) => ({ ...e })),
        dsuParent: { ...parent },
        dsuComponents: { ...componentColor },
        mstWeight: totalMSTWeight,
        mstEdgesCount: acceptedCount,
        extraInfo: {
          "Quyết định": "Bỏ qua (Tạo chu trình)",
          "Chu trình phát hiện tại": `${u} - ${v}`,
        },
      });
    }
  }

  // Final summary
  steps.push({
    description: `🎉 HOÀN TẤT THUẬT TOÁN KRUSKAL & DSU! Cây khung nhỏ nhất (MST) kết nối toàn bộ ${n} đỉnh với tổng cộng ${acceptedCount} cạnh, tổng chi phí tối ưu là ${totalMSTWeight}.`,
    codeLine: 14,
    graph,
    dsuEdges: edgeStatuses.map((e) => ({ ...e })),
    dsuParent: { ...parent },
    dsuComponents: { ...componentColor },
    mstWeight: totalMSTWeight,
    mstEdgesCount: acceptedCount,
    extraInfo: {
      "Kết quả cuối cùng": `Trọng số MST = ${totalMSTWeight}`,
      "Số cạnh kết nối": acceptedCount,
      "Độ phức tạp": "O(E log E) với phép Union-Find O(α(V))",
    },
  });

  return steps;
}
