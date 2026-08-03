import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/server-session";

export async function GET() {
  const session = await getSessionFromCookies();
  return NextResponse.json({ session });
}