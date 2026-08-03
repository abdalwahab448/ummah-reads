import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { setSessionCookie, sanitizeSession } from "@/lib/session";
import type { Role, Track } from "@/lib/types";
import { verifyPassword, hashPassword } from "@/lib/password";
import { FIXED_PRIMARY_ACCOUNTS } from "@/lib/fixed-auth";

type LoginBody = {
  email?: string;
  password?: string;
  role?: Role;
  track?: Track;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim().toLowerCase();

  if (!email || !body.password || !body.role || !body.track) {
    return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });

  let user = existingUser && existingUser.role === body.role && existingUser.track === body.track ? existingUser : null;

  if (!user) {
    const fixedAccount = FIXED_PRIMARY_ACCOUNTS.find(
      (account) =>
        account.email.toLowerCase() === email &&
        account.role === body.role &&
        account.track === body.track
    );

    if (fixedAccount) {
      user = await prisma.user.create({
        data: {
          name: fixedAccount.name,
          email,
          role: fixedAccount.role,
          track: fixedAccount.track,
          passwordHash: hashPassword(fixedAccount.password),
          isApproved: fixedAccount.isApproved,
          centerId: fixedAccount.centerId
        }
      });
    }
  }

  if (!user) {
    return NextResponse.json({ message: "Account not found" }, { status: 404 });
  }

  if (!user.passwordHash || !verifyPassword(body.password, user.passwordHash)) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  if (body.role === "SUPERVISOR" && !user.isApproved) {
    return NextResponse.json({ message: "Account pending approval" }, { status: 403 });
  }

  const session = sanitizeSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    track: user.track,
    isApproved: user.isApproved,
    centerId: user.centerId
  });

  const response = NextResponse.json({ session });
  response.cookies.set(setSessionCookie(session));
  return response;
}