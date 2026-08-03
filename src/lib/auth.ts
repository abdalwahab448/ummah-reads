import { decodeSession } from "@/lib/session-helpers";
import { Role, Track, UserSession } from "@/lib/types";

export type RouteRule = {
  prefix: string;
  roles: Role[];
  trackAware?: boolean;
};

export const ROUTE_RULES: RouteRule[] = [
  { prefix: "/owner", roles: ["OWNER"] },
  { prefix: "/manager", roles: ["MANAGER", "OWNER"], trackAware: true },
  { prefix: "/supervisor", roles: ["SUPERVISOR", "MANAGER", "OWNER"], trackAware: true }
];

export function normalizeSessionFromCookie(rawValue?: string): UserSession | null {
  const session = decodeSession(rawValue);

  if (!session?.role || !session?.track) {
    return null;
  }

  return session;
}

export function canAccessRoute(session: UserSession, pathname: string): boolean {
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

export function trackLabel(track: Track) {
  return track === "MALE" ? "ذكور" : "إناث";
}

export function roleLabel(role: Role) {
  return {
    OWNER: "مالك المسابقة",
    MANAGER: "المدير",
    SUPERVISOR: "المشرف",
    STUDENT: "الطالب"
  }[role];
}