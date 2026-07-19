"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  RefreshCw, 
  ArrowRight, 
  Camera, 
  Target, 
  Download, 
  Info, 
  FileText, 
  RotateCcw
} from "lucide-react";
import { getCharStats, calculateConsistency } from "@/lib/statsCalculator";

// Import modal subcomponents
import ShareModal from "./ShareModal";
import WordReviewModal from "./WordReviewModal";
import PracticeModal from "./PracticeModal";

interface ResultsPanelProps {
  onRestart: () => void;
  onNextTest: () => void;
}

export default function ResultsPanel({ onRestart, onNextTest }: ResultsPanelProps) {
  const {
    words,
    typedWords,
    typedInput,
    currentWordIndex,
    startTime,
    endTime,
    totalKeystrokes,
    correctKeystrokes,
    wpmHistory,
    mode,
    duration,
    wordCount,
    backspaceCount,
  } = useSelector((state: RootState) => state.test);

  const { highScore } = useSelector((state: RootState) => state.results);

  // Modal states
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isWordReviewOpen, setIsWordReviewOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

  // Time calculations
  const timeTaken = startTime && endTime ? (endTime - startTime) / 1000 : 0;
  
  // Character breakdown stats
  const charStats = getCharStats(words, typedWords, typedInput, currentWordIndex);
  
  // Final speeds and accuracy
  const finalWpm = Math.max(0, Math.round((charStats.correct / 5) / (timeTaken / 60) || 0));
  const finalRaw = Math.max(0, Math.round((totalKeystrokes / 5) / (timeTaken / 60) || 0));
  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10 : 100;
  const consistency = calculateConsistency(wpmHistory);

  // Identify wrong words in this session
  const thisTestWrongWords = words
    .map((w, i) => (i < typedWords.length && typedWords[i] !== w ? w : null))
    .filter((w): w is string => w !== null);

  // Auto-save wrong words to all-time practice list on mount
  useEffect(() => {
    if (thisTestWrongWords.length > 0 && typeof window !== "undefined") {
      const saved = localStorage.getItem("clackr_practice_words");
      let allTime: string[] = [];
      if (saved) {
        try {
          allTime = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
      // Merge, deduplicate, and limit to 100 words
      const merged = Array.from(new Set([...allTime, ...thisTestWrongWords])).slice(0, 100);
      localStorage.setItem("clackr_practice_words", JSON.stringify(merged));
    }
  }, []);

  // Format Recharts data
  const chartData = wpmHistory.length > 0 
    ? wpmHistory 
    : [{ time: 1, wpm: finalWpm, rawWpm: finalRaw }];

  const isNewHighScore = finalWpm > 0 && finalWpm >= highScore;

  // Handlers for JSON/CSV downloads
  const handleDownloadJSON = () => {
    const statsObj = {
      wpm: finalWpm,
      raw: finalRaw,
      accuracy: `${accuracy}%`,
      consistency: `${consistency}%`,
      time: `${timeTaken.toFixed(1)}s`,
      fixes: backspaceCount,
      mode,
      details: {
        correct: charStats.correct,
        incorrect: charStats.incorrect,
        extra: charStats.extra,
        missed: charStats.missed,
      },
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(statsObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clackr-${finalWpm}wpm.json`;
    link.click();
    setIsDownloadDropdownOpen(false);
  };

  const handleDownloadCSV = () => {
    const headers = "WPM,Raw,Accuracy,Consistency,Time,Fixes,Correct,Incorrect,Extra,Missed,Mode,Date\n";
    const row = `${finalWpm},${finalRaw},${accuracy}%,${consistency}%,${timeTaken.toFixed(1)}s,${backspaceCount},${charStats.correct},${charStats.incorrect},${charStats.extra},${charStats.missed},${mode},"${new Date().toLocaleString()}"\n`;
    
    const blob = new Blob([headers + row], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clackr-${finalWpm}wpm.csv`;
    link.click();
    setIsDownloadDropdownOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 transition-opacity duration-300 animate-fadeIn py-3 px-4 flex-1 justify-center">
      
      {/* Top Section: Vertical Stats Left + Chart Right */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_3.5fr] gap-6 md:gap-8 items-center">
        
        {/* Left Column: Vertical Large Metrics */}
        <div className="flex flex-col gap-4 justify-center">
          
          {/* WPM Block */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-clackr-fg/60 text-xs font-mono uppercase tracking-wider">
              <span>wpm</span>
              <span title="Words Per Minute (correct chars / 5 / time)">
                <Info className="w-3 h-3 opacity-60 cursor-help" />
              </span>
            </div>
            <span className="font-mono text-7xl md:text-8xl font-extrabold text-clackr-accent leading-none mt-1">
              {finalWpm}
            </span>
          </div>

          {/* Accuracy Block */}
          <div className="flex flex-col">
            <span className="text-clackr-fg/60 text-xs font-mono uppercase tracking-wider">accuracy</span>
            <span className="font-mono text-4xl md:text-5xl font-bold text-clackr-fg leading-none mt-1">
              {accuracy}%
            </span>
          </div>

          {/* Personal Best Block */}
          <div className="flex flex-col">
            <span className="text-clackr-fg/60 text-xs font-mono uppercase tracking-wider">personal best</span>
            <span className="font-mono text-4xl md:text-5xl font-bold text-clackr-fg leading-none mt-1">
              {isNewHighScore ? finalWpm : highScore || finalWpm}
            </span>
            {isNewHighScore && (
              <span className="text-xs text-clackr-accent font-mono mt-1 font-medium tracking-wide">
                New Personal Best!
              </span>
            )}
          </div>

          {/* Test Type Block */}
          <div className="flex flex-col">
            <span className="text-clackr-fg/50 text-[10px] font-mono uppercase tracking-wider">test type</span>
            <span className="font-mono text-xs md:text-sm font-bold text-clackr-accent mt-0.5 capitalize">
              {mode} {mode === "time" ? duration : mode === "words" ? wordCount : ""}
            </span>
            <span className="text-[10px] text-clackr-fg/60 font-mono">
              english
            </span>
          </div>

        </div>

        {/* Right Column: Chart */}
        <div className="w-full h-72 md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148, 140, 124, 0.08)" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="var(--fg-color)" 
                opacity={0.4} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--fg-color)" 
                opacity={0.4} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--keycap-bg)", 
                  borderColor: "rgba(148, 140, 124, 0.15)",
                  color: "var(--fg-color)",
                  fontFamily: "monospace",
                  borderRadius: "8px"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="wpm" 
                name="wpm"
                stroke="var(--accent)" 
                strokeWidth={2.5} 
                dot={{ stroke: "var(--accent)", strokeWidth: 1, r: 2 }} 
                activeDot={{ r: 4 }} 
              />
              <Line 
                type="monotone" 
                dataKey="rawWpm" 
                name="raw"
                stroke="var(--fg-muted)" 
                strokeDasharray="3 3"
                strokeWidth={1.5} 
                opacity={0.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Middle Divider */}
      <div className="w-full h-px bg-clackr-muted/10" />

      {/* Bottom Section: Row of smaller stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-left">
        
        {/* Raw Speed */}
        <div className="flex flex-col">
          <span className="text-xs text-clackr-fg/60 font-mono uppercase tracking-wider">raw</span>
          <span className="font-mono text-2xl md:text-3xl font-bold text-clackr-accent mt-1">
            {finalRaw}
          </span>
        </div>

        {/* Characters stats */}
        <div className="flex flex-col">
          <span className="text-xs text-clackr-fg/60 font-mono uppercase tracking-wider">characters</span>
          <span className="font-mono text-2xl md:text-3xl font-bold text-clackr-accent mt-1">
            {charStats.correct}/{charStats.incorrect}/{charStats.extra}/{charStats.missed}
          </span>
        </div>

        {/* Consistency */}
        <div className="flex flex-col">
          <span className="text-xs text-clackr-fg/60 font-mono uppercase tracking-wider">consistency</span>
          <span className="font-mono text-2xl md:text-3xl font-bold text-clackr-accent mt-1">
            {consistency}%
          </span>
        </div>

        {/* Time */}
        <div className="flex flex-col">
          <span className="text-xs text-clackr-fg/60 font-mono uppercase tracking-wider">time</span>
          <span className="font-mono text-2xl md:text-3xl font-bold text-clackr-accent mt-1">
            {timeTaken.toFixed(0)}s
          </span>
        </div>

        {/* Fixes */}
        <div className="flex flex-col">
          <span className="text-xs text-clackr-fg/60 font-mono uppercase tracking-wider">fixes</span>
          <span className="font-mono text-2xl md:text-3xl font-bold text-clackr-accent mt-1">
            {backspaceCount}
          </span>
          <span className="text-[10px] text-clackr-fg/60 font-mono mt-1 leading-none">
            backspaces
          </span>
        </div>

      </div>

      {/* Bottom Section: Action icons and labels */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-3 text-clackr-fg/70 text-sm font-mono mt-1 relative select-none">
        
        <button 
          onClick={onNextTest} 
          className="flex items-center gap-2 hover:text-clackr-accent transition-colors duration-150 py-1"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Next Test</span>
        </button>

        <button 
          onClick={onRestart} 
          className="flex items-center gap-2 hover:text-clackr-accent transition-colors duration-150 py-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart</span>
        </button>

        <button 
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-2 hover:text-clackr-accent transition-colors duration-150 py-1"
        >
          <Camera className="w-4 h-4" />
          <span>Screenshot</span>
        </button>

        <button 
          onClick={() => setIsWordReviewOpen(true)}
          className="flex items-center gap-2 hover:text-clackr-accent transition-colors duration-150 py-1"
        >
          <FileText className="w-4 h-4" />
          <span>Word Review</span>
        </button>

        <button 
          onClick={() => setIsPracticeOpen(true)}
          className="flex items-center gap-2 hover:text-clackr-accent transition-colors duration-150 py-1"
        >
          <Target className="w-4 h-4" />
          <span>Practice Words</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsDownloadDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 hover:text-clackr-accent transition-colors duration-150 py-1"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          {isDownloadDropdownOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 min-w-[120px] bg-clackr-bg border border-clackr-muted/20 rounded-lg shadow-xl p-1.5 flex flex-col gap-1 text-xs text-clackr-fg select-none">
              <button 
                onClick={handleDownloadJSON}
                className="w-full text-left py-1.5 px-3 rounded hover:bg-clackr-fg/5 hover:text-clackr-accent transition-all text-xs font-semibold"
              >
                JSON format
              </button>
              <button 
                onClick={handleDownloadCSV}
                className="w-full text-left py-1.5 px-3 rounded hover:bg-clackr-fg/5 hover:text-clackr-accent transition-all text-xs font-semibold"
              >
                CSV format
              </button>
            </div>
          )}
        </div>

      </div>

      {/* RENDER MODALS */}
      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        finalWpm={finalWpm}
        accuracy={accuracy}
        finalRaw={finalRaw}
        consistency={consistency}
        timeTaken={timeTaken}
        mode={mode}
        duration={duration}
        wordCount={wordCount}
        backspaceCount={backspaceCount}
        chartData={chartData}
        isNewHighScore={isNewHighScore}
        highScore={highScore}
      />

      <WordReviewModal 
        isOpen={isWordReviewOpen}
        onClose={() => setIsWordReviewOpen(false)}
        words={words}
        typedWords={typedWords}
      />

      <PracticeModal 
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
        thisTestWrongWords={thisTestWrongWords}
      />

    </div>
  );
}
