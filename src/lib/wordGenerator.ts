import { EASY_WORDS, HARD_WORDS, NATURAL_SENTENCES, QUOTES, CODE_SNIPPETS } from "./wordLists";

interface GeneratorConfig {
  mode: "time" | "words" | "quote" | "zen" | "code";
  difficulty: "easy" | "medium" | "hard";
  punctuation: boolean;
  numbers: boolean;
  capitals: boolean;
  wordCount?: number;
}

// Track previous choices so every refresh/reset gives a completely different output
let lastQuoteIndex = -1;
let lastCodeIndex = -1;
let lastSentenceIndex = -1;

export function generateWords(config: GeneratorConfig): string[] {
  const {
    mode,
    difficulty,
    punctuation,
    numbers,
    capitals,
    wordCount = 50,
  } = config;

  // 1. Quote Mode: Pick a fresh quote every single time
  if (mode === "quote") {
    let nextIndex = Math.floor(Math.random() * QUOTES.length);
    if (QUOTES.length > 1 && nextIndex === lastQuoteIndex) {
      nextIndex = (nextIndex + 1) % QUOTES.length;
    }
    lastQuoteIndex = nextIndex;
    const randomQuote = QUOTES[nextIndex];
    const cleanedQuote = randomQuote.text.replace(/\s+/g, " ").trim();
    return cleanedQuote.split(" ");
  }

  // 2. Code Mode: Pick a fresh code snippet every single time
  if (mode === "code") {
    let nextIndex = Math.floor(Math.random() * CODE_SNIPPETS.length);
    if (CODE_SNIPPETS.length > 1 && nextIndex === lastCodeIndex) {
      nextIndex = (nextIndex + 1) % CODE_SNIPPETS.length;
    }
    lastCodeIndex = nextIndex;
    const randomCode = CODE_SNIPPETS[nextIndex];
    const cleanedCode = randomCode.replace(/\s+/g, " ").trim();
    return cleanedCode.split(" ");
  }

  // 3. Time / Words / Zen Modes
  let targetCount = wordCount;
  if (mode === "time") {
    targetCount = 800; // Generate high buffer for 120s high WPM typists
  } else if (mode === "zen") {
    targetCount = 120;
  }

  // Build raw words list from natural sentences and dictionary pools
  let rawWords: string[] = [];

  // Start with a natural sentence to give immediate grammatical rhythm
  let sentenceIdx = Math.floor(Math.random() * NATURAL_SENTENCES.length);
  if (NATURAL_SENTENCES.length > 1 && sentenceIdx === lastSentenceIndex) {
    sentenceIdx = (sentenceIdx + 1) % NATURAL_SENTENCES.length;
  }
  lastSentenceIndex = sentenceIdx;

  const initialSentence = NATURAL_SENTENCES[sentenceIdx].split(" ");
  rawWords.push(...initialSentence);

  // Determine main word pool for remaining words
  const primaryPool = difficulty === "easy" ? EASY_WORDS : HARD_WORDS;

  while (rawWords.length < targetCount + 50) {
    // 50% chance to append another natural sentence, 50% chance to sample from word pool
    if (Math.random() < 0.5) {
      const randomSent = NATURAL_SENTENCES[Math.floor(Math.random() * NATURAL_SENTENCES.length)].split(" ");
      rawWords.push(...randomSent);
    } else {
      let word = "";
      if (difficulty === "medium") {
        const useEasy = Math.random() < 0.75;
        const currentPool = useEasy ? EASY_WORDS : HARD_WORDS;
        word = currentPool[Math.floor(Math.random() * currentPool.length)];
      } else {
        word = primaryPool[Math.floor(Math.random() * primaryPool.length)];
      }
      rawWords.push(word);
    }
  }

  // Filter out any consecutive duplicate words (e.g. no "work work" or "the the")
  const dedupedWords: string[] = [];
  for (let i = 0; i < rawWords.length && dedupedWords.length < targetCount; i++) {
    const current = rawWords[i].toLowerCase().trim();
    if (current && (dedupedWords.length === 0 || dedupedWords[dedupedWords.length - 1].toLowerCase() !== current)) {
      dedupedWords.push(rawWords[i]);
    }
  }

  // Apply Punctuation, Numbers, and Capitals modifiers cleanly
  const finalWords: string[] = [];
  let sentenceLength = Math.floor(Math.random() * 6) + 6; // 6 to 11 words per sentence
  let currentSentenceWordCount = 0;

  for (let i = 0; i < dedupedWords.length; i++) {
    let word = dedupedWords[i];

    // Numbers Modifier (Inject clean numbers ~10% frequency)
    if (numbers && Math.random() < 0.10) {
      const numKind = Math.random();
      if (numKind < 0.4) {
        word = (Math.floor(Math.random() * 90) + 10).toString(); // e.g. 45
      } else if (numKind < 0.7) {
        word = (Math.floor(Math.random() * 900) + 100).toString(); // e.g. 250
      } else {
        word = (2020 + Math.floor(Math.random() * 10)).toString(); // e.g. 2026
      }
    }

    // Punctuation Mode: Structured natural sentences with capitals and ending periods/commas
    if (punctuation) {
      // Capitalize first word of a sentence
      if (currentSentenceWordCount === 0 && !/^\d+$/.test(word)) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }

      currentSentenceWordCount++;

      // Check if end of sentence
      if (currentSentenceWordCount >= sentenceLength || i === dedupedWords.length - 1) {
        // End sentence with period, question mark, or exclamation
        const endPunc = Math.random() < 0.15 ? "?" : Math.random() < 0.05 ? "!" : ".";
        word = word.replace(/[,\.?!]+$/, "") + endPunc;
        currentSentenceWordCount = 0;
        sentenceLength = Math.floor(Math.random() * 6) + 6;
      } else if (currentSentenceWordCount > 3 && Math.random() < 0.15 && !/[,\.?!]$/.test(word)) {
        // Mid-sentence comma
        word = word + ",";
      }
    } else {
      // Capitals Modifier (when punctuation is off)
      if (capitals && Math.random() < 0.20 && !/^\d+$/.test(word)) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
    }

    // Extra safety: ensure adjacent words aren't duplicate even after modifications
    if (finalWords.length === 0 || finalWords[finalWords.length - 1].toLowerCase() !== word.toLowerCase()) {
      finalWords.push(word);
    }
  }

  return finalWords;
}
