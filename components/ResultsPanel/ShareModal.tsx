"use client";

import React, { useRef, useEffect } from "react";
import { X, Copy, Download, Share2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  finalWpm: number;
  accuracy: number;
  finalRaw: number;
  consistency: number;
  timeTaken: number;
  mode: string;
  duration: number;
  wordCount: number;
  backspaceCount: number;
  chartData: any[];
  isNewHighScore: boolean;
  highScore: number;
}

export default function ShareModal({
  isOpen,
  onClose,
  finalWpm,
  accuracy,
  finalRaw,
  consistency,
  timeTaken,
  mode,
  duration,
  wordCount,
  backspaceCount,
  chartData,
  isNewHighScore,
  highScore,
}: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Formats date
  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const shareText = `clackr typing speed: ${finalWpm} WPM | Accuracy: ${accuracy}% | Raw: ${finalRaw} WPM | Mode: ${mode} ${mode === "time" ? duration : mode === "words" ? wordCount : ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert("Results copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDownload = () => {
    // Dynamically draw on canvas for a crisp PNG download
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fetch theme colors dynamically
    const style = window.getComputedStyle(document.documentElement);
    const bgColor = style.getPropertyValue("--bg-color").trim() || "#211F1C";
    const fgColor = style.getPropertyValue("--fg-color").trim() || "#F0E9DC";
    const accentColor = style.getPropertyValue("--accent").trim() || "#6C93D9";
    const mutedColor = style.getPropertyValue("--fg-muted").trim() || "#948C7C";

    // 1. Draw Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Header
    ctx.font = "bold 24px monospace";
    ctx.fillStyle = accentColor;
    ctx.fillText("clackr", 50, 60);

    ctx.font = "14px monospace";
    ctx.fillStyle = mutedColor;
    const dateText = `${formattedDate} | clackr.theshiva.xyz`;
    ctx.fillText(dateText, canvas.width - ctx.measureText(dateText).width - 50, 58);

    // 3. Draw Left Large Metrics
    // WPM
    ctx.font = "14px monospace";
    ctx.fillStyle = mutedColor;
    ctx.fillText("WPM", 50, 130);
    ctx.font = "bold 72px monospace";
    ctx.fillStyle = accentColor;
    ctx.fillText(String(finalWpm), 50, 195);

    // Accuracy
    ctx.font = "14px monospace";
    ctx.fillStyle = mutedColor;
    ctx.fillText("Accuracy", 50, 240);
    ctx.font = "bold 36px monospace";
    ctx.fillStyle = fgColor;
    ctx.fillText(`${accuracy}%`, 50, 280);

    // PB / Test Type
    ctx.font = "14px monospace";
    ctx.fillStyle = mutedColor;
    ctx.fillText("Test Type", 50, 325);
    ctx.font = "bold 20px monospace";
    ctx.fillStyle = accentColor;
    const testTypeText = `${mode} ${mode === "time" ? duration : mode === "words" ? wordCount : ""}`.toUpperCase();
    ctx.fillText(testTypeText, 50, 350);

    // 4. Draw Simplified Chart on Right
    const chartX = 350;
    const chartY = 120;
    const chartW = 400;
    const chartH = 220;

    // Draw chart boundary lines (axes)
    ctx.strokeStyle = "rgba(148, 140, 124, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartX, chartY + chartH);
    ctx.lineTo(chartX + chartW, chartY + chartH);
    ctx.stroke();

    // Plot WPM path
    if (chartData && chartData.length > 0) {
      const maxVal = Math.max(...chartData.map((d) => Math.max(d.wpm || 0, d.rawWpm || 0)), 40);
      const points = chartData.map((d, i) => {
        const x = chartX + (i / (chartData.length - 1 || 1)) * chartW;
        const y = chartY + chartH - ((d.wpm || 0) / maxVal) * chartH;
        return { x, y };
      });

      // Draw line
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Draw dots
      ctx.fillStyle = accentColor;
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 5. Draw Bottom Stats
    ctx.font = "12px monospace";
    ctx.fillStyle = mutedColor;
    ctx.fillText("RAW", 50, 405);
    ctx.fillText("CONSISTENCY", 150, 405);
    ctx.fillText("TIME", 300, 405);
    ctx.fillText("FIXES", 420, 405);

    ctx.font = "bold 16px monospace";
    ctx.fillStyle = fgColor;
    ctx.fillText(String(finalRaw), 50, 425);
    ctx.fillText(`${consistency}%`, 150, 425);
    ctx.fillText(`${timeTaken.toFixed(0)}s`, 300, 425);
    ctx.fillText(String(backspaceCount), 420, 425);

    // 6. Trigger Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `clackr-${finalWpm}wpm.png`;
    link.href = dataUrl;
    link.click();
  };

  const handlePost = () => {
    alert("Simulated share: Results shared to social media feed!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div ref={modalRef} className="relative w-full max-w-3xl bg-clackr-bg border border-clackr-muted/20 rounded-2xl p-6 shadow-2xl animate-scaleUp">
        
        <button 
          onClick={onClose} 
          aria-label="Close share modal"
          className="absolute top-4 right-4 text-clackr-muted hover:text-clackr-fg transition-colors duration-150"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-clackr-fg font-mono text-xl font-bold mb-6">Share your result</h2>

        {/* Card Container Preview */}
        <div 
          ref={cardRef}
          className="w-full bg-clackr-bg border border-clackr-muted/15 rounded-xl p-8 flex flex-col gap-8 select-none relative"
        >
          {/* Top Info */}
          <div className="flex justify-between items-center text-clackr-muted text-xs font-mono">
            <span className="text-clackr-accent font-bold text-lg">clackr</span>
            <span>{formattedDate} | clackr.theshiva.xyz</span>
          </div>

          {/* Main Block */}
          <div className="grid grid-cols-[1.5fr_3fr] gap-6 items-center">
            
            {/* Large Stats Left */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-clackr-muted text-[10px] uppercase font-mono tracking-wider">wpm</span>
                <span className="font-mono text-5xl font-extrabold text-clackr-accent mt-0.5 leading-none">
                  {finalWpm}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-clackr-muted text-[10px] uppercase font-mono tracking-wider">accuracy</span>
                <span className="font-mono text-2xl font-bold text-clackr-fg mt-0.5 leading-none">
                  {accuracy}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-clackr-muted text-[10px] uppercase font-mono tracking-wider">test type</span>
                <span className="font-mono text-sm font-bold text-clackr-accent mt-0.5 capitalize leading-none">
                  {mode} {mode === "time" ? duration : mode === "words" ? wordCount : ""}
                </span>
              </div>
            </div>

            {/* Static Simple Graph Right */}
            <div className="w-full h-44 bg-clackr-fg/[0.02] border border-clackr-muted/5 rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="var(--accent)" 
                    strokeWidth={2} 
                    dot={{ stroke: "var(--accent)", strokeWidth: 1, r: 1.5 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-4 gap-4 text-left border-t border-clackr-muted/10 pt-4 text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-clackr-muted uppercase text-[10px] tracking-wider">raw</span>
              <span className="text-clackr-fg font-bold text-base mt-0.5">{finalRaw}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-clackr-muted uppercase text-[10px] tracking-wider">consistency</span>
              <span className="text-clackr-fg font-bold text-base mt-0.5">{consistency}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-clackr-muted uppercase text-[10px] tracking-wider">time</span>
              <span className="text-clackr-fg font-bold text-base mt-0.5">{timeTaken.toFixed(0)}s</span>
            </div>
            <div className="flex flex-col">
              <span className="text-clackr-muted uppercase text-[10px] tracking-wider">fixes</span>
              <span className="text-clackr-fg font-bold text-base mt-0.5">{backspaceCount}</span>
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-8 mt-6 text-clackr-muted font-mono text-sm">
          <button 
            onClick={handleCopy} 
            className="flex items-center gap-2 hover:text-clackr-fg transition-colors duration-150 py-2 px-4 rounded-lg hover:bg-clackr-fg/5"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          
          <button 
            onClick={handleDownload} 
            className="flex items-center gap-2 hover:text-clackr-fg transition-colors duration-150 py-2 px-4 rounded-lg hover:bg-clackr-fg/5"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          <button 
            onClick={handlePost} 
            className="flex items-center gap-2 hover:text-clackr-fg transition-colors duration-150 py-2 px-4 rounded-lg hover:bg-clackr-fg/5"
          >
            <Share2 className="w-4 h-4" />
            <span>Post</span>
          </button>
        </div>

      </div>
    </div>
  );
}
