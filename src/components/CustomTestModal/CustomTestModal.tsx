"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCustomTestSettings, initTest } from "@/store/testSlice";
import { generateWords } from "@/lib/wordGenerator";
import { X, Clock, HelpCircle, Settings2 } from "lucide-react";

interface CustomTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomTestModal({ isOpen, onClose }: CustomTestModalProps) {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Get active test state to populate defaults
  const testState = useSelector((state: RootState) => state.test);

  // Local configuration states
  const [duration, setDuration] = useState(60);
  const [selectedPreset, setSelectedPreset] = useState<number | "custom">(60);
  const [customDuration, setCustomDuration] = useState(30);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [capitals, setCapitals] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Sync state when modal is opened
  useEffect(() => {
    if (isOpen) {
      const activeDuration = testState.duration || 30;
      const presetMatch = [60, 120, 180, 300, 600, 900, 1200].includes(activeDuration);
      if (presetMatch) {
        setSelectedPreset(activeDuration);
      } else {
        setSelectedPreset("custom");
        setCustomDuration(activeDuration);
      }
      setDuration(activeDuration);
      setDifficulty(testState.difficulty || "easy");
      setPunctuation(testState.punctuation);
      setNumbers(testState.numbers);
      setCapitals(testState.capitals);
      setErrorText("");
    }
  }, [isOpen, testState]);

  // Trap focus and close on Escape
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

  const handleStartTest = () => {
    
    // Validation checks
    if (!duration || isNaN(duration) || duration < 5) {
      setErrorText("Duration must be at least 5 seconds.");
      return;
    }
    if (duration > 3600) {
      setErrorText("Duration cannot exceed 3600 seconds (1 hour).");
      return;
    }

    // 1. Batch set custom settings in Redux store
    dispatch(
      setCustomTestSettings({
        duration: Math.round(duration),
        difficulty,
        punctuation,
        numbers,
        capitals,
      })
    );

    // 2. Generate new words list based on custom rules
    const customWords = generateWords({
      mode: "time",
      difficulty,
      punctuation,
      numbers,
      capitals,
      wordCount: 50, // Ignored in time mode since generator yields 800 buffer words
    });

    // 3. Populate words and trigger start conditions
    dispatch(initTest(customWords));

    // 4. Dismiss modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div
        ref={modalRef}
        className="bg-clackr-bg border border-clackr-muted/20 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scaleIn font-mono"
        style={{ backgroundColor: "var(--bg-color)", color: "var(--fg-color)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-clackr-muted/10 select-none">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-bold text-clackr-fg flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-clackr-accent" />
              custom test setup
            </h2>
            <span className="text-[9px] text-clackr-muted uppercase tracking-wider">
              design your own practice mode
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
            }}
            className="p-1 rounded-lg text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          
          {/* Duration Preset Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-clackr-fg/90 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>test duration</span>
              <Clock className="w-3 h-3 text-clackr-accent" />
            </label>
            
            {/* Quick Time Presets (Minutes) */}
            <div className="grid grid-cols-4 gap-1.5 select-none">
              {[
                { label: "1m", value: 60 },
                { label: "2m", value: 120 },
                { label: "3m", value: 180 },
                { label: "5m", value: 300 },
                { label: "10m", value: 600 },
                { label: "15m", value: 900 },
                { label: "20m", value: 1200 },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    setSelectedPreset(p.value);
                    setDuration(p.value);
                    setErrorText("");
                  }}
                  className={`py-1.5 text-[10px] border rounded-lg transition-all ${
                    selectedPreset === p.value
                      ? "text-clackr-accent border-clackr-accent/40 bg-clackr-accent/15 font-extrabold shadow-sm"
                      : "text-clackr-fg/80 border-clackr-muted/20 hover:text-clackr-fg hover:bg-clackr-fg/10 font-semibold"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setSelectedPreset("custom");
                  setDuration(customDuration);
                  setErrorText("");
                }}
                className={`py-1.5 text-[10px] border rounded-lg transition-all ${
                  selectedPreset === "custom"
                    ? "text-clackr-accent border-clackr-accent/40 bg-clackr-accent/15 font-extrabold shadow-sm"
                    : "text-clackr-fg/80 border-clackr-muted/20 hover:text-clackr-fg hover:bg-clackr-fg/10 font-semibold"
                }`}
              >
                Custom
              </button>
            </div>

            {/* Custom Input field — only rendered when custom is selected */}
            {selectedPreset === "custom" && (
              <div className="flex flex-col gap-1.5 mt-2 animate-fadeIn">
                <input
                  type="number"
                  min="5"
                  max="3600"
                  value={customDuration || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setCustomDuration(val);
                    setDuration(val);
                    setErrorText("");
                  }}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-clackr-accent focus:ring-1 focus:ring-clackr-accent transition-all shadow-inner"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--fg-color)",
                    borderColor: "rgba(128, 128, 128, 0.3)"
                  }}
                  placeholder="Enter seconds (e.g. 30)"
                />
                <span className="text-[8.5px] text-clackr-fg/75 tracking-wide mt-0.5 pl-1 uppercase font-bold">
                  * custom duration is configured in seconds (5s to 3600s)
                </span>
              </div>
            )}
          </div>

          {/* Difficulty Level Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-clackr-fg/90 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <span>difficulty level</span>
              <HelpCircle className="w-3 h-3 text-clackr-fg/50" />
            </label>
            <div className="flex gap-2 select-none">
              {(["easy", "hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setDifficulty(diff);
                  }}
                  className={`flex-1 py-2 text-xs border rounded-xl capitalize transition-all ${
                    difficulty === diff
                      ? "text-clackr-accent border-clackr-accent/40 bg-clackr-accent/15 font-extrabold shadow-sm"
                      : "text-clackr-fg/80 border-clackr-muted/20 hover:text-clackr-fg hover:bg-clackr-fg/10 font-semibold"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Modifiers Grid */}
          <div className="flex flex-col gap-2 select-none">
            <label className="text-[10px] text-clackr-fg/90 uppercase font-bold tracking-wider">
              text contents modifiers
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "punctuation", label: "@ punctuation", val: punctuation, set: setPunctuation },
                { id: "numbers", label: "# numbers", val: numbers, set: setNumbers },
                { id: "capitals", label: "Aa capitals", val: capitals, set: setCapitals },
              ].map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => {
                    mod.set(!mod.val);
                  }}
                  className={`py-2 text-[10px] border rounded-xl transition-all ${
                    mod.val
                      ? "text-clackr-accent border-clackr-accent/40 bg-clackr-accent/15 font-extrabold shadow-sm"
                      : "text-clackr-fg/80 border-clackr-muted/20 hover:text-clackr-fg hover:bg-clackr-fg/10 font-semibold"
                  }`}
                >
                  {mod.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message Box */}
          {errorText && (
            <div className="text-[10px] text-clackr-error bg-clackr-error/5 border border-clackr-error/20 p-3 rounded-xl animate-fadeIn font-semibold text-center select-none">
              ⚠️ {errorText}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-clackr-muted/10 bg-clackr-fg/[0.01] flex justify-end gap-3 select-none">
          <button
            onClick={() => {
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl border border-clackr-muted/10 text-xs font-semibold text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all"
          >
            Cancel
          </button>
          
          <button
            onClick={handleStartTest}
            className="px-5 py-2.5 rounded-xl bg-clackr-accent text-clackr-bg font-extrabold text-xs shadow-md shadow-clackr-accent/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Start Custom Test
          </button>
        </div>
      </div>
    </div>
  );
}
