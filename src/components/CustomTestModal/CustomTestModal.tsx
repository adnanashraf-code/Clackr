"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCustomTestSettings, initTest } from "@/store/testSlice";
import { generateWords } from "@/lib/wordGenerator";
import { X, Clock, HelpCircle, Settings2 } from "lucide-react";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";

interface CustomTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_DURATIONS = [
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
  { label: "3m", value: 180 },
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
  { label: "15m", value: 900 },
  { label: "20m", value: 1200 },
];

export default function CustomTestModal({ isOpen, onClose }: CustomTestModalProps) {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Get active test state to populate defaults
  const testState = useSelector((state: RootState) => state.test);

  // Local configuration states
  const [duration, setDuration] = useState<number>(60);
  const [selectedPreset, setSelectedPreset] = useState<number | "custom">(60);
  const [customDuration, setCustomDuration] = useState<number | "">(30);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [punctuation, setPunctuation] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<boolean>(false);
  const [capitals, setCapitals] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  // Use reusable focus trap and keyboard shortcut (Escape) hook
  useModalFocusTrap(isOpen, onClose, modalRef);

  // Sync state when modal is opened (only when isOpen transitions to true)
  useEffect(() => {
    if (isOpen) {
      const activeDuration = testState.duration || 30;
      const isPreset = PRESET_DURATIONS.some((p) => p.value === activeDuration);
      if (isPreset) {
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
  }, [isOpen]); // Only sync when modal opens to prevent overwriting active user edits

  if (!isOpen) return null;

  const handleStartTest = () => {
    const finalDuration = selectedPreset === "custom" 
      ? (typeof customDuration === "number" ? customDuration : 0)
      : duration;

    // Validation checks
    if (!finalDuration || isNaN(finalDuration) || finalDuration < 5) {
      setErrorText("Duration must be at least 5 seconds.");
      return;
    }
    if (finalDuration > 3600) {
      setErrorText("Duration cannot exceed 3600 seconds (1 hour).");
      return;
    }

    // 1. Batch set custom settings in Redux store
    dispatch(
      setCustomTestSettings({
        duration: Math.round(finalDuration),
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
      wordCount: 50, // Ignored in time mode since generator yields buffer words
    });

    // 3. Populate words and trigger start conditions
    dispatch(initTest(customWords));

    // 4. Dismiss modal
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-test-title"
    >
      <div
        ref={modalRef}
        className="bg-clackr-bg border border-clackr-muted/20 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scaleIn font-mono text-clackr-fg"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-clackr-muted/10 select-none">
          <div className="flex flex-col gap-0.5">
            <h2 id="custom-test-title" className="text-base font-bold text-clackr-fg flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-clackr-accent" />
              custom test setup
            </h2>
            <span className="text-[9px] text-clackr-muted uppercase tracking-wider">
              design your own practice mode
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all duration-200"
            aria-label="Close custom test setup modal"
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
            
            {/* Quick Time Presets */}
            <div className="grid grid-cols-4 gap-1.5 select-none">
              {PRESET_DURATIONS.map((p) => (
                <button
                  key={p.value}
                  type="button"
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
                type="button"
                onClick={() => {
                  setSelectedPreset("custom");
                  if (typeof customDuration === "number" && customDuration > 0) {
                    setDuration(customDuration);
                  } else {
                    setCustomDuration(30);
                    setDuration(30);
                  }
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
                  value={customDuration}
                  onChange={(e) => {
                    const rawVal = e.target.value;
                    if (rawVal === "") {
                      setCustomDuration("");
                      setDuration(0);
                    } else {
                      const parsed = parseInt(rawVal, 10);
                      const val = isNaN(parsed) ? 0 : parsed;
                      setCustomDuration(val);
                      setDuration(val);
                    }
                    setErrorText("");
                  }}
                  className="w-full border border-clackr-muted/30 bg-clackr-bg text-clackr-fg rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-clackr-accent focus:ring-1 focus:ring-clackr-accent transition-all shadow-inner"
                  placeholder="Enter seconds (e.g. 30)"
                  aria-label="Custom duration in seconds"
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
                  type="button"
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
                  type="button"
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
            <div 
              className="text-[10px] text-clackr-error bg-clackr-error/5 border border-clackr-error/20 p-3 rounded-xl animate-fadeIn font-semibold text-center select-none"
              role="alert"
            >
              ⚠️ {errorText}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-clackr-muted/10 bg-clackr-fg/[0.01] flex justify-end gap-3 select-none">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-clackr-muted/10 text-xs font-semibold text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all"
          >
            Cancel
          </button>
          
          <button
            type="button"
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
