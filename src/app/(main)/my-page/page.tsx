"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Banknote, CircleUserRound, History, LogOut, Trophy, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/hooks/useLogout";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MyRankingCard from "@/components/ranking/MyRankingCard";
import { getMyPage, type MyPageResponse } from "@/services/user";
import { useAuth } from "@/components/providers/AuthProvider";

export default function MyPage() {
  const { handleLogout, isLoggingOut, logoutError } = useLogout();
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const { userProfile } = useAuth();

  const [userInfo, setUserInfo] = useState<MyPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getMyPage();
        if (res.success && res.data) {
          setUserInfo(res.data);
        } else {
          setError(res.message || "사용자 정보를 불러오는 데 실패했습니다.");
        }
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
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 p-4">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">사용자 정보를 불러오는 중입니다...</p>
      </div>
    );
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

  const totalAsset = userInfo?.totalAsset ?? 0;
  const totalProfit = userInfo?.totalProfit ?? 0;
  const profitRate = userInfo?.profitRate ?? 0;
  const currencyCode = userInfo?.currencyCode ?? "KRW";

  const isPositive = totalProfit >= 0;
  const isZero = totalProfit === 0;

  const formattedAsset = `${currencyCode === "KRW" ? "₩" : "$"}${totalAsset.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedProfit = `${isPositive ? "+" : ""}${currencyCode === "KRW" ? "₩" : "$"}${totalProfit.toLocaleString("ko-KR")}`;
  const formattedRate = `${isPositive ? "+" : ""}${profitRate.toFixed(2)}%`;

  const badgeColor = isZero
    ? "bg-muted text-muted-foreground hover:bg-muted"
    : isPositive
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white";

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
            <span className="text-sm text-muted-foreground">{userInfo?.email}</span>
          </div>
        </div>
      </Card>

      {/* Assets Section */}
      <div className="flex flex-col gap-3 text-center">
        <span className="text-lg font-semibold">총액</span>
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
        <Link href="/exchange" className="w-full">
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
