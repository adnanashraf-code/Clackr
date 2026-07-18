"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Play, RotateCcw } from "lucide-react";
import { useDispatch } from "react-redux";
import { initTest, setMode, setWordCount } from "@/store/testSlice";

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  thisTestWrongWords: string[];
}

export default function PracticeModal({ isOpen, onClose, thisTestWrongWords }: PracticeModalProps) {
  const dispatch = useDispatch();
  const [source, setSource] = useState<"this" | "allTime">("this");
  const [allTimeWrongWords, setAllTimeWrongWords] = useState<string[]>([]);
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

  // Load all time wrong words on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("clackr_practice_words");
      if (saved) {
        try {
          setAllTimeWrongWords(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentWords = source === "this" ? thisTestWrongWords : allTimeWrongWords;

  // Mastery formula: Math.max(0, Math.round(100 - currentWords.length * 1.8))
  const mastery = Math.max(0, Math.round(100 - currentWords.length * 1.8));

  const handleReset = () => {
    if (source === "this") {
      // For this test, just clear local state array (prop is read-only)
      alert("Cannot reset current test results. Switch to 'all-time' to reset cumulative history.");
    } else {
      if (confirm("Are you sure you want to clear your all-time practice words history?")) {
        localStorage.removeItem("clackr_practice_words");
        setAllTimeWrongWords([]);
      }
    }
  };

  const handleStart = () => {
    if (currentWords.length === 0) {
      alert("No words to practice!");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div ref={modalRef} className="relative w-full max-w-xl bg-clackr-bg border border-clackr-muted/20 rounded-2xl p-6 shadow-2xl animate-scaleUp">
        
        <button 
          onClick={onClose} 
          aria-label="Close practice modal"
          className="absolute top-4 right-4 text-clackr-muted hover:text-clackr-fg transition-colors duration-150"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-clackr-fg font-mono text-xl font-bold mb-4 select-none">Practice Words</h2>

        {/* Source Toggles */}
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-[10px] text-clackr-accent font-mono uppercase tracking-wider select-none font-bold">Source</span>
          <div className="flex gap-2">
            <button 
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
              <span key={i}>
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
