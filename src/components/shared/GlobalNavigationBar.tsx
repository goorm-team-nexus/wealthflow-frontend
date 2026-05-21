"use client";

import { ArrowLeft, CircleUserRound } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import mainLogo from "@/assets/images/logos/logo/mainlogo.webp";
import { useAuth } from "@/components/providers/AuthProvider";

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

  if (pathname.includes("/sell")) {
    return "모의 매도";
  }

  if (pathname.startsWith("/stock-detail")) {
    return "종목 상세";
  }

  return pathMap[pathname] || "WealthFlow";
}

function isSubPage(pathname: string) {
  return pathname === "/profile" || pathname === "/edit-info" || pathname === "/exchange";
}

export default function GlobalNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } = useAuth();
  const avatarSrc = userProfile?.avatarSrc;
  const title = getPageTitle(pathname);
  const showBack = isSubPage(pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-[56px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {showBack ? (
            <>
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
              <span className="text-lg font-bold">{title}</span>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/portfolio"
                className="flex items-center gap-2"
                aria-label="WealthFlow 홈"
              >
                <div className="size-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 relative">
                  <Image
                    src={mainLogo}
                    alt="WealthFlow Logo"
                    className="w-full h-full object-cover object-top scale-[1.3] origin-top"
                    priority
                  />
                </div>
              </Link>
              <span className="font-extrabold text-lg tracking-tight text-foreground">{title}</span>
            </div>
          )}
        </div>

        {!showBack && (
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 rounded-full overflow-hidden"
            aria-label="마이페이지"
          >
            <Link href="/my-page">
              {avatarSrc ? (
                <Avatar className="size-7 border border-border/60">
                  <AvatarImage src={avatarSrc} alt="User Avatar" />
                  <AvatarFallback className="bg-muted text-foreground">
                    <CircleUserRound className="size-5" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <CircleUserRound className="size-5" aria-hidden="true" />
              )}
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
