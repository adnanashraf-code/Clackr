"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Keyboard, Zap, Sparkles, BarChart3, Volume2 } from "lucide-react";

export default function ShareClient() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar filling
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    // Redirect to home page
    const timer = setTimeout(() => {
      router.replace("/");
    }, 1100);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#08090d] text-[#e8e6e3] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-clackr-accent/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 max-w-sm w-full bg-[#0c0d14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center gap-7 animate-scaleUp">
        
        {/* Glowing Keyboard Icon */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-clackr-accent to-purple-500 opacity-60 blur-md group-hover:opacity-100 transition duration-300" />
          <div className="relative w-16 h-16 rounded-2xl bg-[#10121d] border border-white/15 flex items-center justify-center text-clackr-accent shadow-2xl">
            <Keyboard className="w-8 h-8" />
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-1.5">
          <h1 className="font-mono text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            clackr
          </h1>
          <p className="text-xs text-clackr-muted/90 font-mono tracking-wide">
            minimal & distraction-free typing
          </p>
        </div>

        {/* Animated Keycaps Graphic */}
        <div className="flex items-center justify-center gap-2 my-1">
          {["C", "L", "A", "C", "K"].map((letter, idx) => (
            <div
              key={idx}
              className="w-8 h-9 rounded-lg bg-[#161826] border border-white/10 text-clackr-accent font-mono text-xs font-bold flex items-center justify-center shadow-[0_3px_0_rgba(255,255,255,0.08)] animate-bounce"
              style={{
                animationDelay: `${idx * 0.12}s`,
                animationDuration: "1.2s",
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full space-y-2.5 pt-2">
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-clackr-accent to-purple-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(108,147,217,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-clackr-muted">
            <span className="flex items-center gap-1.5 text-clackr-accent">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>Launching session...</span>
            </span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Minimal Feature Badges Footer */}
        <div className="w-full border-t border-white/5 pt-4 flex items-center justify-around text-[10px] font-mono text-clackr-muted/70">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-clackr-accent" /> WPM
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-emerald-400" /> Sounds
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-purple-400" /> Analytics
          </span>
        </div>

      </div>
    </div>
  );
}
