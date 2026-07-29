"use client";

import React, { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface WordProps {
  index: number;
}

// Static CSS class constants defined outside render loop to eliminate string allocation overhead
const CLASS_UNTYPED = "text-clackr-untyped transition-colors duration-100";
const CLASS_CORRECT = "text-clackr-correct font-medium";
const CLASS_ERROR = "text-clackr-error font-black border-b-[2.5px] border-clackr-error bg-clackr-error/30 rounded-[2px] px-[1.5px] shadow-sm";
const CLASS_EXTRA = "text-clackr-error font-black border-b-[2.5px] border-clackr-error bg-clackr-error/40 rounded-[2px] px-[2px] shadow-sm";

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
    const wasTyped = charIdx < typed.length;
    const isCharCorrect = wasTyped && typed[charIdx] === char;
    const charClass = wasTyped
      ? isCharCorrect
        ? CLASS_CORRECT
        : CLASS_ERROR
      : CLASS_UNTYPED;

    const isCaretHere = isActive && charIdx === typed.length;

    return (
      <span 
        key={charIdx} 
        id={isCaretHere ? "active-char" : undefined} 
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
          className="relative"
        >
          <span className={CLASS_EXTRA}>
            {typed[i]}
          </span>
        </span>
      );
    }
  }

  const isCaretAtEnd = isActive && typed.length >= word.length;

  return (
    <span
      className={`inline-block text-xl md:text-2xl tracking-normal select-none transition-all duration-100 px-[2px] py-0.5 rounded-sm ${
        isActive 
          ? "" 
          : hasErrors 
            ? "border-b-2 border-clackr-error/80 bg-clackr-error/10"
            : ""
      }`}
    >
      {letters}
      {extraLetters}
      {/* Caret target when cursor is at or past the end of the word */}
      <span 
        id={isCaretAtEnd ? "active-char" : undefined} 
        className="inline-block w-0"
      >
        <span className="invisible">a</span>
      </span>
    </span>
  );
});

export default Word;
