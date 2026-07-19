"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { finishTest } from "@/store/testSlice";
import Word from "../Word/Word";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { RotateCcw, Keyboard as KeyIcon } from "lucide-react";
import { getCharStats } from "@/lib/statsCalculator";

interface TypingAreaProps {
  onRestart: () => void;
}

export default function TypingArea({ onRestart }: TypingAreaProps) {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [localTimer, setLocalTimer] = useState(0);
  const [caretPos, setCaretPos] = useState({ left: 0, top: 0, height: 24 });

  // Granular Redux selectors to optimize rendering and prevent unnecessary keystroke re-renders
  const words = useSelector((state: RootState) => state.test.words);
  const status = useSelector((state: RootState) => state.test.status);
  const mode = useSelector((state: RootState) => state.test.mode);
  const duration = useSelector((state: RootState) => state.test.duration);
  const wordCount = useSelector((state: RootState) => state.test.wordCount);
  const startTime = useSelector((state: RootState) => state.test.startTime);
  const currentWordIndex = useSelector((state: RootState) => state.test.currentWordIndex);
  const typedWords = useSelector((state: RootState) => state.test.typedWords);
  const typedInput = useSelector((state: RootState) => state.test.typedInput);
  const wpmHistory = useSelector((state: RootState) => state.test.wpmHistory);
  const totalKeystrokes = useSelector((state: RootState) => state.test.totalKeystrokes);
  const correctKeystrokes = useSelector((state: RootState) => state.test.correctKeystrokes);

  const fontFamily = useSelector((state: RootState) => state.settings.fontFamily);
  const realtimeWpm = useSelector((state: RootState) => state.settings.realtimeWpm);
  const keyboardSize = useSelector((state: RootState) => state.settings.keyboardSize);
  const keyboardEnabled = useSelector((state: RootState) => state.settings.keyboardEnabled);

  // Live Accuracy calculation (inline to avoid closure allocation on every render)
  const liveAccuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  // Bind custom typing engine hook
  const { handleReset, handleKeyDown } = useTypingEngine(inputRef);

  // Monitor and handle container clicks to focus hidden input
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Combined scroll + caret positioning: scroll FIRST (instant), then measure caret
  useEffect(() => {
    const container = containerRef.current;

    // ── Step 1: Instant scroll to keep active word visible ──
    if (container) {
      if (currentWordIndex === 0) {
        container.scrollTop = 0;
      } else {
        const activeWordEl = container.children[currentWordIndex] as HTMLElement;
        if (activeWordEl) {
          const wordTop = activeWordEl.offsetTop;
          if (wordTop > 90) {
            container.scrollTo({ top: wordTop - 46, behavior: "auto" });
          } else {
            container.scrollTo({ top: 0, behavior: "auto" });
          }
        }
      }
    }

    // ── Step 2: Measure caret position on next frame (after scroll settles) ──
    const handleUpdateCaret = () => {
      const activeEl = container?.querySelector("#active-char") as HTMLElement;
      const wrapper = container?.parentElement; // The `relative p-2` wrapper that positions the caret
      if (!activeEl || !container || !wrapper) return;

      const activeRect = activeEl.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const leftOffset = activeRect.left - wrapperRect.left;
      const topOffset = activeRect.top - wrapperRect.top;
      const elementHeight = activeRect.height || 26;

      setCaretPos({
        left: leftOffset + 2,
        top: topOffset + 1.5,
        height: elementHeight - 4,
      });
    };

    const animId = requestAnimationFrame(handleUpdateCaret);
    window.addEventListener("resize", handleUpdateCaret);

    // Re-measure after custom fonts finish loading (prevents misalignment on refresh)
    let fontRafId: number | undefined;
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        fontRafId = requestAnimationFrame(handleUpdateCaret);
      });
    }

    return () => {
      cancelAnimationFrame(animId);
      if (fontRafId !== undefined) cancelAnimationFrame(fontRafId);
      window.removeEventListener("resize", handleUpdateCaret);
    };
  }, [typedInput, currentWordIndex, status]);

  // Re-focus helper
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Auto-focus on load or status change
  useEffect(() => {
    if (status === "idle" || status === "running") {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [status]);

  // Window-level keypress listener to capture focus if user types when blurred
  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "BUTTON")) {
        return;
      }
      
      if (
        !isFocused &&
        inputRef.current &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [isFocused]);

  // Precise local timer ticking for WPM/countdown displays
  useEffect(() => {
    if (status !== "running" || !startTime) {
      setLocalTimer(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setLocalTimer(elapsed);
    }, 200);

    return () => clearInterval(interval);
  }, [status, startTime, mode, duration, dispatch]);

  // Global keydown to focus typing area
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isFocused) return;
      
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
        return;
      }
      
      const ignoredKeys = ["Alt", "Control", "Shift", "Meta", "Escape", "Tab", "CapsLock"];
      if (ignoredKeys.includes(e.key)) return;
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isFocused]);

  // Calculate live numbers
  const displayTimer = () => {
    if (mode === "time") {
      if (status === "running") {
        return Math.max(0, duration - localTimer);
      }
      return duration;
    } else {
      if (status === "running") {
        return localTimer;
      }
      return 0;
    }
  };

  const getLiveWpm = () => {
    if (wpmHistory.length > 0) {
      return wpmHistory[wpmHistory.length - 1].wpm;
    }
    return 0;
  };

  // Dynamic height configuration based on keyboard size
  let containerHeightClass = "max-h-[145px]"; // ~4 lines (for small or no keyboard)
  
  if (keyboardEnabled) {
    if (keyboardSize === "large") {
      containerHeightClass = "max-h-[75px]"; // ~2 lines
    } else if (keyboardSize === "medium") {
      containerHeightClass = "max-h-[110px]"; // ~3 lines
    }
  }

  return (
    <div id="typing-area-container" className={`w-full flex flex-col gap-2.5 select-none relative focus:outline-none ${!keyboardEnabled ? "flex-1" : ""}`}>
      
      {/* Live Stats Dashboard */}
      <div className="flex justify-center gap-12 md:gap-20 items-center w-full max-w-2xl mx-auto pt-5 pb-1 select-none">
        {/* Column 1: WPM */}
        <div className="flex flex-col items-center min-w-[70px]">
          <span className="font-mono text-[9px] md:text-[10px] text-clackr-muted uppercase tracking-widest mb-1 leading-none">
            wpm
          </span>
          <span className="font-mono text-2xl md:text-3xl font-extrabold text-clackr-accent leading-none">
            {status === "idle" ? 0 : getLiveWpm()}
          </span>
        </div>

        {/* Column 2: Accuracy */}
        <div className="flex flex-col items-center min-w-[70px]">
          <span className="font-mono text-[9px] md:text-[10px] text-clackr-muted uppercase tracking-widest mb-1 leading-none">
            accuracy
          </span>
          <span className="font-mono text-2xl md:text-3xl font-extrabold text-clackr-fg leading-none flex items-baseline justify-center">
            {liveAccuracy}
            <span className="text-clackr-muted text-xs md:text-sm font-semibold ml-0.5">%</span>
          </span>
        </div>

        {/* Column 3: Timer */}
        <div className="flex flex-col items-center min-w-[70px]">
          <span className="font-mono text-[9px] md:text-[10px] text-clackr-muted uppercase tracking-widest mb-1 leading-none">
            {mode === "time" ? "time left" : "time"}
          </span>
          <span className="font-mono text-2xl md:text-3xl font-extrabold text-clackr-fg leading-none flex items-baseline justify-center">
            {displayTimer()}
            <span className="text-clackr-muted text-xs md:text-sm font-semibold ml-0.5">s</span>
          </span>
        </div>

        {/* Column 4: Progress (Only in words / quote modes) */}
        {(mode === "words" || mode === "quote") && (
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="font-mono text-[9px] md:text-[10px] text-clackr-muted uppercase tracking-widest mb-1 leading-none">
              progress
            </span>
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-clackr-fg leading-none flex items-baseline justify-center">
              {currentWordIndex}
              <span className="text-clackr-muted text-xs md:text-sm font-medium ml-0.5">
                /{mode === "words" ? wordCount : words.length}
              </span>
            </span>
          </div>
        )}
      </div>

      <div className={`relative w-full ${!keyboardEnabled ? "flex-1 flex flex-col justify-center" : ""}`}>
        <div
          onClick={handleContainerClick}
          className={`relative p-2 cursor-text flex items-center justify-center w-full`}
        >
          {/* Hidden Input field capturing keyboard */}
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={() => {}} // Controlled via onKeyDown for absolute character timing
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />

          {/* Words wrap box */}
          <div
            ref={containerRef}
            className={`w-full max-w-6xl mx-auto flex flex-wrap gap-x-[10px] gap-y-0 ${containerHeightClass} overflow-hidden leading-tight px-1 select-none ${fontFamily} ${!isFocused ? "blur-[3px] select-none pointer-events-none" : ""}`}
          >
            {words.map((_, idx) => (
              <Word key={idx} index={idx} />
            ))}
          </div>

          {/* Dynamic Smooth Caret — only visible while typing */}
          {isFocused && status === "running" && (
            <div 
              className="absolute w-[2.5px] bg-clackr-accent rounded-full pointer-events-none z-10"
              style={{
                left: 0,
                top: 0,
                height: `${caretPos.height}px`,
                transform: `translate3d(${caretPos.left}px, ${caretPos.top}px, 0)`,
                transition: "transform 130ms cubic-bezier(0.075, 0.82, 0.165, 1), height 100ms ease",
              }}
            />
          )}
        </div>

        {/* Restart Button Shortcut indicator */}
        <div className="flex justify-center items-center py-1">
          <button
            onClick={onRestart}
            title="Restart Test (Tab)"
            className="p-2 rounded-xl text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all flex items-center justify-center font-mono text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Blur Focus Overlay (Covers both words and restart button to prevent overlapping) */}
        {!isFocused && (
          <div 
            onClick={handleContainerClick}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-clackr-bg/80 backdrop-blur-[4px] transition-all duration-300 rounded-2xl cursor-pointer"
          >
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="p-3 rounded-full bg-clackr-accent/10 text-clackr-accent animate-bounce">
                <KeyIcon className="w-6 h-6" />
              </div>
              <p className="font-mono text-sm text-clackr-fg font-semibold">
                Click or press any key to focus typing
              </p>
              <span className="font-mono text-[10px] text-clackr-muted uppercase tracking-wider">
                typing is suspended
              </span>
              
              <div className="flex items-center gap-4 mt-2.5 font-mono text-[11px] select-none">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-clackr-fg/5 border border-clackr-muted/15 font-sans text-[10px] font-bold text-clackr-accent shadow-sm">tab</kbd>
                  <span className="text-clackr-muted">to refresh</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-clackr-fg/5 border border-clackr-muted/15 font-sans text-[10px] font-bold text-clackr-accent shadow-sm">esc</kbd>
                  <span className="text-clackr-muted">for settings</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
