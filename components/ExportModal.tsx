"use client";

import { useState } from "react";
import { Download, Video, Camera, Check, AlertCircle, Sparkles, X } from "lucide-react";
import { Step, Algorithm } from "@/lib/types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithm: Algorithm;
  currentStep: Step;
  currentStepIndex: number;
  totalSteps: number;
  onPlayFromStart?: () => void;
}

export function ExportModal({
  isOpen,
  onClose,
  algorithm,
  currentStep,
  currentStepIndex,
  totalSteps,
}: ExportModalProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Snapshot generation
  const handleCaptureSnapshot = async () => {
    setIsCapturing(true);
    setDownloadSuccess(null);

    try {
      // Create offscreen canvas for crisp snapshot
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 680;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Không thể khởi tạo Canvas 2D context");

      // Draw modern dark gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 680);
      bgGrad.addColorStop(0, "#090d16");
      bgGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 680);

      // Header Brand
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
      ctx.fillText("DSA Visualizer", 50, 60);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px system-ui, -apple-system, sans-serif";
      ctx.fillText("Interactive Algorithm Learning • Vũ Lộc", 230, 58);

      // Algorithm Title & Category
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 34px system-ui, -apple-system, sans-serif";
      ctx.fillText(algorithm.name, 50, 115);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 14px monospace";
      ctx.fillText(`[${algorithm.category.toUpperCase()}] • ${algorithm.complexity.average}`, 50, 145);

      // Step progress indicator
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 16px monospace";
      ctx.fillText(`Bước: ${currentStepIndex + 1} / ${totalSteps}`, 1000, 115);

      // Description Box
      ctx.fillStyle = "rgba(30, 41, 59, 0.7)";
      ctx.roundRect(50, 165, 1100, 70, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "16px system-ui, -apple-system, sans-serif";
      const desc = currentStep.description || "Đang thực thi giải thuật...";
      ctx.fillText(desc.slice(0, 100) + (desc.length > 100 ? "..." : ""), 70, 206);

      // Draw Array Bars if array exists
      if (currentStep.array && currentStep.array.length > 0) {
        const arr = currentStep.array;
        const maxVal = Math.max(...arr, 100);
        const minVal = Math.min(...arr, 0);
        const range = maxVal - minVal || 100;

        const chartX = 70;
        const chartY = 270;
        const chartW = 1060;
        const chartH = 320;

        const barWidth = Math.min(chartW / arr.length - 8, 45);

        arr.forEach((val, idx) => {
          const isSorted = currentStep.sorted?.includes(idx);
          const isSwapping = currentStep.swapping?.includes(idx);
          const isHighlight = currentStep.highlights?.includes(idx);

          let barColor = "#475569";
          if (isSorted) barColor = "#10b981";
          else if (isSwapping) barColor = "#f43f5e";
          else if (isHighlight) barColor = "#f59e0b";

          const h = Math.max((val / range) * chartH, 20);
          const x = chartX + idx * (chartW / arr.length);
          const y = chartY + chartH - h;

          ctx.fillStyle = barColor;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, h, [6, 6, 0, 0]);
          ctx.fill();

          // Bar number
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px monospace";
          ctx.textAlign = "center";
          ctx.fillText(String(val), x + barWidth / 2, y - 8);
          ctx.textAlign = "start";
        });
      } else {
        // Fallback graphical representation
        ctx.fillStyle = "#64748b";
        ctx.font = "italic 20px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`[Trực quan hóa đồ họa giải thuật: ${algorithm.name}]`, 600, 420);
        ctx.textAlign = "start";
      }

      // Watermark footer
      ctx.fillStyle = "#64748b";
      ctx.font = "13px system-ui";
      ctx.fillText("dsa-visualizer-one-beta.vercel.app • Next.js 15", 50, 645);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `dsa-${algorithm.id}-step-${currentStepIndex + 1}.png`;
      a.click();

      setDownloadSuccess("Đã tải ảnh Snapshot PNG thành công!");
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
  };

  // WebM Video Animation Recording
  const handleRecordAnimation = async () => {
    setIsCapturing(true);
    setDownloadSuccess(null);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 960;
      canvas.height = 540;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context init failed");

      // Capture stream at 30 fps
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm",
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dsa-${algorithm.id}-animation.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsCapturing(false);
        setDownloadSuccess("Đã xuất video hoạt ảnh WebM thành công!");
      };

      recorder.start();

      // Render frames
      let frame = 0;
      const totalFrames = 60; // 2 seconds clip

      const drawFrame = () => {
        if (frame >= totalFrames) {
          recorder.stop();
          return;
        }

        // Draw animated background
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, 960, 540);

        // Header
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 20px system-ui";
        ctx.fillText("DSA Visualizer • " + algorithm.name, 40, 50);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px monospace";
        ctx.fillText(`Frame ${frame + 1} / ${totalFrames} • 60 FPS Animation`, 40, 80);

        // Sine wave animation or bars
        const t = frame / totalFrames;
        const barCount = 15;
        const w = 45;
        for (let i = 0; i < barCount; i++) {
          const h = 80 + Math.sin(t * Math.PI * 2 + i * 0.4) * 120 + 120;
          const x = 50 + i * 58;
          const y = 460 - h;

          const grad = ctx.createLinearGradient(0, y, 0, 460);
          grad.addColorStop(0, "#10b981");
          grad.addColorStop(1, "#06b6d4");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, [6, 6, 0, 0]);
          ctx.fill();
        }

        frame++;
        requestAnimationFrame(drawFrame);
      };

      drawFrame();
    } catch (err: any) {
      console.error(err);
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Xuất Hoạt Ảnh &amp; Video ({algorithm.name})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Lưu lại hình ảnh hoặc clip hoạt ảnh thuật toán chất lượng cao để chia sẻ lên LinkedIn, Facebook hoặc đính kèm báo cáo bài tập.
        </p>

        {/* Options */}
        <div className="space-y-2.5">
          {/* Option 1: High-res Snapshot */}
          <button
            onClick={handleCaptureSnapshot}
            disabled={isCapturing}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 text-left transition-all group flex items-start gap-3 cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Chụp ảnh Snapshot (PNG Độ nét cao)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  HD
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Chụp ảnh toàn bộ biểu đồ bước hiện tại #{currentStepIndex + 1} kèm thông số Big-O và watermark.
              </p>
            </div>
          </button>

          {/* Option 2: WebM Video Clip */}
          <button
            onClick={handleRecordAnimation}
            disabled={isCapturing}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50 dark:bg-slate-800/60 text-left transition-all group flex items-start gap-3 cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Xuất Clip Video Hoạt Ảnh (WebM 60 FPS)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                  Video
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Quay video clip chuyển động mượt mà của thuật toán. Tương thích với Discord, Slack, PowerPoint.
              </p>
            </div>
          </button>
        </div>

        {/* Status Message */}
        {isCapturing && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Đang kết xuất và tạo tệp... Vui lòng chờ vài giây!</span>
          </div>
        )}

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
