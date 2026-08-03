import { NextResponse } from "next/server";
import { z } from "zod";

import { canManageCenters } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

const centerUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  track: z.enum(["MALE", "FEMALE"]).optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const center = await prisma.center.findUnique({ where: { id } });

  if (!center) {
    return NextResponse.json({ message: "المركز غير موجود" }, { status: 404 });
  }

  const targetTrack = center.track;

  if (!canManageCenters(session, targetTrack)) {
    return NextResponse.json({ message: "ليس لديك صلاحية تعديل هذا المركز" }, { status: 403 });
  }

  try {
    const body = centerUpdateSchema.parse(await request.json());

    if (body.track && !canManageCenters(session, body.track)) {
      return NextResponse.json({ message: "ليس لديك صلاحية تغيير الفئة" }, { status: 403 });
    }

    const updated = await prisma.center.update({ where: { id }, data: body });
    return NextResponse.json({ center: updated });
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
  const center = await prisma.center.findUnique({ where: { id } });

  if (!center) {
    return NextResponse.json({ message: "المركز غير موجود" }, { status: 404 });
  }

  if (!canManageCenters(session, center.track)) {
    return NextResponse.json({ message: "ليس لديك صلاحية حذف هذا المركز" }, { status: 403 });
  }

  await prisma.center.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
