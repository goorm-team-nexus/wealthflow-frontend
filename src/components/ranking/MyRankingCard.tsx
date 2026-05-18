"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// 모든 등수별 랭킹 GIF 아이콘 임포트
import crownIcon from "@/assets/images/ranking/crown.gif";
import cupIcon from "@/assets/images/ranking/cup.gif";
import vipIcon from "@/assets/images/ranking/vip.gif";
import medalIcon from "@/assets/images/ranking/military-medal.gif";
import thumbsUpIcon from "@/assets/images/ranking/thumbs-up.gif";

interface MyRankingCardProps {
  isLink?: boolean; // 포트폴리오 메인 대시보드 연동용 호버/클릭 인터랙티브 활성화 여부
}

export default function MyRankingCard({ isLink = false }: MyRankingCardProps) {
  const DUMMY_MY_RANKING = {
    nickname: "주린이탈출기",
    avatarUrl: "https://i.pravatar.cc/150?u=12",
    rank: 1254,
    rankChange: 34,
    topPercent: 39.6,
    message: "한 걸음씩 나아가는 투자 여정! 🌱",
  };

  const { nickname, avatarUrl, rank, rankChange, topPercent, message } = DUMMY_MY_RANKING;

  // 등수에 따른 랭킹 헤더 아이콘 선택 함수 (동적 랭킹 게이미피케이션 엔진)
  const getRankingIcon = (rankNum: number) => {
    if (rankNum === 1) return crownIcon; // 1위: 명예의 끝 왕관 👑
    if (rankNum === 2) return cupIcon; // 2위: 찬란한 황금 트로피 🏆
    if (rankNum === 3) return vipIcon; // 3위: 포디움 진입 완결자 VIP 배지 🌟
    if (rankNum < 100) return medalIcon; // 4위 ~ 99위: 엘리트 랭커 훈장 배지 🏅
    return thumbsUpIcon; // 100위 이상: 성장 중인 투자자 응원 따봉 👍
  };

  // 카드 내용 렌더링 (원래의 수려한 원본 디자인 복원)
  const renderCardContent = () => (
    <Card
      className={`w-full border border-border/80 bg-white shadow-sm rounded-2xl overflow-hidden transition-all duration-300 ${
        isLink
          ? "cursor-pointer hover:border-foreground hover:bg-muted/5 active:scale-[0.99] hover:shadow-md"
          : ""
      }`}
    >
      <CardContent className="p-5 flex flex-col gap-4">
        {/* 1. 상단 타이틀 영역 */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground tracking-tight">나의 랭킹</span>
          <Image
            src={getRankingIcon(rank)}
            alt="Rank Icon"
            width={28}
            height={28}
            className="select-none shrink-0"
            unoptimized
          />
        </div>

        {/* 2. 중앙 프로필 및 순위 영역 (한 행 배치 원본 유지) */}
        <div className="flex items-center w-full">
          {/* 아바타 + 닉네임 */}
          <div className="flex items-center">
            <Avatar className="w-12 h-12 border border-border/60 shadow-sm shrink-0">
              <AvatarImage src={avatarUrl} alt={nickname} />
              <AvatarFallback>{nickname[0]}</AvatarFallback>
            </Avatar>
            <span className="font-bold text-foreground text-base ml-3 leading-none truncate max-w-[120px]">
              {nickname}
            </span>
          </div>

          {/* 우측 순위 + 상승 배지 */}
          <div className="flex items-center ml-auto shrink-0">
            <span className="text-2xl font-extrabold text-foreground tracking-tight leading-none">
              {rank.toLocaleString()}위
            </span>
            <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-sm ml-2 flex items-center shrink-0 leading-none select-none">
              ▲ {rankChange}
            </span>
          </div>
        </div>

        {/* 구분용 수평선 */}
        <div className="border-t border-border/40 my-1" />

        {/* 3. 하단 소개 메시지 및 백분율 배지 영역 */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground tracking-tight whitespace-normal break-keep leading-relaxed truncate min-w-0 pr-2">
            {message}
          </span>
          <Badge
            variant="secondary"
            className="rounded-full bg-muted/80 text-foreground text-xs font-semibold px-2.5 py-0.5 border-none shrink-0 select-none"
          >
            상위 {topPercent}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  if (isLink) {
    return (
      <Link href="/ranking" className="block">
        {renderCardContent()}
      </Link>
    );
  }

  return renderCardContent();
}
