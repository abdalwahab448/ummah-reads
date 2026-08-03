export type Track = "MALE" | "FEMALE";
export type Role = "OWNER" | "MANAGER" | "SUPERVISOR" | "STUDENT";

export type UserSession = {
  id: string;
  name: string;
  email: string;
  role: Role;
  track: Track;
  isApproved: boolean;
  centerId?: string | null;
};

export type Center = {
  id: string;
  name: string;
  track: Track;
};

export type Student = {
  id: string;
  firstName: string;
  fatherName: string;
  lastName: string;
  age: number;
  phone: string;
  photoUrl: string;
  centerId: string;
  track: Track;
  totalPages: number;
  totalBooks: number;
};

export type Book = {
  id: string;
  studentId: string;
  bookTitleOrNumber: string;
  pagesCount: number;
};

export type StudentWithBooks = Student & {
  books: Book[];
};

export type MasterBook = {
  id: string;
  title: string;
  track: Track;
  pagesCount: number;
  createdById?: string | null;
  createdAt: string;
};