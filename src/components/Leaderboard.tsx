"use client";

import { useState } from "react";

type LeaderboardStudent = {
  rank?: number;
  name?: string;
  father?: string;
  family?: string;
  age?: number;
  books?: number | Array<unknown>;
  firstName?: string;
  fatherName?: string;
  lastName?: string;
  totalBooks?: number;
  totalPages?: number;
};

const colors = {
  bg: "#0f1b2e",
  card: "#152438",
  border: "#2a3b52",
  gold: "#d4a574",
  silver: "#b8b8c0",
  bronze: "#a87c5a",
  warmBrown: "#8b6b4a",
  text: "#ffffff",
  muted: "#9ca3af",
};

function toTitleCase(str?: string) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

function getBookCount(student: LeaderboardStudent) {
  if (typeof student.books === "number") return student.books;
  if (Array.isArray(student.books)) return student.books.length;
  return student.totalBooks ?? 0;
}

function RosetteAccent({ color, size = 70 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.18 }}
    >
      <g fill={color}>
        {Array.from({ length: 8 }).map((_, i) => (
          <polygon key={i} points="50,5 58,35 50,50 42,35" transform={`rotate(${i * 45} 50 50)`} />
        ))}
      </g>
    </svg>
  );
}

function BookmarkBadge({ rank, color }: { rank: number; color: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: "34px",
        height: "46px",
        background: color,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "6px",
        boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ color: colors.bg, fontWeight: "bold", fontSize: "14px" }}>{rank}</span>
    </div>
  );
}

function MiniBookshelf({ count }: { count: number }) {
  const bookColors = [colors.gold, colors.warmBrown, colors.silver, colors.bronze];
  const display = Math.min(count, 8);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "24px" }}>
      {Array.from({ length: display }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "5px",
            height: `${14 + (i % 3) * 4}px`,
            background: bookColors[i % bookColors.length],
            borderRadius: "1px 1px 0 0",
          }}
        />
      ))}
      {count > 8 && (
        <span style={{ color: colors.muted, fontSize: "11px", marginRight: "4px" }}>+{count - 8}</span>
      )}
    </div>
  );
}

function BookCard({ student, rank, color, elevated }: { student: LeaderboardStudent; rank: number; color: string; elevated?: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        background: colors.card,
        borderRadius: "6px 10px 10px 6px",
        borderRight: `6px solid ${color}`,
        boxShadow: elevated
          ? `0 12px 24px rgba(0,0,0,0.45), 0 0 0 1px ${colors.border}`
          : `0 6px 14px rgba(0,0,0,0.3), 0 0 0 1px ${colors.border}`,
        padding: "20px",
        width: elevated ? "150px" : "130px",
        transform: elevated ? "translateY(-12px)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <RosetteAccent color={color} size={elevated ? 90 : 70} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BookmarkBadge rank={rank} color={color} />
        <p style={{ color: colors.text, fontSize: elevated ? "15px" : "13px", fontWeight: "bold", marginTop: "10px", marginBottom: "2px", textAlign: "center" }}>
          {toTitleCase(student.name ?? [student.firstName, student.lastName].filter(Boolean).join(" "))}
        </p>
        <p style={{ color: colors.muted, fontSize: "11px", marginBottom: "10px" }}>{getBookCount(student)} كتاب</p>
        <MiniBookshelf count={getBookCount(student)} />
      </div>
    </div>
  );
}

export default function Leaderboard({ students }: { students: LeaderboardStudent[] }) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const sorted = [...students].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div
      dir="rtl"
      style={{
        background: colors.bg,
        minHeight: "100%",
        padding: "24px 12px",
        fontFamily: "'Tajawal', system-ui, sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />

      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "28px", paddingTop: "8px" }}>
        <BookCard student={top3[1]} rank={top3[1]?.rank ?? 2} color={colors.silver} />
        <BookCard student={top3[0]} rank={top3[0]?.rank ?? 1} color={colors.gold} elevated />
        <BookCard student={top3[2]} rank={top3[2]?.rank ?? 3} color={colors.bronze} />
      </div>

      <div style={{ background: colors.card, borderRadius: "12px", border: `1px solid ${colors.border}`, overflow: "hidden", maxWidth: "840px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 140px 100px", padding: "14px 18px", borderBottom: `1px solid ${colors.border}`, color: colors.muted, fontSize: "13px", fontWeight: "700" }}>
          <span>الترتيب</span>
          <span>الطالب</span>
          <span>الأجزاء المحفوظة</span>
          <span>الكتب</span>
        </div>

        {rest.map((s) => {
          const nextRank = s.rank ?? null;
          return (
            <div key={s.rank ?? `${s.name ?? "student"}-${Math.random()}`}>
              <div
                onClick={() => setExpandedRow(expandedRow === nextRank ? null : nextRank)}
                style={{ display: "grid", gridTemplateColumns: "70px 1fr 140px 100px", padding: "14px 18px", borderBottom: `1px solid ${colors.border}`, color: colors.text, fontSize: "14px", cursor: "pointer", alignItems: "center" }}
              >
              <span style={{ color: colors.muted, fontWeight: "700" }}>{s.rank ?? 0}</span>
              <span>{toTitleCase(s.name ?? [s.firstName, s.lastName].filter(Boolean).join(" "))}</span>
              <span style={{ color: colors.muted }}>{/* placeholder for saved parts */}—</span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <MiniBookshelf count={getBookCount(s)} />
              </div>
            </div>

            {expandedRow === nextRank && (
              <div style={{ padding: "12px 18px", background: colors.bg, borderBottom: `1px solid ${colors.border}`, fontSize: "13px", color: colors.muted, display: "flex", gap: "24px" }}>
                <span>اسم الأب: {toTitleCase(s.father ?? s.fatherName)}</span>
                <span>الكنية: {toTitleCase(s.family)}</span>
                <span>العمر: {s.age}</span>
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
