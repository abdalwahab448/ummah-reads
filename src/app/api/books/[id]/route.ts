import { NextResponse } from "next/server";
import { z } from "zod";

import { canLogReading } from "@/lib/permissions";
import { ensureMasterBook, normalizeBookTitle } from "@/lib/master-books";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

const bookUpdateSchema = z.object({
  bookTitleOrNumber: z.string().min(1).optional(),
  pagesCount: z.coerce.number().int().positive().optional()
});

async function getStudentForBook(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { student: true }
  });

  return book;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const existingBook = await getStudentForBook(id);

  if (!existingBook) {
    return NextResponse.json({ message: "سجل القراءة غير موجود" }, { status: 404 });
  }

  if (!canLogReading(session, existingBook.student.track, existingBook.student.centerId)) {
    return NextResponse.json({ message: "ليس لديك صلاحية تعديل سجل القراءة" }, { status: 403 });
  }

  try {
    const payload = bookUpdateSchema.parse(await request.json());
    const normalizedTitle =
      typeof payload.bookTitleOrNumber === "string"
        ? normalizeBookTitle(payload.bookTitleOrNumber)
        : undefined;

    const updatedBook = await prisma.$transaction(async (transaction) => {
      const book = await transaction.book.update({
        where: { id },
        data: {
          ...(normalizedTitle ? { bookTitleOrNumber: normalizedTitle } : {}),
          ...(typeof payload.pagesCount === "number" ? { pagesCount: payload.pagesCount } : {})
        }
      });

      if (typeof payload.pagesCount === "number") {
        await transaction.student.update({
          where: { id: book.studentId },
          data: { totalPages: { increment: payload.pagesCount - existingBook.pagesCount } }
        });
      }

      return book;
    });

    if (normalizedTitle) {
      await ensureMasterBook(normalizedTitle, existingBook.student.track, session.id, typeof payload.pagesCount === "number" ? payload.pagesCount : 0);
    }

    return NextResponse.json({ book: updatedBook });
  } catch {
    return NextResponse.json({ message: "بيانات التعديل غير صالحة" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const existingBook = await getStudentForBook(id);

  if (!existingBook) {
    return NextResponse.json({ message: "سجل القراءة غير موجود" }, { status: 404 });
  }

  if (!canLogReading(session, existingBook.student.track, existingBook.student.centerId)) {
    return NextResponse.json({ message: "ليس لديك صلاحية حذف سجل القراءة" }, { status: 403 });
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.book.delete({ where: { id } });
    await transaction.student.update({
      where: { id: existingBook.studentId },
      data: {
        totalPages: { decrement: existingBook.pagesCount },
        totalBooks: { decrement: 1 }
      }
    });
  });

  return NextResponse.json({ ok: true });
}
