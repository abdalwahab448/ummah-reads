"use client";

import { motion } from "framer-motion";
import { Landmark, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type CenterCardProps = {
  id: string;
  title: string;
  subtitle: string;
  accentLabel?: string;
  hint?: string;
  isActive?: boolean;
  canEnter?: boolean;
  bgImage?: string;
  characterImage?: string;
  className?: string;
  onSelectCenter?: (id: string) => void;
};

export function CenterCard({
  id,
  title,
  subtitle,
  accentLabel = "مركز",
  hint = "دخول بصلاحيات المشرف",
  isActive = false,
  canEnter = true,
  bgImage = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
  characterImage = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
  className,
  onSelectCenter
}: CenterCardProps) {
  function persistActiveCenter(centerId: string) {
    if (typeof window === "undefined") {
      return;
    }

    document.cookie = `ummah-reads-active-center=${encodeURIComponent(centerId)}; path=/; max-age=86400`;
    window.localStorage.setItem("activeCenterId", centerId);
  }

  function handleSelect() {
    if (!canEnter) {
      return;
    }

    persistActiveCenter(id);
    onSelectCenter?.(id);
  }

  return (
    <motion.button
      type="button"
      onClick={handleSelect}
      whileHover={{ y: -12, scale: 1.02, rotateX: -2, rotateY: 3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={cn(
        "group relative h-[380px] min-h-[380px] overflow-hidden rounded-[1.4rem] border border-[#c9a15e]/20 bg-[rgba(8,20,15,0.92)] text-right shadow-[0_28px_60px_rgba(0,0,0,0.35)] transition-all duration-300",
        canEnter ? "cursor-pointer hover:border-[#c9a15e]/40" : "cursor-not-allowed opacity-80",
        isActive ? "ring-2 ring-[var(--gold-soft)]" : "",
        className
      )}
      aria-label={`الدخول إلى ${title}`}
    >
      <div className="absolute inset-0">
        <img src={bgImage} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,14,11,0.2),rgba(6,14,11,0.9))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(227,201,141,0.18),transparent_50%)]" />
      </div>

      <div className="absolute inset-0 rounded-[1.4rem] border border-[#c9a15e]/20" />

      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-[#c9a15e]/20 bg-[rgba(8,20,15,0.75)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
        <Sparkles className="h-3.5 w-3.5" />
        {accentLabel}
      </div>

      <div className="absolute right-4 top-4 z-20 rounded-full border border-[#c9a15e]/20 bg-[rgba(8,20,15,0.72)] p-2 text-[var(--cream)]">
        <Landmark className="h-4 w-4" />
      </div>

      <div className="absolute bottom-0 left-1/2 z-20 w-[78%] -translate-x-1/2 translate-y-4 transition duration-500 group-hover:-translate-y-8 group-hover:scale-110">
        <img src={characterImage} alt="books illustration" className="w-full rounded-[1rem] object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.7)]" />
      </div>

      <div className="relative z-30 flex h-full flex-col justify-end p-6">
        <div className="rounded-[1rem] border border-[#c9a15e]/20 bg-[#0a1713]/90 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--gold-soft)]">
            {subtitle}
          </p>
          <h3 className="mt-2 font-['Reem_Kufi'] text-2xl text-[var(--cream)]">{title}</h3>
          <div className="mt-4 inline-flex rounded-full border border-[rgba(227,201,141,0.24)] bg-[rgba(227,201,141,0.12)] px-3 py-1.5 text-sm font-semibold text-[var(--gold-soft)]">
            {hint}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
