import { EASY_WORDS, HARD_WORDS, QUOTES, CODE_SNIPPETS } from "./wordLists";

interface GeneratorConfig {
  mode: "time" | "words" | "quote" | "zen" | "code";
  difficulty: "easy" | "medium" | "hard";
  punctuation: boolean;
  numbers: boolean;
  capitals: boolean;
  wordCount?: number;
}

export function generateWords(config: GeneratorConfig): string[] {
  const {
    mode,
    difficulty,
    punctuation,
    numbers,
    capitals,
    wordCount = 50,
  } = config;

  if (mode === "quote") {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const cleanedQuote = randomQuote.text.replace(/\s+/g, " ").trim();
    return cleanedQuote.split(" ");
  }

  if (mode === "code") {
    const randomCode =
      CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    const cleanedCode = randomCode.replace(/\s+/g, " ").trim();
    return cleanedCode.split(" ");
  }

  // Determine source pool
  const pool = difficulty === "easy" ? EASY_WORDS : HARD_WORDS;
  let count = wordCount;

  if (mode === "time") {
    // Generate a massive buffer of words for time trials to support 120s at 400 WPM
    count = 800;
  } else if (mode === "zen") {
    count = 100;
  }

  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    let word = "";
    if (difficulty === "medium") {
      const useEasy = Math.random() < 0.75;
      const currentPool = useEasy ? EASY_WORDS : HARD_WORDS;
      word = currentPool[Math.floor(Math.random() * currentPool.length)];
    } else {
      word = pool[Math.floor(Math.random() * pool.length)];
    }

    // Inject numbers if enabled (10% chance)
    if (numbers && Math.random() < 0.12) {
      const numType = Math.random();
      if (numType < 0.4) {
        word = Math.floor(Math.random() * 100).toString();
      } else if (numType < 0.8) {
        word = `${word}${Math.floor(Math.random() * 10)}`;
      } else {
        word = `19${Math.floor(Math.random() * 90 + 10)}`;
      }
    }

    // Inject capitalizations if enabled (20% chance)
    if (capitals && Math.random() < 0.2 && !/^\d+$/.test(word)) {
      if (Math.random() < 0.8) {
        // Sentence case: capitalize first letter (e.g., "Word")
        word = word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        // Uppercase: capitalize entire word (e.g., "WORD")
        word = word.toUpperCase();
      }
    }

    // Inject punctuation if enabled (15% chance)
    if (punctuation && Math.random() < 0.15) {
      const puncType = Math.random();
      if (puncType < 0.3) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      } else if (puncType < 0.5) {
        word = `${word},`;
      } else if (puncType < 0.7) {
        word = `${word}.`;
      } else if (puncType < 0.85) {
        word = `"${word}"`;
      } else {
        word = `${word}?`;
      }
    }

    result.push(word);
  }

  // Clean formatting: ensure first letter of first word is capitalized in punctuation mode
  if (punctuation && result.length > 0) {
    result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
    // Ensure final word ends with a period
    const lastIdx = result.length - 1;
    if (!result[lastIdx].endsWith(".")) {
      result[lastIdx] = result[lastIdx].replace(/[,\?\"\'\:\;]$/, "") + ".";
    }
  }

  return result;
}
