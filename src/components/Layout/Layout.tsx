"use client";

import React, { useState, useEffect, useRef } from "react";
import { Keyboard, Settings, History, Menu, Clock, Volume2, VolumeX, Palette } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleKeyboard, toggleSound, setTheme, SettingsState } from "@/store/settingsSlice";
import {
  togglePunctuation,
  toggleNumbers,
  toggleCapitals,
  setDifficulty,
  setMode,
  setDuration,
  setWordCount,
} from "@/store/testSlice";
import TestConfig from "../TestConfig/TestConfig";

interface LayoutProps {
  children: React.ReactNode;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenCustomTest?: () => void;
  onClickLogo?: () => void;
  scrollable?: boolean;
}

const THEMES: Array<SettingsState["theme"]> = [
  "midnight",
  "carbon",
  "serika",
  "nord",
  "sakura",
  "monokai",
];

const PRESET_DURATIONS_LIST = [15, 30, 60, 120];
const PRESET_WORDS_LIST = [10, 25, 50, 100];
const MODES_LIST = ["time", "words", "quote", "zen", "code"] as const;
const DIFFICULTIES_LIST = ["easy", "hard"] as const;

export default function Layout({
  children,
  onOpenSettings,
  onOpenHistory,
  onOpenCustomTest,
  onClickLogo,
  scrollable = false,
}: LayoutProps) {
  const dispatch = useDispatch();
  const { keyboardEnabled, soundEnabled } = useSelector((state: RootState) => state.settings);
  const { status, mode, duration, wordCount, difficulty, punctuation, numbers, capitals } = useSelector(
    (state: RootState) => state.test
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeTheme = useSelector((state: RootState) => state.settings.theme);
  const [prevTheme, setPrevTheme] = useState(activeTheme);
  const [transitionOverlay, setTransitionOverlay] = useState<{
    oldTheme: string;
    x: number;
    y: number;
  } | null>(null);

  // Close mobile dropdown menu on click outside or Escape key press
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  // Monitor theme change state to run a smooth custom reveal overlay fallback when native SVT is not supported
  useEffect(() => {
    if (activeTheme !== prevTheme) {
      setPrevTheme(activeTheme);
      
      const hasSVT = typeof document !== "undefined" && (document as any).startViewTransition;

      if (!hasSVT) {
        let clickX = window.innerWidth / 2;
        let clickY = window.innerHeight / 2;

        const cssX = document.documentElement.style.getPropertyValue("--click-x");
        const cssY = document.documentElement.style.getPropertyValue("--click-y");
        if (cssX) clickX = parseFloat(cssX);
        if (cssY) clickY = parseFloat(cssY);

        setTransitionOverlay({
          oldTheme: prevTheme,
          x: clickX,
          y: clickY,
        });

        const timer = setTimeout(() => {
          setTransitionOverlay(null);
        }, 650);

        return () => clearTimeout(timer);
      }
    }
  }, [activeTheme, prevTheme]);

  return (
    <div className="min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col max-w-none w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 font-sans">
      {/* Header */}
      <header className="flex flex-row justify-between items-center py-2.5 md:py-6 gap-x-2 md:gap-x-4 border-b border-clackr-muted/5 relative select-none w-full">
        
        {/* Left Side: Flat Logo */}
        <div 
          onClick={onClickLogo}
          className="flex items-center gap-2 cursor-pointer select-none text-clackr-muted hover:text-clackr-fg transition-colors duration-200"
          title="Start a new typing test"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClickLogo?.();
            }
          }}
        >
          <Keyboard className="w-5 h-5 text-clackr-accent" />
          <span className="font-mono text-xl font-bold tracking-tight text-clackr-fg leading-none">
            clack<span className="text-clackr-accent font-extrabold font-mono">r</span>
          </span>
        </div>

        {/* Center: Configuration Options or Results Dashboard Header */}
        <div className="hidden md:flex md:flex-1 justify-center min-w-0">
          {status !== "finished" ? (
            <TestConfig onOpenCustomTest={onOpenCustomTest} />
          ) : (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-clackr-accent/15 bg-clackr-accent/5 text-xs font-mono tracking-widest text-clackr-accent uppercase font-bold shadow-sm animate-fadeIn">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clackr-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-clackr-accent"></span>
              </span>
              <span>performance report</span>
            </div>
          )}
        </div>

        {/* Right Side: Grouped Toolbar Controls */}
        <div className="flex items-center justify-end gap-2.5 relative">
          {/* Desktop Toolbar (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-0.5 bg-clackr-fg/[0.03] border border-clackr-muted/10 p-1 rounded-xl shadow-sm" role="toolbar" aria-label="Quick actions toolbar">
            <button
              type="button"
              onClick={() => dispatch(toggleKeyboard())}
              title="Toggle Keyboard View (K)"
              aria-label="Toggle keyboard view"
              aria-pressed={keyboardEnabled}
              className={`p-1.5 rounded-lg transition-all ${
                keyboardEnabled 
                  ? "text-clackr-accent bg-clackr-accent/10 hover:bg-clackr-accent/20" 
                  : "text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5"
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenHistory}
              title="View History"
              aria-label="View typing test history"
              className="p-1.5 rounded-lg text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all duration-200"
            >
              <History className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              title="Settings (Esc)"
              aria-label="Open settings menu"
              className="p-1.5 rounded-lg text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all duration-200"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Quick Action Buttons (Separate Individual Boxes: Theme -> Time -> Sound -> Menu) */}

          {/* 1. Theme Button Box */}
          <button
            type="button"
            onClick={(e) => {
              const currentIdx = THEMES.indexOf(activeTheme);
              const nextTheme = THEMES[(currentIdx + 1) % THEMES.length];

              const rect = e.currentTarget.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              document.documentElement.style.setProperty("--click-x", `${x}px`);
              document.documentElement.style.setProperty("--click-y", `${y}px`);

              const hasSVT = typeof document !== "undefined" && (document as any).startViewTransition;
              if (hasSVT) {
                (document as any).startViewTransition(() => {
                  dispatch(setTheme(nextTheme));
                });
              } else {
                dispatch(setTheme(nextTheme));
              }
            }}
            title={`Theme: ${activeTheme}`}
            aria-label="Cycle theme"
            className="md:hidden p-2 rounded-xl bg-clackr-fg/[0.03] border border-clackr-muted/10 text-clackr-muted hover:text-clackr-fg transition-all shadow-sm active:scale-95"
          >
            <Palette className="w-4 h-4 text-clackr-accent" />
          </button>

          {/* 2. Time Selector Button Box */}
          <button
            type="button"
            onClick={() => {
              if (mode !== "time") {
                dispatch(setMode("time"));
                dispatch(setDuration(30));
              } else {
                const nextIdx = (PRESET_DURATIONS_LIST.indexOf(duration) + 1) % PRESET_DURATIONS_LIST.length;
                dispatch(setDuration(PRESET_DURATIONS_LIST[nextIdx]));
              }
            }}
            title={`Time Limit: ${mode === "time" ? `${duration}s` : "30s"}`}
            aria-label="Change time limit"
            className="md:hidden p-2 rounded-xl bg-clackr-fg/[0.03] border border-clackr-muted/10 text-clackr-muted hover:text-clackr-fg transition-all shadow-sm active:scale-95"
          >
            <Clock className="w-4 h-4 text-clackr-accent" />
          </button>

          {/* 3. Sound Toggle Button Box */}
          <button
            type="button"
            onClick={() => dispatch(toggleSound())}
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            aria-label="Toggle sound"
            aria-pressed={soundEnabled}
            className={`md:hidden p-2 rounded-xl border transition-all shadow-sm active:scale-95 ${
              soundEnabled 
                ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10" 
                : "text-clackr-muted border-clackr-muted/10 bg-clackr-fg/[0.03] hover:text-clackr-fg"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* 4. Hamburger Menu Button Box */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            className={`md:hidden p-2 rounded-xl border transition-all shadow-sm active:scale-95 ${
              isMenuOpen
                ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10"
                : "text-clackr-muted border-clackr-muted/10 bg-clackr-fg/[0.03] hover:text-clackr-fg"
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Mobile Quick Configuration & Menu Dropdown (Visible on Mobile only) */}
          {isMenuOpen && (
            <div 
              ref={menuRef}
              className="absolute right-0 top-full mt-2.5 w-60 bg-clackr-bg border border-clackr-muted/20 rounded-xl shadow-xl z-50 p-3 md:hidden overflow-y-auto max-h-[75vh] flex flex-col gap-3.5 font-mono text-[10px] text-clackr-fg"
              role="menu"
              aria-label="Mobile navigation configuration menu"
            >
              {/* Modifiers */}
              <div className="flex flex-col gap-1 border-b border-clackr-muted/10 pb-2.5">
                <span className="text-clackr-accent uppercase tracking-wider text-[8px] font-bold">modifiers</span>
                <div className="flex flex-wrap gap-1 mt-1" role="toolbar" aria-label="Text modifiers">
                  <button
                    type="button"
                    aria-pressed={punctuation}
                    onClick={() => dispatch(togglePunctuation())}
                    className={`px-2 py-0.5 rounded border text-[9px] ${punctuation ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                  >
                    @ punctuation
                  </button>
                  <button
                    type="button"
                    aria-pressed={numbers}
                    onClick={() => dispatch(toggleNumbers())}
                    className={`px-2 py-0.5 rounded border text-[9px] ${numbers ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                  >
                    № numbers
                  </button>
                  <button
                    type="button"
                    aria-pressed={capitals}
                    onClick={() => dispatch(toggleCapitals())}
                    className={`px-2 py-0.5 rounded border text-[9px] ${capitals ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                  >
                    Aa capitals
                  </button>
                </div>
              </div>

              {/* Difficulty */}
              <div className="flex flex-col gap-1 border-b border-clackr-muted/10 pb-2.5">
                <span className="text-clackr-accent uppercase tracking-wider text-[8px] font-bold">difficulty</span>
                <div className="flex gap-1 mt-1" role="toolbar" aria-label="Difficulty selection">
                  {DIFFICULTIES_LIST.map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      aria-pressed={difficulty === diff}
                      onClick={() => dispatch(setDifficulty(diff))}
                      className={`flex-1 px-2 py-0.5 rounded border uppercase text-[9px] ${difficulty === diff ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modes */}
              <div className="flex flex-col gap-1 border-b border-clackr-muted/10 pb-2.5">
                <span className="text-clackr-accent uppercase tracking-wider text-[8px] font-bold">mode</span>
                <div className="grid grid-cols-3 gap-1 mt-1" role="toolbar" aria-label="Mode selection">
                  {MODES_LIST.map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={mode === m}
                      onClick={() => dispatch(setMode(m))}
                      className={`px-2 py-0.5 rounded border uppercase text-[9px] ${mode === m ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-configs durations/words */}
              {(mode === "time" || mode === "words") && (
                <div className="flex flex-col gap-1 border-b border-clackr-muted/10 pb-2.5">
                  <span className="text-clackr-accent uppercase tracking-wider text-[8px] font-bold">
                    {mode === "time" ? "time limit" : "word count"}
                  </span>
                  <div className="grid grid-cols-4 gap-1 mt-1" role="toolbar" aria-label="Preset options">
                    {mode === "time" ? (
                      PRESET_DURATIONS_LIST.map((d) => (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={duration === d}
                          onClick={() => dispatch(setDuration(d))}
                          className={`px-2 py-0.5 rounded border text-[9px] ${duration === d ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                        >
                          {d}s
                        </button>
                      ))
                    ) : (
                      PRESET_WORDS_LIST.map((w) => (
                        <button
                          key={w}
                          type="button"
                          aria-pressed={wordCount === w}
                          onClick={() => dispatch(setWordCount(w))}
                          className={`px-2 py-0.5 rounded border text-[9px] ${wordCount === w ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                        >
                          {w}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Toolbar Controls */}
              <div className="flex flex-col gap-1">
                <span className="text-clackr-accent uppercase tracking-wider text-[8px] font-bold">navigation</span>
                <div className="flex flex-col gap-0.5 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenHistory();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded hover:bg-clackr-fg/5 text-left text-clackr-muted hover:text-clackr-fg transition-all"
                  >
                    <History className="w-3.5 h-3.5 text-clackr-accent" />
                    <span>View History</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenCustomTest?.();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded hover:bg-clackr-fg/5 text-left text-clackr-muted hover:text-clackr-fg transition-all"
                  >
                    <Clock className="w-3.5 h-3.5 text-clackr-accent" />
                    <span>Custom Test Setup</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSettings();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded hover:bg-clackr-fg/5 text-left text-clackr-muted hover:text-clackr-fg transition-all"
                  >
                    <Settings className="w-3.5 h-3.5 text-clackr-accent" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col py-2 ${scrollable ? "overflow-y-auto no-scrollbar" : "overflow-hidden"}`}>
        <div className="w-full flex-1 flex flex-col">
          {children}
        </div>
      </main>

      {transitionOverlay && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none bg-clackr-bg animate-theme-shrink"
          data-theme={transitionOverlay.oldTheme}
          style={{
            WebkitClipPath: `circle(150vmax at ${transitionOverlay.x}px ${transitionOverlay.y}px)`,
            clipPath: `circle(150vmax at ${transitionOverlay.x}px ${transitionOverlay.y}px)`,
          }}
        />
      )}
    </div>
  );
}
