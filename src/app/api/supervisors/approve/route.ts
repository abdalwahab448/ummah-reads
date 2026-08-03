import { NextResponse } from "next/server";
import { z } from "zod";

import { canApproveSupervisors, canViewTrack } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

const schema = z.object({
  userId: z.string().min(1),
  centerId: z.string().min(1)
});

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session || !canApproveSupervisors(session)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const { userId, centerId } = schema.parse(await request.json());

    const [user, center] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.center.findUnique({ where: { id: centerId } })
    ]);

    if (!user || user.role !== "SUPERVISOR") {
      return NextResponse.json({ message: "المشرف غير موجود" }, { status: 404 });
    }

    if (!center) {
      return NextResponse.json({ message: "المركز غير موجود" }, { status: 404 });
    }

    if (!canViewTrack(session, user.track) || !canViewTrack(session, center.track)) {
      return NextResponse.json({ message: "ليس لديك صلاحية اعتماد هذا المشرف" }, { status: 403 });
    }

    if (user.track !== center.track) {
      return NextResponse.json({ message: "فئة المشرف لا تطابق فئة المركز" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true, centerId }
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ message: "بيانات الاعتماد غير صالحة" }, { status: 400 });
  }
}
