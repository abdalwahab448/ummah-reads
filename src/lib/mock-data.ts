import type { Book, Center, Student, UserSession } from "@/lib/types";

export const centers: Center[] = [];

export const users: UserSession[] = [];

export const students: Student[] = [];

export const books: Book[] = [];

export const sessionPreview: UserSession = {
  id: "u-preview",
  name: "المشرف النموذجي",
  email: "preview@ummahreads.org",
  role: "SUPERVISOR",
  track: "MALE",
  isApproved: false,
  centerId: null
};