"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setTheme,
  setSoundType,
  setSoundVolume,
  toggleErrorSound,
  toggleKeyboard,
  setKeyboardSize,
  setFontFamily,
  toggleConfetti,
} from "@/store/settingsSlice";
import { clearHistory } from "@/store/resultsSlice";
import { X, Volume2, Eye, Trash2, Check } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

  const themes = [
    { id: "carbon" as const, name: "Carbon", bg: "#211F1C", accent: "#E15A1D", text: "#F0E9DC", dark: true },
    { id: "serika" as const, name: "Serika", bg: "#F2EBDB", accent: "#E2B714", text: "#323437", dark: false },
    { id: "nord" as const, name: "Nord", bg: "#2E3440", accent: "#88C0D0", text: "#D8DEE9", dark: true },
    { id: "sakura" as const, name: "Sakura", bg: "#F8F0F0", accent: "#D16075", text: "#442F2F", dark: false },
    { id: "midnight" as const, name: "Midnight", bg: "#0A0D14", accent: "#A277FF", text: "#D1D6E0", dark: true },
    { id: "monokai" as const, name: "Monokai", bg: "#272822", accent: "#A6E22E", text: "#F8F8F2", dark: true },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div 
        ref={modalRef}
        className="bg-clackr-bg border border-clackr-muted/20 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn"
        style={{ backgroundColor: "var(--bg-color)", color: "var(--fg-color)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-clackr-muted/10">
          <div className="flex flex-col">
            <h2 className="font-mono text-lg font-bold text-clackr-fg">clackr settings</h2>
            <span className="text-[10px] text-clackr-muted font-mono uppercase tracking-widest">
              configure your mechanical space
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings modal"
            className="p-1.5 rounded-lg hover:bg-clackr-muted/10 text-clackr-muted hover:text-clackr-fg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 font-sans">
          
          {/* Section: Themes */}
          <div className="flex flex-col gap-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-clackr-accent flex items-center gap-1.5">
              <span>●</span> Presets & Visual Theme
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={(event) => {
                    const x = event.clientX;
                    const y = event.clientY;
                    if (typeof document !== "undefined") {
                      document.documentElement.style.setProperty("--click-x", `${x}px`);
                      document.documentElement.style.setProperty("--click-y", `${y}px`);
                    }
                    if (typeof document !== "undefined" && (document as any).startViewTransition) {
                      const { flushSync } = require("react-dom");
                      (document as any).startViewTransition(() => {
                        flushSync(() => {
                          dispatch(setTheme(theme.id));
                        });
                      });
                    } else {
                      dispatch(setTheme(theme.id));
                    }
                  }}
                  className={`relative p-3 rounded-xl flex items-center justify-between border-2 transition-all ${
                    settings.theme === theme.id
                      ? "border-clackr-accent scale-[1.02] shadow-md shadow-clackr-accent/5"
                      : "border-clackr-muted/15 hover:border-clackr-muted/40"
                  }`}
                  style={{ backgroundColor: theme.bg, color: theme.text }}
                >
                  <span className="font-mono text-sm font-semibold">{theme.name}</span>
                  <div className="flex items-center gap-1.5">
                    {/* Theme colors dots */}
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                    {settings.theme === theme.id && (
                      <Check className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Sound Settings */}
          <div className="flex flex-col gap-4 border-t border-clackr-muted/10 pt-5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-clackr-accent flex items-center gap-1.5">
              <Volume2 className="w-4.5 h-4.5" /> Keyboard Click Sounds
            </h3>
            
            <div className="flex flex-col gap-3 font-mono text-xs text-clackr-muted">
              {/* Sound Type Selection */}
              <div className="flex items-center justify-between">
                    <span>Switch Sound Style</span>
                    <div className="flex gap-1">
                      {(["clack", "mechanical", "bubble"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => dispatch(setSoundType(t))}
                          className={`px-2 py-1 rounded text-[10px] transition-all border ${
                            settings.soundType === t
                              ? "text-clackr-fg border-clackr-accent/30 bg-clackr-accent/5 font-semibold"
                              : "text-clackr-muted border-clackr-muted/20"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>



                  {/* Error beep toggle */}
                  <div className="flex items-center justify-between">
                    <span>Play Beep on Error</span>
                    <button
                      onClick={() => dispatch(toggleErrorSound())}
                      className={`px-3 py-1 rounded transition-all border ${
                        settings.errorSoundEnabled
                          ? "text-clackr-fg border-clackr-accent/30 bg-clackr-accent/5 font-semibold"
                          : "text-clackr-muted border-clackr-muted/20"
                      }`}
                    >
                      {settings.errorSoundEnabled ? "On" : "Off"}
                    </button>
                  </div>
            </div>
          </div>

          {/* Section: Typography and UI controls */}
          <div className="flex flex-col gap-4 border-t border-clackr-muted/10 pt-5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-clackr-accent flex items-center gap-1.5">
              <Eye className="w-4.5 h-4.5" /> Layout & Typography
            </h3>

            <div className="flex flex-col gap-3 font-mono text-xs text-clackr-muted">
              {/* Virtual Keyboard display */}
              <div className="flex items-center justify-between">
                <span>On-screen Virtual Keyboard</span>
                <button
                  onClick={() => dispatch(toggleKeyboard())}
                  className={`px-3 py-1 rounded transition-all border ${
                    settings.keyboardEnabled
                      ? "text-clackr-fg border-clackr-accent/30 bg-clackr-accent/5 font-semibold"
                      : "text-clackr-muted border-clackr-muted/20"
                  }`}
                >
                  {settings.keyboardEnabled ? "Visible" : "Hidden"}
                </button>
              </div>

              {/* Keyboard Size selection */}
              {settings.keyboardEnabled && (
                <div className="flex items-center justify-between">
                  <span>Keyboard Size</span>
                  <div className="flex gap-1">
                    {(["small", "medium", "large"] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => dispatch(setKeyboardSize(sz))}
                        className={`px-2 py-1 rounded text-[10px] transition-all border capitalize ${
                          (settings.keyboardSize || "medium") === sz
                            ? "text-clackr-fg border-clackr-accent/30 bg-clackr-accent/5 font-semibold"
                            : "text-clackr-muted border-clackr-muted/20"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Font Family selection */}
              <div className="flex items-center justify-between">
                <span>Typing Font</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => dispatch(setFontFamily("font-mono"))}
                    className={`px-2 py-1 rounded text-[10px] transition-all border ${
                      settings.fontFamily === "font-mono"
                        ? "text-clackr-fg border-clackr-accent/30 bg-clackr-accent/5 font-semibold"
                        : "text-clackr-muted border-clackr-muted/20"
                    }`}
                  >
                    Mono (JetBrains)
                  </button>
                  <button
                    onClick={() => dispatch(setFontFamily("font-sans"))}
                    className={`px-2 py-1 rounded text-[10px] transition-all border ${
                      settings.fontFamily === "font-sans"
                        ? "text-clackr-fg border-clackr-accent/30 bg-clackr-accent/5 font-semibold"
                        : "text-clackr-muted border-clackr-muted/20"
                    }`}
                  >
                    Sans (Inter)
                  </button>
                </div>
              </div>

              {/* Confetti Effect */}
              <div className="flex items-center justify-between">
                <span>Confetti on Completion</span>
                <button
                  onClick={() => dispatch(toggleConfetti())}
                  className={`px-3 py-1 rounded transition-all border ${
                    settings.confettiEnabled
                      ? "text-clackr-fg border-clackr-accent/30 bg-clackr-accent/5 font-semibold"
                      : "text-clackr-muted border-clackr-muted/20"
                  }`}
                >
                  {settings.confettiEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          </div>

          {/* Section: Reset History */}
          <div className="flex flex-col gap-3 border-t border-clackr-muted/10 pt-5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-clackr-error flex items-center gap-1.5">
              <Trash2 className="w-4.5 h-4.5" /> Danger Zone
            </h3>
            <div className="flex items-center justify-between text-xs font-mono text-clackr-muted">
              <span>Wipe Personal Best & History</span>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear all high scores and typing history?")) {
                    dispatch(clearHistory());
                    alert("History cleared successfully.");
                  }
                }}
                className="px-3 py-1.5 rounded bg-clackr-error/10 hover:bg-clackr-error text-clackr-error hover:text-white border border-clackr-error/20 transition-all font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
