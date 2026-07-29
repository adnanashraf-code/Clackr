"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, Play, RotateCcw } from "lucide-react";
import { useDispatch } from "react-redux";
import { initTest, setMode, setWordCount } from "@/store/testSlice";
import { useToast } from "@/components/Toast/ToastContext";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  thisTestWrongWords: string[];
}

export default function PracticeModal({ isOpen, onClose, thisTestWrongWords }: PracticeModalProps) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [source, setSource] = useState<"this" | "allTime">("this");
  const [allTimeWrongWords, setAllTimeWrongWords] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Use reusable focus trap and keyboard shortcut (Escape) hook
  useModalFocusTrap(isOpen, onClose, modalRef);

  // Load all-time wrong words when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("clackr_practice_words");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setAllTimeWrongWords(parsed);
          }
        } catch (e) {
          console.error("Failed to parse practice words from localStorage:", e);
        }
      }
    }
  }, [isOpen]);

  const currentWords = useMemo(() => {
    return source === "this" ? thisTestWrongWords : allTimeWrongWords;
  }, [source, thisTestWrongWords, allTimeWrongWords]);

  // Mastery formula: Math.max(0, Math.round(100 - currentWords.length * 1.8))
  const mastery = useMemo(() => {
    return Math.max(0, Math.round(100 - currentWords.length * 1.8));
  }, [currentWords.length]);

  if (!isOpen) return null;

  const handleReset = () => {
    if (source === "this") {
      toast.info("Cannot reset current test results. Switch to 'all-time' to reset cumulative history.");
    } else {
      toast.confirm({
        title: "Clear Practice Words",
        message: "Are you sure you want to clear your all-time practice words history?",
        confirmText: "Yes, Clear Words",
        onConfirm: () => {
          try {
            localStorage.removeItem("clackr_practice_words");
          } catch (e) {
            console.error("Failed to clear localStorage:", e);
          }
          setAllTimeWrongWords([]);
          toast.success("Practice words history cleared.");
        },
      });
    }
  };

  const handleStart = () => {
    if (currentWords.length === 0) {
      toast.warning("No words to practice!");
      return;
    }

    // Initialize test with practice words
    // Generate a list of at least 25 words by repeating if list is short
    let practiceList = [...currentWords];
    while (practiceList.length < 25) {
      practiceList = [...practiceList, ...currentWords];
    }

    // Cap at 50 words to prevent excessive test length
    practiceList = practiceList.slice(0, 50);

    dispatch(initTest(practiceList));
    dispatch(setMode("words"));
    dispatch(setWordCount(practiceList.length));
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="practice-modal-title"
    >
      <div 
        ref={modalRef} 
        className="relative w-full max-w-xl bg-clackr-bg border border-clackr-muted/20 rounded-2xl p-6 shadow-2xl animate-scaleUp text-clackr-fg"
      >
        <button 
          type="button"
          onClick={onClose} 
          aria-label="Close practice modal"
          className="absolute top-4 right-4 text-clackr-muted hover:text-clackr-fg transition-colors duration-150 p-1 rounded-lg hover:bg-clackr-fg/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 id="practice-modal-title" className="text-clackr-fg font-mono text-xl font-bold mb-4 select-none">
          Practice Words
        </h2>

        {/* Source Toggles */}
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-[10px] text-clackr-accent font-mono uppercase tracking-wider select-none font-bold">
            Source
          </span>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setSource("this")} 
              className={`py-1.5 px-4 rounded-lg border font-mono text-xs transition-all ${
                source === "this" 
                  ? "bg-clackr-accent text-clackr-bg border-clackr-accent font-bold" 
                  : "border-clackr-muted/20 text-clackr-fg/60 hover:text-clackr-fg"
              }`}
            >
              this test
            </button>
            <button 
              type="button"
              onClick={() => setSource("allTime")} 
              className={`py-1.5 px-4 rounded-lg border font-mono text-xs transition-all ${
                source === "allTime" 
                  ? "bg-clackr-accent text-clackr-bg border-clackr-accent font-bold" 
                  : "border-clackr-muted/20 text-clackr-fg/60 hover:text-clackr-fg"
              }`}
            >
              all-time
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-clackr-fg/60 font-sans leading-relaxed mb-6 select-none">
          Your most-missed and slowest words across every test. Words drop off once you type them cleanly a few times in a row.
        </p>

        {/* Mastery and Tracked Words Stats card */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-clackr-muted/15 bg-clackr-fg/[0.02] mb-6 select-none font-mono">
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-clackr-fg">{mastery}%</span>
              <span className="text-[10px] text-clackr-muted uppercase tracking-wider mt-0.5">mastery</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-clackr-fg">{currentWords.length}</span>
              <span className="text-[10px] text-clackr-muted uppercase tracking-wider mt-0.5">tracked words</span>
            </div>
          </div>
          {currentWords.length > 0 && (
            <button 
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-[10px] text-clackr-muted hover:text-clackr-error transition-all uppercase font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Words selected display list */}
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-[10px] text-clackr-muted font-mono uppercase tracking-wider select-none">
            {currentWords.length} Words Selected
          </span>
          <div className="w-full h-24 overflow-y-auto pr-1 p-3 rounded-lg border border-clackr-muted/10 bg-clackr-fg/[0.01] text-xs font-mono text-clackr-fg/70 leading-loose">
            {currentWords.map((word, i) => (
              <span key={`${word}-${i}`}>
                {word}
                {i < currentWords.length - 1 && <span className="mx-2 opacity-40">•</span>}
              </span>
            ))}
            {currentWords.length === 0 && (
              <div className="text-center py-6 text-clackr-muted select-none">
                No tracked words! You have 100% mastery!
              </div>
            )}
          </div>
        </div>

        {/* Start Button */}
        <button 
          type="button"
          onClick={handleStart}
          disabled={currentWords.length === 0}
          className={`w-full py-3 rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            currentWords.length > 0
              ? "bg-clackr-accent text-clackr-bg hover:brightness-110 shadow-lg shadow-clackr-accent/20 cursor-pointer"
              : "bg-clackr-fg/10 text-clackr-muted cursor-not-allowed"
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>start</span>
        </button>

      </div>
    </div>
  );
}
