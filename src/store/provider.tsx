"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { loadSettings } from "./settingsSlice";
import { loadResults } from "./resultsSlice";
import { soundManager } from "../lib/soundManager";

interface ProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ProviderProps) {
  useEffect(() => {
    // Safely load settings and results on client mount
    store.dispatch(loadSettings());
    store.dispatch(loadResults());

    // Sync settings to soundManager and subscribe to any future settings changes
    const syncSettings = () => {
      const state = store.getState().settings;
      soundManager.updateSettings(state.soundEnabled, state.soundType, state.soundVolume);
    };

    // Run initial sync
    syncSettings();

    // Preload sound buffers immediately (especially mechanical switch sound)
    soundManager.preload();

    // Subscribe to store changes to keep soundManager in sync dynamically
    const unsubscribe = store.subscribe(syncSettings);

    // Play the currently active click sound on interactive/clickable elements only
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Exclude text input drag/selection to avoid double sounds during typing focus
      if (target.tagName === "INPUT" && target.getAttribute("type") === "text") {
        return;
      }

      // Check if element is interactive (button, link, custom control, typing container, etc.)
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("role") === "button" ||
        target.closest("#typing-area-container") !== null ||
        target.closest("[data-key]") !== null ||
        window.getComputedStyle(target).cursor === "pointer";

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

  return <Provider store={store}>{children}</Provider>;
}
