"use client";

import React, { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface WordProps {
  index: number;
}

const Word = memo(function Word({ index }: WordProps) {
  const word = useSelector((state: RootState) => state.test.words[index] || "");
  const isActive = useSelector((state: RootState) => state.test.currentWordIndex === index);
  const isCompleted = useSelector((state: RootState) => state.test.currentWordIndex > index);
  
  const typed = useSelector((state: RootState) => {
    if (index === state.test.currentWordIndex) {
      return state.test.typedInput;
    }
    return state.test.typedWords[index] || "";
  });

  const hasErrors = isCompleted && typed !== word;

  // Render normal characters
  const letters = word.split("").map((char, charIdx) => {
    let charClass = "text-clackr-untyped transition-colors duration-100";
    
    const wasTyped = charIdx < typed.length;
    const isCharCorrect = wasTyped && typed[charIdx] === char;

    if (wasTyped) {
      if (isCharCorrect) {
        charClass = "text-clackr-correct font-medium";
      } else {
        charClass = "text-clackr-error border-b border-clackr-error font-medium";
      }
    }

    return (
      <span 
        key={charIdx} 
        id={isActive && charIdx === typed.length ? "active-char" : undefined} 
        className="relative"
      >
        <span className={charClass}>{char}</span>
      </span>
    );
  });

  // Render extra characters if typed text is longer than the word
  const extraLetters = [];
  if (typed.length > word.length) {
    for (let i = word.length; i < typed.length; i++) {
      extraLetters.push(
        <span 
          key={`extra-${i}`} 
          id={isActive && i === typed.length ? "active-char" : undefined} 
          className="relative"
        >
          <span className="text-clackr-error opacity-60 border-b border-clackr-error font-medium bg-clackr-error/10">
            {typed[i]}
          </span>
        </span>
      );
    }
  }

  return (
    <span
      className={`inline-block text-xl md:text-2xl tracking-normal select-none transition-all duration-100 px-[2px] py-0.5 rounded-sm ${
        isActive 
          ? "" 
          : hasErrors 
            ? "border-b border-dashed border-clackr-error/40 bg-clackr-error/5"
            : ""
      }`}
    >
      {letters}
      {extraLetters}
      {/* If caret is at the end of the word or extra letters */}
      <span 
        id={isActive && typed.length >= word.length ? "active-char" : undefined} 
        className="inline-block w-0"
      >
        <span className="invisible">a</span>
      </span>
    </span>
  );
});

export default Word;
