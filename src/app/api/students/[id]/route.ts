import { NextResponse } from "next/server";
import { z } from "zod";

import { canManageStudent } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

const studentUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  fatherName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  age: z.coerce.number().int().positive().max(100).optional(),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  centerId: z.string().min(1).optional(),
  totalPages: z.coerce.number().int().nonnegative().optional(),
  totalBooks: z.coerce.number().int().nonnegative().optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.student.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ message: "الطالب غير موجود" }, { status: 404 });
  }

  if (!canManageStudent(session, existing.track, existing.centerId)) {
    return NextResponse.json({ message: "ليس لديك صلاحية تعديل هذا الطالب" }, { status: 403 });
  }

  try {
    const payload = studentUpdateSchema.parse(await request.json());

    if (payload.centerId && payload.centerId !== existing.centerId) {
      if (!canManageStudent(session, existing.track, payload.centerId)) {
        return NextResponse.json({ message: "ليس لديك صلاحية نقل الطالب" }, { status: 403 });
      }
    }

    const student = await prisma.student.update({
      where: { id },
      data: payload
    });

    return NextResponse.json({ student });
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
  const existing = await prisma.student.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ message: "الطالب غير موجود" }, { status: 404 });
  }

  if (!canManageStudent(session, existing.track, existing.centerId)) {
    return NextResponse.json({ message: "ليس لديك صلاحية حذف هذا الطالب" }, { status: 403 });
  }

  await prisma.student.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
