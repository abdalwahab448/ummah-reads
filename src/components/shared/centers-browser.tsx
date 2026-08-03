"use client";

import { useState } from "react";
import { Building2, ChevronLeft } from "lucide-react";

import { StudentCardDisplay } from "@/components/shared/student-card";
import { Card } from "@/components/ui/card";
import type { Center, StudentWithBooks } from "@/lib/types";

type CenterWithStudents = Center & {
  students: StudentWithBooks[];
  _count?: { students: number };
};

type CentersBrowserProps = {
  centers: CenterWithStudents[];
  ownCenterId?: string | null;
  canManageOwnCenter?: boolean;
};

export function CentersBrowser({ centers, ownCenterId, canManageOwnCenter }: CentersBrowserProps) {
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);

  const selectedCenter = centers.find((center) => center.id === selectedCenterId);

  if (selectedCenter) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setSelectedCenterId(null)}
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] px-4 py-2 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(47,107,84,0.22)]"
        >
          <ChevronLeft className="h-4 w-4 text-[var(--gold-soft)]" />
          العودة للمراكز
        </button>

        <Card className="rounded-[1.25rem] border-[#c9a15e]/20">
          <h2 className="font-['Reem_Kufi'] text-xl text-[var(--gold-soft)]">{selectedCenter.name}</h2>
          <p className="mt-1 text-sm text-[var(--cream-dim)]">
            {selectedCenter.track === "MALE" ? "ذكور" : "إناث"} | {selectedCenter.students.length} طالب
            {selectedCenter.id === ownCenterId ? (
              <span className="mr-2 inline-flex rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] px-2 py-0.5 text-xs font-semibold text-[var(--gold-soft)]">
                مركزك
              </span>
            ) : null}
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectedCenter.students.length === 0 ? (
            <Card className="col-span-full rounded-[1.25rem] border-[#c9a15e]/20 text-center text-sm text-[var(--cream-dim)]">
              لا يوجد طلاب في هذا المركز بعد.
            </Card>
          ) : (
            selectedCenter.students.map((student, index) => (
              <StudentCardDisplay key={student.id} student={student} rank={index + 1} />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="rounded-[1.4rem]">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-[var(--gold-soft)]" />
        <h2 className="font-['Reem_Kufi'] text-lg text-[var(--gold-soft)]">استعراض المراكز</h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {centers.length === 0 ? (
          <div className="col-span-full rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-6 text-center text-sm text-[var(--cream-dim)]">
            لا توجد مراكز مسجلة بعد.
          </div>
        ) : (
          centers.map((center) => (
            <button
              key={center.id}
              type="button"
              onClick={() => setSelectedCenterId(center.id)}
              className="rounded-[1rem] border border-[#c9a15e]/20 bg-[#0a1713] p-4 text-right transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a15e]/40 hover:bg-[#10241d]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[var(--cream)]">{center.name}</p>
                  <p className="mt-1 text-sm text-[var(--cream-dim)]">
                    {center._count?.students ?? center.students.length} طالب
                  </p>
                </div>
                {center.id === ownCenterId ? (
                  <span className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] px-2 py-0.5 text-xs font-semibold text-[var(--gold-soft)]">
                    مركزك
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs text-[var(--cream-dim)]">
                {center.track === "MALE" ? "ذكور" : "إناث"}
              </p>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}
