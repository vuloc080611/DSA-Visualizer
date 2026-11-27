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
  | "backtracking"
  | "string"
  | "greedy"
  | "hash-table"
  | "heap";

export interface TrieNodeData {
  id: string;
  char: string;
  isEndOfWord: boolean;
  word?: string;
  children: Record<string, TrieNodeData>;
}

export interface SegTreeNodeData {
  id: string;
  range: [number, number]; // [L, R]
  sum: number;
  status?: "normal" | "inspecting" | "matched" | "updated";
  left?: SegTreeNodeData | null;
  right?: SegTreeNodeData | null;
}

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

  // Trie (Prefix Tree) state
  trie?: TrieNodeData;
  trieActivePath?: string[]; // array of node ids
  trieCurrentWord?: string;
  trieAction?: "insert" | "search" | "autocomplete";
  trieSuggestions?: string[];

  // KMP (Knuth-Morris-Pratt) state
  kmpText?: string;
  kmpPattern?: string;
  kmpLps?: number[];
  kmpTextIndex?: number;
  kmpPatternIndex?: number;
  kmpMatchedIndices?: number[];
  kmpState?: "comparing" | "match" | "mismatch" | "lps-jump" | "found";

  // DSU & Kruskal's MST state
  dsuEdges?: {
    from: string;
    to: string;
    weight: number;
    status: "considering" | "accepted" | "rejected" | "normal";
  }[];
  dsuParent?: Record<string, string>;
  dsuRank?: Record<string, number>;
  dsuComponents?: Record<string, string>; // node -> component color/id
  mstWeight?: number;
  mstEdgesCount?: number;

  // Segment Tree state
  segTree?: SegTreeNodeData | null;
  segTreeArray?: number[];
  segTreeQueryRange?: [number, number];
  segTreeUpdatedIndex?: number;
  segTreeAction?: "build" | "query" | "update";

  // Topological Sort (Kahn's Algorithm) state
  inDegree?: Record<string, number>;
  topoQueue?: string[];
  topoOrder?: string[];
  activeTopoNode?: string;
  activeOutgoingEdges?: [string, string][];

  // Longest Common Subsequence (LCS) state
  lcsString1?: string;
  lcsString2?: string;
  lcsTable?: number[][];
  currentLcsCell?: [number, number];
  lcsMatchChar?: string;
  lcsBacktrackPath?: [number, number][];
  lcsResult?: string;

  // Greedy Interval Scheduling state
  intervals?: IntervalActivity[];
  selectedIntervalsCount?: number;
  currentIntervalId?: string;
  lastEndTime?: number;

  // Hash Table Collision state
  hashBuckets?: HashBucket[];
  currentHashKey?: number;
  computedHashIndex?: number;
  hashCollisionDetected?: boolean;
  hashProbingIndices?: number[];

  // Min Heap Operations state
  heapArray?: number[];
  heapHighlightIndices?: number[];
  heapSwappingIndices?: [number, number];
  heapExtractedValue?: number;
  heapAction?: "insert" | "extract-min" | "sift-up" | "sift-down" | "complete";

  // Stack & Queue Core Operations state
  linearOpsStack?: string[];
  linearOpsQueue?: string[];
  linearOpsAction?: string;
}

export interface IntervalActivity {
  id: string;
  name: string;
  start: number;
  end: number;
  status: "normal" | "inspecting" | "selected" | "overlapping";
}

export interface HashBucket {
  index: number;
  items: { key: number; label?: string }[];
  status?: "idle" | "inserting" | "collided" | "matched";
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
