"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";

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

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmModal(options);
  }, []);

  const handleConfirmAction = () => {
    if (confirmModal) {
      confirmModal.onConfirm();
      setConfirmModal(null);
    }
  };

  const handleCancelAction = () => {
    setConfirmModal(null);
  };

  return (
    <ToastContext.Provider
      value={{
        toast: {
          success: (msg) => addToast("success", msg),
          info: (msg) => addToast("info", msg),
          warning: (msg) => addToast("warning", msg),
          error: (msg) => addToast("error", msg),
          confirm,
        },
      }}
    >
      {children}

      {/* Floating Toasts Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-fadeIn"
            style={{
              backgroundColor: "var(--bg-color)",
              borderColor:
                t.type === "success"
                  ? "rgba(46, 213, 115, 0.4)"
                  : t.type === "warning"
                  ? "rgba(255, 171, 0, 0.4)"
                  : t.type === "error"
                  ? "var(--error)"
                  : "var(--accent)",
              color: "var(--fg-color)",
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
              onClick={() => removeToast(t.id)}
              className="text-clackr-muted hover:text-clackr-fg p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Custom Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fadeIn select-none">
          <div
            className="bg-clackr-bg border border-clackr-muted/20 w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--fg-color)" }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-clackr-error/10 border border-clackr-error/20 text-clackr-error shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-mono text-sm font-bold text-clackr-fg">
                  {confirmModal.title || "Confirm Action"}
                </h3>
                <p className="font-sans text-xs text-clackr-muted leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-clackr-muted/10 font-mono text-xs">
              <button
                onClick={handleCancelAction}
                className="px-4 py-2 rounded-xl border border-clackr-muted/20 hover:bg-clackr-fg/5 text-clackr-muted hover:text-clackr-fg transition-all"
              >
                {confirmModal.cancelText || "Cancel"}
              </button>
              <button
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
