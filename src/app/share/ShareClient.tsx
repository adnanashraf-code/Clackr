"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Keyboard, ArrowRight, Zap, Target, Volume2, BarChart2 } from "lucide-react";

export default function ShareClient() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    // Automatically redirect human visitors to the home page typing test
    const timer = setTimeout(() => {
      router.replace("/");
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#e8e6e3] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Subtle ambient backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-clackr-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 max-w-md w-full bg-[#0d0f17]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center gap-6 animate-scaleUp">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-clackr-accent/15 border border-clackr-accent/30 flex items-center justify-center text-clackr-accent shadow-lg shadow-clackr-accent/10">
            <Keyboard className="w-5 h-5" />
          </div>
          <span className="font-mono text-3xl font-extrabold tracking-tight text-white">
            clackr
          </span>
        </div>

        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clackr-accent/10 border border-clackr-accent/20 text-clackr-accent text-xs font-mono font-medium">
          <Zap className="w-3.5 h-3.5" />
          <span>Typing Speed Challenge</span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Think you can beat the score?
          </h1>
          <p className="text-xs text-clackr-muted font-sans leading-relaxed">
            Minimal, distraction-free typing test with real-time WPM, accuracy analytics, and mechanical key sounds.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full text-xs font-mono text-clackr-muted">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
            <Zap className="w-4 h-4 text-clackr-accent" />
            <span>Instant WPM</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Accuracy Stats</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Mech Sounds</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>Live Analytics</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/"
          className="w-full mt-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-clackr-accent text-black font-mono font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-clackr-accent/20 group"
        >
          <span>Start Typing Test</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Auto-redirect status indicator */}
        {redirecting && (
          <div className="flex items-center gap-2 text-[11px] font-mono text-clackr-muted/80 pt-1">
            <span className="w-2 h-2 rounded-full bg-clackr-accent animate-ping" />
            <span>Redirecting to typing test...</span>
          </div>
        )}
      </div>
    </div>
  );
}
