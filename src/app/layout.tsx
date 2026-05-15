import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GlobalNavigationBar from "@/components/shared/GlobalNavigationBar";
import { TabBar } from "@/components/shared/TabBar";

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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} min-h-screen flex flex-col font-noto-sans-kr bg-gray-50`}
      >
        {/* Fixed Mobile-first container */}
        <div className="w-full max-w-[500px] mx-auto bg-background min-h-screen flex flex-col relative border-x border-border shadow-sm md:rounded-b-[1.5rem]">
          {/* Header Fixed */}
          <GlobalNavigationBar />

          {/* Content Area */}
          <main className="flex-1 pb-20">{children}</main>

          {/* TabBar Fixed to the bottom of the 500px container */}
          <TabBar />
        </div>
      </body>
    </html>
  );
}
