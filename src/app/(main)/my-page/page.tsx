"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Banknote, CircleUserRound, History, LogOut, Trophy, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/hooks/useLogout";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MyRankingCard from "@/components/ranking/MyRankingCard";
import { getMyPage, type MyPageResponse } from "@/services/user";
import { useAuth } from "@/components/providers/AuthProvider";
import { getPortfolio, mapToTotalAssetsData, type TotalAssetsData } from "@/services/portfolio";

export default function MyPage() {
  const { handleLogout, isLoggingOut, logoutError } = useLogout();
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const { userProfile } = useAuth();

  const [userInfo, setUserInfo] = useState<MyPageResponse | null>(null);
  const [assetsData, setAssetsData] = useState<TotalAssetsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const [userResult, portfolioResult] = await Promise.allSettled([
          getMyPage(),
          getPortfolio(),
        ]);

        if (userResult.status === "rejected") {
          const errorMessage =
            userResult.reason instanceof Error
              ? userResult.reason.message
              : "사용자 정보를 불러오는 데 실패했습니다.";
          setError(errorMessage);
          return;
        }

        if (!userResult.value.success || !userResult.value.data) {
          setError(userResult.value.message || "사용자 정보를 불러오는 데 실패했습니다.");
          return;
        }

        if (
          portfolioResult.status === "rejected" ||
          !portfolioResult.value.success ||
          !portfolioResult.value.data
        ) {
          setError("자산 정보를 불러오는 데 실패했습니다.");
          return;
        }

        setUserInfo(userResult.value.data);
        setAssetsData(mapToTotalAssetsData(portfolioResult.value.data));
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "사용자 정보를 불러오는 데 실패했습니다.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  if (isLoading) {
    return <MyPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-sm text-destructive font-medium">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    );
  }

  if (!assetsData) {
    return null;
  }

  const { totalAssets, totalProfit, totalProfitRate } = assetsData;
  const isPositive = totalProfit >= 0;
  const isZero = totalProfit === 0;

  const formattedAsset = `₩${totalAssets.toLocaleString("ko-KR")}`;
  const formattedProfit = `${isPositive ? "+ ₩" : "- ₩"}${Math.abs(totalProfit).toLocaleString("ko-KR")}`;
  const formattedRate = `${isPositive ? "+" : ""}${totalProfitRate.toFixed(2)}%`;

  const badgeColor = isZero
    ? "bg-muted text-muted-foreground"
    : isPositive
      ? "bg-red-500 text-white"
      : "bg-primary text-primary-foreground";

  const avatarSrc = userProfile?.avatarSrc;
  const userName = userProfile?.name || userInfo?.name || "사용자";

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      {/* Profile Card */}
      <Card className="border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 shrink-0 shadow-sm ring-1 ring-border border">
            {avatarSrc ? (
              <AvatarImage src={avatarSrc} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground">
                <CircleUserRound className="size-10" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">@{userName}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-muted-foreground">{userInfo?.email}</span>
              {userInfo?.email?.toLowerCase().endsWith("@kakao.com") && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE500] px-2 py-0.5 text-[10px] font-bold text-[#191919]">
                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current text-[#191919]">
                    <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.92 2 5.47 5 6.9L6 21c-.13.52.19.57.4.43l3.6-2.4c.67.1 1.37.17 2 .17 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                  </svg>
                  카카오 계정
                </span>
              )}
            </div>
            {userInfo?.joinedAt && (
              <span className="text-xs text-muted-foreground/80 mt-1">
                가입일: {formatJoinedDate(userInfo.joinedAt)}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Assets Section */}
      <div className="flex flex-col gap-3 text-center">
        <span className="text-lg font-semibold">총 모의 자산</span>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">{formattedAsset}</h2>
          <Badge className={`h-auto px-4 py-2 text-sm font-semibold border-none ${badgeColor}`}>
            {formattedProfit} ({formattedRate})
          </Badge>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start gap-3"
          onClick={() => setIsRankingOpen(true)}
        >
          <Trophy className="size-5" />내 랭킹
        </Button>
        <Link href="/edit-info" className="w-full">
          <Button variant="outline" size="lg" className="w-full justify-start gap-3">
            <User className="size-5" />내 정보 조회 및 수정
          </Button>
        </Link>
        <Link href="/transactions" className="w-full">
          <Button variant="outline" size="lg" className="w-full justify-start gap-3">
            <History className="size-5" />
            거래 내역
          </Button>
        </Link>
        <Link href="/exchange/history" className="w-full">
          <Button variant="outline" size="lg" className="w-full justify-start gap-3">
            <Banknote className="size-5" />
            환전 내역
          </Button>
        </Link>
        <Button
          type="button"
          variant="destructive"
          size="lg"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="size-5" />
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </Button>
        {logoutError && <p className="text-sm text-destructive">{logoutError}</p>}
      </div>

      {/* Ranking Dialog Popup */}
      <Dialog open={isRankingOpen} onOpenChange={setIsRankingOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">내 랭킹</DialogTitle>
          <DialogDescription className="sr-only">나의 현재 랭킹 및 순위 정보</DialogDescription>
          <MyRankingCard />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MyPageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <Card className="border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 text-center">
        <div className="flex justify-center">
          <Skeleton className="h-6 w-12" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-11 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

function formatJoinedDate(value: string | undefined): string {
  if (!value) return "";
  // 백엔드 날짜가 타임존 없이 올 경우 UTC로 가정하여 Z 추가 (이동 통신/환전 내역과 동일)
  const normalized = /Z$|[+-]\d{2}:?\d{2}$/.test(value) ? value : value + "Z";
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
