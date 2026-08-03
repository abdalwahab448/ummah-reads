"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type Toast = ToastInput & {
  id: string;
};

type ToastContextValue = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function iconForVariant(variant: ToastVariant) {
  if (variant === "success") {
    return CheckCircle2;
  }

  if (variant === "error") {
    return XCircle;
  }

  return AlertTriangle;
}

export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = crypto.randomUUID();
    const nextToast: Toast = {
      id,
      title: input.title,
      description: input.description,
      variant: input.variant ?? "info"
    };

    setToasts((current) => [nextToast, ...current].slice(0, 4));
    return id;
  }, []);

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timers = toasts.map((currentToast) =>
      window.setTimeout(() => {
        setToasts((items) => items.filter((item) => item.id !== currentToast.id));
      }, 4200)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts]);

  const value = useMemo(() => ({ toast, dismiss }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed left-4 top-4 z-[70] grid w-[min(92vw,24rem)] gap-3 sm:left-6 sm:top-6">
        {toasts.map((item) => {
          const variant = item.variant ?? "info";
          const Icon = iconForVariant(variant);
          const palette =
            variant === "success"
              ? "border-[rgba(47,107,84,0.5)] bg-[rgba(14,28,23,0.94)] text-[var(--cream)]"
              : variant === "error"
                ? "border-rose-400/40 bg-[rgba(14,28,23,0.94)] text-[var(--cream)]"
                : "border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.94)] text-[var(--cream)]";

          return (
            <div
              key={item.id}
              className={cn(
                "pointer-events-auto rounded-[1rem] border p-4 text-[var(--cream)]",
                palette
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-sm border border-[#f3efe4]/10 bg-[#0a1512] p-2">
                  <Icon className="h-4 w-4 text-[var(--gold-soft)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--cream)]">{item.title}</p>
                  {item.description ? <p className="mt-1 text-sm leading-6 text-[var(--cream-dim)]">{item.description}</p> : null}
                </div>
                <button
                  type="button"
                  className="rounded-sm p-1 transition hover:bg-[#1b4d3e]/40"
                  onClick={() => dismiss(item.id)}
                  aria-label="إغلاق الإش notif"
                >
                  <X className="h-4 w-4 text-[var(--cream-dim)]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}