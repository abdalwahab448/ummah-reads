import { redirect } from "next/navigation";

import { ManagerDashboard } from "@/components/manager/manager-dashboard";
import { parseDashboardSection } from "@/lib/dashboard-nav";
import { getSessionFromCookies } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";

export default async function ManagerDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ section?: string }>;
}) {
  const session = await getSessionFromCookies();

  if (!session || (session.role !== "MANAGER" && session.role !== "OWNER")) {
    redirect("/login?next=/manager");
  }

  const params = await searchParams;
  const activeSection = parseDashboardSection(params?.section);
  const track = session.track;

  const [pendingSupervisors, centers, students, approvedSupervisors, studentCount, pagesAggregate, booksAggregate, masterBooks] =
    await Promise.all([
      prisma.user.findMany({
        where: { role: "SUPERVISOR", isApproved: false, track },
        orderBy: { name: "asc" }
      }),
      prisma.center.findMany({
        where: { track },
        include: {
          _count: { select: { students: true, users: true } },
          users: { where: { role: "SUPERVISOR" }, select: { id: true, name: true, email: true } },
          students: { include: { books: true }, orderBy: { totalPages: "desc" } }
        },
        orderBy: { name: "asc" }
      }),
      prisma.student.findMany({
        where: { track },
        include: { books: true },
        orderBy: { totalPages: "desc" }
      }),
      prisma.user.findMany({
        where: { role: "SUPERVISOR", isApproved: true, track },
        orderBy: { name: "asc" }
      }),
      prisma.student.count({ where: { track } }),
      prisma.student.aggregate({ where: { track }, _sum: { totalPages: true } }),
      prisma.student.aggregate({ where: { track }, _sum: { totalBooks: true } }),
      prisma.masterBook.findMany({ where: { track }, orderBy: { title: "asc" } })
    ]);

  const toSession = (user: (typeof pendingSupervisors)[number]) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    track: user.track,
    isApproved: user.isApproved,
    centerId: user.centerId
  });

  return (
    <ManagerDashboard
      activeSection={activeSection}
      track={track}
      trackLabel={track === "MALE" ? "ذكور" : "إناث"}
      pendingSupervisors={pendingSupervisors.map(toSession)}
      centers={centers}
      students={students}
      masterBooks={masterBooks.map((book) => ({
        id: book.id,
        track: book.track,
        title: book.title,
        pagesCount: (book as any).pagesCount ?? 0,
        createdById: book.createdById,
        createdAt: book.createdAt.toISOString()
      }))}
      approvedSupervisors={approvedSupervisors.map(toSession)}
      stats={{
        centerCount: centers.length,
        studentCount,
        supervisorCount: approvedSupervisors.length,
        totalPages: pagesAggregate._sum.totalPages ?? 0,
        totalBooks: booksAggregate._sum.totalBooks ?? 0,
        masterBookCount: masterBooks.length
      }}
    />
  );
}
