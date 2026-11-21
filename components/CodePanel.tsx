"use client";

import { useState } from "react";
import { AlgorithmCode } from "@/lib/types";
import { Copy, Check, Terminal, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodePanelProps {
  code: AlgorithmCode;
  activeLine?: number;
}

export function CodePanel({ code, activeLine }: CodePanelProps) {
  const [selectedLang, setSelectedLang] = useState<"cpp" | "python" | "typescript">("cpp");
  const [copied, setCopied] = useState(false);

  const rawCode = code[selectedLang] || "";
  const lines = rawCode.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages = [
    { id: "cpp", label: "C++", ext: ".cpp" },
    { id: "python", label: "Python", ext: ".py" },
    { id: "typescript", label: "TypeScript", ext: ".ts" },
  ] as const;

  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 overflow-hidden shadow-lg flex flex-col h-full">
      {/* Code Header: Tabs + Copy */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-400 mr-1" />
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                  selectedLang === lang.id
                    ? "bg-slate-800 text-emerald-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          title="Sao chép mã nguồn"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3 sm:p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto flex-1 select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineText, index) => {
              const lineNumber = index + 1;
              const isCurrent = activeLine === lineNumber;

              return (
                <tr
                  key={index}
                  className={cn(
                    "transition-colors duration-150 rounded",
                    isCurrent
                      ? "bg-emerald-500/15 text-emerald-300 font-semibold border-l-2 border-emerald-400"
                      : "hover:bg-slate-800/40 text-slate-300"
                  )}
                >
                  {/* Line Number */}
                  <td className="w-10 pr-3 text-right select-none text-slate-600 text-[11px] font-mono">
                    {lineNumber}
                  </td>

                  {/* Code Line Content */}
                  <td className="pl-2 pr-4 py-0.5 whitespace-pre font-mono">
                    {lineText || " "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
