"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Clock3, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type { Center, UserSession } from "@/lib/types";

type ApprovalBoardProps = {
  pendingSupervisors: UserSession[];
  centers: Center[];
};

export function ApprovalBoard({ pendingSupervisors, centers }: ApprovalBoardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [items, setItems] = useState<UserSession[]>(pendingSupervisors);
  const [selectedCenterByUser, setSelectedCenterByUser] = useState<Record<string, string>>(
    Object.fromEntries(pendingSupervisors.map((user) => [user.id, centers[0]?.id ?? ""]))
  );

  const pendingCount = useMemo(() => items.length, [items.length]);

  async function updateSupervisor(userId: string, action: "approve" | "reject") {
    setProcessingUserId(userId);

    try {
      const url = action === "approve" ? "/api/supervisors/approve" : "/api/supervisors/reject";
      const body = action === "approve"
        ? JSON.stringify({ userId, centerId: selectedCenterByUser[userId] })
        : JSON.stringify({ userId });

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message ?? "تعذر تنفيذ العملية");
      }

      setItems((current) => current.filter((user) => user.id !== userId));
      toast({
        title: action === "approve" ? "تم اعتماد المشرف" : "تم رفض طلب المشرف",
        description: action === "approve" ? "أصبح الحساب مرتبطاً بالمركز المحدد." : "تمت إزالة الطلب من قائمة المراجعة.",
        variant: "success"
      });
      startTransition(() => router.refresh());
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      toast({
        title: "فشلت العملية",
        description: message,
        variant: "error"
      });
    } finally {
      setProcessingUserId(null);
    }
  }

  return (
    <Card className="rounded-[1.25rem] border-[#c9a15e]/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['Reem_Kufi'] text-lg text-[var(--gold-soft)]">المشرفون المعلقون</h2>
          <p className="mt-1 text-sm text-[var(--cream-dim)]">راجع الطلبات ثم اختر المركز المناسب قبل الاعتماد.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] px-4 py-2 text-sm font-semibold text-[var(--gold-soft)]">
          <Clock3 className="h-4 w-4 text-[var(--gold-soft)]" />
          {pendingCount} طلب قيد المراجعة
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] px-4 py-3 text-sm text-[var(--cream-dim)]">لا توجد طلبات حالياً.</div>
        ) : items.map((user) => (
          <div key={user.id} className="rounded-[1rem] border border-[#c9a15e]/20 bg-[#0a1713] px-4 py-4 transition-all duration-300 hover:border-[#c9a15e]/40">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-[var(--cream)]">{user.name}</p>
                <p className="text-sm text-[var(--cream-dim)]">{user.email} | {user.track === "MALE" ? "ذكور" : "إناث"}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.98)] px-3 py-2 text-sm text-[var(--cream)] outline-none"
                  value={selectedCenterByUser[user.id] ?? ""}
                  onChange={(event) => setSelectedCenterByUser((current) => ({ ...current, [user.id]: event.target.value }))}
                  disabled={isPending || processingUserId === user.id}
                >
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>{center.name}</option>
                  ))}
                </select>
                <Button type="button" disabled={isPending || processingUserId === user.id} onClick={() => updateSupervisor(user.id, "approve")}>
                  <Check className="ml-2 h-4 w-4" />
                  {processingUserId === user.id ? "جارٍ التنفيذ..." : "اعتماد"}
                </Button>
                <Button type="button" variant="ghost" className="text-[var(--cream)] hover:bg-[rgba(27,77,62,0.2)]" disabled={isPending || processingUserId === user.id} onClick={() => updateSupervisor(user.id, "reject")}>
                  <X className="ml-2 h-4 w-4" />
                  {processingUserId === user.id ? "جارٍ التنفيذ..." : "رفض"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}