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

export default function MyPage() {
  const { handleLogout, isLoggingOut, logoutError } = useLogout();
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("wealthflow_profile_avatar");
    if (savedAvatar && savedAvatar !== "default") {
      setTimeout(() => {
        setAvatarSrc(savedAvatar);
      }, 0);
    }
  }, []);

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
            <span className="text-lg font-semibold">@투자자 김성실</span>
            <span className="text-sm text-muted-foreground">이메일일@kakao.com</span>
            <span className="text-xs text-muted-foreground">December 2021(가입일)</span>
          </div>
        </div>
      </Card>

      {/* Assets Section */}
      <div className="flex flex-col gap-3 text-center">
        <span className="text-lg font-semibold">총액</span>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">₩12,235,230.00</h2>
          <Badge className="h-auto bg-red-500 px-4 py-2 text-sm font-semibold">
            +12,555,550 (+12.3%)
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
        <Button variant="outline" size="lg" className="w-full justify-start gap-3">
          <History className="size-5" />
          거래 내역
        </Button>
        <Button variant="outline" size="lg" className="w-full justify-start gap-3">
          <Banknote className="size-5" />
          환전 내역
        </Button>
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
