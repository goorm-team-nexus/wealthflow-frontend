import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const geistSans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const notoSansKr = localFont({
  src: "./fonts/NotoSansKR-Variable.woff2",
  variable: "--font-noto-sans-kr",
  weight: "400 900",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "WealthFlow",
  description: "WealthFlow - Manage all your assets at once",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} m-0 min-h-dvh bg-background font-noto-sans-kr text-foreground`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
