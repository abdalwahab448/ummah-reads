import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { roleLabel, trackLabel } from "@/lib/auth";
import { getSessionFromCookies } from "@/lib/server-session";

export default async function OwnerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "OWNER") {
    redirect("/login?next=/owner");
  }

  return <DashboardShell session={{ ...session, name: `${roleLabel(session.role)} - ${trackLabel(session.track)}` }}>{children}</DashboardShell>;
}