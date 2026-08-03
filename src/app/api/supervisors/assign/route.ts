import { NextResponse } from "next/server";
import { z } from "zod";

import { canAssignSupervisors, canViewTrack } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

const schema = z.object({
  userId: z.string().min(1),
  centerId: z.string().nullable()
});

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session || !canAssignSupervisors(session)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const { userId, centerId } = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== "SUPERVISOR" || !user.isApproved) {
      return NextResponse.json({ message: "المشرف غير موجود أو غير معتمد" }, { status: 404 });
    }

    if (!canViewTrack(session, user.track)) {
      return NextResponse.json({ message: "ليس لديك صلاحية تعيين هذا المشرف" }, { status: 403 });
    }

    if (centerId) {
      const center = await prisma.center.findUnique({ where: { id: centerId } });

      if (!center) {
        return NextResponse.json({ message: "المركز غير موجود" }, { status: 404 });
      }

      if (center.track !== user.track) {
        return NextResponse.json({ message: "فئة المركز لا تطابق فئة المشرف" }, { status: 400 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { centerId }
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ message: "بيانات التعيين غير صالحة" }, { status: 400 });
  }
}
