"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getMyRanking, mapToMyRankingUI, type MyRankingUIModel } from "@/services/ranking";

// 모든 등수별 랭킹 WebP 아이콘 임포트
import crownIcon from "@/assets/images/ranking/crown.webp";
import cupIcon from "@/assets/images/ranking/cup.webp";
import vipIcon from "@/assets/images/ranking/vip.webp";
import medalIcon from "@/assets/images/ranking/military-medal.webp";
import thumbsUpIcon from "@/assets/images/ranking/thumbs-up.webp";

// 랭킹별 아이콘 정적 맵 (매번 렌더링 시 함수 재할당 및 가비지 컬렉팅을 방지하는 정적 성능 최적화)
const RANK_ICON_MAP = {
  1: crownIcon,
  2: cupIcon,
  3: vipIcon,
} as const;

const getRankingIcon = (rankNum: number, isAuthenticated: boolean) => {
  if (!isAuthenticated || rankNum <= 0) return thumbsUpIcon; // 비로그인 / 무효 순위: 따봉 👍
  if (rankNum in RANK_ICON_MAP) {
    return RANK_ICON_MAP[rankNum as keyof typeof RANK_ICON_MAP];
  }
  if (rankNum < 100) return medalIcon; // 4위 ~ 99위: 엘리트 랭커 훈장 🏅
  return thumbsUpIcon; // 100위 이상: 성장 중인 투자자 응원 따봉 👍
};

interface MyRankingCardProps {
  isLink?: boolean; // 포트폴리오 메인 대시보드 연동용 호버/클릭 인터랙티브 활성화 여부
  initialData?: MyRankingUIModel; // 사전 로딩된 데이터 주입 옵션
}

export default function MyRankingCard({ isLink = false, initialData }: MyRankingCardProps) {
  const [data, setData] = useState<MyRankingUIModel | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;

    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await getMyRanking();
        if (isMounted) {
          if (response.success && response.data?.rankingInfo) {
            setData(mapToMyRankingUI(response.data.rankingInfo, true));
          } else {
            setData(mapToMyRankingUI(null, false));
          }
        }
      } catch {
        if (isMounted) {
          // 401 Unauthorized 또는 네트워크 오류 발생 시 비로그인 대응
          setData(mapToMyRankingUI(null, false));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [initialData]);

  // 로딩 스켈레톤 상태 렌더링
  if (loading) {
    return (
      <Card className="w-full border border-border/80 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 bg-muted animate-pulse rounded-md" />
            <div className="h-7 w-7 bg-muted animate-pulse rounded-full animate-bounce duration-1000" />
          </div>
          <div className="flex items-center w-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted animate-pulse rounded-full" />
              <div className="h-5 w-24 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="ml-auto h-8 w-20 bg-muted animate-pulse rounded-md" />
          </div>
          <div className="border-t border-border/40 my-1" />
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-48 bg-muted animate-pulse rounded-md" />
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { nickname, avatarUrl, rank, rankChange, message, isAuthenticated } = data;

  // 비로그인 유도 경로 대신 랭킹 메인 대시보드로 통일
  const cardHref = "/ranking";

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
            src={getRankingIcon(rank, isAuthenticated)}
            alt="Rank Icon"
            width={28}
            height={28}
            className="select-none shrink-0"
            unoptimized
          />
        </div>

        {/* 2. 중앙 프로필 및 순위 영역 */}
        <div className="flex items-center w-full">
          {/* 아바타 + 닉네임 */}
          <div className="flex items-center">
            <Avatar className="w-12 h-12 border border-border/60 shadow-sm shrink-0">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={nickname} /> : null}
              <AvatarFallback className="bg-muted text-foreground text-sm font-bold">
                {nickname && nickname !== "-" ? nickname[0] : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="font-bold text-foreground text-base ml-3 leading-none truncate max-w-[120px]">
              {nickname}
            </span>
          </div>

          {/* 우측 순위 + 상승 배지 */}
          <div className="flex items-center ml-auto shrink-0">
            <span className="text-2xl font-extrabold text-foreground tracking-tight leading-none">
              {isAuthenticated && rank > 0 ? `${rank.toLocaleString()}위` : "-"}
            </span>
            {isAuthenticated && rankChange > 0 && (
              <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-sm ml-2 flex items-center shrink-0 leading-none select-none">
                ▲ {rankChange}
              </span>
            )}
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
            {isAuthenticated && rank > 0 ? "활동 중" : "비활동"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  if (isLink) {
    return (
      <Link href={cardHref} className="block">
        {renderCardContent()}
      </Link>
    );
  }

  return renderCardContent();
}
