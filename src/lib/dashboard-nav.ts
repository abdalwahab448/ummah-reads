import type { Role } from "@/lib/types";

export type DashboardSection = "home" | "centers" | "students" | "books" | "leaderboard" | "approvals";

export const DASHBOARD_SECTIONS: {
  id: DashboardSection;
  label: string;
  roles?: Role[];
}[] = [
  { id: "home", label: "الرئيسية" },
  { id: "centers", label: "المراكز" },
  { id: "students", label: "الطلاب" },
  { id: "books", label: "الكتب" },
  { id: "leaderboard", label: "الترتيب" },
  { id: "approvals", label: "الاعتمادات", roles: ["OWNER", "MANAGER"] }
];

export function parseDashboardSection(value: string | null | undefined): DashboardSection {
  const valid: DashboardSection[] = ["home", "centers", "students", "books", "leaderboard", "approvals"];
  if (value && valid.includes(value as DashboardSection)) {
    return value as DashboardSection;
  }
  return "home";
}

export function getSectionsForRole(role: Role) {
  return DASHBOARD_SECTIONS.filter((section) => !section.roles || section.roles.includes(role));
}

export function getDashboardBasePath(role: Role) {
  if (role === "OWNER") return "/owner";
  if (role === "MANAGER") return "/manager";
  return "/supervisor";
}
