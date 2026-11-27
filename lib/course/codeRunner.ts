import { CodeChallengeSpec } from "./types";

export interface TestCaseResult {
  name: string;
  passed: boolean;
  inputDisplay: string;
  expectedDisplay: string;
  actualDisplay: string;
  error?: string;
  durationMs: number;
  isEdgeCase?: boolean;
}

export interface JudgeRunResult {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: TestCaseResult[];
  logs: string[];
  compileError?: string;
}

export function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (a === null || b === null || typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

function cloneValue(val: any): any {
  if (val === null || typeof val !== "object") return val;
  if (Array.isArray(val)) return val.map(cloneValue);
  const res: Record<string, any> = {};
  for (const k of Object.keys(val)) {
    res[k] = cloneValue(val[k]);
  }
  return res;
}

function formatVal(val: any): string {
  if (val === undefined) return "undefined";
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

/**
 * Inject simple loop iteration guard to protect the browser tab from accidental infinite loops.
 */
function guardInfiniteLoops(sourceCode: string, maxIterations = 120000): string {
  // Replace opening braces of for / while / do loops cleanly
  const header = `let __loopOps = 0;\nconst __tick = () => { if (++__loopOps > ${maxIterations}) throw new Error("Quá giới hạn ${maxIterations} vòng lặp (kiểm tra điều kiện dừng để tránh lặp vô tận)!"); };\n`;
  const guarded = sourceCode.replace(
    /(\b(?:for|while)\s*\([^)]*\)\s*\{|\bdo\s*\{)/g,
    "$1 __tick();"
  );
  return header + guarded;
}

export function runCodeChallenge(userCode: string, spec: CodeChallengeSpec): JudgeRunResult {
  const logs: string[] = [];
  const results: TestCaseResult[] = [];

  const mockConsole = {
    log: (...args: any[]) => {
      if (logs.length < 40) {
        logs.push(args.map((a) => (typeof a === "object" ? formatVal(a) : String(a))).join(" "));
      }
    },
    warn: (...args: any[]) => logs.push("[WARN] " + args.map(String).join(" ")),
    error: (...args: any[]) => logs.push("[ERROR] " + args.map(String).join(" ")),
  };

  let userFn: (...args: any[]) => any;

  try {
    const guarded = guardInfiniteLoops(userCode);
    const factory = new Function(
      "console",
      `"use strict";\n${guarded}\nif (typeof ${spec.functionName} !== "function") { throw new Error("Không tìm thấy hàm '${spec.functionName}(...)'. Vui lòng giữ nguyên tên hàm mặc định."); }\nreturn ${spec.functionName};`
    );
    userFn = factory(mockConsole);
  } catch (err: any) {
    return {
      allPassed: false,
      passedCount: 0,
      totalCount: spec.testCases.length,
      results: [],
      logs,
      compileError: err?.message || String(err),
    };
  }

  let passedCount = 0;

  for (const tc of spec.testCases) {
    const clonedArgs = tc.inputArgs.map(cloneValue);
    const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
    try {
      const actual = userFn(...clonedArgs);
      const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
      const durationMs = Math.max(0.01, Number((t1 - t0).toFixed(2)));
      const passed = deepEqual(actual, tc.expected);
      if (passed) passedCount++;

      results.push({
        name: tc.name,
        passed,
        inputDisplay: tc.inputArgs.map(formatVal).join(", "),
        expectedDisplay: formatVal(tc.expected),
        actualDisplay: formatVal(actual),
        durationMs,
        isEdgeCase: tc.isEdgeCase,
      });
    } catch (err: any) {
      const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
      results.push({
        name: tc.name,
        passed: false,
        inputDisplay: tc.inputArgs.map(formatVal).join(", "),
        expectedDisplay: formatVal(tc.expected),
        actualDisplay: "Runtime Error",
        error: err?.message || String(err),
        durationMs: Math.max(0.01, Number((t1 - t0).toFixed(2))),
        isEdgeCase: tc.isEdgeCase,
      });
    }
  }

  return {
    allPassed: passedCount === spec.testCases.length && spec.testCases.length > 0,
    passedCount,
    totalCount: spec.testCases.length,
    results,
    logs,
  };
}
