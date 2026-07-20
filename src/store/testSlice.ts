import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WpmHistoryPoint {
  time: number;
  wpm: number;
  rawWpm: number;
}

export interface TestState {
  status: "idle" | "running" | "finished";
  mode: "time" | "words" | "quote" | "zen" | "code";
  duration: number; // For time mode (15, 30, 60, 120)
  wordCount: number; // For words mode (10, 25, 50, 100)
  difficulty: "easy" | "medium" | "hard";
  punctuation: boolean;
  numbers: boolean;
  capitals: boolean;

  words: string[];
  typedWords: string[]; // Completed words
  currentWordIndex: number;
  typedInput: string; // Current active word typing buffer

  startTime: number | null;
  endTime: number | null;
  wpmHistory: WpmHistoryPoint[];
  
  // Keystrokes stats
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  backspaceCount: number;
}

const initialState: TestState = {
  status: "idle",
  mode: "time",
  duration: 30,
  wordCount: 25,
  difficulty: "easy",
  punctuation: false,
  numbers: false,
  capitals: false,

  words: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there",
    "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no",
    "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then",
    "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well",
    "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
  ],
  typedWords: [],
  currentWordIndex: 0,
  typedInput: "",

  startTime: null,
  endTime: null,
  wpmHistory: [],
  
  totalKeystrokes: 0,
  correctKeystrokes: 0,
  errorKeystrokes: 0,
  backspaceCount: 0,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<TestState["mode"]>) {
      state.mode = action.payload;
      state.status = "idle";
      state.typedInput = "";
      state.typedWords = [];
      state.currentWordIndex = 0;
      state.startTime = null;
      state.endTime = null;
      state.wpmHistory = [];
      state.totalKeystrokes = 0;
      state.correctKeystrokes = 0;
      state.errorKeystrokes = 0;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
      state.status = "idle";
    },
    setWordCount(state, action: PayloadAction<number>) {
      state.wordCount = action.payload;
      state.status = "idle";
    },
    setDifficulty(state, action: PayloadAction<TestState["difficulty"]>) {
      state.difficulty = action.payload;
      state.status = "idle";
    },
    setCustomTestSettings(
      state,
      action: PayloadAction<{
        duration: number;
        difficulty: TestState["difficulty"];
        punctuation: boolean;
        numbers: boolean;
        capitals: boolean;
      }>
    ) {
      state.mode = "time";
      state.duration = action.payload.duration;
      state.difficulty = action.payload.difficulty;
      state.punctuation = action.payload.punctuation;
      state.numbers = action.payload.numbers;
      state.capitals = action.payload.capitals;
      state.status = "idle";
      state.typedInput = "";
      state.typedWords = [];
      state.currentWordIndex = 0;
      state.startTime = null;
      state.endTime = null;
      state.wpmHistory = [];
      state.totalKeystrokes = 0;
      state.correctKeystrokes = 0;
      state.errorKeystrokes = 0;
      state.backspaceCount = 0;
    },
    togglePunctuation(state) {
      state.punctuation = !state.punctuation;
      state.status = "idle";
    },
    toggleNumbers(state) {
      state.numbers = !state.numbers;
      state.status = "idle";
    },
    toggleCapitals(state) {
      state.capitals = !state.capitals;
      state.status = "idle";
    },
    initTest(state, action: PayloadAction<string[]>) {
      state.words = action.payload;
      state.status = "idle";
      state.typedInput = "";
      state.typedWords = [];
      state.currentWordIndex = 0;
      state.startTime = null;
      state.endTime = null;
      state.wpmHistory = [];
      state.totalKeystrokes = 0;
      state.correctKeystrokes = 0;
      state.errorKeystrokes = 0;
      state.backspaceCount = 0;
    },
    startTest(state) {
      state.status = "running";
      state.startTime = Date.now();
    },
    typeChar(state, action: PayloadAction<string>) {
      if (state.status === "finished") return;

      const char = action.payload;
      const activeWord = state.words[state.currentWordIndex] || "";
      const expectedChar = activeWord[state.typedInput.length];

      // Total keystrokes increment
      state.totalKeystrokes += 1;

      if (char === " ") {
        // Space logic
        if (state.typedInput.length === 0) {
          // Ignore leading/consecutive spaces
          state.totalKeystrokes -= 1; // don't count failed space
          return;
        }

        // Save typed word
        state.typedWords[state.currentWordIndex] = state.typedInput;
        
        // Count space as a correct keystroke since it successfully completed a word
        state.correctKeystrokes += 1;
        
        state.currentWordIndex += 1;
        state.typedInput = "";

        // Check if test is completed (last word completed)
        if (state.currentWordIndex >= state.words.length) {
          state.status = "finished";
          state.endTime = Date.now();
        }
      } else {
        // Normal character typing
        state.typedInput += char;

        // Check accuracy for keystroke counts
        if (char === expectedChar) {
          state.correctKeystrokes += 1;
        } else {
          state.errorKeystrokes += 1;
        }

        // Auto-complete check: if on the last word and user typed exactly the last character correctly
        const isLastWord = state.currentWordIndex === state.words.length - 1;
        if (isLastWord && state.typedInput === activeWord) {
          state.typedWords[state.currentWordIndex] = state.typedInput;
          state.status = "finished";
          state.endTime = Date.now();
        }
      }
    },
    backspace(state) {
      if (state.status === "finished") return;

      state.backspaceCount += 1;

      if (state.typedInput.length > 0) {
        state.typedInput = state.typedInput.slice(0, -1);
      } else if (state.currentWordIndex > 0) {
        // Cross-word backspace
        state.currentWordIndex -= 1;
        state.typedInput = state.typedWords[state.currentWordIndex] || "";
        // Remove the word from completed list
        state.typedWords = state.typedWords.slice(0, state.currentWordIndex);
      }
    },
    recordHistoryPoint(state, action: PayloadAction<{ time: number; wpm: number; rawWpm: number }>) {
      state.wpmHistory.push(action.payload);
    },
    finishTest(state) {
      if (state.status === "running") {
        // End test
        state.status = "finished";
        state.endTime = Date.now();
        // Save current input
        if (state.typedInput.length > 0) {
          state.typedWords[state.currentWordIndex] = state.typedInput;
        }
      }
    },
    resetTest(state) {
      state.status = "idle";
      state.typedInput = "";
      state.typedWords = [];
      state.currentWordIndex = 0;
      state.startTime = null;
      state.endTime = null;
      state.wpmHistory = [];
      state.totalKeystrokes = 0;
      state.correctKeystrokes = 0;
      state.errorKeystrokes = 0;
      state.backspaceCount = 0;
    },
  },
});

export const {
  setMode,
  setDuration,
  setWordCount,
  setDifficulty,
  setCustomTestSettings,
  togglePunctuation,
  toggleNumbers,
  toggleCapitals,
  initTest,
  startTest,
  typeChar,
  backspace,
  recordHistoryPoint,
  finishTest,
  resetTest,
} = testSlice.actions;

export default testSlice.reducer;
