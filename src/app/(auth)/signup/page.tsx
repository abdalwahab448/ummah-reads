"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const trackOptions = [
  { label: "ذكور", value: "MALE" },
  { label: "إناث", value: "FEMALE" }
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [track, setTrack] = useState("MALE");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function verifyAccess() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const payload = (await response.json()) as { session?: { role?: string } | null };

        if (!active) return;

        if (response.ok && payload.session && (payload.session.role === "OWNER" || payload.session.role === "MANAGER")) {
          setIsAuthorized(true);
        } else {
          setMessage("يحتاج الوصول إلى هذه الصفحة إلى صلاحية مالك أو مدير.");
          window.setTimeout(() => router.replace("/login"), 1200);
        }
      } catch {
        if (active) {
          setMessage("يرجى تسجيل الدخول اولاً.");
          window.setTimeout(() => router.replace("/login"), 1200);
        }
      } finally {
        if (active) {
          setIsChecking(false);
        }
      }
    }

    verifyAccess();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, track })
    });

    const payload = (await response.json()) as { message?: string };
    setMessage(payload.message ?? (response.ok ? "تم إنشاء الحساب" : "فشل التسجيل"));
    setIsSubmitting(false);

    if (response.ok) {
      setName("");
      setEmail("");
      setPassword("");
      setTrack("MALE");
      router.refresh();
    }
  }

  if (isChecking) {
    return (
      <main className="auth-shell">
        <Card className="auth-card mx-auto w-full max-w-2xl p-8 text-center">
          <p className="text-sm font-semibold text-[var(--gold-soft)]">جاري التحقق من الصلاحيات...</p>
        </Card>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="auth-shell">
        <Card className="auth-card mx-auto w-full max-w-2xl p-8 text-center">
          <p className="text-sm font-semibold text-[var(--gold-soft)]">{message}</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <Card className="auth-card grid w-full gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="auth-side p-8 sm:p-10 lg:p-12">
          <p className="auth-pill">ادارة المشرفين</p>
          <h1 className="mt-5 font-['Reem_Kufi'] text-3xl font-black text-[var(--gold-soft)] md:text-4xl">انشاء حساب مشرف</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(243,239,228,0.82)]">
            يتم انشاء حسابات المشرفين من داخل لوحة الادارة فقط. يراجع المدير او مالك المسابقة الطلب ثم يحدد المركز المناسب.
          </p>
        </section>

        <form className="auth-form-surface grid gap-4 p-4 sm:p-6 lg:p-8 text-[var(--ink)]" onSubmit={handleSubmit}>
          <input
            className="rounded-2xl border border-[rgba(15,27,22,0.12)] bg-white px-4 py-3 text-[var(--ink)] placeholder:text-[rgba(15,27,22,0.5)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(201,161,94,0.3)]"
            placeholder="الاسم الكامل"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            className="rounded-2xl border border-[rgba(15,27,22,0.12)] bg-white px-4 py-3 text-[var(--ink)] placeholder:text-[rgba(15,27,22,0.5)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(201,161,94,0.3)]"
            placeholder="البريد الالكتروني"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <select
            className="rounded-2xl border border-[rgba(15,27,22,0.12)] bg-white px-4 py-3 text-[var(--ink)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(201,161,94,0.3)]"
            value={track}
            onChange={(event) => setTrack(event.target.value)}
          >
            {trackOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-[var(--ink)] bg-white">
                {option.label}
              </option>
            ))}
          </select>
          <input
            className="rounded-2xl border border-[rgba(15,27,22,0.12)] bg-white px-4 py-3 text-[var(--ink)] placeholder:text-[rgba(15,27,22,0.5)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(201,161,94,0.3)]"
            placeholder="كلمة المرور"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري الانشاء..." : "انشاء حساب المشرف"}
          </Button>
          {message ? <p className="text-sm text-[var(--ink)]/70">{message}</p> : null}
        </form>
      </Card>
    </main>
  );
}
