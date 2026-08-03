'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SplashScreen() {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupTrack, setSignupTrack] = useState("MALE");
  const [signupMessage, setSignupMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEnter() {
    if (isOpening) return;

    setIsOpening(true);
    window.setTimeout(() => router.push("/login"), 900);
  }

  async function handleSupervisorSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSignupMessage(null);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword, track: signupTrack })
    });

    const payload = (await response.json()) as { message?: string };
    setSignupMessage(payload.message ?? (response.ok ? "تم إرسال الطلب للمراجعة" : "فشل التسجيل"));
    setIsSubmitting(false);

    if (response.ok) {
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupTrack("MALE");
    }
  }

  return (
    <main
      className={`splash-shell ${isOpening ? "splash-opening" : ""}`}
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleEnter();
        }
      }}
    >
      <div className="splash-glow" />
      <div className="splash-doors" aria-hidden="true">
        <div className="splash-door splash-door-left" />
        <div className="splash-door splash-door-right" />
      </div>

      <section className="splash-content">
        <div className="flex flex-col items-center gap-3">
          <div className="splash-badge">أمتي تقرأ</div>
          <div className="h-px w-20 bg-[var(--gold-soft)] opacity-90" />
          <h1
            className="text-3xl font-black tracking-[0.2em] sm:text-4xl md:text-5xl"
            style={{
              color: "var(--gold-soft)",
              fontFamily: "Tajawal, Cairo, 'Segoe UI', sans-serif",
              textShadow: "0 0 12px rgba(227, 201, 141, 0.35), 0 4px 10px rgba(0,0,0,0.45)"
            }}
          >
            رحلة القراءة تبدأ هنا
          </h1>
          <p className="text-base font-semibold sm:text-lg" style={{ color: "var(--cream)", fontFamily: "Tajawal, Cairo, 'Segoe UI', sans-serif" }}>
            مسابقة تنير العقول وتعمق الوعي والتمكين
          </p>
          <div className="h-px w-24 bg-[var(--gold-soft)] opacity-85" />
        </div>

        <blockquote className="splash-quote" style={{ fontFamily: "Tajawal, Cairo, 'Segoe UI', sans-serif", color: "var(--cream-dim)" }}>
          «الكتب هي الآثار الوحيدة التي تبنى في عقولنا لتغير حاضرنا وتصنع مستقبلنا.»
        </blockquote>

        <div className="splash-actions">
          <button
            type="button"
            className="splash-link rounded-full border border-[rgba(227,201,141,0.45)] bg-[var(--gold-soft)] px-5 py-3 text-[#0b3b2b] shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition hover:translate-y-[-1px] hover:shadow-[0_14px_24px_rgba(0,0,0,0.35)]"
            onClick={(event) => {
              event.stopPropagation();
              handleEnter();
            }}
          >
            تسجيل دخول
          </button>
        </div>

        <div className="splash-actions">
          <button type="button" className="splash-link border border-[rgba(227,201,141,0.2)] bg-[rgba(8,20,15,0.72)] text-[var(--cream)]" onClick={(event) => { event.stopPropagation(); setShowSignup((value) => !value); }}>
            إنشاء حساب
          </button>
        </div>

        {showSignup ? (
          <form className="splash-form" onClick={(event) => event.stopPropagation()} onSubmit={handleSupervisorSignup}>
            <input className="splash-form-input border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] text-[var(--cream)] placeholder:text-[var(--cream-dim)]" placeholder="الاسم الكامل" value={signupName} onChange={(event) => setSignupName(event.target.value)} required />
            <input className="splash-form-input border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] text-[var(--cream)] placeholder:text-[var(--cream-dim)]" placeholder="البريد الإلكتروني" type="email" value={signupEmail} onChange={(event) => setSignupEmail(event.target.value)} required />
            <input className="splash-form-input border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] text-[var(--cream)] placeholder:text-[var(--cream-dim)]" placeholder="كلمة المرور" type="password" value={signupPassword} onChange={(event) => setSignupPassword(event.target.value)} required minLength={6} />
            <select className="splash-form-input border border-[rgba(227,201,141,0.18)] bg-[rgba(8,20,15,0.82)] text-[var(--cream)]" value={signupTrack} onChange={(event) => setSignupTrack(event.target.value)}>
              <option value="MALE">ذكور</option>
              <option value="FEMALE">إناث</option>
            </select>
            <button className="splash-submit bg-[var(--gold-soft)] text-[#0b3b2b]" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جارٍ الإرسال..." : "إرسال الطلب للمراجعة"}
            </button>
            {signupMessage ? <p className="splash-message text-[var(--cream)]">{signupMessage}</p> : null}
          </form>
        ) : null}
      </section>
    </main>
  );
}
