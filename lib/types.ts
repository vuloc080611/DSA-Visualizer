export type AlgorithmCategory =
  | "sorting"
  | "searching"
  | "graph"
  | "array"
  | "tree"
  | "pathfinding"
  | "linked-list"
  | "stack-queue"
  | "dp"
  | "backtracking";

export interface Complexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TreeNodeData {
  id: string;
  value: number;
  left?: TreeNodeData | null;
  right?: TreeNodeData | null;
  height?: number; // for AVL
  balanceFactor?: number; // for AVL
  x?: number;
  y?: number;
}

export interface Step {
  stepIndex?: number;
  description: string;
  codeLine?: number; // 1-based line of code to highlight
  
  // Array/Sorting/Searching states
  array?: number[];
  highlights?: number[]; // indices currently comparing or inspecting (amber)
  swapping?: number[]; // indices currently swapping or moving (red/rose)
  sorted?: number[]; // indices placed in final position / found (emerald)
  pivot?: number; // pivot or mid index (purple/cyan)
  target?: number; // search target or target sum
  window?: [number, number]; // [start, end] range for sliding window / subarray
  
  // Real-time metrics
  comparisons?: number;
  swaps?: number;
  extraInfo?: Record<string, string | number>;

  // Graph state (for BFS, DFS)
  graph?: GraphData;
  currentNode?: string;
  visitedNodes?: string[];
  frontierNodes?: string[]; // queue or stack
  activeEdge?: [string, string];
  visitedEdges?: [string, string][];
  traversalOrder?: string[];

  // Tree state (for BST, AVL Tree)
  tree?: TreeNodeData | null;
  activeNodeValue?: number; // currently inspected/comparing node
  treeHighlights?: number[]; // node values in search/traversal path
  treeAction?: "search" | "insert" | "delete" | "rotate-left" | "rotate-right" | "rebalance" | "traverse";
  rotationType?: "LL" | "RR" | "LR" | "RL";
  unbalancedNodeValue?: number;
  foundNodeValue?: number;

  // Pathfinding Grid state (Dijkstra, A*)
  gridRows?: number;
  gridCols?: number;
  gridStart?: [number, number];
  gridEnd?: [number, number];
  gridWalls?: [number, number][];
  currentCell?: [number, number];
  visitedCells?: [number, number][];
  frontierCells?: [number, number][];
  pathCells?: [number, number][];
  pathLength?: number;
  pathFound?: boolean;
  cellMetrics?: {
    distance?: number;
    hCost?: number;
    fCost?: number;
  };

  // Linked List state
  linkedList?: {
    id: string;
    value: number | string;
    nextId: string | null;
  }[];
  headId?: string | null;
  currNodeId?: string | null;
  prevNodeId?: string | null;
  nextNodeId?: string | null;
  slowNodeId?: string | null; // for Floyd's Cycle
  fastNodeId?: string | null; // for Floyd's Cycle
  cycleEntryId?: string | null;
  reversedEdges?: [string, string][];

  // Stack & Queue state
  stackItems?: {
    id: string;
    value: string;
    status?: "push" | "pop" | "matched" | "unmatched" | "normal";
  }[];
  inputString?: string;
  charIndex?: number;

  // Dynamic Programming (0/1 Knapsack) state
  dpTable?: number[][];
  dpRowLabels?: string[];
  dpColLabels?: (number | string)[];
  currentDpCell?: [number, number]; // [row, col]
  dpSourceCells?: [number, number][]; // previous dependency cells
  dpFormula?: string;
  selectedItems?: number[]; // indices of items selected in final knapsack
  knapsackItems?: {
    id: number;
    name: string;
    weight: number;
    value: number;
  }[];
  knapsackCapacity?: number;
  totalValue?: number;
  totalWeight?: number;

  // Backtracking (N-Queens) state
  nQueensBoard?: number[]; // column index of queen in each row (-1 if empty)
  boardSize?: number;
  currentQueen?: [number, number]; // [row, col] being checked
  queenConflicts?: [number, number][]; // conflicting queens or attack rays
  isBacktracking?: boolean;
  backtrackCount?: number;
  isSolution?: boolean;
  solutionCount?: number;
}

export interface GridConfig {
  rows?: number;
  cols?: number;
  start?: [number, number];
  end?: [number, number];
  walls?: [number, number][];
}

export interface AlgorithmCode {
  cpp: string;
  python: string;
  typescript: string;
}

export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  shortDescription: string;
  fullDescription: string;
  complexity: Complexity;
  properties?: {
    stable?: boolean;
    inPlace?: boolean;
    dataStructure?: string;
  };
  code: AlgorithmCode;
  defaultArray?: number[];
  defaultGraph?: GraphData;
  defaultTreeValues?: number[];
  defaultTarget?: number;
  defaultGrid?: GridConfig;
  generateSteps: (config?: any) => Step[];
}
