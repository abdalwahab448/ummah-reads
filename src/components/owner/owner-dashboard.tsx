"use client";

import Link from "next/link";
import { useState } from "react";

import { CenterManager } from "@/components/manager/center-manager";
import { SupervisorManager } from "@/components/manager/supervisor-manager";
import { ApprovalBoard } from "@/components/manager/approval-board";
import { LeaderboardTable } from "@/components/shared/leaderboard-table";
import { MasterBooksLibrary } from "@/components/shared/master-books-library";
import { StudentsDirectory } from "@/components/shared/students-directory";
import { StudentWorkspace } from "@/components/supervisor/student-workspace";
import { CentersBrowser } from "@/components/shared/centers-browser";
import { CentersWorkspace } from "@/components/shared/centers-workspace";
import { Card } from "@/components/ui/card";
import { TabSwitcher } from "@/components/ui/tab-switcher";
import type { DashboardSection } from "@/lib/dashboard-nav";
import type { Center, MasterBook, StudentWithBooks, Track, UserSession } from "@/lib/types";

type OwnerDashboardProps = {
  activeSection: DashboardSection;
  maleStudents: StudentWithBooks[];
  femaleStudents: StudentWithBooks[];
  maleCenters: Center[];
  femaleCenters: Center[];
  allCenters: Center[];
  allStudents: StudentWithBooks[];
  masterBooks: MasterBook[];
  pendingSupervisors: UserSession[];
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

export function OwnerDashboard({
  activeSection,
  maleStudents,
  femaleStudents,
  maleCenters,
  femaleCenters,
  allCenters,
  allStudents,
  masterBooks,
  pendingSupervisors,
  approvedSupervisors,
  stats
}: OwnerDashboardProps) {
  const [activeTrack, setActiveTrack] = useState<Track>("MALE");
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const [centerView, setCenterView] = useState<"overview" | "students" | "supervisors">("overview");

  const students = activeTrack === "MALE" ? maleStudents : femaleStudents;
  const centers = activeTrack === "MALE" ? maleCenters : femaleCenters;
  const trackSupervisors = approvedSupervisors.filter((supervisor) => supervisor.track === activeTrack);
  const trackPending = pendingSupervisors.filter((supervisor) => supervisor.track === activeTrack);

  const trackToggle = (
    <div className="flex rounded-2xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.84)] p-1">
      <button
        type="button"
        onClick={() => setActiveTrack("MALE")}
        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
          activeTrack === "MALE"
            ? "bg-[var(--gold-soft)] text-[var(--ink)]"
            : "text-[var(--cream-dim)] hover:bg-[rgba(47,107,84,0.28)]"
        }`}
      >
        ذكور
      </button>
      <button
        type="button"
        onClick={() => setActiveTrack("FEMALE")}
        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
          activeTrack === "FEMALE"
            ? "bg-[var(--gold-soft)] text-[var(--ink)]"
            : "text-[var(--cream-dim)] hover:bg-[rgba(47,107,84,0.28)]"
        }`}
      >
        إناث
      </button>
    </div>
  );

  if (activeSection === "home") {
    return (
      <section className="space-y-6">
        <Card className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem]">
          <div>
            <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">لوحة مالك المسابقة</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
              نظرة عامة على إحصائيات المسابقة عبر جميع المراكز والفئات.
            </p>
          </div>
          {trackToggle}
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

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-[var(--cream-dim)]">المراكز</p>
            <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{stats.centerCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-[var(--cream-dim)]">المشرفون المعتمدون</p>
            <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{stats.supervisorCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-[var(--cream-dim)]">كتب المكتبة المركزية</p>
            <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{stats.masterBookCount}</p>
          </Card>
        </div>
      </section>
    );
  }

  if (activeSection === "centers") {
    const selectedCenter = centers.find((center) => center.id === selectedCenterId) ?? null;
    const selectedStudents = selectedCenter
      ? (activeTrack === "MALE" ? maleStudents : femaleStudents).filter((student) => student.centerId === selectedCenter.id)
      : [];
    const selectedPages = selectedStudents.reduce((sum, student) => sum + student.totalPages, 0);
    const selectedBooks = selectedStudents.reduce((sum, student) => sum + student.totalBooks, 0);

    return (
      <section className="space-y-6">
        <Card className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border-[#c9a15e]/20">
          <div>
            <p className="text-sm font-semibold text-[var(--gold-soft)]">التركيز الأساسي</p>
            <h1 className="mt-1 font-['Reem_Kufi'] text-2xl text-[var(--cream)]">إدارة المراكز</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
              ابدأ من المراكز المختارة ثم انتقل إلى الطلاب والتقدم دون تشتيت الانتباه.
            </p>
          </div>
          {trackToggle}
        </Card>

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
                <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{selectedStudents.length}</p>
              </Card>
              <Card>
                <p className="text-sm text-[var(--cream-dim)]">إجمالي الصفحات</p>
                <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{selectedPages}</p>
              </Card>
              <Card>
                <p className="text-sm text-[var(--cream-dim)]">إجمالي الكتب</p>
                <p className="mt-2 text-3xl font-bold text-[var(--gold-soft)]">{selectedBooks}</p>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4">
                <Card className="rounded-[1.4rem]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--gold-soft)]">لوحة تحكم المشرف</p>
                      <h3 className="mt-1 font-['Reem_Kufi'] text-xl text-[var(--cream)]">إدارة الطلاب والقراءات</h3>
                    </div>
                    <span className="rounded-full border border-[rgba(227,201,141,0.24)] bg-[rgba(227,201,141,0.12)] px-3 py-1 text-sm text-[var(--gold-soft)]">
                      {selectedCenter.name}
                    </span>
                  </div>
                </Card>
                <StudentWorkspace
                  key={selectedCenter.id}
                  centerId={selectedCenter.id}
                  centerName={selectedCenter.name}
                  centerTrack={selectedCenter.track}
                  initialStudents={selectedStudents}
                  canManage
                />
              </div>
              <div className="space-y-4">
                <Card className="rounded-[1.4rem]">
                  <p className="text-sm font-semibold text-[var(--gold-soft)]">تقدم القراءة</p>
                  <div className="mt-4 space-y-3">
                    {selectedStudents.slice(0, 6).map((student) => (
                      <div key={student.id} className="rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.74)] p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[var(--cream)]">{student.firstName} {student.lastName}</p>
                          <p className="text-sm text-[var(--gold-soft)]">{student.totalPages} صفحة</p>
                        </div>
                        <p className="mt-2 text-sm text-[var(--cream-dim)]">كتب: {student.totalBooks}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <CenterManager centers={centers} track={activeTrack} canEdit />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <CentersWorkspace
              centers={centers.map((center) => ({
                ...center,
                students: (activeTrack === "MALE" ? maleStudents : femaleStudents).filter(
                  (student) => student.centerId === center.id
                )
              }))}
              onSelectCenter={(centerId) => setSelectedCenterId(centerId)}
            />

            <div className="rounded-[1.25rem] border border-[#c9a15e]/20 bg-[linear-gradient(180deg,#0d1c16_0%,#060e0b_100%)] p-4">
              <TabSwitcher
                tabs={[
                  { id: "overview", label: "المراكز" },
                  { id: "students", label: "الطلاب" },
                  { id: "supervisors", label: "المشرفون" }
                ]}
                activeTab={centerView}
                onChange={(tab) => setCenterView(tab as "overview" | "students" | "supervisors")}
              />

              <div className="mt-4">
                {centerView === "overview" ? <CenterManager centers={centers} track={activeTrack} canEdit /> : null}
                {centerView === "students" ? <StudentsDirectory students={allStudents} centers={allCenters} showTrackFilter /> : null}
                {centerView === "supervisors" ? <SupervisorManager supervisors={trackSupervisors} centers={centers} /> : null}
              </div>
            </div>

            <CentersBrowser
              centers={centers.map((center) => ({
                ...center,
                students: (activeTrack === "MALE" ? maleStudents : femaleStudents).filter(
                  (student) => student.centerId === center.id
                )
              }))}
            />
          </div>
        )}
      </section>
    );
  }

  if (activeSection === "students") {
    return (
      <section className="space-y-6">
        <Card className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem]">
          <div>
            <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">دليل الطلاب</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
              استعراض وإدارة بطاقات الطلاب في جميع المراكز.
            </p>
          </div>
          {trackToggle}
        </Card>

        <StudentsDirectory students={allStudents} centers={allCenters} showTrackFilter />

        <div className="space-y-6">
          {centers.map((center) => (
            <StudentWorkspace
              key={center.id}
              centerId={center.id}
              centerName={center.name}
              centerTrack={center.track}
              initialStudents={(activeTrack === "MALE" ? maleStudents : femaleStudents).filter(
                (student) => student.centerId === center.id
              )}
              canManage
            />
          ))}
        </div>
      </section>
    );
  }

  if (activeSection === "books") {
    return (
      <section className="space-y-6">
        <MasterBooksLibrary
          initialBooks={masterBooks}
          role="OWNER"
          userTrack="MALE"
          canAdd
          canDelete
          showTrackFilter
        />
      </section>
    );
  }

  if (activeSection === "leaderboard") {
    return (
      <section className="space-y-6">
        <Card className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem]">
          <div>
            <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">الترتيب والمسابقات</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
              أفضل 10 طلاب والترتيب العام لكل فئة.
            </p>
          </div>
          {trackToggle}
        </Card>

        <LeaderboardTable
          students={students}
          title={`الترتيب العام — ${activeTrack === "MALE" ? "ذكور" : "إناث"}`}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <LeaderboardTable students={maleStudents.slice(0, 10)} title="أفضل 10 — ذكور" />
          <LeaderboardTable students={femaleStudents.slice(0, 10)} title="أفضل 10 — إناث" />
        </div>
      </section>
    );
  }

  if (activeSection === "approvals") {
    return (
      <section className="space-y-6">
        <Card className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem]">
          <div>
            <h1 className="font-['Reem_Kufi'] text-2xl text-[var(--gold-soft)]">اعتماد المشرفين</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--cream-dim)]">
              مراجعة طلبات المشرفين الجدد واعتمادها أو رفضها.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {trackToggle}
            <Link
              href="/signup"
              className="rounded-xl border border-[rgba(227,201,141,0.24)] bg-[rgba(227,201,141,0.12)] px-4 py-2 text-sm font-semibold text-[var(--gold-soft)]"
            >
              إنشاء حساب مشرف جديد
            </Link>
          </div>
        </Card>

        <ApprovalBoard pendingSupervisors={trackPending} centers={centers} />
      </section>
    );
  }

  return null;
}
