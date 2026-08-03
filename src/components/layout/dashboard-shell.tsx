"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BarChart3, BookOpen, Building2, Home, ShieldCheck, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { roleLabel, trackLabel } from "@/lib/auth";
import {
  DASHBOARD_SECTIONS,
  getDashboardBasePath,
  getSectionsForRole,
  parseDashboardSection,
  type DashboardSection
} from "@/lib/dashboard-nav";
import type { UserSession } from "@/lib/types";

const sectionIcons: Record<DashboardSection, typeof Home> = {
  home: Home,
  centers: Building2,
  students: Users,
  books: BookOpen,
  leaderboard: BarChart3,
  approvals: ShieldCheck
};

type DashboardShellProps = {
  session: UserSession;
  children: React.ReactNode;
};

export function DashboardShell({ session, children }: DashboardShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSection = parseDashboardSection(searchParams.get("section"));
  const basePath = getDashboardBasePath(session.role);
  const sections = getSectionsForRole(session.role);

  return (
    <div className="min-h-screen bg-[transparent] text-[var(--cream)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <Card className="h-full border-[#c9a15e]/20 bg-[linear-gradient(145deg,rgba(10,23,19,0.98),rgba(6,14,11,0.98))] p-5">
            <div className="mb-6 rounded-[1rem] border border-[#c9a15e]/20 bg-[linear-gradient(135deg,rgba(8,20,15,0.96),rgba(12,31,24,0.96))] px-5 py-6">
              <p className="text-sm text-[var(--gold-soft)]">{roleLabel(session.role)}</p>
              <p className="mt-2 text-sm text-[var(--cream-dim)]">
                {trackLabel(session.track)} | {session.email}
              </p>
            </div>

            <nav className="grid gap-2">
              {sections.map((section) => {
                const Icon = sectionIcons[section.id];
                const href = section.id === "home" ? basePath : `${basePath}?section=${section.id}`;
                const isActive =
                  section.id === "home"
                    ? activeSection === "home" && pathname === basePath
                    : activeSection === section.id;

                return (
                  <Link
                    key={section.id}
                    href={href}
                    className={`flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-right text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                      isActive
                        ? "border-[#c9a15e]/30 bg-[rgba(47,107,84,0.45)] text-[var(--cream)]"
                        : "text-[var(--cream-dim)] hover:border-[#c9a15e]/20 hover:bg-[#10241d] hover:text-[var(--cream)]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-[var(--gold-soft)]" : "text-[var(--cream-dim)]"}`} />
                    {section.label}
                  </Link>
                );
              })}
            </nav>
          </Card>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
