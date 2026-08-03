import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getSessionFromCookies } from "@/lib/server-session";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  track: z.enum(["MALE", "FEMALE"])
});

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();

    if (!session || (session.role !== "OWNER" && session.role !== "MANAGER")) {
      return NextResponse.json({ message: "لا توجد صلاحية لإنشاء حساب مشرف" }, { status: 403 });
    }

    const payload = signupSchema.parse(await request.json());
    const email = payload.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({ message: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
    }

    await prisma.user.create({
      data: {
        name: payload.name,
        email,
        role: "SUPERVISOR",
        track: payload.track,
        passwordHash: hashPassword(payload.password),
        isApproved: false,
        centerId: null
      }
    });

    return NextResponse.json({
      message: "تم استلام طلبك وسيتم مراجعته من قبل المدير أو المالك"
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "بيانات التسجيل غير صالحة" }, { status: 400 });
    }

    return NextResponse.json({ message: "تعذر إنشاء الحساب" }, { status: 500 });
  }
}
