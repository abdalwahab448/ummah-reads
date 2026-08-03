import { NextResponse } from "next/server";
import { z } from "zod";

import { canManageStudent, canViewStudents, canViewTrack } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/server-session";

const DEFAULT_PHOTO = "https://placehold.co/100x100/e8f5f0/145748?text=طالب";

const studentSchema = z.object({
  firstName: z.string().min(1),
  fatherName: z.string().min(1),
  lastName: z.string().min(1),
  age: z.coerce.number().int().positive().max(100),
  phone: z.string().optional().default(""),
  photoUrl: z.string().optional().default(DEFAULT_PHOTO),
  centerId: z.string().min(1),
  track: z.enum(["MALE", "FEMALE"]),
  totalPages: z.coerce.number().int().nonnegative().optional().default(0),
  totalBooks: z.coerce.number().int().nonnegative().optional().default(0)
});

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session || !canViewStudents(session)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  const url = new URL(request.url);
  const centerId = url.searchParams.get("centerId");
  const track = url.searchParams.get("track");

  const students = await prisma.student.findMany({
    where: {
      ...(centerId ? { centerId } : {}),
      ...(track ? { track: track as "MALE" | "FEMALE" } : {})
    },
    include: { books: true },
    orderBy: { totalPages: "desc" }
  });

  const filtered = students.filter((student) => canViewTrack(session, student.track));

  return NextResponse.json({ students: filtered });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = studentSchema.parse(await request.json());

    if (!canManageStudent(session, body.track, body.centerId)) {
      return NextResponse.json({ message: "ليس لديك صلاحية إضافة طلاب" }, { status: 403 });
    }

    const center = await prisma.center.findUnique({ where: { id: body.centerId } });

    if (!center || center.track !== body.track) {
      return NextResponse.json({ message: "المركز غير موجود أو لا يطابق الفئة" }, { status: 400 });
    }

    const student = await prisma.student.create({
      data: {
        ...body,
        totalPages: body.totalPages,
        totalBooks: body.totalBooks
      }
    });

    return NextResponse.json({ student }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "بيانات الطالب غير صالحة" }, { status: 400 });
  }
}
