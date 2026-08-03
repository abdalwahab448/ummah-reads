"use client";

import { useState, useTransition } from "react";
import { UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type { Center, UserSession } from "@/lib/types";

type SupervisorManagerProps = {
  supervisors: UserSession[];
  centers: Center[];
};

export function SupervisorManager({ supervisors, centers }: SupervisorManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Record<string, string>>(
    Object.fromEntries(
      supervisors.map((supervisor) => [supervisor.id, supervisor.centerId ?? centers[0]?.id ?? ""])
    )
  );

  async function assignSupervisor(userId: string) {
    setProcessingId(userId);

    try {
      const response = await fetch("/api/supervisors/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, centerId: selectedCenter[userId] || null })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message ?? "تعذر تعيين المشرف");
      }

      toast({ title: "تم تعيين المشرف للمركز", variant: "success" });
      startTransition(() => router.refresh());
    } catch (error) {
      toast({
        title: "فشل التعيين",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "error"
      });
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2">
        <UserCheck className="h-5 w-5 text-[var(--gold-soft)]" />
        <div>
          <h2 className="font-['Reem_Kufi'] text-lg text-[var(--cream)]">تعيين المشرفين للمراكز</h2>
          <p className="text-sm text-[var(--cream-dim)]">إعادة تعيين المشرفين المعتمدين لأي مركز</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {supervisors.length === 0 ? (
          <div className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-sm text-[var(--cream-dim)]">
            لا يوجد مشرفون معتمدون حالياً.
          </div>
        ) : (
          supervisors.map((supervisor) => (
            <div key={supervisor.id} className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] px-4 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-[var(--cream)]">{supervisor.name}</p>
                  <p className="text-sm text-[var(--cream-dim)]">
                    {supervisor.email} | {supervisor.track === "MALE" ? "ذكور" : "إناث"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.94)] px-3 py-2 text-sm text-[var(--cream)] outline-none"
                    value={selectedCenter[supervisor.id] ?? ""}
                    onChange={(event) =>
                      setSelectedCenter((current) => ({ ...current, [supervisor.id]: event.target.value }))
                    }
                    disabled={isPending || processingId === supervisor.id}
                  >
                    <option value="">بدون مركز</option>
                    {centers
                      .filter((center) => center.track === supervisor.track)
                      .map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.name}
                        </option>
                      ))}
                  </select>
                  <Button
                    type="button"
                    disabled={isPending || processingId === supervisor.id}
                    onClick={() => assignSupervisor(supervisor.id)}
                  >
                    {processingId === supervisor.id ? "جارٍ التعيين..." : "تعيين"}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
