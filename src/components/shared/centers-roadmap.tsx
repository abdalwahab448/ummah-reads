"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Center } from "@/lib/types";

type CenterWithMeta = Center & {
  _count?: Partial<{ students: number; users: number }>;
  users?: { id: string; name: string; email: string }[];
};

type CentersRoadmapProps = {
  centers: CenterWithMeta[];
  ownCenterId?: string | null;
  activeCenterId?: string | null;
};

export function CentersRoadmap({ centers, ownCenterId, activeCenterId }: CentersRoadmapProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isSupervisor = pathname?.includes("/supervisor");

  function enterCenter(centerId: string) {
    const params = new URLSearchParams();
    params.set("section", "students");
    if (!isSupervisor) {
      params.set("centerId", centerId);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const centerSectionHref = `${pathname}?section=centers`;
  const studentsSectionHref = `${pathname}?section=students`;

  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-[#c9a15e]/20 bg-[linear-gradient(180deg,#0d1c16_0%,#060e0b_100%)] p-6">
      <div className="absolute inset-y-0 left-10 hidden w-px bg-[rgba(227,201,141,0.16)] md:block" />
      <div className="space-y-8">
        {centers.map((center, index) => {
          const isActive = center.id === activeCenterId;
          const studentCount = center._count?.students ?? 0;
          const supervisorName = center.users?.[0]?.name ?? "غير معين";
          const buttonLabel = isSupervisor
            ? center.id === ownCenterId
              ? "دخول كـ مشرف"
              : "غير متاح"
            : "إدارة المركز";
          const canEnter = !isSupervisor || center.id === ownCenterId;

          return (
            <div key={center.id} className="relative md:pl-12">
              <span
                className={`absolute left-0 top-5 block h-5 w-5 rounded-full border-4 ${
                  isActive ? "border-[var(--gold-soft)] bg-[rgba(47,107,84,0.8)]" : "border-[rgba(227,201,141,0.24)] bg-[rgba(8,20,15,0.84)]"
                }`}
              />
              {index < centers.length - 1 ? (
                <span className="absolute left-2 top-14 h-[calc(100%-3.5rem)] w-px bg-[rgba(227,201,141,0.16)]" />
              ) : null}

              <article
                className={`group overflow-hidden rounded-[1rem] border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a15e]/40 ${
                  isActive
                    ? "border-[#c9a15e]/30 bg-[rgba(47,107,84,0.18)]"
                    : "border-[#c9a15e]/20 bg-[#0a1713]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--cream-dim)]">
                      مركز على المسار
                    </p>
                    <h3 className="mt-2 font-['Reem_Kufi'] text-xl text-[var(--cream)]">{center.name}</h3>
                  </div>
                  <span className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.94)] px-3 py-1 text-xs font-semibold text-[var(--gold-soft)]">
                    {studentCount} طالب
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(14,28,23,0.94)] p-4 text-[var(--cream-dim)]">
                    <p className="text-xs font-semibold text-[var(--cream-dim)]">المنطقة</p>
                    <p className="mt-1 text-sm font-bold text-[var(--cream)]">
                      {center.track === "MALE" ? "ذكور" : "إناث"}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(14,28,23,0.94)] p-4 text-[var(--cream-dim)]">
                    <p className="text-xs font-semibold text-[var(--cream-dim)]">المشرف</p>
                    <p className="mt-1 text-sm font-bold text-[var(--cream)]">{supervisorName}</p>
                  </div>
                  <div className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(14,28,23,0.94)] p-4 text-[var(--cream-dim)]">
                    <p className="text-xs font-semibold text-[var(--cream-dim)]">عدد الطلاب</p>
                    <p className="mt-1 text-sm font-bold text-[var(--cream)]">{studentCount}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cream-dim)]">اسم المركز</p>
                    <p className="text-base font-semibold text-[var(--cream)]">{center.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => enterCenter(center.id)}
                    disabled={!canEnter}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      canEnter
                        ? "bg-[var(--gold-soft)] text-[#0f1b16] hover:bg-[var(--cream)]"
                        : "cursor-not-allowed bg-[rgba(8,20,15,0.84)] text-[var(--cream-dim)]"
                    }`}
                  >
                    {buttonLabel}
                  </button>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={centerSectionHref}
          className="inline-flex w-full items-center justify-center rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-5 py-3 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(47,107,84,0.18)] sm:w-auto"
        >
          استعراض المراكز
        </Link>
        <Link
          href={studentsSectionHref}
          className="inline-flex w-full items-center justify-center rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(14,28,23,0.94)] px-5 py-3 text-sm font-semibold text-[var(--cream-dim)] transition hover:bg-[rgba(47,107,84,0.18)] sm:w-auto"
        >
          عرض الطلاب
        </Link>
      </div>
    </div>
  );
}
