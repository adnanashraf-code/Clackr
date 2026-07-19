import { WpmHistoryPoint } from "@/store/testSlice";

/**
 * Calculates net WPM (Words Per Minute) based on correct characters.
 * 1 Word = 5 characters.
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
 * Lower variation = Higher consistency.
 */
export function calculateConsistency(history: WpmHistoryPoint[]): number {
  if (history.length < 3) return 92; // Default starting consistency placeholder

  // Extract WPM values
  const wpmList = history.map((pt) => pt.wpm);
  const n = wpmList.length;

  // Calculate Mean (Average WPM)
  const sum = wpmList.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  if (mean <= 0) return 0;

  // Calculate Variance
  const squaredDiffs = wpmList.map((wpm) => Math.pow(wpm - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / n;

  // Calculate Standard Deviation
  const stdDev = Math.sqrt(variance);

  // Coefficient of Variation (CV)
  const cv = stdDev / mean;

  // Map CV to a consistency score (e.g. CV of 0 = 100% consistency, CV >= 0.5 = 50% or less)
  // Standard typing consistency is usually between 60% and 98%.
  const consistency = Math.max(0, Math.min(100, Math.round((1 - cv * 0.7) * 100)));

  return consistency;
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

  // Process all words up to the current one
  const totalProcessed = Math.min(words.length, currentWordIndex + 1);

  for (let w = 0; w < totalProcessed; w++) {
    const original = words[w] || "";
    const typed = w === currentWordIndex ? typedInput : typedWords[w] || "";

    // If word is completely typed and was completed before current index
    const isCompletedWord = w < currentWordIndex;

    // Compare characters
    const maxLen = Math.max(original.length, typed.length);

    for (let i = 0; i < maxLen; i++) {
      const origChar = original[i];
      const typedChar = typed[i];

      if (typedChar === undefined) {
        // Missed characters (left blank in skipped/completed words)
        if (isCompletedWord) {
          missed++;
        }
      } else if (origChar === undefined) {
        // Extra characters typed
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
