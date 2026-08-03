import { redirect } from "next/navigation";

import { getSessionFromCookies } from "@/lib/server-session";

export default async function DashboardIndexPage() {
  const session = await getSessionFromCookies();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "OWNER") {
    redirect("/owner");
  }

  if (session.role === "MANAGER") {
    redirect("/manager");
  }

  redirect("/supervisor");
}
