"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { X, Download } from "lucide-react";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";

interface WordReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: string[];
  typedWords: string[];
}

export default function WordReviewModal({ isOpen, onClose, words, typedWords }: WordReviewModalProps) {
  const [filter, setFilter] = useState<"all" | "wrong">("all");
  const modalRef = useRef<HTMLDivElement>(null);

  // Use reusable focus trap and keyboard shortcut (Escape) hook
  useModalFocusTrap(isOpen, onClose, modalRef);

  // Process words array memoized to prevent re-mapping on filter toggle
  const processedWords = useMemo(() => {
    return words
      .map((word, i) => {
        const typed = typedWords[i];
        const hasTyped = i < typedWords.length;
        const isCorrect = hasTyped && typed === word;
        return {
          word,
          typed: typed || "",
          hasTyped,
          isCorrect,
        };
      })
      .filter((w) => w.hasTyped); // Only show words they actually attempted
  }, [words, typedWords]);

  const correctCount = useMemo(() => processedWords.filter((w) => w.isCorrect).length, [processedWords]);
  const wrongCount = useMemo(() => processedWords.filter((w) => !w.isCorrect).length, [processedWords]);
  const notReachedCount = useMemo(() => Math.max(0, words.length - typedWords.length), [words.length, typedWords.length]);

  const displayedWords = useMemo(() => {
    return filter === "all" ? processedWords : processedWords.filter((w) => !w.isCorrect);
  }, [filter, processedWords]);

  const handleDownload = useCallback(() => {
    // Generate text report
    let report = `CLACKR WORD REVIEW REPORT\n`;
    report += `-------------------------\n`;
    report += `Correct Words: ${correctCount}\n`;
    report += `Incorrect Words: ${wrongCount}\n`;
    report += `Not Reached: ${notReachedCount}\n\n`;
    report += `DETAILED BREAKDOWN:\n`;

    processedWords.forEach((w, idx) => {
      report += `${idx + 1}. [${w.isCorrect ? "CORRECT" : "WRONG"}] Expected: "${w.word}" | Typed: "${w.typed}"\n`;
    });

    const blob = new Blob([report], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "clackr-word-review.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [correctCount, wrongCount, notReachedCount, processedWords]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-review-title"
    >
      <div 
        ref={modalRef} 
        className="relative w-full max-w-3xl bg-clackr-bg border border-clackr-muted/20 rounded-2xl p-6 shadow-2xl animate-scaleUp text-clackr-fg"
      >
        <button 
          type="button"
          onClick={onClose} 
          aria-label="Close word review modal"
          className="absolute top-4 right-4 text-clackr-muted hover:text-clackr-fg transition-colors duration-150 p-1 rounded-lg hover:bg-clackr-fg/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex justify-between items-center border-b border-clackr-muted/10 pb-4 mb-4 select-none">
          <div>
            <h2 id="word-review-title" className="text-clackr-fg font-mono text-xl font-bold">
              Word Review
            </h2>
            <p className="text-xs text-clackr-fg/60 font-mono mt-0.5">
              {correctCount}/{processedWords.length} correct
            </p>
          </div>
          <div className="flex gap-3 text-xs font-mono">
            <button 
              type="button"
              onClick={handleDownload} 
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-clackr-muted/20 hover:border-clackr-fg text-clackr-fg/80 hover:text-clackr-fg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <div className="py-1.5 px-3 rounded-lg bg-clackr-fg/5 text-clackr-muted select-none">
              {notReachedCount} not reached
            </div>
          </div>
        </div>

        {/* Toggle Filters */}
        <div className="flex items-center gap-4 mb-6 select-none font-mono text-sm">
          <span className="text-clackr-fg font-semibold flex items-center gap-1.5">
            <span className="text-clackr-correct">{correctCount} correct</span>
            <span className="text-clackr-error">{wrongCount} wrong</span>
          </span>
          <div className="flex gap-1.5 ml-auto" role="toolbar" aria-label="Word review filter options">
            <button 
              type="button"
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")} 
              className={`py-1 px-3.5 rounded-lg border transition-all text-xs ${
                filter === "all" 
                  ? "bg-clackr-accent text-clackr-bg border-clackr-accent font-bold" 
                  : "border-clackr-muted/20 text-clackr-fg/60 hover:text-clackr-fg"
              }`}
            >
              All
            </button>
            <button 
              type="button"
              aria-pressed={filter === "wrong"}
              onClick={() => setFilter("wrong")} 
              className={`py-1 px-3.5 rounded-lg border transition-all text-xs ${
                filter === "wrong" 
                  ? "bg-clackr-accent text-clackr-bg border-clackr-accent font-bold" 
                  : "border-clackr-muted/20 text-clackr-fg/60 hover:text-clackr-fg"
              }`}
            >
              Wrong Only
            </button>
          </div>
        </div>

        {/* Word Pills Area */}
        <div className="w-full max-h-72 overflow-y-auto pr-1 flex flex-wrap gap-2.5 p-3 rounded-xl bg-clackr-fg/[0.02] border border-clackr-muted/5">
          {displayedWords.map((w, idx) => (
            <div 
              key={`${w.word}-${idx}`} 
              className={`px-3 py-1 rounded-lg border text-sm font-mono flex flex-col items-center group relative cursor-help transition-all ${
                w.isCorrect 
                  ? "border-clackr-correct/30 text-clackr-correct bg-clackr-correct/5" 
                  : "border-clackr-error/30 text-clackr-error bg-clackr-error/5"
              }`}
              title={w.isCorrect ? "Correct" : `Expected: "${w.word}" | Typed: "${w.typed}"`}
            >
              <span>{w.word}</span>
              {!w.isCorrect && (
                <span className="text-[10px] opacity-75 line-through decoration-clackr-error/40 mt-0.5">
                  {w.typed}
                </span>
              )}
            </div>
          ))}
          {displayedWords.length === 0 && (
            <div className="w-full text-center py-10 font-mono text-clackr-muted text-sm select-none">
              No incorrect words to review! Good job!
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono text-clackr-muted mt-6 border-t border-clackr-muted/10 pt-4 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-clackr-correct/25 border border-clackr-correct/40" />
            <span>correct</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-clackr-error/25 border border-clackr-error/40" />
            <span>wrong / extra</span>
          </span>
        </div>

      </div>
    </div>
  );
}
