import { GraphData, Step } from "../types";

export const defaultGraphData: GraphData = {
  nodes: [
    { id: "A", label: "A", x: 300, y: 50 },
    { id: "B", label: "B", x: 160, y: 140 },
    { id: "C", label: "C", x: 440, y: 140 },
    { id: "D", label: "D", x: 90, y: 250 },
    { id: "E", label: "E", x: 230, y: 250 },
    { id: "F", label: "F", x: 370, y: 250 },
    { id: "G", label: "G", x: 510, y: 250 },
  ],
  edges: [
    { from: "A", to: "B" },
    { from: "A", to: "C" },
    { from: "B", to: "D" },
    { from: "B", to: "E" },
    { from: "C", to: "F" },
    { from: "C", to: "G" },
    { from: "D", to: "E" },
    { from: "E", to: "F" },
  ],
};

function buildAdjacencyList(graph: GraphData): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  graph.nodes.forEach((n) => adj.set(n.id, []));

  graph.edges.forEach((e) => {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from); // Undirected graph
  });

  // Sort neighbors alphabetically for predictable traversal
  adj.forEach((neighbors) => neighbors.sort());
  return adj;
}

export function generateBFSSteps(graph: GraphData = defaultGraphData, startNodeId: string = "A"): Step[] {
  const steps: Step[] = [];
  const adj = buildAdjacencyList(graph);
  const visited = new Set<string>();
  const queue: string[] = [];
  const visitedEdges: [string, string][] = [];
  const traversalOrder: string[] = [];

  queue.push(startNodeId);
  visited.add(startNodeId);
  traversalOrder.push(startNodeId);

  steps.push({
    graph,
    currentNode: startNodeId,
    visitedNodes: [startNodeId],
    frontierNodes: [...queue],
    visitedEdges: [],
    traversalOrder: [...traversalOrder],
    description: `Khởi tạo BFS từ đỉnh ${startNodeId}. Đẩy đỉnh ${startNodeId} vào Queue và đánh dấu đã thăm.`,
    codeLine: 2,
    extraInfo: { "Hàng đợi (Queue)": queue.join(" → "), "Thứ tự duyệt": traversalOrder.join(" → ") },
  });

  while (queue.length > 0) {
    const current = queue.shift()!;

    steps.push({
      graph,
      currentNode: current,
      visitedNodes: Array.from(visited),
      frontierNodes: [...queue],
      visitedEdges: [...visitedEdges],
      traversalOrder: [...traversalOrder],
      description: `Lấy đỉnh ${current} ra khỏi hàng đợi để duyệt các đỉnh kề chưa thăm.`,
      codeLine: 4,
      extraInfo: {
        "Đỉnh đang xét": current,
        "Hàng đợi (Queue)": queue.length > 0 ? queue.join(" → ") : "(rỗng)",
        "Thứ tự duyệt": traversalOrder.join(" → "),
      },
    });

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        visitedEdges.push([current, neighbor]);
        queue.push(neighbor);
        traversalOrder.push(neighbor);

        steps.push({
          graph,
          currentNode: current,
          activeEdge: [current, neighbor],
          visitedNodes: Array.from(visited),
          frontierNodes: [...queue],
          visitedEdges: [...visitedEdges],
          traversalOrder: [...traversalOrder],
          description: `Phát hiện đỉnh kề ${neighbor} chưa thăm. Đẩy ${neighbor} vào hàng đợi.`,
          codeLine: 7,
          extraInfo: {
            "Cạnh vừa đi qua": `${current} ➔ ${neighbor}`,
            "Hàng đợi (Queue)": queue.join(" → "),
            "Thứ tự duyệt": traversalOrder.join(" → "),
          },
        });
      }
    }
  }

  steps.push({
    graph,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    visitedEdges: [...visitedEdges],
    traversalOrder: [...traversalOrder],
    description: `BFS hoàn thành! Tất cả đỉnh liên thông đã được duyệt theo từng tầng (Level-order).`,
    codeLine: 10,
    extraInfo: {
      "Tổng số đỉnh duyệt": traversalOrder.length,
      "Kết quả BFS": traversalOrder.join(" → "),
    },
  });

  return steps;
}

export function generateDFSSteps(graph: GraphData = defaultGraphData, startNodeId: string = "A"): Step[] {
  const steps: Step[] = [];
  const adj = buildAdjacencyList(graph);
  const visited = new Set<string>();
  const visitedEdges: [string, string][] = [];
  const traversalOrder: string[] = [];
  const callStack: string[] = [];

  steps.push({
    graph,
    visitedNodes: [],
    frontierNodes: [],
    visitedEdges: [],
    traversalOrder: [],
    description: `Khởi tạo DFS từ đỉnh ${startNodeId}. Duyệt theo chiều sâu sử dụng Đệ quy / Ngăn xếp (Call Stack).`,
    codeLine: 1,
  });

  function dfs(u: string, parent?: string) {
    visited.add(u);
    callStack.push(u);
    traversalOrder.push(u);
    if (parent) {
      visitedEdges.push([parent, u]);
    }

    steps.push({
      graph,
      currentNode: u,
      activeEdge: parent ? [parent, u] : undefined,
      visitedNodes: Array.from(visited),
      frontierNodes: [...callStack],
      visitedEdges: [...visitedEdges],
      traversalOrder: [...traversalOrder],
      description: `Thăm đỉnh ${u}. Đưa ${u} vào Call Stack.`,
      codeLine: 3,
      extraInfo: {
        "Đỉnh hiện tại": u,
        "Call Stack": callStack.join(" ➔ "),
        "Thứ tự duyệt": traversalOrder.join(" → "),
      },
    });

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (!visited.has(v)) {
        steps.push({
          graph,
          currentNode: u,
          activeEdge: [u, v],
          visitedNodes: Array.from(visited),
          frontierNodes: [...callStack],
          visitedEdges: [...visitedEdges],
          traversalOrder: [...traversalOrder],
          description: `Từ đỉnh ${u}, đi sâu vào đỉnh kề ${v} chưa thăm.`,
          codeLine: 5,
        });

        dfs(v, u);

        steps.push({
          graph,
          currentNode: u,
          visitedNodes: Array.from(visited),
          frontierNodes: [...callStack],
          visitedEdges: [...visitedEdges],
          traversalOrder: [...traversalOrder],
          description: `Quay lui (Backtrack) về lại đỉnh ${u}.`,
          codeLine: 8,
          extraInfo: {
            "Trạng thái": `Quay lui về đỉnh ${u}`,
            "Call Stack": callStack.join(" ➔ "),
          },
        });
      }
    }

    callStack.pop();
  }

  dfs(startNodeId);

  steps.push({
    graph,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    visitedEdges: [...visitedEdges],
    traversalOrder: [...traversalOrder],
    description: `DFS hoàn thành! Đã khám phá toàn bộ các nhánh của đồ thị.`,
    codeLine: 10,
    extraInfo: {
      "Tổng số đỉnh duyệt": traversalOrder.length,
      "Kết quả DFS": traversalOrder.join(" → "),
    },
  });

  return steps;
}

export const defaultBellmanFordGraph: GraphData = {
  nodes: [
    { id: "S", label: "S", x: 100, y: 160 },
    { id: "A", label: "A", x: 240, y: 70 },
    { id: "B", label: "B", x: 240, y: 250 },
    { id: "C", label: "C", x: 400, y: 70 },
    { id: "D", label: "D", x: 400, y: 250 },
    { id: "E", label: "E", x: 520, y: 160 },
  ],
  edges: [
    { from: "S", to: "A", weight: 6 },
    { from: "S", to: "B", weight: 5 },
    { from: "A", to: "C", weight: 3 },
    { from: "B", to: "A", weight: -2 },
    { from: "C", to: "D", weight: -3 },
    { from: "B", to: "D", weight: 7 },
    { from: "D", to: "E", weight: 2 },
    { from: "C", to: "E", weight: 4 },
  ],
};

export function generateBellmanFordSteps(
  graph: GraphData = defaultBellmanFordGraph,
  startNodeId: string = "S"
): Step[] {
  const steps: Step[] = [];
  const V = graph.nodes.length;
  const dist: Record<string, number> = {};
  graph.nodes.forEach((n) => {
    dist[n.id] = n.id === startNodeId ? 0 : Infinity;
  });

  const formatDist = () =>
    graph.nodes.map((n) => `${n.id}:${dist[n.id] === Infinity ? "∞" : dist[n.id]}`).join("  ");

  const relaxedEdges: [string, string][] = [];

  steps.push({
    graph,
    currentNode: startNodeId,
    visitedNodes: [startNodeId],
    description: `Khởi tạo Bellman-Ford từ đỉnh nguồn ${startNodeId}: dist[${startNodeId}] = 0, các đỉnh khác = ∞. Thực hiện tối đa V - 1 = ${V - 1} vòng nới lỏng (Relaxation) tất cả các cạnh (kể cả cạnh có trọng số âm).`,
    codeLine: 1,
    extraInfo: { "Vòng lặp": `0 / ${V - 1}`, "Khoảng cách": formatDist() },
  });

  for (let pass = 1; pass <= V - 1; pass++) {
    let anyUpdate = false;

    for (const edge of graph.edges) {
      const u = edge.from;
      const v = edge.to;
      const w = edge.weight ?? 1;

      steps.push({
        graph,
        currentNode: v,
        activeEdge: [u, v],
        visitedNodes: Object.keys(dist).filter((k) => dist[k] < Infinity),
        visitedEdges: [...relaxedEdges],
        description: `[Vòng ${pass}/${V - 1}] Kiểm tra cạnh (${u} → ${v}) với trọng số w = ${w}. Hiện tại dist[${u}] = ${dist[u] === Infinity ? "∞" : dist[u]}, dist[${v}] = ${dist[v] === Infinity ? "∞" : dist[v]}.`,
        codeLine: 4,
        extraInfo: { "Vòng lặp": `${pass} / ${V - 1}`, "Khoảng cách": formatDist() },
      });

      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        const oldVal = dist[v] === Infinity ? "∞" : String(dist[v]);
        dist[v] = dist[u] + w;
        anyUpdate = true;
        relaxedEdges.push([u, v]);

        steps.push({
          graph,
          currentNode: v,
          activeEdge: [u, v],
          visitedNodes: Object.keys(dist).filter((k) => dist[k] < Infinity),
          visitedEdges: [...relaxedEdges],
          description: `Cập nhật (Relax)! ${dist[u] - 0} + (${w}) = ${dist[v]} < ${oldVal}. Gán dist[${v}] = ${dist[v]}.`,
          codeLine: 6,
          extraInfo: { "Vòng lặp": `${pass} / ${V - 1}`, "Khoảng cách": formatDist() },
        });
      }
    }

    if (!anyUpdate) {
      steps.push({
        graph,
        visitedNodes: Object.keys(dist).filter((k) => dist[k] < Infinity),
        visitedEdges: [...relaxedEdges],
        description: `Dừng sớm ở vòng ${pass}: Không có cạnh nào được cập nhật thêm — đường đi ngắn nhất đã hội tụ!`,
        codeLine: 8,
        extraInfo: { "Trạng thái": "Hội tụ sớm", "Khoảng cách": formatDist() },
      });
      break;
    }
  }

  // Negative cycle check (Pass V)
  steps.push({
    graph,
    visitedNodes: Object.keys(dist).filter((k) => dist[k] < Infinity),
    visitedEdges: [...relaxedEdges],
    description: `Hoàn tất kiểm tra vòng thứ ${V}: Không phát hiện chu trình âm! Kết quả đường đi ngắn nhất từ ${startNodeId}: ${formatDist()}.`,
    codeLine: 10,
    extraInfo: { "Chu trình âm": "Không có", "Khoảng cách cuối": formatDist() },
  });

  return steps;
}
