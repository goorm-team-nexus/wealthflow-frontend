"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const pathMap: Record<string, string> = {
  "/portfolio": "Portfolio",
  "/ranking": "Ranking",
  "/mypage": "My Page",
  "/purchase": "Purchase",
  "/stock-detail": "Stock Detail",
  "/EditInfo": "내 정보 수정",
};

const MAIN_PATHS = ["/portfolio", "/ranking", "/mypage"];

export default function GlobalNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();

  const title = pathMap[pathname] || "WealthFlow";
  const isMainPage = MAIN_PATHS.includes(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background transition-all duration-300">
      <div className="flex h-[56px] items-center justify-between px-4">
        {/* Left: Back Button or Logo + Title */}
        <div className="flex items-center gap-2">
          {!isMainPage ? (
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-colors -ml-2"
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          ) : (
            <div className="h-7 w-7 rounded-lg bg-gray-900 flex items-center justify-center mr-0.5">
              <div className="h-3.5 w-3.5 rounded-sm bg-white" />
            </div>
          )}
          <span className="text-lg font-bold tracking-tighter text-gray-900">{title}</span>
        </div>

        {/* Right: Actions (Profile) */}
        <div className="flex items-center">
          <Link
            href="/mypage"
            className="transition-transform hover:scale-105 active:scale-95"
            aria-label="My Page"
          >
            <Avatar className="h-9 w-9 border border-gray-100 shadow-sm">
              <AvatarImage src="" alt="User profile" />
              <AvatarFallback className="bg-gray-100 text-[10px] font-bold text-gray-500">
                U
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
