import type { Metadata } from "next";

import { Providers } from "@/components/providers";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "منصة أمتي تقرأ | منصة مسابقة لقراءة الكتب",
  description: "منصة أمتي تقرأ - منصة تفاعلية ومسابقة لمتابعة قراءة الكتب وتحديات القراءة.",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "googleb02223074a5ab93e.html",
  },
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