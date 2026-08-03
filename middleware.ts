import { NextRequest, NextResponse } from "next/server";

import { ROUTE_RULES, canAccessRoute, normalizeSessionFromCookie } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoutes = ["/", "/login", "/signup", "/register"];

  const isPublicRoute = pathname === "/" || publicRoutes.some((route) => route !== "/" && (pathname === route || pathname.startsWith(`${route}/`)));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const session = normalizeSessionFromCookie(request.cookies.get("ummah-reads-session")?.value);
  const rule = ROUTE_RULES.find((item) => pathname.startsWith(item.prefix));

  if (!rule) {
    return NextResponse.next();
  }

  if (!session || !canAccessRoute(session, pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};