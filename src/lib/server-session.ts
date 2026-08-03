import { cookies } from "next/headers";

import { decodeSession, SESSION_COOKIE_NAME } from "@/lib/session-helpers";

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  return decodeSession(match?.[1]);
}
