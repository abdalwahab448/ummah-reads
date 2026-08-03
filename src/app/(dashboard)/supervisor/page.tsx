import { redirect } from "next/navigation";

import { SupervisorDashboardClient } from "@/components/supervisor/supervisor-dashboard-client";
import { Card } from "@/components/ui/card";
import { parseDashboardSection } from "@/lib/dashboard-nav";
import { getSessionFromCookies } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";

export default async function SupervisorDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ section?: string }>;
}) {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "SUPERVISOR") {
    redirect("/login?next=/supervisor");
  }

  if (!session.isApproved) {
    return (
      <section className="space-y-6">
        <Card className="border-slate-200 bg-slate-50">
          <h1 className="text-2xl font-bold text-slate-900">لوحة المشرف</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            حسابك قيد المراجعة من قبل المدير. يرجى الانتظار حتى يتم اعتماد حسابك وتعيين مركز لك.
          </p>
        </Card>
      </section>
    );
  }

  const params = await searchParams;
  const activeSection = parseDashboardSection(params?.section);
  const track = session.track;

  const [center, students, centers, leaderboard, pagesAggregate, studentCount, masterBooks] = await Promise.all([
    session.centerId
      ? prisma.center.findUnique({ where: { id: session.centerId } })
      : Promise.resolve(null),
    session.centerId
      ? prisma.student.findMany({
          where: { centerId: session.centerId },
          include: { books: true },
          orderBy: { totalPages: "desc" }
        })
      : Promise.resolve([]),
    prisma.center.findMany({
      where: { track },
      include: {
        students: { include: { books: true }, orderBy: { totalPages: "desc" } },
        _count: { select: { students: true } }
      },
      orderBy: { name: "asc" }
    }),
    prisma.student.findMany({
      where: { track },
      include: { books: true },
      orderBy: { totalPages: "desc" }
    }),
    session.centerId
      ? prisma.student.aggregate({
          where: { centerId: session.centerId },
          _sum: { totalPages: true, totalBooks: true }
        })
      : Promise.resolve({ _sum: { totalPages: 0, totalBooks: 0 } }),
    session.centerId ? prisma.student.count({ where: { centerId: session.centerId } }) : Promise.resolve(0),
    prisma.masterBook.findMany({ where: { track }, orderBy: { title: "asc" } })
  ]);

  if (!session.centerId) {
    return (
      <section className="space-y-6">
        <Card>
          <h1 className="text-2xl font-bold text-slate-900">لوحة المشرف</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            حسابك معتمد لكن لم يتم ربطه بمركز بعد. يرجى انتظار المدير لتعيين المركز المناسب.
          </p>
        </Card>

        <SupervisorDashboardClient
          activeSection={activeSection}
          centerId={null}
          centerName=""
          centerTrack={track}
          students={[]}
          centers={centers}
          leaderboard={leaderboard}
          masterBooks={masterBooks.map((book) => ({
            id: book.id,
            track: book.track,
            title: book.title,
            pagesCount: (book as any).pagesCount ?? 0,
            createdById: book.createdById,
            createdAt: book.createdAt.toISOString()
          }))}
          isApproved
          stats={{ studentCount: 0, totalPages: 0, totalBooks: 0, masterBookCount: masterBooks.length }}
        />
      </section>
    );
  }

  return (
    <SupervisorDashboardClient
      activeSection={activeSection}
      centerId={session.centerId}
      centerName={center?.name ?? "المركز غير معروف"}
      centerTrack={center?.track ?? track}
      students={students}
      centers={centers}
      leaderboard={leaderboard}
      masterBooks={masterBooks.map((book) => ({
        id: book.id,
        track: book.track,
        title: book.title,
        pagesCount: (book as any).pagesCount ?? 0,
        createdById: book.createdById,
        createdAt: book.createdAt.toISOString()
      }))}
      isApproved
      stats={{
        studentCount: typeof studentCount === "number" ? studentCount : 0,
        totalPages: pagesAggregate._sum.totalPages ?? 0,
        totalBooks: pagesAggregate._sum.totalBooks ?? 0,
        masterBookCount: masterBooks.length
      }}
    />
  );
}
