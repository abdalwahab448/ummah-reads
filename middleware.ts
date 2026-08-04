import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

type Role = "OWNER" | "MANAGER" | "SUPERVISOR" | "STUDENT";
type Track = "MALE" | "FEMALE";
type UserSession = {
  id: string;
  name: string;
  email: string;
  role: Role;
  track: Track;
  isApproved: boolean;
  centerId: string | null;
};

type RouteRule = {
  prefix: string;
  roles: Role[];
  trackAware?: boolean;
};

const ROUTE_RULES: RouteRule[] = [
  { prefix: "/owner", roles: ["OWNER"] },
  { prefix: "/manager", roles: ["MANAGER", "OWNER"], trackAware: true },
  { prefix: "/supervisor", roles: ["SUPERVISOR", "MANAGER", "OWNER"], trackAware: true }
];

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(normalized + padding);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function normalizeSessionFromCookie(rawValue?: string | null): UserSession | null {
  if (!rawValue) {
    return null;
  }

  try {
    const json = decodeBase64Url(rawValue);
    const session = JSON.parse(json) as UserSession;

    if (!session?.role || !session?.track) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

function canAccessRoute(session: UserSession, pathname: string): boolean {
  const rule = ROUTE_RULES.find((item) => pathname.startsWith(item.prefix));

  if (!rule) {
    return true;
  }

  if (!rule.roles.includes(session.role)) {
    return false;
  }

  if (rule.trackAware && pathname.includes("/male") && session.track !== "MALE") {
    return session.role === "OWNER";
  }

  if (rule.trackAware && pathname.includes("/female") && session.track !== "FEMALE") {
    return session.role === "OWNER";
  }

  return true;
}

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