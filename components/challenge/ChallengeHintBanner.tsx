"use client";

import { AlertCircle, CheckCircle2, HelpCircle, Sparkles, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChallengeFeedback } from "@/lib/challenge";

interface ChallengeHintBannerProps {
  prompt: string;
  feedback: ChallengeFeedback | null;
  activeHint: string | null;
}

export function ChallengeHintBanner({ prompt, feedback, activeHint }: ChallengeHintBannerProps) {
  return (
    <div className="space-y-2">
      {/* Task Prompt Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>{prompt}</span>
        </div>
      </div>

      {/* Immediate Action Feedback Alert */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback.message}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 shadow-md ${
              feedback.type === "success"
                ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-200"
                : feedback.type === "error"
                ? "bg-rose-950/70 border-rose-500/50 text-rose-200 animate-shake"
                : "bg-slate-900 border-slate-700 text-slate-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : feedback.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{feedback.message}</p>
              {feedback.hint && <p className="mt-1 text-slate-300 opacity-90">{feedback.hint}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Hint Alert */}
      <AnimatePresence>
        {activeHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">{activeHint}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
