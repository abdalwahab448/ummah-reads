import { redirect } from "next/navigation";

import { OwnerDashboard } from "@/components/owner/owner-dashboard";
import { parseDashboardSection } from "@/lib/dashboard-nav";
import { getSessionFromCookies } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";

export default async function OwnerDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ section?: string }>;
}) {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "OWNER") {
    redirect("/login?next=/owner");
  }

  const params = await searchParams;
  const activeSection = parseDashboardSection(params?.section);

  const [
    maleStudents,
    femaleStudents,
    maleCenters,
    femaleCenters,
    pendingSupervisors,
    approvedSupervisors,
    centerCount,
    studentCount,
    supervisorCount,
    pagesAggregate,
    booksAggregate,
    masterBooks
  ] = await Promise.all([
    prisma.student.findMany({
      where: { track: "MALE" },
      include: { books: true },
      orderBy: { totalPages: "desc" }
    }),
    prisma.student.findMany({
      where: { track: "FEMALE" },
      include: { books: true },
      orderBy: { totalPages: "desc" }
    }),
    prisma.center.findMany({
      where: { track: "MALE" },
      include: {
        _count: { select: { students: true, users: true } },
        users: { where: { role: "SUPERVISOR" }, select: { id: true, name: true, email: true } }
      },
      orderBy: { name: "asc" }
    }),
    prisma.center.findMany({
      where: { track: "FEMALE" },
      include: {
        _count: { select: { students: true, users: true } },
        users: { where: { role: "SUPERVISOR" }, select: { id: true, name: true, email: true } }
      },
      orderBy: { name: "asc" }
    }),
    prisma.user.findMany({
      where: { role: "SUPERVISOR", isApproved: false },
      orderBy: { name: "asc" }
    }),
    prisma.user.findMany({
      where: { role: "SUPERVISOR", isApproved: true },
      orderBy: { name: "asc" }
    }),
    prisma.center.count(),
    prisma.student.count(),
    prisma.user.count({ where: { role: "SUPERVISOR", isApproved: true } }),
    prisma.student.aggregate({ _sum: { totalPages: true } }),
    prisma.student.aggregate({ _sum: { totalBooks: true } }),
    prisma.masterBook.findMany({ orderBy: { title: "asc" } })
  ]);

  return (
    <OwnerDashboard
      activeSection={activeSection}
      maleStudents={maleStudents}
      femaleStudents={femaleStudents}
      maleCenters={maleCenters}
      femaleCenters={femaleCenters}
      allCenters={[...maleCenters, ...femaleCenters]}
      allStudents={[...maleStudents, ...femaleStudents]}
      masterBooks={masterBooks.map((book) => ({
        id: book.id,
        track: book.track,
        title: book.title,
        pagesCount: (book as any).pagesCount ?? 0,
        createdById: book.createdById,
        createdAt: book.createdAt.toISOString()
      }))}
      pendingSupervisors={pendingSupervisors.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        track: user.track,
        isApproved: user.isApproved,
        centerId: user.centerId
      }))}
      approvedSupervisors={approvedSupervisors.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        track: user.track,
        isApproved: user.isApproved,
        centerId: user.centerId
      }))}
      stats={{
        centerCount,
        studentCount,
        supervisorCount,
        totalPages: pagesAggregate._sum.totalPages ?? 0,
        totalBooks: booksAggregate._sum.totalBooks ?? 0,
        masterBookCount: masterBooks.length
      }}
    />
  );
}
