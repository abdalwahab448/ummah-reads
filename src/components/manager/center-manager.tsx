"use client";

import { useMemo, useState, useTransition } from "react";
import { Building2, Edit2, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Center, Track } from "@/lib/types";

type CenterWithMeta = Center & {
  _count?: { students: number; users: number };
  users?: { id: string; name: string; email: string }[];
};

type CenterManagerProps = {
  centers: CenterWithMeta[];
  track: Track;
  canEdit: boolean;
};

export function CenterManager({ centers, track, canEdit }: CenterManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(centers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<CenterWithMeta | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const trackLabel = track === "MALE" ? "ذكور" : "إناث";

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name, "ar")),
    [items]
  );

  function openCreate() {
    setEditingCenter(null);
    setName("");
    setModalOpen(true);
  }

  function openEdit(center: CenterWithMeta) {
    setEditingCenter(center);
    setName(center.name);
    setModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(editingCenter ? `/api/centers/${editingCenter.id}` : "/api/centers", {
        method: editingCenter ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, track })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message ?? "تعذر حفظ المركز");
      }

      toast({
        title: editingCenter ? "تم تحديث المركز" : "تم إنشاء المركز",
        variant: "success"
      });

      setModalOpen(false);
      startTransition(() => router.refresh());
    } catch (error) {
      toast({
        title: "فشل العملية",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "error"
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(centerId: string) {
    setDeletingId(centerId);

    try {
      const response = await fetch(`/api/centers/${centerId}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message ?? "تعذر حذف المركز");
      }

      setItems((current) => current.filter((center) => center.id !== centerId));
      toast({ title: "تم حذف المركز", variant: "success" });
      startTransition(() => router.refresh());
    } catch (error) {
      toast({
        title: "فشل الحذف",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "error"
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[var(--gold-soft)]" />
          <div>
            <h2 className="font-['Reem_Kufi'] text-lg text-[var(--cream)]">إدارة المراكز — {trackLabel}</h2>
            <p className="text-sm text-[var(--cream-dim)]">إنشاء وتعديل وحذف مراكز الفئة</p>
          </div>
        </div>
        {canEdit ? (
          <Button type="button" onClick={openCreate} disabled={isPending}>
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة مركز
          </Button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {sortedItems.length === 0 ? (
          <div className="col-span-full rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] px-4 py-6 text-center text-sm text-[var(--cream-dim)]">
            لا توجد مراكز بعد. {canEdit ? "ابدأ بإضافة أول مركز." : ""}
          </div>
        ) : (
          sortedItems.map((center) => (
            <div key={center.id} className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--cream)]">{center.name}</p>
                  <p className="mt-1 text-sm text-[var(--cream-dim)]">
                    {center._count?.students ?? 0} طالب | {center._count?.users ?? 0} مشرف
                  </p>
                  {center.users && center.users.length > 0 ? (
                    <p className="mt-1 text-xs text-[var(--cream-dim)]">
                      المشرف: {center.users.map((u) => u.name).join("، ")}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-[var(--cream-dim)]">بدون مشرف معيّن</p>
                  )}
                </div>
                {canEdit ? (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(center)}
                      className="rounded-xl p-2 text-[var(--cream-dim)] hover:bg-[rgba(47,107,84,0.18)]"
                      aria-label="تعديل"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(center.id)}
                      disabled={deletingId === center.id}
                      className="rounded-sm p-2 text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCenter ? "تعديل المركز" : "إضافة مركز جديد"}
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <input
            className="rounded-[1rem] border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-[var(--cream)] outline-none focus:border-[var(--gold)]"
            placeholder="اسم المركز"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <div className="rounded-[1rem] bg-[rgba(14,28,23,0.92)] px-4 py-3 text-sm text-[var(--cream-dim)]">
            الفئة: {trackLabel}
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "جارٍ الحفظ..." : editingCenter ? "حفظ التعديل" : "إنشاء المركز"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
