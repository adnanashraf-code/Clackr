import { WpmHistoryPoint } from "@/store/testSlice";

/**
 * Calculates net WPM (Words Per Minute) based on correct characters.
 * Standard typing benchmark: 1 Word = 5 characters.
 */
export function calculateWpm(correctChars: number, timeInSeconds: number): number {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  const wpm = (correctChars / 5) / minutes;
  return Math.max(0, Math.round(wpm));
}

/**
 * Calculates raw WPM (uncorrected speed including errors).
 */
export function calculateRawWpm(totalTypedChars: number, timeInSeconds: number): number {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  const raw = (totalTypedChars / 5) / minutes;
  return Math.max(0, Math.round(raw));
}

/**
 * Calculates accuracy percentage.
 */
export function calculateAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  const acc = (correctKeystrokes / totalKeystrokes) * 100;
  return Math.max(0, Math.min(100, Math.round(acc * 10) / 10)); // 1 decimal place
}

/**
 * Calculates consistency percentage based on WPM history variance.
 * High consistency = Low variation in keystroke rhythm.
 * Zero-allocation high-performance implementation.
 */
export function calculateConsistency(history: WpmHistoryPoint[]): number {
  const n = history.length;
  if (n < 3) return 92; // Default starting consistency placeholder

  // Single-pass Sum calculation
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += history[i].wpm;
  }
  const mean = sum / n;
  if (mean <= 0) return 0;

  // Single-pass Variance calculation (using diff * diff instead of Math.pow)
  let sumSquaredDiff = 0;
  for (let i = 0; i < n; i++) {
    const diff = history[i].wpm - mean;
    sumSquaredDiff += diff * diff;
  }

  const variance = sumSquaredDiff / n;
  const stdDev = Math.sqrt(variance);

  // Coefficient of Variation (CV)
  const cv = stdDev / mean;

  // Map CV to consistency score
  return Math.max(0, Math.min(100, Math.round((1 - cv * 0.7) * 100)));
}

/**
 * Compiles character breakdown stats from test:
 * Returns { correct, incorrect, extra, missed }
 */
export function getCharStats(
  words: string[],
  typedWords: string[],
  typedInput: string,
  currentWordIndex: number
) {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  const totalProcessed = Math.min(words.length, currentWordIndex + 1);

  for (let w = 0; w < totalProcessed; w++) {
    const original = words[w] || "";
    const typed = w === currentWordIndex ? typedInput : typedWords[w] || "";

    const isCompletedWord = w < currentWordIndex;
    const maxLen = Math.max(original.length, typed.length);

    for (let i = 0; i < maxLen; i++) {
      const origChar = original[i];
      const typedChar = typed[i];

      if (typedChar === undefined) {
        if (isCompletedWord) {
          missed++;
        }
      } else if (origChar === undefined) {
        extra++;
      } else if (typedChar === origChar) {
        correct++;
      } else {
        incorrect++;
      }
    }
  }

  return { correct, incorrect, extra, missed };
}
