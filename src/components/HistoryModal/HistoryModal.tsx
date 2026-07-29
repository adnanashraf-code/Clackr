"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearHistory, loadResults } from "@/store/resultsSlice";
import { X, Award, BarChart, Trash2 } from "lucide-react";
import { useToast } from "@/components/Toast/ToastContext";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const dispatch = useDispatch();
  const toast = useToast();
  const { history, highScore } = useSelector((state: RootState) => state.results);
  const modalRef = useRef<HTMLDivElement>(null);

  // Use reusable focus trap and keyboard shortcut (Escape) hook
  useModalFocusTrap(isOpen, onClose, modalRef);

  useEffect(() => {
    if (!isOpen) return;
    // Refresh history directly from localStorage on open
    dispatch(loadResults());
  }, [isOpen, dispatch]);

  const formatDate = useCallback((timestamp: number) => {
    if (!timestamp || isNaN(timestamp)) return "—";
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const handleClearHistory = useCallback(() => {
    toast.confirm({
      title: "Reset Records Database",
      message: "Are you sure you want to clear all history logs and reset your Personal Best WPM record?",
      confirmText: "Yes, Reset All",
      onConfirm: () => {
        dispatch(clearHistory());
        toast.success("History database wiped successfully.");
      },
    });
  }, [dispatch, toast]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-clackr-bg border border-clackr-muted/20 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-clackr-fg"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-clackr-muted/10">
          <div className="flex flex-col">
            <h2 id="history-modal-title" className="font-mono text-lg font-bold text-clackr-fg">
              clackr stats history
            </h2>
            <span className="text-[10px] text-clackr-muted font-mono uppercase tracking-widest">
              your personal typing trajectory log
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close history modal"
            className="p-1.5 rounded-lg hover:bg-clackr-muted/10 text-clackr-muted hover:text-clackr-fg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 font-sans">
          {/* Personal Best Card */}
          <div className="p-4 rounded-xl bg-clackr-accent/10 border border-clackr-accent/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-clackr-accent" />
              <div>
                <div className="text-xs text-clackr-muted uppercase font-mono tracking-wider">
                  Personal Best Speed
                </div>
                <div className="text-xl font-bold font-mono text-clackr-fg">
                  {highScore} <span className="text-sm font-semibold text-clackr-accent">WPM</span>
                </div>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-clackr-muted">
              <span>logged: {history.length} runs</span>
            </div>
          </div>

          {/* Log Table */}
          <div className="flex flex-col">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-clackr-fg mb-3">
              Recent Typing Runs
            </h3>

            {history.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-clackr-muted/10 rounded-xl">
                <BarChart className="w-10 h-10 mx-auto text-clackr-muted/30 mb-2" />
                <p className="text-sm text-clackr-muted font-sans">No typing records logged yet.</p>
                <p className="text-xs text-clackr-muted/60 font-sans mt-1">
                  Complete a typing test to see your history.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-clackr-muted/10">
                <table className="w-full text-left font-mono text-xs border-collapse" aria-label="Recent typing runs history table">
                  <thead>
                    <tr className="bg-clackr-fg/5 text-clackr-muted border-b border-clackr-muted/10">
                      <th scope="col" className="p-3">WPM</th>
                      <th scope="col" className="p-3">Raw</th>
                      <th scope="col" className="p-3">Accuracy</th>
                      <th scope="col" className="p-3">Consistency</th>
                      <th scope="col" className="p-3">Mode</th>
                      <th scope="col" className="p-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-clackr-muted/5">
                    {history.map((run) => (
                      <tr
                        key={run.id}
                        className="hover:bg-clackr-fg/5 transition-colors text-clackr-fg"
                      >
                        <td className="p-3 font-bold text-clackr-accent">{run.wpm}</td>
                        <td className="p-3 text-clackr-muted">{run.rawWpm}</td>
                        <td className="p-3">{run.accuracy}%</td>
                        <td className="p-3">{run.consistency}%</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded bg-clackr-fg/5 text-[10px] text-clackr-fg">
                            {run.configSummary}
                          </span>
                        </td>
                        <td className="p-3 text-right text-clackr-muted text-[10px]">
                          {formatDate(run.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-clackr-muted/10 flex justify-end">
            <button
              type="button"
              onClick={handleClearHistory}
              className="px-3 py-1.5 rounded hover:bg-clackr-error/15 text-clackr-error font-mono text-[11px] font-semibold flex items-center gap-1.5 border border-clackr-error/10 hover:border-clackr-error/30 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Records Database</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
