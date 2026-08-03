import { Card } from "@/components/ui/card";
import type { StudentWithBooks } from "@/lib/types";

type LeaderboardTableProps = {
  students: StudentWithBooks[];
  title?: string;
  showBooks?: boolean;
};

export function LeaderboardTable({ students, title, showBooks = true }: LeaderboardTableProps) {
  return (
    <Card className="rounded-[1.25rem] border-[#c9a15e]/20 bg-[linear-gradient(180deg,#0d1c16_0%,#060e0b_100%)]">
      {title ? <h2 className="font-['Reem_Kufi'] text-lg text-[var(--gold-soft)]">{title}</h2> : null}
      <div className={`${title ? "mt-4" : ""} overflow-x-auto rounded-[1rem] border border-[rgba(227,201,141,0.16)]`}>
        <table className="min-w-full divide-y divide-[rgba(227,201,141,0.14)] text-right text-sm">
          <thead className="bg-[rgba(8,20,15,0.84)] text-[var(--gold-soft)]">
            <tr>
              <th className="px-4 py-3 font-semibold">الترتيب</th>
              <th className="px-4 py-3 font-semibold">الطالب</th>
              <th className="px-4 py-3 font-semibold">اسم الأب</th>
              <th className="px-4 py-3 font-semibold">الكنية</th>
              <th className="px-4 py-3 font-semibold">العمر</th>
              <th className="px-4 py-3 font-semibold">الصفحات</th>
              {showBooks ? <th className="px-4 py-3 font-semibold">الكتب</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(227,201,141,0.12)] bg-[rgba(14,28,23,0.92)]">
            {students.length === 0 ? (
              <tr>
                <td colSpan={showBooks ? 7 : 6} className="px-4 py-8 text-center font-semibold text-[var(--cream-dim)]">
                  لا يوجد طلاب مسجلون بعد
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.id} className="transition hover:bg-[rgba(47,107,84,0.14)]">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        index === 0
                          ? "bg-[var(--gold-soft)] text-[#0f1b16]"
                          : index === 1
                            ? "bg-[rgba(47,107,84,0.8)] text-[var(--cream)]"
                            : index === 2
                              ? "bg-[rgba(47,107,84,0.35)] text-[var(--cream)]"
                              : "bg-[rgba(8,20,15,0.84)] text-[var(--cream-dim)]"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--cream)]">{student.firstName}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">{student.fatherName}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">{student.lastName}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">{student.age}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--gold-soft)]">{student.totalPages}</td>
                  {showBooks ? (
                    <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">{student.books?.length ?? 0}</td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
