"use client";

import { ArrowLeft, CircleUserRound, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import mainLogo from "@/assets/images/logos/logo/mainlogo.webp";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getStockQuoteSeed,
  fetchFavoriteStocks,
  addFavoriteStock,
  removeFavoriteStock,
} from "@/services/marketService";

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
  if (pathname.startsWith("/stock-detail")) {
    return "종목 상세";
  }

  return pathMap[pathname] || "WealthFlow";
}

function isSubPage(pathname: string) {
  return pathname === "/profile" || pathname === "/edit-info" || pathname === "/exchange";
}

function getStockPageContext(pathname: string) {
  const tradeMatch = pathname.match(/^\/stock-detail\/([^/]+)\/(?:purchase|sell)$/);
  if (tradeMatch) {
    const ticker = decodeURIComponent(tradeMatch[1]);
    const stockSeed = getStockQuoteSeed(ticker);
    return {
      ticker,
      backHref: `/stock-detail/${ticker}`,
      backLabel: "종목 상세로 돌아가기",
      title: `${stockSeed.name} (${ticker})`,
    };
  }

  const detailMatch = pathname.match(/^\/stock-detail\/([^/]+)$/);
  if (detailMatch) {
    const ticker = decodeURIComponent(detailMatch[1]);
    const stockSeed = getStockQuoteSeed(ticker);
    return {
      ticker,
      backHref: "/stocks",
      backLabel: "시장/거래 페이지로 돌아가기",
      title: `${stockSeed.name} (${ticker})`,
    };
  }

  return null;
}

function FavoriteButton({ ticker }: { ticker: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteUpdating, setIsFavoriteUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadFavoriteState = async () => {
      try {
        const favorites = await fetchFavoriteStocks();
        if (isMounted) {
          setIsFavorite(favorites.items.some((favoriteStock) => favoriteStock.ticker === ticker));
        }
      } catch {
        // 관심종목 로드 에러 시 묵인
      }
    };
    void loadFavoriteState();
    return () => {
      isMounted = false;
    };
  }, [ticker]);

  const handleFavoriteToggle = async () => {
    const nextIsFavorite = !isFavorite;
    setIsFavoriteUpdating(true);
    setIsFavorite(nextIsFavorite);

    try {
      const result = nextIsFavorite
        ? await addFavoriteStock(ticker)
        : await removeFavoriteStock(ticker);
      setIsFavorite(result.favorite ?? nextIsFavorite);
    } catch {
      setIsFavorite(!nextIsFavorite);
    } finally {
      setIsFavoriteUpdating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8 text-foreground"
      aria-label="관심 종목"
      aria-pressed={isFavorite}
      disabled={isFavoriteUpdating}
      onClick={handleFavoriteToggle}
    >
      <Heart
        className={`size-5 stroke-[2.2] ${
          isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
        }`}
        aria-hidden="true"
      />
    </Button>
  );
}

export default function GlobalNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } = useAuth();
  const avatarSrc = userProfile?.avatarSrc;
  const stockPageContext = getStockPageContext(pathname);
  const title = stockPageContext?.title ?? getPageTitle(pathname);
  const showBack = stockPageContext !== null || isSubPage(pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {stockPageContext ? (
        <div className="grid h-[56px] grid-cols-[32px_minmax(0,1fr)_32px] items-center px-4">
          {stockPageContext.backHref ? (
            <Button asChild variant="ghost" size="icon" className="size-8 -ml-1 text-foreground">
              <Link href={stockPageContext.backHref} aria-label={stockPageContext.backLabel}>
                <ArrowLeft className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
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
          )}
          <span className="truncate text-center text-sm font-semibold">{title}</span>
          <div className="flex justify-end">
            <FavoriteButton ticker={stockPageContext.ticker} />
          </div>
        </div>
      ) : (
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
                <span className="font-extrabold text-lg tracking-tight text-foreground">
                  {title}
                </span>
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
      )}
    </header>
  );
}
