import type { Metadata } from "next";

import { Providers } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "منصة أمتي تقرأ | منصة مسابقة لقراءة الكتب",
  description: "منصة أمتي تقرأ - منصة تفاعلية ومسابقة لمتابعة قراءة الكتب وتحديات القراءة.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}