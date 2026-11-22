import { Step, GridConfig } from "../types";

export const DEFAULT_GRID_ROWS = 15;
export const DEFAULT_GRID_COLS = 25;
export const DEFAULT_START: [number, number] = [7, 4];
export const DEFAULT_END: [number, number] = [7, 20];

// Default artistic obstacle wall pattern
export const DEFAULT_GRID_WALLS: [number, number][] = [
  // Middle vertical barrier with 2 passages
  [2, 12], [3, 12], [4, 12], [6, 12], [7, 12], [8, 12], [10, 12], [11, 12], [12, 12],
  // Left side chicane
  [4, 8], [5, 8], [6, 8], [7, 8],
  [9, 6], [10, 6], [11, 6],
  // Right side chicane
  [3, 16], [4, 16], [5, 16],
  [8, 17], [9, 17], [10, 17], [11, 17],
];

// Helper to check if a cell is in coordinate list
function hasCell(list: [number, number][], r: number, c: number): boolean {
  return list.some(([row, col]) => row === r && col === c);
}

// Helper to convert coordinate to unique key
function cellKey(r: number, c: number): string {
  return `${r},${c}`;
}

// 4 cardinal directions (Up, Right, Down, Left)
const DIRECTIONS: [number, number][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

// Heuristic: Manhattan Distance for 2D Grid
function manhattanDistance(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

// Generate Random Wall Obstacles
export function generateRandomWalls(
  rows: number = DEFAULT_GRID_ROWS,
  cols: number = DEFAULT_GRID_COLS,
  start: [number, number] = DEFAULT_START,
  end: [number, number] = DEFAULT_END,
  density: number = 0.28
): [number, number][] {
  const walls: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) {
        continue;
      }
      if (Math.random() < density) {
        walls.push([r, c]);
      }
    }
  }
  return walls;
}

// Generate Maze Pattern (Staircase / Maze)
export function generateStaircaseWalls(
  rows: number = DEFAULT_GRID_ROWS,
  cols: number = DEFAULT_GRID_COLS,
  start: [number, number] = DEFAULT_START,
  end: [number, number] = DEFAULT_END
): [number, number][] {
  const walls: [number, number][] = [];
  
  // Outer borders or maze segments
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) {
        continue;
      }
      // Diagonal staircase pattern
      if ((r + c) % 5 === 0 && (r * c) % 3 !== 0) {
        walls.push([r, c]);
      }
    }
  }
  return walls;
}

// ==========================================
// 1. DIJKSTRA'S ALGORITHM (2D Grid)
// ==========================================
export function generateDijkstraSteps(cfg?: GridConfig): Step[] {
  const rows = cfg?.rows || DEFAULT_GRID_ROWS;
  const cols = cfg?.cols || DEFAULT_GRID_COLS;
  const start = cfg?.start || DEFAULT_START;
  const end = cfg?.end || DEFAULT_END;
  const walls = cfg?.walls || DEFAULT_GRID_WALLS;

  const steps: Step[] = [];
  const wallSet = new Set(walls.map(([r, c]) => cellKey(r, c)));

  // Distance table and parent pointers
  const dist: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const parent: ([number, number] | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  dist[start[0]][start[1]] = 0;

  // Unvisited queue (simulating Priority Queue)
  interface PQItem {
    r: number;
    c: number;
    d: number;
  }
  const pq: PQItem[] = [{ r: start[0], c: start[1], d: 0 }];

  const visitedList: [number, number][] = [];
  const frontierList: [number, number][] = [[start[0], start[1]]];

  // Initial step
  steps.push({
    description: `Khởi tạo thuật toán Dijkstra: Đặt khoảng cách điểm xuất phát Start (${start[0]}, ${start[1]}) = 0. Tất cả ô khác = ∞. Đưa Start vào hàng đợi ưu tiên.`,
    codeLine: 1,
    gridRows: rows,
    gridCols: cols,
    gridStart: start,
    gridEnd: end,
    gridWalls: walls,
    currentCell: start,
    visitedCells: [],
    frontierCells: [[start[0], start[1]]],
    pathCells: [],
    pathLength: 0,
    pathFound: false,
    cellMetrics: { distance: 0 },
  });

  let found = false;
  let iterations = 0;

  while (pq.length > 0) {
    iterations++;

    // Sort to extract minimum distance cell
    pq.sort((a, b) => a.d - b.d);
    const curr = pq.shift()!;
    const { r, c, d } = curr;

    if (visited[r][c]) continue;
    visited[r][c] = true;
    visitedList.push([r, c]);

    // Remove from frontier list
    const fIdx = frontierList.findIndex(([fr, fc]) => fr === r && fc === c);
    if (fIdx !== -1) frontierList.splice(fIdx, 1);

    // Check if reached destination
    if (r === end[0] && c === end[1]) {
      found = true;
      break;
    }

    // Expand neighbors (4 directions)
    const newNeighbors: [number, number][] = [];
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;

      // Check bounds
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      // Check wall
      if (wallSet.has(cellKey(nr, nc))) continue;
      // Check visited
      if (visited[nr][nc]) continue;

      const alt = d + 1;
      if (alt < dist[nr][nc]) {
        dist[nr][nc] = alt;
        parent[nr][nc] = [r, c];
        pq.push({ r: nr, c: nc, d: alt });
        if (!hasCell(frontierList, nr, nc)) {
          frontierList.push([nr, nc]);
          newNeighbors.push([nr, nc]);
        }
      }
    }

    // Record step every iteration (or sample every 2 iterations if grid is huge)
    steps.push({
      description: `[Dijkstra] Đang duyệt ô (${r}, ${c}) với khoảng cách ngắn nhất d = ${d}. Cập nhật ${newNeighbors.length} ô lân cận vào hàng đợi.`,
      codeLine: 9,
      gridRows: rows,
      gridCols: cols,
      gridStart: start,
      gridEnd: end,
      gridWalls: walls,
      currentCell: [r, c],
      visitedCells: [...visitedList],
      frontierCells: [...frontierList],
      pathCells: [],
      pathLength: 0,
      pathFound: false,
      cellMetrics: { distance: d },
    });
  }

  // Reconstruct Shortest Path if found
  if (found) {
    const path: [number, number][] = [];
    let curr: [number, number] | null = end;
    while (curr) {
      path.unshift(curr);
      curr = parent[curr[0]][curr[1]];
    }

    // Animate shortest path tracing step-by-step
    for (let i = 1; i <= path.length; i++) {
      const currentPathSegment = path.slice(0, i);
      steps.push({
        description:
          i === path.length
            ? `🎉 ĐÃ TÌM THẤY ĐƯỜNG ĐI NGẮN NHẤT! Tổng chiều dài: ${path.length - 1} bước. Đã khám phá ${visitedList.length} ô.`
            : `Đang truy vết ngược đường đi ngắn nhất: ô (${path[i - 1][0]}, ${path[i - 1][1]})...`,
        codeLine: 20,
        gridRows: rows,
        gridCols: cols,
        gridStart: start,
        gridEnd: end,
        gridWalls: walls,
        currentCell: path[i - 1],
        visitedCells: [...visitedList],
        frontierCells: [],
        pathCells: currentPathSegment,
        pathLength: path.length - 1,
        pathFound: i === path.length,
        cellMetrics: { distance: path.length - 1 },
      });
    }
  } else {
    // Unreachable
    steps.push({
      description: `❌ Không tìm thấy đường đi! Điểm kết thúc End (${end[0]}, ${end[1]}) đã bị bao vây hoàn toàn bởi các bức tường chướng ngại vật.`,
      codeLine: 24,
      gridRows: rows,
      gridCols: cols,
      gridStart: start,
      gridEnd: end,
      gridWalls: walls,
      visitedCells: [...visitedList],
      frontierCells: [],
      pathCells: [],
      pathLength: 0,
      pathFound: false,
    });
  }

  return steps;
}

// ==========================================
// 2. A* SEARCH ALGORITHM (2D Grid)
// ==========================================
export function generateAStarSteps(cfg?: GridConfig): Step[] {
  const rows = cfg?.rows || DEFAULT_GRID_ROWS;
  const cols = cfg?.cols || DEFAULT_GRID_COLS;
  const start = cfg?.start || DEFAULT_START;
  const end = cfg?.end || DEFAULT_END;
  const walls = cfg?.walls || DEFAULT_GRID_WALLS;

  const steps: Step[] = [];
  const wallSet = new Set(walls.map(([r, c]) => cellKey(r, c)));

  // gCost: exact distance from start
  const gScore: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  // fCost: gCost + hCost (Manhattan distance to end)
  const fScore: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const parent: ([number, number] | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );
  const closedSet: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  const startH = manhattanDistance(start[0], start[1], end[0], end[1]);
  gScore[start[0]][start[1]] = 0;
  fScore[start[0]][start[1]] = startH;

  interface AStarNode {
    r: number;
    c: number;
    g: number;
    h: number;
    f: number;
  }

  const openSet: AStarNode[] = [{ r: start[0], c: start[1], g: 0, h: startH, f: startH }];
  const visitedList: [number, number][] = [];
  const frontierList: [number, number][] = [[start[0], start[1]]];

  // Initial step
  steps.push({
    description: `Khởi tạo thuật toán A*: Start (${start[0]}, ${start[1]}) có g=0, hàm heuristic h=|Δr|+|Δc|=${startH}, tổng chi phí f=g+h=${startH}. Đưa Start vào Open Set.`,
    codeLine: 1,
    gridRows: rows,
    gridCols: cols,
    gridStart: start,
    gridEnd: end,
    gridWalls: walls,
    currentCell: start,
    visitedCells: [],
    frontierCells: [[start[0], start[1]]],
    pathCells: [],
    pathLength: 0,
    pathFound: false,
    cellMetrics: { distance: 0, hCost: startH, fCost: startH },
  });

  let found = false;

  while (openSet.length > 0) {
    // Sort openSet by fScore (tie breaker: smaller hScore)
    openSet.sort((a, b) => (a.f === b.f ? a.h - b.h : a.f - b.f));
    const curr = openSet.shift()!;
    const { r, c, g, h, f } = curr;

    if (closedSet[r][c]) continue;
    closedSet[r][c] = true;
    visitedList.push([r, c]);

    // Remove from frontier list
    const fIdx = frontierList.findIndex(([fr, fc]) => fr === r && fc === c);
    if (fIdx !== -1) frontierList.splice(fIdx, 1);

    // Destination check
    if (r === end[0] && c === end[1]) {
      found = true;
      break;
    }

    // Evaluate 4 neighbors
    const newNeighbors: [number, number][] = [];
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (wallSet.has(cellKey(nr, nc))) continue;
      if (closedSet[nr][nc]) continue;

      const tentativeG = g + 1;
      if (tentativeG < gScore[nr][nc]) {
        parent[nr][nc] = [r, c];
        gScore[nr][nc] = tentativeG;
        const neighborH = manhattanDistance(nr, nc, end[0], end[1]);
        const neighborF = tentativeG + neighborH;
        fScore[nr][nc] = neighborF;

        openSet.push({ r: nr, c: nc, g: tentativeG, h: neighborH, f: neighborF });
        if (!hasCell(frontierList, nr, nc)) {
          frontierList.push([nr, nc]);
          newNeighbors.push([nr, nc]);
        }
      }
    }

    steps.push({
      description: `[A* Search] Thăm ô (${r}, ${c}): g=${g}, h=${h}, f=g+h=${f}. Heuristic hướng tìm kiếm trực diện về điểm đích End.`,
      codeLine: 12,
      gridRows: rows,
      gridCols: cols,
      gridStart: start,
      gridEnd: end,
      gridWalls: walls,
      currentCell: [r, c],
      visitedCells: [...visitedList],
      frontierCells: [...frontierList],
      pathCells: [],
      pathLength: 0,
      pathFound: false,
      cellMetrics: { distance: g, hCost: h, fCost: f },
    });
  }

  // Reconstruct path
  if (found) {
    const path: [number, number][] = [];
    let curr: [number, number] | null = end;
    while (curr) {
      path.unshift(curr);
      curr = parent[curr[0]][curr[1]];
    }

    for (let i = 1; i <= path.length; i++) {
      const currentPathSegment = path.slice(0, i);
      steps.push({
        description:
          i === path.length
            ? `🎉 A* TÌM THẤY ĐƯỜNG ĐI TỐI ƯU! Độ dài đường đi: ${path.length - 1} bước. Chỉ duyệt ${visitedList.length} ô (nhanh hơn Dijkstra nhờ Heuristic hướng đích)!`
            : `Đang dựng đường đi ngắn nhất: ô (${path[i - 1][0]}, ${path[i - 1][1]})...`,
        codeLine: 24,
        gridRows: rows,
        gridCols: cols,
        gridStart: start,
        gridEnd: end,
        gridWalls: walls,
        currentCell: path[i - 1],
        visitedCells: [...visitedList],
        frontierCells: [],
        pathCells: currentPathSegment,
        pathLength: path.length - 1,
        pathFound: i === path.length,
        cellMetrics: { distance: path.length - 1 },
      });
    }
  } else {
    steps.push({
      description: `❌ Không tìm thấy đường đi! Các bức tường chướng ngại vật đã chắn kín mọi ngả đường tới End (${end[0]}, ${end[1]}).`,
      codeLine: 28,
      gridRows: rows,
      gridCols: cols,
      gridStart: start,
      gridEnd: end,
      gridWalls: walls,
      visitedCells: [...visitedList],
      frontierCells: [],
      pathCells: [],
      pathLength: 0,
      pathFound: false,
    });
  }

  return steps;
}
