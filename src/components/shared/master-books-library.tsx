"use client";

import { useMemo, useState, useTransition } from "react";
import { BookOpen, PlusCircle, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import type { MasterBook, Role, Track } from "@/lib/types";

type MasterBooksLibraryProps = {
  initialBooks: MasterBook[];
  role: Role;
  userTrack: Track;
  canAdd: boolean;
  canDelete: boolean;
  showTrackFilter?: boolean;
};

export function MasterBooksLibrary({
  initialBooks,
  role,
  userTrack,
  canAdd,
  canDelete,
  showTrackFilter = false
}: MasterBooksLibraryProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<Track | "ALL">("ALL");
  const [newTitle, setNewTitle] = useState("");
  const [newPagesCount, setNewPagesCount] = useState("0");
  const [newTrack, setNewTrack] = useState<Track>(userTrack);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesTrack = trackFilter === "ALL" || book.track === trackFilter;
      const matchesSearch = !query || book.title.toLowerCase().includes(query);
      return matchesTrack && matchesSearch;
    });
  }, [books, search, trackFilter]);

  async function handleAddBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canAdd || !newTitle.trim()) {
      return;
    }

    const pagesCount = Number(newPagesCount);

    if (Number.isNaN(pagesCount) || pagesCount < 1) {
      toast({ title: "أدخل عدد صفحات صحيح", variant: "error" });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/master-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          track: role === "OWNER" ? newTrack : userTrack,
          pagesCount
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message ?? "تعذر إضافة الكتاب");
      }

      const createdBook = result.book as MasterBook;
      setBooks((current) => {
        const exists = current.some((book) => book.id === createdBook.id);
        if (exists) {
          return current;
        }
        return [...current, createdBook].sort((a, b) => a.title.localeCompare(b.title, "ar"));
      });
      setNewTitle("");
      setNewPagesCount("0");
      toast({ title: "تمت إضافة الكتاب", description: "الكتاب متاح الآن في المكتبة المركزية.", variant: "success" });
      startTransition(() => router.refresh());
    } catch (error) {
      toast({
        title: "فشل الإضافة",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "error"
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBook(bookId: string) {
    if (!canDelete) {
      return;
    }

    setDeletingId(bookId);

    try {
      const response = await fetch(`/api/master-books/${bookId}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message ?? "تعذر حذف الكتاب");
      }

      setBooks((current) => current.filter((book) => book.id !== bookId));
      toast({ title: "تم حذف الكتاب", variant: "success" });
      startTransition(() => router.refresh());
    } catch (error) {
      toast({
        title: "فشل الحذف",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "error"
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.4rem] border border-[rgba(227,201,141,0.16)] bg-[linear-gradient(180deg,rgba(14,28,23,0.96),rgba(8,20,15,0.98))]">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[var(--gold-soft)]" />
          <h2 className="font-['Reem_Kufi'] text-xl text-[var(--cream)]">مكتبة الكتب المركزية</h2>
        </div>
        <p className="mt-2 text-sm font-semibold leading-7 text-[var(--cream-dim)]">
          جميع الكتب المسجلة في المسابقة. يتم إضافة الكتب تلقائياً عند تسجيل قراءة الطلاب، ويمكن البحث فيها فوراً.
        </p>
      </Card>

      <Card className="grid gap-4 rounded-[1.25rem] border-[#c9a15e]/20 bg-[linear-gradient(180deg,#0d1c16_0%,#060e0b_100%)] lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cream-dim)]" />
          <input
            className="w-full rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] py-3 pl-4 pr-11 text-base font-semibold text-[var(--cream)] outline-none transition placeholder:text-[var(--cream-dim)] focus:border-[var(--gold)]"
            placeholder="محرك بحث — ابحث عن عنوان الكتاب..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {showTrackFilter ? (
          <select
            className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-base font-semibold text-[var(--cream)] outline-none transition focus:border-[var(--gold)]"
            value={trackFilter}
            onChange={(event) => setTrackFilter(event.target.value as Track | "ALL")}
          >
            <option value="ALL">كل الفئات</option>
            <option value="MALE">ذكور</option>
            <option value="FEMALE">إناث</option>
          </select>
        ) : null}

        <div className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-sm font-semibold text-[var(--gold-soft)]">
          {filteredBooks.length} كتاب
        </div>
      </Card>

      {canAdd ? (
        <Card className="rounded-[1.25rem] border-[#c9a15e]/20 bg-[linear-gradient(180deg,#0d1c16_0%,#060e0b_100%)]">
          <h3 className="font-['Reem_Kufi'] text-lg text-[var(--cream)]">إضافة كتاب جديد</h3>
          <form className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]" onSubmit={handleAddBook}>
            <input
              className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-base font-semibold text-[var(--cream)] outline-none transition placeholder:text-[var(--cream-dim)] focus:border-[var(--gold)]"
              placeholder="عنوان الكتاب أو رقمه"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              required
            />
            <input
              className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-base font-semibold text-[var(--cream)] outline-none transition placeholder:text-[var(--cream-dim)] focus:border-[var(--gold)]"
              placeholder="عدد الصفحات"
              type="number"
              min={1}
              value={newPagesCount}
              onChange={(event) => setNewPagesCount(event.target.value)}
              required
            />
            {role === "OWNER" ? (
              <select
                className="rounded-xl border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-base font-semibold text-[var(--cream)] outline-none transition focus:border-[var(--gold)]"
                value={newTrack}
                onChange={(event) => setNewTrack(event.target.value as Track)}
              >
                <option value="MALE">ذكور</option>
                <option value="FEMALE">إناث</option>
              </select>
            ) : null}
            <Button type="submit" disabled={saving || isPending}>
              <PlusCircle className="ml-2 h-4 w-4" />
              {saving ? "جارٍ الإضافة..." : "إضافة"}
            </Button>
          </form>
        </Card>
      ) : null}

      <Card className="rounded-[1.4rem] border border-[rgba(227,201,141,0.16)] bg-[linear-gradient(180deg,rgba(14,28,23,0.96),rgba(8,20,15,0.98))]">
        <div className="overflow-x-auto rounded-[1rem] border border-[rgba(227,201,141,0.16)]">
          <table className="min-w-full divide-y divide-[rgba(227,201,141,0.14)] text-right text-sm">
            <thead className="bg-[rgba(8,20,15,0.84)] text-[var(--cream)]">
              <tr>
                <th className="px-4 py-3 font-semibold">عنوان الكتاب</th>
                {showTrackFilter ? <th className="px-4 py-3 font-semibold">الفئة</th> : null}
                <th className="px-4 py-3 font-semibold">عدد الصفحات</th>
                <th className="px-4 py-3 font-semibold">تاريخ الإضافة</th>
                {canDelete ? <th className="px-4 py-3 font-semibold">إجراءات</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(227,201,141,0.12)] bg-[rgba(14,28,23,0.92)]">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td
                    colSpan={(showTrackFilter ? 1 : 0) + (canDelete ? 1 : 0) + 3}
                    className="px-4 py-8 text-center text-[var(--cream-dim)]"
                  >
                    {search.trim() ? "لا توجد نتائج مطابقة للبحث" : "لا توجد كتب مسجلة بعد"}
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="transition hover:bg-[rgba(47,107,84,0.14)]">
                    <td className="px-4 py-3 font-semibold text-[var(--cream)]">{book.title}</td>
                    {showTrackFilter ? (
                      <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">
                        {book.track === "MALE" ? "ذكور" : "إناث"}
                      </td>
                    ) : null}
                    <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">{book.pagesCount ?? 0}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--cream-dim)]">
                      {new Date(book.createdAt).toLocaleDateString("ar-SA")}
                    </td>
                    {canDelete ? (
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200"
                          onClick={() => handleDeleteBook(book.id)}
                          disabled={deletingId === book.id}
                        >
                          <Trash2 className="h-3 w-3" />
                          {deletingId === book.id ? "..." : "حذف"}
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
