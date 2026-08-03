"use client";

import { CenterCard } from "@/components/shared/center-card";
import type { Center } from "@/lib/types";

type CenterWithMeta = Center & {
  _count?: { students?: number; users?: number };
  users?: { id: string; name: string; email: string }[];
};

type CentersWorkspaceProps = {
  centers: CenterWithMeta[];
  ownCenterId?: string | null;
  activeCenterId?: string | null;
  onSelectCenter?: (centerId: string) => void;
};

export function CentersWorkspace({ centers, ownCenterId, activeCenterId, onSelectCenter }: CentersWorkspaceProps) {
  function handleCenterSelect(centerId: string) {
    onSelectCenter?.(centerId);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.25rem] border border-[#c9a15e]/20 bg-[linear-gradient(180deg,#0d1c16_0%,#060e0b_100%)] p-6">
        <div className="flex flex-col gap-3 rounded-[1rem] border border-[#c9a15e]/20 bg-[#0a1713] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--gold-soft)]">خارطة المراكز</p>
            <h2 className="mt-2 font-['Reem_Kufi'] text-2xl text-[var(--cream)]">شبكة المراكز التفاعلية</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--cream-dim)]">
              انقر على أي بناء لفتح المركز مباشرةً في لوحة التحكم، مع صلاحيات المشرف المناسبة.
            </p>
          </div>
          <div className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] px-4 py-2 text-sm font-semibold text-[var(--gold-soft)]">
            {centers.length} مركز
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {centers.map((center) => {
            const canEnter = !ownCenterId || center.id === ownCenterId;
            const isActive = center.id === activeCenterId;
            const supervisorName = center.users?.[0]?.name ?? "غير معين";
            const studentsCount = center._count?.students ?? 0;
            const regionLabel = center.track === "MALE" ? "ذكور" : "إناث";

            return (
              <CenterCard
                key={center.id}
                id={center.id}
                title={center.name}
                subtitle={`${regionLabel} • ${supervisorName}`}
                accentLabel={`مركز ${center.name}`}
                hint={canEnter ? "دخول بصلاحيات المشرف" : "غير متاح للمشرف"}
                isActive={isActive}
                canEnter={canEnter}
                onSelectCenter={canEnter ? handleCenterSelect : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
