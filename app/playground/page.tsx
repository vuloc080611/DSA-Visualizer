"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sparkles,
  Code2,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  HelpCircle,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { playTone, getPitchForValue } from "@/lib/utils";

interface PlaygroundStep {
  array: number[];
  highlights?: number[];
  swapping?: number[];
  sorted?: number[];
  description: string;
}

interface LogEntry {
  type: "info" | "log" | "warn" | "error";
  message: string;
  timestamp: string;
}

const PRESET_CODES = {
  bubbleSort: `// Thuật toán: Bubble Sort (Sắp xếp nổi bọt)
// Tham số:
//   arr: mảng số nguyên đầu vào
//   step(arr, meta): hàm ghi nhận một bước hoạt ảnh
function sort(arr, step) {
  const n = arr.length;
  step(arr, { description: "Khởi tạo mảng ban đầu" });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // 1. So sánh hai phần tử liền kề (vàng)
      step(arr, {
        highlights: [j, j + 1],
        description: \`So sánh \${arr[j]} và \${arr[j + 1]}\`
      });

      if (arr[j] > arr[j + 1]) {
        // 2. Hoán đổi (đỏ)
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        step(arr, {
          swapping: [j, j + 1],
          description: \`Hoán đổi \${arr[j + 1]} và \${arr[j]}\`
        });
      }
    }
    // Phần tử cuối cùng của lượt đã về đúng vị trí (xanh)
    step(arr, {
      sorted: [n - 1 - i],
      description: \`Phần tử \${arr[n - 1 - i]} đã vào đúng vị trí\`
    });
  }

  // Đánh dấu toàn bộ mảng đã sắp xếp
  const allIndices = Array.from({ length: n }, (_, k) => k);
  step(arr, { sorted: allIndices, description: "Hoàn tất sắp xếp!" });
}`,

  selectionSort: `// Thuật toán: Selection Sort (Sắp xếp chọn)
function sort(arr, step) {
  const n = arr.length;
  step(arr, { description: "Khởi tạo mảng" });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    step(arr, { highlights: [minIdx], description: \`Chọn vị trí \${i} làm ứng viên nhỏ nhất (\${arr[minIdx]})\` });

    for (let j = i + 1; j < n; j++) {
      step(arr, {
        highlights: [minIdx, j],
        description: \`Kiểm tra \${arr[j]} có nhỏ hơn \${arr[minIdx]} không\`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        step(arr, { highlights: [minIdx], description: \`Cập nhật giá trị nhỏ nhất mới: \${arr[minIdx]} tại chỉ số \${minIdx}\` });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      step(arr, { swapping: [i, minIdx], description: \`Đưa giá trị nhỏ nhất \${arr[i]} về vị trí \${i}\` });
    }

    step(arr, { sorted: [i], description: \`Vị trí \${i} đã sắp xếp chính xác\` });
  }

  const allIndices = Array.from({ length: n }, (_, k) => k);
  step(arr, { sorted: allIndices, description: "Hoàn tất Selection Sort!" });
}`,

  insertionSort: `// Thuật toán: Insertion Sort (Sắp xếp chèn)
function sort(arr, step) {
  const n = arr.length;
  step(arr, { description: "Khởi tạo mảng" });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    step(arr, { highlights: [i], description: \`Lấy giá trị key = \${key} để chèn vào dãy con đã xếp\` });

    while (j >= 0 && arr[j] > key) {
      step(arr, {
        highlights: [j, j + 1],
        description: \`Dịch chuyển \${arr[j]} sang phải vì lớn hơn key (\${key})\`
      });

      arr[j + 1] = arr[j];
      step(arr, { swapping: [j + 1], description: \`Đã dịch phần tử \${arr[j]} sang vị trí \${j + 1}\` });
      j = j - 1;
    }

    arr[j + 1] = key;
    step(arr, { sorted: [j + 1], description: \`Chèn key = \${key} vào vị trí phù hợp: \${j + 1}\` });
  }

  const allIndices = Array.from({ length: n }, (_, k) => k);
  step(arr, { sorted: allIndices, description: "Hoàn tất Insertion Sort!" });
}`,

  reverseArray: `// Thuật toán: Two-Pointer Array Reversal (Đảo ngược mảng 2 con trỏ)
function sort(arr, step) {
  let left = 0;
  let right = arr.length - 1;
  step(arr, { description: "Bắt đầu đảo mảng với hai con trỏ trái và phải" });

  while (left < right) {
    step(arr, {
      highlights: [left, right],
      description: \`Trỏ tới chỉ số [\${left}] (giá trị \${arr[left]}) và [\${right}] (giá trị \${arr[right]})\`
    });

    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;

    step(arr, {
      swapping: [left, right],
      description: \`Hoán đổi hai đầu [\${left}] và [\${right}]\`
    });

    step(arr, {
      sorted: [left, right],
      description: \`Hai vị trí [\${left}] và [\${right}] đã hoàn thành\`
    });

    left++;
    right--;
  }

  const allIndices = Array.from({ length: arr.length }, (_, k) => k);
  step(arr, { sorted: allIndices, description: "Hoàn tất đảo ngược mảng!" });
}`,
};

const DEFAULT_ARRAY = [48, 15, 86, 32, 67, 24, 91, 10, 53, 38];

export default function PlaygroundPage() {
  const [code, setCode] = useState<string>(PRESET_CODES.bubbleSort);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESET_CODES>("bubbleSort");
  const [initialArray, setInitialArray] = useState<number[]>(DEFAULT_ARRAY);
  const [customArrayInput, setCustomArrayInput] = useState<string>(DEFAULT_ARRAY.join(", "));
  
  // Simulation playback state
  const [steps, setSteps] = useState<PlaygroundStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(450);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Execution diagnostics
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [executionStats, setExecutionStats] = useState<{ comparisons: number; swaps: number; stepsCount: number } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // File drag & drop import state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sound loop
  useEffect(() => {
    if (!soundEnabled || !steps[currentStepIndex]) return;
    const step = steps[currentStepIndex];
    if (step.swapping && step.swapping.length > 0) {
      const val = step.array[step.swapping[0]] || 50;
      playTone(getPitchForValue(val, 0, 100, 200, 800), "triangle", 0.05, 0.04);
    } else if (step.highlights && step.highlights.length > 0) {
      const val = step.array[step.highlights[0]] || 50;
      playTone(getPitchForValue(val, 0, 100, 260, 650), "sine", 0.035, 0.03);
    }
  }, [currentStepIndex, steps, soundEnabled]);

  // Animation player timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      if (currentStepIndex >= steps.length - 1) {
        setIsPlaying(false);
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#f59e0b"],
        });
      } else {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, speed);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  // Execute user JavaScript code safely
  const handleExecuteCode = useCallback(() => {
    setIsPlaying(false);
    setCompileError(null);
    const capturedLogs: LogEntry[] = [];

    const addLog = (type: "info" | "log" | "warn" | "error", message: string) => {
      const time = new Date().toLocaleTimeString("vi-VN", { hour12: false });
      capturedLogs.push({ type, message, timestamp: time });
    };

    addLog("info", "Bắt đầu biên dịch và thực thi mã nguồn JavaScript...");

    const recordedSteps: PlaygroundStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    const MAX_STEPS = 1200;

    // Helper step recorder passed to user code
    const stepRecorder = (
      currentArr: number[],
      meta?: {
        highlights?: number[];
        swapping?: number[];
        sorted?: number[];
        description?: string;
      }
    ) => {
      if (recordedSteps.length >= MAX_STEPS) {
        throw new Error(`Đã đạt giới hạn an toàn tối đa ${MAX_STEPS} bước để chống tràn bộ nhớ hoặc vòng lặp vô hạn!`);
      }

      if (meta?.highlights && meta.highlights.length > 1) comparisons++;
      if (meta?.swapping && meta.swapping.length > 0) swaps++;

      recordedSteps.push({
        array: [...currentArr],
        highlights: meta?.highlights ? [...meta.highlights] : undefined,
        swapping: meta?.swapping ? [...meta.swapping] : undefined,
        sorted: meta?.sorted ? [...meta.sorted] : undefined,
        description: meta?.description || `Bước #${recordedSteps.length + 1}`,
      });
    };

    // Custom console wrapper
    const sandboxConsole = {
      log: (...args: any[]) => addLog("log", args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
      warn: (...args: any[]) => addLog("warn", args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
      error: (...args: any[]) => addLog("error", args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
    };

    try {
      // Evaluate function
      // eslint-disable-next-line no-new-func
      const runner = new Function(
        "console",
        `
        ${code}
        if (typeof sort !== "function") {
          throw new Error("Không tìm thấy hàm 'sort(arr, step)'. Vui lòng định nghĩa hàm sort(arr, step) trong code của bạn!");
        }
        return sort;
        `
      );

      const sortFn = runner(sandboxConsole);
      const testArray = [...initialArray];

      const startTime = performance.now();
      sortFn(testArray, stepRecorder);
      const duration = (performance.now() - startTime).toFixed(2);

      if (recordedSteps.length === 0) {
        // Record at least initial state
        recordedSteps.push({
          array: [...testArray],
          description: "Mã nguồn chạy xong nhưng không gọi hàm step(arr, meta) lần nào.",
        });
        addLog("warn", "Cảnh báo: Bạn chưa gọi hàm step(arr, meta) để ghi lại hoạt ảnh!");
      }

      setSteps(recordedSteps);
      setCurrentStepIndex(0);
      setExecutionStats({
        comparisons,
        swaps,
        stepsCount: recordedSteps.length,
      });

      addLog("info", `Thực thi thành công trong ${duration}ms! Ghi nhận ${recordedSteps.length} khung hình hoạt ảnh.`);
      setLogs(capturedLogs);
    } catch (err: any) {
      console.error(err);
      setCompileError(err.message || "Lỗi không xác định khi thực thi JavaScript");
      addLog("error", `Lỗi: ${err.message || String(err)}`);
      setLogs(capturedLogs);
    }
  }, [code, initialArray]);

  // Initial execution on mount
  useEffect(() => {
    handleExecuteCode();
  }, [handleExecuteCode]);

  // Handle Preset Selection
  const handleSelectPreset = (presetKey: keyof typeof PRESET_CODES) => {
    setSelectedPreset(presetKey);
    setCode(PRESET_CODES[presetKey]);
  };

  // Handle Array Text Input
  const handleApplyCustomArray = () => {
    try {
      const parsed = customArrayInput
        .split(/[,;\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number);

      if (parsed.some(isNaN)) {
        alert("Vui lòng chỉ nhập các số nguyên hợp lệ cách nhau bởi dấu phẩy hoặc khoảng trắng!");
        return;
      }
      if (parsed.length < 3 || parsed.length > 25) {
        alert("Độ dài mảng nên từ 3 đến 25 phần tử để đảm bảo quan sát tốt nhất!");
        return;
      }

      setInitialArray(parsed);
      setCustomArrayInput(parsed.join(", "));
    } catch {
      alert("Định dạng mảng không hợp lệ!");
    }
  };

  // Generate Random Array
  const handleGenerateRandom = () => {
    const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 10);
    setInitialArray(arr);
    setCustomArrayInput(arr.join(", "));
  };

  // Generate Reversed Array
  const handleGenerateReversed = () => {
    const arr = [95, 84, 73, 62, 51, 40, 31, 20, 15, 8];
    setInitialArray(arr);
    setCustomArrayInput(arr.join(", "));
  };

  // File Drop Parser
  const parseFileContent = (content: string) => {
    try {
      let nums: number[] = [];
      if (content.trim().startsWith("[")) {
        nums = JSON.parse(content);
      } else {
        nums = content
          .split(/[\r\n,;\t\s]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number);
      }
      const valid = nums.filter((n) => typeof n === "number" && !isNaN(n)).slice(0, 20);
      if (valid.length >= 3) {
        setInitialArray(valid);
        setCustomArrayInput(valid.join(", "));
        alert(`Đã nạp thành công ${valid.length} số từ tệp tin!`);
      } else {
        alert("Không tìm thấy đủ dữ liệu số hợp lệ (tối thiểu 3 số).");
      }
    } catch (err: any) {
      alert("Không thể đọc tệp dữ liệu: " + err.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) parseFileContent(text);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) parseFileContent(text);
    };
    reader.readAsText(file);
  };

  // Keyboard shortcut Ctrl+Enter to execute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleExecuteCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleExecuteCode]);

  const currentStep = steps[currentStepIndex] || {
    array: initialArray,
    description: "Nhấn 'Chạy mã nguồn' để tạo hoạt ảnh.",
  };

  const maxVal = Math.max(...(currentStep.array || [100]), 100);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Tính năng đỉnh cao
            </span>
            <span className="text-xs text-slate-500 font-mono">JS Engine Sandbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Terminal className="w-8 h-8 text-emerald-500" />
            <span>Live Code Playground</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Tự tay viết code JavaScript thuật toán của riêng bạn. Hệ thống sẽ tự phân tích và mô phỏng từng bước sinh động theo thời gian thực!
          </p>
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExecuteCode}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            title="Thực thi code và tạo hoạt ảnh (Ctrl + Enter)"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Chạy mã nguồn</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/20 text-[10px] font-mono border border-white/20">
              Ctrl+↵
            </kbd>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Editor on Left, Visualizer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CODE EDITOR & DATA CONTROLS (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          {/* Preset Selector & Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-500 ml-1" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Mẫu thuật toán:</span>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    ["bubbleSort", "Bubble"],
                    ["selectionSort", "Selection"],
                    ["insertionSort", "Insertion"],
                    ["reverseArray", "Đảo mảng 2 trỏ"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectPreset(key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedPreset === key
                        ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs border border-emerald-500/30"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Sao chép mã nguồn"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Đã chép" : "Chép code"}</span>
            </button>
          </div>

          {/* Code Textarea Editor */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-lg flex-1 min-h-[380px] flex flex-col font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-semibold text-slate-300 ml-2">algorithm.js</span>
              </div>
              <span className="text-[11px] text-slate-500">Hàm gọi: step(arr, meta)</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  const val = e.currentTarget.value;
                  setCode(val.substring(0, start) + "  " + val.substring(end));
                  setTimeout(() => {
                    if (e.currentTarget) {
                      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                    }
                  }, 0);
                }
              }}
              spellCheck={false}
              className="w-full h-full min-h-[340px] flex-1 p-4 bg-transparent text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-emerald-500/30"
              placeholder="// Gõ code JavaScript tại đây..."
            />
          </div>

          {/* Dataset Customizer Toolbar */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Dữ liệu đầu vào ({initialArray.length} phần tử):
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={handleGenerateRandom}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Ngẫu nhiên
                </button>
                <button
                  onClick={handleGenerateReversed}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Nghịch đảo
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Nạp file</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.json,.txt"
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customArrayInput}
                onChange={(e) => setCustomArrayInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyCustomArray();
                  }
                }}
                placeholder="Nhập mảng: 45, 12, 89, 34, 70..."
                className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleApplyCustomArray}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                Áp dụng
              </button>
            </div>

            {/* Drag & drop dropzone hint */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-2.5 text-center transition-colors text-xs ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                  : "border-slate-200 dark:border-slate-800 text-slate-400"
              }`}
            >
              Kéo thả file CSV, JSON hoặc TXT vào đây để nạp dữ liệu bài tập
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VISUALIZER CANVAS & CONTROLS (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Visualizer Canvas Area */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
            <div>
              {/* Header metrics */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Mô phỏng đồ họa trực quan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    Bước {currentStepIndex + 1} / {Math.max(steps.length, 1)}
                  </span>
                </div>
              </div>

              {/* Description banner */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-300 min-h-[46px] flex items-center">
                {currentStep.description}
              </div>
            </div>

            {/* Array Bars Graph */}
            <div className="h-64 sm:h-72 w-full flex items-end justify-center gap-1.5 sm:gap-2 px-2 py-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
              {currentStep.array &&
                currentStep.array.map((val, idx) => {
                  const isSorted = currentStep.sorted?.includes(idx);
                  const isSwapping = currentStep.swapping?.includes(idx);
                  const isHighlight = currentStep.highlights?.includes(idx);

                  let barBg = "bg-slate-400 dark:bg-slate-600";
                  if (isSorted) barBg = "bg-emerald-500 shadow-md shadow-emerald-500/20";
                  else if (isSwapping) barBg = "bg-rose-500 animate-pulse";
                  else if (isHighlight) barBg = "bg-amber-400 shadow-md shadow-amber-400/20";

                  const heightPercent = Math.max((val / maxVal) * 88, 12);

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full max-w-[42px] transition-all duration-150"
                    >
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {val}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-200 ${barBg}`}
                      />
                      <span className="text-[9px] font-mono text-slate-400 mt-1">
                        [{idx}]
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Playback Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Slider Scrubber */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={Math.max(steps.length - 1, 0)}
                  value={currentStepIndex}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentStepIndex(Number(e.target.value));
                  }}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Main Button Group */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex(0);
                    }}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Về bước đầu tiên"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                    }}
                    disabled={currentStepIndex === 0}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                    title="Bước trước"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-transform transform active:scale-95"
                    title={isPlaying ? "Tạm dừng" : "Tiếp tục chạy"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
                    }}
                    disabled={currentStepIndex >= steps.length - 1}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                    title="Bước kế tiếp"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed selector */}
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span>Tốc độ:</span>
                  {[
                    [700, "0.5x"],
                    [450, "1x"],
                    [180, "2x"],
                  ].map(([spd, label]) => (
                    <button
                      key={spd}
                      onClick={() => setSpeed(Number(spd))}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                        speed === spd
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics: Metrics + Error Alert + Sandbox Console */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            {compileError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Lỗi thực thi JavaScript:</p>
                  <p className="font-mono">{compileError}</p>
                </div>
              </div>
            )}

            {executionStats && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Khung hình</p>
                  <p className="font-mono font-extrabold text-slate-900 dark:text-white text-base">
                    {executionStats.stepsCount}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                  <p className="text-amber-600 dark:text-amber-400 text-[10px] uppercase font-bold">So sánh</p>
                  <p className="font-mono font-extrabold text-amber-700 dark:text-amber-300 text-base">
                    {executionStats.comparisons}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60">
                  <p className="text-rose-600 dark:text-rose-400 text-[10px] uppercase font-bold">Hoán đổi</p>
                  <p className="font-mono font-extrabold text-rose-700 dark:text-rose-300 text-base">
                    {executionStats.swaps}
                  </p>
                </div>
              </div>
            )}

            {/* Console Output Drawer */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>Console Sandbox ({logs.length} bản ghi)</span>
                <button
                  onClick={() => setLogs([])}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Xóa log
                </button>
              </div>
              <div className="h-28 overflow-y-auto rounded-xl bg-slate-950 p-2.5 font-mono text-[11px] text-slate-300 space-y-1">
                {logs.length === 0 ? (
                  <p className="text-slate-500 italic">// Chưa có log nào từ console.log()</p>
                ) : (
                  logs.map((lg, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-slate-600 text-[10px]">{lg.timestamp}</span>
                      <span
                        className={
                          lg.type === "error"
                            ? "text-rose-400 font-bold"
                            : lg.type === "warn"
                            ? "text-amber-300"
                            : lg.type === "info"
                            ? "text-sky-400"
                            : "text-emerald-300"
                        }
                      >
                        {lg.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
