"use client";

import React, { useContext } from "react";
import { SizeContext } from "./VirtualKeyboard";

interface KeyProps {
  label: string;
  subLabel?: string;
  width?: number; // Unit width multiplier (1u, 1.25u, 1.5u, etc.)
  isModifier?: boolean;
  isEsc?: boolean;
  highlighted?: boolean;
  pressed?: boolean;
}

export default function Key({
  label,
  subLabel,
  width = 1,
  isModifier = false,
  isEsc = false,
  highlighted = false,
  pressed = false,
}: KeyProps) {
  const sizeConfig = useContext(SizeContext);
  // Center-to-center standard dynamic formula for width of Xu key: X * keyWidthMult - keyGap.
  const pxWidth = Math.round(width * sizeConfig.keyWidthMult - sizeConfig.keyGap);
  const pxHeight = sizeConfig.height;

  const handleTouchStart = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch (e) {}
    }
  };

  return (
    <div className="keycap-container" style={{ width: `${pxWidth}px` }}>
      <div
        onTouchStart={handleTouchStart}
        className={`keycap w-full flex flex-col items-center justify-center select-none ${
          isEsc
            ? "keycap-esc"
            : isModifier
            ? `keycap-modifier ${sizeConfig.fontSizeModifier}`
            : "text-clackr-fg"
        } ${highlighted ? "highlighted font-bold" : ""} ${pressed ? "pressed" : ""}`}
        style={{ height: `${pxHeight}px`, touchAction: "manipulation" }}
      >
        {subLabel && (
          <span className={`leading-none opacity-60 mb-0.5 font-sans ${sizeConfig.fontSizeSub}`}>
            {subLabel}
          </span>
        )}
        <span
          className={`leading-none font-semibold ${
            subLabel ? sizeConfig.fontSizeLabelSub : sizeConfig.fontSizeLabelNoSub
          } ${isModifier ? "lowercase font-sans tracking-wide font-medium" : "uppercase font-mono font-bold"}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
