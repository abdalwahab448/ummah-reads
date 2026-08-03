import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", ...props },
  ref
) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5";

  const variants = {
    primary: "border-[#c9a15e]/40 bg-[var(--gold-soft)] text-[var(--ink)] hover:bg-[var(--gold)]",
    secondary: "border-[#c9a15e]/20 bg-[#0a1713] text-[var(--cream)] hover:border-[#c9a15e]/40 hover:bg-[#10241d] hover:text-[var(--gold-soft)]",
    ghost: "border-transparent bg-transparent text-[var(--cream-dim)] hover:bg-[#10241d] hover:text-[var(--cream)]"
  };

  return <button ref={ref} className={cn(base, variants[variant], className)} {...props} />;
});