"use client";

import React, { useEffect, useState, createContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Key from "./Key";

export interface SizeConfig {
  keyWidthMult: number;
  keyGap: number;
  height: number;
  fontSizeLabelNoSub: string;
  fontSizeLabelSub: string;
  fontSizeSub: string;
  fontSizeModifier: string;
}

export const KEYBOARD_SIZES: Record<string, SizeConfig> = {
  small: {
    keyWidthMult: 42,
    keyGap: 4,
    height: 38,
    fontSizeLabelNoSub: "text-[10px]",
    fontSizeLabelSub: "text-[8.5px]",
    fontSizeSub: "text-[7.5px]",
    fontSizeModifier: "text-[9px]",
  },
  medium: {
    keyWidthMult: 48,
    keyGap: 4,
    height: 44,
    fontSizeLabelNoSub: "text-[11.5px]",
    fontSizeLabelSub: "text-[10px]",
    fontSizeSub: "text-[8.5px]",
    fontSizeModifier: "text-[10px]",
  },
  large: {
    keyWidthMult: 54,
    keyGap: 4,
    height: 50,
    fontSizeLabelNoSub: "text-[13px]",
    fontSizeLabelSub: "text-[11.5px]",
    fontSizeSub: "text-[9.5px]",
    fontSizeModifier: "text-[11px]",
  },

};

export const SizeContext = createContext<SizeConfig>(KEYBOARD_SIZES.medium);

export default function VirtualKeyboard() {
  const { keyboardEnabled, keyboardSize } = useSelector((state: RootState) => state.settings);
  const { words, currentWordIndex, typedInput, status } = useSelector((state: RootState) => state.test);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);

  const config = KEYBOARD_SIZES[keyboardSize || "medium"] || KEYBOARD_SIZES.medium;

  useEffect(() => {
    setMounted(true);
    const updateScale = () => {
      const keyboardHeight = 6 * config.height + 60;
      const containerWidth = 16 * config.keyWidthMult - config.keyGap + 12;
      const naturalWidth = containerWidth + 24;

      const availableWidth = window.innerWidth - 32;
      const availableHeight = window.innerHeight - 300; // headroom buffer

      const scaleX = Math.min(1, availableWidth / naturalWidth);
      const scaleY = Math.min(1, availableHeight / keyboardHeight);

      const scaleFactor = Math.max(0.4, Math.min(scaleX, scaleY));
      setScale(scaleFactor);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [config, keyboardSize]);

  // Listen to physical keystrokes for visual bottom-out pressing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys((prev) => {
        const next = new Set(prev);
        if (key === " ") {
          next.add("space");
        } else {
          next.add(key);
        }
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys((prev) => {
        const next = new Set(prev);
        if (key === " ") {
          next.delete("space");
        } else {
          next.delete(key);
        }
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  if (!keyboardEnabled || status === "finished") return null;
  if (!mounted) {
    return (
      <div className="hidden lg:block w-full h-[324px] opacity-0" />
    );
  }

  // Determine expected next character to highlight
  const activeWord = words[currentWordIndex] || "";
  let nextChar = "";
  if (status === "idle") {
    // First letter of first word
    nextChar = words[0]?.charAt(0) || "";
  } else if (status === "running") {
    if (typedInput.length < activeWord.length) {
      nextChar = activeWord[typedInput.length];
    } else {
      nextChar = " "; // Space expected
    }
  }

  // Determine if a key should highlight
  const shouldHighlight = (keyLabel: string): boolean => {
    if (!nextChar) return false;

    const label = keyLabel.toLowerCase();
    
    // Spacebar
    if (nextChar === " " && label === "space") return true;

    // Shift highlighting for uppercase/symbols
    const isUppercase = /^[A-Z]$/.test(nextChar);
    const isSymbol = /^[!@#$%^&*()_+{}|:"<>?~]$/.test(nextChar);
    if ((isUppercase || isSymbol) && label === "shift") return true;

    // Direct match for letters
    if (nextChar.toLowerCase() === label) return true;

    // Symbol to key mappings
    const symbolMap: Record<string, string> = {
      "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0",
      "_": "-", "+": "=", "{": "[", "}": "]", "|": "\\", ":": ";", "\"": "'", "<": ",", ">": ".", "?": "/",
      "~": "`"
    };

    if (symbolMap[nextChar] === label) return true;
    if (nextChar === label) return true;

    return false;
  };

  const isPressed = (keyLabel: string): boolean => {
    const label = keyLabel.toLowerCase();
    if (label === "space") return pressedKeys.has("space");
    if (label === "ctrl") return pressedKeys.has("control");
    if (label === "option" || label === "opt") return pressedKeys.has("alt");
    if (label === "cmd" || label === "command" || label === "⌘") return pressedKeys.has("meta");
    if (label === "return" || label === "enter") return pressedKeys.has("enter");
    if (label === "del" || label === "delete") return pressedKeys.has("delete");
    if (label === "caps lock" || label === "caps") return pressedKeys.has("capslock");
    if (label === "←" || label === "backspace") return pressedKeys.has("backspace");
    if (label === "▲") return pressedKeys.has("arrowup");
    if (label === "▼") return pressedKeys.has("arrowdown");
    if (label === "◀") return pressedKeys.has("arrowleft");
    if (label === "▶") return pressedKeys.has("arrowright");
    return pressedKeys.has(label);
  };

  const containerWidth = 16 * config.keyWidthMult - config.keyGap + 12;
  const naturalWidth = containerWidth + 20;
  const keyboardHeight = 6 * config.height + 60;

  return (
    <SizeContext.Provider value={config}>
      <div 
        className="hidden lg:flex w-full justify-center items-start overflow-hidden transition-all duration-300"
        style={{ height: `${keyboardHeight * scale}px` }}
      >
        <div 
          className="flex-shrink-0"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: "top center",
            width: `${naturalWidth}px`,
            height: `${keyboardHeight}px`
          }}
        >
          <div className="w-max mx-auto p-2 rounded-2xl bg-[#1E1C1A] border border-[#2A2724]/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300">
            {/* 75% mechanical layout container */}
            <div 
              className="flex flex-col gap-1 bg-[#121110] p-1.5 rounded-xl transition-all duration-300"
              style={{ width: `${containerWidth}px` }}
            >
          
          {/* Row 1: F-Row (1u x 16 keys = 16u) */}
          <div className="flex gap-1 border-b border-clackr-muted/10 pb-1.5 mb-1 w-full">
            <Key label="esc" isEsc isModifier pressed={isPressed("esc")} />
            <Key label="F1" isModifier pressed={isPressed("f1")} />
            <Key label="F2" isModifier pressed={isPressed("f2")} />
            <Key label="F3" isModifier pressed={isPressed("f3")} />
            <Key label="F4" isModifier pressed={isPressed("f4")} />
            <Key label="F5" isModifier pressed={isPressed("f5")} />
            <Key label="F6" isModifier pressed={isPressed("f6")} />
            <Key label="F7" isModifier pressed={isPressed("f7")} />
            <Key label="F8" isModifier pressed={isPressed("f8")} />
            <Key label="F9" isModifier pressed={isPressed("f9")} />
            <Key label="F10" isModifier pressed={isPressed("f10")} />
            <Key label="F11" isModifier pressed={isPressed("f11")} />
            <Key label="F12" isModifier pressed={isPressed("f12")} />
            <Key label="prt" isModifier pressed={isPressed("prt")} />
            <Key label="del" isModifier pressed={isPressed("del")} />
            <Key label="☼" isModifier pressed={isPressed("light")} />
          </div>

          {/* Row 2: Numbers & Backspace & PgUp (13u + 2u + 1u = 16u) */}
          <div className="flex gap-1 w-full">
            <Key label="`" subLabel="~" pressed={isPressed("`")} highlighted={shouldHighlight("`")} />
            <Key label="1" subLabel="!" pressed={isPressed("1")} highlighted={shouldHighlight("1")} />
            <Key label="2" subLabel="@" pressed={isPressed("2")} highlighted={shouldHighlight("2")} />
            <Key label="3" subLabel="#" pressed={isPressed("3")} highlighted={shouldHighlight("3")} />
            <Key label="4" subLabel="$" pressed={isPressed("4")} highlighted={shouldHighlight("4")} />
            <Key label="5" subLabel="%" pressed={isPressed("5")} highlighted={shouldHighlight("5")} />
            <Key label="6" subLabel="^" pressed={isPressed("6")} highlighted={shouldHighlight("6")} />
            <Key label="7" subLabel="&" pressed={isPressed("7")} highlighted={shouldHighlight("7")} />
            <Key label="8" subLabel="*" pressed={isPressed("8")} highlighted={shouldHighlight("8")} />
            <Key label="9" subLabel="(" pressed={isPressed("9")} highlighted={shouldHighlight("9")} />
            <Key label="0" subLabel=")" pressed={isPressed("0")} highlighted={shouldHighlight("0")} />
            <Key label="-" subLabel="_" pressed={isPressed("-")} highlighted={shouldHighlight("-")} />
            <Key label="=" subLabel="+" pressed={isPressed("=")} highlighted={shouldHighlight("=")} />
            <Key label="←" width={2} isModifier pressed={isPressed("←")} highlighted={shouldHighlight("←")} />
            <Key label="pgup" isModifier pressed={isPressed("pgup")} />
          </div>

          {/* Row 3: Tab & QWERTY & Backslash & PgDn (1.5u + 12u + 1.5u + 1u = 16u) */}
          <div className="flex gap-1 w-full">
            <Key label="tab" width={1.5} isModifier pressed={isPressed("tab")} />
            <Key label="q" pressed={isPressed("q")} highlighted={shouldHighlight("q")} />
            <Key label="w" pressed={isPressed("w")} highlighted={shouldHighlight("w")} />
            <Key label="e" pressed={isPressed("e")} highlighted={shouldHighlight("e")} />
            <Key label="r" pressed={isPressed("r")} highlighted={shouldHighlight("r")} />
            <Key label="t" pressed={isPressed("t")} highlighted={shouldHighlight("t")} />
            <Key label="y" pressed={isPressed("y")} highlighted={shouldHighlight("y")} />
            <Key label="u" pressed={isPressed("u")} highlighted={shouldHighlight("u")} />
            <Key label="i" pressed={isPressed("i")} highlighted={shouldHighlight("i")} />
            <Key label="o" pressed={isPressed("o")} highlighted={shouldHighlight("o")} />
            <Key label="p" pressed={isPressed("p")} highlighted={shouldHighlight("p")} />
            <Key label="[" subLabel="{" pressed={isPressed("[")} highlighted={shouldHighlight("[")} />
            <Key label="]" subLabel="}" pressed={isPressed("]")} highlighted={shouldHighlight("]")} />
            <Key label="\" subLabel="|" width={1.5} pressed={isPressed("\\")} highlighted={shouldHighlight("\\")} />
            <Key label="pgdn" isModifier pressed={isPressed("pgdn")} />
          </div>

          {/* Row 4: Caps & ASDF & Return & Home (1.75u + 11u + 2.25u + 1u = 16u) */}
          <div className="flex gap-1 w-full">
            <Key label="caps lock" width={1.75} isModifier pressed={isPressed("caps lock")} />
            <Key label="a" pressed={isPressed("a")} highlighted={shouldHighlight("a")} />
            <Key label="s" pressed={isPressed("s")} highlighted={shouldHighlight("s")} />
            <Key label="d" pressed={isPressed("d")} highlighted={shouldHighlight("d")} />
            <Key label="f" pressed={isPressed("f")} highlighted={shouldHighlight("f")} />
            <Key label="g" pressed={isPressed("g")} highlighted={shouldHighlight("g")} />
            <Key label="h" pressed={isPressed("h")} highlighted={shouldHighlight("h")} />
            <Key label="j" pressed={isPressed("j")} highlighted={shouldHighlight("j")} />
            <Key label="k" pressed={isPressed("k")} highlighted={shouldHighlight("k")} />
            <Key label="l" pressed={isPressed("l")} highlighted={shouldHighlight("l")} />
            <Key label=";" subLabel=":" pressed={isPressed(";")} highlighted={shouldHighlight(";")} />
            <Key label="'" subLabel="&quot;" pressed={isPressed("'")} highlighted={shouldHighlight("'")} />
            <Key label="return" width={2.25} isModifier pressed={isPressed("return")} />
            <Key label="home" isModifier pressed={isPressed("home")} />
          </div>

          {/* Row 5: Shift & ZXCV & Shift & Up Arrow & End (2.25u + 10u + 1.75u + 1u + 1u = 16u) */}
          <div className="flex gap-1 w-full">
            <Key label="shift" width={2.25} isModifier pressed={isPressed("shift")} highlighted={shouldHighlight("shift")} />
            <Key label="z" pressed={isPressed("z")} highlighted={shouldHighlight("z")} />
            <Key label="x" pressed={isPressed("x")} highlighted={shouldHighlight("x")} />
            <Key label="c" pressed={isPressed("c")} highlighted={shouldHighlight("c")} />
            <Key label="v" pressed={isPressed("v")} highlighted={shouldHighlight("v")} />
            <Key label="b" pressed={isPressed("b")} highlighted={shouldHighlight("b")} />
            <Key label="n" pressed={isPressed("n")} highlighted={shouldHighlight("n")} />
            <Key label="m" pressed={isPressed("m")} highlighted={shouldHighlight("m")} />
            <Key label="," subLabel="<" pressed={isPressed(",")} highlighted={shouldHighlight(",")} />
            <Key label="." subLabel=">" pressed={isPressed(".")} highlighted={shouldHighlight(".")} />
            <Key label="/" subLabel="?" pressed={isPressed("/")} highlighted={shouldHighlight("/")} />
            <Key label="shift" width={1.75} isModifier pressed={isPressed("shift")} highlighted={shouldHighlight("shift")} />
            <Key label="▲" pressed={isPressed("▲")} highlighted={shouldHighlight("▲")} />
            <Key label="end" isModifier pressed={isPressed("end")} />
          </div>

          {/* Row 6: Bottom modifiers & Space & Arrows (1.25u*3 + 6.25u + 1u*3 + 1u*3 = 16u) */}
          <div className="flex gap-1 w-full">
            <Key label="ctrl" width={1.25} isModifier pressed={isPressed("ctrl")} />
            <Key label="option" width={1.25} isModifier pressed={isPressed("option")} />
            <Key label="cmd" width={1.25} isModifier pressed={isPressed("cmd")} />
            <Key label="space" width={6.25} pressed={isPressed("space")} highlighted={shouldHighlight("space")} />
            <Key label="cmd" width={1} isModifier pressed={isPressed("cmd")} />
            <Key label="fn" width={1} isModifier pressed={isPressed("fn")} />
            <Key label="ctrl" width={1} isModifier pressed={isPressed("ctrl")} />
            <Key label="◀" pressed={isPressed("◀")} highlighted={shouldHighlight("◀")} />
            <Key label="▼" pressed={isPressed("▼")} highlighted={shouldHighlight("▼")} />
            <Key label="▶" pressed={isPressed("▶")} highlighted={shouldHighlight("▶")} />
          </div>

            </div>
          </div>
        </div>
      </div>
    </SizeContext.Provider>
  );
}
