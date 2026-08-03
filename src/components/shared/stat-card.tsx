import { Card } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  accent?: string;
};

export function StatCard({ label, value, delta, accent = "text-[var(--gold-soft)]" }: StatCardProps) {
  return (
    <Card className="animate-fadeUp border-[#c9a15e]/20 bg-[linear-gradient(180deg,rgba(10,23,19,0.96),rgba(7,16,13,0.98))]">
      <p className="text-sm font-semibold text-[var(--cream-dim)]">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h3 className={`text-3xl font-bold ${accent}`}>{value}</h3>
        {delta ? (
          <span className="rounded-full border border-[#c9a15e]/20 bg-[#10241d] px-3 py-1 text-xs font-semibold text-[var(--gold-soft)]">
            {delta}
          </span>
        ) : null}
      </div>
    </Card>
  );
}