"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  startTest,
  typeChar,
  backspace,
  finishTest,
  recordHistoryPoint,
  initTest,
} from "@/store/testSlice";
import { addResult } from "@/store/resultsSlice";
import { soundManager } from "@/lib/soundManager";
import { calculateWpm, calculateRawWpm, calculateAccuracy, calculateConsistency, getCharStats } from "@/lib/statsCalculator";
import { generateWords } from "@/lib/wordGenerator";
import { triggerConfetti } from "@/lib/confetti";

export function useTypingEngine(inputRef: React.RefObject<HTMLInputElement | null>) {
  const dispatch = useDispatch();
  
  // Granular Redux selectors to optimize rendering and prevent unnecessary keystroke re-renders
  const status = useSelector((state: RootState) => state.test.status);
  const mode = useSelector((state: RootState) => state.test.mode);
  const duration = useSelector((state: RootState) => state.test.duration);
  const wordCount = useSelector((state: RootState) => state.test.wordCount);
  const difficulty = useSelector((state: RootState) => state.test.difficulty);
  const punctuation = useSelector((state: RootState) => state.test.punctuation);
  const numbers = useSelector((state: RootState) => state.test.numbers);
  const capitals = useSelector((state: RootState) => state.test.capitals);
  const words = useSelector((state: RootState) => state.test.words);
  const typedWords = useSelector((state: RootState) => state.test.typedWords);
  const currentWordIndex = useSelector((state: RootState) => state.test.currentWordIndex);
  const typedInput = useSelector((state: RootState) => state.test.typedInput);
  const startTime = useSelector((state: RootState) => state.test.startTime);
  const endTime = useSelector((state: RootState) => state.test.endTime);
  const totalKeystrokes = useSelector((state: RootState) => state.test.totalKeystrokes);
  const correctKeystrokes = useSelector((state: RootState) => state.test.correctKeystrokes);
  const wpmHistory = useSelector((state: RootState) => state.test.wpmHistory);

  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const soundType = useSelector((state: RootState) => state.settings.soundType);
  const soundVolume = useSelector((state: RootState) => state.settings.soundVolume);
  const errorSoundEnabled = useSelector((state: RootState) => state.settings.errorSoundEnabled);
  const confettiEnabled = useSelector((state: RootState) => state.settings.confettiEnabled);

  // Keep references to avoid stale closures in intervals
  const statusRef = useRef(status);
  const startTimeRef = useRef(startTime);
  const wordsRef = useRef(words);
  const typedWordsRef = useRef(typedWords);
  const typedInputRef = useRef(typedInput);
  const currentWordIndexRef = useRef(currentWordIndex);
  const totalKeystrokesRef = useRef(totalKeystrokes);

  useEffect(() => {
    statusRef.current = status;
    startTimeRef.current = startTime;
    wordsRef.current = words;
    typedWordsRef.current = typedWords;
    typedInputRef.current = typedInput;
    currentWordIndexRef.current = currentWordIndex;
    totalKeystrokesRef.current = totalKeystrokes;
  }, [status, startTime, words, typedWords, typedInput, currentWordIndex, totalKeystrokes]);

  // Reset/Generate words
  const handleReset = () => {
    const newWords = generateWords({
      mode,
      difficulty,
      punctuation,
      numbers,
      capitals,
      wordCount,
    });
    dispatch(initTest(newWords));
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  // Generate words on initial load or config change
  useEffect(() => {
    handleReset();
  }, [mode, duration, wordCount, difficulty, punctuation, numbers, capitals]);

  // Audio trigger helper
  const playKeystrokeSound = (isCorrect: boolean, key: string = "") => {
    if (!soundEnabled) return;
    if (!isCorrect && errorSoundEnabled) {
      soundManager.playSound("error", soundVolume);
    } else {
      soundManager.playSound(soundType, soundVolume, key);
    }
  };

  // Keystroke Handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ignore Escape and Tab in typing handler (handled globally in page.tsx)
    if (e.key === "Escape" || e.key === "Tab") {
      return;
    }

    // Ignore modifiers
    if (e.ctrlKey || e.altKey || e.metaKey || e.key === "Shift") {
      return;
    }

    const currentStatus = statusRef.current;
    
    // Start test on first key press - only if it is a typing key (space, backspace, or character)
    const isTypingKey = e.key === " " || e.key === "Backspace" || e.key.length === 1;
    if (currentStatus === "idle" && isTypingKey) {
      dispatch(startTest());
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      dispatch(backspace());
      playKeystrokeSound(true, "Backspace");
      return;
    }

    if (e.key === " ") {
      e.preventDefault();
      
      const activeWord = wordsRef.current[currentWordIndexRef.current] || "";
      const isWordCorrect = typedInputRef.current === activeWord;
      
      dispatch(typeChar(" "));
      playKeystrokeSound(isWordCorrect, " ");
      return;
    }

    // If single character key
    if (e.key.length === 1) {
      e.preventDefault();
      
      const activeWord = wordsRef.current[currentWordIndexRef.current] || "";
      const expectedChar = activeWord[typedInputRef.current.length];
      const isCorrect = e.key === expectedChar;
      
      dispatch(typeChar(e.key));
      playKeystrokeSound(isCorrect, e.key);
    }
  };

  // Input Change Handler for Mobile Soft Keyboards (Gboard / Samsung / iOS Keyboard)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const prevValue = typedInputRef.current;

    // Start test on first input
    if (statusRef.current === "idle" && newValue.length > 0) {
      dispatch(startTest());
    }

    if (newValue.length > prevValue.length) {
      // New character(s) typed (e.g. Gboard autocomplete or letter insertion)
      const addedChars = newValue.slice(prevValue.length);
      for (const char of addedChars) {
        const activeWord = wordsRef.current[currentWordIndexRef.current] || "";
        if (char === " ") {
          const isWordCorrect = prevValue === activeWord;
          dispatch(typeChar(" "));
          playKeystrokeSound(isWordCorrect, " ");
        } else {
          const expectedChar = activeWord[prevValue.length];
          const isCorrect = char === expectedChar;
          dispatch(typeChar(char));
          playKeystrokeSound(isCorrect, char);
        }
      }
    } else if (newValue.length < prevValue.length) {
      // Backspace pressed on soft keyboard
      const deleteCount = prevValue.length - newValue.length;
      for (let i = 0; i < deleteCount; i++) {
        dispatch(backspace());
        playKeystrokeSound(true, "Backspace");
      }
    }
  };

  return {
    handleReset,
    handleKeyDown,
    handleInputChange,
  };

  // Timer & WPM History tracker Interval
  useEffect(() => {
    if (status !== "running" || !startTime) return;

    let secondsElapsed = 0;
    
    const interval = setInterval(() => {
      secondsElapsed += 1;
      
      // Calculate current stats for history point
      const { correct } = getCharStats(
        wordsRef.current,
        typedWordsRef.current,
        typedInputRef.current,
        currentWordIndexRef.current
      );

      const currentWpm = calculateWpm(correct, secondsElapsed);
      const currentRaw = calculateRawWpm(totalKeystrokesRef.current, secondsElapsed);

      dispatch(
        recordHistoryPoint({
          time: secondsElapsed,
          wpm: currentWpm,
          rawWpm: currentRaw,
        })
      );

      // Finish conditions for Time mode
      if (mode === "time" && secondsElapsed >= duration) {
        dispatch(finishTest());
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, startTime, mode, duration, dispatch]);

  // Test finished log submission
  useEffect(() => {
    if (status === "finished" && startTime && endTime) {
      const timeTakenInSeconds = (endTime - startTime) / 1000;
      
      const { correct, incorrect, extra, missed } = getCharStats(
        words,
        typedWords,
        typedInput,
        currentWordIndex
      );

      const finalWpm = calculateWpm(correct, timeTakenInSeconds);
      const finalRaw = calculateRawWpm(totalKeystrokes, timeTakenInSeconds);
      const finalAccuracy = calculateAccuracy(correctKeystrokes, totalKeystrokes);
      const finalConsistency = calculateConsistency(wpmHistory);

      let configSummary = "";
      if (mode === "time") configSummary = `${duration}s`;
      else if (mode === "words") configSummary = `${wordCount} words`;
      else configSummary = mode;

      dispatch(
        addResult({
          wpm: finalWpm,
          rawWpm: finalRaw,
          accuracy: finalAccuracy,
          consistency: finalConsistency,
          mode,
          configSummary,
        })
      );

      // Trigger confetti animation if enabled
      if (confettiEnabled) {
        triggerConfetti();
      }
    }
  }, [status, startTime, endTime, dispatch, confettiEnabled]);

  return {
    handleReset,
    handleKeyDown,
  };
}
