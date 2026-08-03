import type { Role, Track } from "@/lib/types";

export type FixedAccount = {
  name: string;
  email: string;
  password: string;
  role: Exclude<Role, "STUDENT">;
  track: Track;
  isApproved: boolean;
  centerId: string | null;
};

export const FIXED_PRIMARY_ACCOUNTS: FixedAccount[] = [
  {
    name: "مالك المسابقة",
    email: "owner@ummahreads.org",
    password: "OwnerUmmah2026!",
    role: "OWNER",
    track: "MALE",
    isApproved: true,
    centerId: null
  },
  {
    name: "مدير الذكور",
    email: "manager-male@ummahreads.org",
    password: "MaleManager2026!",
    role: "MANAGER",
    track: "MALE",
    isApproved: true,
    centerId: null
  },
  {
    name: "مديرة الإناث",
    email: "manager-female@ummahreads.org",
    password: "FemaleManager2026!",
    role: "MANAGER",
    track: "FEMALE",
    isApproved: true,
    centerId: null
  },
  {
    name: "مشرف معتمد ذكور",
    email: "approved.supervisor-male@ummahreads.org",
    password: "SupervisorMale2026!",
    role: "SUPERVISOR",
    track: "MALE",
    isApproved: true,
    centerId: null
  },
  {
    name: "مشرفة معتمدة إناث",
    email: "approved.supervisor-female@ummahreads.org",
    password: "SupervisorFemale2026!",
    role: "SUPERVISOR",
    track: "FEMALE",
    isApproved: true,
    centerId: null
  }
];