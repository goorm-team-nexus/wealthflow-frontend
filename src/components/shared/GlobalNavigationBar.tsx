"use client";

import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const pathMap: Record<string, string> = {
  "/stocks": "시장/거래",
  "/favorites": "관심 종목",
  "/portfolio": "포트폴리오",
  "/ranking": "랭킹",
  "/mypage": "마이페이지",
  "/profile": "프로필",
  "/EditInfo": "내 정보 수정",
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

export default function GlobalNavigationBar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-[56px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/portfolio"
            className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
            aria-label="WealthFlow 홈"
          >
            W
          </Link>
          <span className="text-lg font-semibold">{title}</span>
        </div>

        <Button asChild variant="ghost" size="icon" aria-label="마이페이지">
          <Link href="/mypage">
            <CircleUserRound className="size-5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
