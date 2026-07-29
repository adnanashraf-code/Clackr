"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info";
  onConfirm: () => void;
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
    error: (msg: string) => void;
    confirm: (options: ConfirmOptions) => void;
  };
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmOptions | null>(null);
  const confirmModalRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Clean up all toast timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    const existingTimer = timersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = typeof crypto !== "undefined" && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 9);
      
    setToasts((prev) => [...prev, { id, type, message }]);

    const timer = setTimeout(() => {
      removeToast(id);
    }, 3200);

    timersRef.current.set(id, timer);
  }, [removeToast]);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmModal(options);
  }, []);

  const handleCancelAction = useCallback(() => {
    setConfirmModal(null);
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (confirmModal) {
      confirmModal.onConfirm();
      setConfirmModal(null);
    }
  }, [confirmModal]);

  // Focus trap for confirm modal
  useModalFocusTrap(!!confirmModal, handleCancelAction, confirmModalRef);

  // Keyboard shortcut for confirm modal (Enter key to confirm)
  useEffect(() => {
    if (!confirmModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleConfirmAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmModal, handleConfirmAction]);

  const toastApi = useMemo(
    () => ({
      success: (msg: string) => addToast("success", msg),
      info: (msg: string) => addToast("info", msg),
      warning: (msg: string) => addToast("warning", msg),
      error: (msg: string) => addToast("error", msg),
      confirm,
    }),
    [addToast, confirm]
  );

  return (
    <ToastContext.Provider value={{ toast: toastApi }}>
      {children}

      {/* Floating Toasts Container */}
      <div 
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4"
        aria-live="polite"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-fadeIn bg-clackr-bg text-clackr-fg"
            style={{
              borderColor:
                t.type === "success"
                  ? "rgba(46, 213, 115, 0.4)"
                  : t.type === "warning"
                  ? "rgba(255, 171, 0, 0.4)"
                  : t.type === "error"
                  ? "var(--error)"
                  : "var(--accent)",
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {t.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {t.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {t.type === "error" && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              {t.type === "info" && <Info className="w-4 h-4 text-clackr-accent shrink-0" />}
              <span className="font-sans text-xs font-semibold truncate">{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss toast"
              className="text-clackr-muted hover:text-clackr-fg p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Custom Confirmation Modal */}
      {confirmModal && (
        <div 
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fadeIn select-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div
            ref={confirmModalRef}
            className="bg-clackr-bg border border-clackr-muted/20 w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4 text-clackr-fg"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-clackr-error/10 border border-clackr-error/20 text-clackr-error shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 id="confirm-modal-title" className="font-mono text-sm font-bold text-clackr-fg">
                  {confirmModal.title || "Confirm Action"}
                </h3>
                <p className="font-sans text-xs text-clackr-muted leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-clackr-muted/10 font-mono text-xs">
              <button
                type="button"
                onClick={handleCancelAction}
                className="px-4 py-2 rounded-xl border border-clackr-muted/20 hover:bg-clackr-fg/5 text-clackr-muted hover:text-clackr-fg transition-all"
              >
                {confirmModal.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-4 py-2 rounded-xl bg-clackr-error/90 hover:bg-clackr-error text-white font-bold transition-all shadow-md active:scale-95"
              >
                {confirmModal.confirmText || "Yes, Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
