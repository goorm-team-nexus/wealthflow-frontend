"use client";

import { Bell, Trophy, User, History, Banknote, CircleUserRound } from "lucide-react";
import { TabBar } from "@/components/shared/TabBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function MyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0f172a]">WealthFlow</h1>
        <button className="p-1 text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-7 h-7" />
        </button>
      </header>

      <main className="flex-1 px-6 pt-10 pb-28 space-y-10 max-w-md mx-auto w-full">
        {/* Profile Card */}
        <Link href="/profile">
          <Card className="p-6 shadow-md border border-gray-100 rounded-2xl bg-white hover:border-gray-900 transition-colors cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#171717] rounded-full flex items-center justify-center shrink-0">
                <CircleUserRound className="w-10 h-10 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[18px] text-gray-900">
                  @투자자 김성실
                </span>
                <span className="text-[15px] text-gray-600 font-medium">
                  이메일일@kakao.com
                </span>
                <span className="text-[13px] text-gray-400 mt-0.5">
                  December 2021(가입일)
                </span>
              </div>
            </div>
          </Card>
        </Link>

        {/* Assets Section */}
        <div className="text-center space-y-3">
          <span className="text-[18px] font-bold text-gray-900">총액</span>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-[36px] font-black tracking-tight text-gray-900">₩12,235,230.00</h2>
            <div className="inline-flex items-center bg-[#ef4444] px-5 py-2 rounded-full text-white font-bold text-[14px] shadow-sm">
              +12,555,550 (+12.3%)
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-[52px] rounded-xl border-gray-200 text-gray-900 text-[16px] font-bold gap-3 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Trophy className="w-5 h-5" />내 랭킹
          </Button>
          <Link href="/profile" className="w-full">
            <Button
              variant="outline"
              className="w-full h-[52px] rounded-xl border-gray-200 text-gray-900 text-[16px] font-bold gap-3 hover:bg-gray-50 transition-all shadow-sm"
            >
              <User className="w-5 h-5" />
              내 정보 조회 및 수정
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full h-[52px] rounded-xl border-gray-200 text-gray-900 text-[16px] font-bold gap-3 hover:bg-gray-50 transition-all shadow-sm"
          >
            <History className="w-5 h-5" />
            거래 내역
          </Button>
          <Button
            variant="outline"
            className="w-full h-[52px] rounded-xl border-gray-200 text-gray-900 text-[16px] font-bold gap-3 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Banknote className="w-5 h-5" />
            환전 내역
          </Button>
          <Button
            variant="outline"
            className="w-full h-[52px] rounded-xl border-[#ef4444] text-[#ef4444] text-[16px] font-bold gap-3 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
          >
            <History className="w-5 h-5" />
            로그아웃
          </Button>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
