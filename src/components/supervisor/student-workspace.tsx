"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { StudentCardDisplay } from "@/components/shared/student-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { StudentWithBooks, Student, Book } from "@/lib/types";

type SupervisorWorkspaceProps = {
  centerId: string;
  centerName: string;
  centerTrack: "MALE" | "FEMALE";
  initialStudents: StudentWithBooks[];
  canManage?: boolean;
};

type StudentFormState = {
  firstName: string;
  fatherName: string;
  lastName: string;
  age: string;
};

const emptyStudentForm: StudentFormState = {
  firstName: "",
  fatherName: "",
  lastName: "",
  age: ""
};

export function StudentWorkspace({
  centerId,
  centerName,
  centerTrack,
  initialStudents,
  canManage = true
}: SupervisorWorkspaceProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [students, setStudents] = useState(initialStudents);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState<StudentFormState>(emptyStudentForm);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [savingStudent, setSavingStudent] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  const totalReadingLogs = useMemo(
    () => students.reduce((sum, student) => sum + student.books.length, 0),
    [students]
  );

  function resetStudentForm() {
    setEditingStudentId(null);
    setStudentForm(emptyStudentForm);
    setStudentModalOpen(false);
    setStudentError(null);
  }

  function openCreateModal() {
    setEditingStudentId(null);
    setStudentForm(emptyStudentForm);
    setStudentModalOpen(true);
  }

  function openStudentEditor(student: Student) {
    setEditingStudentId(student.id);
    setStudentForm({
      firstName: student.firstName,
      fatherName: student.fatherName,
      lastName: student.lastName,
      age: String(student.age)
    });
    setStudentModalOpen(true);
  }

  async function handleStudentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStudentError(null);
    setSavingStudent(true);

    try {
      const payload = {
        ...studentForm,
        age: Number(studentForm.age),
        centerId,
        track: centerTrack
      };

      const response = await fetch(editingStudentId ? `/api/students/${editingStudentId}` : "/api/students", {
        method: editingStudentId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message ?? "تعذر حفظ بطاقة الطالب");
      }

      toast({
        title: editingStudentId ? "تم تحديث بطاقة الطالب" : "تم إنشاء بطاقة الطالب",
        description: editingStudentId ? "تم حفظ التعديلات بنجاح." : "تمت إضافة الطالب إلى المركز.",
        variant: "success"
      });
      resetStudentForm();
      startTransition(() => router.refresh());
    } catch (error) {
      const message = error instanceof Error ? error.message : "تعذر حفظ بطاقة الطالب";
      setStudentError(message);
      toast({ title: "فشل الحفظ", description: message, variant: "error" });
    } finally {
      setSavingStudent(false);
    }
  }

  async function handleStudentDelete(studentId: string) {
    setDeletingStudentId(studentId);

    try {
      const response = await fetch(`/api/students/${studentId}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message ?? "تعذر حذف الطالب");
      }

      setStudents((current) => current.filter((student) => student.id !== studentId));
      toast({ title: "تم حذف الطالب", variant: "success" });
      startTransition(() => router.refresh());
    } catch (error) {
      toast({
        title: "فشل الحذف",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "error"
      });
    } finally {
      setDeletingStudentId(null);
    }
  }

  async function handleAddBook(studentId: string, bookTitleOrNumber: string, pagesCount: string) {
    const normalizedPages = Number(pagesCount);

    if (!bookTitleOrNumber.trim() || Number.isNaN(normalizedPages) || normalizedPages < 1) {
      throw new Error("أدخل عنوان الكتاب وعدد الصفحات صحيحين");
    }

    const response = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        bookTitleOrNumber: bookTitleOrNumber.trim(),
        pagesCount: normalizedPages
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result?.message ?? "تعذر حفظ سجل القراءة");
    }

    const createdBook = result.book as Book;
    setStudents((current) =>
      current.map((student) => {
        if (student.id !== studentId) {
          return student;
        }

        return {
          ...student,
          books: [...student.books, createdBook],
          totalPages: student.totalPages + normalizedPages,
          totalBooks: student.totalBooks + 1
        };
      })
    );

    toast({ title: "تم تسجيل القراءة", variant: "success" });
    startTransition(() => router.refresh());
  }

  async function handleBookDelete(bookId: string) {
    const targetBook = students.flatMap((student) => student.books).find((book) => book.id === bookId);

    if (!targetBook) {
      return;
    }

    const response = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result?.message ?? "تعذر حذف سجل القراءة");
    }

    setStudents((current) =>
      current.map((student) => {
        if (!student.books.some((book) => book.id === bookId)) {
          return student;
        }

        return {
          ...student,
          books: student.books.filter((book) => book.id !== bookId),
          totalPages: Math.max(0, student.totalPages - targetBook.pagesCount),
          totalBooks: Math.max(0, student.totalBooks - 1)
        };
      })
    );

    toast({ title: "تم حذف سجل القراءة", variant: "success" });
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem]">
        <div>
          <p className="text-sm font-semibold text-[var(--cream-dim)]">المركز الحالي</p>
          <h2 className="font-['Reem_Kufi'] text-xl text-[var(--cream)]">{centerName}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-2 text-sm font-semibold text-[var(--cream-dim)]">
            {students.length} طالب | {totalReadingLogs} سجل قراءة
          </div>
          {canManage ? (
            <Button type="button" onClick={openCreateModal}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إنشاء بطاقة طالب
            </Button>
          ) : null}
        </div>
      </Card>

      <div>
        <h3 className="mb-4 font-['Reem_Kufi'] text-lg text-[var(--cream)]">بطاقات الطلاب</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.length === 0 ? (
            <Card className="col-span-full text-center text-sm text-[var(--cream-dim)]">
              {canManage
                ? "لا يوجد طلاب بعد. اضغط «إنشاء بطاقة طالب» للبدء."
                : "لا يوجد طلاب في هذا المركز."}
            </Card>
          ) : (
            students.map((student, index) => (
              <StudentCardDisplay
                key={student.id}
                student={student}
                rank={index + 1}
                canEdit={canManage}
                canDelete={canManage}
                onEdit={() => openStudentEditor(student)}
                onDelete={() => handleStudentDelete(student.id)}
                isDeleting={deletingStudentId === student.id}
                onAddReading={handleAddBook}
                onDeleteReading={handleBookDelete}
              />
            ))
          )}
        </div>
      </div>

      <Modal
        open={studentModalOpen}
        onClose={resetStudentForm}
        title={editingStudentId ? "تعديل بطاقة الطالب" : "إنشاء بطاقة طالب"}
      >
        <form className="grid gap-4" onSubmit={handleStudentSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[var(--cream-dim)]">
              <span>الاسم الأول</span>
              <input
                className="rounded-[1rem] border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-[var(--cream)] outline-none transition focus:border-[var(--gold)]"
                placeholder="الاسم الأول"
                value={studentForm.firstName}
                onChange={(event) => setStudentForm((current) => ({ ...current, firstName: event.target.value }))}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--cream-dim)]">
              <span>اسم الأب</span>
              <input
                className="rounded-[1rem] border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-[var(--cream)] outline-none transition focus:border-[var(--gold)]"
                placeholder="اسم الأب"
                value={studentForm.fatherName}
                onChange={(event) => setStudentForm((current) => ({ ...current, fatherName: event.target.value }))}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--cream-dim)]">
              <span>الكنية / العائلة</span>
              <input
                className="rounded-[1rem] border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-[var(--cream)] outline-none transition focus:border-[var(--gold)]"
                placeholder="الكنية / العائلة"
                value={studentForm.lastName}
                onChange={(event) => setStudentForm((current) => ({ ...current, lastName: event.target.value }))}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--cream-dim)]">
              <span>العمر</span>
              <input
                className="rounded-[1rem] border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] px-4 py-3 text-[var(--cream)] outline-none transition focus:border-[var(--gold)]"
                placeholder="العمر"
                type="number"
                min={1}
                max={100}
                value={studentForm.age}
                onChange={(event) => setStudentForm((current) => ({ ...current, age: event.target.value }))}
                required
              />
            </label>
          </div>
          {studentError ? (
            <div className="rounded-[1rem] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {studentError}
            </div>
          ) : null}
          <div className="flex gap-3">
            <Button type="submit" disabled={isPending || savingStudent}>
              {savingStudent ? "جارٍ الحفظ..." : editingStudentId ? "حفظ التعديل" : "إنشاء البطاقة"}
            </Button>
            <Button type="button" variant="secondary" onClick={resetStudentForm} disabled={savingStudent}>
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
