import { NextResponse } from "next/server";
import { z } from "zod";

import { canViewStudents, canViewTrack } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const url = new URL(request.url);
  const track = url.searchParams.get("track");
  const role = url.searchParams.get("role") ?? "SUPERVISOR";

  const users = await prisma.user.findMany({
    where: {
      role: role as "SUPERVISOR" | "MANAGER" | "OWNER",
      ...(track ? { track: track as "MALE" | "FEMALE" } : {})
    },
    include: { center: { select: { id: true, name: true } } },
    orderBy: { name: "asc" }
  });

  const filtered = users.filter((user) => canViewTrack(session, user.track));

  if (!canViewStudents(session)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  return NextResponse.json({ users: filtered });
}
