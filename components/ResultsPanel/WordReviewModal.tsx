"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Download } from "lucide-react";

interface WordReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: string[];
  typedWords: string[];
}

export default function WordReviewModal({ isOpen, onClose, words, typedWords }: WordReviewModalProps) {
  const [filter, setFilter] = useState<"all" | "wrong">("all");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Process words
  const processedWords = words
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

  const correctCount = processedWords.filter((w) => w.isCorrect).length;
  const wrongCount = processedWords.filter((w) => !w.isCorrect).length;
  const notReachedCount = Math.max(0, words.length - typedWords.length);

  const displayedWords = filter === "all" ? processedWords : processedWords.filter((w) => !w.isCorrect);

  const handleDownload = () => {
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
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div ref={modalRef} className="relative w-full max-w-3xl bg-clackr-bg border border-clackr-muted/20 rounded-2xl p-6 shadow-2xl animate-scaleUp">
        
        <button 
          onClick={onClose} 
          aria-label="Close word review modal"
          className="absolute top-4 right-4 text-clackr-muted hover:text-clackr-fg transition-colors duration-150"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex justify-between items-center border-b border-clackr-muted/10 pb-4 mb-4 select-none">
          <div>
            <h2 className="text-clackr-fg font-mono text-xl font-bold">Word Review</h2>
            <p className="text-xs text-clackr-fg/60 font-mono mt-0.5">
              {correctCount}/{processedWords.length} correct
            </p>
          </div>
          <div className="flex gap-3 text-xs font-mono">
            <button 
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
          <div className="flex gap-1.5 ml-auto">
            <button 
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
              key={idx} 
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
