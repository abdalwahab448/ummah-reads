import { cn } from "@/lib/utils";

type TabItem<T extends string> = {
  id: T;
  label: string;
};

type TabSwitcherProps<T extends string> = {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
};

export function TabSwitcher<T extends string>({ tabs, activeTab, onChange, className }: TabSwitcherProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex min-h-10 items-center justify-center rounded-full border px-3.5 py-2 text-sm font-semibold transition-all duration-300 ${
              isActive
                ? "border-[#c9a15e]/40 bg-[#10241d] text-[var(--gold-soft)]"
                : "border-[#c9a15e]/20 bg-[#0a1713] text-[var(--cream-dim)] hover:border-[#c9a15e]/40 hover:text-[var(--cream)]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
