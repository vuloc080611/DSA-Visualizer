"use client";

import { useState } from "react";
import { Cpu, TrendingUp, Layers, Compass, Award, ArrowRight, Play, RotateCcw, CheckCircle2 } from "lucide-react";

interface ConceptSandboxWidgetProps {
  widgetType: "intro-roadmap" | "ram-adt" | "big-o-growth" | "recursion-stack" | "capstone-guide";
  onInteractComplete?: () => void;
}

export function ConceptSandboxWidget({ widgetType, onInteractComplete }: ConceptSandboxWidgetProps) {
  if (widgetType === "ram-adt") {
    return <RamAdtWidget onInteract={onInteractComplete} />;
  }
  if (widgetType === "big-o-growth") {
    return <BigOGrowthWidget onInteract={onInteractComplete} />;
  }
  if (widgetType === "recursion-stack") {
    return <RecursionStackWidget onInteract={onInteractComplete} />;
  }
  if (widgetType === "capstone-guide") {
    return <CapstonePatternWidget onInteract={onInteractComplete} />;
  }
  return <IntroJourneyWidget onInteract={onInteractComplete} />;
}

function IntroJourneyWidget({ onInteract }: { onInteract?: () => void }) {
  const [activeStage, setActiveStage] = useState(0);
  const stages = [
    {
      num: "01",
      title: "Lý thuyết 6 mục chuẩn",
      desc: "Đặt vấn đề thực tế → Trực giác → Loop Invariant (Bất biến) → Phân tích Big-O → Bẫy phỏng vấn → Trade-offs.",
      color: "from-orange-500 to-rose-500",
    },
    {
      num: "02",
      title: "Xem & Thử Demo trực quan",
      desc: "Quan sát từng bước hoạt ảnh, thay đổi mảng đầu vào (đảo ngược, gần xếp sẵn, tự nhập) và xem mã giả chạy đồng bộ.",
      color: "from-amber-500 to-orange-500",
    },
    {
      num: "03",
      title: "Thực hành tư duy (Quiz & Challenge)",
      desc: "Trả lời câu hỏi tình huống hoặc tự tay điều khiển hoán đổi/chọn đỉnh ở Challenge Mode.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      num: "04",
      title: "Tự Code & Chấm bài (Auto-Judge)",
      desc: "Tự cài đặt thuật toán bằng JavaScript và chạy vượt qua 100% Test Cases tự động để chính thức Pass bài & mở khóa bài kế!",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Compass className="w-4 h-4 text-[#e06c53]" />
          <span>Thử tương tác quy trình 4 chặng học của mỗi bài</span>
        </div>
        <span className="text-xs text-slate-500">Bấm từng chặng bên dưới để khám phá</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {stages.map((st, idx) => (
          <button
            key={st.num}
            onClick={() => {
              setActiveStage(idx);
              onInteract?.();
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeStage === idx
                ? "border-[#e06c53] bg-[#e06c53]/10 shadow-sm"
                : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-400"
            }`}
          >
            <div className="text-[11px] font-mono font-bold text-[#e06c53]">CHẶNG {st.num}</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{st.title}</div>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Chi tiết Chặng {stages[activeStage].num}: {stages[activeStage].title}</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{stages[activeStage].desc}</p>
      </div>
    </div>
  );
}

function RamAdtWidget({ onInteract }: { onInteract?: () => void }) {
  const [arr, setArr] = useState([25, 18, 42, 7, 91]);
  const [selectedIdx, setSelectedIdx] = useState<number>(2);
  const [opLog, setOpLog] = useState("Đọc arr[2]: CPU tính thẳng 0x100 + 2×4 = 0x108 trong O(1)!");
  const baseAddr = 0x100;

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    const addr = `0x${(baseAddr + idx * 4).toString(16).toUpperCase()}`;
    setOpLog(`Truy cập ngẫu nhiên arr[${idx}] = ${arr[idx]} → Nhảy thẳng ô nhớ ${addr} (Chỉ tốn 1 phép cộng = O(1))`);
    onInteract?.();
  };

  const handleInsertHead = () => {
    if (arr.length >= 7) {
      setArr([25, 18, 42, 7, 91]);
      setSelectedIdx(0);
      setOpLog("Reset mảng về 5 phần tử ban đầu.");
      return;
    }
    const newVal = Math.floor(Math.random() * 89) + 10;
    const shifts = arr.length;
    setArr([newVal, ...arr]);
    setSelectedIdx(0);
    setOpLog(`Chèn ${newVal} vào đầu mảng (index 0): Phải DỊCH CHUYỂN tất cả ${shifts} phần tử cũ sang phải → Tốn O(N) bước!`);
    onInteract?.();
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Cpu className="w-4 h-4 text-[#e06c53]" />
          <span>Mô phỏng Bộ nhớ RAM & Mảng 4-byte (int32)</span>
        </div>
        <button
          onClick={handleInsertHead}
          className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/25 transition-colors cursor-pointer"
        >
          {arr.length >= 7 ? "Reset mảng" : "+ Thử chèn vào đầu mảng (O(N))"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
        {arr.map((val, idx) => {
          const addr = `0x${(baseAddr + idx * 4).toString(16).toUpperCase()}`;
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={`${idx}-${val}`}
              onClick={() => handleSelect(idx)}
              className={`flex flex-col items-center px-4 py-2.5 rounded-xl border font-mono transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#e06c53] text-white border-orange-300 shadow-lg scale-105"
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500"
              }`}
            >
              <span className="text-[10px] opacity-75">{addr}</span>
              <span className="text-lg font-extrabold my-0.5">{val}</span>
              <span className="text-[10px] opacity-85">arr[{idx}]</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 text-xs font-mono text-slate-700 dark:text-emerald-400">
        {opLog}
      </div>
    </div>
  );
}

function BigOGrowthWidget({ onInteract }: { onInteract?: () => void }) {
  const [n, setN] = useState(16);

  const items = [
    { label: "O(1) — Hằng số", steps: 1, color: "bg-emerald-500", desc: "Lấy arr[0] hoặc Hash lookup" },
    { label: "O(log N) — Logarit", steps: Math.max(1, Math.round(Math.log2(n))), color: "bg-teal-500", desc: "Binary Search" },
    { label: "O(N) — Tuyến tính", steps: n, color: "bg-cyan-500", desc: "Linear Search / Two Pointers" },
    { label: "O(N log N) — Chuẩn Sort", steps: Math.round(n * Math.log2(n)), color: "bg-amber-500", desc: "Merge Sort / Quick Sort" },
    { label: "O(N²) — Bậc hai", steps: n * n, color: "bg-rose-500", desc: "Bubble / Selection / Insertion" },
  ];

  const maxSteps = Math.max(...items.map((i) => i.steps), 1);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <TrendingUp className="w-4 h-4 text-[#e06c53]" />
          <span>Đếm số bước khi thay đổi kích thước đầu vào N</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold px-3 py-1 rounded-full bg-[#e06c53]/15 text-[#e06c53] border border-[#e06c53]/30">
            N = {n}
          </span>
        </div>
      </div>

      <input
        type="range"
        min={2}
        max={64}
        value={n}
        onChange={(e) => {
          setN(Number(e.target.value));
          onInteract?.();
        }}
        className="w-full accent-[#e06c53] cursor-pointer"
      />

      <div className="space-y-3 bg-slate-950 rounded-2xl p-4 border border-slate-800">
        {items.map((item) => {
          const widthPct = Math.max(2, Math.min(100, Math.round((item.steps / maxSteps) * 100)));
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{item.label} <span className="text-slate-500 font-normal">({item.desc})</span></span>
                <span className="font-mono font-bold text-slate-100">{item.steps.toLocaleString()} bước</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${item.color}`} style={{ width: `${widthPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecursionStackWidget({ onInteract }: { onInteract?: () => void }) {
  const [step, setStep] = useState(0);
  const frames = [
    { stack: ["sum([4, 2, 7], idx=0)"], note: "Bắt đầu: Gọi hàm với idx = 0 (cần đợi idx=1 trả về)" },
    { stack: ["sum([4, 2, 7], idx=0)", "sum([4, 2, 7], idx=1)"], note: "Đẩy Frame idx = 1 lên Call Stack" },
    { stack: ["sum([4, 2, 7], idx=0)", "sum([4, 2, 7], idx=1)", "sum([4, 2, 7], idx=2)"], note: "Đẩy Frame idx = 2 lên Call Stack" },
    { stack: ["sum([4, 2, 7], idx=0)", "sum([4, 2, 7], idx=1)", "sum([4, 2, 7], idx=2)", "idx=3 ≥ 3 → BASE CASE return 0"], note: "Chạm Base Case! Trả về 0 và bắt đầu thu gọn Call Stack." },
    { stack: ["sum([4, 2, 7], idx=0)", "sum([4, 2, 7], idx=1)", "idx=2: return 7 + 0 = 7"], note: "Thu về idx = 2: 7 + 0 = 7" },
    { stack: ["sum([4, 2, 7], idx=0)", "idx=1: return 2 + 7 = 9"], note: "Thu về idx = 1: 2 + 7 = 9" },
    { stack: ["Kết quả cuối cùng: 4 + 9 = 13"], note: "Hoàn tất! Pop toàn bộ Call Stack với kết quả 13." },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Layers className="w-4 h-4 text-[#e06c53]" />
          <span>Mô phỏng Call Stack Đệ quy: sumArray([4, 2, 7])</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(0)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setStep((s) => (s + 1) % frames.length);
              onInteract?.();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#e06c53] hover:bg-[#d05c43] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Bước tiếp ({step + 1}/{frames.length})</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 min-h-[180px] flex flex-col-reverse justify-start">
        {frames[step].stack.map((frame, i) => (
          <div
            key={i}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold border ${
              i === frames[step].stack.length - 1
                ? "bg-[#e06c53]/20 text-orange-300 border-[#e06c53]/50"
                : "bg-slate-900 text-slate-300 border-slate-700"
            }`}
          >
            Stack[{i}]: {frame}
          </div>
        ))}
      </div>

      <p className="text-xs font-medium text-slate-600 dark:text-emerald-400 bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        {frames[step].note}
      </p>
    </div>
  );
}

function CapstonePatternWidget({ onInteract }: { onInteract?: () => void }) {
  const [selectedConstraint, setSelectedConstraint] = useState(0);
  const patterns = [
    {
      limit: "N ≤ 20",
      target: "O(2^N) / O(N!)",
      algos: "Backtracking (N-Queens, Subsets), DP Bitmask",
      hint: "Kích thước nhỏ cho phép thử mọi cấu hình có tỉa nhánh.",
    },
    {
      limit: "N ≤ 1,000",
      target: "O(N²) / O(V·E)",
      algos: "DP 2D (Knapsack, LCS), Bellman-Ford",
      hint: "Vòng lặp lồng đôi hoặc bảng DP 2D chạy thoải mái < 10^6 bước.",
    },
    {
      limit: "N ≤ 100,000",
      target: "O(N log N) / O(N)",
      algos: "Quick/Merge Sort, Binary Search, Heap, Sliding Window, BFS/DFS, Dijkstra, Segment Tree, DSU",
      hint: "Tuyệt đối tránh O(N²)! Dùng Hash Table hoặc chia để trị.",
    },
    {
      limit: "N ≥ 10,000,000",
      target: "O(log N) / O(1)",
      algos: "Binary Search on Answer, Math / Bitwise / O(1) Hash",
      hint: "Không thể duyệt hết 1 vòng O(N) — chỉ có chặt đôi O(log N) hoặc công thức O(1).",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
        <Award className="w-4 h-4 text-emerald-500" />
        <span>Bản đồ Phản xạ Phỏng vấn: Chọn Thuật toán từ Ràng buộc N</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {patterns.map((p, idx) => (
          <button
            key={p.limit}
            onClick={() => {
              setSelectedConstraint(idx);
              onInteract?.();
            }}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              selectedConstraint === idx
                ? "border-emerald-500 bg-emerald-500/15"
                : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            }`}
          >
            <div className="font-mono text-xs font-bold text-emerald-500">{p.limit}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{p.target}</div>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2 text-xs">
        <div className="font-bold text-amber-400">
          Vũ khí nên dùng: <span className="text-white">{patterns[selectedConstraint].algos}</span>
        </div>
        <p className="text-slate-400">{patterns[selectedConstraint].hint}</p>
      </div>
    </div>
  );
}
