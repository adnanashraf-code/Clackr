import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TestResultSummary {
  id: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  mode: string;
  configSummary: string; // e.g. "time 30s", "words 25", "quote"
  timestamp: number;
}

export interface ResultsState {
  history: TestResultSummary[];
  highScore: number;
}

const initialState: ResultsState = {
  history: [],
  highScore: 0,
};

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    setHydratedResults(state, action: PayloadAction<ResultsState>) {
      state.history = action.payload.history;
      state.highScore = action.payload.highScore;
    },
    addResult(state, action: PayloadAction<Omit<TestResultSummary, "id" | "timestamp">>) {
      const newResult: TestResultSummary = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };
      state.history.unshift(newResult); // newest first
      if (newResult.wpm > state.highScore) {
        state.highScore = newResult.wpm;
      }
      // Limit history to last 50 tests to prevent localstorage bloat
      if (state.history.length > 50) {
        state.history = state.history.slice(0, 50);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("clackr-results", JSON.stringify(state));
      }
    },
    loadResults(state) {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("clackr-results");
          if (saved) {
            const parsed = JSON.parse(saved) as Partial<ResultsState>;
            if (parsed.history) state.history = parsed.history;
            if (parsed.highScore !== undefined) state.highScore = parsed.highScore;
          }
        } catch (e) {
          console.error("Failed to load results:", e);
        }
      }
    },
    clearHistory(state) {
      state.history = [];
      state.highScore = 0;
      if (typeof window !== "undefined") {
        localStorage.removeItem("clackr-results");
      }
    },
  },
});

export const { addResult, setHydratedResults, loadResults, clearHistory } = resultsSlice.actions;
export default resultsSlice.reducer;
