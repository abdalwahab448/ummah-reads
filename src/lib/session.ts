import { cookies } from "next/headers";

import {
  decodeSession,
  encodeSession,
  sanitizeSession,
  SESSION_COOKIE_NAME
} from "@/lib/session-helpers";
import type { UserSession } from "@/lib/types";

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  return decodeSession(match?.[1]);
}

export function setSessionCookie(session: UserSession) {
  return {
    name: SESSION_COOKIE_NAME,
    value: encodeSession(session),
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0
  };
}

export { decodeSession, encodeSession, sanitizeSession };