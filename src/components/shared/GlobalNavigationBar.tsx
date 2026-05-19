"use client";

import { ArrowLeft, CircleUserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const pathMap: Record<string, string> = {
  "/stocks": "시장/거래",
  "/favorites": "관심 종목",
  "/portfolio": "포트폴리오",
  "/ranking": "랭킹",
  "/my-page": "마이페이지",
  "/profile": "프로필",
  "/edit-info": "내 정보 수정",
  "/exchange": "환전",
};

function getPageTitle(pathname: string) {
  if (pathname.includes("/purchase")) {
    return "모의 매수";
  }

  if (pathname.startsWith("/stock-detail")) {
    return "종목 상세";
  }

  return pathMap[pathname] || "WealthFlow";
}

function isSubPage(pathname: string) {
  return (
    pathname === "/profile" ||
    pathname === "/edit-info" ||
    pathname === "/exchange" ||
    pathname.startsWith("/stock-detail")
  );
}

export default function GlobalNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname);
  const showBack = isSubPage(pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-[56px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 -ml-1 text-foreground"
              onClick={() => router.back()}
              aria-label="뒤로가기"
            >
              <ArrowLeft className="size-5" />
            </Button>
          ) : (
            <Link
              href="/portfolio"
              className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
              aria-label="WealthFlow 홈"
            >
              W
            </Link>
          )}
          <span className="text-lg font-semibold">{title}</span>
        </div>

        {!showBack && (
          <Button asChild variant="ghost" size="icon" aria-label="마이페이지">
            <Link href="/my-page">
              <CircleUserRound className="size-5" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
