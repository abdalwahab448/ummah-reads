import { Suspense } from "react";

import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <Card className="auth-card mx-auto grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="auth-side p-8 sm:p-10 lg:p-12">
          <p className="auth-pill">بوابة الدخول</p>
          <h1 className="mt-5 font-['Reem_Kufi'] text-3xl font-black text-[var(--gold-soft)] md:text-4xl">أهلاً بك في لوحة المسابقة</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(243,239,228,0.82)]">
            اختر دورك ثم ادخل باستخدام نفس البنية المخصصة للمشرف والمدير ومالك المسابقة مع track منفصل لكل فئة.
          </p>
        </section>

        <section className="space-y-4 bg-[rgba(243,239,228,0.04)] p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<div className="rounded-[1.4rem] bg-white/90 p-5 text-[var(--ink)] shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]">جاري تحميل نموذج الدخول...</div>}>
            <LoginForm />
          </Suspense>
        </section>
      </Card>
    </main>
  );
}