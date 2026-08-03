import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const centerId = url.searchParams.get("centerId");
  const track = url.searchParams.get("track");

  const students = await prisma.student.findMany({
    where: {
      ...(centerId ? { centerId } : {}),
      ...(track ? { track: track as "MALE" | "FEMALE" } : {})
    },
    include: { books: true },
    orderBy: { totalPages: "desc" }
  });

  const leaderboard = students.map((student) => ({
    ...student,
    bookRefs: student.books.map((book) => book.bookTitleOrNumber).join("، ")
  }));

  return NextResponse.json({ leaderboard });
}