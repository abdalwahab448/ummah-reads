"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, PlusCircle, Trash2, User } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { StudentWithBooks } from "@/lib/types";

type StudentCardProps = {
  student: StudentWithBooks;
  rank?: number;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  onAddReading?: (studentId: string, title: string, pagesCount: string) => Promise<void> | void;
  onDeleteReading?: (bookId: string) => Promise<void> | void;
};

export function StudentCardDisplay({
  student,
  rank,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  isDeleting,
  onAddReading,
  onDeleteReading
}: StudentCardProps) {
  const booksCount = student.books?.length ?? 0;
  const latestBook = student.books?.[student.books.length - 1];
  const progressPercent = Math.min(100, Math.round((student.totalPages / Math.max(1, student.totalBooks * 35 + 60)) * 100));
  const [readingTitle, setReadingTitle] = useState("");
  const [readingPages, setReadingPages] = useState("");
  const [isSavingReading, setIsSavingReading] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const [readingError, setReadingError] = useState<string | null>(null);
  const [isReadingExpanded, setIsReadingExpanded] = useState(false);

  async function handleAddReading(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!onAddReading || !readingTitle.trim()) {
      return;
    }

    setReadingError(null);
    setIsSavingReading(true);

    try {
      await onAddReading(student.id, readingTitle.trim(), readingPages);
      setReadingTitle("");
      setReadingPages("");
    } catch (error) {
      setReadingError(error instanceof Error ? error.message : "تعذر تسجيل القراءة");
    } finally {
      setIsSavingReading(false);
    }
  }

  async function handleDeleteReading(bookId: string) {
    if (!onDeleteReading) {
      return;
    }

    setReadingError(null);
    setDeletingBookId(bookId);

    try {
      await onDeleteReading(bookId);
    } catch (error) {
      setReadingError(error instanceof Error ? error.message : "تعذر حذف سجل القراءة");
    } finally {
      setDeletingBookId(null);
    }
  }

  return (
    <Card className="relative overflow-hidden rounded-[1.25rem] border-[#c9a15e]/20 bg-[linear-gradient(180deg,#0d1c16_0%,#060e0b_100%)] p-0">
      {rank ? (
        <div className="absolute left-4 top-4 z-10 rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.88)] px-3 py-1 text-xs font-bold text-[var(--gold-soft)]">
          #{rank}
        </div>
      ) : null}
      <div className="h-1.5 bg-[rgba(47,107,84,0.75)]" />
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[rgba(227,201,141,0.16)] bg-[rgba(14,28,23,0.94)]">
            {student.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student.photoUrl}
                alt={`${student.firstName} ${student.lastName}`}
                className="h-14 w-14 rounded-2xl object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-[var(--gold-soft)]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-[var(--cream)]">
              {student.firstName} {student.fatherName} {student.lastName}
            </h3>
            <p className="mt-1 text-sm text-[var(--cream-dim)]">العمر: {student.age} سنة</p>
            <p className="mt-1 text-xs text-[var(--cream-dim)]">الصفحات: {student.totalPages} | الكتب: {student.totalBooks || booksCount}</p>
          </div>
        </div>

        <div className="mt-4 rounded-[1rem] border border-[#c9a15e]/20 bg-[#0a1713] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--cream-dim)]">الحالة الحالية</p>
              <p className="mt-1 text-sm font-semibold text-[var(--cream)]">
                {latestBook ? latestBook.bookTitleOrNumber : "ابدأ بحفظ أول سجل قراءة"}
              </p>
            </div>
            <span className="rounded-full border border-[#c9a15e]/20 bg-[#10241d] px-2.5 py-1 text-xs font-semibold text-[var(--gold-soft)]">
              {latestBook ? `${latestBook.pagesCount} صفحة` : "جديد"}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[#0d1c16]">
            <div className="h-2 rounded-full bg-[var(--gold-soft)]" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[var(--cream-dim)]">
            <span>تقدم القراءة</span>
            <span>{progressPercent}%</span>
          </div>
          <button
            type="button"
            onClick={() => setIsReadingExpanded(true)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#c9a15e]/40 bg-[var(--gold-soft)] px-3 py-2.5 text-sm font-semibold text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <PlusCircle className="h-4 w-4" />
            تسجيل قراءة جديدة
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#c9a15e]/20 bg-[#0a1713] px-4 py-3">
            <p className="text-xs font-semibold text-[var(--cream-dim)]">عدد الصفحات</p>
            <p className="mt-1 text-xl font-bold text-[var(--cream)]">{student.totalPages}</p>
          </div>
          <div className="rounded-2xl border border-[#c9a15e]/20 bg-[#0a1713] px-4 py-3">
            <p className="text-xs font-semibold text-[var(--cream-dim)]">عدد الكتب</p>
            <p className="mt-1 flex items-center gap-1 text-xl font-bold text-[var(--cream)]">
              <BookOpen className="h-4 w-4 text-[var(--gold-soft)]" />
              {student.totalBooks || booksCount}
            </p>
          </div>
        </div>

        {(canEdit || canDelete) && (
          <div className="mt-4 flex gap-2">
            {canEdit && onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(47,107,84,0.42)] px-4 py-2 text-xs font-semibold text-[var(--cream)] transition hover:bg-[rgba(47,107,84,0.6)]"
              >
                تعديل
              </button>
            ) : null}
            {canDelete && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/15 disabled:opacity-50"
              >
                {isDeleting ? "جارٍ الحذف..." : "حذف"}
              </button>
            ) : null}
          </div>
        )}

        <div className="mt-5 rounded-[1rem] border border-[rgba(227,201,141,0.16)] bg-[rgba(14,28,23,0.94)] p-4">
          <button
            type="button"
            onClick={() => setIsReadingExpanded((value) => !value)}
            className="flex w-full items-center justify-between gap-2 rounded-sm text-right"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[var(--gold-soft)]" />
              <h4 className="text-sm font-bold text-[var(--cream)]">سجل القراءة</h4>
            </div>
            {isReadingExpanded ? <ChevronUp className="h-4 w-4 text-[var(--cream-dim)]" /> : <ChevronDown className="h-4 w-4 text-[var(--cream-dim)]" />}
          </button>

          {isReadingExpanded ? (
            <div className="mt-3 space-y-3">
              <form className="grid gap-2" onSubmit={handleAddReading}>
                <input
                  className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-3 py-2.5 text-sm text-[var(--cream)] outline-none transition placeholder:text-[var(--cream-dim)] focus:border-[var(--gold)]"
                  placeholder="عنوان الكتاب أو رقمه"
                  value={readingTitle}
                  onChange={(event) => setReadingTitle(event.target.value)}
                  required
                />
                <input
                  className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-3 py-2.5 text-sm text-[var(--cream)] outline-none transition placeholder:text-[var(--cream-dim)] focus:border-[var(--gold)]"
                  placeholder="عدد الصفحات"
                  type="number"
                  min={1}
                  value={readingPages}
                  onChange={(event) => setReadingPages(event.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={isSavingReading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(47,107,84,0.42)] px-3 py-2 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(47,107,84,0.6)] disabled:opacity-60"
                >
                  <PlusCircle className="h-4 w-4" />
                  {isSavingReading ? "جارٍ الحفظ..." : "تسجيل القراءة"}
                </button>
              </form>

              {readingError ? (
                <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {readingError}
                </p>
              ) : null}

              {student.books.length > 0 ? (
                <div className="space-y-2">
                  {student.books.map((book) => (
                    <div key={book.id} className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(227,201,141,0.16)] bg-[rgba(8,20,15,0.82)] px-3 py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-[var(--cream)]">{book.bookTitleOrNumber}</p>
                        <p className="text-xs text-[var(--cream-dim)]">{book.pagesCount} صفحة</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteReading(book.id)}
                        disabled={deletingBookId === book.id}
                        className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-2.5 py-2 text-xs font-semibold text-rose-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--cream-dim)]">لا توجد سجلات قراءة بعد.</p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
