"use client";

import { cn } from "@/lib/utils";

interface ComplexityBadgeProps {
  label: string;
  value: string;
  type?: "time" | "space";
  className?: string;
}

export function ComplexityBadge({ label, value, type = "time", className }: ComplexityBadgeProps) {
  // Determine color based on big-O rating
  let colorClass = "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";

  if (value.includes("O(1)") || value.includes("O(log")) {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60";
  } else if (value.includes("O(N)") && !value.includes("O(N²)") && !value.includes("O(N log")) {
    colorClass = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60";
  } else if (value.includes("O(N log N)")) {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60";
  } else if (value.includes("O(N²)") || value.includes("O(2^N)")) {
    colorClass = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60";
  } else if (value.includes("V + E")) {
    colorClass = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium shadow-sm",
        colorClass,
        className
      )}
    >
      <span className="text-[10px] font-sans uppercase font-bold tracking-wider opacity-70">
        {label}:
      </span>
      <span>{value}</span>
    </div>
  );
}
