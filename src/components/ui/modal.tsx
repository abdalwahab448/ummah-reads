"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(8,20,15,0.82)]"
        onClick={onClose}
        aria-label="إغلاق"
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-[1.4rem] border border-[rgba(227,201,141,0.16)] bg-[linear-gradient(180deg,rgba(14,28,23,0.96),rgba(8,20,15,0.98))] p-6 text-[var(--cream)]",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="font-['Reem_Kufi'] text-lg text-[var(--cream)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--cream-dim)] transition hover:bg-[rgba(47,107,84,0.18)]"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
