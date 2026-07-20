"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { initTest, resetTest } from "@/store/testSlice";
import { toggleKeyboard } from "@/store/settingsSlice";
import { generateWords } from "@/lib/wordGenerator";
import { soundManager } from "@/lib/soundManager";
import { Keyboard as KeyIcon } from "lucide-react";

import Layout from "@/components/Layout/Layout";
import TypingArea from "@/components/TypingArea/TypingArea";
import VirtualKeyboard from "@/components/VirtualKeyboard/VirtualKeyboard";
import ResultsPanel from "@/components/ResultsPanel/ResultsPanel";
import SettingsModal from "@/components/SettingsModal/SettingsModal";
import HistoryModal from "@/components/HistoryModal/HistoryModal";
import CustomTestModal from "@/components/CustomTestModal/CustomTestModal";

export default function Home() {
  const dispatch = useDispatch();
  const { status, mode, difficulty, punctuation, numbers, capitals, wordCount, words } = useSelector(
    (state: RootState) => state.test
  );
  const { keyboardEnabled } = useSelector((state: RootState) => state.settings);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Handler to retry the exact same word list
  const handleRestart = React.useCallback(() => {
    dispatch(resetTest());
  }, [dispatch]);

  // Handler to generate a brand new word list
  const handleNextTest = React.useCallback(() => {
    const newWords = generateWords({
      mode,
      difficulty,
      punctuation,
      numbers,
      capitals,
      wordCount,
    });
    dispatch(initTest(newWords));
  }, [mode, difficulty, punctuation, numbers, capitals, wordCount, dispatch]);

  // Generate initial words on mount if empty (resolves reload blank screen issue)
  useEffect(() => {
    if (words.length === 0) {
      handleNextTest();
    }
  }, [words.length, handleNextTest]);

  // Global hotkeys (Esc for settings, K for keyboard toggles, Tab to restart)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Toggle settings modal with Escape
      if (e.key === "Escape") {
        if (status === "running") return;
        e.preventDefault();
        soundManager.playSound(undefined, undefined, "Escape");
        setIsSettingsOpen((prev) => !prev);
        setIsHistoryOpen(false);
        setIsCustomOpen(false);
        return;
      }

      // Tab key quick restart (works in all test states)
      if (e.key === "Tab") {
        if (isSettingsOpen || isHistoryOpen || isCustomOpen) return;
        e.preventDefault();
        soundManager.playSound(undefined, undefined, "Tab");
        if (status === "finished") {
          handleRestart();
        } else {
          handleNextTest();
        }
        return;
      }

      // If typing test is actively running, don't allow typing shortcuts
      if (status === "running") return;

      // Check if user is typing in settings inputs
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        return;
      }

      // K toggle keyboard view
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        dispatch(toggleKeyboard());
      }
    };

    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, [status, isSettingsOpen, isHistoryOpen, handleRestart, handleNextTest, dispatch]);

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileDismissed, setIsMobileDismissed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout
      onOpenSettings={() => setIsSettingsOpen(true)}
      onOpenHistory={() => setIsHistoryOpen(true)}
      onOpenCustomTest={() => setIsCustomOpen(true)}
      onClickLogo={handleNextTest}
      scrollable={status === "finished" || (isMobile && !isMobileDismissed)}
    >
      {isMobile && !isMobileDismissed ? (
        <div className="flex-1 flex items-center justify-center p-6 select-none animate-fadeIn">
          <div className="w-full max-w-md bg-clackr-bg border border-clackr-muted/15 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-5 shadow-xl">
            <div className="p-4 rounded-full bg-clackr-accent/15 text-clackr-accent animate-bounce">
              <KeyIcon className="w-8 h-8" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h2 className="font-mono text-lg font-bold text-clackr-fg">Keyboard Required</h2>
              <span className="font-mono text-[9px] text-clackr-accent uppercase tracking-widest font-semibold">
                desktop experience recommended
              </span>
            </div>

            <p className="font-sans text-xs text-clackr-fg/80 leading-relaxed">
              Clackr is a premium tactile typing rhythm experience optimized for physical mechanical keyboards. Virtual mobile keyboards do not support full keycodes, rapid speed inputs, or layout configurations.
            </p>

            <div className="flex flex-col gap-2.5 w-full mt-2">
              <div className="p-3 bg-clackr-fg/[0.03] border border-clackr-muted/10 rounded-xl">
                <span className="font-mono text-[10px] text-clackr-muted uppercase font-semibold">
                  To start clacking:
                </span>
                <p className="font-sans text-[11px] text-clackr-fg/60 mt-1">
                  Open this application on a desktop computer or laptop.
                </p>
              </div>

              <button
                onClick={() => setIsMobileDismissed(true)}
                className="font-mono text-[10px] text-clackr-muted hover:text-clackr-fg transition-all uppercase tracking-wider underline mt-2"
              >
                Continue to layout anyway
              </button>
            </div>
          </div>
        </div>
      ) : status === "finished" ? (
        <ResultsPanel
          onRestart={handleRestart}
          onNextTest={handleNextTest}
        />
      ) : (
        <div className={`flex flex-col items-center w-full h-full pb-2 overflow-hidden ${
          keyboardEnabled ? "justify-center gap-12 lg:gap-8" : "flex-1"
        }`}>
          {/* Core typing speed test box */}
          <TypingArea onRestart={handleNextTest} />

          {/* Interactive Mechanical Keyboard */}
          <VirtualKeyboard />
        </div>
      )}

      {/* Application Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <CustomTestModal isOpen={isCustomOpen} onClose={() => setIsCustomOpen(false)} />
    </Layout>
  );
}
