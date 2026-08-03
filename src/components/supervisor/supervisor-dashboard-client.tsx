"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, ClipboardList, Users } from "lucide-react";

import { CentersBrowser } from "@/components/shared/centers-browser";
import { CentersWorkspace } from "@/components/shared/centers-workspace";
import Leaderboard from "@/components/Leaderboard";
import { MasterBooksLibrary } from "@/components/shared/master-books-library";
import { StudentsDirectory } from "@/components/shared/students-directory";
import { StudentWorkspace } from "@/components/supervisor/student-workspace";
import { Card } from "@/components/ui/card";
import { TabSwitcher } from "@/components/ui/tab-switcher";
import type { DashboardSection } from "@/lib/dashboard-nav";
import type { Center, MasterBook, StudentWithBooks } from "@/lib/types";

type SupervisorDashboardClientProps = {
  activeSection: DashboardSection;
  centerId: string | null;
  centerName: string;
  centerTrack: "MALE" | "FEMALE";
  students: StudentWithBooks[];
  centers: (Center & { students: StudentWithBooks[]; _count?: { students: number } })[];
  leaderboard: StudentWithBooks[];
  masterBooks: MasterBook[];
  isApproved: boolean;
  stats: {
    studentCount: number;
    totalPages: number;
    totalBooks: number;
    masterBookCount: number;
  };
};

export function SupervisorDashboardClient({
  activeSection,
  centerId,
  centerName,
  centerTrack,
  students,
  centers,
  leaderboard,
  masterBooks,
  isApproved,
  stats
}: SupervisorDashboardClientProps) {
  const trackLabel = centerTrack === "MALE" ? "ذكور" : "إناث";
  const [focusView, setFocusView] = useState<"tasks" | "students" | "books">("tasks");

  if (!isApproved) {
    return (
      <Card className="rounded-[1.4rem]">
        <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">لوحة المشرف</h1>
        <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
          حسابك قيد المراجعة من قبل المدير. يرجى الانتظار حتى يتم اعتماد حسابك.
        </p>
      </Card>
    );
  }

  if (activeSection === "home") {
    return (
      <div className="space-y-6">
        <Card className="rounded-[1.25rem] border-[#c9a15e]/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--gold-soft)]">التركيز اليومي</p>
              <h1 className="mt-1 font-['Reem_Kufi'] text-2xl text-[var(--cream)]">لوحة المشرف — {centerName || "مركزك"}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--cream-dim)]">
                ركّز على ثلاث خطوات بسيطة: متابعة الطلاب، تسجيل القراءات، ومراجعة التقدم اليومي.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFocusView("students")}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#c9a15e]/40 bg-[var(--gold-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5"
            >
              تسجيل قراءة جديدة
            </button>
          </div>

          <div className="mt-4">
            <TabSwitcher
              tabs={[
                { id: "tasks", label: "أعمال اليوم" },
                { id: "students", label: "الطلاب" },
                { id: "books", label: "المكتبة" }
              ]}
              activeTab={focusView}
              onChange={(tab) => setFocusView(tab as "tasks" | "students" | "books")}
            />
          </div>
        </Card>

        {focusView === "tasks" ? (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-[1.25rem] border-[#c9a15e]/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[var(--gold-soft)]" />
                <h2 className="font-['Reem_Kufi'] text-lg text-[var(--cream)]">خطة اليوم</h2>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { title: "أولاً: مراجعة الطلاب", description: "تحقق من التقدم اليومي لكل طالب." },
                  { title: "ثانياً: تسجيل القراءات", description: "أضف سجلات القراءة بسرعة من نفس الصفحة." },
                  { title: "ثالثاً: متابعة التقدم", description: "راقب الإنجاز دون التشتت في الجداول الممتدة." }
                ].map((step) => (
                  <div key={step.title} className="rounded-[1rem] border border-[#c9a15e]/20 bg-[#0a1713] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--cream)]">{step.title}</p>
                      <span className="rounded-full border border-[#c9a15e]/20 bg-[#10241d] px-2.5 py-1 text-xs font-semibold text-[var(--gold-soft)]">
                        جاهز
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--cream-dim)]">{step.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[1.25rem] border-[#c9a15e]/20">
              <p className="text-sm font-semibold text-[var(--cream-dim)]">لمحة سريعة</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[1rem] border border-[#c9a15e]/20 bg-[#0a1713] p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--cream-dim)]">الطلاب</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--gold-soft)]">{stats.studentCount}</p>
                </div>
                <div className="rounded-[1rem] border border-[#c9a15e]/20 bg-[#0a1713] p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--cream-dim)]">الصفحات</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--gold-soft)]">{stats.totalPages}</p>
                </div>
                <div className="rounded-[1rem] border border-[#c9a15e]/20 bg-[#0a1713] p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--cream-dim)]">الكتب</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--gold-soft)]">{stats.totalBooks}</p>
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        {focusView === "students" ? (
          <StudentWorkspace
            centerId={centerId ?? ""}
            centerName={centerName}
            centerTrack={centerTrack}
            initialStudents={students}
            canManage
          />
        ) : null}

        {focusView === "books" ? (
          <MasterBooksLibrary
            initialBooks={masterBooks}
            role="SUPERVISOR"
            userTrack={centerTrack}
            canAdd
            canDelete={false}
          />
        ) : null}
      </div>
    );
  }

  if (activeSection === "centers") {
    return (
      <div className="space-y-6">
        <Card className="rounded-[1.4rem]">
          <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">المراكز</h1>
          <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
            استعراض جميع مراكز فئة {trackLabel}.
          </p>
        </Card>

        <div className="space-y-6">
          <CentersWorkspace centers={centers} ownCenterId={centerId} activeCenterId={centerId} />
          <CentersBrowser centers={centers} ownCenterId={centerId} />
        </div>
      </div>
    );
  }

  if (activeSection === "students") {
    return (
      <div className="space-y-6">
        <Card className="rounded-[1.4rem]">
          <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">الطلاب</h1>
          <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
            استعراض طلاب الفئة وإدارة طلاب مركزك.
          </p>
        </Card>

        <StudentsDirectory students={leaderboard} centers={centers} />

        {centerId ? (
          <StudentWorkspace
            centerId={centerId}
            centerName={centerName}
            centerTrack={centerTrack}
            initialStudents={students}
            canManage
          />
        ) : (
          <Card className="text-sm text-[var(--cream-dim)]">
            لم يتم ربط حسابك بمركز بعد. يرجى انتظار المدير لتعيين المركز المناسب.
          </Card>
        )}
      </div>
    );
  }

  if (activeSection === "books") {
    return (
      <div className="space-y-6">
        <MasterBooksLibrary
          initialBooks={masterBooks}
          role="SUPERVISOR"
          userTrack={centerTrack}
          canAdd
          canDelete={false}
        />
      </div>
    );
  }

  if (activeSection === "leaderboard") {
    return (
      <div className="space-y-6">
        <Card className="rounded-[1.4rem]">
          <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">الترتيب العام</h1>
          <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
            أفضل 10 طلاب والترتيب الكامل لمسابقة {trackLabel}.
          </p>
        </Card>

        <Leaderboard students={leaderboard} />
      </div>
    );
  }

  return null;
}
