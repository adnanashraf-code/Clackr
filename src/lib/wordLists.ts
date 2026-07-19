const EASY_WORDS_RAW = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", 
  "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", 
  "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", 
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", 
  "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", 
  "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", 
  "want", "because", "any", "these", "give", "day", "most", "us", "are", "was", "were", "had", "been", "has", 
  "more", "here", "write", "our", "about", "these", "long", "make", "thing", "see", "him", "two", "has", "look", 
  "more", "day", "could", "go", "come", "did", "number", "sound", "no", "most", "people", "my", "over", "know", 
  "water", "than", "call", "first", "who", "may", "down", "side", "been", "now", "find", "any", "new", "work", 
  "part", "take", "get", "place", "made", "live", "where", "after", "back", "little", "only", "round", "man", 
  "year", "came", "show", "every", "good", "me", "give", "our", "under", "name", "very", "through", "just", 
  "form", "sentence", "great", "think", "say", "help", "low", "line", "differ", "turn", "cause", "much", "mean", 
  "before", "move", "right", "boy", "old", "too", "same", "tell", "does", "set", "three", "want", "air", "well", 
  "also", "play", "small", "end", "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", 
  "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind", 
  "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother", "world", "near", "build", 
  "self", "earth", "father", "head", "stand", "own", "page", "should", "country", "found", "answer", "school", 
  "grow", "study", "still", "learn", "plant", "cover", "food", "sun", "four", "between", "state", "keep", "eye", 
  "never", "last", "let", "thought", "city", "tree", "cross", "farm", "hard", "start", "might", "story", "saw", 
  "far", "sea", "draw", "left", "late", "run", "dont", "while", "press", "close", "night", "real", "life", "few", 
  "north", "open", "seem", "together", "next", "white", "children", "begin", "got", "walk", "example", "ease", 
  "paper", "group", "always", "music", "those", "both", "mark", "often", "letter", "until", "mile", "river", 
  "car", "feet", "care", "second", "book", "carry", "took", "science", "eat", "room", "friend", "began", "idea"
];
export const EASY_WORDS = Array.from(new Set(EASY_WORDS_RAW));

const HARD_WORDS_RAW = [
  "aberration", "acquiesce", "alacrity", "anomaly", "archetype", "assiduous", "cacophony", "capricious", 
  "clemency", "cogent", "conflagration", "conundrum", "credulity", "dearth", "decorum", "deference", 
  "demagogue", "desecrate", "diaphanous", "discursive", "dissemble", "ebullient", "eclectic", "egregious", 
  "ephemeral", "esoteric", "exculpate", "execrable", "expedient", "fastidious", "garrulous", "grandiloquent", 
  "gregarious", "hackneyed", "harangue", "hegemony", "iconoclast", "idiosyncratic", "impassive", "imperious", 
  "impetuous", "implacable", "inchoate", "indefatigable", "inimical", "insidious", "intransigent", "inveterate", 
  "juxtaposition", "laconic", "magnanimous", "maverick", "mendacious", "multifarious", "nefarious", "obdurate", 
  "obsequious", "ostentatious", "palliate", "pariah", "paucity", "pejorative", "penchant", "perfidy", 
  "perfunctory", "perspicacity", "platitude", "plethora", "portentous", "pragmatic", "precipitous", 
  "predilection", "probity", "proclivity", "promulgate", "pugnacious", "querulous", "recalcitrant", "rectitude", 
  "refulgent", "relegate", "scurrilous", "solicitous", "spurious", "superfluous", "surreptitious", "sycophant", 
  "taciturn", "temerity", "tenuous", "torpid", "tractable", "transient", "trenchant", "turpitude", "ubiquitous", 
  "umbrage", "unctuous", "variegated", "venerable", "veracity", "vicissitude", "vociferous", "zealous"
];
export const HARD_WORDS = Array.from(new Set(HARD_WORDS_RAW));

export interface Quote {
  text: string;
  source: string;
}

export const QUOTES: Quote[] = [
  {
    text: "The mechanical typing rhythm is like a visual poetry composed of physical keypress sounds and finger choreography.",
    source: "Clackr Team"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    source: "Winston Churchill"
  },
  {
    text: "Be yourself; everyone else is already taken.",
    source: "Oscar Wilde"
  },
  {
    text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    source: "Albert Einstein"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    source: "Albert Einstein"
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    source: "Leonardo da Vinci"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    source: "Confucius"
  },
  {
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    source: "Thomas A. Edison"
  },
  {
    text: "The only way to do great work is to love what you do.",
    source: "Steve Jobs"
  },
  {
    text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    source: "Zig Ziglar"
  },
  {
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    source: "Ralph Waldo Emerson"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    source: "John Lennon"
  }
];

export const CODE_SNIPPETS: string[] = [
  "const calculateWpm = (chars, time) => (chars / 5) / (time / 60);",
  "function bubbleSort(arr) { for(let i=0; i<arr.length; i++) { } }",
  "import React, { useState, useEffect } from 'react';",
  "def fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)",
  "const RootLayout = ({ children }) => {\n  return <html lang=\"en\">{children}</html>;\n};",
  "public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n}",
  "body {\n  background-color: var(--bg-color);\n  color: var(--fg-color);\n  transition: all 0.2s;\n}",
  "const store = configureStore({\n  reducer: { test: testReducer }\n});",
  "let [left, right] = [0, arr.length - 1];\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n}"
];
