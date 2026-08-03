import { books, students } from "@/lib/mock-data";
import type { Book, Student, Track } from "@/lib/types";

export type LeaderboardRow = Student & {
  bookRefs: string;
};

export function getStudentsByTrack(track: Track) {
  return students.filter((student) => student.track === track);
}

export function getCenterStudents(centerId: string) {
  return students.filter((student) => student.centerId === centerId);
}

export function getBooksByStudent(studentId: string): Book[] {
  return books.filter((book) => book.studentId === studentId);
}

export function buildLeaderboard(source: Student[]): LeaderboardRow[] {
  return [...source]
    .sort((left, right) => right.totalPages - left.totalPages)
    .map((student) => ({
      ...student,
      bookRefs: getBooksByStudent(student.id)
        .map((book) => book.bookTitleOrNumber)
        .join("، ")
    }));
}