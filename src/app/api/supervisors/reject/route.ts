import { NextResponse } from "next/server";
import { z } from "zod";

import { canApproveSupervisors, canViewTrack } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

const schema = z.object({
  userId: z.string().min(1)
});

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session || !canApproveSupervisors(session)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const { userId } = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== "SUPERVISOR") {
      return NextResponse.json({ message: "المشرف غير موجود" }, { status: 404 });
    }

    if (!canViewTrack(session, user.track)) {
      return NextResponse.json({ message: "ليس لديك صلاحية رفض هذا المشرف" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "بيانات الرفض غير صالحة" }, { status: 400 });
  }
}
