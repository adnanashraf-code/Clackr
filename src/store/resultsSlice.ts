import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";

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
      const now = Date.now();

      // Deduplication check: ignore if an identical test result was saved in the last 3 seconds
      const lastResult = state.history[0];
      if (
        lastResult &&
        lastResult.wpm === action.payload.wpm &&
        lastResult.rawWpm === action.payload.rawWpm &&
        lastResult.accuracy === action.payload.accuracy &&
        lastResult.mode === action.payload.mode &&
        now - lastResult.timestamp < 3000
      ) {
        return;
      }

      const newResult: TestResultSummary = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: now,
      };
      state.history.unshift(newResult); // newest first
      if (newResult.wpm > state.highScore) {
        state.highScore = newResult.wpm;
      }
      // Limit history to last 100 tests to prevent localstorage bloat
      if (state.history.length > 100) {
        state.history = state.history.slice(0, 100);
      }
      if (typeof window !== "undefined") {
        try {
          const plainState = current(state);
          const dataToSave = {
            history: plainState.history,
            highScore: plainState.highScore,
          };
          localStorage.setItem("clackr-results", JSON.stringify(dataToSave));
        } catch (e) {
          console.error("Failed to save results to localStorage:", e);
        }
      }
    },
    loadResults(state) {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("clackr-results");
          if (saved) {
            const parsed = JSON.parse(saved) as Partial<ResultsState>;
            if (parsed && Array.isArray(parsed.history)) {
              state.history = parsed.history;
            }
            if (parsed && typeof parsed.highScore === "number") {
              state.highScore = parsed.highScore;
            }
          }
        } catch (e) {
          console.error("Failed to load results from localStorage:", e);
        }
      }
    },
    clearHistory(state) {
      state.history = [];
      state.highScore = 0;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("clackr-results");
        } catch (e) {
          console.error("Failed to clear results from localStorage:", e);
        }
      }
    },
  },
});

export const { addResult, setHydratedResults, loadResults, clearHistory } = resultsSlice.actions;
export default resultsSlice.reducer;
