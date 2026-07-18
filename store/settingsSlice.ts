import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  theme: "carbon" | "serika" | "nord" | "sakura" | "midnight" | "monokai";
  soundEnabled: boolean;
  soundType: "clack" | "mechanical" | "bubble";
  soundVolume: number;
  errorSoundEnabled: boolean;
  keyboardEnabled: boolean;
  keyboardSize: "small" | "medium" | "large";
  realtimeWpm: boolean;
  fontFamily: "font-mono" | "font-sans";
  confettiEnabled: boolean;
}

const initialState: SettingsState = {
  theme: "midnight",
  soundEnabled: true,
  soundType: "mechanical",
  soundVolume: 0.5,
  errorSoundEnabled: true,
  keyboardEnabled: true,
  keyboardSize: "medium",
  realtimeWpm: true,
  fontFamily: "font-mono",
  confettiEnabled: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<SettingsState["theme"]>) {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-theme", action.payload);
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    setSoundType(state, action: PayloadAction<SettingsState["soundType"]>) {
      state.soundType = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    setSoundVolume(state, action: PayloadAction<number>) {
      state.soundVolume = Math.max(0, Math.min(1, action.payload));
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    toggleErrorSound(state) {
      state.errorSoundEnabled = !state.errorSoundEnabled;
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    toggleKeyboard(state) {
      state.keyboardEnabled = !state.keyboardEnabled;
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    setKeyboardSize(state, action: PayloadAction<SettingsState["keyboardSize"]>) {
      state.keyboardSize = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    toggleRealtimeWpm(state) {
      state.realtimeWpm = !state.realtimeWpm;
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    setFontFamily(state, action: PayloadAction<SettingsState["fontFamily"]>) {
      state.fontFamily = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    toggleConfetti(state) {
      state.confettiEnabled = !state.confettiEnabled;
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-settings", JSON.stringify(state));
      }
    },
    loadSettings(state) {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("clackr-settings");
          if (saved) {
            const parsed = JSON.parse(saved) as Partial<SettingsState>;
            if (parsed.theme) state.theme = parsed.theme;
            if (parsed.soundEnabled !== undefined) state.soundEnabled = parsed.soundEnabled;
            if (parsed.soundType) state.soundType = parsed.soundType;
            if (parsed.soundVolume !== undefined) state.soundVolume = parsed.soundVolume;
            if (parsed.errorSoundEnabled !== undefined) state.errorSoundEnabled = parsed.errorSoundEnabled;
            if (parsed.keyboardEnabled !== undefined) state.keyboardEnabled = parsed.keyboardEnabled;
            if (parsed.keyboardSize) state.keyboardSize = parsed.keyboardSize;
            if (parsed.realtimeWpm !== undefined) state.realtimeWpm = parsed.realtimeWpm;
            if (parsed.fontFamily) state.fontFamily = parsed.fontFamily;
            if (parsed.confettiEnabled !== undefined) state.confettiEnabled = parsed.confettiEnabled;

            document.documentElement.setAttribute("data-theme", state.theme);
          }
        } catch (e) {
          console.error("Failed to load settings:", e);
        }
      }
    },
  },
});

export const {
  setTheme,
  toggleSound,
  setSoundType,
  setSoundVolume,
  toggleErrorSound,
  toggleKeyboard,
  setKeyboardSize,
  toggleRealtimeWpm,
  setFontFamily,
  toggleConfetti,
  loadSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
