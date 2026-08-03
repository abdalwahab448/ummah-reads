"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

const roleOptions = [
  { label: "مالك المسابقة", value: "OWNER" },
  { label: "المدير", value: "MANAGER" },
  { label: "المشرف", value: "SUPERVISOR" }
];

const trackOptions = [
  { label: "ذكور", value: "MALE" },
  { label: "إناث", value: "FEMALE" }
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState("OWNER");
  const [track, setTrack] = useState("MALE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeholder = useMemo(() => {
    if (role === "MANAGER") {
      return track === "MALE" ? "manager-male@ummahreads.org" : "manager-female@ummahreads.org";
    }

    if (role === "SUPERVISOR") {
      return track === "MALE" ? "approved.supervisor-male@ummahreads.org" : "approved.supervisor-female@ummahreads.org";
    }

    return "owner@ummahreads.org";
  }, [role, track]);

  const defaultNextPath = role === "MANAGER" ? "/manager" : role === "SUPERVISOR" ? "/supervisor" : "/owner";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, track })
    });

    const payload = (await response.json()) as { message?: string };
    setMessage(payload.message ?? (response.ok ? "Signed in" : "Login failed"));
    setIsSubmitting(false);

    if (response.ok) {
      const nextPath = searchParams.get("next") ?? defaultNextPath;
      router.replace(nextPath);
      router.refresh();
    }
  }

  return (
    <section className="space-y-4 p-2 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {roleOptions.map((option) => (
          <button
            key={option.value}
            className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${role === option.value ? "border-[var(--gold-soft)] bg-[var(--gold-soft)] text-[var(--ink)] shadow-[0_10px_30px_-20px_rgba(201,161,94,0.8)]" : "border-[rgba(15,27,22,0.14)] bg-white text-[var(--ink)] hover:border-[rgba(15,27,22,0.26)] hover:bg-[rgba(227,201,141,0.12)]"}`}
            type="button"
            onClick={() => setRole(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form className="auth-form-surface grid gap-4 rounded-[1.4rem] p-5 text-[var(--ink)]" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="rounded-2xl border border-[rgba(15,27,22,0.12)] bg-white px-4 py-3 text-[var(--ink)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(201,161,94,0.3)]" value={role} onChange={(event) => setRole(event.target.value)}>
            {roleOptions.map((option) => <option key={option.value} value={option.value} className="text-[var(--ink)] bg-white">{option.label}</option>)}
          </select>
          <select className="rounded-2xl border border-[rgba(15,27,22,0.12)] bg-white px-4 py-3 text-[var(--ink)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(201,161,94,0.3)]" value={track} onChange={(event) => setTrack(event.target.value)}>
            {trackOptions.map((option) => <option key={option.value} value={option.value} className="text-[var(--ink)] bg-white">{option.label}</option>)}
          </select>
        </div>
        <input
          className="rounded-2xl border border-[rgba(15,27,22,0.12)] bg-white px-4 py-3 text-[var(--ink)] placeholder:text-[rgba(15,27,22,0.5)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(201,161,94,0.3)]"
          placeholder={placeholder}
          type="email"
          value={email}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          name="login-email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="rounded-2xl border border-[rgba(15,27,22,0.12)] bg-white px-4 py-3 text-[var(--ink)] placeholder:text-[rgba(15,27,22,0.5)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(201,161,94,0.3)]"
          placeholder="كلمة المرور"
          type="password"
          value={password}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          name="login-password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جاري الدخول..." : "دخول"}
        </Button>
        {message ? <p className="text-sm text-[var(--ink)]/70">{message}</p> : null}
      </form>
    </section>
  );
}