export type AlgorithmCategory = "sorting" | "searching" | "graph" | "array";

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
  defaultTarget?: number;
  generateSteps: (config?: any) => Step[];
}
