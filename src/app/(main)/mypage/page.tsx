"use client";

import { Trophy, User, History, Banknote, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function MyPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-4">
      {/* Profile Card */}
      <Link href="/profile">
        <Card className="border border-border bg-card p-6 shadow-sm transition-colors hover:border-foreground">
          <div className="flex items-center gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CircleUserRound className="size-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">@투자자 김성실</span>
              <span className="text-sm text-muted-foreground">이메일일@kakao.com</span>
              <span className="text-xs text-muted-foreground">December 2021(가입일)</span>
            </div>
          </div>
        </Card>
      </Link>

      {/* Assets Section */}
      <div className="space-y-3 text-center">
        <span className="text-lg font-semibold">총액</span>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">₩12,235,230.00</h2>
          <div className="inline-flex items-center rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white">
            +12,555,550 (+12.3%)
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="space-y-4">
        <Button variant="outline" size="lg" className="w-full justify-start gap-3">
          <Trophy className="size-5" />내 랭킹
        </Button>
        <Link href="/profile" className="w-full">
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
        <Button variant="destructive" size="lg" className="w-full justify-start gap-3">
          <History className="size-5" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
