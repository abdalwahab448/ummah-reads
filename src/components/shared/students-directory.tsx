"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Center, StudentWithBooks, Track } from "@/lib/types";

type CenterWithStudents = Center & {
  students?: StudentWithBooks[];
};

type StudentsDirectoryProps = {
  students: StudentWithBooks[];
  centers?: CenterWithStudents[];
  showTrackFilter?: boolean;
};

export function StudentsDirectory({ students, centers, showTrackFilter = false }: StudentsDirectoryProps) {
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<Track | "ALL">("ALL");
  const [centerFilter, setCenterFilter] = useState<string>("ALL");

  const centerMap = useMemo(() => {
    const map = new Map<string, string>();
    centers?.forEach((center) => map.set(center.id, center.name));
    return map;
  }, [centers]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.fatherName} ${student.lastName}`.toLowerCase();
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        student.phone.includes(query) ||
        centerMap.get(student.centerId)?.toLowerCase().includes(query);
      const matchesTrack = trackFilter === "ALL" || student.track === trackFilter;
      const matchesCenter = centerFilter === "ALL" || student.centerId === centerFilter;
      return matchesSearch && matchesTrack && matchesCenter;
    });
  }, [students, search, trackFilter, centerFilter, centerMap]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.4rem]">
        <h2 className="font-['Reem_Kufi'] text-xl text-[var(--gold-soft)]">دليل الطلاب</h2>
        <p className="mt-2 text-sm font-semibold leading-7 text-[var(--cream-dim)]">
          استعرض جميع الطلاب المسجلين مع إمكانية البحث والتصفية حسب المركز والفئة.
        </p>
      </Card>

      <Card className="grid gap-4 rounded-[1.25rem] border-[#c9a15e]/20 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cream-dim)]" />
          <input
            className="w-full rounded-xl border border-[#c9a15e]/20 bg-[#0a1713] py-3 pl-4 pr-11 text-base font-semibold text-[var(--cream)] outline-none transition focus:border-[#c9a15e]/40"
            placeholder="ابحث بالاسم أو المركز..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {showTrackFilter ? (
          <select
            className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-base font-semibold text-[var(--cream)] outline-none focus:border-[var(--gold)]"
            value={trackFilter}
            onChange={(event) => setTrackFilter(event.target.value as Track | "ALL")}
          >
            <option value="ALL">كل الفئات</option>
            <option value="MALE">ذكور</option>
            <option value="FEMALE">إناث</option>
          </select>
        ) : null}

        {centers && centers.length > 0 ? (
          <select
            className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-base font-semibold text-[var(--cream)] outline-none focus:border-[var(--gold)]"
            value={centerFilter}
            onChange={(event) => setCenterFilter(event.target.value)}
          >
            <option value="ALL">كل المراكز</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        ) : null}

        <div className="rounded-xl border border-[#c9a15e]/20 bg-[#0a1713] px-4 py-3 text-sm font-semibold text-[var(--gold-soft)]">
          {filteredStudents.length} طالب
        </div>
      </Card>

      <Card className="rounded-[1.4rem]">
        <div className="overflow-x-auto rounded-[1rem] border border-[rgba(227,201,141,0.16)]">
          <table className="min-w-full divide-y divide-[rgba(227,201,141,0.14)] text-right text-sm">
            <thead className="bg-[rgba(8,20,15,0.84)] text-[var(--gold-soft)]">
              <tr>
                <th className="px-4 py-3 font-semibold">الطالب</th>
                <th className="px-4 py-3 font-semibold">اسم الأب</th>
                <th className="px-4 py-3 font-semibold">الكنية</th>
                <th className="px-4 py-3 font-semibold">العمر</th>
                <th className="px-4 py-3 font-semibold">المركز</th>
                {showTrackFilter ? <th className="px-4 py-3 font-semibold">الفئة</th> : null}
                <th className="px-4 py-3 font-semibold">الصفحات</th>
                <th className="px-4 py-3 font-semibold">الكتب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(227,201,141,0.12)] bg-[rgba(14,28,23,0.92)]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={showTrackFilter ? 8 : 7}
                    className="px-4 py-8 text-center text-[var(--cream-dim)]"
                  >
                    {search.trim() ? "لا توجد نتائج مطابقة للبحث" : "لا يوجد طلاب مسجلون بعد"}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="transition hover:bg-[rgba(47,107,84,0.14)]">
                    <td className="px-4 py-3 font-semibold text-[var(--cream)]">{student.firstName}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">{student.fatherName}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">{student.lastName}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">{student.age}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">
                      {centerMap.get(student.centerId) ?? "—"}
                    </td>
                    {showTrackFilter ? (
                      <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">
                        {student.track === "MALE" ? "ذكور" : "إناث"}
                      </td>
                    ) : null}
                    <td className="px-4 py-3 font-semibold text-[var(--gold-soft)]">{student.totalPages}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">{student.books?.length ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
