import { NextResponse } from "next/server";

import { canDeleteMasterBook } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(_request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const book = await prisma.masterBook.findUnique({ where: { id } });

  if (!book) {
    return NextResponse.json({ message: "الكتاب غير موجود" }, { status: 404 });
  }

  if (!canDeleteMasterBook(session, book.track)) {
    return NextResponse.json({ message: "ليس لديك صلاحية حذف هذا الكتاب" }, { status: 403 });
  }

  await prisma.masterBook.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
