import { NextResponse } from "next/server";
import { z } from "zod";

import { canManageCenters, canViewTrack } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const url = new URL(request.url);
  const track = url.searchParams.get("track");

  const centers = await prisma.center.findMany({
    where: track ? { track: track as "MALE" | "FEMALE" } : {},
    include: {
      _count: { select: { students: true, users: true } },
      users: {
        where: { role: "SUPERVISOR", isApproved: true },
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: [{ track: "asc" }, { name: "asc" }]
  });

  const filtered = centers.filter((center) => canViewTrack(session, center.track));

  return NextResponse.json({ centers: filtered });
}

const centerCreateSchema = z.object({
  name: z.string().min(2),
  track: z.enum(["MALE", "FEMALE"])
});

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = centerCreateSchema.parse(await request.json());

    if (!canManageCenters(session, body.track)) {
      return NextResponse.json({ message: "ليس لديك صلاحية إنشاء مراكز" }, { status: 403 });
    }

    const center = await prisma.center.create({ data: body });
    return NextResponse.json({ center }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "بيانات المركز غير صالحة" }, { status: 400 });
  }
}
