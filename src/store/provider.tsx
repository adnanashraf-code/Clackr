"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { loadSettings } from "./settingsSlice";
import { loadResults } from "./resultsSlice";
import { soundManager } from "../lib/soundManager";
import { ToastProvider } from "@/components/Toast/ToastContext";

interface ProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ProviderProps) {
  useEffect(() => {
    // Safely load settings and results on client mount
    store.dispatch(loadSettings());
    store.dispatch(loadResults());

    // Sync settings to soundManager and subscribe to settings state changes only
    let prevSettings = store.getState().settings;

    const syncSettings = () => {
      const currentSettings = store.getState().settings;
      if (prevSettings === currentSettings) return; // Prevent unnecessary sound manager updates on non-settings state changes (e.g. typing/timer ticks)
      prevSettings = currentSettings;
      soundManager.updateSettings(
        currentSettings.soundEnabled,
        currentSettings.soundType,
        currentSettings.soundVolume
      );
    };

    // Run initial sync & preload sound buffers
    soundManager.updateSettings(
      prevSettings.soundEnabled,
      prevSettings.soundType,
      prevSettings.soundVolume
    );
    soundManager.preload();

    // Subscribe to store changes
    const unsubscribe = store.subscribe(syncSettings);

    // Play the currently active click sound on interactive/clickable elements without layout thrashing
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Exclude input/textarea typing buffers to prevent double sound
      if (target.tagName === "INPUT") return;

      // Check if element is interactive using DOM selectors (avoids layout-thrashing getComputedStyle)
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("role") === "button" ||
        target.closest("button") !== null ||
        target.closest("a") !== null ||
        target.closest("#typing-area-container") !== null ||
        target.closest("[data-key]") !== null;

      if (isInteractive) {
        soundManager.playSound(undefined, undefined, "Click");
      }
    };

    window.addEventListener("mousedown", handleGlobalClick);
    return () => {
      unsubscribe();
      window.removeEventListener("mousedown", handleGlobalClick);
    };
  }, []);

  return (
    <Provider store={store}>
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}
