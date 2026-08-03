"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { CenterManager } from "@/components/manager/center-manager";
import { SupervisorManager } from "@/components/manager/supervisor-manager";
import { ApprovalBoard } from "@/components/manager/approval-board";
import { CentersBrowser } from "@/components/shared/centers-browser";
import { CentersWorkspace } from "@/components/shared/centers-workspace";
import { LeaderboardTable } from "@/components/shared/leaderboard-table";
import { MasterBooksLibrary } from "@/components/shared/master-books-library";
import { StudentsDirectory } from "@/components/shared/students-directory";
import { StudentWorkspace } from "@/components/supervisor/student-workspace";
import { Card } from "@/components/ui/card";
import { TabSwitcher } from "@/components/ui/tab-switcher";
import type { DashboardSection } from "@/lib/dashboard-nav";
import type { Center, MasterBook, StudentWithBooks, Track, UserSession } from "@/lib/types";

type CenterWithMeta = Center & {
  students: StudentWithBooks[];
  _count?: { students: number; users: number };
  users?: { id: string; name: string; email: string }[];
};

type ManagerDashboardProps = {
  activeSection: DashboardSection;
  track: Track;
  trackLabel: string;
  pendingSupervisors: UserSession[];
  centers: CenterWithMeta[];
  students: StudentWithBooks[];
  masterBooks: MasterBook[];
  approvedSupervisors: UserSession[];
  stats: {
    centerCount: number;
    studentCount: number;
    supervisorCount: number;
    totalPages: number;
    totalBooks: number;
    masterBookCount: number;
  };
};

export function ManagerDashboard({
  activeSection,
  track,
  trackLabel,
  pendingSupervisors,
  centers,
  students,
  masterBooks,
  approvedSupervisors,
  stats
}: ManagerDashboardProps) {
  const searchParams = useSearchParams();
  const selectedCenterIdFromUrl = searchParams.get("centerId");
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(selectedCenterIdFromUrl);
  const [centerView, setCenterView] = useState<"overview" | "students" | "supervisors">("overview");
  const selectedCenter = centers.find((center) => center.id === selectedCenterId) ?? null;

  if (activeSection === "home") {
    return (
      <section className="space-y-6">
        <Card className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem]">
          <div>
            <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">لوحة المدير — {trackLabel}</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
              نظرة عامة على إحصائيات فئة {trackLabel}.
            </p>
          </div>
          <div className="rounded-xl border border-[rgba(227,201,141,0.2)] bg-[rgba(8,20,15,0.82)] px-4 py-2 text-sm font-semibold text-[var(--gold-soft)]">
            {stats.centerCount} مركز | {stats.supervisorCount} مشرف
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <p className="text-sm text-[var(--cream-dim)]">إجمالي الطلاب</p>
            <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{stats.studentCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-[var(--cream-dim)]">إجمالي الصفحات المقروءة</p>
            <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{stats.totalPages}</p>
          </Card>
          <Card>
            <p className="text-sm text-[var(--cream-dim)]">إجمالي الكتب المقروءة</p>
            <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{stats.totalBooks}</p>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm text-[var(--cream-dim)]">كتب المكتبة المركزية</p>
            <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{stats.masterBookCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-[var(--cream-dim)]">مشرفون بانتظار الاعتماد</p>
            <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{pendingSupervisors.length}</p>
          </Card>
        </div>
      </section>
    );
  }

  if (activeSection === "centers") {
    return (
      <section className="space-y-6">
        <Card className="rounded-[1.25rem] border-[#c9a15e]/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--gold-soft)]">التركيز الأساسي</p>
              <h1 className="mt-1 font-['Reem_Kufi'] text-2xl text-[var(--cream)]">إدارة المراكز — {trackLabel}</h1>
              <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
                ركّز على المراكز الحالية والطلاب والتقدم اليومي، مع إبقاء الأدوات الإدارية الثانوية في الخلفية.
              </p>
            </div>
            <div className="rounded-full border border-[#c9a15e]/20 bg-[#0a1713] px-4 py-2 text-sm font-semibold text-[var(--gold-soft)]">
              {centers.length} مركز نشط
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {selectedCenter ? (
            <div className="space-y-6">
              <div className="sticky top-4 z-20 rounded-[1.4rem] border border-[rgba(227,201,141,0.24)] bg-[linear-gradient(90deg,rgba(14,28,23,0.98),rgba(8,20,15,0.92))] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.28)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--gold-soft)]">أنت الآن تدير المركز بصلاحيات المشرف</p>
                    <h2 className="mt-1 font-['Reem_Kufi'] text-2xl text-[var(--cream)]">{selectedCenter.name}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCenterId(null)}
                    className="rounded-xl border border-[rgba(227,201,141,0.24)] bg-[rgba(227,201,141,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-soft)]"
                  >
                    الرجوع إلى العرض الكامل
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <p className="text-sm text-[var(--cream-dim)]">عدد الطلاب</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{selectedCenter.students.length}</p>
                </Card>
                <Card>
                  <p className="text-sm text-[var(--cream-dim)]">إجمالي الصفحات</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{selectedCenter.students.reduce((sum, student) => sum + student.totalPages, 0)}</p>
                </Card>
                <Card>
                  <p className="text-sm text-[var(--cream-dim)]">إجمالي الكتب</p>
                  <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{selectedCenter.students.reduce((sum, student) => sum + student.totalBooks, 0)}</p>
                </Card>
              </div>

              <StudentWorkspace
                key={selectedCenter.id}
                centerId={selectedCenter.id}
                centerName={selectedCenter.name}
                centerTrack={selectedCenter.track}
                initialStudents={selectedCenter.students}
                canManage
              />
            </div>
          ) : (
            <>
              <CentersWorkspace
                centers={centers}
                activeCenterId={selectedCenterId}
                onSelectCenter={(centerId) => setSelectedCenterId(centerId)}
              />

              <div className="rounded-[1.25rem] border border-[#c9a15e]/20 bg-[linear-gradient(180deg,#0d1c16_0%,#060e0b_100%)] p-4">
                <TabSwitcher
                  tabs={[
                    { id: "overview", label: "إدارة المراكز" },
                    { id: "students", label: "الطلاب" },
                    { id: "supervisors", label: "المشرفون" }
                  ]}
                  activeTab={centerView}
                  onChange={(tab) => setCenterView(tab as "overview" | "students" | "supervisors")}
                />

                <div className="mt-4">
                  {centerView === "overview" ? <CenterManager centers={centers} track={track} canEdit /> : null}
                  {centerView === "students" ? <StudentsDirectory students={students} centers={centers} /> : null}
                  {centerView === "supervisors" ? <SupervisorManager supervisors={approvedSupervisors} centers={centers} /> : null}
                </div>
              </div>

              <CentersBrowser centers={centers} />
            </>
          )}
        </div>
      </section>
    );
  }

  if (activeSection === "students") {
    return (
      <section className="space-y-6">
        <Card className="rounded-[1.4rem]">
          <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">دليل الطلاب — {trackLabel}</h1>
          <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
            استعراض وإدارة بطاقات الطلاب في جميع مراكز الفئة.
          </p>
        </Card>

        <StudentsDirectory students={students} centers={centers} />

        <div className="space-y-6">
          {selectedCenter ? (
            <StudentWorkspace
              key={selectedCenter.id}
              centerId={selectedCenter.id}
              centerName={selectedCenter.name}
              centerTrack={selectedCenter.track}
              initialStudents={selectedCenter.students}
              canManage
            />
          ) : centers.length === 0 ? (
            <Card className="text-center text-sm text-[var(--cream-dim)]">
              لا توجد مراكز بعد. أنشئ مركزاً من قسم المراكز.
            </Card>
          ) : (
            centers.map((center) => (
              <StudentWorkspace
                key={center.id}
                centerId={center.id}
                centerName={center.name}
                centerTrack={center.track}
                initialStudents={center.students}
                canManage
              />
            ))
          )}
        </div>
      </section>
    );
  }

  if (activeSection === "books") {
    return (
      <section className="space-y-6">
        <MasterBooksLibrary
          initialBooks={masterBooks}
          role="MANAGER"
          userTrack={track}
          canAdd
          canDelete
        />
      </section>
    );
  }

  if (activeSection === "leaderboard") {
    return (
      <section className="space-y-6">
        <Card className="rounded-[1.4rem]">
          <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">الترتيب — {trackLabel}</h1>
          <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
            أفضل 10 طلاب والترتيب العام للمسابقة.
          </p>
        </Card>

        <LeaderboardTable students={students.slice(0, 10)} title={`أفضل 10 — ${trackLabel}`} />
        <LeaderboardTable students={students} title={`الترتيب العام — ${trackLabel}`} />
      </section>
    );
  }

  if (activeSection === "approvals") {
    return (
      <section className="space-y-6">
        <Card className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem]">
          <div>
            <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">اعتماد المشرفين — {trackLabel}</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
              مراجعة طلبات المشرفين الجدد واعتمادها أو رفضها.
            </p>
          </div>
          <Link
            href="/signup"
            className="rounded-xl border border-[rgba(227,201,141,0.24)] bg-[rgba(227,201,141,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-soft)]"
          >
            إنشاء حساب مشرف جديد
          </Link>
        </Card>

        <ApprovalBoard pendingSupervisors={pendingSupervisors} centers={centers} />
      </section>
    );
  }

  return null;
}
