"use client";

import { useState, useMemo } from "react";
import { Algorithm, Step } from "@/lib/types";
import {
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Code2,
  Cpu,
  Sparkles,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface StudioLessonPanelProps {
  algorithm: Algorithm;
  steps: Step[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function StudioLessonPanel({
  algorithm,
  steps,
  currentStepIndex,
  onStepChange,
  isOpen,
  onToggle,
}: StudioLessonPanelProps) {
  const [selectedLang, setSelectedLang] = useState<"pseudocode" | "python" | "cpp" | "typescript">("pseudocode");
  const [isCodeExpanded, setIsCodeExpanded] = useState(true);

  const totalSteps = Math.max(1, steps.length);
  const currentStep = steps[currentStepIndex] || { description: "Đang nạp dữ liệu..." };
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex >= steps.length - 1;

  // Derive contextual Step Tag
  const stepTag = useMemo(() => {
    if (isLastStep) return "HOÀN TẤT";
    if (isFirstStep) return "BẮT ĐẦU";
    if (currentStep.swapping && currentStep.swapping.length > 0) return "HOÁN ĐỔI";
    if (currentStep.highlights && currentStep.highlights.length > 0) return "SO SÁNH";
    if (currentStep.pivot !== undefined) return "TRUNG ĐIỂM";
    if (currentStep.currentNode) return "DUYỆT ĐỈNH";
    if (currentStep.dpTable) return "QUY HOẠCH ĐỘNG";
    return "THỰC THI";
  }, [currentStep, isFirstStep, isLastStep]);

  // Derive dynamic Step Title
  const stepTitle = useMemo(() => {
    if (isLastStep) return "Thuật toán đã hoàn thành xuất sắc!";
    if (isFirstStep) return `Khởi tạo thuật toán ${algorithm.name}`;
    if (currentStep.swapping && currentStep.swapping.length >= 2) {
      return `Hoán đổi cặp phần tử [${currentStep.swapping[0]}] ⇄ [${currentStep.swapping[1]}]`;
    }
    if (currentStep.highlights && currentStep.highlights.length >= 2) {
      return `So sánh hai phần tử [${currentStep.highlights[0]}] và [${currentStep.highlights[1]}]`;
    }
    if (currentStep.pivot !== undefined) {
      return `Chọn điểm xoay / trung điểm pivot tại index ${currentStep.pivot}`;
    }
    if (currentStep.currentNode) {
      return `Thăm và xử lý đỉnh đồ thị '${currentStep.currentNode}'`;
    }
    return `Bước ${currentStepIndex + 1}: ${algorithm.name}`;
  }, [currentStep, currentStepIndex, isFirstStep, isLastStep, algorithm.name]);

  // Context-aware Pedagogical Tip / Callout
  const calloutTip = useMemo(() => {
    if (algorithm.category === "sorting") {
      if (currentStep.swapping) {
        return "Hoán đổi tại chỗ (In-Place) giúp thuật toán không phải cấp phát mảng phụ, tiết kiệm bộ nhớ O(1) Space.";
      }
      return "Với đầu vào nhỏ, hầu như thuật toán nào cũng nhanh. Sự chênh lệch giữa O(N²) và O(N log N) bùng nổ khi N vượt quá 10.000 phần tử.";
    }
    if (algorithm.category === "searching") {
      if (algorithm.id === "binary-search") {
        return "Để tránh lỗi Tràn số nguyên (Integer Overflow) trong C++/Java khi (left + right) vượt quá 2^31 - 1, luôn viết mid = left + (right - left) / 2.";
      }
      return "Tìm kiếm tuyến tính O(N) không yêu cầu mảng phải sắp xếp trước, trong khi Binary Search O(log N) bắt buộc mảng phải có thứ tự.";
    }
    if (algorithm.category === "graph") {
      return "Hàng đợi FIFO trong BFS đảm bảo tìm được đường đi có số cạnh ít nhất, trong khi ngăn xếp LIFO trong DFS đi sâu nhất có thể trước khi quay lui.";
    }
    if (algorithm.category === "tree") {
      return "Cây nhị phân tự cân bằng (AVL) đảm bảo chiều cao h luôn xấp xỉ 1.44 log2(N), ngăn chặn hiện tượng cây suy biến thành danh sách liên kết O(N).";
    }
    if (algorithm.category === "dp") {
      return "Nguyên lý tối ưu con (Optimal Substructure): Lời giải bài toán kích thước N được tính từ lời giải các bài toán con nhỏ hơn đã lưu trong bảng nhớ.";
    }
    return "Độ phức tạp thuật toán được đo bằng số lượng phép toán cơ bản thay vì số giây thực tế trên đồng hồ.";
  }, [algorithm, currentStep]);

  // Next step action label
  const nextActionLabel = useMemo(() => {
    if (isLastStep) return "Chạy lại từ đầu ↺";
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep?.swapping && nextStep.swapping.length > 0) return "Tiếp: Hoán đổi phần tử →";
    if (nextStep?.highlights && nextStep.highlights.length > 0) return "Tiếp: So sánh cặp kế tiếp →";
    if (nextStep?.pivot !== undefined) return "Tiếp: Chia phân hoạch →";
    return "Tiếp: Bước tiếp theo →";
  }, [isLastStep, steps, currentStepIndex]);

  // Pseudocode generation
  const pseudocodeLines = useMemo(() => {
    if (selectedLang === "pseudocode") {
      if (algorithm.category === "sorting") {
        return [
          "function sort(arr):",
          "  for i = 0 to n - 1:",
          "    for j = 0 to n - i - 1:",
          "      if arr[j] > arr[j + 1]:",
          "        swap(arr[j], arr[j + 1])",
          "  return arr",
        ];
      }
      if (algorithm.id === "binary-search") {
        return [
          "function binarySearch(arr, target):",
          "  left = 0, right = n - 1",
          "  while left <= right:",
          "    mid = left + (right - left) // 2",
          "    if arr[mid] == target: return mid",
          "    else if arr[mid] < target: left = mid + 1",
          "    else: right = mid - 1",
          "  return -1",
        ];
      }
      return [
        `function ${algorithm.id.replace(/-/g, "_")}(data):`,
        "  initialize state variables",
        "  while conditions hold:",
        "    process current element",
        "    transition to next step",
        "  return optimal result",
      ];
    }
    const codeStr = algorithm.code[selectedLang] || "";
    return codeStr.split("\n");
  }, [selectedLang, algorithm]);

  // Active line calculation
  const activeLineIndex = useMemo(() => {
    if (currentStep.codeLine !== undefined && currentStep.codeLine > 0) {
      return currentStep.codeLine - 1;
    }
    if (isFirstStep) return 0;
    if (isLastStep) return pseudocodeLines.length - 1;
    if (currentStep.swapping && currentStep.swapping.length > 0) {
      return Math.min(4, pseudocodeLines.length - 2);
    }
    if (currentStep.highlights && currentStep.highlights.length > 0) {
      return Math.min(3, pseudocodeLines.length - 3);
    }
    return 1;
  }, [currentStep, isFirstStep, isLastStep, pseudocodeLines.length]);

  if (!isOpen) return null;

  return (
    <div className="w-80 lg:w-96 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-l border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md flex flex-col z-20 transition-all select-none overflow-y-auto custom-scrollbar p-4 space-y-4">
      {/* ================= 1. PEDAGOGICAL STEP CARD ================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3 shadow-xs">
        {/* Step Progress & Tag */}
        <div className="flex items-center justify-between text-xs">
          <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
            BƯỚC {currentStepIndex + 1} / {totalSteps}
          </div>
          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase bg-[#e06c53]/15 text-[#e06c53] border border-[#e06c53]/30">
            {stepTag}
          </span>
        </div>

        {/* Step Dynamic Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
          {stepTitle}
        </h3>

        {/* Step Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Callout Box: Mẹo phỏng vấn & Lưu ý */}
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 dark:bg-amber-950/30 p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs">
            <Lightbulb className="w-3.5 h-3.5 shrink-0" />
            <span>ĐỂ Ý / LƯU Ý:</span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
            {calloutTip}
          </p>
        </div>

        {/* Action Buttons: Prev & Next */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={isFirstStep}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>

          <button
            onClick={() => {
              if (isLastStep) {
                onStepChange(0);
              } else {
                onStepChange(currentStepIndex + 1);
              }
            }}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#e06c53] hover:bg-[#d05c43] text-white shadow-md shadow-[#e06c53]/25 hover:shadow-[#e06c53]/40 transition-all flex items-center justify-center gap-1.5"
          >
            <span>{nextActionLabel}</span>
          </button>
        </div>
      </div>

      {/* ================= 2. SYNCHRONIZED PSEUDOCODE ================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 overflow-hidden shadow-xs">
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#e06c53]" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Mã giả & Code
            </span>
          </div>

          <div className="flex items-center gap-1">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as any)}
              className="text-[11px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="pseudocode">Mã giả</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
            </select>
            <button
              onClick={() => setIsCodeExpanded((prev) => !prev)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {isCodeExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isCodeExpanded && (
          <div className="p-2 font-mono text-[11px] leading-relaxed overflow-x-auto bg-slate-950 text-slate-200 max-h-60 overflow-y-auto">
            {pseudocodeLines.map((line, idx) => {
              const isActive = idx === activeLineIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                    isActive
                      ? "bg-[#e06c53]/25 text-white font-bold border-l-2 border-[#e06c53]"
                      : "text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  <span className="w-6 shrink-0 text-slate-600 select-none text-right pr-2">
                    {idx + 1}
                  </span>
                  <span className="shrink-0 w-3 text-[#e06c53] font-bold">
                    {isActive ? "▶" : " "}
                  </span>
                  <span className="whitespace-pre truncate">{line}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= 3. STEP METRICS & BIG-O SUMMARY ================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
          <span>Chỉ số giải thuật</span>
          <Cpu className="w-3.5 h-3.5 text-[#e06c53]" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2">
            <div className="text-[10px] text-slate-400">Độ phức tạp Time</div>
            <div className="font-bold font-mono text-emerald-500 text-xs">
              {algorithm.complexity.average}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2">
            <div className="text-[10px] text-slate-400">Bộ nhớ Space</div>
            <div className="font-bold font-mono text-cyan-500 text-xs">
              {algorithm.complexity.space}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
