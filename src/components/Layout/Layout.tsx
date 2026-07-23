"use client";

import React from "react";
import { Keyboard, Settings, History, Menu, Clock, Volume2, VolumeX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleKeyboard, toggleSound } from "@/store/settingsSlice";
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

export default function Layout({ children, onOpenSettings, onOpenHistory, onOpenCustomTest, onClickLogo, scrollable = false }: LayoutProps) {
  const dispatch = useDispatch();
  const { keyboardEnabled, soundEnabled } = useSelector((state: RootState) => state.settings);
  const { highScore } = useSelector((state: RootState) => state.results);
  const { status, mode, duration, wordCount, difficulty, punctuation, numbers, capitals } = useSelector(
    (state: RootState) => state.test
  );
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const activeTheme = useSelector((state: RootState) => state.settings.theme);
  const [prevTheme, setPrevTheme] = React.useState(activeTheme);
  const [transitionOverlay, setTransitionOverlay] = React.useState<{
    oldTheme: string;
    x: number;
    y: number;
  } | null>(null);

  // Monitor theme change state to run a smooth custom reveal overlay fallback when native SVT is not supported
  React.useEffect(() => {
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
        >
          <Keyboard className="w-5 h-5 text-clackr-accent" />
          <span className="font-mono text-xl font-bold tracking-tight text-clackr-fg leading-none">
            clack<span className="text-clackr-accent font-extrabold font-mono">r</span>
          </span>
        </div>

        {/* Center: Configuration Options or Results Dashboard Header (Hidden on mobile, center flex-1 on desktop) */}
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
          {highScore > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-clackr-fg/5 text-[9px] font-mono text-clackr-fg font-semibold uppercase tracking-wider select-none">
              <span className="text-clackr-muted font-bold">pb:</span>
              <span className="text-clackr-accent font-bold">{highScore}</span>
            </div>
          )}

          {/* Desktop Toolbar (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-0.5 bg-clackr-fg/[0.03] border border-clackr-muted/10 p-1 rounded-xl shadow-sm">
            <button
              onClick={() => dispatch(toggleKeyboard())}
              title="Toggle Keyboard View (K)"
              aria-label="Toggle keyboard view"
              className={`p-1.5 rounded-lg transition-all ${
                keyboardEnabled 
                  ? "text-clackr-accent bg-clackr-accent/10 hover:bg-clackr-accent/20" 
                  : "text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5"
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenHistory}
              title="View History"
              aria-label="View typing test history"
              className="p-1.5 rounded-lg text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all duration-200"
            >
              <History className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenSettings}
              title="Settings (Esc)"
              aria-label="Open settings menu"
              className="p-1.5 rounded-lg text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all duration-200"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button (Visible on Mobile only) */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 rounded-xl bg-clackr-fg/[0.03] border border-clackr-muted/10 text-clackr-muted hover:text-clackr-fg transition-all duration-200"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Mobile Quick Configuration & Menu Dropdown (Visible on Mobile only) */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2.5 w-60 bg-clackr-bg border border-clackr-muted/20 rounded-xl shadow-xl z-50 p-3 md:hidden overflow-y-auto max-h-[75vh] flex flex-col gap-3.5 font-mono text-[10px]" style={{ backgroundColor: "var(--bg-color)" }}>
              {/* Modifiers */}
              <div className="flex flex-col gap-1 border-b border-clackr-muted/10 pb-2.5">
                <span className="text-clackr-accent uppercase tracking-wider text-[8px] font-bold">modifiers</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  <button
                    onClick={() => dispatch(togglePunctuation())}
                    className={`px-2 py-0.5 rounded border text-[9px] ${punctuation ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                  >
                    @ punctuation
                  </button>
                  <button
                    onClick={() => dispatch(toggleNumbers())}
                    className={`px-2 py-0.5 rounded border text-[9px] ${numbers ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                  >
                    № numbers
                  </button>
                  <button
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
                <div className="flex gap-1 mt-1">
                  {(["easy", "hard"] as const).map((diff) => (
                    <button
                      key={diff}
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
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {(["time", "words", "quote", "zen", "code"] as const).map((m) => (
                    <button
                      key={m}
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
                  <div className="grid grid-cols-4 gap-1 mt-1">
                    {mode === "time" ? (
                      [15, 30, 60, 120].map((d) => (
                        <button
                          key={d}
                          onClick={() => dispatch(setDuration(d))}
                          className={`px-2 py-0.5 rounded border text-[9px] ${duration === d ? "text-clackr-accent border-clackr-accent/30 bg-clackr-accent/10 font-bold" : "text-clackr-muted border-clackr-muted/10"}`}
                        >
                          {d}s
                        </button>
                      ))
                    ) : (
                      [10, 25, 50, 100].map((w) => (
                        <button
                          key={w}
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
                    onClick={() => {
                      dispatch(toggleKeyboard());
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded hover:bg-clackr-fg/5 text-left text-clackr-muted hover:text-clackr-fg transition-all"
                  >
                    <Keyboard className="w-3.5 h-3.5 text-clackr-accent" />
                    <span>{keyboardEnabled ? "Hide Keyboard" : "Show Keyboard"}</span>
                  </button>
                  <button
                    onClick={() => {
                      dispatch(toggleSound());
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded hover:bg-clackr-fg/5 text-left text-clackr-muted hover:text-clackr-fg transition-all"
                  >
                    {soundEnabled ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-clackr-accent" />
                        <span>Mute Sound</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-clackr-muted/50" />
                        <span>Unmute Sound</span>
                      </>
                    )}
                  </button>
                  <button
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
