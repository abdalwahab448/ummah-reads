import { NextResponse } from "next/server";
import { z } from "zod";

import { canAddMasterBook, canViewMasterBooks } from "@/lib/permissions";
import { ensureMasterBook, normalizeBookTitle } from "@/lib/master-books";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

const masterBookCreateSchema = z.object({
  title: z.string().min(1),
  track: z.enum(["MALE", "FEMALE"]),
  pagesCount: z.coerce.number().int().nonnegative().optional().default(0)
});

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session || !canViewMasterBooks(session)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const trackParam = searchParams.get("track");

  const where: {
    track?: "MALE" | "FEMALE";
    title?: { contains: string };
  } = {};

  if (session.role === "OWNER") {
    if (trackParam === "MALE" || trackParam === "FEMALE") {
      where.track = trackParam;
    }
  } else {
    where.track = session.track;
  }

  if (search) {
    where.title = { contains: search };
  }

  const books = await prisma.masterBook.findMany({
    where,
    orderBy: { title: "asc" }
  });

  return NextResponse.json({
    books: books.map((book) => ({
      id: book.id,
      title: book.title,
      track: book.track,
      pagesCount: book.pagesCount,
      createdById: book.createdById,
      createdAt: book.createdAt.toISOString()
    }))
  });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = masterBookCreateSchema.parse(await request.json());
    const title = normalizeBookTitle(body.title);
    const track = session.role === "OWNER" ? body.track : session.track;

    if (!canAddMasterBook(session, track)) {
      return NextResponse.json({ message: "ليس لديك صلاحية إضافة كتاب" }, { status: 403 });
    }

    const book = await ensureMasterBook(title, track, session.id, body.pagesCount);

    return NextResponse.json(
      {
        book: {
          id: book!.id,
          title: book!.title,
          track: book!.track,
          pagesCount: book!.pagesCount,
          createdById: book!.createdById,
          createdAt: book!.createdAt.toISOString()
        }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "بيانات الكتاب غير صالحة" }, { status: 400 });
  }
}
