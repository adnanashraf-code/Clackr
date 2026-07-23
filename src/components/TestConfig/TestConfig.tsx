import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setMode,
  setDuration,
  setWordCount,
  setDifficulty,
  togglePunctuation,
  toggleNumbers,
  toggleCapitals,
} from "@/store/testSlice";
import { setTheme, toggleSound, SettingsState } from "@/store/settingsSlice";
import { Palette, Clock, Volume2, VolumeX } from "lucide-react";

const THEMES: SettingsState["theme"][] = ["carbon", "serika", "nord", "sakura", "midnight", "monokai"];

interface TestConfigProps {
  onOpenCustomTest?: () => void;
}

export default function TestConfig({ onOpenCustomTest }: TestConfigProps) {
  const dispatch = useDispatch();
  const { mode, duration, wordCount, difficulty, punctuation, numbers, capitals, status } = useSelector(
    (state: RootState) => state.test
  );
  
  const activeTheme = useSelector((state: RootState) => state.settings.theme);
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);

  const isTyping = status === "running";

  const handleToggleTheme = (e: React.MouseEvent) => {
    const currentIndex = THEMES.indexOf(activeTheme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];

    if (typeof document !== "undefined" && (document as any).startViewTransition) {
      document.documentElement.style.setProperty("--click-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--click-y", `${e.clientY}px`);
      const { flushSync } = require("react-dom");
      (document as any).startViewTransition(() => {
        flushSync(() => {
          dispatch(setTheme(nextTheme));
        });
      });
    } else {
      dispatch(setTheme(nextTheme));
    }
  };

  return (
    <div
      className={`flex flex-nowrap items-center justify-center gap-1.5 md:gap-2 xl:gap-2.5 font-mono text-xs md:text-xs xl:text-[13px] 2xl:text-[14px] text-clackr-muted transition-all duration-300 w-max max-w-full mx-auto z-20 overflow-x-auto no-scrollbar py-1 px-1 whitespace-nowrap ${
        isTyping ? "opacity-0 pointer-events-none -translate-y-2 scale-95" : "opacity-100"
      }`}
    >
      {/* Group 1: Modifiers (Punctuation, Numbers, Capitals) */}
      <div className="flex items-center bg-clackr-fg/[0.03] border border-clackr-muted/5 rounded-lg p-0.5 shadow-inner gap-0.5 flex-shrink-0">
        <button
          onClick={() => dispatch(togglePunctuation())}
          className={`px-2 py-0.5 lg:px-2.5 rounded-md transition-all ${
            punctuation
              ? "text-clackr-accent font-bold bg-clackr-accent/15 shadow-sm"
              : "hover:text-clackr-fg hover:bg-clackr-fg/5"
          }`}
        >
          @ punctuation
        </button>

        <button
          onClick={() => dispatch(toggleNumbers())}
          className={`px-2 py-0.5 lg:px-2.5 rounded-md transition-all ${
            numbers
              ? "text-clackr-accent font-bold bg-clackr-accent/15 shadow-sm"
              : "hover:text-clackr-fg hover:bg-clackr-fg/5"
          }`}
        >
          # numbers
        </button>

        <button
          onClick={() => dispatch(toggleCapitals())}
          className={`px-2 py-0.5 lg:px-2.5 rounded-md transition-all ${
            capitals
              ? "text-clackr-accent font-bold bg-clackr-accent/15 shadow-sm"
              : "hover:text-clackr-fg hover:bg-clackr-fg/5"
          }`}
        >
          Aa capitals
        </button>
      </div>

      {/* Group 2: Difficulty Selection (Easy, Hard) */}
      <div className="flex items-center bg-clackr-fg/[0.03] border border-clackr-muted/5 rounded-lg p-0.5 shadow-inner gap-0.5 flex-shrink-0">
        {(["easy", "hard"] as const).map((d) => (
          <button
            key={d}
            onClick={() => dispatch(setDifficulty(d))}
            className={`px-2 py-0.5 lg:px-2.5 rounded-md transition-all capitalize ${
              difficulty === d
                ? "text-clackr-accent font-bold bg-clackr-accent/15 shadow-sm"
                : "hover:text-clackr-fg hover:bg-clackr-fg/5"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Group 3: Primary Test Modes */}
      <div className="flex items-center bg-clackr-fg/[0.03] border border-clackr-muted/5 rounded-lg p-0.5 shadow-inner gap-0.5 flex-shrink-0">
        {(["time", "words", "quote", "zen", "code"] as const).map((m) => (
          <button
            key={m}
            onClick={() => dispatch(setMode(m))}
            className={`px-2 py-0.5 lg:px-2.5 rounded-md transition-all uppercase text-[10px] md:text-[11px] lg:text-xs font-bold tracking-wider ${
              mode === m
                ? "bg-clackr-accent/15 text-clackr-accent font-bold shadow-sm"
                : "hover:text-clackr-fg hover:bg-clackr-fg/5"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Group 4: Sub-configs (Durations / Word Counts) */}
      <div className="flex items-center justify-center min-h-[22px] flex-shrink-0">
        {mode === "time" && (
          <div className="flex items-center bg-clackr-fg/[0.03] border border-clackr-muted/5 rounded-lg p-0.5 shadow-inner gap-0.5 flex-shrink-0">
            {[15, 30, 60, 120].map((d) => (
              <button
                key={d}
                onClick={() => dispatch(setDuration(d))}
                className={`px-2 py-0.5 lg:px-2.5 rounded-md transition-all ${
                  duration === d
                    ? "bg-clackr-accent/15 text-clackr-accent font-bold shadow-sm"
                    : "hover:text-clackr-fg hover:bg-clackr-fg/5"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {mode === "words" && (
          <div className="flex items-center bg-clackr-fg/[0.03] border border-clackr-muted/5 rounded-lg p-0.5 shadow-inner gap-0.5 flex-shrink-0">
            {[10, 25, 50, 100].map((w) => (
              <button
                key={w}
                onClick={() => dispatch(setWordCount(w))}
                className={`px-2 py-0.5 lg:px-2.5 rounded-md transition-all ${
                  wordCount === w
                    ? "bg-clackr-accent/15 text-clackr-accent font-bold shadow-sm"
                    : "hover:text-clackr-fg hover:bg-clackr-fg/5"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        )}

        {mode === "zen" && <span className="text-[10px] md:text-[11px] text-clackr-muted/40 uppercase font-bold tracking-wider px-2 flex-shrink-0">zen mode</span>}
        {mode === "quote" && <span className="text-[10px] md:text-[11px] text-clackr-muted/40 uppercase font-bold tracking-wider px-2 flex-shrink-0">quotes mode</span>}
        {mode === "code" && <span className="text-[10px] md:text-[11px] text-clackr-muted/40 uppercase font-bold tracking-wider px-2 flex-shrink-0">code mode</span>}
      </div>

      {/* Group 5: Active Theme Quick Toggle */}
      <button
        onClick={handleToggleTheme}
        className="flex items-center justify-center p-1.5 bg-clackr-fg/[0.03] border border-clackr-muted/5 rounded-lg shadow-inner text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all duration-200 flex-shrink-0"
        title={`Current theme: ${activeTheme} (Click to cycle)`}
        aria-label="Toggle next visual theme"
      >
        <Palette className="w-3.5 h-3.5 text-clackr-accent" />
      </button>

      {/* Group 6: Custom Test Setup */}
      <button
        onClick={onOpenCustomTest}
        className="flex items-center justify-center p-1.5 bg-clackr-fg/[0.03] border border-clackr-muted/5 rounded-lg shadow-inner text-clackr-muted hover:text-clackr-fg hover:bg-clackr-fg/5 transition-all duration-200 flex-shrink-0"
        title="Custom Test Setup"
        aria-label="Open custom test configuration"
      >
        <Clock className="w-3.5 h-3.5 text-clackr-accent" />
      </button>

      {/* Group 7: Quick Sound Mute/Unmute Toggle */}
      <button
        onClick={() => dispatch(toggleSound())}
        className={`flex items-center justify-center p-1.5 bg-clackr-fg/[0.03] border border-clackr-muted/5 rounded-lg shadow-inner transition-all duration-200 flex-shrink-0 ${
          soundEnabled ? "text-clackr-accent" : "text-clackr-muted/50 hover:text-clackr-fg"
        }`}
        title={soundEnabled ? "Mute Sound Effects" : "Unmute Sound Effects"}
        aria-label="Toggle sound effects"
      >
        {soundEnabled ? (
          <Volume2 className="w-3.5 h-3.5 text-clackr-accent" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
