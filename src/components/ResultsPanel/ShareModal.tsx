"use client";

import React, { useRef, useMemo, useCallback } from "react";
import { X, Copy, Download, Share2 } from "lucide-react";
import { useToast } from "@/components/Toast/ToastContext";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";

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
}: ShareModalProps) {
  const toast = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Use reusable focus trap and keyboard shortcut (Escape) hook
  useModalFocusTrap(isOpen, onClose, modalRef);

  // Formats date memoized
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const shareText = useMemo(() => {
    return `clackr typing speed: ${finalWpm} WPM | Accuracy: ${accuracy}% | Raw: ${finalRaw} WPM | Mode: ${mode} ${mode === "time" ? `${duration}s` : mode === "words" ? wordCount : ""}`;
  }, [finalWpm, accuracy, finalRaw, mode, duration, wordCount]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Results copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy results.");
    }
  }, [shareText, toast]);

  const generateCanvasBlob = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 450;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      // Fetch theme colors dynamically
      const style = window.getComputedStyle(document.documentElement);
      const bgColor = style.getPropertyValue("--bg-color").trim() || "#08090d";
      const fgColor = style.getPropertyValue("--fg-color").trim() || "#e8e6e3";
      const accentColor = style.getPropertyValue("--accent").trim() || "#6C93D9";
      const mutedColor = style.getPropertyValue("--fg-muted").trim() || "#646669";

      // 1. Draw Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Header
      ctx.font = "bold 24px monospace";
      ctx.fillStyle = accentColor;
      ctx.fillText("clackr", 50, 60);

      ctx.font = "14px monospace";
      ctx.fillStyle = mutedColor;
      const dateText = `${formattedDate} | clackr-plum.vercel.app`;
      ctx.fillText(dateText, canvas.width - ctx.measureText(dateText).width - 50, 58);

      // 3. Draw Left Large Metrics
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

      ctx.strokeStyle = "rgba(148, 140, 124, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartX, chartY + chartH);
      ctx.lineTo(chartX + chartW, chartY + chartH);
      ctx.stroke();

      if (chartData && chartData.length > 0) {
        const maxVal = Math.max(...chartData.map((d) => Math.max(d.wpm || 0, d.rawWpm || 0)), 40);
        const points = chartData.map((d, i) => {
          const x = chartX + (i / (chartData.length - 1 || 1)) * chartW;
          const y = chartY + chartH - ((d.wpm || 0) / maxVal) * chartH;
          return { x, y };
        });

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

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

      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }, [formattedDate, finalWpm, accuracy, mode, duration, wordCount, chartData, finalRaw, consistency, timeTaken, backspaceCount]);

  const handleDownload = useCallback(async () => {
    const blob = await generateCanvasBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `clackr-${finalWpm}wpm.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Results score card downloaded!");
  }, [generateCanvasBlob, finalWpm, toast]);

  /**
   * Opens Twitter/X post composer with pre-filled test result statistics
   * and the clackr homepage URL for social card rendering (og.png).
   */
  const handlePost = useCallback(() => {
    const testDurationText = mode === "time" ? `${duration} sec` : `${timeTaken.toFixed(0)}s`;
    const tweetText = `Just hit ${finalWpm} WPM with ${accuracy}% accuracy in a ${testDurationText} test.\n\nThink you can beat me? Try clackr, a minimal distraction-free typing test.`;
    const shareUrl = "https://clackr-plum.vercel.app/share";

    const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening X (Twitter) to post!");
  }, [mode, duration, timeTaken, finalWpm, accuracy, toast]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div 
        ref={modalRef} 
        className="relative w-full max-w-3xl bg-clackr-bg border border-clackr-muted/20 rounded-2xl p-6 shadow-2xl animate-scaleUp text-clackr-fg font-mono"
      >
        <button 
          type="button"
          onClick={onClose} 
          aria-label="Close share modal"
          className="absolute top-4 right-4 text-clackr-muted hover:text-clackr-fg transition-colors duration-150 p-1 rounded-lg hover:bg-clackr-fg/5"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="share-modal-title" className="text-clackr-fg font-mono text-xl font-bold mb-6 select-none">
          Share your result
        </h2>

        {/* Card Container Preview */}
        <div 
          ref={cardRef}
          className="w-full bg-clackr-bg border border-clackr-muted/15 rounded-xl p-8 flex flex-col gap-8 select-none relative"
        >
          {/* Top Info */}
          <div className="flex justify-between items-center text-clackr-muted text-xs font-mono">
            <span className="text-clackr-accent font-bold text-lg">clackr</span>
            <span>{formattedDate} | clackr-plum.vercel.app</span>
          </div>

          {/* Main Block */}
          <div className="grid grid-cols-[1.5fr_3fr] gap-6 items-center">
            {/* Stats Left */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-clackr-muted uppercase">wpm</span>
                <span className="text-6xl font-extrabold text-clackr-accent leading-none mt-1">{finalWpm}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-clackr-muted uppercase">accuracy</span>
                <span className="text-3xl font-bold text-clackr-fg leading-none mt-1">{accuracy}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-clackr-muted uppercase">test type</span>
                <span className="text-xs font-bold text-clackr-accent uppercase mt-1">
                  {mode} {mode === "time" ? duration : mode === "words" ? wordCount : ""}
                </span>
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="p-4 rounded-xl border border-clackr-muted/10 bg-clackr-fg/[0.01] flex flex-col gap-3">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-clackr-muted uppercase">raw</span>
                  <span className="text-sm font-bold text-clackr-fg">{finalRaw}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-clackr-muted uppercase">consistency</span>
                  <span className="text-sm font-bold text-clackr-fg">{consistency}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-clackr-muted uppercase">time</span>
                  <span className="text-sm font-bold text-clackr-fg">{timeTaken.toFixed(0)}s</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-clackr-muted uppercase">fixes</span>
                  <span className="text-sm font-bold text-clackr-fg">{backspaceCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 mt-6 pt-4 border-t border-clackr-muted/10 select-none" role="toolbar" aria-label="Share modal action options">
          <button 
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-clackr-muted/20 hover:border-clackr-fg text-xs font-semibold text-clackr-fg transition-all hover:bg-clackr-fg/5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Text</span>
          </button>

          <button 
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-clackr-muted/20 hover:border-clackr-fg text-xs font-semibold text-clackr-fg transition-all hover:bg-clackr-fg/5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Image</span>
          </button>

          <button 
            type="button"
            onClick={handlePost}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-clackr-accent text-clackr-bg text-xs font-extrabold shadow-md shadow-clackr-accent/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Post to X</span>
          </button>
        </div>

      </div>
    </div>
  );
}
