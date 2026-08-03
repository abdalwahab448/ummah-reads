"use client";

import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ToastProvider>{children}</ToastProvider>;
}