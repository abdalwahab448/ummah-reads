import { NextResponse } from "next/server";
import { z } from "zod";

import { canLogReading } from "@/lib/permissions";
import { ensureMasterBook, normalizeBookTitle } from "@/lib/master-books";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

const bookCreateSchema = z.object({
  studentId: z.string().min(1),
  bookTitleOrNumber: z.string().min(1),
  pagesCount: z.coerce.number().int().positive()
});

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = bookCreateSchema.parse(await request.json());
    const student = await prisma.student.findUnique({ where: { id: body.studentId } });

    if (!student) {
      return NextResponse.json({ message: "الطالب غير موجود" }, { status: 404 });
    }

    if (!canLogReading(session, student.track, student.centerId)) {
      return NextResponse.json({ message: "ليس لديك صلاحية تسجيل القراءة" }, { status: 403 });
    }

    const title = normalizeBookTitle(body.bookTitleOrNumber);

    const book = await prisma.$transaction(async (transaction) => {
      const createdBook = await transaction.book.create({
        data: {
          studentId: body.studentId,
          bookTitleOrNumber: title,
          pagesCount: body.pagesCount
        }
      });

      await transaction.student.update({
        where: { id: createdBook.studentId },
        data: {
          totalPages: { increment: createdBook.pagesCount },
          totalBooks: { increment: 1 }
        }
      });

      return createdBook;
    });

    await ensureMasterBook(title, student.track, session.id, body.pagesCount);

    return NextResponse.json({ book }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "بيانات القراءة غير صالحة" }, { status: 400 });
  }
}
